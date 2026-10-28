"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight, BarChart3, Blocks, Check, ChevronDown, Code2, Gauge,
  Globe2, Layers3, Menu, MonitorSmartphone, Search, ShieldCheck,
  Moon, Sparkles, Star, Sun, X, Zap, RefreshCw, MessageCircle,
} from "lucide-react";

const navItems = [
  ["Serviços", "#servicos"], ["Projetos", "#portfolio"],
  ["Processo", "#processo"], ["Planos", "#planos"],
  ["Sobre", "#diferenciais"], ["FAQ", "#faq"],
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
  {
    code: "01",
    name: "Presença",
    eyebrow: "Para começar com direção",
    description: "Uma página estratégica para apresentar sua oferta e transformar visitas em contatos.",
    ideal: "Profissionais e negócios em lançamento",
    items: ["Landing page personalizada", "Estrutura focada em conversão", "Design responsivo", "SEO essencial", "WhatsApp ou formulário integrado"],
    cta: "Quero lançar meu site",
    featured: false,
  },
  {
    code: "02",
    name: "Autoridade",
    eyebrow: "Para crescer com confiança",
    description: "Um site institucional completo para posicionar sua marca e gerar oportunidades.",
    ideal: "Empresas e profissionais estabelecidos",
    items: ["Site institucional sob medida", "UX/UI alinhado à sua marca", "SEO técnico e Analytics", "Páginas estratégicas de serviço", "Suporte pós-lançamento"],
    cta: "Quero fortalecer minha marca",
    featured: true,
  },
  {
    code: "03",
    name: "Evolução",
    eyebrow: "Para projetos mais complexos",
    description: "Uma solução digital planejada para modernizar, integrar e ampliar sua operação.",
    ideal: "Reformulações, integrações e sistemas",
    items: ["Diagnóstico e estratégia digital", "Reformulação completa de site", "Integrações personalizadas", "Sistema web sob medida", "Evolução e suporte prioritário"],
    cta: "Quero discutir meu projeto",
    featured: false,
  },
  {
    code: "04",
    name: "Essência",
    eyebrow: "Da identidade à presença digital",
    description: "Um plano para construir uma base sólida, coerente e profissional para a marca, da identidade visual à presença na internet.",
    ideal: "Marcas novas ou em fase de reposicionamento",
    items: ["Identidade visual completa", "Logotipo e sistema de marca", "Paleta de cores e tipografia", "Site personalizado", "Experiência digital coerente"],
    cta: "Solicitar este plano",
    featured: false,
  },
];

const faq = [
  ["Quanto tempo leva para criar um site?", "O prazo depende do escopo. Uma landing page costuma levar de 2 a 4 semanas; sites e sistemas maiores recebem um cronograma próprio após o briefing."],
  ["O projeto é realmente personalizado?", "Sim. Estratégia, estrutura, interface e desenvolvimento são definidos para o contexto da sua empresa. Não trabalhamos com soluções genéricas."],
  ["Meu site será otimizado para celular?", "Sim. Cada tela é planejada e testada para desktop, notebook, tablet e celular, com foco em velocidade e facilidade de uso."],
  ["Vocês cuidam de SEO e performance?", "Sim. Construímos uma base técnica sólida, com semântica, velocidade, indexação e boas práticas consideradas desde o início."],
  ["A Apollun oferece suporte depois da entrega?", "Sim. Podemos acompanhar o projeto após o lançamento com manutenção, melhorias e novas funcionalidades conforme sua operação evolui."],
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
const SHOW_TESTIMONIALS = false;

function trackConversion(event: string, details: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event: `apollun_${event}`, ...details };
  const trackedWindow = window as Window & { dataLayer?: Array<Record<string, string | number>> };
  trackedWindow.dataLayer = trackedWindow.dataLayer || [];
  trackedWindow.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("apollun:conversion", { detail: payload }));
}

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

