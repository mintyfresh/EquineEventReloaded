ARG NODE_VERSION=17.2.0

# Dependencies step
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm clean-install

# Build step
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG COUCHDB_HOST
ARG COUCHDB_PORT
ARG PAIRING_HOST
ARG PAIRING_PORT

ENV NEXT_TELEMETRY_DISABLED 1
RUN NEXT_PUBLIC_COUCHDB_HOST=$COUCHDB_HOST NEXT_PUBLIC_COUCHDB_PORT=$COUCHDB_PORT \
    NEXT_PUBLIC_PAIRING_HOST=$PAIRING_HOST NEXT_PUBLIC_PAIRING_PORT=$PAIRING_PORT \
    npm run build

# Application runner
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app ./

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]

LABEL maintainer="Minty Fresh"
