FROM node:22-alpine
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm config set store-dir /root/.pnpm-store && \
    pnpm install --frozen-lockfile --prefer-offline
COPY . .
