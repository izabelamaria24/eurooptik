import { fetchTeamFromContentful } from "./contentful-service.js";

class CustomCarousel {
    constructor(element, options = {}) {
        this.viewport = element;
        if (!this.viewport) {
            console.error('Carousel viewport element not found.');
            return;
        }
        this.container = this.viewport.querySelector('.carousel-container');
        this.nav = this.viewport.nextElementSibling;
        this.prevBtn = this.nav ? this.nav.querySelector(options.prevBtnSelector || '.prev') : null;
        this.nextBtn = this.nav ? this.nav.querySelector(options.nextBtnSelector || '.next') : null;

        if (!this.container || !this.nav || !this.prevBtn || !this.nextBtn) {
            console.warn('Carousel is missing some elements (container, nav, or buttons). It may not function correctly.');
            return;
        }

        this.isCarouselActive = false;
        this.currentIndex = 0;
        this.totalCards = 0;
        this.breakpoint = options.breakpoint || 767;

        this.handleNextClick = this.nextSlide.bind(this);
        this.handlePrevClick = this.prevSlide.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.init();
    }

    init() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    setup() {
        if (this.isCarouselActive) return;
        this.isCarouselActive = true;
        this.viewport.style.overflow = 'hidden';
        this.container.style.display = 'flex';
        this.container.style.transition = 'transform 0.5s ease-in-out';
        this.nextBtn.addEventListener('click', this.handleNextClick);
        this.prevBtn.addEventListener('click', this.handlePrevClick);
        this.update();
    }

    teardown() {
        if (!this.isCarouselActive) return;
        this.isCarouselActive = false;
        this.container.style.transform = '';
        this.container.style.display = '';
        this.container.style.transition = '';
        this.viewport.style.overflow = '';
        this.nav.style.display = 'none';
        this.nextBtn.removeEventListener('click', this.handleNextClick);
        this.prevBtn.removeEventListener('click', this.handlePrevClick);
    }

    update() {
        if (!this.isCarouselActive) return;
        this.totalCards = this.container.children.length;
        Array.from(this.container.children).forEach(card => {
            card.style.flex = '0 0 100%';
        });
        this.nav.style.display = this.totalCards > 1 ? 'flex' : 'none';
        this.goToSlide(0);
    }

    goToSlide(index) {
        if (!this.isCarouselActive || this.totalCards === 0) return;
        this.container.style.transform = `translateX(-${index * 100}%)`;
        this.currentIndex = index;
    }

    nextSlide() {
        if (this.totalCards <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.goToSlide(this.currentIndex);
    }

    prevSlide() {
        if (this.totalCards <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.goToSlide(this.currentIndex);
    }

    handleResize() {
        if (window.innerWidth <= this.breakpoint) {
            this.setup();
        } else {
            this.teardown();
        }
    }
}


const teamGrid = document.getElementById('team-grid');
const filtersContainer = document.getElementById('team-filters-container');
const viewport = document.getElementById('team-carousel-viewport');
let teamCarousel;
let allTeamMembers = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function filterAndDisplayTeam(filter) {
    if (!teamGrid) return;
    teamGrid.innerHTML = '';

    const filteredMembers = filter === 'all' ?
        allTeamMembers :
        allTeamMembers.filter(member => member.categories.includes(filter));

    shuffle(filteredMembers);

    if (filteredMembers.length === 0) {
        teamGrid.innerHTML = '<p>Niciun membru al echipei nu corespunde filtrului selectat.</p>';
    } else {
        filteredMembers.forEach(member => {
            const memberCardWrapper = document.createElement('div');
            memberCardWrapper.className = 'team-member-wrapper';
            const specializationsHTML = member.specializations.map(spec => `<li>${spec}</li>`).join('');

            const memberTypeClass = member.type || 'default';

            memberCardWrapper.innerHTML = `
                <div class="team-member ${memberTypeClass}">
                    <div class="team-member-photo" style="background-image: url('${member.image}')"></div>
                    <h4 class="team-member-name">${member.name}</h4>
                    <p class="team-member-role">${member.role}</p>
                    <h5 class="team-member-specialization-title">Specializări</h5>
                    <ul class="team-member-specialization-list">
                        ${specializationsHTML}
                    </ul>
                </div>
            `;
            teamGrid.appendChild(memberCardWrapper);
        });
    }

    if (teamCarousel) {
        teamCarousel.update();
    }
}

function displayFilterButtons(locations) {
    if (!filtersContainer) return;

    let buttonsHTML = '<button type="button" class="btn-filter active" data-filter="all">Toată echipa</button>';
    locations.forEach(location => {
        buttonsHTML += `<button type="button" class="btn-filter" data-filter="${location.filterId}">${location.name}</button>`;
    });
    filtersContainer.innerHTML = buttonsHTML;

    filtersContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.btn-filter');
        if (!button) return;

        filtersContainer.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        filterAndDisplayTeam(filterValue);
    });
}

async function initializeTeamSection() {
    const { members, locations } = await fetchTeamFromContentful();
    allTeamMembers = members;

    if (!teamGrid || !filtersContainer || !viewport) {
        console.error("One or more required containers for the team section are missing from the DOM.");
        return;
    }

    if (allTeamMembers.length === 0) {
        teamGrid.innerHTML = '<p>Ne pare rău, lista membrilor echipei nu este disponibilă momentan.</p>';
        return;
    }

    displayFilterButtons(locations);

    teamCarousel = new CustomCarousel(viewport, {
        prevBtnSelector: '#prev-doctor',
        nextBtnSelector: '#next-doctor'
    });

    filterAndDisplayTeam('all'); 
}

initializeTeamSection();