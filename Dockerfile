# Dockerfile
# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Expose the port that NestJS uses (default is 3000)
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
