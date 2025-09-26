FROM node:20-alpine AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm config set store-dir /root/.pnpm-store && \
    pnpm install --frozen-lockfile --prefer-offline
FROM deps AS build

COPY . .

RUN pnpm build

EXPOSE 3000
EXPOSE 3001

CMD ["pnpm", "run", "dev"]