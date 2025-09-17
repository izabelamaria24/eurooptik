// assets/js/sponsors.js
$(document).ready(function() {
    const sponsorsContainer = $('.sponsors-cards-container');
    const sponsorCards = $('.sponsor-card');
    const totalCards = sponsorCards.length;
    let currentCardIndex = 0;

    let startX = 0;
    let currentTranslate = 0;
    let isDragging = false;

    function showCard(index) {
        if (index < 0) {
            index = 0;
        } else if (index >= totalCards) {
            index = totalCards - 1;
        }
        currentCardIndex = index;
        currentTranslate = -currentCardIndex * sponsorsContainer.width();
        sponsorsContainer.css('transform', `translateX(${currentTranslate}px)`);
        sponsorsContainer.css('transition', 'transform 0.5s ease-in-out');
    }

    function setTranslate(xPos) {
        sponsorsContainer.css('transform', `translateX(${xPos}px)`);
    }

    sponsorsContainer.on('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        sponsorsContainer.css('transition', 'none');
    });

    sponsorsContainer.on('touchmove', function(e) {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        const newTranslate = currentTranslate + deltaX;

        const maxTranslate = 0;
        const minTranslate = -(totalCards - 1) * sponsorsContainer.width();

        if (newTranslate > maxTranslate + 50 || newTranslate < minTranslate - 50) {
            return;
        }

        setTranslate(newTranslate);
        e.preventDefault();
    });

    sponsorsContainer.on('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        const threshold = sponsorsContainer.width() / 4;

        if (deltaX > threshold) {
            showCard(currentCardIndex - 1);
        } else if (deltaX < -threshold) {
            showCard(currentCardIndex + 1);
        } else {
            showCard(currentCardIndex);
        }
    });

    $('.next-card-link').on('click', function(e) {
        e.preventDefault();

        const targetCardName = $(this).data('target-card');
        if (targetCardName) {
            let targetIndex = -1;
            sponsorCards.each(function(idx) {
                if ($(this).data('card-name') === targetCardName) {
                    targetIndex = idx;
                    return false;
                }
            });

            if (targetIndex !== -1) {
                showCard(targetIndex);
            }
        }
    });

    showCard(0);
    $(window).on('resize', function() {
        showCard(currentCardIndex);
    });
});