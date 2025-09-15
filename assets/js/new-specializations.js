import { documentToHtmlString } from 'https://esm.sh/@contentful/rich-text-html-renderer';
import { BLOCKS } from 'https://esm.sh/@contentful/rich-text-types';

async function main() {
    const section = document.getElementById('new-specializations');
    if (!section) return;

    try {
        // MODIFICATION: Fetch from the local JSON file instead of Contentful API
        const response = await fetch('/api/specializations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { categories, specializations } = await response.json();
        // END MODIFICATION

        if (!categories || !categories.length || !specializations || !specializations.length) {
            section.style.display = 'none';
            return;
        }

        renderCategories(categories);
        renderSpecializationCards(specializations);
        initializeInteractivity(categories, specializations);
    } catch (error) {
        console.error("Failed to initialize specializations section:", error);
        section.style.display = 'none';
    }
}

function renderCategories(categories) {
    const container = document.querySelector('.specialization-category-buttons');
    if (!container) return;
    container.innerHTML = categories.map((cat, index) => `
        <button class="btn btn-round category-btn ${index === 0 ? 'active' : ''}" data-category="${cat.slug}">${cat.name}</button>
    `).join('');
}

function renderSpecializationCards(specializations) {
    const container = document.querySelector('.specialization-carousel-container');
    if (!container) return;
    container.innerHTML = specializations.map(spec => `
        <div class="specialization-card" data-specialization="${spec.slug}" data-category="${spec.categorySlug}">
            <div class="card-image-container"><img src="${spec.cardImage}" alt="${spec.cardTitle}"></div>
            <h4 class="card-title">${spec.cardTitle}</h4>
        </div>
    `).join('');
}

function initializeInteractivity(categories, specializations) {
    const contentWrapper = document.querySelector('.article-content-wrapper');
    const articleRightColumn = document.querySelector('.article-right-column');
    const categoryButtons = document.querySelectorAll('.specialization-category-buttons .category-btn');
    const allSpecializationCards = document.querySelectorAll('.specialization-carousel-container .specialization-card');
    const articleContainer = document.querySelector('.specialization-article-container');
    const articleTitle = articleContainer.querySelector('.article-title');
    const articleText = articleContainer.querySelector('.article-text');
    const articleImage = articleContainer.querySelector('.article-image');
    const testimonialContainer = articleContainer.querySelector('.article-testimonial');
    const testimonialContentWrapper = testimonialContainer.querySelector('.testimonial-content-wrapper');
    const authorImage = testimonialContainer.querySelector('.testimonial-author-image img');
    const testimonialLink = testimonialContainer.querySelector('.testimonial-scroll-link');
    const testimonialQuote = testimonialContainer.querySelector('.testimonial-quote');
    const blogLinksContainer = articleContainer.querySelector('.blog-links-container');
    const blogLinksList = articleContainer.querySelector('.blog-links-list');
    const carouselContainer = document.querySelector('.specialization-carousel-container');
    const prevBtn = document.querySelector('.specialization-carousel-wrapper .prev-card');
    const nextBtn = document.querySelector('.specialization-carousel-wrapper .next-card');

    let globalIndex = 0;
    let visibleCards = 3;

    allSpecializationCards.forEach(card => {
        card.addEventListener('click', function() {
            allSpecializationCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const specializationSlug = this.dataset.specialization;
            const articleData = specializations.find(spec => spec.slug === specializationSlug);

            if (!articleData) {
                hideArticle();
                return;
            }

            contentWrapper.classList.remove('layout-float');
            articleText.classList.remove('collapsed', 'collapsed-mobile');
            articleText.style.removeProperty('max-height');
            
            const existingLink = articleRightColumn.querySelector('.see-more-link');
            if (existingLink) existingLink.remove();

            articleTitle.textContent = articleData.articleTitle;
            articleImage.innerHTML = `<img src="${articleData.articleImage}" alt="${articleData.articleTitle}">`;

            if (articleData.articleDescription?.nodeType === 'document') {
                const options = { renderNode: { [BLOCKS.EMBEDDED_ASSET]: (node) => `<img src="${node.data.target.fields.file.url}" alt="${node.data.target.fields.description || ''}"/>` } };
                articleText.innerHTML = documentToHtmlString(articleData.articleDescription, options);
            } else {
                articleText.innerHTML = '';
            }

            const hasTestimonial = articleData.testimonialId && articleData.testimonialQuote;
            testimonialContentWrapper.style.display = hasTestimonial ? 'flex' : 'none';
            if (hasTestimonial) {
                testimonialQuote.textContent = `‘${articleData.testimonialQuote.substring(0, 120)}…’`;
                testimonialLink.dataset.testimonialId = articleData.testimonialId;
                authorImage.src = articleData.testimonialAuthorImage || '';
                authorImage.parentElement.style.display = articleData.testimonialAuthorImage ? 'block' : 'none';
            }

            const hasBlogLinks = articleData.articles?.length > 0;
            blogLinksContainer.style.display = hasBlogLinks ? 'block' : 'none';
            if (hasBlogLinks) {
                blogLinksList.innerHTML = articleData.articles.map(article =>
                    article?.title && article?.slug && article?.categorySlug ?
                    `<a href="#" class="blog-link-item" data-article-slug="${article.slug}" data-category-slug="${article.categorySlug}">${article.title}</a>` : ''
                ).join('');
            }
            testimonialContainer.style.display = (hasTestimonial || hasBlogLinks) ? 'block' : 'none';

            showArticle();
            
            const img = articleImage.querySelector('img');

            const setupTruncation = () => {
                const textScrollHeight = articleText.scrollHeight;
                
                if (window.innerWidth <= 767) {
                    const CHARACTER_LIMIT = 128;
                    const textContent = articleText.textContent || articleText.innerText || "";

                    if (textContent.length > CHARACTER_LIMIT) {
                        articleText.classList.add('collapsed-mobile');

                        const seeMoreLink = document.createElement('a');
                        seeMoreLink.className = 'see-more-link';
                        seeMoreLink.textContent = '...vezi mai mult';
                        articleRightColumn.appendChild(seeMoreLink);

                        seeMoreLink.addEventListener('click', () => {
                            articleText.classList.remove('collapsed-mobile');
                            articleText.style.maxHeight = `${textScrollHeight}px`;
                            seeMoreLink.remove();
                        }, { once: true });
                    }
                } else {
                    const imageHeight = img.offsetHeight;
                    const testimonialHeight = testimonialContainer.offsetHeight;
                    const totalRightColumnHeight = textScrollHeight + testimonialHeight;

                    if (totalRightColumnHeight > imageHeight) {
                        const maxAllowedTextHeight = imageHeight - testimonialHeight;

                        if (maxAllowedTextHeight > 50) {
                            articleText.style.maxHeight = `${maxAllowedTextHeight}px`;
                            articleText.classList.add('collapsed');

                            const seeMoreLink = document.createElement('a');
                            seeMoreLink.className = 'see-more-link';
                            seeMoreLink.textContent = '...vezi mai mult';
                            articleRightColumn.appendChild(seeMoreLink);

                            seeMoreLink.addEventListener('click', () => {
                                articleText.classList.remove('collapsed');
                                articleText.style.maxHeight = `${textScrollHeight}px`;
                                contentWrapper.classList.add('layout-float');
                                seeMoreLink.remove();
                            }, { once: true });
                        }
                    }
                }
            };

            if (img.complete) {
                setupTruncation();
            } else {
                img.addEventListener('load', setupTruncation);
            }
        });
    });
    

    function showArticle() {
        articleContainer.style.display = 'block';
        setTimeout(() => articleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    function hideArticle() {
        articleContainer.style.display = 'none';
        allSpecializationCards.forEach(c => c.classList.remove('active'));
    }
    
    function updateVisibleCardsCount() {
        if (window.innerWidth <= 767) visibleCards = 1;
        else if (window.innerWidth <= 991) visibleCards = 2;
        else visibleCards = 3;
    }

    function updateCarousel() {
        if (allSpecializationCards.length === 0) return;
        const cardWidth = allSpecializationCards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(carouselContainer).getPropertyValue('gap')) || 0;
        const totalCardWidth = cardWidth + gap;
        carouselContainer.style.transform = `translateX(-${globalIndex * totalCardWidth}px)`;
        prevBtn.disabled = globalIndex === 0;
        nextBtn.disabled = globalIndex >= allSpecializationCards.length - visibleCards;
        syncCategoryButtons();
    }
    
    function syncCategoryButtons() {
        if (allSpecializationCards.length === 0) return;
        const currentCard = allSpecializationCards[globalIndex];
        if (!currentCard) return;
        const activeCategorySlug = currentCard.dataset.category;
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === activeCategorySlug);
        });
    }

    nextBtn.addEventListener('click', () => {
        const maxIndex = allSpecializationCards.length - visibleCards;
        if (globalIndex < maxIndex) {
            globalIndex = Math.min(globalIndex + visibleCards, maxIndex);
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (globalIndex > 0) {
            globalIndex = Math.max(0, globalIndex - visibleCards);
            updateCarousel();
        }
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.dataset.category;
            const firstCardOfCategory = Array.from(allSpecializationCards).find(card => card.dataset.category === targetCategory);
            const targetIndex = Array.from(allSpecializationCards).indexOf(firstCardOfCategory);
            if (targetIndex !== -1) {
                globalIndex = targetIndex;
                updateCarousel();
            }
        });
    });

    window.addEventListener('resize', () => {
        updateVisibleCardsCount();
        updateCarousel();
        const activeCard = document.querySelector('.specialization-card.active');
        if (activeCard && articleContainer.style.display === 'block') {
            activeCard.click();
        }
    });

    testimonialLink.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.dataset.testimonialId;
        const testimonialsSection = document.getElementById('testimoniale');
        if (targetId && testimonialsSection) {
            sessionStorage.setItem('scrollToTestimonial', targetId);
            testimonialsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.dispatchEvent(new CustomEvent('testimonialScroll', { detail: { id: targetId } }));
        }
    });

    blogLinksList.addEventListener('click', function(event) {
        if (event.target.matches('.blog-link-item')) {
            event.preventDefault();
            const link = event.target;
            const articleSlug = link.dataset.articleSlug;
            const categorySlug = link.dataset.categorySlug;
            const blogSection = document.getElementById('blog-section');
            if (articleSlug && categorySlug && blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.dispatchEvent(new CustomEvent('blogScroll', { detail: { articleSlug: articleSlug, categorySlug: categorySlug } }));
            }
        }
    });

    updateVisibleCardsCount();
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', main);