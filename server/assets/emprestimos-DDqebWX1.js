import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ChevronDown, Plus, Loader2, Clock, AlertTriangle, CheckCircle2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { A as AppLayout, b as useEmprestimos, u as useProfiles, c as useLivros, g as useDevolverEmprestimo, h as useCriarEmprestimo, P as PageHeader, B as Button, C as Card, a as Badge } from "./ui-kit-BmPG-GCF.js";
import "@tanstack/react-router";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  required
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );
  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.sublabel && o.sublabel.toLowerCase().includes(q)
    );
  }, [options, query]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (opt) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
    setQuery("");
  };
  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
  };
  const handleInputFocus = () => {
    setOpen(true);
    setQuery("");
  };
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center", children: [
      /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          required: required && !value,
          className: "h-10 w-full rounded-xl border border-border bg-card px-3 pl-8 pr-16 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
          placeholder: selectedOption ? selectedOption.label : placeholder,
          value: open ? query : selectedOption ? selectedOption.label : "",
          onChange: (e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          },
          onFocus: handleInputFocus,
          autoComplete: "off"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "absolute right-2 flex items-center gap-0.5", children: [
        value && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClear,
            className: "flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "aria-label": "Limpar seleção",
            children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsx(
          ChevronDown,
          {
            className: `h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxs(
      motion.ul,
      {
        initial: { opacity: 0, y: -4, scaleY: 0.96 },
        animate: { opacity: 1, y: 0, scaleY: 1 },
        exit: { opacity: 0, y: -4, scaleY: 0.96 },
        transition: { duration: 0.15, ease: "easeOut" },
        className: "absolute z-50 mt-1.5 max-h-[17rem] w-full origin-top overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg",
        children: [
          filtered.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-3 py-3 text-center text-xs text-muted-foreground", children: "Nenhum resultado encontrado." }),
          filtered.map((opt) => /* @__PURE__ */ jsxs(
            "li",
            {
              role: "option",
              "aria-selected": opt.value === value,
              "aria-disabled": opt.disabled,
              onClick: () => handleSelect(opt),
              className: `flex cursor-pointer items-baseline gap-2 px-3 py-2 text-sm transition-colors ${opt.disabled ? "pointer-events-none opacity-50" : "hover:bg-muted/60"} ${opt.value === value ? "bg-primary/8 font-medium text-primary" : ""}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "truncate", children: opt.label }),
                opt.sublabel && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-xs text-muted-foreground", children: opt.sublabel })
              ]
            },
            opt.value
          ))
        ]
      }
    ) })
  ] });
}
function EmprestimosPage() {
  const {
    data: emp = [],
    isLoading
  } = useEmprestimos();
  const {
    data: profiles = []
  } = useProfiles();
  const {
    data: livros = []
  } = useLivros();
  const devolver = useDevolverEmprestimo();
  const criar = useCriarEmprestimo();
  const [tab, setTab] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [usuarioId, setUsuarioId] = useState("");
  const [livroId, setLivroId] = useState("");
  const [dias, setDias] = useState(14);
  const filtered = emp.filter((e) => tab === "todos" || e.status === tab);
  const tabs = [{
    id: "todos",
    label: "Todos",
    count: emp.length
  }, {
    id: "em_dia",
    label: "Em dia",
    count: emp.filter((e) => e.status === "em_dia").length
  }, {
    id: "atrasado",
    label: "Atrasados",
    count: emp.filter((e) => e.status === "atrasado").length
  }, {
    id: "devolvido",
    label: "Devolvidos",
    count: emp.filter((e) => e.status === "devolvido").length
  }];
  const handleDevolver = (id) => {
    devolver.mutate(id, {
      onSuccess: () => toast.success("Empréstimo devolvido"),
      onError: (e) => toast.error(e.message ?? "Erro ao devolver")
    });
  };
  const handleCriar = (e) => {
    e.preventDefault();
    if (!usuarioId || !livroId) return toast.error("Selecione usuário e livro.");
    criar.mutate({
      usuario_id: usuarioId,
      livro_id: livroId,
      dias
    }, {
      onSuccess: () => {
        toast.success("Empréstimo registrado com sucesso!");
        setShowForm(false);
        setUsuarioId("");
        setLivroId("");
      },
      onError: (err) => toast.error(err.message ?? "Erro ao criar empréstimo")
    });
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Empréstimos", description: "Controle de saídas, renovações e devoluções do acervo.", actions: /* @__PURE__ */ jsx(Button, { onClick: () => setShowForm(!showForm), variant: showForm ? "outline" : "primary", children: showForm ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
      " Cancelar"
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
      " Novo Empréstimo"
    ] }) }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showForm && /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0,
      height: 0
    }, animate: {
      opacity: 1,
      height: "auto"
    }, exit: {
      opacity: 0,
      height: 0
    }, className: "overflow-hidden mb-6", children: /* @__PURE__ */ jsxs(Card, { className: "p-5 border-primary/20 bg-primary/5", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-4", children: "Registrar Novo Empréstimo" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCriar, className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Usuário" }),
          /* @__PURE__ */ jsx(SearchableSelect, { required: true, value: usuarioId, onChange: setUsuarioId, placeholder: "Selecione um usuário...", options: profiles.map((p) => ({
            value: p.id,
            label: p.nome,
            sublabel: p.email
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Livro" }),
          /* @__PURE__ */ jsx(SearchableSelect, { required: true, value: livroId, onChange: setLivroId, placeholder: "Selecione um livro...", options: livros.map((l) => ({
            value: l.id,
            label: l.nome,
            sublabel: `${l.quantidade_disponivel} disp.`,
            disabled: l.quantidade_disponivel <= 0
          })) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Dias" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("input", { type: "number", min: 1, required: true, value: dias, onChange: (e) => setDias(Number(e.target.value)), className: "w-20 h-10 px-3 rounded-xl border border-border bg-card text-sm" }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: criar.isPending, className: "flex-1", children: criar.isPending ? "Salvando..." : "Confirmar" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Card, { className: "p-2 mb-4 inline-flex flex-wrap", children: tabs.map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.id), className: `relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`, children: [
      tab === t.id && /* @__PURE__ */ jsx(motion.span, { layoutId: "tab-emp", className: "absolute inset-0 rounded-xl bg-primary/10", transition: {
        type: "spring",
        stiffness: 350,
        damping: 30
      } }),
      /* @__PURE__ */ jsxs("span", { className: "relative", children: [
        t.label,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "ml-1 text-xs opacity-70", children: [
          "(",
          t.count,
          ")"
        ] })
      ] })
    ] }, t.id)) }),
    /* @__PURE__ */ jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs uppercase text-muted-foreground", children: [
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Usuário" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Livro" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Retirada" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Prazo" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Devolução" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "py-3 px-4 font-medium text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", { colSpan: 7, className: "py-10 text-center text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin inline" }),
          " Carregando…"
        ] }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "py-10 text-center text-muted-foreground", children: "Nenhum empréstimo registrado." }) }),
        filtered.map((e, i) => /* @__PURE__ */ jsxs(motion.tr, { initial: {
          opacity: 0,
          y: 4
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: i * 0.02
        }, className: "border-t border-border hover:bg-muted/40 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 font-medium", children: e.usuario?.nome ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-muted-foreground", children: e.livro?.nome ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-muted-foreground", children: new Date(e.data_emprestimo).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-muted-foreground", children: new Date(e.data_estimada).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          }) }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-muted-foreground", children: e.data_devolucao ? new Date(e.data_devolucao).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          }) : "—" }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 px-4", children: [
            e.status === "em_dia" && /* @__PURE__ */ jsxs(Badge, { tone: "info", children: [
              /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
              " Em dia"
            ] }),
            e.status === "atrasado" && /* @__PURE__ */ jsxs(Badge, { tone: "danger", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "w-3 h-3" }),
              " Atrasado"
            ] }),
            e.status === "devolvido" && /* @__PURE__ */ jsxs(Badge, { tone: "success", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
              " Devolvido"
            ] }),
            e.status === "renovado" && /* @__PURE__ */ jsxs(Badge, { tone: "accent", children: [
              /* @__PURE__ */ jsx(RotateCw, { className: "w-3 h-3" }),
              " Renovado"
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 px-4 text-right", children: e.status !== "devolvido" && /* @__PURE__ */ jsx("button", { onClick: () => handleDevolver(e.id), disabled: devolver.isPending, className: "px-2.5 h-8 rounded-lg text-xs gradient-ocean text-white disabled:opacity-60", children: "Devolver" }) })
        ] }, e.id))
      ] })
    ] }) }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(EmprestimosPage, {}) });
export {
  SplitComponent as component
};
