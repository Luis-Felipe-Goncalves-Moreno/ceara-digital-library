import { useState, useEffect } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Users, Repeat, Search, BarChart3, Settings,
  ChevronLeft, ChevronRight, Bell, Sun, Moon, LogOut, Library, Trophy, Menu, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession, isStaff } from "@/lib/hooks/use-library";

function initials(nome?: string | null) {
  if (!nome) return "U";
  const parts = nome.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase() || "U";
}


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

// 4 most-used items shown in mobile bottom tab bar
const BOTTOM_NAV = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/livros", label: "Livros", icon: BookOpen },
  { to: "/emprestimos", label: "Empréstimos", icon: Repeat },
  { to: "/pesquisa", label: "Buscar", icon: Search },
] as const;

const labelMap: Record<string, string> = {
  dashboard: "Dashboard", livros: "Livros", usuarios: "Usuários",
  emprestimos: "Empréstimos", rankings: "Rankings", pesquisa: "Pesquisa",
  relatorios: "Relatórios", configuracoes: "Configurações",
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const { user, profile, roles, loading } = useSession();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Auth desativado para testes — sem redirect e sem gate de carregamento.

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/dashboard", replace: true });
  };

  const crumbs = pathname.split("/").filter(Boolean);
  const currentLabel = labelMap[crumbs[crumbs.length - 1]] ?? "Bibliotech";
  const userName = profile?.nome ?? user?.email ?? "Convidado (teste)";
  const userRole = isStaff(roles) ? (roles.includes("admin") ? "Administrador" : "Bibliotecário") : (roles.includes("professor") ? "Professor" : (user ? "Estudante" : "Modo teste"));
  const userInitials = initials(profile?.nome ?? user?.email ?? "T T");

  if (false) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Carregando...</div>;
  }


  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
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
                <span className="font-display font-semibold tracking-tight text-[15px]">Bibliotech <span className="text-[10px] font-medium text-primary align-top">v2.1</span></span>
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-[82%] max-w-[300px] bg-sidebar text-sidebar-foreground z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
                <div className="w-9 h-9 rounded-xl gradient-ocean shadow-elegant flex items-center justify-center text-white">
                  <Library className="w-5 h-5" />
                </div>
                <div className="flex flex-col leading-tight flex-1">
                  <span className="font-display font-semibold tracking-tight text-[15px]">
                    Bibliotech <span className="text-[10px] font-medium text-primary align-top">v2.1</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">Sistema acadêmico</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 grid place-items-center rounded-xl hover:bg-sidebar-accent"
                  aria-label="Fechar menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-sidebar-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-ocean text-white grid place-items-center text-xs font-semibold shadow-elegant">{userInitials}</div>
                <div className="flex-1 leading-tight">
                  <div className="text-[13px] font-medium">{userName}</div>
                  <div className="text-[11px] text-muted-foreground">{userRole}</div>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
                {NAV.map((item) => {
                  const active = pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-foreground/80 hover:bg-sidebar-accent/60"
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-sidebar-border flex items-center gap-2">
                <button
                  onClick={() => setDark((d) => !d)}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-border text-xs hover:bg-sidebar-accent"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {dark ? "Modo claro" : "Modo escuro"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header — desktop */}
        <header className="hidden md:flex sticky top-0 z-20 h-16 glass-strong border-b border-border items-center px-5 md:px-8 gap-4">
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
                <div className="text-[13px] font-medium">{userName}</div>
                <div className="text-[11px] text-muted-foreground">{userRole}</div>
              </div>
              <div className="w-9 h-9 rounded-full gradient-ocean text-white grid place-items-center text-xs font-semibold shadow-elegant">{userInitials}</div>
              <button
                onClick={() => handleLogout()}
                className="w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Header — mobile */}
        <header className="md:hidden sticky top-0 z-20 glass-strong border-b border-border">
          <div className="h-14 flex items-center px-3 gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg gradient-ocean shadow-elegant grid place-items-center text-white shrink-0">
                <Library className="w-4 h-4" />
              </div>
              <div className="leading-tight min-w-0">
                <div className="text-[13px] font-semibold truncate">{currentLabel}</div>
                <div className="text-[10px] text-muted-foreground truncate">Bibliotech v2.1</div>
              </div>
            </div>
            <button
              onClick={() => setMobileSearchOpen((s) => !s)}
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors"
              aria-label="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors" aria-label="Notificações">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {mobileSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="px-3 py-2 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                      autoFocus
                      placeholder="Pesquisar livros, usuários..."
                      className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                    />
                  </div>
                  <button
                    onClick={() => setMobileSearchOpen(false)}
                    className="text-xs text-muted-foreground px-2 py-2"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 px-4 md:px-8 py-5 md:py-8 pb-24 md:pb-8">
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

        {/* Mobile bottom tab bar */}
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]"
          aria-label="Navegação principal"
        >
          <div className="grid grid-cols-4 h-16">
            {BOTTOM_NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium"
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-nav-active"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={active ? "text-primary" : "text-muted-foreground"}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
