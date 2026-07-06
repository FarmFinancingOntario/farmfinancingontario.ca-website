type ServiceCardProps = {
  title: string;
  description: string;
  tone?: "light" | "white";
};

function ServiceCard({ title, description, tone = "white" }: ServiceCardProps) {
  const background = tone === "light" ? "bg-white" : "bg-cream";

  return (
    <article
      className={`h-full rounded-lg border border-oat p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${background}`}
    >
      <div className="mb-5 h-1 w-12 rounded-full bg-wheat" aria-hidden="true" />
      <h3 className="text-xl font-semibold text-moss">{title}</h3>
      <p className="mt-3 leading-7 text-stone-700">{description}</p>
    </article>
  );
}

export default ServiceCard;
