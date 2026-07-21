# Body Feishu Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Body 登录页接通可配置的飞书 OAuth 登录，并复用现有用户凭据、注册权益与令牌链路。

**Architecture:** Body 三方账号保存 OAuth App ID 和服务端密文，公开配置只暴露 App ID 与可用状态。用户包负责飞书授权码换取身份及外部凭据登录，Body 仅编排账号配置与用户认证；前端负责发起授权、校验一次性 state、提交授权码并写入现有登录态。

**Tech Stack:** Go、Dever ORM/Page JSON、React/TypeScript、飞书 Web OAuth。

---

### Task 1: 三方账号配置

**Files:**
- Modify: `model/body/account.go`
- Create: `service/body/account_hook.go`
- Modify: `front/page/admin/body/account/update.json`
- Modify: `service/body/config.go`

- [x] 增加 `app_id`、`app_secret_encrypted` 字段，并将密文标记为隐藏字段。
- [x] 增加保存钩子，规范化账号数据、校验飞书配置、加密新密钥并在编辑留空时保留旧密钥。
- [x] 后台表单增加飞书 App ID 与 App Secret；提交只传虚拟明文 `app_secret`，保存钩子删除明文。
- [x] 登录公开配置只返回 `app_id` 和 `configured`，不返回密文。

### Task 2: 外部身份认证

**Files:**
- Modify: `../user/model/credential.go`
- Modify: `../user/model/options.go`
- Create: `../user/service/external_auth.go`
- Create: `../user/service/feishu.go`

- [x] 增加 `feishu` 凭据类型，不新增平行身份表。
- [x] 增加通用外部凭据登录：已有凭据直接签发登录态；首次登录在事务内创建用户、凭据并发放注册权益。
- [x] 增加带超时和响应体上限的飞书授权码换取身份客户端，错误中不输出 App Secret 或访问令牌。

### Task 3: Body 登录接口

**Files:**
- Create: `service/body/feishu.go`
- Modify: `api/body/login.go`
- Modify: `dever.json`

- [x] 按启用的三方账号 ID 加载 App ID 和密文，服务端解密后换取飞书身份。
- [x] 调用用户包通用外部登录并返回与密码登录一致的载荷。
- [x] 新增公开 `POST login/feishu`，API 只负责解析与返回。

### Task 4: 登录页授权回调

**Files:**
- Create: `front/src/nodes/body-work/auth/feishu-auth.ts`
- Modify: `front/src/nodes/body-work/auth/site-config.ts`
- Modify: `front/src/nodes/body-work/auth/login-page.tsx`

- [x] 增加飞书授权 URL、一次性 state 和回调上下文的 sessionStorage 管理。
- [x] 三方账号按钮按公开配置发起授权；未配置时明确提示。
- [x] 回调校验 state、清理 URL、提交授权码，并复用密码登录的登录态写入和跳转函数。

### Task 5: 静态核对

**Files:**
- Review: all files above

- [x] 对 Go 文件执行 `gofmt`，对改动做格式与差异检查。
- [x] 校验 JSON 可解析、TypeScript 导入导出一致、密文未出现在公开载荷。
- [x] 按用户要求不运行 `npm run build` 或任何测试命令。
