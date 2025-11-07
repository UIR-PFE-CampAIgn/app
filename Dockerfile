FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production

# Install system deps needed by Next.js (e.g. sharp/libvips)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl libc6 \
    && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM deps AS builder
WORKDIR /app

COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV HOST=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

EXPOSE 3000

CMD ["npm", "run", "start"]
