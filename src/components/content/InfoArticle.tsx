import Link from "next/link";
import { pageInner, pageShell, typeBody, typeSectionTitle } from "@/lib/classes";

interface InfoArticleProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function InfoArticle({
  eyebrow,
  title,
  description,
  children,
}: InfoArticleProps) {
  return (
    <div className={pageShell}>
      <article className={`${pageInner} mx-auto max-w-3xl`}>
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/50">
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-white/80">{title}</span>
        </nav>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {eyebrow}
        </p>
        <h1 className={`mb-3 font-body font-medium text-white ${typeSectionTitle}`}>
          {title}
        </h1>
        <p className={`mb-8 leading-relaxed text-white/70 ${typeBody}`}>
          {description}
        </p>
        <div className={`space-y-8 leading-relaxed text-white/75 ${typeBody}`}>
          {children}
        </div>
      </article>
    </div>
  );
}
