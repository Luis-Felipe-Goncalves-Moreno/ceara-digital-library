import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Repeat, AlertTriangle, TrendingUp, ArrowUpRight, CheckCircle2, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge } from "@/components/ui-kit";
import { useLivros, useEmprestimos, useProfiles } from "@/lib/hooks/use-library";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bibliotech" },
      { name: "description", content: "Visão executiva do acervo, empréstimos e usuários." },
    ],
  }),
  component: () => <AppLayout><DashboardPage /></AppLayout>,
});

function DashboardPage() {
  const { data: livros = [] } = useLivros();
  const { data: emp = [] } = useEmprestimos();
  const { data: users = [] } = useProfiles();

  const ativos = emp.filter((e: any) => e.status !== "devolvido").length;
  const atrasados = emp.filter((e: any) => e.status === "atrasado").length;

  const stats = [
    { label: "Acervo total", value: livros.length, icon: BookOpen, tone: "info" as const },
    { label: "Empréstimos ativos", value: ativos, icon: Repeat, tone: "accent" as const },
    { label: "Usuários cadastrados", value: users.length, icon: Users, tone: "success" as const },
    { label: "Atrasos", value: atrasados, icon: AlertTriangle, tone: "danger" as const },
  ];

  const topLivros = useMemo(() => {
    const map = new Map<string, number>();
    emp.forEach((e: any) => {
      const nome = e.livro?.nome ?? "—";
      map.set(nome, (map.get(nome) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([nome, emp]) => ({ nome, emp }))
      .sort((a, b) => b.emp - a.emp)
      .slice(0, 5);
  }, [emp]);

  const proximas = emp
    .filter((e: any) => e.status !== "devolvido")
    .sort((a: any, b: any) => +new Date(a.data_estimada) - +new Date(b.data_estimada))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader title="Visão executiva" description="Indicadores em tempo real do acervo, dos empréstimos e da comunidade leitora." />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</div>
                  <div className="mt-2 text-3xl font-display font-semibold">{s.value}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge tone={s.tone}><TrendingUp className="w-3 h-3" /> em tempo real</Badge>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  Ver detalhes <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-5">
        <div className="text-sm font-semibold">Livros mais emprestados</div>
        <div className="text-xs text-muted-foreground mb-4">Baseado em todos os empréstimos registrados</div>
        <div className="h-64">
          {topLivros.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">Sem empréstimos ainda.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLivros} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" width={180} tick={{ fontSize: 12, fill: "#0F172A" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }} />
                <Bar dataKey="emp" radius={[0, 8, 8, 0]} fill="#005CA9" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Próximas devoluções</div>
            <div className="text-xs text-muted-foreground">Empréstimos ativos do acervo</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Usuário</th>
                <th className="py-2 pr-4 font-medium">Livro</th>
                <th className="py-2 pr-4 font-medium">Devolução estimada</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {proximas.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Sem empréstimos ativos.</td></tr>
              )}
              {proximas.map((e: any) => (
                <tr key={e.id} className="border-b border-border/60 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">{e.usuario?.nome ?? "—"}</td>
                  <td className="py-3 pr-4">{e.livro?.nome ?? "—"}</td>
                  <td className="py-3 pr-4">{new Date(e.data_estimada).toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={e.status === "atrasado" ? "danger" : "info"}>
                      {e.status === "atrasado" ? <><AlertTriangle className="w-3 h-3" /> Atrasado</> : <><Clock className="w-3 h-3" /> Em dia</>}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {emp.length > 0 && (
          <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-success" /> {emp.filter((e: any) => e.status === "devolvido").length} devolvidos no histórico.
          </div>
        )}
      </Card>
    </div>
  );
}
