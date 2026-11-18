local prefix, action, id, token, account, pool = KEYS[1], ARGV[1], ARGV[2], ARGV[3], ARGV[4], ARGV[5]
local lease = prefix .. ':lease:' .. id
local active = prefix .. ':active:' .. account
local waiting = prefix .. ':waiting:' .. id
local index = prefix .. ':task-index'
local queue = prefix .. ':queue:' .. pool

local function release()
  if redis.call('HGET', lease, 'token') ~= token then return 0 end
  local ownerAccount = redis.call('HGET', lease, 'account')
  redis.call('SREM', prefix .. ':active:' .. ownerAccount, id)
  redis.call('DEL', lease)
  redis.call('HDEL', index, id)
  return 1
end

local function removeWaiting()
  local ownerPool = redis.call('HGET', waiting, 'pool')
  if ownerPool then redis.call('ZREM', prefix .. ':queue:' .. ownerPool, id) end
  redis.call('DEL', waiting)
end

if action == 'release' then return {release()} end
if action == 'cancel' then
  if redis.call('HGET', waiting, 'token') == token then removeWaiting() end
  return {release()}
end
if action == 'verify' then
  if redis.call('EXISTS', prefix .. ':ready') == 1 and redis.call('HGET', lease, 'token') == token and redis.call('SISMEMBER', active, id) == 1 then return {1} end
  return {0}
end
if action == 'adopt' then
  local previous = redis.call('HGET', lease, 'account')
  if previous and previous ~= account then redis.call('SREM', prefix .. ':active:' .. previous, id) end
  removeWaiting()
  redis.call('SADD', active, id)
  redis.call('HSET', lease, 'token', token, 'account', account)
  redis.call('HSET', index, id, token)
  return {1}
end

-- Only abandoned waiters expire. Accepted remote tasks require a terminal
-- receipt before their account slot can be released.
while true do
  local first = redis.call('ZRANGE', queue, 0, 0)
  if #first == 0 or redis.call('EXISTS', prefix .. ':waiting:' .. first[1]) == 1 then break end
  redis.call('ZREM', queue, first[1])
end
if redis.call('EXISTS', prefix .. ':ready') == 0 then return {0, 0} end
if redis.call('EXISTS', lease) == 1 then
  if redis.call('HGET', lease, 'token') == token then return {1, tonumber(redis.call('HGET', lease, 'account'))} end
  return {0, 0}
end
local owner = redis.call('HGET', waiting, 'token')
if owner and owner ~= token then return {0, 0} end
if not redis.call('ZSCORE', queue, id) then
  redis.call('ZADD', queue, redis.call('INCR', prefix .. ':sequence'), id)
end
redis.call('HSET', waiting, 'token', token, 'pool', pool)
redis.call('PEXPIRE', waiting, 45000)
local position = redis.call('ZRANK', queue, id) + 1
if position > 1 then return {0, position} end

-- Choose and reserve atomically across pools. Lower utilization wins; equal
-- loads rotate by last admission, including tasks that finish immediately.
local chosen, bestLoad, oldest
for i = 6, #ARGV, 2 do
  local candidate, limit = ARGV[i], tonumber(ARGV[i + 1])
  local count = redis.call('SCARD', prefix .. ':active:' .. candidate)
  if limit == 0 or count < limit then
    local load = limit > 0 and count / limit or count
    local used = tonumber(redis.call('HGET', prefix .. ':last-used', candidate) or '0')
    if not chosen or load < bestLoad or (load == bestLoad and used < oldest) then
      chosen, bestLoad, oldest = candidate, load, used
    end
  end
end
if not chosen then return {0, position} end
removeWaiting()
redis.call('SADD', prefix .. ':active:' .. chosen, id)
redis.call('HSET', lease, 'token', token, 'account', chosen)
redis.call('HSET', index, id, token)
redis.call('HSET', prefix .. ':last-used', chosen, redis.call('INCR', prefix .. ':sequence'))
return {1, tonumber(chosen)}
