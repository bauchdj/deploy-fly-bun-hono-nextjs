FROM oven/bun:slim

WORKDIR /app

COPY dist/index.js .
COPY health-check.js .

EXPOSE 3000

CMD ["bun", "index.js"]
