import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCw, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { LibraryAPI } from "@/lib/api/library.service";
import type { Emprestimo } from "@/lib/types";

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
  const [emp, setEmp] = useState<Emprestimo[] | null>(null);
  const [tab, setTab] = useState<"todos" | "em_dia" | "atrasado" | "devolvido">("todos");

  useEffect(() => { LibraryAPI.listEmprestimos().then(setEmp); }, []);

  const filtered = (emp ?? []).filter((e) => tab === "todos" || e.status === tab);

  const tabs = [
    { id: "todos", label: "Todos", count: emp?.length ?? 0 },
    { id: "em_dia", label: "Em dia", count: emp?.filter((e) => e.status === "em_dia").length ?? 0 },
    { id: "atrasado", label: "Atrasados", count: emp?.filter((e) => e.status === "atrasado").length ?? 0 },
    { id: "devolvido", label: "Devolvidos", count: emp?.filter((e) => e.status === "devolvido").length ?? 0 },
  ] as const;

  return (
    <div>
      <PageHeader
        title="Empréstimos"
        description="Controle completo de saídas, renovações e devoluções do acervo."
        actions={<Button><Plus className="w-4 h-4" /> Novo empréstimo</Button>}
      />

      <Card className="p-2 mb-4 inline-flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === t.id && (
              <motion.span layoutId="tab-emp" className="absolute inset-0 rounded-xl bg-primary/10" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
            )}
            <span className="relative">{t.label} <span className="ml-1 text-xs opacity-70">({t.count})</span></span>
          </button>
        ))}
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-3 px-4 font-medium">ID</th>
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
              {filtered.map((e, i) => (
                <motion.tr
                  key={e.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="border-t border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-xs">{e.id}</td>
                  <td className="py-3 px-4 font-medium">{e.usuario?.nome}</td>
                  <td className="py-3 px-4 text-muted-foreground">{e.livro?.nome}</td>
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
                    <div className="inline-flex gap-1">
                      <button className="px-2.5 h-8 rounded-lg text-xs border border-border hover:bg-muted">Renovar</button>
                      <button className="px-2.5 h-8 rounded-lg text-xs gradient-ocean text-white">Devolver</button>
                    </div>
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
