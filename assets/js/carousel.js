(function() {
    const container = document.querySelector('.location-cards-container');
    if (!container) return; 

    const cards = container.querySelectorAll('.location-card');
    const prevBtn = document.getElementById('prev-location');
    const nextBtn = document.getElementById('next-location');
    const viewport = document.querySelector('.carousel-viewport');

    let currentIndex = 0;
    const totalCards = cards.length;
    const desktopBreakpoint = 992; 

    function updateCarousel() {
        const offset = -currentIndex * 100;
        container.style.transform = 'translateX(' + offset + '%)';

        if (prevBtn) prevBtn.disabled = (currentIndex === 0);
        if (nextBtn) nextBtn.disabled = (currentIndex >= totalCards - 1);
    }

    function enableCarousel() {
        currentIndex = 0;
        updateCarousel();

        if (prevBtn && nextBtn && viewport && !prevBtn.hasAttribute('data-listener-added')) {
            prevBtn.addEventListener('click', handlePrevClick);
            nextBtn.addEventListener('click', handleNextClick);
            viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
            viewport.addEventListener('touchend', handleTouchEnd);
            prevBtn.setAttribute('data-listener-added', 'true');
        }
    }

    function disableCarousel() {
        container.style.transform = 'none';
        if (prevBtn && nextBtn && viewport && prevBtn.hasAttribute('data-listener-added')) {
            prevBtn.removeEventListener('click', handlePrevClick);
            nextBtn.removeEventListener('click', handleNextClick);
            viewport.removeEventListener('touchstart', handleTouchStart);
            viewport.removeEventListener('touchend', handleTouchEnd);
            prevBtn.removeAttribute('data-listener-added');
        }
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }

    function handlePrevClick() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    function handleNextClick() {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateCarousel();
        }
    }

    let startX = null;
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
    }

    function handleTouchEnd(e) {
        if (startX === null) return;
        let endX = e.changedTouches[0].clientX;
        let diffX = endX - startX;

        if (diffX > 50) { 
            handlePrevClick();
        } else if (diffX < -50) {
            handleNextClick();
        }
        startX = null;
    }

    let isCarouselActive = false; 

    function checkScreenSize() {
        if (window.innerWidth < desktopBreakpoint) {
            if (!isCarouselActive) {
                enableCarousel();
                isCarouselActive = true;
            }
        } else {
            if (isCarouselActive) {
                disableCarousel();
                isCarouselActive = false;
            }
        }
    }

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    document.addEventListener('DOMContentLoaded', checkScreenSize);
})();