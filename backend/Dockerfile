FROM node:18-slim

# Create app directory
WORKDIR /app


# Install dependencies first (caching layer)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the app (không dùng nodemon trong production)
CMD ["node", "server.js"]