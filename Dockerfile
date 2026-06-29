# Build
FROM node:24-alpine AS builder
RUN apk add --no-cache git
RUN corepack enable
WORKDIR /repos

RUN git clone --depth 1 https://github.com/globalise-huygens/globalise-design-system.git
RUN cd globalise-design-system && pnpm install --frozen-lockfile && pnpm build

WORKDIR /repos/globalise-research-portal
COPY . .
RUN npm ci
RUN npm run build

# Run
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactapp

RUN npm install -g sirv-cli

COPY --from=builder /repos/globalise-research-portal/packages/app/dist ./dist

USER reactapp

EXPOSE 3000
ENV PORT 3000

CMD ["sirv", "dist", "--port", "3000", "--host", "0.0.0.0", "--single"]