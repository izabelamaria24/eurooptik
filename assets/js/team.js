$(document).ready(function() {
    const teamCarouselContainer = $('#team-grid');
    const filtersContainer = $('#team-filters-container');
    let allTeamMembers = [];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeCarousel() {
        if (teamCarouselContainer.hasClass('slick-initialized')) {
            teamCarouselContainer.slick('unslick');
        }
        if (teamCarouselContainer.children().length > 0 && !teamCarouselContainer.find('.no-results-message').length) {
            teamCarouselContainer.slick({
                dots: true,
                infinite: false,
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                responsive: [
                    {
                        breakpoint: 992, 
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 768, 
                        settings: {
                            slidesToShow: 1,
                            arrows: true 
                        }
                    }
                ]
            });
        }
    }

    function filterAndDisplayTeam(filterId) {
        if (!teamCarouselContainer.length) return;

        const filteredMembers = filterId === 'all' 
            ? allTeamMembers 
            : allTeamMembers.filter(member => member.categories.includes(filterId));

        shuffle(filteredMembers);
        
        teamCarouselContainer.css('opacity', 0);
        if (teamCarouselContainer.hasClass('slick-initialized')) {
            teamCarouselContainer.slick('unslick');
        }

        setTimeout(() => {
            let allCardsHTML = '';
            if (filteredMembers.length === 0) {
                allCardsHTML = `<div class="no-results-message">Niciun membru al echipei nu corespunde filtrului selectat.</div>`;
            } else {
                allCardsHTML = filteredMembers.map(member => {
                    const { name, role, image, specializations } = member;
                    const specializationsHTML = specializations.map(spec => `<li>${spec}</li>`).join('');
                    return `
                        <div>
                            <div class="team-member">
                                <div class="team-member-photo" style="background-image: url('${image}')"></div>
                                <h4 class="team-member-name">${name}</h4>
                                <p class="team-member-role">${role}</p>
                                ${specializations.length > 0 ? `<h5 class="team-member-specialization-title">Specializări</h5><ul class="team-member-specialization-list">${specializationsHTML}</ul>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }
            teamCarouselContainer.html(allCardsHTML);
            if (filteredMembers.length > 0) { initializeCarousel(); }
            teamCarouselContainer.css('opacity', 1);
        }, 300);
    }

    function displayFilterButtons(locations) {
        if (!filtersContainer.length) return;
        let buttonsHTML = '<button type="button" class="btn-filter" data-filter="all">Toată Echipa</button>';
        locations.forEach(location => {
            buttonsHTML += `<button type="button" class="btn-filter" data-filter="${location.filterId}">${location.name}</button>`;
        });
        filtersContainer.html(buttonsHTML);

        filtersContainer.on('click', '.btn-filter', function() {
            filtersContainer.find('.btn-filter').removeClass('active');
            $(this).addClass('active');
            const filterValue = $(this).data('filter').toString();
            filterAndDisplayTeam(filterValue);
        });
    }

    async function initializeTeamSection() {
        if (!teamCarouselContainer.length || !filtersContainer.length) { return; }
        try {
            const response = await fetch('api/team.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const { members, locations } = await response.json();

            allTeamMembers = members;
            if (allTeamMembers.length === 0) { return; }

            displayFilterButtons(locations);

            const defaultFilterId = '1';
            const defaultButton = filtersContainer.find(`[data-filter="${defaultFilterId}"]`);

            if (defaultButton.length) {
                defaultButton.addClass('active');
                filterAndDisplayTeam(defaultFilterId);
            } else {
                filtersContainer.find('[data-filter="all"]').addClass('active');
                filterAndDisplayTeam('all');
            }
        } catch (error) {
            console.error("Failed to initialize team section:", error);
            teamCarouselContainer.html('<div class="error-message">A apărut o eroare la încărcarea echipei.</div>');
        }
    }

    initializeTeamSection();
});