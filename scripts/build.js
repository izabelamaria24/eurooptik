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

async function build() {
    try {
        console.log("Starting clean multi-language build...");
        await fs.emptyDir(outputDir);
        await fs.emptyDir(localApiDir);

        const mainHtmlPath = path.join(projectRoot, 'index.html');
        if (!fs.existsSync(mainHtmlPath)) throw new Error('Main index.html not found!');
        const htmlTemplate = await fs.readFile(mainHtmlPath, 'utf-8');

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
            const writePromises = [];
            for (const [key, data] of Object.entries(apiFiles)) {
                const fileName = `${key.replace('Data', '')}.json`;
                writePromises.push(fs.writeJson(path.join(deployApiDir, fileName), data));
                writePromises.push(fs.writeJson(path.join(localLangApiDir, fileName), data));
            }
            await Promise.all(writePromises);

            let langHtml = htmlTemplate.replace(/<html lang="[^"]*">/, `<html lang="${langCode}">`);
            
            const domain = 'https://eurooptik.ro';
            const hreflangTags = locales.map(l => `<link rel="alternate" hreflang="${l}" href="${domain}/${l}/" />`).join('\n  ');
            const xDefaultTag = `<link rel="alternate" hreflang="x-default" href="${domain}/${locales[0]}/" />`;
            langHtml = langHtml.replace('</head>', `  ${hreflangTags}\n  ${xDefaultTag}\n</head>`);
            
            await fs.writeFile(path.join(langOutputDir, 'index.html'), langHtml);
        }
        
        console.log("Copying shared static assets to _site root...");
        const assetsToCopy = ['assets', 'pages', 'CNAME'];
        await Promise.all(
            assetsToCopy.map(dir => {
                const sourcePath = path.join(projectRoot, dir);
                const destPath = path.join(outputDir, dir);
                if (fs.existsSync(sourcePath)) {
                    return fs.copy(sourcePath, destPath);
                }
            })
        );
        console.log("✅ Shared assets copied.");

        console.log("Creating root redirect file...");
        const defaultLang = locales[0].split('-')[0];
        const redirectHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting...</title><link rel="canonical" href="/${defaultLang}/" /><meta http-equiv="refresh" content="0; url=/${defaultLang}/" /><script>window.location.replace('/${defaultLang}/');</script></head><body><p>Redirecting... <a href="/${defaultLang}/">Click here</a>.</p></body></html>`;
        await fs.writeFile(path.join(outputDir, 'index.html'), redirectHTML.trim());
        
        console.log("\nBuild complete! The clean '_site' folder is ready.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        process.exit(1);
    }
}

build();