import * as contentful from './contentful-service.js';
import fs from 'fs-extra'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, '_site');
const apiDir = path.join(outputDir, 'api');

async function build() {
    try {
        console.log("🚀 Starting build process...");
        console.log("Cleaning old build directory...");
        await fs.emptyDir(outputDir);
        await fs.mkdir(apiDir, { recursive: true });

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

        console.log("Writing data to /_site/api folder...");
        await Promise.all([
            fs.writeJson(path.join(apiDir, 'team.json'), teamData),
            fs.writeJson(path.join(apiDir, 'services.json'), servicesData),
            fs.writeJson(path.join(apiDir, 'testimonials.json'), testimonialsData),
            fs.writeJson(path.join(apiDir, 'articles.json'), articlesData),
            fs.writeJson(path.join(apiDir, 'pricing.json'), pricingData),
            fs.writeJson(path.join(apiDir, 'specializations.json'), specializationsData),
            fs.writeJson(path.join(apiDir, 'cercetari.json'), cercetariData)
        ]);
        console.log("✅ API data written successfully.");

        console.log("Copying static files to _site...");
        const filesToCopy = [
            'assets',
            'pages',
            'index.html',
            'CNAME' 
        ];
        
        await Promise.all(
            filesToCopy.map(fileOrDir => {
                const sourcePath = path.join(projectRoot, fileOrDir);
                const destPath = path.join(outputDir, fileOrDir);
                if (fs.existsSync(sourcePath)) {
                    return fs.copy(sourcePath, destPath);
                }
            })
        );
        console.log("✅ Static files copied.");
        
        console.log("\n✨ Build complete! The '_site' folder is ready for deployment.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        process.exit(1);
    }
}

build();