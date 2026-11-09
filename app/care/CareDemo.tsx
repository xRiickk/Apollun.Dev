"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Bell, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, FileText, LayoutDashboard, Menu, MessageCircle, Plus, Search, ShieldCheck, Sparkles, UsersRound, X } from "lucide-react";
import styles from "./care.module.css";

type View = "dashboard" | "agenda" | "patients" | "records" | "messages";
type Appointment = { id: number; day: number; time: string; name: string; mode: string; status: "confirmed" | "waiting" };

const nav = [
  { id: "dashboard" as View, label: "Visão geral", icon: LayoutDashboard },
  { id: "agenda" as View, label: "Agenda", icon: CalendarDays, badge: "5" },
  { id: "patients" as View, label: "Pacientes", icon: UsersRound },
  { id: "records" as View, label: "Prontuário", icon: ClipboardList },
  { id: "messages" as View, label: "WhatsApp", icon: MessageCircle, badge: "3" },
];

const baseAppointments: Appointment[] = [
  { id: 1, day: 0, time: "09:00", name: "Clara Ribeiro", mode: "Online", status: "confirmed" },
  { id: 2, day: 1, time: "10:30", name: "Marina Souza", mode: "Presencial", status: "confirmed" },
  { id: 3, day: 2, time: "14:00", name: "Lucas Almeida", mode: "Online", status: "waiting" },
  { id: 4, day: 3, time: "15:30", name: "Gabriel Alves", mode: "Online", status: "waiting" },
  { id: 5, day: 5, time: "11:00", name: "Bianca Martins", mode: "Presencial", status: "confirmed" },
];

const patients = [
  ["Clara Ribeiro", "CR", "Hoje · 09:00", "Acompanhamento ativo"],
  ["Marina Souza", "MS", "Amanhã · 10:30", "Acompanhamento ativo"],
  ["Lucas Almeida", "LA", "Quarta · 14:00", "Aguardando confirmação"],
  ["Gabriel Alves", "GA", "Quinta · 15:30", "Acompanhamento ativo"],
  ["Bianca Martins", "BM", "Sábado · 11:00", "Acompanhamento ativo"],
];

function startOfWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay();
  value.setDate(value.getDate() - (day === 0 ? 6 : day - 1));
  value.setHours(12, 0, 0, 0);
  return value;
}

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", options).format(date).replace("-feira", "");

