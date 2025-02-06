# Use an official Node.js runtime as base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the backend code
COPY . .

# Expose the backend port (e.g., 5000)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]