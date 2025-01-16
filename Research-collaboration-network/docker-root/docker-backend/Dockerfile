# Use Node.js as the base image
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++ git postgresql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild bcrypt
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Create upload directories
RUN mkdir -p uploads/projects uploads/profiles uploads/papers uploads/datasets

# Set permissions for upload directories
RUN chmod -R 777 uploads

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]
