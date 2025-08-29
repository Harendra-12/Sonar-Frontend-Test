# ---- Stage 1: Build React App -----
FROM node:20-alpine AS build

WORKDIR /app

# Set Node memory limit (prevents OOM)
ENV NODE_OPTIONS="--max-old-space-size=2560"

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies (ensure compatibility)
RUN npm install --legacy-peer-deps  @emotion/react @emotion/styled --save \
    && npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copy all project files
COPY . .

# Disable source maps for smaller, faster build
ENV GENERATE_SOURCEMAP=false

# Build production-ready static files
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from stage 1 (CRA outputs to build/, not dist/)
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
