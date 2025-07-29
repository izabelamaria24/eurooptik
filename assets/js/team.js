document.addEventListener('DOMContentLoaded', () => {
    const doctors = [
        {
            name: 'Dr. Alina Popa',
            role: 'Medic primar oftalmolog',
            image: 'assets/images/Angajati/Alina_Popa.png',
            specializations: ['Chirurgia cataractei', 'Consultații oftalmologice', 'Tratament laser glaucom si retină'],
            categories: ['locatia-a']
        },
        {
            name: 'Dr. Ana Miller',
            role: 'Medic specialist oftalmolog',
            image: 'assets/images/Angajati/Ana_Miller.png',
            specializations: [],
            categories: ['locatia-b']
        },
        {
            name: 'Dr. Anca Crăciun',
            role: 'Medic specialist oftalmolog',
            image: 'assets/images/Angajati/Anca_Craciun.png',
            specializations: [],
            categories: ['locatia-c']
        },
        {
            name: 'Dr. Andrei Irimia',
            role: 'Medic primar oftalmolog',
            image: 'assets/images/Angajati/Andrei_Irimia.png',
            specializations: ['Chirurgia cataractei', 'Operatii de retina'],
            categories: ['locatia-d']
        },
        {
            name: 'Dr. Cristina Flondor',
            role: 'Medic primar oftalmolog',
            image: 'assets/images/Angajati/Cristina_Flondor.png',
            specializations: ['Ochelari progresivi', 'Tratament glaucom'],
            categories: ['locatia-e']
        },
        {
            name: 'Dr. Delia Iftimie',
            role: 'Medic specialist oftalmolog',
            image: 'assets/images/Angajati/Delia_Iftimie.png',
            specializations: [],
            categories: ['locatia-a']
        },
        {
            name: 'Dr. Dana Lupu',
            role: 'Medic primar oftalmolog',
            image: 'assets/images/Angajati/Dana_Lupu.png',
            specializations: [],
            categories: ['locatia-b']
        },
        {
            name: 'Dr. Roxana Lungu',
            role: 'Medic specialist oftalmolog',
            image: 'assets/images/Angajati/Roxana_Lungu.png',
            specializations: ['Consultatii oftalmologice si prescriptii de ochelari', 'Sindrom de ochi uscat, glaucom'],
            categories: ['locatia-c']
        }
    ];

    const teamGrid = document.getElementById('team-grid');
    const filterButtons = document.querySelectorAll('.btn-filter');

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayDoctors(doctorArray) {
        teamGrid.innerHTML = '';
        doctorArray.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'team-member';
            doctor.categories.forEach(cat => doctorCard.setAttribute(`data-${cat}`, 'true'));
            const specializationsHTML = doctor.specializations.map(spec => `<li>${spec}</li>`).join('');

            doctorCard.innerHTML = `
                <div class="team-member-photo" style="background-image: url('${doctor.image}')"></div>
                <h4 class="team-member-name">${doctor.name}</h4>
                <p class="team-member-role">${doctor.role}</p>
                <h5 class="team-member-specialization-title">Specializări</h5>
                <ul class="team-member-specialization-list">
                    ${specializationsHTML}
                </ul>
            `;
            teamGrid.appendChild(doctorCard);
        });
    }
    
    function filterTeam(filter) {
        const allMembers = document.querySelectorAll('.team-member');
        allMembers.forEach(member => {
            member.classList.remove('show');
            if (filter === 'all' || member.hasAttribute(`data-${filter}`)) {
                setTimeout(() => {
                    member.classList.add('show');
                }, 10);
            }
        });
    }

    shuffle(doctors);
    displayDoctors(doctors);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            filterTeam(filterValue);
        });
    });

});