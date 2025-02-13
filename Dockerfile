FROM node:12.2.0-alpine

WORKDIR /node

COPY package*.json ./

# Install dependencies (including mysql2)
RUN npm install express mysql2 && npm install

COPY . .

RUN mkdir -p /db-init
COPY init.sql /db-init/init.sql

EXPOSE 8080

CMD ["node", "index.js"]

