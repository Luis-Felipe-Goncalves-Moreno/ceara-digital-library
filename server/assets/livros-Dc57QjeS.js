import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, List, LayoutGrid, BookOpen, Trash2, X, Loader2, Sparkles } from "lucide-react";
import { A as AppLayout, d as useSession, i as isStaff, c as useLivros, e as useCreateLivro, f as useDeleteLivro, P as PageHeader, B as Button, C as Card, a as Badge } from "./ui-kit-BmPG-GCF.js";
import { c as createSsrRpc, u as useServerFn } from "./createSsrRpc-BUS6oWjf.js";
import { a as createServerFn } from "./server-kq0mmrF1.js";
import { z } from "zod";
import { toast } from "sonner";
import "@tanstack/react-router";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "node:async_hooks";
import "node:stream";
import "@tanstack/react-router/ssr/server";
const lookupIsbn = createServerFn({
  method: "POST"
}).inputValidator((d) => z.object({
  isbn: z.string().min(8).max(20)
}).parse(d)).handler(createSsrRpc("f4dc482465e25c46e0259b5759cab3c929c7fe9aa6bbd5db365ff02233bf4fc8"));
function LivrosPage() {
  const {
    roles
  } = useSession();
  const staff = isStaff(roles);
  const {
    data: livros,
    isLoading
  } = useLivros();
  const createLivro = useCreateLivro();
  const deleteLivro = useDeleteLivro();
  const lookup = useServerFn(lookupIsbn);
  const [view, setView] = useState("grid");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [looking, setLooking] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    subtitulo: "",
    categoria: "",
    ano: "",
    paginas: "",
    sinopse: "",
    capa_url: "",
    editora_nome: "",
    autores: "",
    quantidade_total: "5"
  });
  const categorias = useMemo(() => Array.from(new Set((livros ?? []).map((l) => l.categoria).filter(Boolean))), [livros]);
  const filtered = (livros ?? []).filter((l) => {
    const matchesQ = !q || l.nome.toLowerCase().includes(q.toLowerCase()) || l.isbn?.includes(q) || l.autores?.some((a) => a.nome.toLowerCase().includes(q.toLowerCase()));
    const matchesC = cat === "todas" || l.categoria === cat;
    return matchesQ && matchesC;
  });
  const doLookup = async () => {
    if (!isbn.trim()) return;
    setLooking(true);
    try {
      const r = await lookup({
        data: {
          isbn: isbn.trim()
        }
      });
      setForm({
        nome: r.titulo,
        subtitulo: r.subtitulo ?? "",
        categoria: r.categoria ?? "",
        ano: r.ano ? String(r.ano) : "",
        paginas: r.paginas ? String(r.paginas) : "",
        sinopse: r.sinopse ?? "",
        capa_url: r.capa_url ?? "",
        editora_nome: r.editora ?? "",
        autores: r.autores.join(", "),
        quantidade_total: "5"
      });
      toast.success(r.fonte === "none" ? "ISBN não encontrado. Preencha manualmente." : `Dados encontrados (${r.fonte}).`);
    } catch (e) {
      toast.error(e.message ?? "Falha ao consultar ISBN");
    } finally {
      setLooking(false);
    }
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      await createLivro.mutateAsync({
        isbn: isbn.trim(),
        nome: form.nome,
        subtitulo: form.subtitulo || void 0,
        categoria: form.categoria || void 0,
        ano: form.ano ? Number(form.ano) : void 0,
        paginas: form.paginas ? Number(form.paginas) : void 0,
        sinopse: form.sinopse || void 0,
        capa_url: form.capa_url || void 0,
        editora_nome: form.editora_nome || void 0,
        autores_nomes: form.autores.split(",").map((s) => s.trim()).filter(Boolean),
        quantidade_total: Number(form.quantidade_total) || 1
      });
      toast.success("Livro cadastrado!");
      setModalOpen(false);
      setIsbn("");
      setForm({
        nome: "",
        subtitulo: "",
        categoria: "",
        ano: "",
        paginas: "",
        sinopse: "",
        capa_url: "",
        editora_nome: "",
        autores: "",
        quantidade_total: "5"
      });
    } catch (e2) {
      toast.error(e2.message ?? "Erro ao cadastrar");
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Acervo", description: "Cadastre livros automaticamente pelo ISBN — capa e metadados via Open Library / Google Books.", actions: staff && /* @__PURE__ */ jsxs(Button, { onClick: () => setModalOpen(true), children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
      " Novo livro"
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "p-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar título, autor ou ISBN...", className: "bg-transparent outline-none text-sm flex-1" })
      ] }),
      /* @__PURE__ */ jsxs("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
        /* @__PURE__ */ jsx("option", { value: "todas", children: "Todas as categorias" }),
        categorias.map((c) => /* @__PURE__ */ jsx("option", { value: c, children: c }, c))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-xl border border-border p-1 bg-card", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setView("table"), className: `px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: [
          /* @__PURE__ */ jsx(List, { className: "w-3.5 h-3.5" }),
          " Tabela"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setView("grid"), className: `px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`, children: [
          /* @__PURE__ */ jsx(LayoutGrid, { className: "w-3.5 h-3.5" }),
          " Grade"
        ] })
      ] })
    ] }) }),
    isLoading && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Array.from({
      length: 8
    }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] rounded-2xl shimmer" }, i)) }),
    !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxs(Card, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsx(BookOpen, { className: "w-10 h-10 mx-auto text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Nenhum livro cadastrado ainda" }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-1", children: staff ? 'Clique em "Novo livro" e informe o ISBN — preenchemos o resto.' : "Aguarde o bibliotecário cadastrar livros." })
    ] }),
    !isLoading && view === "grid" && filtered.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4", children: filtered.map((l, i) => /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0,
      y: 8
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.02
    }, children: /* @__PURE__ */ jsxs(Card, { hover: true, className: "p-3 group", children: [
      /* @__PURE__ */ jsxs("div", { className: "aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-muted relative", children: [
        l.capa_url ? /* @__PURE__ */ jsx("img", { src: l.capa_url, alt: l.nome, className: "w-full h-full object-cover", onError: (e) => {
          e.target.style.display = "none";
        } }) : /* @__PURE__ */ jsx("div", { className: "w-full h-full gradient-ocean grid place-items-center text-white", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-10 h-10 opacity-90" }) }),
        staff && /* @__PURE__ */ jsx("button", { onClick: () => {
          if (confirm(`Excluir "${l.nome}"?`)) deleteLivro.mutate(l.id);
        }, className: "absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-lg bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition hover:bg-destructive hover:text-destructive-foreground", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold truncate", title: l.nome, children: l.nome }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground truncate", children: l.autores?.[0]?.nome ?? "—" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
        l.categoria && /* @__PURE__ */ jsx(Badge, { tone: "info", children: l.categoria }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
          l.quantidade_disponivel,
          "/",
          l.quantidade_total
        ] })
      ] })
    ] }) }, l.id)) }),
    !isLoading && view === "table" && filtered.length > 0 && /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs uppercase text-muted-foreground", children: [
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Título" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Autor" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Categoria" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "ISBN" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Disp." }),
        staff && /* @__PURE__ */ jsx("th", { className: "py-3 px-4" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: filtered.map((l) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          l.capa_url ? /* @__PURE__ */ jsx("img", { src: l.capa_url, className: "w-9 h-12 rounded object-cover", alt: "" }) : /* @__PURE__ */ jsx("div", { className: "w-9 h-12 rounded gradient-ocean text-white grid place-items-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsx("div", { className: "font-medium", children: l.nome })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-muted-foreground", children: l.autores?.[0]?.nome ?? "—" }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4", children: l.categoria && /* @__PURE__ */ jsx(Badge, { tone: "info", children: l.categoria }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-mono text-xs text-muted-foreground", children: l.isbn }),
        /* @__PURE__ */ jsxs("td", { className: "py-3 px-4 text-xs", children: [
          l.quantidade_disponivel,
          "/",
          l.quantidade_total
        ] }),
        staff && /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => {
          if (confirm(`Excluir "${l.nome}"?`)) deleteLivro.mutate(l.id);
        }, className: "w-8 h-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }) }) })
      ] }, l.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: modalOpen && /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0
    }, animate: {
      opacity: 1
    }, exit: {
      opacity: 0
    }, className: "fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto", onClick: () => setModalOpen(false), children: /* @__PURE__ */ jsx(motion.div, { initial: {
      scale: 0.96,
      y: 8
    }, animate: {
      scale: 1,
      y: 0
    }, exit: {
      scale: 0.96,
      y: 8
    }, onClick: (e) => e.stopPropagation(), className: "w-full max-w-2xl bg-card rounded-2xl shadow-glow border border-border my-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-lg font-semibold", children: "Cadastrar livro" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Informe o ISBN e preenchemos os dados automaticamente." })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "w-8 h-8 grid place-items-center rounded-lg hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("input", { required: true, value: isbn, onChange: (e) => setIsbn(e.target.value), placeholder: "ISBN (ex.: 9788535914849)", className: "flex-1 h-11 px-3 rounded-xl border border-border bg-card text-sm font-mono outline-none focus:border-primary" }),
          /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: doLookup, disabled: looking || !isbn.trim(), children: [
            looking ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
            "Buscar"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start", children: [
          form.capa_url && /* @__PURE__ */ jsx("img", { src: form.capa_url, alt: "", className: "w-28 aspect-[2/3] object-cover rounded-lg border border-border" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx(Field, { label: "Título *", children: /* @__PURE__ */ jsx("input", { required: true, value: form.nome, onChange: (e) => setForm({
              ...form,
              nome: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Subtítulo", children: /* @__PURE__ */ jsx("input", { value: form.subtitulo, onChange: (e) => setForm({
              ...form,
              subtitulo: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Autores (vírgula)", children: /* @__PURE__ */ jsx("input", { value: form.autores, onChange: (e) => setForm({
              ...form,
              autores: e.target.value
            }), className: "input", placeholder: "Autor 1, Autor 2" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Editora", children: /* @__PURE__ */ jsx("input", { value: form.editora_nome, onChange: (e) => setForm({
              ...form,
              editora_nome: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Categoria", children: /* @__PURE__ */ jsx("input", { value: form.categoria, onChange: (e) => setForm({
              ...form,
              categoria: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Ano", children: /* @__PURE__ */ jsx("input", { type: "number", value: form.ano, onChange: (e) => setForm({
              ...form,
              ano: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Páginas", children: /* @__PURE__ */ jsx("input", { type: "number", value: form.paginas, onChange: (e) => setForm({
              ...form,
              paginas: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx(Field, { label: "Quantidade total *", children: /* @__PURE__ */ jsx("input", { required: true, type: "number", min: 1, value: form.quantidade_total, onChange: (e) => setForm({
              ...form,
              quantidade_total: e.target.value
            }), className: "input" }) }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "URL da capa", children: /* @__PURE__ */ jsx("input", { value: form.capa_url, onChange: (e) => setForm({
              ...form,
              capa_url: e.target.value
            }), className: "input" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsx(Field, { label: "Sinopse", children: /* @__PURE__ */ jsx("textarea", { rows: 3, value: form.sinopse, onChange: (e) => setForm({
              ...form,
              sinopse: e.target.value
            }), className: "input", style: {
              height: "auto",
              padding: 10
            } }) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 p-5 border-t border-border bg-muted/30", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: () => setModalOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: createLivro.isPending || !form.nome, children: [
          createLivro.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
          "Cadastrar"
        ] })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("style", { children: `.input { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-card); font-size: 14px; width: 100%; outline: none; }
        .input:focus { border-color: color-mix(in oklab, var(--color-primary) 50%, transparent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }` })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground mb-1.5", children: label }),
    children
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(LivrosPage, {}) });
export {
  SplitComponent as component
};
