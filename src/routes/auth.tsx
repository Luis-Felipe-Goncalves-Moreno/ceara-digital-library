import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Library, Mail, Lock, ArrowRight, Sparkles, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Bibliotech" },
      { name: "description", content: "Acesso institucional ao sistema Bibliotech." },
    ],
  }),
  component: AuthPage,
});

const TURMAS = [
  "1 Informática", "2 Informática", "3 Informática",
  "1 Administração", "3 Administração",
  "2 Finanças",
  "1 Meio-Ambiente", "2 Meio-Ambiente", "3 Meio-Ambiente",
  "1 Edificações", "3 Edificações",
  "2 Redes",
];

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { nome, turma: turma || null },
          },
        });
        if (error) throw error;
        // Auto-confirm está ativo: tenta logar direto
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) {
          toast.success("Cadastro realizado!", { description: "Faça login para continuar." });
          setMode("signin");
        } else {
          toast.success("Conta criada com sucesso!");
          navigate({ to: "/dashboard" });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/dashboard" });
      }

    } catch (err: any) {
      toast.error(err.message ?? "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 gradient-ocean" />
        <div className="absolute inset-0 gradient-aurora opacity-70" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl glass grid place-items-center">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-lg leading-tight">Bibliotech</div>
            <div className="text-xs text-white/80">Sistema acadêmico de gestão • v2.1</div>
          </div>
        </div>
        <div className="relative max-w-md">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl xl:text-5xl font-semibold tracking-tight">
            Conhecimento que transforma vidas.
          </motion.h2>
          <p className="mt-4 text-white/85 text-[15px] leading-relaxed">
            Catálogo enriquecido por ISBN, controle de empréstimos e ranking de leitores —
            tudo conectado a um banco de dados real.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Pronto para produção
          </div>
        </div>
        <div className="relative text-xs text-white/70">© {new Date().getFullYear()} Bibliotech</div>
      </div>

      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl gradient-ocean grid place-items-center text-white shadow-elegant">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold">Bibliotech</div>
              <div className="text-xs text-muted-foreground">Sistema acadêmico</div>
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-muted p-1 mb-6 text-sm">
            <button onClick={() => setMode("signin")}
              className={`px-4 py-1.5 rounded-lg transition ${mode === "signin" ? "bg-card shadow-soft font-medium" : "text-muted-foreground"}`}>
              Entrar
            </button>
            <button onClick={() => setMode("signup")}
              className={`px-4 py-1.5 rounded-lg transition ${mode === "signup" ? "bg-card shadow-soft font-medium" : "text-muted-foreground"}`}>
              Cadastrar
            </button>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {mode === "signin" ? "Bem-vindo de volta" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {mode === "signin"
              ? "Entre com seu acesso institucional."
              : "O primeiro cadastro vira administrador do sistema."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <>
                <Field label="Nome completo" icon={<UserIcon className="w-4 h-4 text-muted-foreground" />}>
                  <input required value={nome} onChange={(e) => setNome(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm" placeholder="Ana Beatriz Lima" />
                </Field>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Turma (opcional)</label>
                  <select value={turma} onChange={(e) => setTurma(e.target.value)}
                    className="mt-1.5 w-full h-11 px-3 rounded-xl border border-border bg-card text-sm outline-none">
                    <option value="">Sem turma / Funcionário</option>
                    {TURMAS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </>
            )}
            <Field label="E-mail" icon={<Mail className="w-4 h-4 text-muted-foreground" />}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm" placeholder="voce@ifce.edu.br" />
            </Field>
            <Field label="Senha" icon={<Lock className="w-4 h-4 text-muted-foreground" />}>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm" placeholder="Mínimo 6 caracteres" />
            </Field>

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl gradient-ocean text-white font-medium shadow-elegant hover:shadow-glow transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? "Aguarde..." : (
                <>{mode === "signin" ? "Entrar" : "Criar conta"} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition">
        {icon}
        {children}
      </div>
    </div>
  );
}
