import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Library, Sparkles, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { s as supabase } from "./client-thVVdJXN.js";
import { toast } from "sonner";
import "@supabase/supabase-js";
const TURMAS = ["1 Informática", "2 Informática", "3 Informática", "1 Administração", "3 Administração", "2 Finanças", "1 Meio-Ambiente", "2 Meio-Ambiente", "3 Meio-Ambiente", "1 Edificações", "3 Edificações", "2 Redes"];
function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      if (data.session) navigate({
        to: "/dashboard"
      });
    });
  }, [navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              nome,
              turma: turma || null
            }
          }
        });
        if (error) throw error;
        const {
          error: signInErr
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) {
          toast.success("Cadastro realizado!", {
            description: "Faça login para continuar."
          });
          setMode("signin");
        } else {
          toast.success("Conta criada com sucesso!");
          navigate({
            to: "/dashboard"
          });
        }
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({
          to: "/dashboard"
        });
      }
    } catch (err) {
      toast.error(err.message ?? "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative overflow-hidden grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 gradient-ocean" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 gradient-aurora opacity-70" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl glass grid place-items-center", children: /* @__PURE__ */ jsx(Library, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-display font-semibold text-lg leading-tight", children: "Bibliotech" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80", children: "Sistema acadêmico de gestão • v2.1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative max-w-md", children: [
        /* @__PURE__ */ jsx(motion.h2, { initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "font-display text-4xl xl:text-5xl font-semibold tracking-tight", children: "Conhecimento que transforma vidas." }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-white/85 text-[15px] leading-relaxed", children: "Catálogo enriquecido por ISBN, controle de empréstimos e ranking de leitores — tudo conectado a um banco de dados real." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }),
          " Pronto para produção"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative text-xs text-white/70", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Bibliotech"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative flex items-center justify-center p-6 sm:p-12 bg-background", children: /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:hidden flex items-center gap-3 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-2xl gradient-ocean grid place-items-center text-white shadow-elegant", children: /* @__PURE__ */ jsx(Library, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-display font-semibold", children: "Bibliotech" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Sistema acadêmico" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-xl bg-muted p-1 mb-6 text-sm", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setMode("signin"), className: `px-4 py-1.5 rounded-lg transition ${mode === "signin" ? "bg-card shadow-soft font-medium" : "text-muted-foreground"}`, children: "Entrar" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setMode("signup"), className: `px-4 py-1.5 rounded-lg transition ${mode === "signup" ? "bg-card shadow-soft font-medium" : "text-muted-foreground"}`, children: "Cadastrar" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-semibold tracking-tight", children: mode === "signin" ? "Bem-vindo de volta" : "Criar conta" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: mode === "signin" ? "Entre com seu acesso institucional." : "O primeiro cadastro vira administrador do sistema." }),
      /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-4", children: [
        mode === "signup" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Field, { label: "Nome completo", icon: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-muted-foreground" }), children: /* @__PURE__ */ jsx("input", { required: true, value: nome, onChange: (e) => setNome(e.target.value), className: "flex-1 bg-transparent outline-none text-sm", placeholder: "Ana Beatriz Lima" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Turma (opcional)" }),
            /* @__PURE__ */ jsxs("select", { value: turma, onChange: (e) => setTurma(e.target.value), className: "mt-1.5 w-full h-11 px-3 rounded-xl border border-border bg-card text-sm outline-none", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Sem turma / Funcionário" }),
              TURMAS.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t))
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Field, { label: "E-mail", icon: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-muted-foreground" }), children: /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "flex-1 bg-transparent outline-none text-sm", placeholder: "voce@ifce.edu.br" }) }),
        /* @__PURE__ */ jsx(Field, { label: "Senha", icon: /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-muted-foreground" }), children: /* @__PURE__ */ jsx("input", { type: "password", required: true, minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), className: "flex-1 bg-transparent outline-none text-sm", placeholder: "Mínimo 6 caracteres" }) }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "w-full h-11 rounded-xl gradient-ocean text-white font-medium shadow-elegant hover:shadow-glow transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 disabled:opacity-70", children: loading ? "Aguarde..." : /* @__PURE__ */ jsxs(Fragment, { children: [
          mode === "signin" ? "Entrar" : "Criar conta",
          " ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
        ] }) })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "mt-1.5 flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition", children: [
      icon,
      children
    ] })
  ] });
}
export {
  AuthPage as component
};
