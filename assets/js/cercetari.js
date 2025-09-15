import { fetchCercetariFromContentful } from './contentful-service.js';
import { documentToHtmlString } from 'https://esm.sh/@contentful/rich-text-html-renderer';

document.addEventListener('DOMContentLoaded', () => {
    const cuprinsContainer = document.getElementById('cercetari-cuprins-list');
    const articleDisplayContainer = document.getElementById('cercetari-article-display-container');
    const articleTitleEl = document.getElementById('cercetari-article-display-title');
    const articleContentEl = document.getElementById('cercetari-article-display-content');

    let articlesBySlug = {};
    let allArticles = [];

    async function initCercetariSection() {
        try {
            const articlesData = await fetchCercetariFromContentful();
            if (!articlesData) {
                console.error('Eroare: Nu s-au putut încărca articolele de cercetare.');
                return;
            }

            allArticles = Object.values(articlesData);
            allArticles.forEach(article => {
                if(article.slug) {
                    articlesBySlug[article.slug] = article;
                }
            });

            renderCuprins();

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

            checkUrlForArticle();

        } catch (error) {
            console.error("A apărut o eroare majoră în `initCercetariSection`:", error);
        }
    }

    function renderCuprins() {
        if (!cuprinsContainer) return;
        cuprinsContainer.innerHTML = ''; 

        allArticles.forEach(article => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');

            link.className = 'cercetare-btn';
            link.href = `#${article.slug}`;
            link.textContent = article.title;
            link.dataset.slug = article.slug;

            link.addEventListener('click', handleArticleClick);

            listItem.appendChild(link);
            cuprinsContainer.appendChild(listItem);
        });
    }

    function handleArticleClick(event) {
        event.preventDefault();
        const slug = event.currentTarget.dataset.slug;
        const articleData = articlesBySlug[slug];

        if (articleData) {
            displayArticle(articleData, true);
        }
    }

    function displayArticle(article, updateHistory = true) {
        if (!article || !articleDisplayContainer) return;

        document.querySelectorAll('#cercetari-cuprins-list .cercetare-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeLink = document.querySelector(`#cercetari-cuprins-list a[data-slug="${article.slug}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        articleTitleEl.textContent = article.title || 'Titlu indisponibil';

        if (article.content && article.content.nodeType === 'document') {
             articleContentEl.innerHTML = documentToHtmlString(article.content);
        } else {
             articleContentEl.innerHTML = '<p>Conținut indisponibil.</p>';
        }

        articleDisplayContainer.classList.remove('hidden');
        articleDisplayContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (updateHistory) {
            const newHash = `#${article.slug}`;
            if (window.location.hash !== newHash) {
                history.pushState({ slug: article.slug }, '', newHash);
            }
        }
    }

    function hideArticle() {
        if (articleDisplayContainer) {
            articleDisplayContainer.classList.add('hidden');
        }
        document.querySelectorAll('#cercetari-cuprins-list .cercetare-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    function checkUrlForArticle() {
        const hash = window.location.hash.substring(1);
        if (hash && articlesBySlug[hash]) {
            displayArticle(articlesBySlug[hash], false); 
        }
    }

    initCercetariSection();
});