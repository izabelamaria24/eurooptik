import * as contentful from './contentful-service.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
    PROJECT_ROOT: path.join(__dirname, '..'),
    OUTPUT_DIR: path.join(__dirname, '..', '_site'),
    LOCAL_API_DIR: path.join(__dirname, '..', 'api'),
    LOCALES: ['ro', 'en'],
    ASSETS_TO_COPY: ['assets', 'CNAME']
};

async function processHtmlFile(filePath, langCode, relativePathPrefix) {
    let html = await fs.readFile(filePath, 'utf-8');
    html = html.replace(/<html lang="[^"]*">/, `<html lang="${langCode}">`);
    html = html.replace(/(href|src)="(assets|pages)\//g, `$1="${relativePathPrefix}$2/`);
    return html;
}

async function fetchAllContentfulData(locale) {
    const [
        teamData, servicesData, testimonialsData, articlesData,
        pricingData, specializationsData, cercetariData, reelsData 
    ] = await Promise.all([
        contentful.fetchTeamFromContentful({ locale }),
        contentful.fetchServicesFromContentful({ locale }),
        contentful.fetchTestimonialsFromContentful({ locale }),
        contentful.fetchArticlesFromContentful({ locale }),
        contentful.fetchPricingData({ locale }),
        contentful.fetchSpecializationsData({ locale }),
        contentful.fetchCercetariFromContentful({ locale }),
        contentful.fetchReelsFromContentful({ locale })
    ]);

    return {
        team: teamData,
        services: servicesData,
        testimonials: testimonialsData,
        articles: articlesData,
        pricing: pricingData,
        specializations: specializationsData,
        cercetari: cercetariData,
        reels: reelsData 
    };
}

async function writeApiFiles(data, deployDir, localDir) {
    await fs.ensureDir(deployDir);
    await fs.ensureDir(localDir);

    for (const [key, content] of Object.entries(data)) {
        const fileName = `${key}.json`;
        await fs.writeJson(path.join(deployDir, fileName), content);
        await fs.writeJson(path.join(localDir, fileName), content);
    }
}

async function buildHtmlForLocale(langCode, langOutputDir) {
    const mainHtmlPath = path.join(CONFIG.PROJECT_ROOT, 'index.html');
    const processedIndexHtml = await processHtmlFile(mainHtmlPath, langCode, '../');
    await fs.writeFile(path.join(langOutputDir, 'index.html'), processedIndexHtml);

    const pagesDir = path.join(CONFIG.PROJECT_ROOT, 'pages');
    if (!fs.existsSync(pagesDir)) return;

    const pageFiles = await fs.readdir(pagesDir);
    for (const file of pageFiles.filter(f => f.endsWith('.html'))) {
        const destPageDir = path.join(langOutputDir, 'pages');
        await fs.ensureDir(destPageDir);
        const processedPageHtml = await processHtmlFile(path.join(pagesDir, file), langCode, '../../');
        await fs.writeFile(path.join(destPageDir, file), processedPageHtml);
    }
}


async function build() {
    try {
        console.log("Starting build process...");

        await fs.emptyDir(CONFIG.OUTPUT_DIR);
        await fs.emptyDir(CONFIG.LOCAL_API_DIR);
        console.log("✅ Cleaned old build directories.");

        for (const locale of CONFIG.LOCALES) {
            const langCode = locale.split('-')[0];
            console.log(`\n--- Building for locale: ${langCode} ---`);

            const langOutputDir = path.join(CONFIG.OUTPUT_DIR, langCode);
            const deployApiDir = path.join(langOutputDir, 'api');
            const localLangApiDir = path.join(CONFIG.LOCAL_API_DIR, langCode);

            const allData = await fetchAllContentfulData(locale);
            await writeApiFiles(allData, deployApiDir, localLangApiDir);
            console.log(`✅ API data written for ${langCode}.`);

            await buildHtmlForLocale(langCode, langOutputDir);
            console.log(`✅ HTML files processed for ${langCode}.`);
        }

        console.log("\n--- Copying shared assets ---");
        for (const asset of CONFIG.ASSETS_TO_COPY) {
            const srcPath = path.join(CONFIG.PROJECT_ROOT, asset);
            if (fs.existsSync(srcPath)) {
                await fs.copy(srcPath, path.join(CONFIG.OUTPUT_DIR, asset));
                console.log(`✅ Copied '${asset}'.`);
            }
        }

        const defaultLang = CONFIG.LOCALES[0].split('-')[0];
        const redirectHTML = `<!DOCTYPE html><html><head><title>Redirecting...</title><meta http-equiv="refresh" content="0; url=${defaultLang}/" /></head><body></body></html>`;
        await fs.writeFile(path.join(CONFIG.OUTPUT_DIR, 'index.html'), redirectHTML.trim());
        console.log("✅ Created root redirect file.");

        console.log("\nBuild complete! The '_site' folder is ready for deployment.");

    } catch (error) {
        console.error('\n❌ BUILD FAILED:', error.message);
        process.exit(1);
    }
}

build();