"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BarChart3, Blocks, Check, ChevronDown, Code2, Gauge,
  Globe2, Layers3, Menu, MonitorSmartphone, Search, ShieldCheck,
  Moon, ShoppingBag, Sparkles, Star, Sun, X, Zap, HeartPulse, Scale,
  Utensils, Building2, Dumbbell, BriefcaseBusiness, Wrench, RefreshCw,
} from "lucide-react";

const navItems = [
  ["Serviços", "#servicos"], ["Projetos", "#portfolio"],
  ["Processo", "#processo"], ["Sobre", "#diferenciais"],
];

const clients = [
  { name: "Clínicas", icon: HeartPulse },
  { name: "Advogados", icon: Scale },
  { name: "Restaurantes", icon: Utensils },
  { name: "Imobiliárias", icon: Building2 },
  { name: "Academias", icon: Dumbbell },
  { name: "Empresas", icon: BriefcaseBusiness },
  { name: "Prestadores", icon: Wrench },
];

const services = [
  { icon: Globe2, title: "Desenvolvimento Web", text: "Sites rápidos, responsivos e preparados para crescer com seu negócio." },
  { icon: Gauge, title: "Landing Pages", text: "Páginas estratégicas desenhadas para transformar tráfego em oportunidades." },
  { icon: Sparkles, title: "UX/UI Design", text: "Interfaces intuitivas, elegantes e alinhadas à identidade da sua marca." },
  { icon: Search, title: "SEO", text: "Estrutura técnica e conteúdo pensados para aumentar sua visibilidade orgânica." },
  { icon: Blocks, title: "Sistemas Web", text: "Plataformas sob medida para automatizar processos e dar escala à operação." },
  { icon: RefreshCw, title: "Reformulação de Sites", text: "Modernizamos sites antigos para melhorar design, performance, experiência e resultados." },
];

const differences = [
  [Sparkles, "Design exclusivo"], [Code2, "Código limpo"], [Search, "SEO técnico"], [Zap, "Alta performance"],
  [ShieldCheck, "Segurança"], [MonitorSmartphone, "Experiência responsiva"], [Layers3, "Suporte contínuo"], [BarChart3, "Escalabilidade"],
];

const steps = [
  ["01", "Briefing", "Objetivos, público e contexto do negócio."],
  ["02", "Planejamento", "Arquitetura, conteúdo e direção estratégica."],
  ["03", "UX", "Jornadas claras e navegação sem atritos."],
  ["04", "UI", "Interface premium e identidade visual consistente."],
  ["05", "Desenvolvimento", "Código preciso, rápido e escalável."],
  ["06", "Testes", "Qualidade em dispositivos, navegadores e cenários."],
  ["07", "Publicação", "Lançamento acompanhado e configuração final."],
  ["08", "Suporte", "Evolução contínua depois que o site entra no ar."],
];

const plans = [
  { name: "Start", description: "Para colocar uma ideia no ar com qualidade desde o primeiro dia.", items: ["Landing page estratégica", "Design responsivo", "SEO essencial", "Integração de contato"], featured: false },
  { name: "Business", description: "Para empresas que precisam vender confiança e gerar oportunidades.", items: ["Site completo sob medida", "UX/UI personalizado", "SEO técnico", "Analytics e conversão", "Suporte pós-lançamento"], featured: true },
  { name: "Premium", description: "Para produtos e operações que exigem tecnologia de alto nível.", items: ["Projeto digital avançado", "Sistema ou e-commerce", "Integrações personalizadas", "Performance contínua", "Evolução prioritária"], featured: false },
];

