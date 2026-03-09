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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setData({ rating: null, reviews: null, location: null });
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const stars = (
    <span className="text-[#f7b500] tracking-tight">{"★".repeat(5)}</span>
  );

  if (loading) {
    if (variant === "card") {
      return (
        <div className="w-full animate-pulse rounded-3xl border border-white/30 bg-white/60 px-6 py-5 shadow-xl">
          <div className="flex items-baseline gap-2">
            {stars}
            <div className="h-5 w-12 rounded bg-slate-200" />
          </div>
          <div className="mt-1 h-3 w-36 rounded bg-slate-200" />
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-3 rounded-full border border-secondary/30 bg-white/90 px-5 py-2 text-sm shadow-lg animate-pulse">
        {stars}
        <div className="h-3 w-40 rounded bg-slate-200" />
      </div>
    );
  }

  if (!data.rating || !data.reviews) {
    return null;
  }

  if (variant === "card") {
    return (
      <div className="w-full rounded-3xl border border-white/50 bg-white/95 px-6 py-5 text-left text-slate-900 shadow-2xl shadow-secondary/20">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              {stars}
              <p className="text-xl font-bold">{data.rating} / 5</p>
            </div>
            <p className="text-sm text-slate-500">
              {data.reviews} recenzii Google
              {data.location ? ` · ${data.location}` : ""}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-secondary/30 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-800 shadow-lg shadow-secondary/15">
      {stars}
      <span>
        {data.rating} / 5 &middot; {data.reviews} recenzii Google
      </span>
    </div>
  );
}
