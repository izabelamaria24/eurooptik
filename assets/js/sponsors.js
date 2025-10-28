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

    async function initSponsorsSection() {
        try {
            const response = await fetch('api/sponsors.json');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const sponsors = await response.json();
            
            if (sponsors && sponsors.length > 0) {
                renderSponsorSlides(sponsors);
                initializeCarousel(sponsors.length);
            } else {
                sponsorsSection.style.display = 'none';
            }
        } catch (error) {
            console.error("Error initializing sponsors section:", error);
            sponsorsSection.style.display = 'none';
        }
    }
    
    function renderSponsorSlides(sponsors) {
        sponsorsWrapper.innerHTML = '';
        const itemsPerPage = 5;
        const totalSlides = Math.ceil(sponsors.length / itemsPerPage);

        for (let i = 0; i < totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'sponsor-slide';
            
            const slideSponsors = sponsors.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
            
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

    function initializeCarousel(totalItems) {
        let currentIndex = 0;
        const itemsPerPage = 5;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        function updateCarousel() {
            sponsorsWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalPages - 1;
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalPages - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        if (totalPages <= 1) {
            document.querySelector('.sponsors-nav').style.display = 'none';
        }

        updateCarousel();
    }

    sponsorsWrapper.addEventListener('click', (event) => {
        const card = event.target.closest('.sponsor-card');
        if (card) openModal(card);
    });

    function openModal(card) {
        const name = card.dataset.name;
        const description = card.dataset.description;
        const url = card.dataset.url;

        modalTitle.textContent = name;
        modalDescription.textContent = description;
        
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