const faq = [
  ["Quanto tempo leva para criar um site?", "O prazo depende do escopo. Uma landing page costuma levar de 2 a 4 semanas; sites e sistemas maiores recebem um cronograma próprio após o briefing."],
  ["O projeto é realmente personalizado?", "Sim. Estratégia, estrutura, interface e desenvolvimento são definidos para o contexto da sua empresa. Não trabalhamos com soluções genéricas."],
  ["Meu site será otimizado para celular?", "Sim. Cada tela é planejada e testada para desktop, notebook, tablet e celular, com foco em velocidade e facilidade de uso."],
  ["Vocês cuidam de SEO e performance?", "Sim. Construímos uma base técnica sólida, com semântica, velocidade, indexação e boas práticas consideradas desde o início."],
  ["A Apollun oferece suporte depois da entrega?", "Sim. Podemos acompanhar o projeto após o lançamento com manutenção, melhorias e novas funcionalidades conforme sua operação evolui."],
];

const showcaseProjects = [
  { name: "Srta. Niero", category: "Branding & posicionamento", title: "Forma, direção.", highlight: "Presença de marca.", description: "Uma experiência editorial para comunicar estratégia, autenticidade e propósito.", score: "Real", metric: "Responsivo", badge: "Projeto real", theme: "realty", desktop: "/showcase/niero-desktop.png", tablet: "/showcase/niero-tablet.png", mobile: "/showcase/niero-mobile.png" },
  { name: "Apollun.Dev", category: "Tecnologia & produto digital", title: "Estratégia que vira.", highlight: "Experiência digital.", description: "Performance, design e tecnologia reunidos em uma presença digital de autoridade.", score: "Live", metric: "UX/UI", badge: "Projeto próprio", theme: "commerce", desktop: "/showcase/apollun-desktop.png", tablet: "/showcase/apollun-tablet.png", mobile: "/showcase/apollun-mobile.png" },
  { name: "Pulsar Saúde", category: "Clínica digital", title: "Cuidado simples.", highlight: "Experiência humana.", description: "Agendamentos, especialidades e confiança em uma jornada sem atritos.", score: "98", metric: "SEO 100", badge: "98 Lighthouse", theme: "health", desktop: "", tablet: "", mobile: "" },
];

