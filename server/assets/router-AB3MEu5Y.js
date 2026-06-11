import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
const appCss = "/assets/styles-CCCQHd3P.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bibliotech — Sistema de Gestão" },
      { name: "description", content: "Sistema acadêmico premium para gestão de biblioteca, empréstimos e usuários." },
      { name: "author", content: "Bibliotech" },
      { name: "theme-color", content: "#005CA9" },
      { property: "og:title", content: "Bibliotech — Sistema de Gestão" },
      { property: "og:description", content: "Sistema acadêmico premium para gestão de biblioteca, empréstimos e usuários." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Bibliotech — Sistema de Gestão" },
      { name: "twitter:description", content: "Sistema acadêmico premium para gestão de biblioteca, empréstimos e usuários." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e83170a-ca2c-4bf6-b742-32be70a0ed8f/id-preview-b1090b1d--fb621b51-6c72-4005-81a3-2d801450ce01.lovable.app-1780350837599.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e83170a-ca2c-4bf6-b742-32be70a0ed8f/id-preview-b1090b1d--fb621b51-6c72-4005-81a3-2d801450ce01.lovable.app-1780350837599.png" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
      },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$9 = () => import("./usuarios-Bwp_ukvJ.js");
const Route$a = createFileRoute("/usuarios")({
  head: () => ({
    meta: [{
      title: "Usuários — Bibliotech"
    }, {
      name: "description",
      content: "Perfis de estudantes, professores e funcionários."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./relatorios-C_dfT7Mu.js");
const Route$9 = createFileRoute("/relatorios")({
  head: () => ({
    meta: [{
      title: "Relatórios — Bibliotech"
    }, {
      name: "description",
      content: "Indicadores analíticos e exportações."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./rankings-BS5rANQh.js");
const Route$8 = createFileRoute("/rankings")({
  head: () => ({
    meta: [{
      title: "Rankings — Bibliotech"
    }, {
      name: "description",
      content: "Rank de alunos e turmas com mais empréstimos, exportável em PDF."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./pesquisa-dUK-r5kE.js");
const Route$7 = createFileRoute("/pesquisa")({
  head: () => ({
    meta: [{
      title: "Pesquisa — Bibliotech"
    }, {
      name: "description",
      content: "Busca inteligente no acervo com filtros e autocomplete."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const Route$6 = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/auth" });
  }
});
const $$splitComponentImporter$5 = () => import("./livros-Dc57QjeS.js");
const Route$5 = createFileRoute("/livros")({
  head: () => ({
    meta: [{
      title: "Livros — Bibliotech"
    }, {
      name: "description",
      content: "Catálogo de livros com cadastro automático por ISBN."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./emprestimos-DDqebWX1.js");
const Route$4 = createFileRoute("/emprestimos")({
  head: () => ({
    meta: [{
      title: "Empréstimos — Bibliotech"
    }, {
      name: "description",
      content: "Empréstimos, renovações e devoluções."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard-CnFGnTlu.js");
const Route$3 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Bibliotech"
    }, {
      name: "description",
      content: "Visão executiva do acervo, empréstimos e usuários."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./configuracoes-BfUErUuF.js");
const Route$2 = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [{
      title: "Configurações — Bibliotech"
    }, {
      name: "description",
      content: "Perfil, preferências, permissões e tema."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./auth-BTT2UByW.js");
const Route$1 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Entrar — Bibliotech"
    }, {
      name: "description",
      content: "Acesso institucional ao sistema Bibliotech."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-rc2i1SwG.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsuariosRoute = Route$a.update({
  id: "/usuarios",
  path: "/usuarios",
  getParentRoute: () => Route$b
});
const RelatoriosRoute = Route$9.update({
  id: "/relatorios",
  path: "/relatorios",
  getParentRoute: () => Route$b
});
const RankingsRoute = Route$8.update({
  id: "/rankings",
  path: "/rankings",
  getParentRoute: () => Route$b
});
const PesquisaRoute = Route$7.update({
  id: "/pesquisa",
  path: "/pesquisa",
  getParentRoute: () => Route$b
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$b
});
const LivrosRoute = Route$5.update({
  id: "/livros",
  path: "/livros",
  getParentRoute: () => Route$b
});
const EmprestimosRoute = Route$4.update({
  id: "/emprestimos",
  path: "/emprestimos",
  getParentRoute: () => Route$b
});
const DashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$b
});
const ConfiguracoesRoute = Route$2.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => Route$b
});
const AuthRoute = Route$1.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$b
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  AuthRoute,
  ConfiguracoesRoute,
  DashboardRoute,
  EmprestimosRoute,
  LivrosRoute,
  LoginRoute,
  PesquisaRoute,
  RankingsRoute,
  RelatoriosRoute,
  UsuariosRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
