import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useRouterState, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Library, LayoutDashboard, BookOpen, Users, Repeat, Trophy, Search, BarChart3, Settings, ChevronRight, ChevronLeft, X, LogOut, Sun, Moon, Bell, Menu } from "lucide-react";
import { s as supabase } from "./client-thVVdJXN.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    }
  });
  const rolesQ = useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      return (data ?? []).map((r) => r.role);
    }
  });
  return { user, profile: profileQ.data ?? null, roles: rolesQ.data ?? [], loading };
}
function isStaff(roles) {
  return roles.includes("admin") || roles.includes("bibliotecario");
}
function useLivros() {
  return useQuery({
    queryKey: ["livros"],
    queryFn: async () => {
      const { data, error } = await supabase.from("livros").select("*, editora:editoras(*), livros_autores(autor:autores(*))").order("nome");
      if (error) throw error;
      return (data ?? []).map((l) => ({
        ...l,
        autores: (l.livros_autores ?? []).map((la) => la.autor).filter(Boolean)
      }));
    }
  });
}
function useCreateLivro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      let editora_id = null;
      if (input.editora_nome) {
        const { data: ex } = await supabase.from("editoras").select("id").eq("nome", input.editora_nome).maybeSingle();
        if (ex) editora_id = ex.id;
        else {
          const { data: ne, error } = await supabase.from("editoras").insert({ nome: input.editora_nome }).select("id").single();
          if (error) throw error;
          editora_id = ne.id;
        }
      }
      const { data: livro, error: lErr } = await supabase.from("livros").insert({
        isbn: input.isbn,
        nome: input.nome,
        subtitulo: input.subtitulo,
        categoria: input.categoria,
        ano: input.ano,
        paginas: input.paginas,
        sinopse: input.sinopse,
        capa_url: input.capa_url,
        quantidade_total: input.quantidade_total,
        quantidade_disponivel: input.quantidade_total,
        editora_id
      }).select("*").single();
      if (lErr) throw lErr;
      for (const nome of input.autores_nomes) {
        let autor_id;
        const { data: ex } = await supabase.from("autores").select("id").eq("nome", nome).maybeSingle();
        if (ex) autor_id = ex.id;
        else {
          const { data: na, error } = await supabase.from("autores").insert({ nome }).select("id").single();
          if (error) throw error;
          autor_id = na.id;
        }
        await supabase.from("livros_autores").insert({ livro_id: livro.id, autor_id });
      }
      return livro;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["livros"] })
  });
}
function useDeleteLivro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("livros").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["livros"] })
  });
}
function useEmprestimos() {
  return useQuery({
    queryKey: ["emprestimos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("emprestimos").select("*, usuario:profiles(*), livro:livros(*)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useCriarEmprestimo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const dataEst = /* @__PURE__ */ new Date();
      dataEst.setDate(dataEst.getDate() + (input.dias ?? 14));
      const { error } = await supabase.from("emprestimos").insert({
        usuario_id: input.usuario_id,
        livro_id: input.livro_id,
        data_estimada: dataEst.toISOString().slice(0, 10),
        status: "em_dia"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
    }
  });
}
function useDevolverEmprestimo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("emprestimos").update({ status: "devolvido", data_devolucao: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
    }
  });
}
function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("nome");
      if (error) throw error;
      return data ?? [];
    }
  });
}
function initials(nome) {
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
  { to: "/configuracoes", label: "Configurações", icon: Settings }
];
const BOTTOM_NAV = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/livros", label: "Livros", icon: BookOpen },
  { to: "/emprestimos", label: "Empréstimos", icon: Repeat },
  { to: "/pesquisa", label: "Buscar", icon: Search }
];
const labelMap = {
  dashboard: "Dashboard",
  livros: "Livros",
  usuarios: "Usuários",
  emprestimos: "Empréstimos",
  rankings: "Rankings",
  pesquisa: "Pesquisa",
  relatorios: "Relatórios",
  configuracoes: "Configurações"
};
function AppLayout({ children }) {
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
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [loading, user, navigate]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  const crumbs = pathname.split("/").filter(Boolean);
  const currentLabel = labelMap[crumbs[crumbs.length - 1]] ?? "Bibliotech";
  const userName = profile?.nome ?? user?.email ?? "Usuário";
  const userRole = isStaff(roles) ? roles.includes("admin") ? "Administrador" : "Bibliotecário" : roles.includes("professor") ? "Professor" : "Estudante";
  const userInitials = initials(profile?.nome ?? user?.email);
  if (loading || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center text-sm text-muted-foreground", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxs(
      motion.aside,
      {
        animate: { width: collapsed ? 76 : 248 },
        transition: { type: "spring", stiffness: 260, damping: 30 },
        className: "hidden md:flex flex-col border-r border-border bg-sidebar text-sidebar-foreground shadow-soft sticky top-0 h-screen z-30",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 h-16 border-b border-sidebar-border", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl gradient-ocean shadow-elegant flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(Library, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx(AnimatePresence, { children: !collapsed && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -8 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -8 },
                className: "flex flex-col leading-tight",
                children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-display font-semibold tracking-tight text-[15px]", children: [
                    "Bibliotech ",
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary align-top", children: "v2.1" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Sistema acadêmico" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin", children: NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.to,
                className: "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                children: [
                  active && /* @__PURE__ */ jsx(
                    motion.span,
                    {
                      layoutId: "nav-active",
                      className: "absolute inset-0 rounded-xl bg-sidebar-accent",
                      transition: { type: "spring", stiffness: 350, damping: 30 }
                    }
                  ),
                  /* @__PURE__ */ jsx(Icon, { className: `relative w-[18px] h-[18px] shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}` }),
                  !collapsed && /* @__PURE__ */ jsx("span", { className: `relative ${active ? "text-sidebar-accent-foreground" : "text-foreground/80 group-hover:text-foreground"}`, children: item.label }),
                  active && !collapsed && /* @__PURE__ */ jsx("span", { className: "relative ml-auto w-1.5 h-1.5 rounded-full bg-primary" })
                ]
              },
              item.to
            );
          }) }),
          /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setCollapsed((c) => !c),
              className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors",
              children: collapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
                " Recolher"
              ] })
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: mobileOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setMobileOpen(false),
          className: "md:hidden fixed inset-0 bg-foreground/50 backdrop-blur-sm z-40"
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.aside,
        {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
          transition: { type: "spring", stiffness: 320, damping: 34 },
          className: "md:hidden fixed top-0 left-0 bottom-0 w-[82%] max-w-[300px] bg-sidebar text-sidebar-foreground z-50 flex flex-col shadow-2xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 h-16 border-b border-sidebar-border", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl gradient-ocean shadow-elegant flex items-center justify-center text-white", children: /* @__PURE__ */ jsx(Library, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col leading-tight flex-1", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-display font-semibold tracking-tight text-[15px]", children: [
                  "Bibliotech ",
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-primary align-top", children: "v2.1" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "Sistema acadêmico" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setMobileOpen(false),
                  className: "w-9 h-9 grid place-items-center rounded-xl hover:bg-sidebar-accent",
                  "aria-label": "Fechar menu",
                  children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b border-sidebar-border flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full gradient-ocean text-white grid place-items-center text-xs font-semibold shadow-elegant", children: userInitials }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 leading-tight", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[13px] font-medium", children: userName }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: userRole })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setMobileOpen(false);
                    handleLogout();
                  },
                  className: "w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors",
                  "aria-label": "Sair",
                  children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin", children: NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              const Icon = item.icon;
              return /* @__PURE__ */ jsxs(
                Link,
                {
                  to: item.to,
                  className: `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-foreground/80 hover:bg-sidebar-accent/60"}`,
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: `w-[18px] h-[18px] shrink-0 ${active ? "text-primary" : "text-muted-foreground"}` }),
                    /* @__PURE__ */ jsx("span", { children: item.label }),
                    active && /* @__PURE__ */ jsx("span", { className: "ml-auto w-1.5 h-1.5 rounded-full bg-primary" })
                  ]
                },
                item.to
              );
            }) }),
            /* @__PURE__ */ jsx("div", { className: "p-3 border-t border-sidebar-border flex items-center gap-2", children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setDark((d) => !d),
                className: "flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-border text-xs hover:bg-sidebar-accent",
                children: [
                  dark ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4" }),
                  dark ? "Modo claro" : "Modo escuro"
                ]
              }
            ) })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "hidden md:flex sticky top-0 z-20 h-16 glass-strong border-b border-border items-center px-5 md:px-8 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground min-w-0", children: [
          /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "hover:text-foreground transition-colors", children: "Início" }),
          crumbs.map((c, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 truncate", children: [
            /* @__PURE__ */ jsx("span", { className: "text-border", children: "/" }),
            /* @__PURE__ */ jsx("span", { className: i === crumbs.length - 1 ? "text-foreground font-medium" : "", children: labelMap[c] ?? c })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-2 px-3 h-9 rounded-xl bg-muted/60 border border-border min-w-[260px]", children: [
            /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                placeholder: "Pesquisar livros, usuários...",
                className: "bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
              }
            ),
            /* @__PURE__ */ jsx("kbd", { className: "text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground", children: "⌘K" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDark((d) => !d),
              className: "w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted/60 transition-colors",
              "aria-label": "Alternar tema",
              children: dark ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxs("button", { className: "relative w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-muted/60 transition-colors", children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-right leading-tight", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-medium", children: userName }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: userRole })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full gradient-ocean text-white grid place-items-center text-xs font-semibold shadow-elegant", children: userInitials }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleLogout(),
                className: "w-9 h-9 grid place-items-center rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-colors",
                "aria-label": "Sair",
                children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("header", { className: "md:hidden sticky top-0 z-20 glass-strong border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "h-14 flex items-center px-3 gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMobileOpen(true),
              className: "w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors",
              "aria-label": "Abrir menu",
              children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg gradient-ocean shadow-elegant grid place-items-center text-white shrink-0", children: /* @__PURE__ */ jsx(Library, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("div", { className: "leading-tight min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[13px] font-semibold truncate", children: currentLabel }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground truncate", children: "Bibliotech v2.1" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setMobileSearchOpen((s) => !s),
              className: "w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors",
              "aria-label": "Pesquisar",
              children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxs("button", { className: "relative w-10 h-10 grid place-items-center rounded-xl hover:bg-muted/60 transition-colors", "aria-label": "Notificações", children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: mobileSearchOpen && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.2 },
            className: "overflow-hidden border-t border-border",
            children: /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoFocus: true,
                    placeholder: "Pesquisar livros, usuários...",
                    className: "bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setMobileSearchOpen(false),
                  className: "text-xs text-muted-foreground px-2 py-2",
                  children: "Cancelar"
                }
              )
            ] })
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 px-4 md:px-8 py-5 md:py-8 pb-24 md:pb-8", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -4 },
          transition: { duration: 0.25, ease: "easeOut" },
          children
        },
        pathname
      ) }) }),
      /* @__PURE__ */ jsx(
        "nav",
        {
          className: "md:hidden fixed bottom-0 inset-x-0 z-30 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]",
          "aria-label": "Navegação principal",
          children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 h-16", children: BOTTOM_NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs(
              Link,
              {
                to: item.to,
                className: "relative flex flex-col items-center justify-center gap-1 text-[10px] font-medium",
                children: [
                  active && /* @__PURE__ */ jsx(
                    motion.span,
                    {
                      layoutId: "mobile-nav-active",
                      className: "absolute top-0 h-0.5 w-10 rounded-full bg-primary",
                      transition: { type: "spring", stiffness: 350, damping: 30 }
                    }
                  ),
                  /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}` }),
                  /* @__PURE__ */ jsx("span", { className: active ? "text-primary" : "text-muted-foreground", children: item.label })
                ]
              },
              item.to
            );
          }) })
        }
      )
    ] })
  ] });
}
function PageHeader({
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4 mb-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        motion.h1,
        {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          className: "text-2xl md:text-3xl font-display font-semibold tracking-tight",
          children: title
        }
      ),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-2xl", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: actions })
  ] });
}
function Card({
  children,
  className = "",
  hover = false
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-2xl bg-card border border-border shadow-card ${hover ? "transition-all hover:shadow-elegant hover:-translate-y-0.5" : ""} ${className}`,
      children
    }
  );
}
function Badge({
  children,
  tone = "neutral"
}) {
  const map = {
    neutral: "bg-muted text-muted-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/15 text-warning-foreground border-warning/30",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/15 text-accent-foreground border-accent/30"
  };
  return /* @__PURE__ */ jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[tone]}`, children });
}
function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm"
  };
  const variants = {
    primary: "gradient-ocean text-white shadow-elegant hover:shadow-glow",
    accent: "bg-accent text-accent-foreground hover:brightness-105 shadow-soft",
    secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
    outline: "border border-border bg-card hover:bg-muted",
    ghost: "hover:bg-muted text-foreground"
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      ...props,
      className: `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`,
      children
    }
  );
}
export {
  AppLayout as A,
  Button as B,
  Card as C,
  PageHeader as P,
  Badge as a,
  useEmprestimos as b,
  useLivros as c,
  useSession as d,
  useCreateLivro as e,
  useDeleteLivro as f,
  useDevolverEmprestimo as g,
  useCriarEmprestimo as h,
  isStaff as i,
  useProfiles as u
};
