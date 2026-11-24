"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./workspace.module.css";

type Item = {
  id: string;
  title: string;
  kind: "meeting" | "task" | "deadline";
  description: string;
  startsAt: string | null;
  endsAt: string | null;
  status: "open" | "done";
};
type Screen = "checking" | "login" | "setup" | "workspace";
type ApiResult = { error?: string; items?: Item[]; item?: Item };

const kinds = { meeting: "Reunião", task: "Tarefa", deadline: "Prazo" };

export default function NieroWorkspace() {
  const [screen, setScreen] = useState<Screen>("checking");
  const [invite, setInvite] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [email, setEmail] = useState("srtaniero@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      const token = new URLSearchParams(window.location.search).get("convite");
      if (token) {
        if (active) {
          setInvite(token);
          setScreen("setup");
        }
        return;
      }
      void fetch("/api/niero/auth", { cache: "no-store" })
        .then(async (response) => {
          if (!active) return;
          if (!response.ok) {
            setScreen("login");
            return;
          }
          setScreen("workspace");
          const data = await fetch("/api/niero/items", {
            cache: "no-store",
          }).then((result) => result.json() as Promise<ApiResult>);
          if (active) setItems(data.items ?? []);
        })
        .catch(() => {
          if (!active) return;
          setMessage("Não foi possível conectar à agenda.");
          setScreen("login");
        });
    });
    return () => {
      active = false;
    };
  }, []);

  async function submitAuth(
    event: FormEvent<HTMLFormElement>,
    action: "login" | "setup",
  ) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/niero/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, password, invitation: invite }),
      });
      const data = (await response.json()) as ApiResult;
      if (!response.ok) {
        setMessage(data.error ?? "Não foi possível entrar.");
        return;
      }
      setScreen("workspace");
      setPassword("");
      const results = await fetch("/api/niero/items", {
        cache: "no-store",
      }).then((result) => result.json() as Promise<ApiResult>);
      setItems(results.items ?? []);
      window.history.replaceState({}, "", "/niero");
    } catch {
      setMessage("Falha de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/niero/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          kind: data.get("kind"),
          description: data.get("description"),
          startsAt: data.get("startsAt")
            ? new Date(String(data.get("startsAt"))).toISOString()
            : null,
        }),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok) {
        setMessage(result.error ?? "Não foi possível salvar.");
        return;
      }
      if (!result.item) {
        setMessage("Resposta inválida ao salvar o item.");
        return;
      }
      const savedItem = result.item;
      setItems((current) =>
        [...current, savedItem].sort((a, b) =>
          (a.startsAt ?? "9999").localeCompare(b.startsAt ?? "9999"),
        ),
      );
      form.reset();
    } catch {
      setMessage("Falha de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleItem(item: Item) {
    const status = item.status === "done" ? "open" : "done";
    const response = await fetch("/api/niero/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, status }),
    });
    if (response.ok)
      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status } : entry,
        ),
      );
  }

  async function logout() {
    await fetch("/api/niero/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setItems([]);
    setScreen("login");
  }

  if (screen === "checking")
    return (
      <main className={styles.center}>
        <p>Verificando seu acesso…</p>
      </main>
    );
  if (screen === "login" || screen === "setup")
    return (
      <main className={styles.center}>
        <section className={styles.authCard} aria-labelledby="auth-title">
          <Link className={styles.brand} href="/">
            Apollun<span> · Niero</span>
          </Link>
          <p className={styles.eyebrow}>Área privada de trabalho</p>
          <h1 id="auth-title">
            {screen === "setup" ? "Crie sua senha" : "Bem-vinda, Bianca"}
          </h1>
          <p className={styles.muted}>
            {screen === "setup"
              ? "Defina uma senha forte para ativar seu acesso individual."
              : "Entre para organizar reuniões, projetos, tarefas e prazos."}
          </p>
          <form
            onSubmit={(event) =>
              void submitAuth(event, screen === "setup" ? "setup" : "login")
            }
          >
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
                readOnly
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  screen === "setup" ? "new-password" : "current-password"
                }
                minLength={screen === "setup" ? 12 : 1}
                maxLength={128}
                required
              />
            </label>
            {screen === "setup" && (
              <small>
                Use pelo menos 12 caracteres. Não reutilize a senha de outro
                serviço.
              </small>
            )}
            {message && (
              <p className={styles.error} role="alert">
                {message}
              </p>
            )}
            <button disabled={busy}>
              {busy
                ? "Aguarde…"
                : screen === "setup"
                  ? "Ativar minha conta"
                  : "Entrar na agenda"}
            </button>
          </form>
          <p className={styles.privacy}>
            Acesso individual · dados armazenados com segurança no Apollun
          </p>
        </section>
      </main>
    );

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          Apollun<span> · Niero</span>
        </Link>
        <div>
          <span className={styles.user}>Bianca Niero</span>
          <button className={styles.logout} onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </header>
      <section className={styles.content}>
        <p className={styles.eyebrow}>Organização de trabalho</p>
        <h1>Sua agenda, em um só lugar.</h1>
        <p className={styles.muted}>
          Reuniões, tarefas e prazos dos projetos da Niero.
        </p>
        <div className={styles.grid}>
          <form
            className={styles.formCard}
            onSubmit={(event) => void addItem(event)}
          >
            <h2>Novo compromisso ou tarefa</h2>
            <label>
              Título
              <input
                name="title"
                maxLength={120}
                placeholder="Ex.: Reunião de identidade visual"
                required
              />
            </label>
            <div className={styles.formRow}>
              <label>
                Tipo
                <select name="kind">
                  <option value="meeting">Reunião</option>
                  <option value="task">Tarefa</option>
                  <option value="deadline">Prazo</option>
                </select>
              </label>
              <label>
                Data e hora
                <input name="startsAt" type="datetime-local" />
              </label>
            </div>
            <label>
              Detalhes
              <textarea
                name="description"
                maxLength={2000}
                rows={3}
                placeholder="Contexto ou próximos passos"
              />
            </label>
            {message && (
              <p className={styles.error} role="alert">
                {message}
              </p>
            )}
            <button disabled={busy}>
              {busy ? "Salvando…" : "Adicionar à agenda"}
            </button>
          </form>
          <section className={styles.listCard} aria-labelledby="items-heading">
            <div className={styles.listHead}>
              <h2 id="items-heading">Minha agenda</h2>
              <span>
                {items.filter((item) => item.status === "open").length} em
                aberto
              </span>
            </div>
            {items.length === 0 ? (
              <p className={styles.empty}>
                Sua agenda está livre. Adicione a primeira reunião, tarefa ou
                prazo.
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={item.status === "done" ? styles.done : ""}
                  >
                    <button
                      aria-label={
                        item.status === "done"
                          ? "Reabrir item"
                          : "Marcar como concluído"
                      }
                      onClick={() => void toggleItem(item)}
                    >
                      {item.status === "done" ? "✓" : "○"}
                    </button>
                    <div>
                      <span className={styles.kind}>{kinds[item.kind]}</span>
                      <strong>{item.title}</strong>
                      {item.startsAt && (
                        <time dateTime={item.startsAt}>
                          {new Intl.DateTimeFormat("pt-BR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(item.startsAt))}
                        </time>
                      )}
                      {item.description && <p>{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <p className={styles.notice}>
          Agenda privada da Niero. Os dados ficam associados ao acesso
          individual da Bianca.
        </p>
      </section>
    </main>
  );
}
