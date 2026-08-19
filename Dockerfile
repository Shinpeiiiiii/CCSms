# ---- Base stage: shared setup ----
FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./

# ---- Development stage ----
FROM base AS development

# Install ALL dependencies, including devDependencies (nodemon, etc.)
RUN npm ci

COPY . .

ENV NODE_ENV=development
EXPOSE 5000

CMD ["npx", "nodemon", "server.js"]

# ---- Build stage (used only to produce prod deps) ----
FROM base AS builder

# Install production-only dependencies
RUN npm ci --omit=dev

COPY . .

# ---- Production stage ----
FROM node:20-slim AS production

WORKDIR /app

# Run as non-root user (security best practice)
RUN addgroup --gid 1001 nodejs && adduser --uid 1001 --gid 1001 --system nodeuser

COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodeuser:nodejs /app .

USER nodeuser

ENV NODE_ENV=production
EXPOSE 5000

# Basic healthcheck (adjust the path if you don't have a /api/health route)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["npm", "run", "dev"]