export default function CareDemo() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState(baseAppointments);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const now = useMemo(() => new Date(), []);
  const week = useMemo(() => {
    const start = startOfWeek(now);
    return Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });
  }, [now]);
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
  const title = nav.find((item) => item.id === view)?.label || "Visão geral";
  const filtered = patients.filter((patient) => patient[0].toLowerCase().includes(query.toLowerCase()));
  const selectView = (next: View) => { setView(next); setMenuOpen(false); };
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };
  const moveAppointment = (day: number, time: string) => {
    if (draggedId === null) return;
    setAppointments((items) => items.map((item) => item.id === draggedId ? { ...item, day, time } : item));
    setDraggedId(null); notify("Agendamento atualizado na demonstração.");
  };

  return <main className={styles.shell}>
    <div className={styles.demoBar}><Sparkles size={13} /> Demonstração interativa · dados fictícios</div>
    <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}><Image src="/apollun-icon.png" width={42} height={42} alt="" unoptimized /><div><strong>Apollun</strong><span>Care</span></div><button className={styles.closeMenu} onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div>
      <nav aria-label="Navegação da demonstração">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? styles.active : ""} onClick={() => selectView(item.id)}><Icon size={19} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</button>; })}</nav>
      <div className={styles.protected}><ShieldCheck size={19} /><div><strong>Ambiente demonstrativo</strong><span>Nenhum dado clínico real</span></div></div>
      <div className={styles.profile}><Image src="/apollun-icon.png" width={38} height={38} alt="" unoptimized /><div><strong>Henrique</strong><span>Apollun.Dev</span></div></div>
    </aside>
    <section className={styles.workspace}>
      <header className={styles.topbar}><button className={styles.mobileMenu} onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button><div><span>{formatDate(now, { weekday: "long", day: "2-digit", month: "long" })}</span><h1>{title}</h1></div><div className={styles.actions}><button onClick={() => setSearchOpen(true)}><Search size={17} /><span>Pesquisar</span></button><button className={styles.bell} aria-label="Notificações"><Bell size={18} /><i /></button><button className={styles.primary} onClick={() => { setView("agenda"); notify("Escolha um horário livre na agenda."); }}><Plus size={18} /><span>Novo agendamento</span></button></div></header>
      {view === "dashboard" && <Dashboard appointments={appointments} onAgenda={() => setView("agenda")} />}
      {view === "agenda" && <section className={styles.page}>
        <div className={styles.pageHead}><div><span className={styles.eyebrow}>Agenda inteligente</span><h2>Semana de {String(week[0].getDate()).padStart(2, "0")} a {String(week[6].getDate()).padStart(2, "0")} de {formatDate(week[6], { month: "long" })}</h2><p>Arraste um atendimento para simular um reagendamento rápido.</p></div><div className={styles.period}><button><ChevronLeft size={17} /></button><button className={styles.periodActive}>Semana</button><button><ChevronRight size={17} /></button></div></div>
        <div className={styles.legend}><span><i className={styles.confirmedDot} />Confirmado</span><span><i className={styles.waitingDot} />Aguardando</span><small>Todos os dias · 09h às 20h</small></div>
        <div className={styles.calendarWrap}><div className={styles.calendar} style={{ gridTemplateColumns: "70px repeat(7,minmax(145px,1fr))" }}><div className={styles.corner} />{week.map((date, index) => <div className={`${styles.dayHead} ${date.toDateString() === now.toDateString() ? styles.today : ""}`} key={date.toISOString()}><span>{formatDate(date, { weekday: "short" }).replace(".", "")}</span><strong>{String(date.getDate()).padStart(2, "0")}</strong>{index > 4 && <small>fim de semana</small>}</div>)}
          {hours.map((hour) => <div className={styles.hourRow} key={hour} style={{ display: "contents" }}><div className={styles.hour}>{hour}</div>{week.map((_, day) => { const event = appointments.find((item) => item.day === day && item.time.startsWith(hour.slice(0, 2))); return <div className={styles.slot} key={`${day}-${hour}`} onDragOver={(e) => e.preventDefault()} onDrop={() => moveAppointment(day, hour)}>{event && <button draggable onDragStart={() => setDraggedId(event.id)} onClick={() => setSelected(event)} className={`${styles.event} ${event.status === "waiting" ? styles.eventWaiting : ""}`}><span>{event.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{event.name}</strong><small>{event.time} · {event.mode}</small></div></button>}</div>; })}</div>)}</div></div>
      </section>}
      {view === "patients" && <section className={styles.page}><div className={styles.pageHead}><div><span className={styles.eyebrow}>Carteira clínica</span><h2>Pacientes</h2><p>Uma visão organizada dos acompanhamentos e próximos horários.</p></div><button className={styles.primary}><Plus size={17} /> Novo paciente</button></div><div className={styles.patientSearch}><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar paciente" /></div><div className={styles.patientList}>{filtered.map((patient) => <article key={patient[0]}><span>{patient[1]}</span><div><strong>{patient[0]}</strong><small>{patient[3]}</small></div><div><small>Próximo horário</small><strong>{patient[2]}</strong></div><button onClick={() => notify("Perfil demonstrativo aberto.")}>Ver perfil</button></article>)}</div></section>}
      {view === "records" && <EmptyState icon={FileText} eyebrow="Prontuário organizado" title="Histórico clínico com clareza e segurança." text="Na versão contratada, cada profissional acessa apenas os pacientes e registros autorizados para sua conta." action={() => setView("patients")} />}
      {view === "messages" && <Messages />}
    </section>
    <Link href="/" className={styles.backSite}><ArrowLeft size={16} /> Voltar ao site</Link>
    {toast && <div className={styles.toast}><CheckCircle2 size={18} />{toast}</div>}
    {selected && <div className={styles.modalBackdrop} onMouseDown={() => setSelected(null)}><article className={styles.modal} onMouseDown={(e) => e.stopPropagation()}><button className={styles.modalClose} onClick={() => setSelected(null)}><X /></button><span className={styles.eyebrow}>Detalhes do atendimento</span><div className={styles.modalPerson}><span>{selected.name.split(" ").map((part) => part[0]).join("")}</span><div><h2>{selected.name}</h2><p>{selected.mode} · {selected.status === "confirmed" ? "Confirmado" : "Aguardando confirmação"}</p></div></div><dl><div><dt>Data</dt><dd>{formatDate(week[selected.day], { weekday: "long", day: "2-digit", month: "long" })}</dd></div><div><dt>Horário</dt><dd>{selected.time}</dd></div><div><dt>Lembrete</dt><dd>WhatsApp programado</dd></div></dl><button className={styles.primary} onClick={() => { setSelected(null); notify("Modo de reagendamento ativado."); }}>Reagendar atendimento</button></article></div>}
    {searchOpen && <div className={styles.searchOverlay} onMouseDown={() => setSearchOpen(false)}><div onMouseDown={(e) => e.stopPropagation()}><Search size={20} /><input autoFocus placeholder="Pesquise pacientes ou horários…" /><button onClick={() => setSearchOpen(false)}><X /></button><p>Experimente buscar por “Marina”, “quinta” ou “15:30”.</p></div></div>}
  </main>;
}

function Dashboard({ appointments, onAgenda }: { appointments: Appointment[]; onAgenda: () => void }) {
  return <section className={styles.page}><div className={styles.welcome}><div><span className={styles.eyebrow}>Rotina organizada</span><h2>Seu atendimento merece<br /><em>mais tempo e menos tarefas.</em></h2><p>Agenda, pacientes e lembretes reunidos em um só ambiente.</p></div><div><strong>80%</strong><span>confirmados</span></div></div><div className={styles.metrics}><article><span>Atendimentos na semana</span><strong>{String(appointments.length).padStart(2, "0")}</strong><small>4 confirmados</small></article><article><span>Pacientes ativos</span><strong>24</strong><small>+3 neste mês</small></article><article><span>Lembretes enviados</span><strong>18</strong><small>Últimos 7 dias</small></article><article><span>Taxa de presença</span><strong>92%</strong><small>Últimos 30 dias</small></article></div><div className={styles.dashboardGrid}><article className={styles.panel}><div className={styles.panelHead}><div><span>Próximos atendimentos</span><h3>Agenda da semana</h3></div><button onClick={onAgenda}>Ver agenda completa →</button></div>{appointments.slice(0, 4).map((item) => <div className={styles.scheduleItem} key={item.id}><span>{item.time}</span><div><strong>{item.name}</strong><small>{item.mode}</small></div><em>{item.status === "confirmed" ? "Confirmado" : "Aguardando"}</em></div>)}</article><aside className={styles.panel}><div className={styles.panelHead}><div><span>Automações</span><h3>Lembretes</h3></div><MessageCircle size={20} /></div><div className={styles.automation}><CheckCircle2 /><div><strong>18 lembretes enviados</strong><small>WhatsApp · últimas 24h</small></div></div><div className={styles.automation}><Bell /><div><strong>Próximo envio às 14:45</strong><small>15 minutos antes da consulta</small></div></div></aside></div></section>;
}

function Messages() {
  return <section className={styles.page}><div className={styles.pageHead}><div><span className={styles.eyebrow}>Automação controlada</span><h2>Central de lembretes</h2><p>A demonstração não envia mensagens reais. A integração é ativada somente no ambiente protegido do cliente.</p></div><span className={styles.demoPill}>Modo demonstração</span></div><div className={styles.messagesGrid}><article className={styles.panel}><div className={styles.whatsappStatus}><MessageCircle size={28} /><div><strong>WhatsApp conectado</strong><span>Número de demonstração · •••• 2713</span></div><i /></div><div className={styles.messageSample}><small>LEMBRETE AUTOMÁTICO</small><p>Olá, Marina! Passando para lembrar que sua consulta está marcada para amanhã, às 10:30.</p><span>Programado para 09:30</span></div></article><article className={styles.panel}><span className={styles.eyebrow}>Fila de mensagens</span>{["Clara Ribeiro · confirmação", "Marina Souza · lembrete 24h", "Lucas Almeida · lembrete 15min"].map((item, index) => <div className={styles.queue} key={item}><span>{index + 1}</span><strong>{item}</strong><em>Agendado</em></div>)}</article></div></section>;
}

function EmptyState({ icon: Icon, eyebrow, title, text, action }: { icon: typeof FileText; eyebrow: string; title: string; text: string; action: () => void }) {
  return <section className={styles.page}><div className={styles.empty}><span><Icon size={34} /></span><em className={styles.eyebrow}>{eyebrow}</em><h2>{title}</h2><p>{text}</p><button className={styles.primary} onClick={action}>Visualizar pacientes</button></div></section>;
}
