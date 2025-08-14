import { documentToHtmlString } from 'https://cdn.jsdelivr.net/npm/@contentful/rich-text-html-renderer/+esm';

import { fetchServicesFromContentful, fetchArticlesFromContentful } from './contentful-service.js';

document.addEventListener('DOMContentLoaded', () => {
    const filterContainer = document.getElementById('blog-filter-container');
    const slider = document.getElementById('blog-carousel-slider');
    const dotsContainer = document.getElementById('blog-carousel-dots');
    const prevArrow = document.getElementById('blog-prev-arrow');
    const nextArrow = document.getElementById('blog-next-arrow');
    
    const articleDisplayContainer = document.getElementById('blog-article-display-container');
    const articleTitleEl = document.getElementById('article-display-title');
    const articleAuthorEl = document.getElementById('article-display-author');
    const articleContentEl = document.getElementById('article-display-content');

    let servicesByCategory = {};
    let allArticlesData = {};
    let categories = [];
    let activeCategorySlug = '';
    let currentSlideIndex = 0;
    let totalSlides = 0;
    let activeArticleService = null; 

    const getArticlesPerSlide = () => window.innerWidth <= 768 ? 1 : 3;

    async function initBlogSection() {
        const [serviceResponse, articlesData] = await Promise.all([
            fetchServicesFromContentful(),
            fetchArticlesFromContentful()
        ]);

        if (!serviceResponse || !serviceResponse.servicesData) {
            console.error('Nu s-au putut încărca serviciile pentru blog.');
            return;
        }

        categories = serviceResponse.categories;
        servicesByCategory = transformServicesToArticles(serviceResponse.servicesData);
        allArticlesData = articlesData;

        if (categories.length > 0) {
            renderFilters();
            setActiveCategory(categories[0].slug);
        }

        prevArrow.addEventListener('click', () => showSlide(currentSlideIndex - 1));
        nextArrow.addEventListener('click', () => showSlide(currentSlideIndex + 1));
        
        slider.addEventListener('click', handleCardClick);
        
        window.addEventListener('resize', () => {
            if (activeCategorySlug) renderCarousel(servicesByCategory[activeCategorySlug]);
        });
    }

    function transformServicesToArticles(servicesData) {
        return Object.keys(servicesData).reduce((acc, categorySlug) => {
            const categoryData = servicesData[categorySlug];
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

        document.querySelectorAll('#blog-filter-container .filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.slug === slug);
        });
        
        hideArticle();
        renderCarousel(servicesByCategory[slug] || []);
    }

    function renderCarousel(articles) {
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        if (!articles || articles.length === 0) {
            slider.innerHTML = `<p style="width:100%; text-align:center;">Nu există servicii în această categorie.</p>`;
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
                const serviceName = article.title;
                const hasActualArticle = allArticlesData.hasOwnProperty(serviceName);

                const card = document.createElement('div'); 
                card.className = 'blog-article-card';
                
                card.dataset.serviceName = serviceName;

                if (!hasActualArticle) {
                    card.classList.add('disabled');
                }
                
                card.innerHTML = `<div class="article-title">${serviceName}</div>`;
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

    function handleCardClick(event) {
        const card = event.target.closest('.blog-article-card');
        
        if (card && !card.classList.contains('disabled')) {
            const serviceName = card.dataset.serviceName;
            
            if (activeArticleService === serviceName) {
                hideArticle();
            } else {
                displayArticle(serviceName);
            }
        }
    }

    function displayArticle(serviceName) {
        const articleData = allArticlesData[serviceName];
        if (!articleData) return;

        activeArticleService = serviceName;

        articleTitleEl.textContent = articleData.title;
        articleAuthorEl.textContent = articleData.doctors.length > 0 ? `De Dr. ${articleData.doctors.join(', ')}` : '';
        
        articleContentEl.innerHTML = documentToHtmlString(articleData.content);

        articleDisplayContainer.classList.remove('hidden');
        
        setTimeout(() => {
            articleDisplayContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); 
    }

    function hideArticle() {
        activeArticleService = null;
        articleDisplayContainer.classList.add('hidden');
    }

    function showSlide(index) {
        if (totalSlides === 0) return;
        currentSlideIndex = (index + totalSlides) % totalSlides;
        slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

        document.querySelectorAll('#blog-carousel-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlideIndex);
        });
        updateArrows();
    }
    
    function updateArrows() {
        const show = totalSlides > 1;
        prevArrow.style.display = show ? 'block' : 'none';
        nextArrow.style.display = show ? 'block' : 'none';
    }

    initBlogSection();
});