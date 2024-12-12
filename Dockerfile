# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy built assets
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/app.js ./
COPY --from=builder /usr/src/app/src ./src

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV API_BASE_URL=http://52.86.181.195:8080

# Security: non-root user
USER node

# Port
EXPOSE 3000

# Start app
CMD ["node", "app.js"]