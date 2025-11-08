# --- Base for runtime only (small, no build tools)
FROM node:20-bookworm-slim AS base
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl libc6 \
  && rm -rf /var/lib/apt/lists/*

# --- Deps stage: install node_modules WITH devDeps + build toolchain
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Tools for native modules (sharp, node-gyp, etc.) and git for some installs
RUN apt-get update \
  && apt-get install -y --no-install-recommends git python3 make g++ pkg-config \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --include=dev --no-audit --no-fund

# --- Build app
FROM deps AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production runner
FROM base AS runner
WORKDIR /app
ENV HOST=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Only what we need to run
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
# Copy configs if your start script needs them
COPY --from=builder /app/next.config.* ./ 
COPY --from=builder /app/tailwind.config.* ./
COPY --from=builder /app/postcss.config.* ./

EXPOSE 3000
CMD ["npm","run","start"]
