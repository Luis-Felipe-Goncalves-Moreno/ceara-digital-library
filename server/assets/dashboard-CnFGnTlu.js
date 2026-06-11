import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Repeat, Users, AlertTriangle, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { A as AppLayout, c as useLivros, b as useEmprestimos, u as useProfiles, P as PageHeader, C as Card, a as Badge } from "./ui-kit-BmPG-GCF.js";
import "@tanstack/react-router";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
function DashboardPage() {
  const {
    data: livros = []
  } = useLivros();
  const {
    data: emp = []
  } = useEmprestimos();
  const {
    data: users = []
  } = useProfiles();
  const ativos = emp.filter((e) => e.status !== "devolvido").length;
  const atrasados = emp.filter((e) => e.status === "atrasado").length;
  const stats = [{
    label: "Acervo total",
    value: livros.length,
    icon: BookOpen,
    tone: "info"
  }, {
    label: "Empréstimos ativos",
    value: ativos,
    icon: Repeat,
    tone: "accent"
  }, {
    label: "Usuários cadastrados",
    value: users.length,
    icon: Users,
    tone: "success"
  }, {
    label: "Atrasos",
    value: atrasados,
    icon: AlertTriangle,
    tone: "danger"
  }];
  const topLivros = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    emp.forEach((e) => {
      const nome = e.livro?.nome ?? "—";
      map.set(nome, (map.get(nome) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([nome, emp2]) => ({
      nome,
      emp: emp2
    })).sort((a, b) => b.emp - a.emp).slice(0, 5);
  }, [emp]);
  const proximas = emp.filter((e) => e.status !== "devolvido").sort((a, b) => +new Date(a.data_estimada) - +new Date(b.data_estimada)).slice(0, 6);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Visão executiva", description: "Indicadores em tempo real do acervo, dos empréstimos e da comunidade leitora." }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4", children: stats.map((s, i) => /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.05
    }, children: /* @__PURE__ */ jsxs(Card, { hover: true, className: "p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wider", children: s.label }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-3xl font-display font-semibold", children: s.value })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 grid place-items-center text-primary", children: /* @__PURE__ */ jsx(s.icon, { className: "w-5 h-5" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs(Badge, { tone: s.tone, children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-3 h-3" }),
          " em tempo real"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground inline-flex items-center gap-1", children: [
          "Ver detalhes ",
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })
        ] })
      ] })
    ] }) }, s.label)) }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Livros mais emprestados" }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mb-4", children: "Baseado em todos os empréstimos registrados" }),
      /* @__PURE__ */ jsx("div", { className: "h-64", children: topLivros.length === 0 ? /* @__PURE__ */ jsx("div", { className: "h-full grid place-items-center text-sm text-muted-foreground", children: "Sem empréstimos ainda." }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: topLivros, layout: "vertical", margin: {
        left: 20
      }, children: [
        /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(0,0,0,0.06)", horizontal: false }),
        /* @__PURE__ */ jsx(XAxis, { type: "number", tick: {
          fontSize: 12,
          fill: "#64748b"
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(YAxis, { type: "category", dataKey: "nome", width: 180, tick: {
          fontSize: 12,
          fill: "#0F172A"
        }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.08)"
        } }),
        /* @__PURE__ */ jsx(Bar, { dataKey: "emp", radius: [0, 8, 8, 0], fill: "#005CA9" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Próximas devoluções" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Empréstimos ativos do acervo" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs uppercase text-muted-foreground border-b border-border", children: [
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-medium", children: "Usuário" }),
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-medium", children: "Livro" }),
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-medium", children: "Devolução estimada" }),
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-4 font-medium", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxs("tbody", { children: [
          proximas.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "py-6 text-center text-muted-foreground", children: "Sem empréstimos ativos." }) }),
          proximas.map((e) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60 hover:bg-muted/40 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: e.usuario?.nome ?? "—" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: e.livro?.nome ?? "—" }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: new Date(e.data_estimada).toLocaleDateString("pt-BR") }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-4", children: /* @__PURE__ */ jsx(Badge, { tone: e.status === "atrasado" ? "danger" : "info", children: e.status === "atrasado" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }),
              " Atrasado"
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
              " Em dia"
            ] }) }) })
          ] }, e.id))
        ] })
      ] }) }),
      emp.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-muted-foreground inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-success" }),
        " ",
        emp.filter((e) => e.status === "devolvido").length,
        " devolvidos no histórico."
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(DashboardPage, {}) });
export {
  SplitComponent as component
};
