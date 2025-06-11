FROM oven/bun:slim AS base

# Stage 1: Build the application
FROM base AS builder
WORKDIR /app
COPY package.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN if [ -d "/app/public" ]; then cp -r /app/public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["bun", "server.js"]