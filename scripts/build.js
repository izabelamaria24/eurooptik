import * as contentful from './contentful-service.js';
import fs from 'fs-extra'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const outputDir = path.join(projectRoot, '_site');
const localApiDir = path.join(projectRoot, 'api');

const locales = ['ro', 'en'];

async function processHtmlFile(filePath, langCode, relativePathPrefix) {
    let html = await fs.readFile(filePath, 'utf-8');
    
    html = html.replace(/<html lang="[^"]*">/, `<html lang="${langCode}">`);

    html = html.replace(/(href|src)="(assets|pages)\//g, `$1="${relativePathPrefix}$2/`);
    
    return html;
}

async function build() {
    try {
        console.log("Starting final portable multi-language build...");
        
        await fs.emptyDir(outputDir);
        await fs.emptyDir(localApiDir);
        console.log("Cleaned old build directories.");

        for (const locale of locales) {
            const langCode = locale.split('-')[0];
            console.log(`--- Building for locale: ${langCode} ---`);

            const langOutputDir = path.join(outputDir, langCode);
            const deployApiDir = path.join(langOutputDir, 'api');
            const localLangApiDir = path.join(localApiDir, langCode);

            await fs.mkdir(deployApiDir, { recursive: true });
            await fs.mkdir(localLangApiDir, { recursive: true });

            const [
                teamData, servicesData, testimonialsData, articlesData,
                pricingData, specializationsData, cercetariData
            ] = await Promise.all([
                contentful.fetchTeamFromContentful({ locale }),
                contentful.fetchServicesFromContentful({ locale }),
                contentful.fetchTestimonialsFromContentful({ locale }),
                contentful.fetchArticlesFromContentful({ locale }),
                contentful.fetchPricingData({ locale }),
                contentful.fetchSpecializationsData({ locale }),
                contentful.fetchCercetariFromContentful({ locale })
            ]);
            
            const apiFiles = { teamData, servicesData, testimonialsData, articlesData, pricingData, specializationsData, cercetariData };
            for (const [key, data] of Object.entries(apiFiles)) {
                const fileName = `${key.replace('Data', '')}.json`;
                await fs.writeJson(path.join(deployApiDir, fileName), data);
                await fs.writeJson(path.join(localLangApiDir, fileName), data);
            }
            console.log(`✅ API data written for ${langCode}.`);

            const mainHtmlPath = path.join(projectRoot, 'index.html');
            const processedIndexHtml = await processHtmlFile(mainHtmlPath, langCode, '../');
            await fs.writeFile(path.join(langOutputDir, 'index.html'), processedIndexHtml);
            
            const pagesDir = path.join(projectRoot, 'pages');
            if (fs.existsSync(pagesDir)) {
                const pageFiles = await fs.readdir(pagesDir);
                for (const file of pageFiles.filter(f => f.endsWith('.html'))) {
                    const destPageDir = path.join(langOutputDir, 'pages');
                    await fs.ensureDir(destPageDir);
                    const processedPageHtml = await processHtmlFile(path.join(pagesDir, file), langCode, '../../');
                    await fs.writeFile(path.join(destPageDir, file), processedPageHtml);
                }
            }
            console.log(`✅ HTML files processed for ${langCode}.`);
        }
        
        console.log("Copying shared static assets to _site root...");
        const assetsToCopy = ['assets', 'CNAME']; 
        await Promise.all(
            assetsToCopy.map(dir => fs.copy(path.join(projectRoot, dir), path.join(outputDir, dir), { filter: src => fs.existsSync(src) }))
        );
        console.log("✅ Shared assets copied.");

        console.log("Creating root redirect file...");
        const defaultLang = locales[0].split('-')[0];
        const redirectHTML = `<!DOCTYPE html><html><head><title>Redirecting...</title><meta http-equiv="refresh" content="0; url=${defaultLang}/" /></head><body></body></html>`;
        await fs.writeFile(path.join(outputDir, 'index.html'), redirectHTML.trim());
        
        console.log("\Build complete! The final, portable '_site' folder is ready for deployment.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        process.exit(1);
    }
}

build();