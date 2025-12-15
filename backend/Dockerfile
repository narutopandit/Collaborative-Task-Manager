# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files from backend directory (since build context is repo root)
COPY backend/package*.json ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm install

# Copy source code from backend directory
COPY backend/ .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/src/index.js"]
