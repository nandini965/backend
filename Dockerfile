# Node Base Image
FROM node:12.2.0-alpine

# Working Directory
WORKDIR /node

# Copy the Code
COPY . .

# Install dependencies
RUN npm install

# OPTIONAL: Run tests if needed (you can comment this if not required)
# RUN npm run test

# Expose the backend service port (adjust if your app uses a different port)
EXPOSE 8000

# Copy init.sql to a specific directory inside the container (e.g., /docker-entrypoint-initdb.d)
RUN mkdir -p /db-init
COPY init.sql /db-init/init.sql

# Run the code
CMD ["node", "index.js"]
