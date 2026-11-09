import type { Metadata } from "next";
import CareDemo from "./CareDemo";

export const metadata: Metadata = {
  title: "Apollun Care — Agenda inteligente para psicólogos",
  description: "Conheça o Apollun Care: agenda, pacientes e lembretes organizados em uma experiência simples e profissional.",
  alternates: { canonical: "/care" },
  robots: { index: true, follow: true },
};

export default function CarePage() {
  return <CareDemo />;
}
