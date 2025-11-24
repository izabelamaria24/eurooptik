"use client";

import { useEffect, useState } from "react";

type ReviewState = {
  rating: string | null;
  reviews: number | null;
  location: string | null;
};

type Props = {
  variant?: "chip" | "card";
};

export function GoogleReviewBadge({ variant = "chip" }: Props) {
  const [data, setData] = useState<ReviewState>({
    rating: null,
    reviews: null,
    location: null,
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((payload) => {
        if (!isMounted) return;
        setData({
          rating: payload.rating ?? null,
          reviews: payload.reviews ?? null,
          location: payload.location ?? null,
        });
      })
      .catch(() => {
        if (isMounted) {
          setData({ rating: null, reviews: null, location: null });
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!data.rating || !data.reviews) {
    return null;
  }

  if (variant === "card") {
    return (
      <div className="rounded-3xl border border-white/50 bg-white/95 px-6 py-4 text-left text-slate-900 shadow-2xl shadow-secondary/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl text-[#f7b500]">★</span>
          <div>
            <p className="text-lg font-semibold">
              {data.rating} stele din {data.reviews} recenzii
            </p>
            <p className="text-sm text-slate-500">
              Google Reviews {data.location ? `· ${data.location}` : ""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-secondary/30 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg shadow-secondary/15">
      <span className="rounded-full bg-secondary/90 px-2 py-1 text-white">
        ★
      </span>
      <span>
        {data.rating} / 5 din {data.reviews} recenzii Google
        {data.location ? ` · ${data.location}` : ""}
      </span>
    </div>
  );
}
