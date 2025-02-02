FROM node:lts-alpine

# Install global dependencies
RUN npm install -g nodemon jest

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm install --force && \
    npm install --save-dev jest socket.io-client

# Copy the rest of the application
COPY . .

EXPOSE 4000

# Add test command
# CMD ["npm", "run", "dev"]
