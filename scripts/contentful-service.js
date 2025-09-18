import * as contentful from 'contentful';

let client = null;

async function initializeContentful() {
    if (client) {
        return client;
    }

    let spaceId = process.env.CONTENTFUL_SPACE_ID;
    let accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !accessToken) {
        console.log("Environment variables not found. Trying local config.js...");
        try {
            const config = await import('./config.js'); 
            spaceId = config.CONTENTFUL_SPACE_ID;
            accessToken = config.CONTENTFUL_ACCESS_TOKEN;
            console.log("Loaded credentials from local config.js");
        } catch (error) {
            console.log("Could not load local config.js. Error:", error.message);
        }
    }

    if (!spaceId || !accessToken) {
        console.error("Contentful API keys are not set. API calls will fail.");
        return null;
    }

    client = contentful.createClient({
        space: spaceId,
        accessToken: accessToken,
    });
    
    return client;
}

function processMember(memberEntry, memberType) {
    if (!memberEntry || !memberEntry.fields) {
        return null;
    }
    
    const { fields } = memberEntry;
    const categoriesAsArray = [].concat(fields.categorie).filter(Boolean);

    const finalCategories = categoriesAsArray
        .map(item => item.fields?.idFiltru?.toString()) 
        .filter(Boolean); 

    return {
        name: fields.nume || '', 
        role: fields.titlu || '', 
        image: fields.fotografie?.fields?.file?.url ? `https:${fields.fotografie.fields.file.url}` : '',
        specializations: fields.specializari || [],
        categories: finalCategories,
        type: memberType 
    };
}


export async function fetchTeamFromContentful({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const [teamPageResponse, locationResponse] = await Promise.all([
            client.getEntries({ content_type: 'team', include: 3, locale: locale }), 
            client.getEntries({ content_type: 'locatie', order: 'fields.idFiltru', locale: locale })
        ]);

        if (!teamPageResponse.items.length) {
            console.error(`Team page entry not found in Contentful for locale ${locale}.`);
            return { members: [], locations: [] };
        }

        const teamFields = teamPageResponse.items[0].fields;
        let allTeamMembers = [];

        (teamFields.listaDoctori || []).forEach(member => allTeamMembers.push(processMember(member, 'doctor')));
        (teamFields.listaAsistenteMedicale || []).forEach(member => allTeamMembers.push(processMember(member, 'asistenta-medicala')));
        (teamFields.listaInfirmiere || []).forEach(member => allTeamMembers.push(processMember(member, 'infirmiera')));
        (teamFields.listaConsilieri || []).forEach(member => allTeamMembers.push(processMember(member, 'consilier')));
        (teamFields.listaManageri || []).forEach(member => allTeamMembers.push(processMember(member, 'manager')));
        (teamFields.listaOptometristi || []).forEach(member => allTeamMembers.push(processMember(member, 'optometrist')));
        
        allTeamMembers = allTeamMembers.filter(Boolean);

        const locations = locationResponse.items.map(item => ({
            name: item.fields.numeLocatie,
            filterId: item.fields.idFiltru.toString()
        }));

        return { members: allTeamMembers, locations };

    } catch (error) {
        console.error(`Error fetching team data for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch team data for locale ${locale}.`);
    }
}


export async function fetchServicesFromContentful({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const [serviceEntries, categoryEntries] = await Promise.all([
            client.getEntries({ content_type: 'serviciu', include: 2, limit: 1000, locale: locale }),
            client.getEntries({ content_type: 'categorieServiciu', order: 'fields.idServiciu', locale: locale }) 
        ]);

        const servicesData = serviceEntries.items.reduce((acc, item) => {
            const service = item.fields;
            const categorySlug = service.categorie?.fields?.idServiciu; 
            if (!categorySlug || !service.numeServiciu || !service.pretServiciu) return acc;
            
            const serviceName = service.numeServiciu;
            const servicePrice = service.pretServiciu;
            const subCategory = service.subcategorie;

            if (!acc[categorySlug]) acc[categorySlug] = {};
            if (subCategory?.fields?.numeSubcategorieServiciu) {
                const subCategoryName = subCategory.fields.numeSubcategorieServiciu;
                if (!acc[categorySlug][subCategoryName]) acc[categorySlug][subCategoryName] = {};
                acc[categorySlug][subCategoryName][serviceName] = servicePrice;
            } else {
                if (!acc[categorySlug].items) acc[categorySlug].items = {};
                acc[categorySlug].items[serviceName] = servicePrice;
            }
            return acc;
        }, {});

        const categories = categoryEntries.items.map(item => ({
            name: item.fields.numeCategorieServiciu,
            slug: item.fields.idServiciu?.toString() || null 
        })).filter(cat => cat.slug && cat.name);

        return { servicesData, categories };

    } catch (error) {
        console.error(`Error fetching services for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch services for locale ${locale}.`); 
    }
}


export async function fetchArticlesFromContentful({ locale = 'ro' } = {}) {
    await initializeContentful(); 
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const articleEntries = await client.getEntries({
            content_type: 'articol',
            include: 3,
            locale: locale
        });

        const articlesData = articleEntries.items.reduce((acc, entry) => {
            const article = entry.fields;
            const relatedService = article.serviciu?.fields;
            if (relatedService && relatedService.numeServiciu) {
                const serviceName = relatedService.numeServiciu;
                acc[serviceName] = {
                    title: article.denumireArticol,
                    slug: article.slug,
                    doctors: (article.doctori || []).map(doc => doc.fields.nume).filter(Boolean),
                    content: article.continutArticol
                };
            }
            return acc;
        }, {});
        
        return articlesData;

    } catch (error) {
        console.error(`Error fetching articles for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch articles for locale ${locale}.`); 
    }
}


