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
    if (!reviewContainer) {
        return;
    }

    function createFetchRequest(name, placeId) {
        const url = `https://places.googleapis.com/v1/places/${placeId}?fields=rating,userRatingCount,displayName&key=${API_KEY}`;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.warn(`Could not fetch data for ${name}. Status: ${response.status}`);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    data.locationName = name; 
                }
                return data;
            })
            .catch(error => {
                 console.error(`Error fetching for ${name}:`, error);
                 return null; 
            });
    }

    const promises = Object.entries(PLACES_IDS).map(([name, id]) => createFetchRequest(name, id));

    Promise.all(promises)
        .then(results => {
            const validResults = results.filter(data => data && data.rating && data.userRatingCount);

            if (validResults.length === 0) {
                reviewContainer.style.display = 'none'; 
                return;
            }

            let bestLocation = validResults[0];
            for (let i = 1; i < validResults.length; i++) {
                const currentLocation = validResults[i];
                if (currentLocation.rating > bestLocation.rating) {
                    bestLocation = currentLocation;
                } else if (currentLocation.rating === bestLocation.rating && currentLocation.userRatingCount > bestLocation.userRatingCount) {
                    bestLocation = currentLocation;
                }
            }

            const rating = bestLocation.rating.toFixed(1);
            const totalReviews = bestLocation.userRatingCount;

            const reviewHtml = `
                <i class="fas fa-star"></i> 
                <strong>${rating} stele</strong> 
                din ${totalReviews} recenzii pe Google
            `;
            
            reviewContainer.innerHTML = reviewHtml;
            reviewContainer.style.opacity = 1; // Fade in
        })
        .catch(error => {
            console.error('An overall error occurred while fetching reviews:', error);
            reviewContainer.style.display = 'none'; 
        });
});