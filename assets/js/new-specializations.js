import { documentToHtmlString } from 'https://cdn.jsdelivr.net/npm/@contentful/rich-text-html-renderer/+esm';

import { fetchSpecializationsData } from './contentful-service.js';

async function main() {
    const section = document.getElementById('new-specializations');
    if (!section) return;

    const { categories, specializations } = await fetchSpecializationsData();
    if (!categories.length || !specializations.length) {
        console.warn("No specializations data found. Section will not be rendered.");
        section.style.display = 'none';
        return;
    }

    renderCategories(categories);
    renderSpecializationCards(specializations);
    initializeInteractivity(categories, specializations);
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
    const categoryButtons = document.querySelectorAll('.specialization-category-buttons .category-btn');
    const allSpecializationCards = document.querySelectorAll('.specialization-carousel-container .specialization-card');
    const articleContainer = document.querySelector('.specialization-article-container');
    const articleTitle = articleContainer.querySelector('.article-title');
    const articleText = articleContainer.querySelector('.article-text');
    const articleImage = articleContainer.querySelector('.article-image');
    const carouselContainer = document.querySelector('.specialization-carousel-container');
    const prevBtn = document.querySelector('.specialization-carousel-wrapper .prev-card');
    const nextBtn = document.querySelector('.specialization-carousel-wrapper .next-card');

    let globalIndex = 0;
    let visibleCards = 3;

    function updateVisibleCardsCount() {
        if (window.innerWidth <= 767) visibleCards = 1;
        else if (window.innerWidth <= 991) visibleCards = 2;
        else visibleCards = 3;
    }

    function updateCarousel() {
        const cardWidth = allSpecializationCards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(carouselContainer).getPropertyValue('gap')) || 0;
        const totalCardWidth = cardWidth + gap;
        
        carouselContainer.style.transform = `translateX(-${globalIndex * totalCardWidth}px)`;
        prevBtn.disabled = globalIndex === 0;
        nextBtn.disabled = globalIndex >= allSpecializationCards.length - visibleCards;
        syncCategoryButtons();
    }
    
    function syncCategoryButtons() {
        const currentCard = allSpecializationCards[globalIndex];
        const activeCategorySlug = currentCard.dataset.category;
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === activeCategorySlug);
        });
    }

    nextBtn.addEventListener('click', () => {
        const remainingCards = allSpecializationCards.length - (globalIndex + visibleCards);
        if (remainingCards > 0) {
            globalIndex += visibleCards;
        } else if (remainingCards <= 0) {
            globalIndex = allSpecializationCards.length - visibleCards;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (globalIndex > 0) {
            globalIndex = Math.max(0, globalIndex - visibleCards);
        }
        updateCarousel();
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
    
    allSpecializationCards.forEach(card => {
        card.addEventListener('click', function() {
            allSpecializationCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const specializationSlug = this.dataset.specialization;
            const articleData = specializations.find(spec => spec.slug === specializationSlug);
            if (articleData && articleData.articleDescription) {
                articleTitle.textContent = articleData.articleTitle;
                articleText.innerHTML = documentToHtmlString(articleData.articleDescription);
                articleImage.innerHTML = `<img src="${articleData.articleImage}" alt="${articleData.articleTitle}">`;
                showArticle();
            } else {
                hideArticle();
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

    window.addEventListener('resize', () => {
        updateVisibleCardsCount();
        updateCarousel();
    });

    updateVisibleCardsCount();
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', main);