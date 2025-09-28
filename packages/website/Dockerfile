FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest-10 --activate
COPY package.json ./
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm config set store-dir /root/.pnpm-store && \
    pnpm install --frozen-lockfile --prefer-offline
COPY . .

