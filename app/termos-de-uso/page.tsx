import type { Metadata } from "next";
import { LegalPage } from "../legal/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso — Apollun.Dev",
  description: "Condições aplicáveis à navegação e utilização do site da Apollun.Dev.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermsOfUsePage() {
  return <LegalPage
    eyebrow="Condições de utilização"
    title="Termos de Uso"
    intro="Estes termos estabelecem as condições para navegar neste site, consultar conteúdos e iniciar uma conversa comercial com a Apollun.Dev."
    sections={[
      { title: "Responsável pelo site", content: <><p>Este site é operado por <strong>Henrique de Freitas Pinto</strong>, pessoa física responsável pela Apollun.Dev, com atuação em São Bernardo do Campo, São Paulo.</p><p>O canal oficial de atendimento disponível no momento é o WhatsApp <a href="https://wa.me/5511940312713" target="_blank" rel="noreferrer">+55 11 94031-2713</a>.</p></> },
      { title: "Aceitação e finalidade", content: <><p>Ao utilizar este site, você declara ter lido e concordado com estes Termos de Uso e com a Política de Privacidade. Caso não concorde, interrompa a utilização.</p><p>O conteúdo possui finalidade institucional e comercial: apresentar a Apollun.Dev, seus serviços, processo, projetos e formas de contato.</p></> },
      { title: "Orçamentos e contratação", content: <><p>O preenchimento do briefing, o envio de mensagem ou a seleção de um plano não gera contratação automática, reserva de agenda ou obrigação de execução. Valores, escopo, prazos, responsabilidades e condições serão definidos em proposta ou contrato específico.</p><p>Quando houver divergência, a proposta ou o contrato assinado prevalecerá sobre informações gerais apresentadas neste site.</p></> },
      { title: "Uso permitido", content: <><p>Você se compromete a utilizar o site de maneira lícita e a fornecer informações verdadeiras quando iniciar um contato. É proibido tentar comprometer a segurança, interferir no funcionamento, introduzir código malicioso, obter acesso não autorizado ou utilizar os canais para fraude, spam ou atividades ilegais.</p><p>A Apollun.Dev poderá restringir interações abusivas e adotar medidas para proteger o site e terceiros.</p></> },
      { title: "Propriedade intelectual", content: <><p>Textos, identidade visual, logotipo, interface, código, composições gráficas e demais elementos próprios da Apollun.Dev são protegidos pela legislação aplicável. A navegação não concede licença para copiar, adaptar, distribuir ou explorar comercialmente esses materiais.</p><p>Projetos exibidos no portfólio podem envolver marcas e conteúdos pertencentes a seus respectivos titulares e são apresentados para demonstrar trabalhos e capacidades, respeitando os direitos aplicáveis.</p></> },
      { title: "Disponibilidade e resultados", content: <><p>Buscamos manter as informações corretas e o site disponível, mas podem ocorrer interrupções, atualizações ou falhas de terceiros. Conteúdos, serviços e condições podem ser ajustados sem aviso prévio, sem afetar contratos já celebrados.</p><p>Resultados de marketing, posicionamento, tráfego, vendas, SEO ou conversão dependem de fatores externos e não são garantidos apenas pela criação ou reformulação de um site.</p></> },
      { title: "Links e serviços de terceiros", content: <p>O site pode direcionar para WhatsApp, Instagram, LinkedIn, sites de clientes ou outros serviços externos. Esses ambientes possuem termos, disponibilidade e políticas próprias, e a Apollun.Dev não controla o funcionamento ou o conteúdo de terceiros.</p> },
      { title: "Responsabilidade", content: <><p>Dentro dos limites permitidos pela legislação, a Apollun.Dev não se responsabiliza por danos decorrentes do uso indevido do site, de informações fornecidas incorretamente pelo visitante, de indisponibilidade causada por terceiros ou de decisões tomadas exclusivamente com base em conteúdo institucional genérico.</p><p>Nada nestes termos exclui responsabilidades que não possam ser afastadas pela legislação brasileira, especialmente normas de proteção ao consumidor quando aplicáveis.</p></> },
      { title: "Alterações e legislação aplicável", content: <><p>Estes termos poderão ser atualizados para acompanhar mudanças no site, nos serviços ou na legislação. A versão vigente será publicada nesta página com sua data de atualização.</p><p>Aplicam-se as leis da República Federativa do Brasil. Eventuais controvérsias serão submetidas ao foro competente, preservado o direito do consumidor de utilizar o foro legalmente aplicável ao seu domicílio.</p></> },
    ]}
  />;
}
