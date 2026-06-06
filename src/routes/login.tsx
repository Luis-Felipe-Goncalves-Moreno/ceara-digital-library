import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Library, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Bibliotech" },
      { name: "description", content: "Acesso institucional ao sistema de biblioteca." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
  };

  return (
    <div className="min-h-screen relative overflow-hidden grid lg:grid-cols-2">
      {/* Left — institutional artwork */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 gradient-ocean" />
        <div className="absolute inset-0 gradient-aurora opacity-70" />
        {/* Abstract sun + sea */}
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4C542" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F4C542" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="wave" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="640" cy="220" r="220" fill="url(#sun)" />
          <motion.path
            d="M0 700 Q200 640 400 700 T800 700 L800 1000 L0 1000 Z"
            fill="url(#wave)"
            initial={{ y: 20 }} animate={{ y: 0 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M0 780 Q200 720 400 780 T800 780 L800 1000 L0 1000 Z"
            fill="url(#wave)"
            initial={{ y: 0 }} animate={{ y: 25 }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl glass grid place-items-center">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-lg leading-tight">Bibliotech</div>
            <div className="text-xs text-white/80">Sistema acadêmico de gestão</div>
          </div>
        </div>

        <div className="relative max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl xl:text-5xl font-semibold tracking-tight"
          >
            Conhecimento que transforma<br /> vidas.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-4 text-white/85 text-[15px] leading-relaxed"
          >
            Gerencie acervos, empréstimos e usuários com a sofisticação de um software corporativo —
            inspirado no sol, no litoral e no vento do nosso estado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Acesso institucional protegido
          </motion.div>
        </div>

        <div className="relative text-xs text-white/70">© {new Date().getFullYear()} Bibliotech • Plataforma acadêmica</div>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="absolute inset-0 gradient-aurora opacity-40 lg:hidden" />
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl gradient-ocean grid place-items-center text-white shadow-elegant">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-semibold">Bibliotech</div>
              <div className="text-xs text-muted-foreground">Sistema acadêmico</div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground mt-2">Entre com seu acesso institucional para continuar.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">E-mail institucional</label>
              <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input
                  type="email" required defaultValue="renata.c@biblioteca.ce.gov.br"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Senha</label>
                <a href="#" className="text-xs text-primary hover:underline">Esqueci minha senha</a>
              </div>
              <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-xl border border-border bg-card focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <input
                  type="password" required defaultValue="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-muted-foreground select-none">
              <input type="checkbox" className="rounded border-border" defaultChecked />
              Manter sessão ativa neste dispositivo
            </label>

            <button
              type="submit" disabled={loading}
              className="w-full h-11 rounded-xl gradient-ocean text-white font-medium shadow-elegant hover:shadow-glow transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Entrando..." : (<>Entrar <ArrowRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>
          <Link to="/dashboard" className="mt-4 block text-center text-sm text-primary hover:underline">
            Acessar como visitante (demonstração)
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
