import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, GraduationCap, UserCircle2, Mail, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge } from "@/components/ui-kit";
import { useProfiles } from "@/lib/hooks/use-library";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Bibliotech" },
      { name: "description", content: "Perfis de estudantes, professores e funcionários." },
    ],
  }),
  component: () => <AppLayout><UsuariosPage /></AppLayout>,
});

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function UsuariosPage() {
  const { data: u = [], isLoading } = useProfiles();
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("todos");

  const filtered = u.filter((x: any) => {
    const matchQ = !q || x.nome.toLowerCase().includes(q.toLowerCase()) || x.email.toLowerCase().includes(q.toLowerCase());
    const matchT = tipo === "todos" || (tipo === "com_turma" ? !!x.turma : !x.turma);
    return matchQ && matchT;
  });

  const counts = {
    total: u.length,
    estudantes: u.filter((x: any) => x.turma).length,
    sem_turma: u.filter((x: any) => !x.turma).length,
  };

  return (
    <div>
      <PageHeader title="Usuários" description="Comunidade leitora cadastrada na plataforma." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div><div className="mt-1 text-2xl font-display font-semibold">{counts.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Com turma</div><div className="mt-1 text-2xl font-display font-semibold">{counts.estudantes}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Funcionários</div><div className="mt-1 text-2xl font-display font-semibold">{counts.sem_turma}</div></Card>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-sm">
            <option value="todos">Todos</option>
            <option value="com_turma">Com turma</option>
            <option value="sem_turma">Funcionários</option>
          </select>
        </div>
      </Card>

      {isLoading && <div className="text-center py-10 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline" /> Carregando…</div>}
      {!isLoading && filtered.length === 0 && <Card className="p-10 text-center text-muted-foreground">Nenhum usuário encontrado.</Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((x: any, i: number) => (
          <motion.div key={x.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card hover className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-ocean text-white grid place-items-center font-semibold shadow-elegant">
                  {initials(x.nome)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{x.nome}</div>
                    <Badge tone={x.turma ? "info" : "neutral"}>
                      {x.turma ? <><GraduationCap className="w-3 h-3" /> {x.turma}</> : <><UserCircle2 className="w-3 h-3" /> Funcionário</>}
                    </Badge>
                  </div>
                  {x.matricula && <div className="text-xs text-muted-foreground mt-0.5">Matrícula {x.matricula}</div>}
                  <div className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> {x.email}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
