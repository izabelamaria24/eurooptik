const CACHE_SECONDS = 60 * 60 * 24 * 30; // 30 days

type PlacesReview = {
    rating: number;
    text?: { text: string; languageCode?: string };
    authorAttribution?: { displayName?: string };
};

type PlacesResponse = {
    reviews?: PlacesReview[];
};

export async function fetchFiveStarReviewTexts(): Promise<string[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_TESTIMONIALS_PLACE_ID;

    if (!apiKey || !placeId) return [];

    try {
        const res = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&key=${apiKey}`,
            {
                next: { revalidate: CACHE_SECONDS },
            },
        );

        if (!res.ok) {
            return [];
        }

        const data: PlacesResponse = await res.json();

        return (data.reviews ?? [])
            .filter((r) => r.rating === 5 && r.text?.text?.trim())
            .map((r) => r.text!.text.trim());
    } catch {
        return [];
    }
}
