# Use an official Node.js runtime as a parent image
FROM node:22-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the application code into the container
COPY . .


# Build the application for production
RUN npm run build



# Use a smaller image for the final build
FROM nginx:alpine


# Copy the built application from the builder stage to the Nginx HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html


# Expose port 80 to the outside world
EXPOSE 80


# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]