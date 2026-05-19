// Environment — Production (Docker: API gateway is same origin via NGINX)
export const environment = {
  production: true,
  apiGateway: '',   // Empty = same-origin (NGINX proxies /api/* from the UI container)
};
