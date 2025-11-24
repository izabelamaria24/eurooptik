type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  const alignmentClass = "mx-auto text-center";
  const descriptionWidth = "md:w-3/4";

  return (
    <div id={id} className={`mb-14 space-y-4 ${alignmentClass} fade-slide`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.4em] text-primary">
          <span className="tag-dot" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="text-balance text-3xl font-semibold leading-tight text-slate-900 md:text-[3rem]">
        {title}
      </h2>
      {description && (
        <p className={`mx-auto text-balance text-base text-slate-600 md:text-lg ${descriptionWidth}`}>
          {description}
        </p>
      )}
    </div>
  );
}
