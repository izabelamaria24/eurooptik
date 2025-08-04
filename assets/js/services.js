// custom-services-carousel.js
document.addEventListener('DOMContentLoaded', function () {
    // Check if the main container exists before running the script
    if (!document.getElementById('our-services-section')) {
        return;
    }

    const servicesData = {
        consultatii: {
            items: {
                "Consultație inițială cu medic oftalmolog": "200 - 250 RON",
                "Evaluare optometrica realizata de specialist licențiat": "80 - 120 RON",
                "Reevaluare la 6 luni cu medic oftalmolog": "100 - 130 RON",
                "Control dioptrii și strabism copii (6 luni – 3 ani) – Plusoptix": "160 RON",
                "Prescripție pentru lentile de contact": "200 - 250 RON",
            }
        },
        investigatii: {
            items: {
                "Tomografie în Coerență Optică (OCT)": "200 RON",
                "Biometrie optică": "150 RON",
                "Pahimetrie corneană": "100 RON"
            }
        },
        laser: {
            items: {
                "Fotocoagulare laser panretiniană": "400 RON",
                "Iridotomie YAG laser": "300 RON",
                "Capsulotomie YAG laser": "300 RON",
                "Trabeculoplastie selectivă cu laser (SLT)": "500 RON",
            }
        },
        retina: {
            items: {
                "Injectie intravitreana cu Avastin": "500 RON",
                "Injectie intravitreana cu Eylea": "2500 RON",
                "Injectie intravitreana cu Lucentis": "2000 RON"
            }
        },
        cataracta: {
            // This category has sub-categories, but will use the same base layout
            "Cristalin pentru vedere la distanță (se poartă ochelari pentru citit)": {
                "Mini Ready 4 / Toric": "3650 / 4050 RON",
                "Envista B&L / Toric": "3850 / 4250 RON",
                "Alcon Acrysof MA 60 (miopie mare)": "3850 RON",
                "Iris claw (cazuri speciale)": "4000 RON"
            },
            "Cristalin multifocal (vedere aproape și distanță)": {
                "PanOptix / Toric": "6550 / 7050 RON",
                "FineVision / Toric": "6550 / 7050 RON"
            }
        },
        glaucom: {
            items: {
                "Screening glaucom": "250 RON",
                "Tratament medicamentos glaucom": "Preț variabil",
                "Interventie chirurgicala glaucom (trabeculectomie)": "4000 RON"
            }
        },
        microchirurgicale: {
            // This category has sub-categories
            "Interventii pleoape": {
                "Blefaroplastie superioara": "3500 RON",
                "Blefaroplastie inferioara": "4000 RON",
                "Corectie ptoza palpebrala": "3000 RON"
            },
            "Alte interventii": {
                "Excizie chalazion": "600 RON",
                "Excizie pterigion": "800 RON"
            }
        },
        estetice: {
            items: {
                "Injectare toxina botulinica (Botox) - 3 zone": "1500 RON",
                "Injectare acid hialuronic - 1 ml": "1200 RON",
                "Mezoterapie faciala": "500 RON"
            }
        }
    };

    const filterButtons = document.querySelectorAll('#services-filter-container .filter-btn');
    const carouselSlider = document.getElementById('services-carousel-slider');
    const carouselContainer = document.getElementById('services-carousel-container');
    const prevArrow = carouselContainer.querySelector('.carousel-arrow.prev');
    const nextArrow = carouselContainer.querySelector('.carousel-arrow.next');
    const dotsContainer = document.getElementById('services-carousel-dots');

    let currentIndex = 0;
    let totalSlides = 0;
    const itemsPerSlide = 5;

    function buildSimpleTableSlide(items) {
        const itemsHTML = items.map(([name, price]) => `
            <div class="table-row">
                <div class="table-cell name-cell">${name}</div>
                <div class="table-cell price-cell">${price}</div>
            </div>
        `).join('');
        return `<div class="carousel-card"><div class="service-table">${itemsHTML}</div></div>`;
    }

    function buildSubcategorySlide(subCategoryName, items) {
        const titleMatch = subCategoryName.match(/([^(]+)\s*(\(.*\))?/);
        const mainTitle = titleMatch ? titleMatch[1].trim() : subCategoryName;
        const subtitle = titleMatch && titleMatch[2] ? titleMatch[2] : '';

        const itemsHTML = Object.entries(items).map(([name, price]) => `
            <div class="table-row">
                <div class="table-cell name-cell">${name}</div>
                <div class="table-cell price-cell">${price}</div>
            </div>`).join('');

        const headerHTML = `
            <div class="table-row">
                <div class="table-cell header-cell">
                    <span class="main-title">${mainTitle}</span>
                    ${subtitle ? `<span class="subtitle">${subtitle}</span>` : ''}
                </div>
                <div class="table-cell price-cell">-</div>
            </div>`;

        return `<div class="carousel-card"><div class="service-table">${headerHTML}${itemsHTML}</div></div>`;
    }

    function updateCarousel(category) {
        const categoryData = servicesData[category];
        let slidesHTML = '';

        if (categoryData.items) {
            const items = Object.entries(categoryData.items);
            for (let i = 0; i < items.length; i += itemsPerSlide) {
                slidesHTML += buildSimpleTableSlide(items.slice(i, i + itemsPerSlide));
            }
            totalSlides = Math.ceil(items.length / itemsPerSlide);
        } else {
            const subcategories = Object.keys(categoryData);
            for (const subName of subcategories) {
                slidesHTML += buildSubcategorySlide(subName, categoryData[subName]);
            }
            totalSlides = subcategories.length;
        }

        carouselSlider.innerHTML = slidesHTML;
        currentIndex = 0;
        updateSliderPosition();
        updateDots();
        updateArrowVisibility();
    }

    function updateSliderPosition() {
        if (carouselSlider) {
            carouselSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        if (totalSlides > 1) {
            dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) =>
                `<span class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></span>`
            ).join('');
        }
    }

    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.dot')) {
                currentIndex = parseInt(e.target.dataset.index, 10);
                updateSliderPosition();
                updateDots();
            }
        });
    }

    function updateArrowVisibility() {
        const isVisible = totalSlides > 1;
        if (prevArrow && nextArrow) {
            prevArrow.style.display = isVisible ? 'block' : 'none';
            nextArrow.style.display = isVisible ? 'block' : 'none';
        }
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
                updateCarousel(e.currentTarget.dataset.category);
            });
        });
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
            updateSliderPosition();
            updateDots();
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
            updateSliderPosition();
            updateDots();
        });
    }

    // Initial load
    if (filterButtons.length > 0) {
        updateCarousel('cataracta');
    }
});