document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'AIzaSyDWOVjCHF1yjvURvWPPMRgAdaXmxLCNhF0';

    const PLACES_IDS = {
        "Clinica Bacău": "ChIJb2SJxiVwtUARCUeoB78IhLA",
        "Cabinet Bacău": "ChIJK9n9-yZwtUARlZel3LYNgsk",
        "Cabinet Comănești": "ChIJrdXc0AA9tUARJOwLw5pt1Cw",
        "Cabinet Onești": "ChIJYzTo9PAGtUARLakEXiQB-0A",
        "Cabinet Moinești": "ChIJoxkZRmc-tUAR2eNyJg91WwA"
    };

    const reviewElementId = 'google-reviews-display';
    const reviewContainer = document.getElementById(reviewElementId);
    if (!reviewContainer) return;

    const LAST_FETCH_KEY = "google_reviews_last_fetch";
    const CACHE_KEY = "google_reviews_cache";

    const now = Date.now();
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    if (lastFetch && (now - Number(lastFetch)) < THIRTY_DAYS) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const bestLocation = JSON.parse(cached);
            renderResult(bestLocation);
            return;
        }
    }

    function fetchReviews() {
        const requests = Object.entries(PLACES_IDS).map(([name, placeId]) => {
            const url = `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,displayName&key=${API_KEY}`;
            return fetch(url)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data) data.locationName = name;
                    return data;
                })
                .catch(() => null);
        });

        Promise.all(requests).then(results => {
            const valid = results.filter(r => r && r.rating && r.userRatingCount);
            if (!valid.length) return reviewContainer.style.display = "none";

            let best = valid.reduce((a, b) => 
                (b.rating > a.rating) ||
                (b.rating === a.rating && b.userRatingCount > a.userRatingCount)
                ? b : a
            );

            localStorage.setItem(LAST_FETCH_KEY, now.toString());
            localStorage.setItem(CACHE_KEY, JSON.stringify(best));

            renderResult(best);
        });
    }

    function renderResult(bestLocation) {
        const rating = bestLocation.rating.toFixed(1);
        const total = bestLocation.userRatingCount;

        reviewContainer.innerHTML = `
            <i class="fas fa-star"></i> 
            <strong>${rating} stele</strong>
            din ${total} recenzii pe Google
        `;
        reviewContainer.style.opacity = 1;
    }

    fetchReviews();
});
