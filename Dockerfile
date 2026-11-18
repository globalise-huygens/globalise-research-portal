# Build
FROM node:26-alpine AS builder

RUN apk add --no-cache git

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN ENV="$HOME/.shrc" SHELL=/bin/sh npx --yes get-pnpm 11.25.0 \
    && command -v pnpm \
    && pnpm --version

WORKDIR /repos/globalise-research-portal

COPY . .

RUN pnpm install --frozen-lockfile

# Only build the app:
RUN pnpm build:app

# Ignore dev dependencies:
RUN pnpm deploy --filter @globalise/app --prod /app

# Run
FROM node:26-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactapp

# Keep build, dependencies and server:
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./

USER reactapp

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
