import { NextResponse } from "next/server";

const PLACES = [
  { name: "Clinica Bacău", placeId: "ChIJb2SJxiVwtUARCUeoB78IhLA" },
  { name: "Cabinet Bacău", placeId: "ChIJK9n9-yZwtUARlZel3LYNgsk" },
  { name: "Cabinet Comănești", placeId: "ChIJrdXc0AA9tUARJOwLw5pt1Cw" },
  { name: "Cabinet Onești", placeId: "ChIJYzTo9PAGtUARLakEXiQB-0A" },
  { name: "Cabinet Moinești", placeId: "ChIJoxkZRmc-tUAR2eNyJg91WwA" },
];

const FIELDS = "rating,userRatingCount,displayName";

export const revalidate = 60 * 60 * 24; // 24 hours

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { rating: null, reviews: null, location: null },
      { status: 200 }
    );
  }

  try {
    const payloads = await Promise.all(
      PLACES.map(async (place) => {
        const response = await fetch(
          `https://places.googleapis.com/v1/places/${place.placeId}?fields=${FIELDS}&key=${apiKey}`,
          { next: { revalidate: 60 * 60 * 24 } }
        );
        if (!response.ok) return null;
        const data = await response.json();
        return {
          name: place.name,
          rating: data.rating,
          userRatingCount: data.userRatingCount,
        };
      })
    );

    const valid = payloads
      .filter(
        (
          item
        ): item is { name: string; rating: number; userRatingCount: number } =>
          Boolean(item?.rating && item?.userRatingCount)
      )
      .sort((a, b) =>
        b.rating === a.rating
          ? b.userRatingCount - a.userRatingCount
          : b.rating - a.rating
      );

    if (!valid.length) {
      return NextResponse.json({ rating: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        rating: valid[0].rating.toFixed(1),
        reviews: valid[0].userRatingCount,
        location: valid[0].name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[google-reviews]", error);
    return NextResponse.json(
      { rating: null, reviews: null, location: null },
      { status: 200 }
    );
  }
}