const projectOptions = ["Landing page", "Site institucional", "Reformulação de site", "Sistema web", "UX/UI Design", "Ainda não tenho certeza"];
const projectGoals = ["Gerar mais contatos e orçamentos", "Apresentar melhor a empresa", "Fortalecer a autoridade da marca", "Divulgar um produto ou serviço", "Modernizar um site existente", "Automatizar um processo"];
const projectStages = ["Tenho apenas a ideia", "Já tenho textos e identidade visual", "Já tenho um site e quero reformular", "O projeto já está bem definido", "Preciso de orientação completa"];
const logoOptions = ["Tenho o arquivo original", "Tenho apenas uma imagem", "Quero modernizar meu logotipo", "Ainda não tenho logotipo"];
const paletteOptions = ["Já tenho as cores da marca", "Tenho algumas cores em mente", "Ainda não tenho uma paleta", "Quero uma proposta da Apollun.Dev"];
const visualStyles = ["Moderno", "Minimalista", "Sofisticado", "Tecnológico", "Corporativo", "Elegante", "Criativo", "Acolhedor"];
const themeOptions = ["Predominantemente claro", "Predominantemente escuro", "Mistura entre claro e escuro", "Quero uma recomendação"];
const projectDeadlines = ["Assim que possível", "Em até 30 dias", "Entre 30 e 60 dias", "Ainda não tenho prazo"];
const availableAssets = ["Domínio", "Hospedagem", "Identidade visual", "Textos", "Fotografias", "Vídeos", "Depoimentos de clientes"];
const whatsappNumber = "5511940312713";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: React.ReactNode; text?: string }) {
  return (
    <Reveal className="sectionTitle">
      <span className="eyebrow"><i />{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

function DeviceMockup() {
  const reduce = useReducedMotion();
  const [projectIndex, setProjectIndex] = useState(0);
  const project = showcaseProjects[projectIndex];

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setProjectIndex((current) => (current + 1) % showcaseProjects.length), 5200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <motion.div className="devices" initial={{ opacity: 0, scale: .92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: .35, ease: [0.22, 1, 0.36, 1] }} aria-label="Vitrine responsiva de projetos digitais">
      <div className="deviceGlow" />
      <motion.div className="laptop" animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <div className="laptopScreen"><MockScreen project={project} size="desktop" /></div><div className="laptopBase" />
      </motion.div>
      <motion.div className="tablet" animate={{ y: [0, 7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: .7 }}>
        <MockScreen project={project} size="tablet" />
      </motion.div>
      <motion.div className="phone" animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}>
        <div className="phoneNotch" /><MockScreen project={project} size="mobile" />
      </motion.div>
      <div className="floatTag tagPerformance"><Zap size={14} /> {project.badge}</div>
      <div className="floatTag tagConversion"><MonitorSmartphone size={14} /> 3 dispositivos</div>
      <div className="showcaseControls" aria-label="Selecionar projeto em destaque">
        {showcaseProjects.map((item, index) => <button key={item.name} className={index === projectIndex ? "active" : ""} onClick={() => setProjectIndex(index)} aria-label={`Mostrar ${item.name}`} aria-pressed={index === projectIndex}><span />{item.name}</button>)}
      </div>
    </motion.div>
  );
}

function MockScreen({ project, size }: { project: (typeof showcaseProjects)[number]; size: "desktop" | "tablet" | "mobile" }) {
  const capture = size === "desktop" ? project.desktop : size === "tablet" ? project.tablet : project.mobile;

  if (capture) {
    return <motion.div key={`${project.name}-${size}`} className="mockScreen showcase-capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }}><img className="showcaseCapture" src={capture} alt={`Projeto ${project.name} em ${size}`} /></motion.div>;
  }

  return (
    <motion.div key={`${project.name}-${size}`} className={`mockScreen showcase-${project.theme} showcase-${size}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }}>
      <div className="mockNav"><b>{project.name}</b><span /><span /><i /></div>
      {size === "desktop" && <div className="showcaseDesktop">
        <div className="showcaseCopy"><span>{project.category}</span><h3>{project.title}<br /><em>{project.highlight}</em></h3><p>{project.description}</p><button>Explorar projeto <ArrowRight size={9} /></button></div>
        <div className="showcaseDashboard"><div className="showcasePreview"><i /><i /><i /></div><div className="showcaseStats"><span><b>{project.score}</b>Performance</span><span><b>100%</b>Responsivo</span></div></div>
      </div>}
      {size === "tablet" && <div className="showcaseTablet"><span>{project.category}</span><div className="showcaseTile"><i /><i /><i /></div><h3>{project.title}<br /><em>{project.highlight}</em></h3><div className="showcaseTabletMeta"><b>{project.score}</b><span>{project.metric}</span></div></div>}
      {size === "mobile" && <div className="showcaseMobile"><span>{project.category}</span><div className="showcaseMobileVisual"><i /></div><h3>{project.title}<br /><em>{project.highlight}</em></h3><button>Conhecer <ArrowRight size={7} /></button></div>}
    </motion.div>
  );
}

function BriefingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [segment, setSegment] = useState("");
  const [onlinePresence, setOnlinePresence] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [logoStatus, setLogoStatus] = useState("");
  const [paletteStatus, setPaletteStatus] = useState("");
  const [paletteDetails, setPaletteDetails] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [visualTheme, setVisualTheme] = useState("");
  const [stage, setStage] = useState("");
  const [assets, setAssets] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [references, setReferences] = useState("");
  const [deadline, setDeadline] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  const toggleItem = (item: string, values: string[], setter: (items: string[]) => void) => setter(values.includes(item) ? values.filter((value) => value !== item) : [...values, item]);
  const canContinue = step === 0 ? Boolean(name.trim() && business.trim() && segment.trim()) : step === 1 ? projects.length > 0 : step === 2 ? Boolean(goal) : step === 3 ? Boolean(logoStatus && paletteStatus) : step === 4 ? Boolean(styles.length && visualTheme) : step === 5 ? Boolean(stage) : Boolean(deadline);
  const needsCurrentUrl = projects.includes("Reformulação de site") || stage === "Já tenho um site e quero reformular";

  const sendBriefing = () => {
    const assetLines = availableAssets.map((item) => `${assets.includes(item) ? "✓" : "✗"} ${item}`).join("\n");
    const message = `Olá! Vim pelo site da Apollun.Dev e gostaria de solicitar um orçamento.\n\n*CONTATO*\nNome: ${name.trim()}\nEmpresa: ${business.trim()}\nSegmento: ${segment.trim()}\nPresença atual: ${onlinePresence.trim() || "Não informado"}\n\n*PROJETO*\nTipo: ${projects.join(", ")}\nObjetivo: ${goal}\nMomento atual: ${stage}\nPrazo: ${deadline}\n${needsCurrentUrl ? `Site atual: ${currentUrl.trim() || "Não informado"}\n` : ""}\n*IDENTIDADE VISUAL*\nLogotipo: ${logoStatus}\nPaleta: ${paletteStatus}\nCores informadas: ${paletteDetails.trim() || "Não informado"}\nEstilo: ${styles.join(", ")}\nTema: ${visualTheme}\nReferências: ${references.trim() || "Não informado"}\n\n*MATERIAIS DISPONÍVEIS*\n${assetLines}\n\n*DETALHES*\n${details.trim() || "Prefiro explicar durante a conversa."}`;
    const destination = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
    window.open(`${destination}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div className="briefingOverlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div className="briefingModal" role="dialog" aria-modal="true" aria-labelledby="briefing-title" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}>
        <div className="briefingHeader">
          <div><span>Briefing Apollun.Dev</span><strong id="briefing-title">Conte-nos sobre seu projeto.</strong></div>
          <button type="button" onClick={onClose} aria-label="Fechar briefing"><X size={19} /></button>
        </div>
        <div className="briefingProgress"><span style={{ width: `${((step + 1) / 7) * 100}%` }} /></div>
        <form onSubmit={(event) => { event.preventDefault(); if (step < 6) setStep(step + 1); else sendBriefing(); }}>
          <div className="briefingStepMeta"><span>Etapa {step + 1} de 7</span><small>Cerca de 4 minutos</small></div>

          {step === 0 && <fieldset className="briefingFields"><legend>Primeiro, queremos conhecer você.</legend><p>Essas informações ajudam a entender o contexto do projeto.</p><label>Nome<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></label><label>Empresa ou negócio<input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Nome da sua empresa" /></label><label>Segmento<input value={segment} onChange={(event) => setSegment(event.target.value)} placeholder="Ex.: clínica, advocacia, consultoria" /></label><label className="briefingFullField">Instagram ou site atual <small>Opcional</small><input value={onlinePresence} onChange={(event) => setOnlinePresence(event.target.value)} placeholder="@suaempresa ou https://..." /></label></fieldset>}

          {step === 1 && <fieldset className="briefingChoices"><legend>O que você deseja criar?</legend><p>Você pode selecionar mais de uma opção.</p><div>{projectOptions.map((item) => <button type="button" key={item} className={projects.includes(item) ? "selected" : ""} onClick={() => toggleItem(item, projects, setProjects)} aria-pressed={projects.includes(item)}><span>{projects.includes(item) && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {step === 2 && <fieldset className="briefingChoices"><legend>Qual é o principal objetivo?</legend><p>Assim podemos pensar no site como uma ferramenta para o seu negócio.</p><div>{projectGoals.map((item) => <button type="button" key={item} className={goal === item ? "selected" : ""} onClick={() => setGoal(item)} aria-pressed={goal === item}><span>{goal === item && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {step === 3 && <fieldset className="briefingChoices briefingIdentity"><legend>Como está a identidade da marca?</legend><p>Não precisa dominar design. Escolha as opções que mais se aproximam da sua realidade.</p><span className="briefingGroupLabel">Logotipo</span><div className="briefingOptionGrid">{logoOptions.map((item) => <button type="button" key={item} className={logoStatus === item ? "selected" : ""} onClick={() => setLogoStatus(item)} aria-pressed={logoStatus === item}><span>{logoStatus === item && <Check size={15} />}</span>{item}</button>)}</div><span className="briefingGroupLabel">Paleta de cores</span><div className="briefingOptionGrid">{paletteOptions.map((item) => <button type="button" key={item} className={paletteStatus === item ? "selected" : ""} onClick={() => setPaletteStatus(item)} aria-pressed={paletteStatus === item}><span>{paletteStatus === item && <Check size={15} />}</span>{item}</button>)}</div>{(paletteStatus === "Já tenho as cores da marca" || paletteStatus === "Tenho algumas cores em mente") && <label className="briefingInlineField">Quais cores?<input value={paletteDetails} onChange={(event) => setPaletteDetails(event.target.value)} placeholder="Ex.: azul-marinho, branco e dourado ou #050816" /></label>}</fieldset>}

          {step === 4 && <fieldset className="briefingChoices briefingIdentity"><legend>Qual visual combina com sua empresa?</legend><p>Selecione até três estilos e escolha a aparência geral.</p><span className="briefingGroupLabel">Estilo desejado</span><div className="briefingOptionGrid">{visualStyles.map((item) => <button type="button" key={item} className={styles.includes(item) ? "selected" : ""} disabled={!styles.includes(item) && styles.length >= 3} onClick={() => toggleItem(item, styles, setStyles)} aria-pressed={styles.includes(item)}><span>{styles.includes(item) && <Check size={15} />}</span>{item}</button>)}</div><span className="briefingGroupLabel">Preferência de tema</span><div className="briefingOptionGrid">{themeOptions.map((item) => <button type="button" key={item} className={visualTheme === item ? "selected" : ""} onClick={() => setVisualTheme(item)} aria-pressed={visualTheme === item}><span>{visualTheme === item && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {step === 5 && <fieldset className="briefingChoices briefingIdentity"><legend>Em qual etapa o projeto está?</legend><p>Adaptamos o processo ao que você já possui.</p><div>{projectStages.map((item) => <button type="button" key={item} className={stage === item ? "selected" : ""} onClick={() => setStage(item)} aria-pressed={stage === item}><span>{stage === item && <Check size={15} />}</span>{item}</button>)}</div>{needsCurrentUrl && <label className="briefingInlineField">Endereço do site atual <small>Opcional</small><input value={currentUrl} onChange={(event) => setCurrentUrl(event.target.value)} placeholder="https://seusite.com.br" /></label>}<span className="briefingGroupLabel">Materiais disponíveis <small>Opcional</small></span><div className="assetGrid">{availableAssets.map((item) => <button type="button" key={item} className={assets.includes(item) ? "selected" : ""} onClick={() => toggleItem(item, assets, setAssets)} aria-pressed={assets.includes(item)}><span>{assets.includes(item) && <Check size={13} />}</span>{item}</button>)}</div></fieldset>}

          {step === 6 && <fieldset className="briefingDetails"><legend>Últimos detalhes.</legend><p>Estamos quase lá. Conte o essencial e revise o resumo do seu projeto.</p><span className="briefingGroupLabel">Quando gostaria de lançar?</span><div className="briefingDeadlineGrid">{projectDeadlines.map((item) => <button type="button" key={item} className={deadline === item ? "selected" : ""} onClick={() => setDeadline(item)} aria-pressed={deadline === item}><span>{deadline === item && <Check size={13} />}</span>{item}</button>)}</div><label>Sites ou marcas de referência <small>Opcional</small><input value={references} onChange={(event) => setReferences(event.target.value)} placeholder="Cole links ou escreva os nomes das referências" /></label><label>Sobre sua empresa e o projeto <small>Opcional</small><textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Conte o que deseja construir e qualquer informação importante..." rows={3} /></label><div className="briefingSummary"><span>Resumo do briefing</span><div><p><small>Projeto</small><strong>{projects.join(", ")}</strong></p><p><small>Objetivo</small><strong>{goal}</strong></p><p><small>Direção visual</small><strong>{styles.join(", ")}</strong></p><p><small>Prazo</small><strong>{deadline || "Selecione uma opção"}</strong></p></div></div></fieldset>}

          <div className="briefingFooter"><button type="button" className="briefingBack" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? "Agora não" : "Voltar"}</button><button type="submit" className="briefingNext" disabled={!canContinue}>{step === 6 ? "Enviar pelo WhatsApp" : "Continuar"}<ArrowRight size={16} /></button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonial, setTestimonial] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [briefingOpen, setBriefingOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("apollun-theme", next);
  };

  const quoteCards = [
    ["Clareza em cada decisão", "A estratégia vem antes da estética. Cada escolha existe para orientar o visitante e fortalecer a marca."],
    ["Qualidade que aparece", "Do primeiro contato ao último detalhe da interface, a experiência transmite cuidado, domínio e confiança."],
    ["Tecnologia que acompanha", "Criamos bases sólidas para que o produto continue rápido, seguro e pronto para evoluir."],
  ];

  return (
    <main>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navInner">
          <a className="brand" href="#inicio" aria-label="Apollun.Dev — início"><img className="brandIcon" src="/apollun-icon.png" alt="" />APOLLUN<span>.DEV</span></a>
          <nav className="navLinks" aria-label="Navegação principal">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
          <div className="navActions">
            <button className="themeToggle" onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} title={theme === "dark" ? "Modo claro" : "Modo escuro"}>
              <span>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</span>
            </button>
            <span className="availability"><i />Disponível agora</span>
            <button className="navCta" type="button" onClick={() => setBriefingOpen(true)}>Iniciar projeto <ArrowRight size={15} /></button>
          </div>
          <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <motion.nav className="mobileNav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<button className="mobileThemeToggle" onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}</button><span className="availability"><i />Disponível agora</span><button className="mobileBriefingLink" type="button" onClick={() => { setMenuOpen(false); setBriefingOpen(true); }}>Iniciar projeto</button></motion.nav>}
      </header>

      <section className="hero" id="inicio">
        <div className="heroGrid" />
        <div className="heroGlow glowOne" /><div className="heroGlow glowTwo" />
        <div className="container heroInner">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow"><i />Tecnologia para empresas que querem avançar</span>
            <h1>Sites modernos que transformam <span>visitantes em clientes.</span></h1>
            <p>Transformamos ideias em experiências digitais de alta performance, unindo estratégia, design e tecnologia para criar negócios mais fortes.</p>
            <div className="heroActions">
              <button className="button primary" type="button" onClick={() => setBriefingOpen(true)}>Solicitar orçamento <ArrowRight size={17} /></button>
              <a className="button secondary" href="#portfolio">Ver projetos</a>
            </div>
            <div className="badges">{["Alta Performance", "SEO", "UX/UI", "Responsivo"].map((item) => <span key={item}><Check size={13} />{item}</span>)}</div>
          </motion.div>
          <DeviceMockup />
        </div>
        <a className="scrollCue" href="#clientes"><span />Explore</a>
      </section>

      <section className="clientSection" id="clientes">
        <div className="container"><p className="clientLabel">Soluções digitais para diferentes mercados</p><div className="clientGrid">{clients.map(({ name, icon: Icon }) => <button className="clientCard" type="button" key={name} onClick={() => setBriefingOpen(true)} aria-label={`Solicitar projeto para ${name}`}><span className="clientIcon"><Icon size={19} strokeWidth={1.8} /></span><strong>{name}</strong><ArrowRight className="clientArrow" size={16} /></button>)}</div></div>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <SectionTitle eyebrow="O que fazemos" title={<>Tudo o que sua presença digital precisa para <span>crescer.</span></>} text="Da estratégia ao código, entregamos experiências completas e construídas para gerar valor real." />
          <div className="serviceGrid">{services.map((service, index) => { const Icon = service.icon; return <Reveal className="serviceCard" delay={(index % 3) * .08} key={service.title}><div className="serviceIcon"><Icon size={22} /></div><span className="cardNumber">0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contato" aria-label={`Saiba mais sobre ${service.title}`}>Explorar <ArrowRight size={14} /></a></Reveal>; })}</div>
        </div>
      </section>

      <section className="section differenceSection" id="diferenciais">
        <div className="container differenceLayout">
          <SectionTitle eyebrow="O padrão Apollun" title={<>Não entregamos apenas um site. Entregamos uma <span>vantagem digital.</span></>} text="Cada camada do projeto é pensada para transmitir autoridade, acelerar a experiência e sustentar o crescimento." />
          <div className="differenceGrid">{differences.map(([Icon, label], index) => <Reveal className="differenceCard" delay={(index % 2) * .07} key={label as string}><Icon size={21} /><span>{label as string}</span><i>{String(index + 1).padStart(2, "0")}</i></Reveal>)}</div>
        </div>
      </section>

      <section className="section processSection" id="processo">
        <div className="container processLayout">
          <div className="processIntro"><SectionTitle eyebrow="Nosso processo" title={<>Método para transformar complexidade em <span>clareza.</span></>} text="Um fluxo transparente, colaborativo e preciso — da primeira conversa ao crescimento contínuo." /></div>
          <div className="timeline">{steps.map(([number, title, text]) => <Reveal className="timelineItem" key={number}><span className="stepNumber">{number}</span><div><h3>{title}</h3><p>{text}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="section portfolioSection" id="portfolio">
        <div className="container">
          <SectionTitle eyebrow="Projetos em destaque" title={<>Experiências pensadas para <span>ser lembradas.</span></>} text="Direções de produto que mostram como estratégia, identidade e tecnologia podem trabalhar como uma só coisa." />
          <div className="projectGrid">
            <Reveal className="projectCard projectWide"><div className="projectVisual realProjectVisual nieroProject"><img src="/showcase/niero-desktop.png" alt="Página inicial do site Srta. Niero" /></div><div className="projectInfo"><div><span>WEBSITE · BRANDING</span><h3>Srta. Niero</h3></div><a href="#contato" aria-label="Conhecer projeto Srta. Niero"><ArrowRight /></a></div></Reveal>
            <Reveal className="projectCard"><div className="projectVisual realProjectVisual apollunProject"><img src="/showcase/apollun-desktop.png" alt="Página inicial do site Apollun.Dev" /></div><div className="projectInfo"><div><span>WEBSITE · UX/UI · DESENVOLVIMENTO</span><h3>Apollun.Dev</h3></div><a href="#contato" aria-label="Conhecer projeto Apollun.Dev"><ArrowRight /></a></div></Reveal>
            <Reveal className="projectCard"><div className="projectVisual visualCommerce"><div className="commerceOrb"><ShoppingBag /></div><h3>Forma.<br />Função.<br /><em>Desejo.</em></h3><div className="commercePrice">E-commerce premium</div></div><div className="projectInfo"><div><span>E-COMMERCE · BRANDING</span><h3>Loja digital premium</h3></div><a href="#contato" aria-label="Conhecer projeto de e-commerce"><ArrowRight /></a></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section pricingSection" id="planos">
        <div className="container">
          <SectionTitle eyebrow="Formatos de projeto" title={<>Uma solução para cada <span>momento do negócio.</span></>} text="O escopo final é personalizado. Os formatos abaixo ajudam a identificar o melhor ponto de partida." />
          <div className="pricingGrid">{plans.map((plan) => <Reveal className={`priceCard ${plan.featured ? "featured" : ""}`} key={plan.name}>{plan.featured && <div className="popularBadge">Mais contratado</div>}<span className="planLabel">APOLLUN / {plan.name.toUpperCase()}</span><h3>{plan.name}</h3><p>{plan.description}</p><div className="priceLine"><strong>Sob medida</strong><span>escopo personalizado</span></div><ul>{plan.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><button className={`button ${plan.featured ? "primary" : "secondary"}`} type="button" onClick={() => setBriefingOpen(true)}>Quero este plano <ArrowRight size={16} /></button></Reveal>)}</div>
        </div>
      </section>

      <section className="section testimonialSection">
        <div className="container testimonialLayout">
          <div><span className="eyebrow"><i />Experiência Apollun</span><h2>O padrão de percepção que buscamos em <span>cada entrega.</span></h2><div className="sliderControls"><button onClick={() => setTestimonial((testimonial + 2) % 3)} aria-label="Anterior">←</button><button onClick={() => setTestimonial((testimonial + 1) % 3)} aria-label="Próximo">→</button></div></div>
          <div className="quoteWindow"><motion.div key={testimonial} className="quoteCard" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }}><div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div><blockquote>“{quoteCards[testimonial][1]}”</blockquote><div className="quoteMeta"><div className="avatar">A</div><div><strong>{quoteCards[testimonial][0]}</strong><span>Compromisso Apollun.Dev</span></div></div></motion.div></div>
        </div>
      </section>

      <section className="section faqSection" id="faq">
        <div className="container faqLayout"><SectionTitle eyebrow="Perguntas frequentes" title={<>Tudo claro antes de <span>começarmos.</span></>} /><div className="faqList">{faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="finalCta" id="contato">
        <div className="finalGrid" /><div className="finalOrb orbA" /><div className="finalOrb orbB" />
        <Reveal className="container finalInner"><span className="eyebrow"><i />Seu próximo projeto começa aqui</span><h2>Vamos transformar sua ideia em uma experiência digital <span>extraordinária?</span></h2><p>Conte o que você quer construir. Nós cuidamos da estratégia, do design e da tecnologia.</p><button className="button ctaButton" type="button" onClick={() => setBriefingOpen(true)}>Solicitar orçamento <ArrowRight size={20} /></button></Reveal>
      </section>

      <footer className="footer"><div className="container"><div className="footerTop"><div><a className="brand" href="#inicio"><img className="brandIcon" src="/apollun-icon.png" alt="" />APOLLUN<span>.DEV</span></a><p>Transformando ideias em experiências digitais.</p></div><div className="footerColumn"><strong>Mapa do site</strong>{navItems.slice(0, 4).map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div><div className="footerColumn"><strong>Conecte-se</strong><a href="https://instagram.com/apollun.dev" target="_blank" rel="noreferrer">Instagram</a><a href="https://linkedin.com/company/apollun-dev" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:contato@apollun.dev">E-mail</a><button className="footerBriefingLink" type="button" onClick={() => setBriefingOpen(true)}>WhatsApp</button></div><div className="footerColumn"><strong>Contato</strong><a href="mailto:contato@apollun.dev">contato@apollun.dev</a><span>Brasil · Atendimento digital</span></div></div><div className="footerBottom"><span>© {new Date().getFullYear()} Apollun.Dev</span><div><span>Política de Privacidade</span><span>Termos de Uso</span></div><span>Design & código com precisão.</span></div></div></footer>
      {briefingOpen && <BriefingModal onClose={() => setBriefingOpen(false)} />}
    </main>
  );
}
