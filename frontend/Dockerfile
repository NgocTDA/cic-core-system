# syntax=docker/dockerfile:1
# Stage 1: Build the Next.js Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage Docker cache)
ARG GITHUB_TOKEN
RUN apk add --no-cache git openssh && \
    if [ -n "$GITHUB_TOKEN" ]; then \
      git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf "ssh://git@github.com/"; \
      git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf "https://github.com/"; \
    else \
      mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts; \
    fi
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the app with standalone output
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Pandoc static binary — dùng cho Confluence → Word (CIC template)
RUN wget -qO /tmp/pandoc.tar.gz https://github.com/jgm/pandoc/releases/download/3.10/pandoc-3.10-linux-amd64.tar.gz \
 && tar -xzf /tmp/pandoc.tar.gz -C /tmp \
 && mv /tmp/pandoc-3.10/bin/pandoc /usr/local/bin/pandoc \
 && rm -rf /tmp/pandoc.tar.gz /tmp/pandoc-3.10

# Copy essential files for standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Writable application data is separate from the read-only configuration mount.
RUN mkdir -p /app/data/registries && chown -R nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