function QuickBriefingCard({ onOpenFull }: { onOpenFull: () => void }) {
  const ready = useRef(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const toggleProject = (item: string) => setProjects((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  const canContinue = step === 0 ? Boolean(name.trim() && business.trim()) : step === 1 ? projects.length > 0 : Boolean(goal);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("apollun-quick-briefing") || "null");
        if (saved) { setStep(saved.step || 0); setName(saved.name || ""); setBusiness(saved.business || ""); setProjects(saved.projects || []); setGoal(saved.goal || ""); }
      } catch { /* Ignore invalid local drafts. */ }
      ready.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    localStorage.setItem("apollun-quick-briefing", JSON.stringify({ step, name, business, projects, goal }));
  }, [step, name, business, projects, goal]);

  const submit = () => {
    const message = `Olá! Vim pelo site da Apollun.Dev e gostaria de solicitar um orçamento.\n\n*CONTATO*\nNome: ${name.trim()}\nEmpresa e segmento: ${business.trim()}\n\n*PROJETO*\nTipo: ${projects.join(", ")}\nObjetivo: ${goal}`;
    trackConversion("briefing_submitted", { mode: "quick", project_count: projects.length });
    localStorage.removeItem("apollun-quick-briefing");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div className="quickBriefingCard" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .18, ease: [0.22, 1, 0.36, 1] }}>
      <div className="quickBriefingHead"><div><span>Orçamento rápido</span><h2>Conte sobre o seu projeto</h2></div><small>Etapa {step + 1} de 3 · cerca de 1 minuto</small></div>
      <div className="quickProgress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
      <form onSubmit={(event) => { event.preventDefault(); if (step < 2) setStep(step + 1); else submit(); }}>
        {step === 0 && <fieldset className="quickFields"><legend>Quem está pedindo?</legend><label>Seu nome<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></label><label>Empresa e segmento<input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Ex.: Clínica Sorriso, odontologia" /></label></fieldset>}
        {step === 1 && <fieldset className="quickChoices"><legend>O que você quer criar?</legend><p>Você pode selecionar mais de uma opção.</p><div>{projectOptions.slice(0, 5).map((item) => <button type="button" key={item} className={projects.includes(item) ? "selected" : ""} onClick={() => toggleProject(item)} aria-pressed={projects.includes(item)}><span>{projects.includes(item) && <Check size={14} />}</span>{item}</button>)}</div></fieldset>}
        {step === 2 && <fieldset className="quickChoices"><legend>Qual é o principal objetivo?</legend><div>{projectGoals.slice(0, 4).map((item) => <button type="button" key={item} className={goal === item ? "selected" : ""} onClick={() => setGoal(item)} aria-pressed={goal === item}><span>{goal === item && <Check size={14} />}</span>{item}</button>)}</div></fieldset>}
        <div className="quickFooter"><button type="button" className="quickBack" onClick={() => step === 0 ? onOpenFull() : setStep(step - 1)}>{step === 0 ? "Prefiro detalhar" : "Voltar"}</button><button type="submit" className="quickNext" disabled={!canContinue}>{step === 2 ? "Enviar pelo WhatsApp" : "Continuar"}<ArrowRight size={16} /></button></div>
      </form>
    </motion.div>
  );
}

