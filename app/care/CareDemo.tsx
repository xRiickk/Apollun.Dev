"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import styles from "./care.module.css";

type View =
  "dashboard" | "agenda" | "patients" | "records" | "finance" | "messages";
type CalendarMode = "week" | "month";
type PaymentStatus = "paid" | "pending" | "courtesy" | "cancelled";
type Appointment = {
  id: number;
  day: number;
  time: string;
  name: string;
  mode: string;
  status: "confirmed" | "waiting";
  value: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: string;
  paymentNote?: string;
};

const nav = [
  { id: "dashboard" as View, label: "Visão geral", icon: LayoutDashboard },
  { id: "agenda" as View, label: "Agenda", icon: CalendarDays, badge: "5" },
  { id: "patients" as View, label: "Pacientes", icon: UsersRound },
  { id: "records" as View, label: "Prontuário", icon: ClipboardList },
  {
    id: "finance" as View,
    label: "Financeiro",
    icon: WalletCards,
    badge: "Em breve",
  },
  {
    id: "messages" as View,
    label: "WhatsApp",
    icon: MessageCircle,
    badge: "3",
  },
];

const baseAppointments: Appointment[] = [
  {
    id: 1,
    day: 0,
    time: "09:00",
    name: "Clara Ribeiro",
    mode: "Online",
    status: "confirmed",
    value: 180,
    paymentStatus: "paid",
    paymentMethod: "Pix",
  },
  {
    id: 2,
    day: 1,
    time: "10:30",
    name: "Marina Souza",
    mode: "Presencial",
    status: "confirmed",
    value: 180,
    paymentStatus: "paid",
    paymentMethod: "Cartão",
  },
  {
    id: 3,
    day: 2,
    time: "14:00",
    name: "Lucas Almeida",
    mode: "Online",
    status: "waiting",
    value: 180,
    paymentStatus: "pending",
  },
  {
    id: 4,
    day: 3,
    time: "15:30",
    name: "Gabriel Alves",
    mode: "Online",
    status: "waiting",
    value: 180,
    paymentStatus: "pending",
  },
  {
    id: 5,
    day: 5,
    time: "11:00",
    name: "Bianca Martins",
    mode: "Presencial",
    status: "confirmed",
    value: 180,
    paymentStatus: "paid",
    paymentMethod: "Pix",
  },
];

const patients = [
  ["Clara Ribeiro", "CR", "Hoje · 09:00", "Acompanhamento ativo"],
  ["Marina Souza", "MS", "Amanhã · 10:30", "Acompanhamento ativo"],
  ["Lucas Almeida", "LA", "Quarta · 14:00", "Aguardando confirmação"],
  ["Gabriel Alves", "GA", "Quinta · 15:30", "Acompanhamento ativo"],
  ["Bianca Martins", "BM", "Sábado · 11:00", "Acompanhamento ativo"],
];

const patientPackages: Record<
  string,
  { total: number; used: number; label: string }
> = {
  "Clara Ribeiro": { total: 8, used: 5, label: "Pacote de 8 sessões" },
  "Marina Souza": { total: 4, used: 4, label: "Pacote de 4 sessões" },
  "Lucas Almeida": { total: 8, used: 2, label: "Pacote de 8 sessões" },
  "Gabriel Alves": { total: 4, used: 1, label: "Pacote de 4 sessões" },
  "Bianca Martins": { total: 8, used: 6, label: "Pacote de 8 sessões" },
};

const STORAGE_KEY = "apollun-care-demo-finance-v1";

function isStoredAppointment(value: unknown): value is Appointment {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Appointment>;
  return (
    typeof item.id === "number" &&
    Number.isInteger(item.id) &&
    typeof item.day === "number" &&
    item.day >= 0 &&
    item.day <= 6 &&
    typeof item.time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time) &&
    typeof item.name === "string" &&
    item.name.length > 0 &&
    typeof item.mode === "string" &&
    (item.status === "confirmed" || item.status === "waiting") &&
    typeof item.value === "number" &&
    Number.isFinite(item.value) &&
    item.value >= 0 &&
    ["paid", "pending", "courtesy", "cancelled"].includes(
      String(item.paymentStatus),
    )
  );
}

function startOfWeek(date: Date) {
  const value = new Date(date);
  const day = value.getDay();
  value.setDate(value.getDate() - (day === 0 ? 6 : day - 1));
  value.setHours(12, 0, 0, 0);
  return value;
}

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", options).format(date).replace("-feira", "");

const localDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDate = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const subscribeToPreviewEnvironment = () => () => {};
const getLocalPreviewSnapshot = () =>
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const getServerPreviewSnapshot = () => false;

