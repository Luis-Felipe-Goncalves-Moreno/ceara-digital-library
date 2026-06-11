import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, ShieldAlert, Search, Loader2, GraduationCap, UserCircle2, Mail } from "lucide-react";
import { A as AppLayout, u as useProfiles, P as PageHeader, B as Button, C as Card, a as Badge } from "./ui-kit-BmPG-GCF.js";
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
const createUserAccount = createServerFn({
  method: "POST"
}).inputValidator((d) => z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nome: z.string(),
  role: z.enum(["admin", "estudante"]),
  turma: z.string().optional()
}).parse(d)).handler(createSsrRpc("9f4cccad096f8a3353ec88a2b7e2de3316155b18cc0a12d4decd2198c0b7bd40"));
function initials(name) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
const TURMAS = ["1 Informática", "2 Informática", "3 Informática", "1 Administração", "3 Administração", "2 Finanças", "1 Meio-Ambiente", "2 Meio-Ambiente", "3 Meio-Ambiente", "1 Edificações", "3 Edificações", "2 Redes"];
function UsuariosPage() {
  const {
    data: u = [],
    isLoading,
    refetch
  } = useProfiles();
  const createUser = useServerFn(createUserAccount);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("estudante");
  const [turma, setTurma] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const filtered = u.filter((x) => {
    const matchQ = !q || x.nome.toLowerCase().includes(q.toLowerCase()) || x.email.toLowerCase().includes(q.toLowerCase());
    const matchT = tipo === "todos" || (tipo === "com_turma" ? !!x.turma : !x.turma);
    return matchQ && matchT;
  });
  const counts = {
    total: u.length,
    estudantes: u.filter((x) => x.turma).length,
    sem_turma: u.filter((x) => !x.turma).length
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (role === "estudante" && !turma) return toast.error("Selecione a turma do estudante.");
    setIsCreating(true);
    try {
      await createUser({
        data: {
          email,
          password,
          nome,
          role,
          turma: role === "estudante" ? turma : void 0
        }
      });
      toast.success("Usuário criado com sucesso!");
      setShowForm(false);
      setNome("");
      setEmail("");
      setPassword("");
      setTurma("");
      refetch();
    } catch (err) {
      toast.error(err.message ?? "Erro desconhecido ao criar usuário.");
    } finally {
      setIsCreating(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Usuários", description: "Comunidade leitora cadastrada na plataforma.", actions: /* @__PURE__ */ jsx(Button, { onClick: () => setShowForm(!showForm), variant: showForm ? "outline" : "primary", children: showForm ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }),
      " Cancelar"
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
      " Novo Usuário"
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
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx(ShieldAlert, { className: "w-5 h-5 text-primary" }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: "Criar Conta (Service Role)" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Requer `SUPABASE_SERVICE_ROLE_KEY` configurado no `.env` para criar contas sem realizar logout." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleCreateUser, className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Cargo" }),
          /* @__PURE__ */ jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), className: "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
            /* @__PURE__ */ jsx("option", { value: "estudante", children: "Estudante (Aluno)" }),
            /* @__PURE__ */ jsx("option", { value: "admin", children: "Administrador (Bibliotecário)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Nome Completo" }),
          /* @__PURE__ */ jsx("input", { required: true, value: nome, onChange: (e) => setNome(e.target.value), className: "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", placeholder: "Ex: Felipe Silva" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "E-mail" }),
          /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", placeholder: "aluno@bibliotech.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Senha Forte" }),
          /* @__PURE__ */ jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", placeholder: "Min. 6 caracteres" })
        ] }),
        role === "estudante" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Turma" }),
          /* @__PURE__ */ jsxs("select", { required: true, value: turma, onChange: (e) => setTurma(e.target.value), className: "w-full h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Selecione a turma..." }),
            TURMAS.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: role === "estudante" ? "md:col-span-3" : "md:col-span-4", children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isCreating, className: "w-full", children: isCreating ? "Criando..." : "Confirmar e Criar" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Total" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-display font-semibold", children: counts.total })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Com turma" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-display font-semibold", children: counts.estudantes })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Funcionários" }),
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-2xl font-display font-semibold", children: counts.sem_turma })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "p-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar por nome ou e-mail...", className: "bg-transparent outline-none text-sm flex-1" })
      ] }),
      /* @__PURE__ */ jsxs("select", { value: tipo, onChange: (e) => setTipo(e.target.value), className: "h-10 px-3 rounded-xl border border-border bg-card text-sm", children: [
        /* @__PURE__ */ jsx("option", { value: "todos", children: "Todos" }),
        /* @__PURE__ */ jsx("option", { value: "com_turma", children: "Com turma" }),
        /* @__PURE__ */ jsx("option", { value: "sem_turma", children: "Funcionários" })
      ] })
    ] }) }),
    isLoading && /* @__PURE__ */ jsxs("div", { className: "text-center py-10 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin inline" }),
      " Carregando…"
    ] }),
    !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx(Card, { className: "p-10 text-center text-muted-foreground", children: "Nenhum usuário encontrado." }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: filtered.map((x, i) => /* @__PURE__ */ jsx(motion.div, { initial: {
      opacity: 0,
      y: 6
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      delay: i * 0.03
    }, children: /* @__PURE__ */ jsx(Card, { hover: true, className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-2xl gradient-ocean text-white grid place-items-center font-semibold shadow-elegant", children: initials(x.nome) }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold truncate", children: x.nome }),
          /* @__PURE__ */ jsx(Badge, { tone: x.turma ? "info" : "neutral", children: x.turma ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(GraduationCap, { className: "w-3 h-3" }),
            " ",
            x.turma
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(UserCircle2, { className: "w-3 h-3" }),
            " Funcionário"
          ] }) })
        ] }),
        x.matricula && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
          "Matrícula ",
          x.matricula
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-3 h-3" }),
          " ",
          x.email
        ] })
      ] })
    ] }) }) }, x.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(UsuariosPage, {}) });
export {
  SplitComponent as component
};
