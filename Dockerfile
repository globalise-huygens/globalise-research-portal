# Build
FROM node:24-alpine AS builder

RUN apk add --no-cache git

RUN npm install --global pnpm@11.25.0 \
    && command -v pnpm \
    && pnpm --version

WORKDIR /repos/globalise-research-portal

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

# Run
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactapp

COPY --from=builder /repos/globalise-research-portal/node_modules ./node_modules
COPY --from=builder /repos/globalise-research-portal/packages ./packages
COPY --from=builder /repos/globalise-research-portal/package.json ./package.json

USER reactapp

EXPOSE 3000
ENV PORT=3000

CMD ["node", "packages/app/server.js"]
