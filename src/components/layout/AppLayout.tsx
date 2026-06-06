import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, Repeat, Search, BarChart3, Settings,
  ChevronLeft, ChevronRight, Bell, Sun, Moon, LogOut, Library, Trophy,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/livros", label: "Livros", icon: BookOpen },
  { to: "/usuarios", label: "Usuários", icon: Users },
  { to: "/emprestimos", label: "Empréstimos", icon: Repeat },
  { to: "/rankings", label: "Rankings", icon: Trophy },
  { to: "/pesquisa", label: "Pesquisa", icon: Search },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const labelMap: Record<string, string> = {
  dashboard: "Dashboard", livros: "Livros", usuarios: "Usuários",
  emprestimos: "Empréstimos", rankings: "Rankings", pesquisa: "Pesquisa",
  relatorios: "Relatórios", configuracoes: "Configurações",
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 248 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="hidden md:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-soft sticky top-0 h-screen z-30"
      >
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl gradient-ocean shadow-elegant flex items-center justify-center text-white">
            <Library className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="flex flex-col leading-tight"
              >
                <span className="font-display font-semibold tracking-tight text-[15px]">Bibliotech</span>
                <span className="text-[11px] text-muted-foreground">Sistema acadêmico</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-sidebar-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`relative w-[18px] h-[18px] shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                {!collapsed && (
                  <span className={`relative ${active ? "text-sidebar-accent-foreground" : "text-foreground/80 group-hover:text-foreground"}`}>
                    {item.label}
                  </span>
                )}
                {active && !collapsed && (
                  <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : (<><ChevronLeft className="w-4 h-4" /> Recolher</>)}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-16 glass-strong border-b border-border flex items-center px-5 md:px-8 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Início</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2 truncate">
                <span className="text-border">/</span>
                <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>
                  {labelMap[c] ?? c}
                </span>
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-xl bg-muted/60 border border-border min-w-[260px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Pesquisar livros, usuários..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">⌘K</kbd>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted/60 transition-colors"
              aria-label="Alternar tema"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="relative w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted/60 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-border">
              <div className="text-right leading-tight">
                <div className="text-[13px] font-medium">Renata C.</div>
                <div className="text-[11px] text-muted-foreground">Bibliotecária</div>
              </div>
              <div className="w-9 h-9 rounded-full gradient-ocean text-white grid place-items-center text-xs font-semibold shadow-elegant">RC</div>
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 md:px-8 py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
