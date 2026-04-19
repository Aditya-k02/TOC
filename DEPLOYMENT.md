# Deployment Guide

This guide covers deploying the TOC Visualizer to various platforms.

## Pre-Deployment Checklist

- ✅ All dependencies installed (`npm install`)
- ✅ Build succeeds without errors (`npm run build`)
- ✅ Production build optimized for chunk splitting
- ✅ Console logs removed in production
- ✅ Git repository initialized (`git init`, `git branch -M main`)
- ✅ `.gitignore` configured

## Build Output

The production build is optimized with:
- **Code splitting**: React, Cytoscape libraries in separate chunks
- **Minification**: Terser compression enabled
- **Source maps**: Disabled for production
- **Console**: Debug logs removed

**Output size**:
- CSS: ~9.5 KB (2.6 KB gzipped)
- JS: ~692 KB (224 KB gzipped)
- Total: < 300 KB gzipped

## Deployment Options

### 1. **Vercel** (Recommended for Vite + React)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Or connect your Git repo to Vercel dashboard at https://vercel.com

### 2. **Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Or drag & drop the `dist/` folder to https://app.netlify.com/drop

### 3. **GitHub Pages**

Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/toc-visualizer",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Install gh-pages:
```bash
npm install -D gh-pages
npm run deploy
```

### 4. **Traditional Server (Apache, Nginx, etc.)**

1. Build the project: `npm run build`
2. Copy the entire `dist/` folder to your web server
3. Configure SPA fallback: all routes should serve `index.html`

**Nginx Configuration Example**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/toc-visualizer;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache Configuration Example** (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} -f [OR]
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /index.html [L]
</IfModule>
```

### 5. **Docker**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

Build and run:
```bash
docker build -t toc-visualizer .
docker run -p 80:80 toc-visualizer
```

### 6. **AWS S3 + CloudFront**

1. Build project: `npm run build`
2. Upload `dist/` to S3 bucket
3. Create CloudFront distribution pointing to S3
4. Configure S3 bucket for static website hosting
5. Set default root object to `index.html`
6. Configure error pages: 404 → `index.html`

### 7. **Azure Static Web Apps**

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Build and deploy
npm run build
azure staticwebapp publish dist
```

Or use GitHub Actions (automatic with Azure portal setup).

## Performance Optimization

The build is already optimized with:

- **Code Splitting**: Cytoscape and React in separate chunks
- **Tree Shaking**: Unused code removed
- **Minification**: All production code minified
- **Gzip**: Enable gzip compression on server
- **Caching**: Long-term cache headers for assets

To further optimize:

```bash
# Check bundle size
npm run build -- --report

# Analyze bundle
npm install -D rollup-plugin-visualizer
```

## Environment Variables

Currently, this project doesn't use environment variables. If you need to add them:

1. Create `.env.production`:
```
VITE_API_URL=https://your-api.com
```

2. Use in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. Build will inject values at compile time.

## Monitoring & Analytics

Add Google Analytics or similar:

1. Get tracking ID
2. Install: `npm install react-ga4`
3. Add to `main.jsx`:
```javascript
import ReactGA from 'react-ga4';
ReactGA.initialize('G-XXXXXXXXXX');
```

## SSL Certificate

For HTTPS deployment:
- **Vercel/Netlify**: Automatic SSL included
- **Traditional Server**: Use Let's Encrypt (free)
  ```bash
  sudo certbot certonly --webroot -w /var/www/html -d your-domain.com
  ```
- **Docker**: Mount SSL certs or use reverse proxy

## Testing Before Deploy

```bash
# Local production preview
npm run preview

# Visit http://localhost:4173
# Test regex patterns and visualizations
```

## Troubleshooting

**Blank Page After Deploy?**
- Check browser console for errors
- Verify SPA routing fallback is configured
- Ensure all files uploaded correctly

**CSS Not Loading?**
- Check asset paths in `dist/index.html`
- Verify MIME types on server
- Enable gzip compression

**Large Bundle Size?**
- Already optimized with code splitting
- Cytoscape.js is large (~224 KB gzipped) but necessary

## Post-Deployment

1. Test all features on live site
2. Verify routing works (try direct URLs)
3. Check console for errors
4. Monitor performance metrics
5. Set up error tracking (Sentry, LogRocket, etc.)

## Rollback

If issues occur:
- **Vercel/Netlify**: One-click rollback in dashboard
- **GitHub Pages**: Roll back Git commit and redeploy
- **Traditional**: Keep backup of previous dist/ folder

## Support & Maintenance

- **Bug Reports**: Monitor browser console
- **Performance**: Monitor Core Web Vitals
- **Updates**: Keep dependencies updated (`npm audit`, `npm update`)
- **Security**: Check npm advisory (`npm audit fix`)

---

For questions or issues, refer to the main README.md or check the project's GitHub repository.
