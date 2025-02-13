# Use node image
FROM node:12.2.0-alpine

# Set working directory inside the container
WORKDIR /node

# Copy package.json and package-lock.json first (Leverage Docker cache)
COPY package*.json ./

# Install dependencies (including mysql2)
RUN npm install mysql2 && npm install

# Copy application files into the container
COPY . .

# Create directory for database init script
RUN mkdir -p /db-init

# Copy init.sql into the container
COPY init.sql /db-init/init.sql

# Expose the correct backend port (8080)
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
