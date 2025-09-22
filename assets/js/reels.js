document.addEventListener('DOMContentLoaded', () => {
    const reelsSection = document.getElementById('reels-section-wrapper');
    if (!reelsSection) return;

    let allReelsData = [];
    let currentIndex = 0;
    let itemsPerPage = 3;
    let currentFilteredReels = [];

    const doctorFilter = reelsSection.querySelector('#doctor-filter');
    const categoryFilter = reelsSection.querySelector('#category-filter');
    const reelsContainer = reelsSection.querySelector('#reels-container');
    const prevButton = reelsSection.querySelector('.prev-btn');
    const nextButton = reelsSection.querySelector('.next-btn');

    async function initReels() {
        try {
            const response = await fetch(`api/reels.json`);
            if (!response.ok) throw new Error('API response was not ok');
            const data = await response.json();
            
            allReelsData = data.reels;
            populateFilters(data.doctors, data.categories);
            setupEventListeners();
            applyFilters();
        } catch (error) {
            console.error("Failed to load reels:", error);
            reelsContainer.innerHTML = '<p>Secțiunea video nu a putut fi încărcată.</p>';
        }
    }

    function populateFilters(doctors, categories) {
        const populate = (select, items, defaultText) => {
            select.innerHTML = `<option value="">${defaultText}</option>`;
            items.forEach(item => {
                select.add(new Option(item.name, item.slug));
            });
        };
        populate(doctorFilter, doctors, 'Selectați medicul oftalmolog');
        populate(categoryFilter, categories, 'Selectați subiectul');
    }
    
    function getVideoHtml(url) {
        return `
            <div class="reel-video-wrapper">
                <video 
                    src="${url}" 
                    playsinline 
                    muted 
                    loop 
                    controls
                ></video>
            </div>
        `;
    }

    function renderReels(reelsToRender) {
        reelsContainer.innerHTML = '';
        if (!reelsToRender || reelsToRender.length === 0) {
            const message = 'Nu s-au găsit videoclipuri.';
            reelsContainer.innerHTML = `<p style="width: 100%; text-align: center;">${message}</p>`;
        } else {
            reelsToRender.forEach(reel => {
                const reelElement = document.createElement('div');
                reelElement.className = 'reel-item';
                reelElement.innerHTML = getVideoHtml(reel.videoUrl);
                reelsContainer.appendChild(reelElement);
            });
        }
        updateCarouselState();
    }
    
    function applyFilters() {
        const selectedDoctor = doctorFilter.value;
        const selectedCategory = categoryFilter.value;
        currentFilteredReels = allReelsData.filter(reel => 
            (!selectedDoctor || reel.doctorSlug === selectedDoctor) &&
            (!selectedCategory || reel.categorySlug === selectedCategory)
        );
        currentIndex = 0;
        renderReels(currentFilteredReels);
    }
    
    function updateCarouselState() {
        if (window.innerWidth >= 1024) itemsPerPage = 3;
        else if (window.innerWidth >= 768) itemsPerPage = 2;
        else itemsPerPage = 1;

        const totalItems = currentFilteredReels.length;
        const itemWidth = reelsContainer.querySelector('.reel-item')?.offsetWidth || 0;
        reelsContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= totalItems - itemsPerPage || totalItems <= itemsPerPage;
    }

    function moveCarousel(direction) {
        const totalItems = currentFilteredReels.length;
        currentIndex = Math.max(0, Math.min(currentIndex + direction, totalItems - itemsPerPage));
        updateCarouselState();
    }

    function setupEventListeners() {
        doctorFilter.addEventListener('change', applyFilters);
        categoryFilter.addEventListener('change', applyFilters);
        prevButton.addEventListener('click', () => moveCarousel(-1));
        nextButton.addEventListener('click', () => moveCarousel(1));
        window.addEventListener('resize', () => {
             currentIndex = 0;
             renderReels(currentFilteredReels);
        });
    }

    initReels();
});