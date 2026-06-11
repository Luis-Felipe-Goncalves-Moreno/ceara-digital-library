import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { User, Palette, Bell, Shield, Save } from "lucide-react";
import { A as AppLayout, P as PageHeader, C as Card, B as Button, a as Badge } from "./ui-kit-BmPG-GCF.js";
import "@tanstack/react-router";
import "framer-motion";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
const tabs = [{
  id: "perfil",
  label: "Perfil",
  icon: User
}, {
  id: "preferencias",
  label: "Preferências",
  icon: Palette
}, {
  id: "notificacoes",
  label: "Notificações",
  icon: Bell
}, {
  id: "permissoes",
  label: "Permissões",
  icon: Shield
}];
function ConfigPage() {
  const [tab, setTab] = useState("perfil");
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Configurações", description: "Personalize seu acesso e ajustes do sistema." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4", children: [
      /* @__PURE__ */ jsx(Card, { className: "p-2 h-fit", children: /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.id), className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`, children: [
          /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
          " ",
          t.label
        ] }, t.id);
      }) }) }),
      /* @__PURE__ */ jsxs(Card, { className: "p-6", children: [
        tab === "perfil" && /* @__PURE__ */ jsxs("div", { className: "space-y-5 max-w-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl gradient-ocean text-white grid place-items-center text-lg font-semibold shadow-elegant", children: "RC" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Renata Cavalcante" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Bibliotecária • Acesso completo" })
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "ml-auto", children: "Alterar foto" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(F, { label: "Nome completo", children: /* @__PURE__ */ jsx("input", { className: "i", defaultValue: "Renata Cavalcante" }) }),
            /* @__PURE__ */ jsx(F, { label: "E-mail", children: /* @__PURE__ */ jsx("input", { className: "i", defaultValue: "renata.c@biblioteca.ce.gov.br" }) }),
            /* @__PURE__ */ jsx(F, { label: "Cargo", children: /* @__PURE__ */ jsx("input", { className: "i", defaultValue: "Bibliotecária" }) }),
            /* @__PURE__ */ jsx(F, { label: "Telefone", children: /* @__PURE__ */ jsx("input", { className: "i", defaultValue: "(85) 98800-1001" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { children: [
            /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            " Salvar alterações"
          ] }) })
        ] }),
        tab === "preferencias" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 max-w-2xl", children: [
          /* @__PURE__ */ jsx(Toggle, { title: "Modo escuro automático", desc: "Sincronizar com o sistema operacional." }),
          /* @__PURE__ */ jsx(Toggle, { title: "Animações reduzidas", desc: "Diminui o uso de microinterações." }),
          /* @__PURE__ */ jsx(Toggle, { title: "Visualização compacta", desc: "Mais densidade de informação em tabelas.", defaultChecked: true }),
          /* @__PURE__ */ jsx(Toggle, { title: "Idioma", desc: "Português do Brasil (pt-BR)" })
        ] }),
        tab === "notificacoes" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 max-w-2xl", children: [
          /* @__PURE__ */ jsx(Toggle, { title: "E-mail de atrasos", desc: "Receber resumo diário de empréstimos atrasados.", defaultChecked: true }),
          /* @__PURE__ */ jsx(Toggle, { title: "Notificações push", desc: "Alertas no navegador para eventos críticos." }),
          /* @__PURE__ */ jsx(Toggle, { title: "Resumo semanal", desc: "Relatório toda segunda-feira pela manhã.", defaultChecked: true })
        ] }),
        tab === "permissoes" && /* @__PURE__ */ jsx("div", { className: "space-y-3 max-w-2xl", children: [{
          role: "Administrador",
          desc: "Acesso total, incluindo configurações.",
          tone: "danger"
        }, {
          role: "Bibliotecário",
          desc: "Gestão de acervo, empréstimos e usuários.",
          tone: "info"
        }, {
          role: "Assistente",
          desc: "Operações de balcão e devoluções.",
          tone: "accent"
        }, {
          role: "Estudante",
          desc: "Pesquisa de acervo e visualização de empréstimos próprios.",
          tone: "neutral"
        }].map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-border", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: r.role }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
          ] }),
          /* @__PURE__ */ jsx(Badge, { tone: r.tone, children: "Permissões" })
        ] }, r.role)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `.i { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-card); font-size: 14px; width: 100%; outline: none; }
        .i:focus { border-color: color-mix(in oklab, var(--color-primary) 50%, transparent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }` })
  ] });
}
function F({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: label }),
    children
  ] });
}
function Toggle({
  title,
  desc,
  defaultChecked
}) {
  const [on, setOn] = useState(!!defaultChecked);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl border border-border", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: desc })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => setOn((v) => !v), className: `relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${on ? "translate-x-5" : ""}` }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(ConfigPage, {}) });
export {
  SplitComponent as component
};