export default function CareDemo() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState(baseAppointments);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);
  const isLocalPreview = useSyncExternalStore(
    subscribeToPreviewEnvironment,
    getLocalPreviewSnapshot,
    getServerPreviewSnapshot,
  );
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const now = useMemo(() => new Date(), []);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed.every(isStoredAppointment)
          )
            setAppointments(parsed);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setStorageReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (storageReady)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments, storageReady]);
  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    [],
  );
  const baseWeek = useMemo(() => {
    const start = startOfWeek(now);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [now]);
  const week = useMemo(
    () =>
      baseWeek.map((date) => {
        const shifted = new Date(date);
        shifted.setDate(date.getDate() + weekOffset * 7);
        return shifted;
      }),
    [baseWeek, weekOffset],
  );
  const displayedMonth = useMemo(
    () => new Date(now.getFullYear(), now.getMonth() + monthOffset, 1, 12),
    [monthOffset, now],
  );
  const monthDays = useMemo(() => {
    const start = startOfWeek(displayedMonth);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [displayedMonth]);
  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];
  const title = nav.find((item) => item.id === view)?.label || "Visão geral";
  const filtered = patients.filter((patient) =>
    patient[0].toLowerCase().includes(query.toLowerCase()),
  );
  const selectView = (next: View) => {
    setView(next);
    setMenuOpen(false);
  };
  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  };
  const moveAppointment = (day: number, time: string) => {
    if (draggedId === null) return;
    setAppointments((items) =>
      items.map((item) =>
        item.id === draggedId ? { ...item, day, time } : item,
      ),
    );
    setDraggedId(null);
    notify("Agendamento atualizado na demonstração.");
  };

  return (
    <main className={styles.shell}>
      <div className={styles.demoBar}>
        <Sparkles size={13} /> Demonstração interativa · dados fictícios
      </div>
      <aside
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.brand}>
          <Image
            src="/brand/apollun-submarca.png"
            width={46}
            height={46}
            alt=""
            unoptimized
          />
          <div>
            <strong>Apollun</strong>
            <span>Care</span>
          </div>
          <button
            className={styles.closeMenu}
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Navegação da demonstração">
          {nav.map((item) => {
            const Icon = item.icon;
            const isComingSoon = item.id === "finance";
            const isComingSoonLocked = isComingSoon && !isLocalPreview;
            const badge =
              item.id === "agenda" ? String(appointments.length) : item.badge;
            return (
              <button
                key={item.id}
                className={`${view === item.id ? styles.active : ""} ${
                  isComingSoonLocked ? styles.comingSoonNav : ""
                }`}
                aria-current={view === item.id ? "page" : undefined}
                aria-label={
                  isComingSoon
                    ? isLocalPreview
                      ? `${item.label}, prévia local`
                      : `${item.label}, disponível em breve`
                    : undefined
                }
                disabled={isComingSoonLocked}
                title={
                  isComingSoon
                    ? isLocalPreview
                      ? "Abrir prévia local"
                      : "Disponível em breve"
                    : undefined
                }
                onClick={() => selectView(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {badge && <em>{badge}</em>}
              </button>
            );
          })}
        </nav>
        <div className={styles.protected}>
          <ShieldCheck size={19} />
          <div>
            <strong>Ambiente demonstrativo</strong>
            <span>Nenhum dado clínico real</span>
          </div>
        </div>
        <div className={styles.profile}>
          <Image
            src="/brand/apollun-submarca.png"
            width={38}
            height={38}
            alt=""
            unoptimized
          />
          <div>
            <strong>Henrique</strong>
            <span>Apollun.Dev</span>
          </div>
        </div>
      </aside>
      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <button
            className={styles.mobileMenu}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu />
          </button>
          <div>
            <span>
              {formatDate(now, {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </span>
            <h1>{title}</h1>
          </div>
          <div className={styles.actions}>
            <button
              onClick={() => {
                setQuery("");
                setSearchOpen(true);
              }}
            >
              <Search size={17} />
              <span>Pesquisar</span>
            </button>
            <button
              className={styles.bell}
              aria-label="Ver notificações"
              onClick={() =>
                notify("Você tem 3 lembretes programados na demonstração.")
              }
            >
              <Bell size={18} />
              <i />
            </button>
            <button
              className={styles.primary}
              onClick={() => {
                setView("agenda");
                setCalendarMode("week");
                setWeekOffset(0);
                notify("Escolha um horário livre na agenda.");
              }}
            >
              <Plus size={18} />
              <span>Novo agendamento</span>
            </button>
          </div>
        </header>
        {view === "dashboard" && (
          <Dashboard
            appointments={appointments}
            onAgenda={() => setView("agenda")}
          />
        )}
        {view === "agenda" && (
          <section className={styles.page}>
            <div className={styles.pageHead}>
              <div>
                <span className={styles.eyebrow}>Agenda inteligente</span>
                <h2>
                  {calendarMode === "week"
                    ? `Semana de ${String(week[0].getDate()).padStart(2, "0")} a ${String(week[6].getDate()).padStart(2, "0")} de ${formatDate(week[6], { month: "long" })}`
                    : formatDate(displayedMonth, {
                        month: "long",
                        year: "numeric",
                      }).replace(/^./, (letter) => letter.toUpperCase())}
                </h2>
                <p>
                  {calendarMode === "month"
                    ? "Visualize todos os atendimentos do mês e abra os detalhes com um clique."
                    : weekOffset === 0
                      ? "Arraste um atendimento para simular um reagendamento rápido."
                      : "Semana sem atendimentos cadastrados nesta demonstração."}
                </p>
              </div>
              <div className={styles.period}>
                <button
                  onClick={() =>
                    calendarMode === "week"
                      ? setWeekOffset((value) => value - 1)
                      : setMonthOffset((value) => value - 1)
                  }
                  aria-label={
                    calendarMode === "week"
                      ? "Ver semana anterior"
                      : "Ver mês anterior"
                  }
                >
                  <ChevronLeft size={17} />
                </button>
                <div
                  className={styles.periodModes}
                  aria-label="Visualização da agenda"
                >
                  <button
                    className={
                      calendarMode === "week" ? styles.periodActive : ""
                    }
                    aria-pressed={calendarMode === "week"}
                    onClick={() => {
                      setCalendarMode("week");
                      setWeekOffset(0);
                    }}
                  >
                    Semana
                  </button>
                  <button
                    className={
                      calendarMode === "month" ? styles.periodActive : ""
                    }
                    aria-pressed={calendarMode === "month"}
                    onClick={() => {
                      setCalendarMode("month");
                      setMonthOffset(0);
                    }}
                  >
                    Mês
                  </button>
                </div>
                <button
                  onClick={() =>
                    calendarMode === "week"
                      ? setWeekOffset((value) => value + 1)
                      : setMonthOffset((value) => value + 1)
                  }
                  aria-label={
                    calendarMode === "week"
                      ? "Ver próxima semana"
                      : "Ver próximo mês"
                  }
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
            <div className={styles.legend}>
              <span>
                <i className={styles.confirmedDot} />
                Confirmado
              </span>
              <span>
                <i className={styles.waitingDot} />
                Aguardando
              </span>
              <small>Todos os dias · 09h às 20h</small>
            </div>
            {calendarMode === "week" ? (
              <div className={styles.calendarWrap}>
                <div className={styles.calendar}>
                  <div className={styles.corner} />
                  {week.map((date, index) => (
                    <div
                      className={`${styles.dayHead} ${isSameDate(date, now) ? styles.today : ""}`}
                      key={date.toISOString()}
                    >
                      <span>
                        {formatDate(date, { weekday: "short" }).replace(
                          ".",
                          "",
                        )}
                      </span>
                      <strong>{String(date.getDate()).padStart(2, "0")}</strong>
                      {index > 4 && <small>fim de semana</small>}
                    </div>
                  ))}
                  {hours.map((hour) => (
                    <div className={styles.hourRow} key={hour}>
                      <div className={styles.hour}>{hour}</div>
                      {week.map((_, day) => {
                        const event =
                          weekOffset === 0
                            ? appointments.find(
                                (item) =>
                                  item.day === day &&
                                  item.time.startsWith(hour.slice(0, 2)),
                              )
                            : undefined;
                        return (
                          <div
                            className={styles.slot}
                            key={`${day}-${hour}`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={() => moveAppointment(day, hour)}
                          >
                            {event && (
                              <button
                                draggable
                                onDragStart={() => setDraggedId(event.id)}
                                onClick={() => setSelected(event)}
                                aria-label={`Abrir atendimento de ${event.name}, ${event.time}, ${event.mode}`}
                                className={`${styles.event} ${event.status === "waiting" ? styles.eventWaiting : ""}`}
                              >
                                <span>
                                  {event.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")}
                                </span>
                                <div>
                                  <strong>{event.name}</strong>
                                  <small>
                                    {event.time} · {event.mode}
                                  </small>
                                </div>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.monthWrap}>
                <div className={styles.monthWeekdays} aria-hidden="true">
                  {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                    (weekday) => (
                      <span key={weekday}>{weekday}</span>
                    ),
                  )}
                </div>
                <div className={styles.monthCalendar}>
                  {monthDays.map((date) => {
                    const dayAppointments = appointments.filter((item) =>
                      isSameDate(baseWeek[item.day], date),
                    );
                    const outsideMonth =
                      date.getMonth() !== displayedMonth.getMonth();
                    return (
                      <article
                        className={`${styles.monthDay} ${outsideMonth ? styles.monthDayOutside : ""} ${isSameDate(date, now) ? styles.monthDayToday : ""}`}
                        key={date.toISOString()}
                        aria-label={formatDate(date, {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                        })}
                      >
                        <time dateTime={localDateInputValue(date)}>
                          {date.getDate()}
                        </time>
                        <div>
                          {dayAppointments.map((event) => (
                            <button
                              key={event.id}
                              onClick={() => setSelected(event)}
                              aria-label={`Abrir atendimento de ${event.name}, ${event.time}, ${event.mode}`}
                              className={`${styles.monthEvent} ${event.status === "waiting" ? styles.monthEventWaiting : ""}`}
                            >
                              <strong>{event.time}</strong>
                              <span>{event.name}</span>
                            </button>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
        {view === "patients" && (
          <section className={styles.page}>
            <div className={styles.pageHead}>
              <div>
                <span className={styles.eyebrow}>Carteira clínica</span>
                <h2>Pacientes</h2>
                <p>
                  Uma visão organizada dos acompanhamentos e próximos horários.
                </p>
              </div>
              <button
                className={styles.primary}
                onClick={() =>
                  notify(
                    "O cadastro de paciente será aberto na versão completa.",
                  )
                }
              >
                <Plus size={17} /> Novo paciente
              </button>
            </div>
            <label className={styles.patientSearch}>
              <Search size={18} />
              <span className={styles.srOnly}>Buscar paciente</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar paciente"
              />
            </label>
            <div className={styles.patientList}>
              {filtered.map((patient) => (
                <article key={patient[0]}>
                  <span>{patient[1]}</span>
                  <div>
                    <strong>{patient[0]}</strong>
                    <small>{patient[3]}</small>
                  </div>
                  <div>
                    <small>Próximo horário</small>
                    <strong>{patient[2]}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(patient[0])}
                    aria-label={`Ver perfil de ${patient[0]}`}
                  >
                    Ver perfil
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {view === "records" && (
          <EmptyState
            icon={FileText}
            eyebrow="Prontuário organizado"
            title="Histórico clínico com clareza e segurança."
            text="Na versão contratada, cada profissional acessa apenas os pacientes e registros autorizados para sua conta."
            action={() => setView("patients")}
          />
        )}
        {view === "finance" && (
          <Finance
            appointments={appointments}
            week={baseWeek}
            onUpdate={setAppointments}
            notify={notify}
          />
        )}
        {view === "messages" && <Messages />}
      </section>
      <Link href="/" className={styles.backSite}>
        <ArrowLeft size={16} /> Voltar ao site
      </Link>
      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
      {selected && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={() => setSelected(null)}
        >
          <article
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelected(null)}
              aria-label="Fechar detalhes"
            >
              <X />
            </button>
            <span className={styles.eyebrow}>Detalhes do atendimento</span>
            <div className={styles.modalPerson}>
              <span>
                {selected.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <h2 id="appointment-title">{selected.name}</h2>
                <p>
                  {selected.mode} ·{" "}
                  {selected.status === "confirmed"
                    ? "Confirmado"
                    : "Aguardando confirmação"}
                </p>
              </div>
            </div>
            <dl>
              <div>
                <dt>Data</dt>
                <dd>
                  {formatDate(baseWeek[selected.day], {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </dd>
              </div>
              <div>
                <dt>Horário</dt>
                <dd>{selected.time}</dd>
              </div>
              <div>
                <dt>Pagamento</dt>
                <dd
                  className={
                    selected.paymentStatus === "paid"
                      ? styles.paidText
                      : styles.pendingText
                  }
                >
                  {paymentStatusLabel(selected.paymentStatus)}
                  {selected.paymentMethod ? ` · ${selected.paymentMethod}` : ""}
                </dd>
              </div>
              <div>
                <dt>Valor</dt>
                <dd>{money(selected.value)}</dd>
              </div>
              <div>
                <dt>Lembrete</dt>
                <dd>WhatsApp programado</dd>
              </div>
            </dl>
            <div className={styles.modalActions}>
              {selected.paymentStatus === "pending" && (
                <button
                  className={styles.secondaryAction}
                  onClick={() => {
                    setSelected(null);
                    setView("finance");
                    notify(
                      "Abra o pagamento pendente para completar o registro.",
                    );
                  }}
                >
                  <CircleDollarSign size={16} /> Registrar pagamento
                </button>
              )}
              <button
                className={styles.primary}
                onClick={() => {
                  setSelected(null);
                  notify("Modo de reagendamento ativado.");
                }}
              >
                Reagendar
              </button>
            </div>
          </article>
        </div>
      )}
      {selectedPatient && (
        <PatientProfile
          name={selectedPatient}
          appointments={appointments.filter(
            (item) => item.name === selectedPatient,
          )}
          week={baseWeek}
          onClose={() => setSelectedPatient(null)}
          notify={notify}
        />
      )}
      {searchOpen && (
        <div
          className={styles.searchOverlay}
          onMouseDown={() => {
            setSearchOpen(false);
            setQuery("");
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Pesquisa global"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Search size={20} />
            <input
              autoFocus
              aria-label="Pesquisar pacientes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquise um paciente…"
            />
            <button
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
              }}
              aria-label="Fechar pesquisa"
            >
              <X />
            </button>
            <div className={styles.searchResults}>
              {query ? (
                filtered.slice(0, 5).map((patient) => (
                  <button
                    key={patient[0]}
                    onClick={() => {
                      setSearchOpen(false);
                      setView("patients");
                      setSelectedPatient(patient[0]);
                      setQuery("");
                    }}
                  >
                    <span>{patient[1]}</span>
                    <div>
                      <strong>{patient[0]}</strong>
                      <small>{patient[3]}</small>
                    </div>
                  </button>
                ))
              ) : (
                <p>Digite o nome de um paciente para localizar seu perfil.</p>
              )}
              {query && filtered.length === 0 && (
                <p>Nenhum paciente encontrado.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Dashboard({
  appointments,
  onAgenda,
}: {
  appointments: Appointment[];
  onAgenda: () => void;
}) {
  const confirmed = appointments.filter(
    (item) => item.status === "confirmed",
  ).length;
  const confirmationRate = appointments.length
    ? Math.round((confirmed / appointments.length) * 100)
    : 0;
  return (
    <section className={styles.page}>
      <div className={styles.welcome}>
        <div>
          <span className={styles.eyebrow}>Rotina organizada</span>
          <h2>
            Seu atendimento merece
            <br />
            <em>mais tempo e menos tarefas.</em>
          </h2>
          <p>Agenda, pacientes e lembretes reunidos em um só ambiente.</p>
        </div>
        <div>
          <strong>{confirmationRate}%</strong>
          <span>confirmados</span>
        </div>
      </div>
      <div className={styles.metrics}>
        <article>
          <span>Atendimentos na semana</span>
          <strong>{String(appointments.length).padStart(2, "0")}</strong>
          <small>{confirmed} confirmados</small>
        </article>
        <article>
          <span>Pacientes ativos</span>
          <strong>{appointments.length}</strong>
          <small>Dados demonstrativos</small>
        </article>
        <article>
          <span>Lembretes enviados</span>
          <strong>18</strong>
          <small>Últimos 7 dias</small>
        </article>
        <article>
          <span>Taxa de presença</span>
          <strong>92%</strong>
          <small>Últimos 30 dias</small>
        </article>
      </div>
      <div className={styles.dashboardGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span>Próximos atendimentos</span>
              <h3>Agenda da semana</h3>
            </div>
            <button onClick={onAgenda}>Ver agenda completa →</button>
          </div>
          {appointments.slice(0, 4).map((item) => (
            <div className={styles.scheduleItem} key={item.id}>
              <span>{item.time}</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.mode}</small>
              </div>
              <em>
                {item.status === "confirmed" ? "Confirmado" : "Aguardando"}
              </em>
            </div>
          ))}
        </article>
        <aside className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <span>Automações</span>
              <h3>Lembretes</h3>
            </div>
            <MessageCircle size={20} />
          </div>
          <div className={styles.automation}>
            <CheckCircle2 />
            <div>
              <strong>18 lembretes enviados</strong>
              <small>WhatsApp · últimas 24h</small>
            </div>
          </div>
          <div className={styles.automation}>
            <Bell />
            <div>
              <strong>Próximo envio às 14:45</strong>
              <small>15 minutos antes da consulta</small>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

const paymentStatusLabel = (status: PaymentStatus) =>
  ({
    paid: "Pago",
    pending: "Pendente",
    courtesy: "Cortesia",
    cancelled: "Cancelado",
  })[status];

function exportFinanceCsv(appointments: Appointment[], week: Date[]) {
  const header = [
    "Paciente",
    "Data",
    "Horário",
    "Modalidade",
    "Valor",
    "Status",
    "Forma de pagamento",
    "Observação",
  ];
  const rows = appointments.map((item) => [
    item.name,
    formatDate(week[item.day], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    item.time,
    item.mode,
    item.value.toFixed(2).replace(".", ","),
    paymentStatusLabel(item.paymentStatus),
    item.paymentMethod || "",
    item.paymentNote || "",
  ]);
  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell);
          const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
          return `"${safe.replaceAll('"', '""')}"`;
        })
        .join(";"),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "fechamento-financeiro-apollun-care.csv";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadReceiptPdf(item: Appointment, appointmentDate: Date) {
  const clean = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "")
      .replaceAll("\\", "\\\\")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)");
  const lines = [
    "APOLLUN CARE - RECIBO DEMONSTRATIVO",
    `Paciente: ${item.name}`,
    `Atendimento: ${formatDate(appointmentDate, { day: "2-digit", month: "2-digit", year: "numeric" })} as ${item.time}`,
    `Valor recebido: ${money(item.value)}`,
    `Forma de pagamento: ${item.paymentMethod || "Nao informada"}`,
    `Data do pagamento: ${item.paymentDate ? new Date(`${item.paymentDate}T12:00:00`).toLocaleDateString("pt-BR") : "Nao informada"}`,
    item.paymentNote ? `Observacao: ${item.paymentNote}` : "",
    "Documento gerado em ambiente demonstrativo. Sem validade fiscal.",
  ]
    .filter(Boolean)
    .map(clean);
  const commands = [
    "BT",
    "/F1 18 Tf",
    "50 780 Td",
    `(${lines[0]}) Tj`,
    "/F1 11 Tf",
    ...lines.slice(1).flatMap((line) => ["0 -34 Td", `(${line}) Tj`]),
    "ET",
  ].join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n",
    `4 0 obj\n<< /Length ${commands.length} >>\nstream\n${commands}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += object;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join(
      "\n",
    )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  const safeName =
    item.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "paciente";
  link.download = `recibo-${safeName}.pdf`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Finance({
  appointments,
  week,
  onUpdate,
  notify,
}: {
  appointments: Appointment[];
  week: Date[];
  onUpdate: (items: Appointment[]) => void;
  notify: (message: string) => void;
}) {
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");
  const [query, setQuery] = useState("");
  const [paymentTarget, setPaymentTarget] = useState<Appointment | null>(null);
  const received = appointments
    .filter((item) => item.paymentStatus === "paid")
    .reduce((sum, item) => sum + item.value, 0);
  const pending = appointments
    .filter((item) => item.paymentStatus === "pending")
    .reduce((sum, item) => sum + item.value, 0);
  const filtered = appointments.filter(
    (item) =>
      (status === "all" || item.paymentStatus === status) &&
      item.name.toLowerCase().includes(query.toLowerCase()),
  );
  const previousMonth = 720;
  const projected = received + pending;
  const comparison = Math.round(
    ((projected - previousMonth) / previousMonth) * 100,
  );
  const chartMaximum = Math.max(previousMonth, projected, 1);
  const currentMonthLabel = formatDate(week[3], { month: "long" });
  const previousMonthDate = new Date(week[3]);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousMonthLabel = formatDate(previousMonthDate, { month: "long" });
  const savePayment = (updated: Appointment) => {
    onUpdate(
      appointments.map((item) => (item.id === updated.id ? updated : item)),
    );
    setPaymentTarget(null);
    notify("Informações de pagamento salvas.");
  };

  return (
    <>
      <section className={styles.page}>
        <div className={styles.pageHead}>
          <div>
            <span className={styles.eyebrow}>Gestão do consultório</span>
            <h2>Financeiro</h2>
            <p>
              Acompanhe recebimentos e pendências ligados a cada atendimento.
            </p>
          </div>
          <button
            className={styles.exportButton}
            onClick={() => {
              exportFinanceCsv(appointments, week);
              notify("Planilha financeira exportada.");
            }}
          >
            <Download size={17} /> Exportar relatório
          </button>
        </div>
        <div className={styles.financeSoon} role="note">
          <Sparkles size={18} />
          <div>
            <strong>Módulo financeiro em breve</strong>
            <span>
              Esta tela é uma prévia demonstrativa do controle de pagamentos,
              pendências e fechamento mensal.
            </span>
          </div>
        </div>
        <div className={styles.financeSummary}>
          <article>
            <span>Recebido no período</span>
            <strong>{money(received)}</strong>
            <small>
              {
                appointments.filter((item) => item.paymentStatus === "paid")
                  .length
              }{" "}
              pagamentos confirmados
            </small>
            <i className={styles.summaryPaid}>
              <CircleDollarSign />
            </i>
          </article>
          <article>
            <span>A receber</span>
            <strong>{money(pending)}</strong>
            <small>
              {
                appointments.filter((item) => item.paymentStatus === "pending")
                  .length
              }{" "}
              pagamentos pendentes
            </small>
            <i className={styles.summaryPending}>
              <Bell />
            </i>
          </article>
          <article>
            <span>Previsão total</span>
            <strong>{money(received + pending)}</strong>
            <small>Atendimentos desta semana</small>
            <i>
              <WalletCards />
            </i>
          </article>
          <article>
            <span>Valor médio</span>
            <strong>
              {money(
                appointments.reduce((sum, item) => sum + item.value, 0) /
                  appointments.length,
              )}
            </strong>
            <small>Por atendimento</small>
            <i>
              <CalendarDays />
            </i>
          </article>
        </div>
        <section
          className={styles.monthlyClose}
          aria-labelledby="monthly-close-title"
        >
          <div className={styles.monthlyIntro}>
            <span className={styles.eyebrow}>Fechamento mensal</span>
            <h3 id="monthly-close-title">Visão de {currentMonthLabel}</h3>
            <p>
              Compare o movimento do consultório e identifique as pendências
              antes do fim do mês.
            </p>
            <button
              onClick={() => {
                exportFinanceCsv(appointments, week);
                notify("Planilha do fechamento mensal exportada.");
              }}
            >
              <Download size={15} /> Baixar planilha
            </button>
          </div>
          <div
            className={styles.monthlyChart}
            aria-label="Comparativo de faturamento"
          >
            <div>
              <span>{previousMonthLabel}</span>
              <strong>{money(previousMonth)}</strong>
              <progress
                aria-label={`Faturamento de ${previousMonthLabel}`}
                max={chartMaximum}
                value={previousMonth}
              />
            </div>
            <div>
              <span>{currentMonthLabel} · previsão</span>
              <strong>{money(projected)}</strong>
              <progress
                aria-label={`Previsão de faturamento de ${currentMonthLabel}`}
                max={chartMaximum}
                value={projected}
              />
            </div>
          </div>
          <div className={styles.monthlyStats}>
            <article>
              <BarChart3 />
              <span>Comparação</span>
              <strong>
                {comparison >= 0 ? "+" : ""}
                {comparison}%
              </strong>
              <small>em relação a outubro</small>
            </article>
            <article>
              <CalendarDays />
              <span>Atendimentos</span>
              <strong>{appointments.length}</strong>
              <small>neste período</small>
            </article>
            <article>
              <Bell />
              <span>Pendências</span>
              <strong>
                {
                  appointments.filter(
                    (item) => item.paymentStatus === "pending",
                  ).length
                }
              </strong>
              <small>aguardando pagamento</small>
            </article>
          </div>
        </section>
        <section
          className={styles.financePanel}
          aria-labelledby="finance-list-title"
        >
          <header className={styles.financeToolbar}>
            <div>
              <span className={styles.eyebrow}>Movimentações</span>
              <h3 id="finance-list-title">Atendimentos e pagamentos</h3>
            </div>
            <div className={styles.financeControls}>
              <label className={styles.financeSearch}>
                <Search size={16} />
                <span className={styles.srOnly}>Buscar paciente</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar paciente"
                />
              </label>
              <div
                className={styles.statusFilter}
                aria-label="Filtrar pagamentos"
              >
                {(["all", "paid", "pending"] as const).map((filter) => (
                  <button
                    key={filter}
                    className={status === filter ? styles.filterActive : ""}
                    onClick={() => setStatus(filter)}
                  >
                    {filter === "all"
                      ? "Todos"
                      : filter === "paid"
                        ? "Pagos"
                        : "Pendentes"}
                  </button>
                ))}
              </div>
            </div>
          </header>
          <div
            className={styles.financeTable}
            role="table"
            aria-label="Pagamentos dos atendimentos"
          >
            <div className={styles.financeTableHead} role="row">
              <span>Paciente</span>
              <span>Atendimento</span>
              <span>Valor</span>
              <span>Forma</span>
              <span>Status</span>
              <span>Ação</span>
            </div>
            {filtered.map((item) => (
              <article className={styles.financeRow} role="row" key={item.id}>
                <div data-label="Paciente">
                  <span className={styles.financeAvatar}>
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <strong>{item.name}</strong>
                </div>
                <div data-label="Atendimento">
                  <strong>
                    {formatDate(week[item.day], {
                      day: "2-digit",
                      month: "short",
                    })}
                  </strong>
                  <small>
                    {item.time} · {item.mode}
                  </small>
                </div>
                <strong data-label="Valor">{money(item.value)}</strong>
                <span data-label="Forma">
                  {item.paymentMethod || "Não informada"}
                </span>
                <em
                  data-label="Status"
                  className={
                    item.paymentStatus === "paid"
                      ? styles.paymentPaid
                      : item.paymentStatus === "pending"
                        ? styles.paymentPending
                        : styles.paymentNeutral
                  }
                >
                  {paymentStatusLabel(item.paymentStatus)}
                </em>
                <div className={styles.financeActions} data-label="Ação">
                  {item.paymentStatus === "pending" && (
                    <>
                      <button onClick={() => setPaymentTarget(item)}>
                        Registrar
                      </button>
                      <button
                        className={styles.reminderButton}
                        onClick={() =>
                          notify(
                            `Lembrete de pagamento preparado para ${item.name}.`,
                          )
                        }
                        aria-label={`Preparar lembrete para ${item.name}`}
                      >
                        <Send size={14} />
                      </button>
                    </>
                  )}
                  {item.paymentStatus === "paid" && (
                    <button
                      onClick={() => downloadReceiptPdf(item, week[item.day])}
                    >
                      <ReceiptText size={14} /> Recibo
                    </button>
                  )}
                  {(item.paymentStatus === "courtesy" ||
                    item.paymentStatus === "cancelled") && (
                    <button onClick={() => setPaymentTarget(item)}>
                      Editar
                    </button>
                  )}
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className={styles.noResults}>
                Nenhum pagamento encontrado com esse filtro.
              </div>
            )}
          </div>
          <footer className={styles.financeNote}>
            <ShieldCheck size={16} />
            <span>
              Valores demonstrativos. Nenhuma cobrança ou movimentação bancária
              é realizada neste ambiente.
            </span>
          </footer>
        </section>
      </section>
      {paymentTarget && (
        <PaymentModal
          key={paymentTarget.id}
          appointment={paymentTarget}
          onClose={() => setPaymentTarget(null)}
          onSave={savePayment}
        />
      )}
    </>
  );
}

function PaymentModal({
  appointment,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}) {
  const [value, setValue] = useState(String(appointment.value));
  const [status, setStatus] = useState<PaymentStatus>(
    appointment.paymentStatus,
  );
  const [method, setMethod] = useState(appointment.paymentMethod || "Pix");
  const [date, setDate] = useState(
    appointment.paymentDate || localDateInputValue(),
  );
  const [note, setNote] = useState(appointment.paymentNote || "");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedValue = Number(value);
    onSave({
      ...appointment,
      value: Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0,
      paymentStatus: status,
      paymentMethod: status === "paid" ? method : undefined,
      paymentDate: status === "paid" ? date : undefined,
      paymentNote: note.trim() || undefined,
    });
  };
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <form
        className={`${styles.modal} ${styles.paymentModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Fechar registro de pagamento"
        >
          <X />
        </button>
        <span className={styles.eyebrow}>Registrar pagamento</span>
        <h2 id="payment-title">{appointment.name}</h2>
        <p className={styles.formIntro}>
          Complete as informações para manter o financeiro e o histórico do
          paciente atualizados.
        </p>
        <div className={styles.formGrid}>
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PaymentStatus)
              }
            >
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="courtesy">Cortesia</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </label>
          <label>
            <span>Valor</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Data do pagamento</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={status !== "paid"}
              required={status === "paid"}
            />
          </label>
          <label>
            <span>Forma de pagamento</span>
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              disabled={status !== "paid"}
            >
              <option>Pix</option>
              <option>Cartão</option>
              <option>Dinheiro</option>
              <option>Transferência</option>
            </select>
          </label>
          <label className={styles.fullField}>
            <span>Observação opcional</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={180}
              placeholder="Ex.: referente ao pacote de novembro"
            />
          </label>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className={styles.primary} type="submit">
            <CheckCircle2 size={16} /> Salvar pagamento
          </button>
        </div>
      </form>
    </div>
  );
}

function PatientProfile({
  name,
  appointments,
  week,
  onClose,
  notify,
}: {
  name: string;
  appointments: Appointment[];
  week: Date[];
  onClose: () => void;
  notify: (message: string) => void;
}) {
  const pack = patientPackages[name];
  const paid = appointments
    .filter((item) => item.paymentStatus === "paid")
    .reduce((total, item) => total + item.value, 0);
  const pending = appointments
    .filter((item) => item.paymentStatus === "pending")
    .reduce((total, item) => total + item.value, 0);
  return (
    <div className={styles.modalBackdrop} onMouseDown={onClose}>
      <article
        className={`${styles.modal} ${styles.patientModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-profile-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Fechar histórico do paciente"
        >
          <X />
        </button>
        <span className={styles.eyebrow}>Perfil do paciente</span>
        <div className={styles.modalPerson}>
          <span>
            {name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </span>
          <div>
            <h2 id="patient-profile-title">{name}</h2>
            <p>Histórico financeiro e pacote de sessões</p>
          </div>
        </div>
        <div className={styles.patientFinanceSummary}>
          <article>
            <span>Total pago</span>
            <strong>{money(paid)}</strong>
          </article>
          <article>
            <span>Em aberto</span>
            <strong>{money(pending)}</strong>
          </article>
        </div>
        {pack && (
          <section className={styles.packageCard}>
            <PackageCheck />
            <div>
              <span>{pack.label}</span>
              <strong>
                {pack.used} de {pack.total} sessões utilizadas
              </strong>
              <progress
                aria-label={`Progresso do ${pack.label}`}
                value={pack.used}
                max={pack.total}
              />
            </div>
          </section>
        )}
        <section className={styles.patientHistory}>
          <h3>Histórico de atendimentos</h3>
          {appointments.map((item) => (
            <article key={item.id}>
              <div>
                <strong>
                  {formatDate(week[item.day], {
                    day: "2-digit",
                    month: "long",
                  })}{" "}
                  · {item.time}
                </strong>
                <small>
                  {item.mode} ·{" "}
                  {item.paymentMethod || paymentStatusLabel(item.paymentStatus)}
                </small>
              </div>
              <span>{money(item.value)}</span>
              {item.paymentStatus === "paid" ? (
                <button
                  onClick={() => {
                    downloadReceiptPdf(item, week[item.day]);
                    notify("Recibo demonstrativo gerado em PDF.");
                  }}
                >
                  <ReceiptText size={14} /> Recibo
                </button>
              ) : (
                <em>{paymentStatusLabel(item.paymentStatus)}</em>
              )}
            </article>
          ))}
        </section>
      </article>
    </div>
  );
}

function Messages() {
  return (
    <section className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <span className={styles.eyebrow}>Automação controlada</span>
          <h2>Central de lembretes</h2>
          <p>
            A demonstração não envia mensagens reais. A integração é ativada
            somente no ambiente protegido do cliente.
          </p>
        </div>
        <span className={styles.demoPill}>Modo demonstração</span>
      </div>
      <div className={styles.messagesGrid}>
        <article className={styles.panel}>
          <div className={styles.whatsappStatus}>
            <MessageCircle size={28} />
            <div>
              <strong>WhatsApp conectado</strong>
              <span>Número de demonstração · •••• 2713</span>
            </div>
            <i />
          </div>
          <div className={styles.messageSample}>
            <small>LEMBRETE AUTOMÁTICO</small>
            <p>
              Olá, Marina! Passando para lembrar que sua consulta está marcada
              para amanhã, às 10:30.
            </p>
            <span>Programado para 09:30</span>
          </div>
        </article>
        <article className={styles.panel}>
          <span className={styles.eyebrow}>Fila de mensagens</span>
          {[
            "Clara Ribeiro · confirmação",
            "Marina Souza · lembrete 24h",
            "Lucas Almeida · lembrete 15min",
          ].map((item, index) => (
            <div className={styles.queue} key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
              <em>Agendado</em>
            </div>
          ))}
        </article>
      </div>
    </section>
  );
}

function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  text,
  action,
}: {
  icon: typeof FileText;
  eyebrow: string;
  title: string;
  text: string;
  action: () => void;
}) {
  return (
    <section className={styles.page}>
      <div className={styles.empty}>
        <span>
          <Icon size={34} />
        </span>
        <em className={styles.eyebrow}>{eyebrow}</em>
        <h2>{title}</h2>
        <p>{text}</p>
        <button className={styles.primary} onClick={action}>
          Visualizar pacientes
        </button>
      </div>
    </section>
  );
}
