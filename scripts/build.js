import * as contentful from './contentful-service.js';
import fs from 'fs-extra'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, '_site');
const deployApiDir = path.join(outputDir, 'api'); 

const localApiDir = path.join(projectRoot, 'api');

async function build() {
    try {
        console.log("🚀 Starting build process...");
        console.log("Cleaning old build directory and ensuring API folders exist...");
        await fs.emptyDir(outputDir);
        await fs.mkdir(deployApiDir, { recursive: true });
        await fs.mkdir(localApiDir, { recursive: true });

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

        console.log("Writing data to /_site/api (for deployment) and /api (for local dev)...");
        await Promise.all([
            fs.writeJson(path.join(deployApiDir, 'team.json'), teamData),
            fs.writeJson(path.join(deployApiDir, 'services.json'), servicesData),
            fs.writeJson(path.join(deployApiDir, 'testimonials.json'), testimonialsData),
            fs.writeJson(path.join(deployApiDir, 'articles.json'), articlesData),
            fs.writeJson(path.join(deployApiDir, 'pricing.json'), pricingData),
            fs.writeJson(path.join(deployApiDir, 'specializations.json'), specializationsData),
            fs.writeJson(path.join(deployApiDir, 'cercetari.json'), cercetariData),

            fs.writeJson(path.join(localApiDir, 'team.json'), teamData),
            fs.writeJson(path.join(localApiDir, 'services.json'), servicesData),
            fs.writeJson(path.join(localApiDir, 'testimonials.json'), testimonialsData),
            fs.writeJson(path.join(localApiDir, 'articles.json'), articlesData),
            fs.writeJson(path.join(localApiDir, 'pricing.json'), pricingData),
            fs.writeJson(path.join(localApiDir, 'specializations.json'), specializationsData),
            fs.writeJson(path.join(localApiDir, 'cercetari.json'), cercetariData)
        ]);
        console.log("✅ API data written successfully to both locations.");

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
        
        console.log("\n✨ Build complete! The '_site' folder is ready for deployment and the '/api' folder is updated for local testing.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        process.exit(1);
    }
}

build();