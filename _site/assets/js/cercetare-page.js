document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('cercetare-article-container');
    const articleTitleEl = document.getElementById('cercetare-article-title');
    const articleContentEl = document.getElementById('cercetare-article-content');

    async function fetchAndDisplayArticle() {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        if (!slug) {
            articleContainer.innerHTML = '<p>Articolul nu a fost găsit.</p>';
            return;
        }

        try {
            const articles = await fetchCercetariFromContentful();
            const article = Object.values(articles).find(art => art.slug === slug);

            if (article) {
                articleTitleEl.textContent = article.title;
                if (article.content && article.content.nodeType === 'document') {
                    articleContentEl.innerHTML = documentToHtmlString(article.content);
                } else {
                    articleContentEl.innerHTML = '<p>Conținutul acestui articol nu este disponibil.</p>';
                }
            } else {
                articleContainer.innerHTML = '<p>Articolul specificat nu a putut fi încărcat.</p>';
            }
        } catch (error) {
            console.error('Eroare la încărcarea articolului de cercetare:', error);
            articleContainer.innerHTML = '<p>A apărut o eroare la încărcarea articolului.</p>';
        }
    }

    fetchAndDisplayArticle();
});
