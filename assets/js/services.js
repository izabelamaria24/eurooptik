document.addEventListener('DOMContentLoaded', () => {
    const servicesData = [
        {
            id: 'biometrie',
            name: 'Biometrie AO',
            price: '160 RON',
            description: 'Investigatie Speciala',
            details: 'AO = Anterior Ocular. Masurarea precisa a lungimii axiale a ochiului.',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'biometrie-pachymetrie',
            name: 'Biometrie Pachymetrie',
            price: '200 RON',
            description: 'Masurarea grosimii corneei',
            details: 'Esentiala in diagnosticul glaucomului si pre-operator.',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'camp-vizual',
            name: 'Camp vizual computerizat',
            price: '120 RON',
            description: 'Testare glaucom',
            details: 'Detecteaza pierderile de vedere periferica si centrala.',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'ecografie',
            name: 'Ecografie Oculara',
            price: '180 RON',
            description: 'Imagistica structurilor interne',
            details: 'Utilizata cand mediile transparente sunt opace (ex. cataracta densa).',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 'gonioscopie',
            name: 'Gonioscopie',
            price: '90 RON',
            description: 'Examinarea unghiului irido-corneean',
            details: 'Metoda cheie in clasificarea si managementul glaucomului.',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
    ];

    const alphabetNav = document.getElementById('alphabet-nav');
    const serviceListContainer = document.getElementById('service-list-container');
    const serviceContentWrapper = document.getElementById('service-content-wrapper');

    if (servicesData.length === 0) {
        serviceContentWrapper.style.display = 'none';
        return;
    }

    function displayServiceDetails(service) {
        document.getElementById('service-price').textContent = service.price;
        document.getElementById('service-description').textContent = service.description;
        document.getElementById('service-details').textContent = service.details;
        document.getElementById('service-image').src = service.image;
        document.getElementById('service-image').alt = service.name;
    }

    function displayServicesForLetter(letter) {
        const filteredServices = servicesData.filter(s => s.name.toUpperCase().startsWith(letter));
        
        serviceListContainer.innerHTML = ''; 

        if (filteredServices.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'service-list';

            filteredServices.forEach(service => {
                const li = document.createElement('li');
                li.className = 'service-list-item';
                li.textContent = `${service.name} →`;
                li.dataset.id = service.id; 

                li.addEventListener('click', () => {
                    displayServiceDetails(service);
                    
                    ul.querySelector('.active-service')?.classList.remove('active-service');
                    li.classList.add('active-service');
                });

                ul.appendChild(li);
            });

            serviceListContainer.appendChild(ul);

            displayServiceDetails(filteredServices[0]);
            ul.querySelector('.service-list-item').classList.add('active-service');
        }
    }

    function initialize() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        const availableLetters = [...new Set(servicesData.map(s => s.name[0].toUpperCase()))];
        
        alphabet.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'letter-btn';
            button.textContent = letter;
            button.dataset.letter = letter;

            if (availableLetters.includes(letter)) {
                button.classList.add('available');

                button.addEventListener('click', () => {
                    alphabetNav.querySelector('.active')?.classList.remove('active');
                    button.classList.add('active');
                    
                    displayServicesForLetter(letter);
                });
            }
            
            alphabetNav.appendChild(button);
        });

        const firstAvailableButton = alphabetNav.querySelector('.available');
        if (firstAvailableButton) {
            firstAvailableButton.click();
        } else {
             serviceContentWrapper.style.display = 'none';
        }
    }

    initialize();
});