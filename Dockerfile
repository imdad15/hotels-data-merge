FROM node:20-alpine

# Create app directory
WORKDIR /workspace

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev"]
