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
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 5,
            name: 'Glaucom (camp vizual)',
            price: 0,
            description: '',
            details: '',
            image: 'assets/images/Servicii/Operatii/glaucom.png'
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
            image: 'assets/images/Servicii/Operatii/glaucom.png'
        },
        {
            id: 12,
            name: 'Cataracta cu implant de cristalin asferic',
            price: "3360/3650",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 13,
            name: 'Cataracta cu implant pentru miopie mare',
            price: "3650",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 14,
            name: 'Cataracta cu implant de cristalin toric',
            price: "4050/4250",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 15,
            name: 'Cataracta cu implant Eyhence/Evolux/Toric',
            price: "3850/4050/4650",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 16,
            name: 'Cataracta cu implant EDOF/toric',
            price: "5200/6000",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 17,
            name: 'Cataracta cu implant cristalin multifocal/toric',
            price:  "5500/6800",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 18,
            name: 'Cataracta cu implant Panoptix/toric',
            price: "5900/6900",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 19,
            name: 'Cataracta cu implant Panoptix/toric',
            price: "5900/6900",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 20,
            name: 'Cataracta cu implant multifocal+EDOF Synergy/toric',
            price: "6700/7700",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/cataracta.png'
        },
        {
            id: 21,
            name: 'Operatie glaucom – trabeculectomie',
            price: "2600",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/glaucom.jpg'
        },
        {
            id: 22,
            name: 'Chalasion',
            price: "450",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/chalazion.jpg'
        },
        {
            id: 23,
            name: 'Chist conjunctival',
            price: "350",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/conj_cyst.jpg'
        },
        {
            id: 24,
            name: 'Dezobstructie cai lacrimale la adulti',
            price: "120",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/lacrimale.jpg'
        },
        {
            id: 25,
            name: 'Ectropion/Entropion',
            price: "1200",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/entropion.jpg'
        },
        {
            id: 26,
            name: 'Epilare definitiva cili palpebrali – radiocauterizare (1 pleoapa)',
            price: "300",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/pleoape.jpg'
        },
        {
            id: 27,
            name: 'Injecţie intravitreana (Vitreal S)',
            price: "500",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
        },
        {
            id: 28,
            name: 'Injectie intravitreana Eylea',
            price: "370/250",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
        },
        {
            id: 29,
            name: 'Injectie intravitreana Triamcinolon (Kenalog)',
            price: "370",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
        },
        {
            id: 30,
            name: 'Injecţii perioculare / subconjunctivale',
            price: "150",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
        },
        {
            id: 31,
            name: 'Papilom palpebral radiocauterizare',
            price: "350",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/papiloma.jpeg'
        },
        {
            id: 32,
            name: 'Pinguecula',
            price: "600",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/pinguecula.jpg'
        },
        {
            id: 33,
            name: 'Pterigion cu plastie conjunctivala +/- 5F-uracil',
            price: "1000/1500",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/pterigium.jpg'
        },
        {
            id: 34,
            name: 'Toxina botulinica riduri frontale',
            price: "620",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/wrinkles.jpg'
        },
        {
            id: 35,
            name: 'Toxina botulinica riduri perioculare',
            price: "770",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/wrinkles.jpg'
        },
        {
            id: 36,
            name: 'Toxina botulinica riduri radacina nasului (glabelare)',
            price: "520",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/wrinkles.jpg'
        },
        {
            id: 37,
            name: 'Xantelasma (1 leziune)',
            price: "400",
            description: 'Operatie',
            details: '',
            image: 'assets/images/Servicii/Operatii/xantelasma.png'
        },
        {
            id: 38,
            name: 'Laser iridotomie YAG',
            price: "450",
            description: 'Laser',
            details: '',
            image: 'assets/images/Servicii/Laser/laser.png'
        },
        {
            id: 39,
            name: 'Laser trabeculoplastie SLT',
            price: "450",
            description: 'Laser',
            details: '',
            image: 'assets/images/Servicii/Laser/laser.png'
        },
        {
            id: 40,
            name: 'Laser capsulotomie YAG',
            price: "450",
            description: 'Laser',
            details: '',
            image: 'assets/images/Servicii/Laser/laser.png'
        },
        {
            id: 41,
            name: 'Biometrie AO',
            price: "160",
            description: 'Investigatie Speciala',
            details: 'AO = Anterior Ocular. Masurarea precisa a lungimii axiale a ochiului.',
            image: 'assets/images/Servicii/biometrie.png'
        },
        {
            id: 42,
            name: 'Control post-injectie intravitreana (include si OCT la ochiul tratat)',
            price: "160",
            description: 'Investigatie Speciala',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
        },
        {
            id: 43,
            name: 'Ecografie 1O/AO',
            price: "110/170",
            description: 'Investigatie Speciala',
            details: 'AO = Anterior Ocular. Masurarea precisa a lungimii axiale a ochiului.',
            image: 'assets/images/Servicii/Investigatii_Speciale/ecografie.jpg'
        },
        {
            id: 44,
            name: 'OCT – Glaucom (nerv optic) / Maculopatie (macula) 1O/AO',
            price: "100/150",
            description: 'Investigatie Speciala',
            details: '',
            image: 'assets/images/Servicii/Investigatii_Speciale/OCT.jpg'
        },
        {
            id: 45,
            name: 'OCT – Retina (macula + nerv optic) 1O/AO	',
            price: "160/250",
            description: 'Investigatie Speciala',
            details: '',
            image: 'assets/images/Servicii/Investigatii_Speciale/OCT.jpg'
        },
        {
            id: 46,
            name: 'Perimetrie oculara (camp vizual) – AO',
            price: "120",
            description: 'Investigatie Speciala',
            details: '',
            image: 'assets/images/Servicii/Investigatii_Speciale/perimetry.jpg'
        },
        {
            id: 47,
            name: 'Topografie corneana AO',
            price: "150",
            description: 'Investigatie Speciala',
            details: '',
            image: 'assets/images/Servicii/Investigatii_Speciale/topografie_corneana.jpg'
        },
        {
            id: 48,
            name: 'Consultatie Medic Specialist/Primar (Prescriptie Ochelari Inclusa)',
            price: "150/180",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/appointment.jpg'
        },
        {
            id: 49,
            name: 'Control copil 6 luni – 3 ani cu Plusoptix',
            price: "150",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/appointment_kids.jpg'
        },
        {
            id: 50,
            name: 'Control Medic Specialist (6 luni)',
            price: "110/140",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/appointment.jpg'
        },
        {
            id: 51,
            name: 'Examen fund de ochi',
            price: "85",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/fund_ochi.jpg'
        },
        {
            id: 52,
            name: 'Examen simt cromatic',
            price: "85",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/cromatic.png'
        },
        {
            id: 53,
            name: 'Exoftalmometrie',
            price: "100",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/Exoftalmometrie.jpg'
        },
        {
            id: 54,
            name: 'Extractie corp strain cornean',
            price: "130",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/extraction.jpg'
        },
        {
            id: 55,
            name: 'Gonioscopie',
            price: "100",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/gonioscopie.jpg'
        },
        {
            id: 56,
            name: 'Masurarea tensiunii intraoculare',
            price: "60",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/tensiune_intraoculara.jpeg'
        },
        {
            id: 57,
            name: 'Ortokeratologie Paragon 4 controale pe an',
            price: "140",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/orthokeratologie.jpeg'
        },
        {
            id: 58,
            name: 'Ortokeratologie Paragon consult initial',
            price: "260",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/orthokeratologie.jpeg'
        },
        {
            id: 59,
            name: 'Ortokeratologie Paragon pachet anual',
            price: "2750",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/orthokeratologie.jpeg'
        },
        {
            id: 60,
            name: 'Ortokeratologie Paragon pachet anual dublu ax',
            price: "3250",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/orthokeratologie.jpeg'
        },
        {
            id: 61,
            name: 'Prescriptie lentile contact',
            price: "150/180",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/contact_lenses.jpg'
        },
        {
            id: 62,
            name: 'Test Schirmer (sdr. de ochi uscat)',
            price: "85",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/schirmer.jpg'
        },
        {
            id: 63,
            name: 'Tratamente locale, pansamente, scos fire, injectii',
            price: "60",
            description: 'Consultatie',
            details: '',
            image: 'assets/images/Servicii/Consultatii/injectii.jpg'
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
        document.getElementById('service-price').textContent = service.price ? service.price + " RON" : '';
        document.getElementById('service-description').textContent = service.description;
        document.getElementById('service-details').textContent = service.details;

        const imageElement = document.getElementById('service-image');
        const imageContainer = imageElement.parentElement;

        if (service.image) {
            imageElement.src = service.image;
            imageElement.alt = service.name;
            imageContainer.style.display = 'block'; 
        } else {
            imageContainer.style.display = 'none'; 
        }
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