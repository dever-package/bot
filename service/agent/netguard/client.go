package netguard

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var (
	externalDialer = &net.Dialer{
		Timeout:   10 * time.Second,
		KeepAlive: 30 * time.Second,
	}
	externalTransport = newTransport()
)

func ValidateURL(ctx context.Context, parsed *url.URL) error {
	if parsed == nil {
		return fmt.Errorf("外部请求地址不能为空")
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return fmt.Errorf("外部请求只允许 http/https")
	}
	host := strings.TrimSpace(parsed.Hostname())
	if host == "" {
		return fmt.Errorf("外部请求地址缺少主机")
	}
	_, err := resolveIPs(ctx, host)
	return err
}

func NewClient(timeout time.Duration) *http.Client {
	if timeout <= 0 {
		timeout = 60 * time.Second
	}
	return &http.Client{
		Timeout:   timeout,
		Transport: externalTransport,
		CheckRedirect: func(request *http.Request, previous []*http.Request) error {
			if len(previous) >= 3 {
				return fmt.Errorf("外部请求跳转次数超过限制")
			}
			return ValidateURL(request.Context(), request.URL)
		},
	}
}

func newTransport() *http.Transport {
	transport, ok := http.DefaultTransport.(*http.Transport)
	if ok {
		cloned := transport.Clone()
		cloned.Proxy = nil
		cloned.DialContext = dialAddress
		cloned.TLSHandshakeTimeout = 10 * time.Second
		cloned.ResponseHeaderTimeout = 30 * time.Second
		cloned.ExpectContinueTimeout = time.Second
		return cloned
	}
	return &http.Transport{
		Proxy:                 nil,
		DialContext:           dialAddress,
		TLSHandshakeTimeout:   10 * time.Second,
		ResponseHeaderTimeout: 30 * time.Second,
		ExpectContinueTimeout: time.Second,
	}
}

func dialAddress(ctx context.Context, network string, address string) (net.Conn, error) {
	host, port, err := net.SplitHostPort(address)
	if err != nil {
		return nil, fmt.Errorf("外部请求地址无效")
	}
	ips, err := resolveIPs(ctx, host)
	if err != nil {
		return nil, err
	}
	var lastErr error
	for _, ip := range ips {
		connection, dialErr := externalDialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
		if dialErr == nil {
			return connection, nil
		}
		lastErr = dialErr
	}
	if lastErr != nil {
		return nil, lastErr
	}
	return nil, fmt.Errorf("外部请求主机没有可用地址: %s", host)
}

func resolveIPs(ctx context.Context, host string) ([]net.IP, error) {
	if ctx == nil {
		ctx = context.Background()
	}
	host = strings.Trim(strings.ToLower(strings.TrimSpace(host)), ".")
	if host == "" || host == "localhost" || host == "localhost.localdomain" {
		return nil, fmt.Errorf("外部请求拒绝访问内网或本机地址: %s", host)
	}
	if ip := net.ParseIP(host); ip != nil {
		if unsafeIP(ip) {
			return nil, fmt.Errorf("外部请求拒绝访问内网或本机地址: %s", host)
		}
		return []net.IP{ip}, nil
	}
	lookupCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	addresses, err := net.DefaultResolver.LookupIPAddr(lookupCtx, host)
	if err != nil {
		return nil, fmt.Errorf("解析外部请求主机失败: %s", err.Error())
	}
	ips := make([]net.IP, 0, len(addresses))
	for _, address := range addresses {
		if unsafeIP(address.IP) {
			return nil, fmt.Errorf("外部请求拒绝访问内网或本机地址: %s", host)
		}
		ips = append(ips, address.IP)
	}
	if len(ips) == 0 {
		return nil, fmt.Errorf("外部请求主机没有可用地址: %s", host)
	}
	return ips, nil
}

func unsafeIP(ip net.IP) bool {
	return ip == nil ||
		ip.IsLoopback() ||
		ip.IsPrivate() ||
		ip.IsLinkLocalUnicast() ||
		ip.IsLinkLocalMulticast() ||
		ip.IsUnspecified() ||
		ip.IsMulticast()
}
