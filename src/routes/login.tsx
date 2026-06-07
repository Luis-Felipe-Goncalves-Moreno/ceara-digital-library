import { createFileRoute, redirect } from "@tanstack/react-router";

// Mantido como alias de /auth para retrocompatibilidade.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/auth" });
  },
});
