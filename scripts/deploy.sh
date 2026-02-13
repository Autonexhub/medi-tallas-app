#!/bin/bash

# Medi Tallas App - Deployment Script
# Deploys to Hostinger: medi.autonexhub.es

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SSH_USER="u353044586"
SSH_HOST="178.16.128.17"
SSH_PORT="65002"
REMOTE_PATH="/home/u353044586/domains/medi.autonexhub.es/public_html"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Medi Tallas App - Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Step 1: Pre-deployment checks
echo -e "\n${YELLOW}[1/5] Running pre-deployment checks...${NC}"

# Test SSH connection
echo "Testing SSH connection..."
if ! ssh -p "$SSH_PORT" -o ConnectTimeout=10 "$SSH_USER@$SSH_HOST" "echo 'SSH connection successful'" > /dev/null 2>&1; then
    echo -e "${RED}Error: SSH connection failed${NC}"
    exit 1
fi

# Test write permissions on remote server
echo "Testing write permissions..."
if ! ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "test -w $REMOTE_PATH" > /dev/null 2>&1; then
    echo -e "${RED}Error: No write permission to $REMOTE_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}Pre-deployment checks passed!${NC}"

# Step 2: Build frontend
echo -e "\n${YELLOW}[2/5] Building frontend...${NC}"

# Check if bun is available, otherwise use npm
if command -v bun &> /dev/null; then
    echo "Using bun..."
    bun install || { echo -e "${RED}Error: bun install failed${NC}"; exit 1; }
    bun run build || { echo -e "${RED}Error: bun run build failed${NC}"; exit 1; }
else
    echo "Using npm..."
    npm install || { echo -e "${RED}Error: npm install failed${NC}"; exit 1; }
    npm run build || { echo -e "${RED}Error: npm run build failed${NC}"; exit 1; }
fi

# Verify build output
echo "Verifying build output..."
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${RED}Error: Build failed - dist directory is empty or missing${NC}"
    exit 1
fi

# Step 3: Prepare deployment directory
echo -e "\n${YELLOW}[3/5] Preparing deployment package...${NC}"
rm -rf deploy
mkdir -p deploy

# Copy build output
echo "Copying build files..."
cp -r dist/* deploy/

# Generate robots.txt (disallow indexing)
echo "Generating robots.txt..."
cat > deploy/robots.txt << 'EOF'
User-agent: *
Disallow: /
EOF

# Generate .htaccess for SPA routing
echo "Generating .htaccess..."
cat > deploy/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Handle www to non-www redirect
    RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
    RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    # Rewrite everything else to index.html for SPA routing
    RewriteRule ^ index.html [L]
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

# Step 4: Deploy files
echo -e "\n${YELLOW}[4/5] Deploying to server...${NC}"

# Verify deployment package is not empty
if [ -z "$(ls -A deploy 2>/dev/null)" ]; then
    echo -e "${RED}Error: Deploy directory is empty - cannot deploy${NC}"
    exit 1
fi

rsync -avz --delete \
      -e "ssh -p \"$SSH_PORT\"" \
      deploy/ \
      "$SSH_USER@$SSH_HOST:$REMOTE_PATH/"

# Set permissions
echo "Setting permissions..."
ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" << ENDSSH
    cd $REMOTE_PATH
    find . -type d -exec chmod 755 {} \;
    find . -type f -exec chmod 644 {} \;
ENDSSH

# Step 5: Verify deployment
echo -e "\n${YELLOW}[5/5] Verifying deployment...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://medi.autonexhub.es)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "URL: ${GREEN}https://medi.autonexhub.es${NC}"
else
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}Deployment completed (HTTP status: $HTTP_STATUS)${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo -e "URL: ${GREEN}https://medi.autonexhub.es${NC}"
    echo -e "${YELLOW}Note: Site may take a moment to become available${NC}"
fi
