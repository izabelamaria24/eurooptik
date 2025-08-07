async function fetchDataFromContentful() {
  const client = contentful.createClient({
      space: CONFIG.SPACE_ID,
      accessToken: CONFIG.ACCESS_TOKEN,
  });

  try {
      const [doctorResponse, locationResponse] = await Promise.all([
        client.getEntries({ content_type: 'doctor', include: 2, order: 'fields.numeDoctor' }),
        client.getEntries({ content_type: 'locatie', order: 'fields.idFiltru' })
      ]);

      const doctors = doctorResponse.items.map(item => {
        const { fields } = item;
        
        const filterId = fields.categorie?.fields?.idFiltru;
        const category = filterId ? [filterId.toString()] : [];
        
        return {
          name: fields.numeDoctor || '',
          role: fields.titluDoctor || '',
          image: fields.fotografieDoctor?.fields?.file?.url ? `https:${fields.fotografieDoctor.fields.file.url}` : '',
          specializations: fields.specializari || [],
          categories: category 
        };
      });

      const locations = locationResponse.items.map(item => {
        return {
          name: item.fields.numeLocatie,
          filterId: item.fields.idFiltru.toString() 
        }
      });

      return { doctors, locations };

    } catch (error) {
      console.error('A apărut o eroare la preluarea datelor din Contentful:', error);
      return { doctors: [], locations: [] };
    }
}

async function fetchServicesFromContentful() {
    const client = contentful.createClient({
        space: CONFIG.SPACE_ID,
        accessToken: CONFIG.ACCESS_TOKEN,
    });

    try {
        const [serviceEntries, categoryEntries] = await Promise.all([
            client.getEntries({ content_type: 'serviciu', include: 2, limit: 1000 }),
            client.getEntries({ content_type: 'categorieServiciu', order: 'fields.idServiciu' }) 
        ]);

        const servicesData = serviceEntries.items.reduce((acc, item) => {
            const service = item.fields;
            const categorySlug = service.categorie?.fields?.idServiciu; 

            if (!categorySlug) {
                return acc;
            }
            if (!service.numeServiciu || !service.pretServiciu) {
                return acc;
            }
            
            const serviceName = service.numeServiciu;
            const servicePrice = service.pretServiciu;
            const subCategory = service.subcategorie;

            if (!acc[categorySlug]) {
                acc[categorySlug] = {};
            }

            if (subCategory && subCategory.fields && subCategory.fields.numeSubcategorieServiciu) {
                const subCategoryName = subCategory.fields.numeSubcategorieServiciu;
                if (!acc[categorySlug][subCategoryName]) {
                    acc[categorySlug][subCategoryName] = {};
                }
                acc[categorySlug][subCategoryName][serviceName] = servicePrice;
            } else {
                if (!acc[categorySlug].items) {
                    acc[categorySlug].items = {};
                }
                acc[categorySlug].items[serviceName] = servicePrice;
            }
            return acc;
        }, {});

        const categories = categoryEntries.items
            .map(item => {
                const slug = item.fields.idServiciu;

                return {
                    name: item.fields.numeCategorieServiciu,
                    slug: slug?.toString() || null 
                };
            })
            .filter(cat => cat.slug && cat.name);

        console.log("✅ Integration successful! Final categories array:", categories);

        return { servicesData, categories };

    } catch (error) {
        console.error('Error fetching or processing services from Contentful:', error);
        return { servicesData: {}, categories: [] };
    }
}