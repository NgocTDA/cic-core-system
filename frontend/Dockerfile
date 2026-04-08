# Stage 1: Build the Next.js Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage Docker cache)
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

# Copy essential files for standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
