import { documentToHtmlString } from 'https://esm.sh/@contentful/rich-text-html-renderer';
import { INLINES } from 'https://esm.sh/@contentful/rich-text-types';

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
    
    const servicesSection = document.getElementById('our-services-section');
    const servicesFilterContainer = document.getElementById('services-filter-container');

    let servicesByCategory = {};
    let allArticlesData = {};
    let articlesBySlug = {}; 
    let categories = [];
    let activeCategorySlug = '';
    let currentSlideIndex = 0;
    let totalSlides = 0;

    let serviceIdToCategoryMap = {}; 

    const getArticlesPerSlide = () => window.innerWidth <= 768 ? 1 : 3;

    async function initBlogSection() {
        try {
            const [serviceFileResponse, articlesFileResponse] = await Promise.all([
                fetch('api/services.json'),
                fetch('api/articles.json')
            ]);

            if (!serviceFileResponse.ok || !articlesFileResponse.ok) throw new Error('Failed to fetch data.');

            const [serviceResponse, articlesData] = await Promise.all([
                serviceFileResponse.json(),
                articlesFileResponse.json()
            ]);

            if (!serviceResponse || !serviceResponse.servicesData) return;

            categories = serviceResponse.categories;
            servicesByCategory = transformServicesToArticles(serviceResponse.servicesData);
            
            mapServiceIdsToCategories(serviceResponse.servicesData);

            allArticlesData = articlesData;

            Object.values(allArticlesData).forEach(article => {
                if(article.slug) articlesBySlug[article.slug] = article;
            });

            if (categories.length > 0) renderFilters();

            window.addEventListener('blogScroll', handleBlogScroll);
            prevArrow.addEventListener('click', () => showSlide(currentSlideIndex - 1));
            nextArrow.addEventListener('click', () => showSlide(currentSlideIndex + 1));
            
            articleContentEl.addEventListener('click', handleServiceLinkClick);

            window.addEventListener('resize', () => {
                if (activeCategorySlug) {
                    renderCarousel(servicesByCategory[activeCategorySlug]);
                    hideArticle();
                }
            });

            window.addEventListener('popstate', (event) => {
                if (event.state && event.state.slug) {
                    const articleData = articlesBySlug[event.state.slug];
                    if (articleData) displayArticle(articleData, false);
                } else {
                    hideArticle();
                }
            });
            checkUrlForArticle();

        } catch (error) {
            console.error("Error initializing blog:", error);
        }
    }

    function mapServiceIdsToCategories(servicesData) {
        Object.keys(servicesData).forEach(categorySlug => {
            const categoryContent = servicesData[categorySlug];
            
            const mapItem = (item) => {
                if (item && typeof item === 'object' && item.id) {
                    serviceIdToCategoryMap[item.id] = categorySlug;
                }
            };

            if (categoryContent.items) {
                Object.values(categoryContent.items).forEach(mapItem);
            } else {
                Object.values(categoryContent).forEach(subCategory => {
                    if (typeof subCategory === 'object') {
                        Object.values(subCategory).forEach(mapItem);
                    }
                });
            }
        });
    }

    function handleServiceLinkClick(event) {
        const link = event.target.closest('.js-service-trigger');
        if (!link) return;

        event.preventDefault();
        const categorySlug = link.dataset.catSlug;
        
        if (categorySlug) {
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (servicesFilterContainer) {
                const targetBtn = servicesFilterContainer.querySelector(`button[data-category="${categorySlug}"]`);
                
                if (targetBtn) {
                    console.log("Clicking category button:", categorySlug);
                    targetBtn.click();
                } else {
                    console.warn(`Button for category "${categorySlug}" not found in services section.`);
                }
            }
        } else {
            console.warn("Category slug not found for this link.");
        }
    }

    function displayArticle(article, updateHistory = true) {
        if (!article || !articleDisplayContainer) return;

        articleTitleEl.textContent = article.title || 'Titlu indisponibil';
        articleAuthorEl.textContent = article.doctors && article.doctors.length > 0 ? `De ${article.doctors.join(', ')}` : '';
        
        if (article.content && article.content.nodeType === 'document') {
            const renderOptions = {
                renderNode: {
                    [INLINES.ENTRY_HYPERLINK]: (node, next) => {
                        const linkText = next(node.content);
                        const targetId = node.data.target.sys.id;
                        
                        const categorySlug = serviceIdToCategoryMap[targetId];

                        return `<a href="#" 
                                class="js-service-trigger" 
                                style="color: var(--primary-color); text-decoration: underline; font-weight: 600; cursor: pointer;" 
                                data-cat-slug="${categorySlug || ''}">
                                ${linkText}
                                </a>`;
                    }
                }
            };
            articleContentEl.innerHTML = documentToHtmlString(article.content, renderOptions);
        } else {
            articleContentEl.innerHTML = '<p>Conținut indisponibil.</p>';
        }

        articleDisplayContainer.classList.remove('hidden');
        articleDisplayContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (updateHistory) {
            const newHash = `#${article.slug}`;
            history.pushState({ slug: article.slug }, '', newHash);
        }
    }

    function handleBlogScroll(event) {
        const { articleSlug, categorySlug } = event.detail;
        if (!categorySlug || !articleSlug) return;
        setActiveCategory(categorySlug, false); 
        setTimeout(() => {
            const allCards = slider.querySelectorAll('.blog-article-card');
            let targetCard = null;
            allCards.forEach((card) => {
                if (card.dataset.articleSlug === articleSlug) targetCard = card;
            });
            if (targetCard) {
                const targetSlideIndex = Math.floor(Array.from(allCards).indexOf(targetCard) / getArticlesPerSlide());
                showSlide(targetSlideIndex);
                document.querySelectorAll('.blog-article-card.highlight').forEach(c => c.classList.remove('highlight'));
                targetCard.classList.add('highlight');
                const articleData = articlesBySlug[articleSlug];
                if (articleData) displayArticle(articleData, true); 
            }
        }, 100); 
    }

    function checkUrlForArticle() {
        const hash = window.location.hash.substring(1); 
        if (hash && articlesBySlug[hash]) displayArticle(articlesBySlug[hash], false); 
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
            const groupWrapper = document.createElement('div');
            groupWrapper.className = 'category-group-wrapper';

            const catBtn = document.createElement('button');
            catBtn.className = 'filter-btn';
            catBtn.textContent = category.name; 
            catBtn.dataset.slug = category.slug;

            const subMenu = document.createElement('div');
            subMenu.className = 'blog-sub-menu';
            subMenu.id = `submenu-${category.slug}`;

            const items = servicesByCategory[category.slug] || [];

            if (items.length === 0) {
                const empty = document.createElement('div');
                empty.textContent = "Nu există articole.";
                empty.style.padding = "10px 0 10px 30px";
                empty.style.color = "#999";
                subMenu.appendChild(empty);
            } else {
                items.forEach(item => {
                    const title = item.title;
                    const articleData = allArticlesData[title];
                    const hasArticle = articleData && articleData.slug;

                    const link = document.createElement('a');
                    link.className = 'blog-sub-link';
                    link.textContent = title;

                    if (hasArticle) {
                        link.href = `pages/articol.html?slug=${articleData.slug}`;
                        
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            
                            document.querySelectorAll('.blog-sub-link').forEach(l => l.classList.remove('active-article'));
                            link.classList.add('active-article');

                            displayArticle(articleData, true);

                            if (articleDisplayContainer) {
                                setTimeout(() => {
                                    const offset = 100; 
                                    const bodyRect = document.body.getBoundingClientRect().top;
                                    const elementRect = articleDisplayContainer.getBoundingClientRect().top;
                                    const elementPosition = elementRect - bodyRect;
                                    const offsetPosition = elementPosition - offset;

                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                }, 100);
                            }
                        });
                    } else {
                        link.classList.add('disabled');
                        link.addEventListener('click', (e) => e.preventDefault());
                    }

                    subMenu.appendChild(link);
                });
            }

            catBtn.addEventListener('click', () => {
                const isActive = catBtn.classList.contains('active');
                
                if (!isActive) {
                    catBtn.classList.add('active');
                    subMenu.classList.add('open');
                } else {
                    catBtn.classList.remove('active');
                    subMenu.classList.remove('open');
                }
            });

            groupWrapper.appendChild(catBtn);
            groupWrapper.appendChild(subMenu);
            filterContainer.appendChild(groupWrapper);
        });
    }
    function toggleCategory(clickedBtn, targetSubMenu) {
        const isActive = clickedBtn.classList.contains('active');

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.blog-sub-menu').forEach(menu => menu.classList.remove('open'));
        
        if (!isActive) {
            clickedBtn.classList.add('active');
            targetSubMenu.classList.add('open');
        } else {
            clickedBtn.classList.remove('active');
            targetSubMenu.classList.remove('open');
        }
    }

    function setActiveCategory(slug, shouldScroll = true) {
        const btn = filterContainer.querySelector(`.filter-btn[data-slug="${slug}"]`);
        const subMenu = document.getElementById(`submenu-${slug}`);
        
        if (btn && subMenu) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.blog-sub-menu').forEach(m => m.classList.remove('open'));

            btn.classList.add('active');
            subMenu.classList.add('open');

            if (shouldScroll) {
                const blogSection = document.getElementById('blog-section');
                if (blogSection) blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
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
                    card.addEventListener('click', (e) => { e.preventDefault(); displayArticle(articleData, true); });
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

    function hideArticle() {
        if (articleDisplayContainer) articleDisplayContainer.classList.add('hidden');
        document.querySelectorAll('.blog-article-card.highlight').forEach(c => c.classList.remove('highlight'));
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