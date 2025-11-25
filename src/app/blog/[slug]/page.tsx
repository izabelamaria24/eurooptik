import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getArticleBySlug, fetchArticles } from "@/lib/contentful";

type Params = Promise<{
  slug: string;
}>;

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {article.serviceName}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{article.title}</h1>
        {article.doctors.length > 0 && (
          <p className="text-sm text-slate-500">
            de {article.doctors.join(", ")}
          </p>
        )}
        <div className="space-y-4 text-base leading-relaxed text-slate-700">
          {article.content
            ? documentToReactComponents(article.content)
            : "Conținut indisponibil."}
        </div>
      </div>
    </main>
  );
}

