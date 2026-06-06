import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Repeat, AlertTriangle, TrendingUp, ArrowUpRight, CheckCircle2, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge } from "@/components/ui-kit";
import { LibraryAPI } from "@/lib/api/library.service";
import type { Emprestimo } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bibliotech" },
      { name: "description", content: "Visão executiva do acervo, empréstimos e usuários." },
    ],
  }),
  component: () => <AppLayout><DashboardPage /></AppLayout>,
});

const monthly = [
  { m: "Jan", emp: 42, dev: 38 }, { m: "Fev", emp: 51, dev: 46 },
  { m: "Mar", emp: 60, dev: 55 }, { m: "Abr", emp: 72, dev: 64 },
  { m: "Mai", emp: 68, dev: 70 }, { m: "Jun", emp: 84, dev: 76 },
  { m: "Jul", emp: 92, dev: 81 }, { m: "Ago", emp: 88, dev: 90 },
  { m: "Set", emp: 105, dev: 95 }, { m: "Out", emp: 118, dev: 110 },
  { m: "Nov", emp: 124, dev: 119 }, { m: "Dez", emp: 132, dev: 125 },
];

const categorias = [
  { name: "Romance", value: 42, color: "#005CA9" },
  { name: "História", value: 23, color: "#008F4C" },
  { name: "Poesia", value: 15, color: "#F4C542" },
  { name: "Ficção", value: 20, color: "#7C3AED" },
];

const topLivros = [
  { nome: "Dom Casmurro", emp: 38 },
  { nome: "Sapiens", emp: 32 },
  { nome: "O Quinze", emp: 27 },
  { nome: "A Hora da Estrela", emp: 21 },
  { nome: "Homo Deus", emp: 18 },
];

function DashboardPage() {
  const [metrics, setMetrics] = useState<Awaited<ReturnType<typeof LibraryAPI.metrics>> | null>(null);
  const [emp, setEmp] = useState<Emprestimo[]>([]);
  const [act, setAct] = useState<Awaited<ReturnType<typeof LibraryAPI.recentActivity>>>([]);

  useEffect(() => {
    LibraryAPI.metrics().then(setMetrics);
    LibraryAPI.listEmprestimos().then(setEmp);
    LibraryAPI.recentActivity().then(setAct);
  }, []);

  const stats = [
    { label: "Acervo total", value: metrics?.totalLivros, delta: "+12%", icon: BookOpen, tone: "info" as const },
    { label: "Empréstimos ativos", value: metrics?.emprestimosAtivos, delta: "+5%", icon: Repeat, tone: "accent" as const },
    { label: "Usuários cadastrados", value: metrics?.usuarios, delta: "+8%", icon: Users, tone: "success" as const },
    { label: "Atrasos", value: metrics?.atrasados, delta: "-2", icon: AlertTriangle, tone: "danger" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão executiva"
        description="Indicadores em tempo real do acervo, dos empréstimos e da comunidade leitora."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hover className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</div>
                  <div className="mt-2 text-3xl font-display font-semibold">
                    {s.value ?? <span className="inline-block h-7 w-16 rounded-md shimmer" />}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge tone={s.tone}>
                  <TrendingUp className="w-3 h-3" /> {s.delta} mês
                </Badge>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  Ver detalhes <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart big */}
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Movimentação anual</div>
              <div className="text-xs text-muted-foreground">Empréstimos e devoluções por mês</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Empréstimos</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Devoluções</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#005CA9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#005CA9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008F4C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#008F4C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 10px 30px -12px rgba(15,23,42,0.25)" }} />
                <Area type="monotone" dataKey="emp" stroke="#005CA9" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="dev" stroke="#008F4C" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie */}
        <Card className="p-5">
          <div className="text-sm font-semibold">Distribuição por categoria</div>
          <div className="text-xs text-muted-foreground">Composição do acervo</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorias} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {categorias.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top livros */}
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">Livros mais emprestados</div>
              <div className="text-xs text-muted-foreground">Últimos 90 dias</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLivros} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nome" width={150} tick={{ fontSize: 12, fill: "#0F172A" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }} />
                <Bar dataKey="emp" radius={[0, 8, 8, 0]} fill="#005CA9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Atividade */}
        <Card className="p-5">
          <div className="text-sm font-semibold">Atividades recentes</div>
          <div className="text-xs text-muted-foreground mb-4">Última hora</div>
          <ul className="space-y-3">
            {act.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  {a.tipo === "atraso" ? <AlertTriangle className="w-4 h-4 text-destructive" /> :
                    a.tipo === "devolucao" ? <CheckCircle2 className="w-4 h-4 text-success" /> :
                    <Clock className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm leading-tight">{a.texto}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{a.quando}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Próximas devoluções */}
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
                <th className="py-2 pr-4 font-medium">Empréstimo</th>
                <th className="py-2 pr-4 font-medium">Usuário</th>
                <th className="py-2 pr-4 font-medium">Livro</th>
                <th className="py-2 pr-4 font-medium">Devolução estimada</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {emp.slice(0, 6).map((e) => (
                <tr key={e.id} className="border-b border-border/60 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs">{e.id}</td>
                  <td className="py-3 pr-4">{e.usuario?.nome}</td>
                  <td className="py-3 pr-4">{e.livro?.nome}</td>
                  <td className="py-3 pr-4">{new Date(e.data_estimada).toLocaleDateString("pt-BR")}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={e.status === "atrasado" ? "danger" : e.status === "devolvido" ? "success" : "info"}>
                      {e.status === "em_dia" ? "Em dia" : e.status === "atrasado" ? "Atrasado" : "Devolvido"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
