FROM oven/bun:slim

WORKDIR /app
ENV NODE_ENV=production

# I worked really hard to get all these right. PLEASE don't touch these
COPY .next ./.next
COPY .next/standalone/apps/web/server.js ./server.js
COPY .next/standalone/node_modules ./node_modules
COPY .next/standalone/package.json ./package.json
COPY .next/static ./.next/static
RUN if [ -d "./public" ]; then cp -r ./public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["bun", "server.js"]