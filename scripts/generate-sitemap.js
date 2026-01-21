
const fs = require('fs');
const path = require('path');

// Base URL website
const BASE_URL = 'https://pembuatanpolygon.site';

// Load SEO Data (Simulated import require adjustment for ES module / JSON)
// Since seo_keywords.js is ES module, we will define core data here specific for sitemap to avoid module complexity in simple script
const STATIC_ROUTES = [
    '',
    '/dashboard',
    '/payment',
    '/kelola',
    '/login',
    '/register'
];

// Target file path
const SITEMAP_PATH = path.join(__dirname, '../client/public/sitemap.xml');

const generateSitemap = async () => {
    // 1. Static Routes
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    STATIC_ROUTES.forEach(route => {
        xml += `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // 2. We can add placeholder for dynamic blog posts if needed, 
    // but ideally this script runs during build and fetches real data.
    // For now let's stick to core structure + instructions

    xml += `</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`✅ Sitemap generated at ${SITEMAP_PATH}`);
};

generateSitemap();
