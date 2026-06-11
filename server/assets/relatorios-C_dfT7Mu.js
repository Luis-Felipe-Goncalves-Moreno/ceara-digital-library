import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, RadialBarChart, RadialBar, LineChart, Line } from "recharts";
import { A as AppLayout, P as PageHeader, B as Button, C as Card } from "./ui-kit-BmPG-GCF.js";
import "react";
import "@tanstack/react-router";
import "framer-motion";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
const trimestres = [{
  t: "1º Tri",
  emp: 240,
  dev: 220,
  atrasos: 18
}, {
  t: "2º Tri",
  emp: 318,
  dev: 302,
  atrasos: 24
}, {
  t: "3º Tri",
  emp: 402,
  dev: 388,
  atrasos: 17
}, {
  t: "4º Tri",
  emp: 489,
  dev: 460,
  atrasos: 22
}];
const semanal = Array.from({
  length: 12
}).map((_, i) => ({
  s: `S${i + 1}`,
  ativos: 60 + Math.round(Math.sin(i) * 18 + i * 4)
}));
const desempenho = [{
  name: "Devolução em dia",
  value: 88,
  fill: "#008F4C"
}, {
  name: "Renovações",
  value: 64,
  fill: "#005CA9"
}, {
  name: "Satisfação",
  value: 92,
  fill: "#F4C542"
}];
function RelatoriosPage() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Relatórios", description: "Indicadores estratégicos e dados consolidados do acervo.", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "w-4 h-4" }),
        " Exportar Excel"
      ] }),
      /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" }),
        " Exportar PDF"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5 xl:col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Desempenho por trimestre" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Empréstimos, devoluções e atrasos" })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "text-xs text-primary inline-flex items-center gap-1 hover:underline", children: [
            /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }),
            " CSV"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: trimestres, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(0,0,0,0.06)", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "t", tick: {
            fontSize: 12,
            fill: "#64748b"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 12,
            fill: "#64748b"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)"
          } }),
          /* @__PURE__ */ jsx(Legend, { iconType: "circle" }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "emp", name: "Empréstimos", fill: "#005CA9", radius: [8, 8, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "dev", name: "Devoluções", fill: "#008F4C", radius: [8, 8, 0, 0] }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "atrasos", name: "Atrasos", fill: "#F4C542", radius: [8, 8, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-5", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Indicadores-chave" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Desempenho operacional" }),
        /* @__PURE__ */ jsx("div", { className: "h-80", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(RadialBarChart, { innerRadius: "20%", outerRadius: "100%", data: desempenho, startAngle: 90, endAngle: -270, children: [
          /* @__PURE__ */ jsx(RadialBar, { background: true, dataKey: "value", cornerRadius: 12 }),
          /* @__PURE__ */ jsx(Legend, { iconType: "circle", wrapperStyle: {
            fontSize: 12
          } })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-5 xl:col-span-3", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Usuários ativos por semana" }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Últimas 12 semanas" }),
        /* @__PURE__ */ jsx("div", { className: "h-72 mt-2", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: semanal, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: "rgba(0,0,0,0.06)", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "s", tick: {
            fontSize: 12,
            fill: "#64748b"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 12,
            fill: "#64748b"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.08)"
          } }),
          /* @__PURE__ */ jsx(Line, { dataKey: "ativos", stroke: "#005CA9", strokeWidth: 3, dot: {
            r: 4,
            fill: "#005CA9"
          }, activeDot: {
            r: 6
          } })
        ] }) }) })
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(RelatoriosPage, {}) });
export {
  SplitComponent as component
};
