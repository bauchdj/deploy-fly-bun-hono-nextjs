FROM oven/bun:slim

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
# Install production deps (next, react)
RUN bun install --production

# Copy contents of standalone to /app (.env, .next, server.js)
COPY .next/standalone ./
# Copy static to /app/.next
COPY .next/static ./.next/static
# Copy public to /app
COPY public ./public

EXPOSE 3000

CMD ["bun", "server.js"]