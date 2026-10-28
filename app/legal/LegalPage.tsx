import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalSection = { title: string; content: ReactNode };

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: LegalSection[] }) {
  return (
    <main className="legalPage">
      <header className="legalHeader">
        <div className="container legalNav">
          <Link className="brand" href="/" aria-label="Voltar à página inicial da Apollun.Dev">
            <Image className="brandIcon" src="/apollun-icon.png" alt="" width={40} height={40} priority unoptimized />
            APOLLUN<span>.DEV</span>
          </Link>
          <Link className="legalBack" href="/">Voltar ao site <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <section className="legalHero">
        <div className="legalGrid" />
        <div className="container legalHeroInner">
          <span className="eyebrow"><i />{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
          <span className="legalUpdated">Última atualização: 27 de outubro de 2026</span>
        </div>
      </section>

      <section className="legalContent">
        <div className="container legalLayout">
          <aside className="legalAside">
            <strong>Neste documento</strong>
            <nav aria-label="Índice do documento">
              {sections.map((section, index) => <a key={section.title} href={`#secao-${index + 1}`}>{String(index + 1).padStart(2, "0")} · {section.title}</a>)}
            </nav>
            <div className="legalContactCard">
              <span>Canal de contato</span>
              <strong>WhatsApp Apollun.Dev</strong>
              <a href="https://wa.me/5511940312713" target="_blank" rel="noreferrer">+55 11 94031-2713</a>
            </div>
          </aside>

          <article className="legalArticle">
            {sections.map((section, index) => (
              <section id={`secao-${index + 1}`} key={section.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                <div>{section.content}</div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <footer className="legalFooter">
        <div className="container">
          <span>© 2026 Apollun.Dev</span>
          <div><Link href="/politica-de-privacidade">Política de Privacidade</Link><Link href="/termos-de-uso">Termos de Uso</Link></div>
          <Link href="/">Página inicial</Link>
        </div>
      </footer>
    </main>
  );
}
