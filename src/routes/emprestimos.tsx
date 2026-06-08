import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertTriangle, RotateCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge } from "@/components/ui-kit";
import { useEmprestimos, useDevolverEmprestimo } from "@/lib/hooks/use-library";

export const Route = createFileRoute("/emprestimos")({
  head: () => ({
    meta: [
      { title: "Empréstimos — Bibliotech" },
      { name: "description", content: "Empréstimos, renovações e devoluções." },
    ],
  }),
  component: () => <AppLayout><EmprestimosPage /></AppLayout>,
});

function EmprestimosPage() {
  const { data: emp = [], isLoading } = useEmprestimos();
  const devolver = useDevolverEmprestimo();
  const [tab, setTab] = useState<"todos" | "em_dia" | "atrasado" | "devolvido">("todos");

  const filtered = emp.filter((e: any) => tab === "todos" || e.status === tab);

  const tabs = [
    { id: "todos", label: "Todos", count: emp.length },
    { id: "em_dia", label: "Em dia", count: emp.filter((e: any) => e.status === "em_dia").length },
    { id: "atrasado", label: "Atrasados", count: emp.filter((e: any) => e.status === "atrasado").length },
    { id: "devolvido", label: "Devolvidos", count: emp.filter((e: any) => e.status === "devolvido").length },
  ] as const;

  const handleDevolver = (id: string) => {
    devolver.mutate(id, {
      onSuccess: () => toast.success("Empréstimo devolvido"),
      onError: (e: any) => toast.error(e.message ?? "Erro ao devolver"),
    });
  };

  return (
    <div>
      <PageHeader title="Empréstimos" description="Controle de saídas, renovações e devoluções do acervo." />

      <Card className="p-2 mb-4 inline-flex flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === t.id && <motion.span layoutId="tab-emp" className="absolute inset-0 rounded-xl bg-primary/10" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
            <span className="relative">{t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span></span>
          </button>
        ))}
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-3 px-4 font-medium">Usuário</th>
                <th className="py-3 px-4 font-medium">Livro</th>
                <th className="py-3 px-4 font-medium">Retirada</th>
                <th className="py-3 px-4 font-medium">Prazo</th>
                <th className="py-3 px-4 font-medium">Devolução</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="py-10 text-center text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline" /> Carregando…</td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">Nenhum empréstimo registrado.</td></tr>
              )}
              {filtered.map((e: any, i: number) => (
                <motion.tr key={e.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="border-t border-border hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4 font-medium">{e.usuario?.nome ?? "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{e.livro?.nome ?? "—"}</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(e.data_emprestimo).toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(e.data_estimada).toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 px-4 text-muted-foreground">{e.data_devolucao ? new Date(e.data_devolucao).toLocaleDateString("pt-BR") : "—"}</td>
                  <td className="py-3 px-4">
                    {e.status === "em_dia" && <Badge tone="info"><Clock className="w-3 h-3" /> Em dia</Badge>}
                    {e.status === "atrasado" && <Badge tone="danger"><AlertTriangle className="w-3 h-3" /> Atrasado</Badge>}
                    {e.status === "devolvido" && <Badge tone="success"><CheckCircle2 className="w-3 h-3" /> Devolvido</Badge>}
                    {e.status === "renovado" && <Badge tone="accent"><RotateCw className="w-3 h-3" /> Renovado</Badge>}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {e.status !== "devolvido" && (
                      <button onClick={() => handleDevolver(e.id)} disabled={devolver.isPending}
                        className="px-2.5 h-8 rounded-lg text-xs gradient-ocean text-white disabled:opacity-60">Devolver</button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
