import { createFileRoute, redirect } from "@tanstack/react-router";

// Autenticação desativada para testes — qualquer acesso a /auth vai direto ao dashboard.
export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard", replace: true });
  },
});
