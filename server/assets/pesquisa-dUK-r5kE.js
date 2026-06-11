import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X, BookOpen, Filter } from "lucide-react";
import { A as AppLayout, c as useLivros, P as PageHeader, C as Card, a as Badge, B as Button } from "./ui-kit-BmPG-GCF.js";
import "@tanstack/react-router";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
function PesquisaPage() {
  const {
    data: livros = []
  } = useLivros();
  const [q, setQ] = useState("");
  const [autor, setAutor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [cat, setCat] = useState("");
  const [disp, setDisp] = useState("qualquer");
  const categorias = useMemo(() => Array.from(new Set(livros.map((l) => l.categoria).filter(Boolean))), [livros]);
  const autores = useMemo(() => Array.from(new Set(livros.flatMap((l) => l.autores?.map((a) => a.nome) ?? []))), [livros]);
  const suggestions = q ? livros.filter((l) => l.nome.toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];
  const results = livros.filter((l) => {
    const matchQ = !q || l.nome.toLowerCase().includes(q.toLowerCase());
    const matchAutor = !autor || l.autores?.some((a) => a.nome === autor);
    const matchIsbn = !isbn || l.isbn.includes(isbn);
    const matchCat = !cat || l.categoria === cat;
    const matchDisp = disp === "qualquer" || disp === "disponivel" && l.quantidade_disponivel > 0 || disp === "indisponivel" && l.quantidade_disponivel === 0;
    return matchQ && matchAutor && matchIsbn && matchCat && matchDisp;
  });
  const clear = () => {
    setQ("");
    setAutor("");
    setIsbn("");
    setCat("");
    setDisp("qualquer");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Pesquisa de livros", description: "Encontre títulos por nome, autor, ISBN, categoria ou disponibilidade." }),
    /* @__PURE__ */ jsxs(Card, { className: "p-6 mb-6 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 gradient-aurora opacity-50 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 h-14 px-4 rounded-2xl bg-card border border-border shadow-soft focus-within:shadow-elegant focus-within:border-primary/40 transition-all", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-5 h-5 text-primary" }),
          /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Digite o nome de um livro...", className: "flex-1 bg-transparent outline-none text-base" }),
          q && /* @__PURE__ */ jsx("button", { onClick: () => setQ(""), className: "w-7 h-7 grid place-items-center rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
        ] }),
        suggestions.length > 0 && /* @__PURE__ */ jsx(motion.div, { initial: {
          opacity: 0,
          y: -4
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "mt-2 rounded-xl border border-border bg-card shadow-card overflow-hidden", children: suggestions.map((s) => /* @__PURE__ */ jsxs("button", { onClick: () => setQ(s.nome), className: "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/60 transition-colors text-sm", children: [
          /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: s.nome }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground ml-auto", children: s.autores?.[0]?.nome })
        ] }, s.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-5 h-fit lg:sticky lg:top-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-semibold text-sm inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }),
            " Filtros"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: clear, className: "text-xs text-primary hover:underline", children: "Limpar" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Autor" }),
            /* @__PURE__ */ jsxs("select", { value: autor, onChange: (e) => setAutor(e.target.value), className: "mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
              autores.map((a) => /* @__PURE__ */ jsx("option", { value: a, children: a }, a))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Categoria" }),
            /* @__PURE__ */ jsxs("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
              categorias.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "ISBN" }),
            /* @__PURE__ */ jsx("input", { value: isbn, onChange: (e) => setIsbn(e.target.value), placeholder: "978-...", className: "mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground", children: "Disponibilidade" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 space-y-1", children: [{
              v: "qualquer",
              l: "Qualquer"
            }, {
              v: "disponivel",
              l: "Disponível agora"
            }, {
              v: "indisponivel",
              l: "Indisponível"
            }].map((o) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("input", { type: "radio", checked: disp === o.v, onChange: () => setDisp(o.v) }),
              o.l
            ] }, o.v)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mb-3", children: [
          results.length,
          " resultado(s)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: results.map((l, i) => /* @__PURE__ */ jsx(motion.div, { initial: {
          opacity: 0,
          y: 6
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: i * 0.03
        }, children: /* @__PURE__ */ jsxs(Card, { hover: true, className: "p-4 flex gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-20 rounded-lg gradient-ocean text-white grid place-items-center shrink-0 shadow-elegant", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: l.nome }),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground truncate", children: [
              l.autores?.[0]?.nome,
              " • ",
              l.editora?.nome
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx(Badge, { tone: "info", children: l.categoria }),
              /* @__PURE__ */ jsx(Badge, { tone: l.quantidade_disponivel > 0 ? "success" : "danger", children: l.quantidade_disponivel > 0 ? `${l.quantidade_disponivel} disponíveis` : "Indisponível" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", children: "Detalhes" }) })
          ] })
        ] }) }, l.id)) })
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(PesquisaPage, {}) });
export {
  SplitComponent as component
};
