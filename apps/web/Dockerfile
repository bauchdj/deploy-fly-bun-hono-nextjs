FROM oven/bun:slim

WORKDIR /app
ENV NODE_ENV=production

# Copy contents of standalone to (app/web{.env, .next, server.js}, node_modules, package.json)
COPY .next/standalone ./

# Remove .env from .next/apps/web/.env if it exists
RUN if [ -f .next/apps/web/.env ]; then rm .next/apps/web/.env; fi

# Copy static to /app/.next
COPY .next/static ./apps/web/.next/static

# Copy public to /app
COPY public ./apps/web/public

EXPOSE 3000

# Based on apps/web workspace path from root package.json
CMD ["bun", "apps/web/server.js"]