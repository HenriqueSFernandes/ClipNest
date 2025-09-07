FROM oven/bun

RUN apt update && apt install -y curl

WORKDIR /app

COPY package.json .
COPY bun.lock .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY drizzle.config.ts .
# COPY public public
COPY update-github-status.sh .
RUN chmod +x update-github-status.sh

ENV NODE_ENV=production
CMD ["bun", "src/index.ts"]

EXPOSE 4000
