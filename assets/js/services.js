const servicesSection = document.getElementById('our-services-section');
const filterButtonsContainer = document.getElementById('services-filter-container');
const carouselSlider = document.getElementById('services-carousel-slider');
const carouselContainer = document.getElementById('services-carousel-container');
const dotsContainer = document.getElementById('services-carousel-dots');

if (!servicesSection || !filterButtonsContainer || !carouselSlider || !carouselContainer || !dotsContainer) {
    console.warn("One or more required elements for the Services section are missing. The module will not run.");
} else {
    const prevArrow = carouselContainer.querySelector('.carousel-arrow.prev');
    const nextArrow = carouselContainer.querySelector('.carousel-arrow.next');
    
    let currentIndex = 0;
    let totalSlides = 0;
    let allServicesData = {};

    function setupServicesToggle() {
        const toggleBtn = document.getElementById('services-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                filterButtonsContainer.classList.toggle('expanded');
                toggleBtn.classList.toggle('active');
            });
        }
    }

    function buildSimpleTableSlide(items) {
        const itemsHTML = items.map(([name, price]) => `
            <div class="table-row">
                <div class="table-cell name-cell">${name}</div>
                <div class="table-cell price-cell">${price}</div>
            </div>
        `).join('');
        return `<div class="carousel-card"><div class="service-table">${itemsHTML}</div></div>`;
    }

    function buildSubcategorySlide(subCategoryName, itemsChunk) {
        const titleMatch = subCategoryName.match(/([^(]+)\s*(\(.*\))?/);
        const mainTitle = titleMatch ? titleMatch[1].trim() : subCategoryName;
        const subtitle = titleMatch && titleMatch[2] ? titleMatch[2] : '';

        const itemsHTML = itemsChunk.map(([name, price]) => `
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

    function updateSliderPosition() {
        carouselSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        if (totalSlides > 1) {
            dotsContainer.innerHTML = Array.from({ length: totalSlides }, (_, i) =>
                `<span class="dot ${i === currentIndex ? 'active' : ''}" data-index="${i}"></span>`
            ).join('');
        }
    }

    function updateArrowVisibility() {
        if (!prevArrow || !nextArrow) return;
        const isVisible = totalSlides > 1;
        prevArrow.style.display = isVisible ? 'block' : 'none';
        nextArrow.style.display = isVisible ? 'block' : 'none';
    }

    function updateCarousel(categorySlug) {
        const categoryData = allServicesData[categorySlug];
        let slidesHTML = '';
        totalSlides = 0;

        if (!categoryData) {
            slidesHTML = '<div class="carousel-card"><p>Nu există servicii pentru această categorie.</p></div>';
            totalSlides = 1;
        } else {
            const itemsPerSlide = window.innerWidth <= 768 ? 3 : 5;
            if (categoryData.items) {
                const items = Object.entries(categoryData.items);
                for (let i = 0; i < items.length; i += itemsPerSlide) {
                    slidesHTML += buildSimpleTableSlide(items.slice(i, i + itemsPerSlide));
                }
                totalSlides = Math.ceil(items.length / itemsPerSlide);
            } else {
                const subcategories = Object.keys(categoryData);
                for (const subName of subcategories) {
                    const allItemsForSubcategory = Object.entries(categoryData[subName]);
                    for (let i = 0; i < allItemsForSubcategory.length; i += itemsPerSlide) {
                        const itemsChunk = allItemsForSubcategory.slice(i, i + itemsPerSlide);
                        slidesHTML += buildSubcategorySlide(subName, itemsChunk);
                        totalSlides++;
                    }
                }
            }
        }
        carouselSlider.innerHTML = slidesHTML;
        currentIndex = 0;
        updateSliderPosition();
        updateDots();
        updateArrowVisibility();
    }

    function populateFilterButtons(categories) {
        filterButtonsContainer.innerHTML = '';
        categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category.slug;
            // This assumes your build script will provide `iconUrl` in the JSON data
            button.innerHTML = `<img src="${category.iconUrl}" alt="" class="btn-icon"> ${category.name}`;
            if (index === 0) {
                button.classList.add('active');
            }
            filterButtonsContainer.appendChild(button);
        });
    }

    async function initializeServices() {
        try {
            const response = await fetch('api/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { servicesData, categories } = await response.json();

            if (!categories || categories.length === 0) {
                servicesSection.style.display = 'none';
                return;
            }

            allServicesData = servicesData;
            populateFilterButtons(categories);

            if (categories.length > 2) { 
                const toggleButtonHTML = `
                    <div class="services-toggle-wrapper">
                        <button id="services-toggle-btn" class="services-toggle-btn">
                            <i class="fa fa-chevron-down"></i>
                        </button>
                    </div>`;
                filterButtonsContainer.insertAdjacentHTML('afterend', toggleButtonHTML);
            }

            setupServicesToggle();
            updateCarousel(categories[0].slug);

            filterButtonsContainer.addEventListener('click', (e) => {
                const clickedButton = e.target.closest('.filter-btn');
                if (clickedButton) {
                    filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    clickedButton.classList.add('active');
                    updateCarousel(clickedButton.dataset.category);
                }
            });

            if (prevArrow && nextArrow) {
                prevArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
                    updateSliderPosition();
                    updateDots();
                });
                nextArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
                    updateSliderPosition();
                    updateDots();
                });
            }

            dotsContainer.addEventListener('click', (e) => {
                if (e.target.matches('.dot')) {
                    currentIndex = parseInt(e.target.dataset.index, 10);
                    updateSliderPosition();
                    updateDots();
                }
            });

        } catch (error) {
            console.error("Failed to initialize services section:", error);
            servicesSection.style.display = 'none';
        }
    }

    initializeServices();
}