function BriefingModal({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const [mode, setMode] = useState<"quick" | "full">("quick");
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
    const focusTimer = window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>("input, button")?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.clearTimeout(focusTimer); document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("apollun-full-briefing") || "null");
        if (saved) {
          setMode(saved.mode === "full" ? "full" : "quick"); setStep(saved.step || 0); setName(saved.name || ""); setBusiness(saved.business || ""); setSegment(saved.segment || ""); setOnlinePresence(saved.onlinePresence || ""); setProjects(saved.projects || []); setGoal(saved.goal || ""); setLogoStatus(saved.logoStatus || ""); setPaletteStatus(saved.paletteStatus || ""); setPaletteDetails(saved.paletteDetails || ""); setStyles(saved.styles || []); setVisualTheme(saved.visualTheme || ""); setStage(saved.stage || ""); setAssets(saved.assets || []); setCurrentUrl(saved.currentUrl || ""); setReferences(saved.references || ""); setDeadline(saved.deadline || ""); setDetails(saved.details || "");
        }
      } catch { /* Ignore invalid local drafts. */ }
      ready.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    localStorage.setItem("apollun-full-briefing", JSON.stringify({ mode, step, name, business, segment, onlinePresence, projects, goal, logoStatus, paletteStatus, paletteDetails, styles, visualTheme, stage, assets, currentUrl, references, deadline, details }));
  }, [mode, step, name, business, segment, onlinePresence, projects, goal, logoStatus, paletteStatus, paletteDetails, styles, visualTheme, stage, assets, currentUrl, references, deadline, details]);

  const toggleItem = (item: string, values: string[], setter: (items: string[]) => void) => setter(values.includes(item) ? values.filter((value) => value !== item) : [...values, item]);
  const lastStep = mode === "quick" ? 2 : 6;
  const canContinue = step === 0 ? Boolean(name.trim() && business.trim() && segment.trim()) : step === 1 ? projects.length > 0 : step === 2 ? Boolean(goal) : step === 3 ? Boolean(logoStatus && paletteStatus) : step === 4 ? Boolean(styles.length && visualTheme) : step === 5 ? Boolean(stage) : Boolean(deadline);
  const needsCurrentUrl = projects.includes("Reformulação de site") || stage === "Já tenho um site e quero reformular";

  const sendQuickBriefing = () => {
    const message = `Olá! Vim pelo site da Apollun.Dev e gostaria de solicitar um orçamento.\n\n*CONTATO*\nNome: ${name.trim()}\nEmpresa: ${business.trim()}\nSegmento: ${segment.trim()}\n\n*PROJETO*\nTipo: ${projects.join(", ")}\nObjetivo: ${goal}\n\nPreenchi o briefing rápido e posso explicar os demais detalhes durante a conversa.`;
    const destination = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
    trackConversion("briefing_submitted", { mode: "modal_quick", project_count: projects.length });
    localStorage.removeItem("apollun-full-briefing");
    window.open(`${destination}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const sendBriefing = () => {
    const assetLines = availableAssets.map((item) => `${assets.includes(item) ? "✓" : "✗"} ${item}`).join("\n");
    const message = `Olá! Vim pelo site da Apollun.Dev e gostaria de solicitar um orçamento.\n\n*CONTATO*\nNome: ${name.trim()}\nEmpresa: ${business.trim()}\nSegmento: ${segment.trim()}\nPresença atual: ${onlinePresence.trim() || "Não informado"}\n\n*PROJETO*\nTipo: ${projects.join(", ")}\nObjetivo: ${goal}\nMomento atual: ${stage}\nPrazo: ${deadline}\n${needsCurrentUrl ? `Site atual: ${currentUrl.trim() || "Não informado"}\n` : ""}\n*IDENTIDADE VISUAL*\nLogotipo: ${logoStatus}\nPaleta: ${paletteStatus}\nCores informadas: ${paletteDetails.trim() || "Não informado"}\nEstilo: ${styles.join(", ")}\nTema: ${visualTheme}\nReferências: ${references.trim() || "Não informado"}\n\n*MATERIAIS DISPONÍVEIS*\n${assetLines}\n\n*DETALHES*\n${details.trim() || "Prefiro explicar durante a conversa."}`;
    const destination = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/";
    trackConversion("briefing_submitted", { mode: "full", project_count: projects.length });
    localStorage.removeItem("apollun-full-briefing");
    window.open(`${destination}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div className="briefingOverlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={modalRef} className="briefingModal" role="dialog" aria-modal="true" aria-labelledby="briefing-title" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}>
        <div className="briefingHeader">
          <div><span>{mode === "quick" ? "Orçamento rápido" : "Briefing Apollun.Dev"}</span><strong id="briefing-title">{mode === "quick" ? "Conte o essencial em cerca de 1 minuto." : "Conte-nos sobre seu projeto."}</strong></div>
          <button type="button" onClick={onClose} aria-label="Fechar briefing"><X size={19} /></button>
        </div>
        <div className="briefingProgress"><span style={{ width: `${((step + 1) / (lastStep + 1)) * 100}%` }} /></div>
        <form onSubmit={(event) => { event.preventDefault(); if (step < lastStep) setStep(step + 1); else if (mode === "quick") sendQuickBriefing(); else sendBriefing(); }}>
          <div className="briefingStepMeta"><span>Etapa {step + 1} de {lastStep + 1}</span><small>{mode === "quick" ? "Cerca de 1 minuto" : "Cerca de 4 minutos"}</small><button type="button" className="briefingModeSwitch" onClick={() => { setMode(mode === "quick" ? "full" : "quick"); setStep(0); }}>{mode === "quick" ? "Prefiro o briefing completo" : "Usar versão rápida"}</button></div>

          {step === 0 && <fieldset className="briefingFields"><legend>Primeiro, queremos conhecer você.</legend><p>Essas informações ajudam a entender o contexto do projeto.</p><label>Nome<input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" /></label><label>Empresa ou negócio<input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Nome da sua empresa" /></label><label>Segmento<input value={segment} onChange={(event) => setSegment(event.target.value)} placeholder="Ex.: clínica, advocacia, consultoria" /></label><label className="briefingFullField">Instagram ou site atual <small>Opcional</small><input value={onlinePresence} onChange={(event) => setOnlinePresence(event.target.value)} placeholder="@suaempresa ou https://..." /></label></fieldset>}

          {step === 1 && <fieldset className="briefingChoices"><legend>O que você deseja criar?</legend><p>Você pode selecionar mais de uma opção.</p><div>{projectOptions.map((item) => <button type="button" key={item} className={projects.includes(item) ? "selected" : ""} onClick={() => toggleItem(item, projects, setProjects)} aria-pressed={projects.includes(item)}><span>{projects.includes(item) && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {step === 2 && <fieldset className="briefingChoices"><legend>Qual é o principal objetivo?</legend><p>Assim podemos pensar no site como uma ferramenta para o seu negócio.</p><div>{projectGoals.map((item) => <button type="button" key={item} className={goal === item ? "selected" : ""} onClick={() => setGoal(item)} aria-pressed={goal === item}><span>{goal === item && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {mode === "full" && step === 3 && <fieldset className="briefingChoices briefingIdentity"><legend>Como está a identidade da marca?</legend><p>Não precisa dominar design. Escolha as opções que mais se aproximam da sua realidade.</p><span className="briefingGroupLabel">Logotipo</span><div className="briefingOptionGrid">{logoOptions.map((item) => <button type="button" key={item} className={logoStatus === item ? "selected" : ""} onClick={() => setLogoStatus(item)} aria-pressed={logoStatus === item}><span>{logoStatus === item && <Check size={15} />}</span>{item}</button>)}</div><span className="briefingGroupLabel">Paleta de cores</span><div className="briefingOptionGrid">{paletteOptions.map((item) => <button type="button" key={item} className={paletteStatus === item ? "selected" : ""} onClick={() => setPaletteStatus(item)} aria-pressed={paletteStatus === item}><span>{paletteStatus === item && <Check size={15} />}</span>{item}</button>)}</div>{(paletteStatus === "Já tenho as cores da marca" || paletteStatus === "Tenho algumas cores em mente") && <label className="briefingInlineField">Quais cores?<input value={paletteDetails} onChange={(event) => setPaletteDetails(event.target.value)} placeholder="Ex.: azul-marinho, branco e dourado ou #050816" /></label>}</fieldset>}

          {mode === "full" && step === 4 && <fieldset className="briefingChoices briefingIdentity"><legend>Qual visual combina com sua empresa?</legend><p>Selecione até três estilos e escolha a aparência geral.</p><span className="briefingGroupLabel">Estilo desejado</span><div className="briefingOptionGrid">{visualStyles.map((item) => <button type="button" key={item} className={styles.includes(item) ? "selected" : ""} disabled={!styles.includes(item) && styles.length >= 3} onClick={() => toggleItem(item, styles, setStyles)} aria-pressed={styles.includes(item)}><span>{styles.includes(item) && <Check size={15} />}</span>{item}</button>)}</div><span className="briefingGroupLabel">Preferência de tema</span><div className="briefingOptionGrid">{themeOptions.map((item) => <button type="button" key={item} className={visualTheme === item ? "selected" : ""} onClick={() => setVisualTheme(item)} aria-pressed={visualTheme === item}><span>{visualTheme === item && <Check size={15} />}</span>{item}</button>)}</div></fieldset>}

          {mode === "full" && step === 5 && <fieldset className="briefingChoices briefingIdentity"><legend>Em qual etapa o projeto está?</legend><p>Adaptamos o processo ao que você já possui.</p><div>{projectStages.map((item) => <button type="button" key={item} className={stage === item ? "selected" : ""} onClick={() => setStage(item)} aria-pressed={stage === item}><span>{stage === item && <Check size={15} />}</span>{item}</button>)}</div>{needsCurrentUrl && <label className="briefingInlineField">Endereço do site atual <small>Opcional</small><input value={currentUrl} onChange={(event) => setCurrentUrl(event.target.value)} placeholder="https://seusite.com.br" /></label>}<span className="briefingGroupLabel">Materiais disponíveis <small>Opcional</small></span><div className="assetGrid">{availableAssets.map((item) => <button type="button" key={item} className={assets.includes(item) ? "selected" : ""} onClick={() => toggleItem(item, assets, setAssets)} aria-pressed={assets.includes(item)}><span>{assets.includes(item) && <Check size={13} />}</span>{item}</button>)}</div></fieldset>}

          {mode === "full" && step === 6 && <fieldset className="briefingDetails"><legend>Últimos detalhes.</legend><p>Estamos quase lá. Conte o essencial e revise o resumo do seu projeto.</p><span className="briefingGroupLabel">Quando gostaria de lançar?</span><div className="briefingDeadlineGrid">{projectDeadlines.map((item) => <button type="button" key={item} className={deadline === item ? "selected" : ""} onClick={() => setDeadline(item)} aria-pressed={deadline === item}><span>{deadline === item && <Check size={13} />}</span>{item}</button>)}</div><label>Sites ou marcas de referência <small>Opcional</small><input value={references} onChange={(event) => setReferences(event.target.value)} placeholder="Cole links ou escreva os nomes das referências" /></label><label>Sobre sua empresa e o projeto <small>Opcional</small><textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Conte o que deseja construir e qualquer informação importante..." rows={3} /></label><div className="briefingSummary"><span>Resumo do briefing</span><div><p><small>Projeto</small><strong>{projects.join(", ")}</strong></p><p><small>Objetivo</small><strong>{goal}</strong></p><p><small>Direção visual</small><strong>{styles.join(", ")}</strong></p><p><small>Prazo</small><strong>{deadline || "Selecione uma opção"}</strong></p></div></div></fieldset>}

          <div className="briefingFooter"><button type="button" className="briefingBack" onClick={() => step === 0 ? onClose() : setStep(step - 1)}>{step === 0 ? "Agora não" : "Voltar"}</button><button type="submit" className="briefingNext" disabled={!canContinue}>{step === lastStep ? "Enviar pelo WhatsApp" : "Continuar"}<ArrowRight size={16} /></button></div>
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
    const frame = window.requestAnimationFrame(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"));
    return () => window.cancelAnimationFrame(frame);
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
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site da Apollun.Dev e quero conversar sobre um projeto.")}`;

  return (
    <main>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navInner">
          <a className="brand" href="#inicio" aria-label="Apollun.Dev — início"><Image className="brandIcon" src="/apollun-icon.png" alt="" width={40} height={40} priority unoptimized />APOLLUN<span>.DEV</span></a>
          <nav className="navLinks" aria-label="Navegação principal">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
          <div className="navActions">
            <button className="themeToggle" onClick={toggleTheme} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} title={theme === "dark" ? "Modo claro" : "Modo escuro"}>
              <span>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</span>
            </button>
            <button className="navCta" type="button" onClick={() => { trackConversion("briefing_opened", { source: "header" }); setBriefingOpen(true); }}>Iniciar projeto <ArrowRight size={15} /></button>
          </div>
          <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <motion.nav className="mobileNav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>{navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<button className="mobileThemeToggle" onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}{theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}</button><button className="mobileBriefingLink" type="button" onClick={() => { trackConversion("briefing_opened", { source: "mobile_menu" }); setMenuOpen(false); setBriefingOpen(true); }}>Iniciar projeto</button></motion.nav>}
      </header>

      <section className="hero heroConversion" id="inicio">
        <div className="heroGrid" />
        <div className="heroGlow glowOne" /><div className="heroGlow glowTwo" />
        <div className="container heroInner">
          <motion.div className="heroCopy" initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow heroAvailability">Disponível agora para novos projetos</span>
            <h1>Sites que transformam <span>visitantes em clientes.</span></h1>
            <p>Sites e landing pages rápidos, claros e feitos para gerar contatos. Você fala direto com quem desenvolve.</p>
            <div className="heroActions">
              <button className="button primary" type="button" onClick={() => { trackConversion("briefing_opened", { source: "hero" }); setBriefingOpen(true); }}>Solicitar orçamento <ArrowRight size={17} /></button>
              <a className="button secondary" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackConversion("whatsapp_clicked", { source: "hero" })}><MessageCircle size={17} />Falar no WhatsApp</a>
            </div>
            <a className="heroProjectsLink" href="#portfolio">Ver projetos realizados <ArrowRight size={14} /></a>
            <div className="badges">{["Alta Performance", "SEO", "UX/UI", "Responsivo"].map((item) => <span key={item}><Check size={13} />{item}</span>)}</div>
          </motion.div>
          <QuickBriefingCard onOpenFull={() => { trackConversion("briefing_opened", { source: "quick_card" }); setBriefingOpen(true); }} />
        </div>
        <a className="scrollCue" href="#servicos"><span />Explore</a>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <SectionTitle eyebrow="O que fazemos" title={<>Tudo o que sua presença digital precisa para <span>crescer.</span></>} text="Da estratégia ao código, entregamos experiências completas e construídas para gerar valor real." />
          <div className="serviceGrid serviceList">{services.map((service, index) => { const Icon = service.icon; return <Reveal className="serviceCard" delay={(index % 3) * .08} key={service.title}><div className="serviceIcon"><Icon size={22} /></div><span className="cardNumber">0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contato" aria-label={`Saiba mais sobre ${service.title}`}>Explorar <ArrowRight size={14} /></a></Reveal>; })}</div>
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
          <div className="projectGrid editorialProjects">
            <Reveal className="projectCard projectWide"><div className="projectVisual realProjectVisual nieroProject"><Image src="/showcase/niero-desktop.png" alt="Página inicial do site Srta. Niero" fill sizes="(max-width: 900px) 100vw, 70vw" unoptimized /></div><div className="projectInfo"><div><span>WEBSITE · BRANDING</span><h3>Srta. Niero</h3></div><button type="button" onClick={() => { trackConversion("project_cta_clicked", { project: "Srta. Niero" }); setBriefingOpen(true); }} aria-label="Solicitar um site inspirado no projeto Srta. Niero">Quero um site assim <ArrowRight size={15} /></button></div></Reveal>
            <Reveal className="projectCard"><div className="projectVisual realProjectVisual apollunProject"><Image src="/showcase/apollun-desktop.png" alt="Página inicial do site Apollun.Dev" fill sizes="(max-width: 900px) 100vw, 70vw" unoptimized /></div><div className="projectInfo"><div><span>WEBSITE · UX/UI · DESENVOLVIMENTO</span><h3>Apollun.Dev</h3></div><button type="button" onClick={() => { trackConversion("project_cta_clicked", { project: "Apollun.Dev" }); setBriefingOpen(true); }} aria-label="Solicitar um site inspirado no projeto Apollun.Dev">Quero um site assim <ArrowRight size={15} /></button></div></Reveal>
            <Reveal className="projectCard"><div className="projectVisual realProjectVisual paolaProject"><Image src="/showcase/paola-desktop.png" alt="Página inicial do site da psicóloga Paola Milani" fill sizes="(max-width: 900px) 100vw, 70vw" unoptimized /></div><div className="projectInfo"><div><span>WEBSITE · PSICOLOGIA · UX/UI</span><h3>Paola Milani</h3></div><button type="button" onClick={() => { trackConversion("project_cta_clicked", { project: "Paola Milani" }); setBriefingOpen(true); }} aria-label="Solicitar um site inspirado no projeto Paola Milani">Quero um site assim <ArrowRight size={15} /></button></div></Reveal>
          </div>
        </div>
      </section>

      <section className="section pricingSection" id="planos">
        <div className="container">
          <SectionTitle eyebrow="Encontre o formato ideal" title={<>Um ponto de partida para <span>cada objetivo.</span></>} text="Escolha o cenário mais próximo do seu momento. Depois, personalizamos o escopo para a realidade da sua empresa." />
          <div className="pricingGrid">{plans.map((plan) => <Reveal className={`priceCard ${plan.featured ? "featured" : ""}`} key={plan.name}>
            <div className="planTop"><span className="planLabel">APOLLUN / {plan.code}</span>{plan.featured && <div className="popularBadge">Mais escolhido</div>}</div>
            <span className="planEyebrow">{plan.eyebrow}</span>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <div className="planIdeal"><span>Ideal para</span><strong>{plan.ideal}</strong></div>
            <div className="priceLine"><span>Investimento</span><strong>Personalizado</strong><small>definido após o briefing</small></div>
            <ul>{plan.items.map((item) => <li key={item}><span className="planCheck"><Check size={13} /></span>{item}</li>)}</ul>
            <button className={`button ${plan.featured ? "primary" : "secondary"}`} type="button" onClick={() => { trackConversion("plan_cta_clicked", { plan: plan.name }); setBriefingOpen(true); }}>{plan.cta} <ArrowRight size={16} /></button>
          </Reveal>)}</div>
          <div className="pricingHelp"><div><strong>Ainda não sabe qual formato escolher?</strong><span>Conte sua ideia e indicamos o caminho mais adequado, sem compromisso.</span></div><button type="button" onClick={() => setBriefingOpen(true)}>Receber recomendação <ArrowRight size={16} /></button></div>
        </div>
      </section>

      {SHOW_TESTIMONIALS && <section className="section testimonialSection">
        <div className="container testimonialLayout">
          <div><span className="eyebrow"><i />Experiência Apollun</span><h2>O padrão de percepção que buscamos em <span>cada entrega.</span></h2><div className="sliderControls"><button onClick={() => setTestimonial((testimonial + 2) % 3)} aria-label="Anterior">←</button><button onClick={() => setTestimonial((testimonial + 1) % 3)} aria-label="Próximo">→</button></div></div>
          <div className="quoteWindow"><motion.div key={testimonial} className="quoteCard" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45 }}><div className="stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div><blockquote>“{quoteCards[testimonial][1]}”</blockquote><div className="quoteMeta"><div className="avatar">A</div><div><strong>{quoteCards[testimonial][0]}</strong><span>Compromisso Apollun.Dev</span></div></div></motion.div></div>
        </div>
      </section>}

      <section className="section faqSection" id="faq">
        <div className="container faqLayout"><SectionTitle eyebrow="Perguntas frequentes" title={<>Tudo claro antes de <span>começarmos.</span></>} /><div className="faqList">{faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div>
      </section>

      <section className="finalCta" id="contato">
        <div className="finalGrid" /><div className="finalOrb orbA" /><div className="finalOrb orbB" />
        <Reveal className="container finalInner"><span className="eyebrow"><i />Seu próximo projeto começa aqui</span><h2>Vamos transformar sua ideia em uma experiência digital <span>extraordinária?</span></h2><p>Conte o que você quer construir. Nós cuidamos da estratégia, do design e da tecnologia.</p><button className="button ctaButton" type="button" onClick={() => setBriefingOpen(true)}>Solicitar orçamento <ArrowRight size={20} /></button></Reveal>
      </section>

      <footer className="footer"><div className="container"><div className="footerTop"><div><a className="brand" href="#inicio"><Image className="brandIcon" src="/apollun-icon.png" alt="" width={40} height={40} unoptimized />APOLLUN<span>.DEV</span></a><p>Transformando ideias em experiências digitais.</p></div><div className="footerColumn"><strong>Mapa do site</strong>{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</div><div className="footerColumn"><strong>Conecte-se</strong><a href="https://instagram.com/apollun.dev" target="_blank" rel="noreferrer">Instagram</a><a href="https://linkedin.com/company/apollun-dev" target="_blank" rel="noreferrer">LinkedIn</a><a href="mailto:contato@apollun.dev">E-mail</a><button className="footerBriefingLink" type="button" onClick={() => { trackConversion("briefing_opened", { source: "footer" }); setBriefingOpen(true); }}>WhatsApp</button></div><div className="footerColumn"><strong>Contato</strong><a href="mailto:contato@apollun.dev">contato@apollun.dev</a><span>Brasil · Atendimento digital</span></div></div><div className="footerBottom"><span>© {new Date().getFullYear()} Apollun.Dev</span><div><span>Política de Privacidade</span><span>Termos de Uso</span></div><span>Design & código com precisão.</span></div></div></footer>
      {briefingOpen && <BriefingModal onClose={() => setBriefingOpen(false)} />}
    </main>
  );
}
