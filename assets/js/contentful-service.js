
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