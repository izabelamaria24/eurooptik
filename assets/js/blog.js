import { fetchServicesFromContentful } from './contentful-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('blog-filter-container');
    const slider = document.getElementById('blog-carousel-slider');
    const dotsContainer = document.getElementById('blog-carousel-dots');
    const prevArrow = document.getElementById('blog-prev-arrow');
    const nextArrow = document.getElementById('blog-next-arrow');

    let allArticles = {}; 
    let categories = [];
    let activeCategorySlug = '';
    let currentSlideIndex = 0;
    let totalSlides = 0;
    
    const getArticlesPerSlide = () => {
        if (window.innerWidth <= 768) return 1;
        // if (window.innerWidth <= 992) return 2; // decomentează pt 2 pe tabletă
        return 3;
    }

    async function initBlogSection() {
        const data = await fetchServicesFromContentful();
        if (!data || !data.servicesData || !data.categories) {
            console.error('Nu s-au putut încărca datele pentru blog.');
            return;
        }

        categories = data.categories;
        
        allArticles = Object.keys(data.servicesData).reduce((acc, categorySlug) => {
            const categoryData = data.servicesData[categorySlug];
            let articlesInCategory = [];
            
            if (categoryData.items) {
                articlesInCategory = Object.keys(categoryData.items).map(name => ({ title: name }));
            } else {
                Object.values(categoryData).forEach(subCategory => {
                    const serviceNames = Object.keys(subCategory).map(name => ({ title: name }));
                    articlesInCategory.push(...serviceNames);
                });
            }
            
            acc[categorySlug] = articlesInCategory;
            return acc;
        }, {});
        
        if (categories.length > 0) {
            renderFilters();
            setActiveCategory(categories[0].slug);
        }

        prevArrow.addEventListener('click', () => showSlide(currentSlideIndex - 1));
        nextArrow.addEventListener('click', () => showSlide(currentSlideIndex + 1));
        
        window.addEventListener('resize', () => {
            if (activeCategorySlug) {
                renderCarousel(allArticles[activeCategorySlug]);
            }
        });
    }

    function renderFilters() {
        filterContainer.innerHTML = ''; 
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category.name;
            button.dataset.slug = category.slug;
            button.addEventListener('click', () => setActiveCategory(category.slug));
            filterContainer.appendChild(button);
        });
    }
    
    function setActiveCategory(slug) {
        if (activeCategorySlug === slug) return;
        activeCategorySlug = slug;

        const buttons = filterContainer.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.slug === slug);
        });

        renderCarousel(allArticles[slug] || []);
    }

    function renderCarousel(articles) {
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            slider.innerHTML = `<p style="width:100%; text-align:center;">Nu există articole în această categorie.</p>`;
            totalSlides = 0;
            updateArrows();
            return;
        }

        const articlesPerSlide = getArticlesPerSlide();
        totalSlides = Math.ceil(articles.length / articlesPerSlide);

        for (let i = 0; i < totalSlides; i++) {
            const slide = document.createElement('div');
            slide.className = 'blog-carousel-slide';
            
            const slideArticles = articles.slice(i * articlesPerSlide, (i + 1) * articlesPerSlide);

            slideArticles.forEach(article => {
                const card = document.createElement('a'); 
                card.href = '#'; // TODO link to real article
                card.className = 'blog-article-card';
                card.innerHTML = `<div class="article-title">${article.title}</div>`;
                slide.appendChild(card);
            });

            slider.appendChild(slide);
        }

        if (totalSlides > 1) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.dataset.index = i;
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        showSlide(0);
    }

    function showSlide(index) {
        if (index >= totalSlides) {
            index = 0;
        }
        if (index < 0) {
            index = totalSlides - 1;
        }

        currentSlideIndex = index;

        slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        const dots = dotsContainer.querySelectorAll('.dot');
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlideIndex);
            });
        }
        
        updateArrows();
    }
    
    function updateArrows() {
        prevArrow.style.display = totalSlides > 1 ? 'block' : 'none';
        nextArrow.style.display = totalSlides > 1 ? 'block' : 'none';
    }

    initBlogSection();
});