document.addEventListener('DOMContentLoaded', () => {
    const servicesData = [
        {
            id: 1,
            name: 'Stabilire dioptrii',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 2,
            name: 'Tensiune oculara',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 3,
            name: 'Fund de ochi',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 4,
            name: 'Diagnostic cataracta',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 5,
            name: 'Glaucom (camp vizual)',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 6,
            name: 'Retina afectata de diabet',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 7,
            name: 'Scanare retina (tomografie)',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 8,
            name: 'Scanare nerv optic (OCT)',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 9,
            name: 'Ecografie oculara',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 10,
            name: 'Topografie corneana',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 11,
            name: 'Diagnostic glaucom',
            price: 0,
            description: '',
            details: '',
            image: ''
        },
        {
            id: 12,
            name: 'Cataracta cu implant de cristalin asferic',
            price: "3360/3650",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 13,
            name: 'Cataracta cu implant pentru miopie mare',
            price: "3650",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 14,
            name: 'Cataracta cu implant de cristalin toric',
            price: "4050/4250",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 15,
            name: 'Cataracta cu implant Eyhence/Evolux/Toric',
            price: "3850/4050/4650",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 16,
            name: 'Cataracta cu implant EDOF/toric',
            price: "5200/6000",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 17,
            name: 'Cataracta cu implant cristalin multifocal/toric',
            price:  "5500/6800",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 18,
            name: 'Cataracta cu implant Panoptix/toric',
            price: "5900/6900",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 19,
            name: 'Cataracta cu implant Panoptix/toric',
            price: "5900/6900",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 20,
            name: 'Cataracta cu implant multifocal+EDOF Synergy/toric',
            price: "6700/7700",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 21,
            name: 'Operatie glaucom – trabeculectomie',
            price: "2600",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 22,
            name: 'Chalasion',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 23,
            name: 'Chist conjunctival',
            price: "350",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 24,
            name: 'Dezobstructie cai lacrimale la adulti',
            price: "120",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 25,
            name: 'Ectropion/Entropion',
            price: "1200",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 26,
            name: 'Epilare definitiva cili palpebrali – radiocauterizare (1 pleoapa)',
            price: "300",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 27,
            name: 'Injecţie intravitreana (Vitreal S)',
            price: "500",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 28,
            name: 'Injectie intravitreana Eylea',
            price: "370/250",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 29,
            name: 'Injectie intravitreana Triamcinolon (Kenalog)',
            price: "370",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 30,
            name: 'Injecţii perioculare / subconjunctivale',
            price: "150",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 31,
            name: 'Papilom palpebral radiocauterizare',
            price: "350",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 32,
            name: 'Pinguecula',
            price: "600",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 33,
            name: 'Pterigion cu plastie conjunctivala +/- 5F-uracil',
            price: "1000/1500",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 34,
            name: 'Toxina botulinica riduri frontale',
            price: "620",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 35,
            name: 'Toxina botulinica riduri perioculare',
            price: "770",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 36,
            name: 'Toxina botulinica riduri radacina nasului (glabelare)',
            price: "520",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 37,
            name: 'Xantelasma (1 leziune)',
            price: "400",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 38,
            name: 'Laser iridotomie YAG',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 39,
            name: 'Laser trabeculoplastie SLT',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 40,
            name: 'Laser capsulotomie YAG',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 40,
            name: 'Laser capsulotomie YAG',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 40,
            name: 'Laser capsulotomie YAG',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 40,
            name: 'Laser capsulotomie YAG',
            price: "450",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 41,
            name: 'Biometrie AO',
            price: "160",
            description: 'Investigatie Speciala',
            details: 'AO = Anterior Ocular. Masurarea precisa a lungimii axiale a ochiului.',
            image: 'https://images.unsplash.com/photo-1599045118108-bf11b5943924?q=80&w=1974&auto=format&fit=crop'
        },
        {
            id: 42,
            name: 'Control post-injectie intravitreana (include si OCT la ochiul tratat)',
            price: "160",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 43,
            name: 'Ecografie 1O/AO',
            price: "110/170",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 44,
            name: 'OCT – Glaucom (nerv optic) / Maculopatie (macula) 1O/AO',
            price: "100/150",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 45,
            name: 'OCT – Retina (macula + nerv optic) 1O/AO	',
            price: "160/250",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 46,
            name: 'Perimetrie oculara (camp vizual) – AO',
            price: "120",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 47,
            name: 'Topografie corneeana AO',
            price: "150",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 48,
            name: 'Consultatie Medic Specialist/Primar (Prescriptie Ochelari Inclusa)',
            price: "150/180",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 49,
            name: 'Control copil 6 luni – 3 ani cu Plusoptix',
            price: "150",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 50,
            name: 'Control Medic Specialist (6 luni)',
            price: "110/140",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 51,
            name: 'Examen fund de ochi',
            price: "85",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 52,
            name: 'Examen simt cromatic',
            price: "85",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 53,
            name: 'Exoftalmometrie',
            price: "100",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 54,
            name: 'Extractie corp strain cornean',
            price: "130",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 55,
            name: 'Gonioscopie',
            price: "100",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 56,
            name: 'Masurarea tensiunii intraoculare',
            price: "60",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 57,
            name: 'Ortokeratologie Paragon 4 controale pe an',
            price: "140",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 58,
            name: 'Ortokeratologie Paragon consult initial',
            price: "260",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 59,
            name: 'Ortokeratologie Paragon pachet anual',
            price: "2750",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 60,
            name: 'Ortokeratologie Paragon pachet anual dublu ax',
            price: "3250",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 61,
            name: 'Prescriptie lentile contact',
            price: "150/180",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 62,
            name: 'Test Schirmer (sdr. de ochi uscat)',
            price: "85",
            description: '',
            details: '',
            image: ''
        },
        {
            id: 63,
            name: 'Tratamente locale, pansamente, scos fire, injectii',
            price: "60",
            description: '',
            details: '',
            image: ''
        }
    ];

    const alphabetNav = document.getElementById('alphabet-nav');
    const serviceListContainer = document.getElementById('service-list-container');
    const serviceContentWrapper = document.getElementById('service-content-wrapper');

    if (servicesData.length === 0) {
        serviceContentWrapper.style.display = 'none';
        return;
    }

    function displayServiceDetails(service) {
        document.getElementById('service-price').textContent = service.price + " RON";
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