import type { Metadata } from "next";
import NieroWorkspace from "./workspace";

export const metadata: Metadata = {
  title: "Agenda da Niero | Apollun",
  description:
    "Área privada de organização de reuniões, prazos e projetos da Niero.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function NieroPage() {
  return <NieroWorkspace />;
}
