
class CustomCarousel {
    constructor(element, options = {}) {
        this.viewport = element;

        if (!this.viewport) {
            console.error('Carousel viewport not found:', element);
            return;
        }

        this.container = this.viewport.querySelector('.carousel-container');
        this.nav = this.viewport.nextElementSibling;
        this.prevBtn = this.nav ? this.nav.querySelector(options.prevBtnSelector || '.prev') : null;
        this.nextBtn = this.nav ? this.nav.querySelector(options.nextBtnSelector || '.next') : null;

        if (!this.container || !this.nav || !this.prevBtn || !this.nextBtn) {
            console.error('Essential carousel elements are missing.');
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
        if (!this.isCarouselActive) {
             Array.from(this.container.children).forEach(card => {
                card.style.flex = '';
                card.classList.add('show');
            });
            return;
        };

        this.totalCards = this.container.children.length;

        Array.from(this.container.children).forEach(card => {
            card.style.flex = '0 0 100%';
            card.classList.add('show');
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


document.addEventListener('DOMContentLoaded', () => {
    const doctors = [
        { name: 'Dr. Alina Popa', role: 'Medic primar oftalmolog', image: 'assets/images/Angajati/Alina_Popa.png', specializations: ['Chirurgia cataractei', 'Consultații oftalmologice', 'Tratament laser glaucom si retină', 'Oftalmologie pediatrică'], categories: ['locatia-a'] },
        { name: 'Dr. Ana Miller', role: 'Medic specialist oftalmolog', image: 'assets/images/Angajati/Ana_Miller.png', specializations: ['Chirurgia refractivă'], categories: ['locatia-b'] },
        { name: 'Dr. Anca Crăciun', role: 'Medic specialist oftalmolog', image: 'assets/images/Angajati/Anca_Craciun.png', specializations: ['Glaucom si boli retiniene'], categories: ['locatia-c'] },
        { name: 'Dr. Andrei Irimia', role: 'Medic primar oftalmolog', image: 'assets/images/Angajati/Andrei_Irimia.png', specializations: ['Chirurgia cataractei', 'Operatii de retina'], categories: ['locatia-d'] },
        { name: 'Dr. Cristina Flondor', role: 'Medic primar oftalmolog', image: 'assets/images/Angajati/Cristina_Flondor.png', specializations: ['Ochelari progresivi', 'Tratament glaucom'], categories: ['locatia-e'] },
        { name: 'Dr. Delia Iftimie', role: 'Medic specialist oftalmolog', image: 'assets/images/Angajati/Delia_Iftimie.png', specializations: ['Boli ale polului anterior'], categories: ['locatia-a'] },
        { name: 'Dr. Dana Lupu', role: 'Medic primar oftalmolog', image: 'assets/images/Angajati/Dana_Lupu.png', specializations: ['Diagnostic si tratament glaucom'], categories: ['locatia-b'] },
        { name: 'Dr. Roxana Lungu', role: 'Medic specialist oftalmolog', image: 'assets/images/Angajati/Roxana_Lungu.png', specializations: ['Consultatii oftalmologice si prescriptii de ochelari', 'Sindrom de ochi uscat, glaucom'], categories: ['locatia-c'] }
    ];

    const teamGrid = document.getElementById('team-grid');
    const filterButtons = document.querySelectorAll('.btn-filter');
    let doctorCarousel; 

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function filterAndDisplayDoctors(filter) {
        teamGrid.innerHTML = '';

        const filteredDoctors = filter === 'all'
            ? doctors
            : doctors.filter(doc => doc.categories.includes(filter));

        shuffle(filteredDoctors);

        filteredDoctors.forEach(doctor => {
            const doctorCardWrapper = document.createElement('div');
            doctorCardWrapper.className = 'team-member-wrapper';

            const specializationsHTML = doctor.specializations.map(spec => `<li>${spec}</li>`).join('');
            
            doctorCardWrapper.innerHTML = `
                <div class="team-member">
                    <div class="team-member-photo" style="background-image: url('${doctor.image}')"></div>
                    <h4 class="team-member-name">${doctor.name}</h4>
                    <p class="team-member-role">${doctor.role}</p>
                    <h5 class="team-member-specialization-title">Specializări</h5>
                    <ul class="team-member-specialization-list">
                        ${specializationsHTML}
                    </ul>
                </div>
            `;
            teamGrid.appendChild(doctorCardWrapper);
        });

        if (doctorCarousel) {
            doctorCarousel.update();
        }
    }

    const viewport = document.getElementById('team-carousel-viewport');
    doctorCarousel = new CustomCarousel(viewport, {
        prevBtnSelector: '#prev-doctor',
        nextBtnSelector: '#next-doctor'
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            filterAndDisplayDoctors(filterValue);
        });
    });

    filterAndDisplayDoctors('all');
});