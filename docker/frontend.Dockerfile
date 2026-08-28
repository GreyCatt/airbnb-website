FROM node:22-alpine AS development

RUN npm install --global live-server@1.2.2

WORKDIR /app
COPY frontend/index.html frontend/guide.html frontend/styles.css frontend/script.js ./

EXPOSE 80

CMD ["live-server", ".", "--host=0.0.0.0", "--port=80", "--no-browser", "--watch=index.html,guide.html,styles.css,script.js"]

FROM nginx:1.27-alpine AS production

COPY --from=development /app/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1
