import { documentToHtmlString } from 'https://cdn.jsdelivr.net/npm/@contentful/rich-text-html-renderer/+esm';

import { fetchArticleBySlug } from './contentful-service.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    const articleContainer = document.getElementById('article-container');
    const articleNotFound = document.getElementById('article-not-found');

    const articleTitleEl = document.getElementById('article-title');
    const articleAuthorEl = document.getElementById('article-author');
    const articleContentEl = document.getElementById('article-content');

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        showNotFound();
        return;
    }

    const articleData = await fetchArticleBySlug(slug);

    if (articleData) {
        displayArticle(articleData);
    } else {
        showNotFound();
    }
    
    function displayArticle(data) {
        document.title = `${data.title} | Clinica Oftalmologică`;

        articleTitleEl.textContent = data.title;
        articleAuthorEl.textContent = data.doctors.length > 0 ? `De Dr. ${data.doctors.join(', ')}` : '';
        articleContentEl.innerHTML = documentToHtmlString(data.content);

        loader.style.display = 'none';
        articleContainer.style.display = 'block';
    }

    function showNotFound() {
        loader.style.display = 'none';
        articleNotFound.style.display = 'block';
    }
});