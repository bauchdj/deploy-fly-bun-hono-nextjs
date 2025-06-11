FROM oven/bun:slim

WORKDIR /app
ENV NODE_ENV=production
COPY .next/standalone ./
COPY .next/static ./.next/static
RUN if [ -d "./public" ]; then cp -r ./public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]