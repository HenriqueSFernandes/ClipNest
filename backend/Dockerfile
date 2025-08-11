FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY drizzle.config.ts .
# COPY public public

ENV NODE_ENV=production
CMD ["bun", "src/index.ts"]

EXPOSE 4000
