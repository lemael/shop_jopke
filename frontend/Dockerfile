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

# Set environment variable for the API URL
ARG NEXT_PUBLIC_API_URL

# Set the environment variable in the container
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# Build the application for production
RUN npm run build



# Use the standalone Next.js output for a small production image
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["sh", "-c", "node server.js"]