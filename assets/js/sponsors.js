document.addEventListener('DOMContentLoaded', () => {
    const sponsorsSection = document.getElementById('sponsors');
    const sponsorsWrapper = document.querySelector('.sponsors-cards-container');
    const prevBtn = document.querySelector('#sponsors .prev-btn');
    const nextBtn = document.querySelector('#sponsors .next-btn');
    const modal = document.getElementById('sponsor-modal');
    const modalTitle = document.getElementById('sponsor-modal-title');
    const modalDescription = document.getElementById('sponsor-modal-description');
    const modalLink = document.getElementById('sponsor-modal-link');
    const closeModalBtn = document.getElementById('sponsor-modal-close');

    if (!sponsorsSection || !sponsorsWrapper || !modal) return;

    let allSponsors = [];
    let currentSlide = 0;

    function getItemsPerPage() {
        return window.innerWidth <= 1500 ? 1 : 5;
    }
    
    function renderSponsorSlides() {
        sponsorsWrapper.innerHTML = '';
        const itemsPerPage = getItemsPerPage();
        const totalSlides = Math.ceil(allSponsors.length / itemsPerPage);

        for (let i = 0; i < totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'sponsor-slide';
            
            const slideSponsors = allSponsors.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
            
            slideSponsors.forEach(sponsor => {
                const card = document.createElement('div');
                card.className = 'sponsor-card';
                card.setAttribute('data-name', sponsor.name);
                card.setAttribute('data-description', sponsor.description);
                card.setAttribute('data-url', sponsor.websiteUrl || '#');
                card.innerHTML = `
                    <div class="sponsor-card-header"><h5>${sponsor.name}</h5></div>
                    <div class="sponsor-card-logo"><img src="${sponsor.logoUrl}" alt="${sponsor.name} Logo"></div>
                `;
                slide.appendChild(card);
            });
            sponsorsWrapper.appendChild(slide);
        }
    }

    function updateCarousel() {
        const itemsPerPage = getItemsPerPage();
        const totalPages = Math.ceil(allSponsors.length / itemsPerPage);

        if (currentSlide >= totalPages) currentSlide = totalPages - 1;
        if (currentSlide < 0) currentSlide = 0;

        sponsorsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= totalPages - 1;

        const nav = document.querySelector('.sponsors-nav');
        if(nav) nav.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    async function initSponsorsSection() {
        try {
            const response = await fetch('api/sponsors.json');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            allSponsors = await response.json();
            
            if (allSponsors.length > 0) {
                renderSponsorSlides(); 
                updateCarousel(); 
            } else {
                sponsorsSection.style.display = 'none';
            }
        } catch (error) {
            console.error("Error initializing sponsors section:", error);
            sponsorsSection.style.display = 'none';
        }
    }

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(allSponsors.length / getItemsPerPage());
        if (currentSlide < totalPages - 1) {
            currentSlide++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            renderSponsorSlides();
            updateCarousel(); 
        }, 100);
    });

    sponsorsWrapper.addEventListener('click', (event) => {
        const card = event.target.closest('.sponsor-card');
        if (card) openModal(card);
    });

    function openModal(card) {
        modalTitle.textContent = card.dataset.name;
        modalDescription.textContent = card.dataset.description;
        const url = card.dataset.url;
        
        if (url && url !== '#') {
            modalLink.href = url;
            modalLink.style.display = 'inline-block';
        } else {
            modalLink.style.display = 'none';
        }
        modal.classList.add('visible');
    }

    function closeModal() {
        modal.classList.remove('visible');
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    initSponsorsSection();
});