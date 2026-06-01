# Dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/app/package.json ./packages/app/package.json
COPY packages/common/package.json ./packages/common/package.json
COPY packages/design/package.json ./packages/design/package.json
COPY packages/diplomatic/package.json ./packages/diplomatic/package.json
COPY packages/document/package.json ./packages/document/package.json
COPY packages/facsimile/package.json ./packages/facsimile/package.json
COPY packages/line-by-line/package.json ./packages/line-by-line/package.json
COPY packages/search/package.json ./packages/search/package.json
RUN npm ci

# Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Run
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactapp

RUN npm install -g sirv-cli

COPY --from=builder /app/packages/app/dist ./dist 

USER reactapp

EXPOSE 3000
ENV PORT=3000

# CMD ["npm", "run", "start"]
CMD ["sirv", "dist", "--port", "3000", "--host", "0.0.0.0", "--single"]
