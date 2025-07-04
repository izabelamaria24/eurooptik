document.addEventListener('DOMContentLoaded', function() {
    
    // --- Get main elements ---
    const viewport = document.querySelector('.carousel-viewport');
    const container = document.querySelector('.location-cards-container');
    const nav = document.querySelector('.carousel-nav');
    
    // --- NEW: Function to Randomize Card Order ---
    // This runs once on page load to shuffle the cards.
    function randomizeCards(containerElement) {
        // Get all card elements as a true array
        const cards = Array.from(containerElement.children);
        
        // Shuffle the array using the modern Fisher-Yates-like method
        cards.sort(() => Math.random() - 0.5);
        
        // Append the cards back to the container in their new, random order
        cards.forEach(card => containerElement.appendChild(card));
    }

    // --- Call the randomization function ONCE ---
    randomizeCards(container);


    // --- Carousel Logic (unchanged, but now works on the randomized order) ---
    let isCarouselActive = false;
    let autoPlayInterval;
    let currentIndex = 0;
    
    function setupCarousel() {
        if (isCarouselActive) return;
        
        const cards = container.querySelectorAll('.location-card');
        const totalCards = cards.length;
        // Re-fetch buttons inside setup to ensure they are the "live" ones
        const prevBtn = document.getElementById('prev-location');
        const nextBtn = document.getElementById('next-location');

        function goToSlide(index) {
            container.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalCards;
            goToSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            goToSlide(currentIndex);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Event Listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        viewport.addEventListener('mouseenter', stopAutoPlay);
        viewport.addEventListener('mouseleave', startAutoPlay);

        // Initialize
        nav.style.display = 'flex';
        goToSlide(0);
        startAutoPlay();
        isCarouselActive = true;
    }

    function tearDownCarousel() {
        if (!isCarouselActive) return;

        clearInterval(autoPlayInterval);
        container.style.transform = 'translateX(0)';
        nav.style.display = 'none';
        
        // Clone and replace elements to safely remove event listeners
        const oldViewport = viewport;
        const newViewport = oldViewport.cloneNode(true);
        oldViewport.parentNode.replaceChild(newViewport, oldViewport);

        isCarouselActive = false;
    }

    function handleResize() {
        if (window.innerWidth <= 767) {
            setupCarousel();
        } else {
            tearDownCarousel();
        }
    }

    // Initial check on page load
    handleResize();

    // Listen for window resize events with debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 250);
    });
});