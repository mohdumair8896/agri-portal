FROM nginx:1.25-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy gateway routing config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
