import { fetchServicesFromContentful, fetchArticlesFromContentful } from './contentful-service.js';
import { documentToHtmlString } from 'https://cdn.jsdelivr.net/npm/@contentful/rich-text-html-renderer/+esm';

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
    let articlesBySlug = {}; 
    let categories = [];
    let activeCategorySlug = '';
    let currentSlideIndex = 0;
    let totalSlides = 0;

    const getArticlesPerSlide = () => window.innerWidth <= 768 ? 1 : 3;

    async function initBlogSection() {
        try {
            const [serviceResponse, articlesData] = await Promise.all([
                fetchServicesFromContentful(),
                fetchArticlesFromContentful()
            ]);

            if (!serviceResponse || !serviceResponse.servicesData) {
                console.error('Eroare: Nu s-au putut încărca serviciile pentru blog.');
                return;
            }

            categories = serviceResponse.categories;
            servicesByCategory = transformServicesToArticles(serviceResponse.servicesData);
            allArticlesData = articlesData;

            Object.values(allArticlesData).forEach(article => {
                if(article.slug) {
                    articlesBySlug[article.slug] = article;
                }
            });

            if (categories.length > 0) {
                renderFilters();
                setActiveCategory(categories[0].slug);
            }

            function checkUrlForArticle() {
                const hash = window.location.hash.substring(1); 
                if (hash && articlesBySlug[hash]) {
                    displayArticle(articlesBySlug[hash], false); 
                }
            }
            checkUrlForArticle(); 
           
            prevArrow.addEventListener('click', () => showSlide(currentSlideIndex - 1));
            nextArrow.addEventListener('click', () => showSlide(currentSlideIndex + 1));
            
            window.addEventListener('resize', () => {
                if (activeCategorySlug) {
                    renderCarousel(servicesByCategory[activeCategorySlug]);
                    hideArticle();
                }
            });

            window.addEventListener('popstate', (event) => {
                if (event.state && event.state.slug) {
                    const articleData = articlesBySlug[event.state.slug];
                    if (articleData) {
                        displayArticle(articleData, false);
                    }
                } else {
                    hideArticle();
                }
            });

        } catch (error) {
            console.error("A apărut o eroare majoră în `initBlogSection`:", error);
        }
    }

    function displayArticle(article, updateHistory = true) {
        if (!article || !articleDisplayContainer) return;

        articleTitleEl.textContent = article.title || 'Titlu indisponibil';
        
        articleAuthorEl.textContent = article.doctors && article.doctors.length > 0 
            ? `De ${article.doctors.join(', ')}` 
            : '';
        
        articleContentEl.innerHTML = article.content ? documentToHtmlString(article.content) : '<p>Conținut indisponibil.</p>';

        articleDisplayContainer.classList.remove('hidden');
        articleDisplayContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (updateHistory) {
            const newHash = `#${article.slug}`;
            history.pushState({ slug: article.slug }, '', newHash);
        }
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
                const articleData = allArticlesData[serviceName];
                const hasActualArticle = articleData && articleData.slug;
                const card = document.createElement(hasActualArticle ? 'a' : 'div');
                card.className = 'blog-article-card';
                if (hasActualArticle) {
                    card.href = `pages/articol.html?slug=${articleData.slug}`;
                    card.dataset.articleSlug = articleData.slug;
                    card.addEventListener('click', handleArticleClick);
                } else {
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
    function handleArticleClick(event) {
        event.preventDefault(); 
        const slug = event.currentTarget.dataset.articleSlug;
        const articleData = articlesBySlug[slug];
        if (articleData) {
            displayArticle(articleData, true);
        } else {
            window.location.href = event.currentTarget.href;
        }
    }
    function hideArticle() {
        if (articleDisplayContainer) {
            articleDisplayContainer.classList.add('hidden');
        }
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