import * as contentful from './contentful-service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'api');

async function build() {
    try {
        console.log("🚀 Starting content fetch...");

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log("Fetching all data from Contentful...");
        const [
            teamData,
            servicesData,
            testimonialsData,
            articlesData,
            pricingData,
            specializationsData,
            cercetariData
        ] = await Promise.all([
            contentful.fetchTeamFromContentful(),
            contentful.fetchServicesFromContentful(),
            contentful.fetchTestimonialsFromContentful(),
            contentful.fetchArticlesFromContentful(),
            contentful.fetchPricingData(),
            contentful.fetchSpecializationsData(),
            contentful.fetchCercetariFromContentful()
        ]);
        console.log("✅ All data fetched successfully.");

        console.log("Writing data to /api folder...");
        fs.writeFileSync(path.join(outputDir, 'team.json'), JSON.stringify(teamData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'services.json'), JSON.stringify(servicesData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'testimonials.json'), JSON.stringify(testimonialsData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'articles.json'), JSON.stringify(articlesData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'pricing.json'), JSON.stringify(pricingData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'specializations.json'), JSON.stringify(specializationsData, null, 2));
        fs.writeFileSync(path.join(outputDir, 'cercetari.json'), JSON.stringify(cercetariData, null, 2));
        
        console.log("\n✨ Build complete! All files in /api are updated.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        console.error('No files were written. The /api folder remains unchanged from the last successful build.');
        
        process.exit(1); 
    }
}

build();