export async function fetchArticleBySlug({ slug, locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client || !slug) return null;

    try {
        const entry = await client.getEntries({
            content_type: 'articol',
            'fields.slug': slug, 
            include: 3,
            limit: 1,
            locale: locale
        });

        if (entry.items.length === 0) {
            console.warn(`No article found with slug: ${slug} for locale ${locale}`);
            return null;
        }

        const article = entry.items[0].fields;
        return {
            title: article.denumireArticol,
            doctors: (article.doctori || []).map(doc => doc.fields.nume).filter(Boolean),
            content: article.continutArticol
        };

    } catch (error) {
        console.error(`Error fetching article with slug ${slug} for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch article by slug for locale ${locale}.`);
    }
}


export async function fetchTestimonialsFromContentful({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const response = await client.getEntries({
            content_type: 'testimonial', 
            limit: 6,                   
            order: '-sys.createdAt',
            locale: locale
        });

        if (!response.items) return [];

        const testimonials = response.items.map(item => {
            const { numeClient, continutTestimonial, pozaTestimonial } = item.fields;
            if (!numeClient || !continutTestimonial || !pozaTestimonial?.fields?.file?.url) return null;
            return {
                id: item.sys.id,
                author: numeClient,
                quote: continutTestimonial,
                imageUrl: `https:${pozaTestimonial.fields.file.url}?w=400&h=400&fit=crop&fm=jpg&q=80`
            };
        }).filter(Boolean); 

        return testimonials;

    } catch (error) {
        console.error(`Error fetching testimonials for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch testimonials for locale ${locale}.`);
    }
}


export async function fetchPricingData({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const response = await client.getEntries({
            content_type: 'tarif',
            include: 2,
            limit: 1000,
            locale: locale
        });

        if (!response.items) return {};

        const pricingData = response.items.reduce((acc, item) => {
            const tarif = item.fields;
            const locationName = tarif.locatie?.fields?.numeLocatie;
            const consultationTypeName = tarif.tipConsultatie?.fields?.tipConsultatie;
            const price = tarif.pret;
            const createKey = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null;
            const locationKey = createKey(locationName);
            const consultationKey = createKey(consultationTypeName);

            if (locationKey && consultationKey && typeof price !== 'undefined') {
                if (!acc[locationKey]) acc[locationKey] = {};
                acc[locationKey][consultationKey] = price;
            }
            return acc;
        }, {});

        return pricingData;

    } catch (error) {
        console.error(`Error fetching pricing data for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch pricing data for locale ${locale}.`);
    }
}


export async function fetchSpecializationsData({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const [categoryResponse, specializationResponse] = await Promise.all([
            client.getEntries({ content_type: 'categorieSpecialitate', order: 'fields.idFiltru', locale: locale }),
            client.getEntries({ content_type: 'specialitate', include: 3, order: 'sys.createdAt', locale: locale })
        ]);

        const createKey = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null;

        const categories = categoryResponse.items.map(item => ({
            id: item.fields.idFiltru.toString(),
            name: item.fields.numeCategorieSpecialitate,
            slug: createKey(item.fields.numeCategorieSpecialitate)
        }));

        const specializations = specializationResponse.items.map(item => {
            const fields = item.fields;
            if (!fields.numeSpecialitate || !fields.categorieSpecialitate?.fields) return null;

            const testimonialId = fields.testimonial?.sys?.id || null;
            const testimonialQuote = fields.testimonial?.fields?.continutTestimonial || null;
            const testimonialAuthorImage = fields.testimonial?.fields?.pozaTestimonial?.fields?.file?.url ? `https:${fields.testimonial.fields.pozaTestimonial.fields.file.url}` : null;
            
            const articles = (fields.articles || []).map(articleEntry => {
                const articleFields = articleEntry?.fields;
                if (!articleFields) return null;
                const title = articleFields.denumireArticol;
                const slug = articleFields.slug;
                const categorySlug = articleFields.serviciu?.fields?.categorie?.fields?.idServiciu?.toString() || null;
                if (title && slug && categorySlug) return { title, slug, categorySlug };
                return null;
            }).filter(Boolean); 

            return {
                slug: createKey(fields.numeSpecialitate),
                cardTitle: fields.numeSpecialitate,
                cardImage: `https:${fields.pozaSpecialitate?.fields?.file?.url || ''}`,
                categorySlug: createKey(fields.categorieSpecialitate.fields.numeCategorieSpecialitate),
                articleTitle: fields.titluSpecialitate,
                articleDescription: fields.descriereSpecialitate,
                articleImage: `https:${fields.pozaSpecialitate?.fields?.file?.url || ''}`,
                testimonialId,
                testimonialQuote,
                testimonialAuthorImage,
                articles: articles
            };
        }).filter(Boolean);

        return { categories, specializations };

    } catch (error) {
        console.error(`Error fetching specializations for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch specializations for locale ${locale}.`);
    }
}

export async function fetchCercetariFromContentful({ locale = 'ro' } = {}) {
    await initializeContentful();
    if (!client) throw new Error("Contentful client failed to initialize.");

    try {
        const response = await client.getEntries({
            content_type: 'articolCercetareStiintifica',
            include: 1,
            locale: locale
        });

        if (!response.items) return {};

        const articles = response.items.reduce((acc, item) => {
            const article = item.fields;
            if (article.titlu && article.slug) {
                acc[article.slug] = {
                    title: article.titlu,
                    slug: article.slug,
                    content: article.continutArticol
                };
            }
            return acc;
        }, {});
        
        return articles;

    } catch (error) {
        console.error(`Error fetching cercetari articles for locale ${locale}:`, error.message);
        throw new Error(`Failed to fetch cercetari for locale ${locale}.`);
    }
}