# Node Base Image
FROM node:12.2.0-alpine

# Working Directory
WORKDIR /node

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies (including mysql2)
RUN npm install

# Copy the rest of the application files
COPY . .

# Create a directory for init.sql
RUN mkdir -p /db-init
COPY init.sql /db-init/init.sql

# Expose Port
EXPOSE 8000

# Run the application
CMD ["node", "index.js"]
