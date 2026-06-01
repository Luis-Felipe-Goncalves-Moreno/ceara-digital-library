import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, GraduationCap, Briefcase, UserCircle2, Mail, Phone } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { LibraryAPI } from "@/lib/api/library.service";
import type { Usuario } from "@/lib/types";

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Biblioteca Ceará" },
      { name: "description", content: "Perfis de estudantes, professores e funcionários." },
    ],
  }),
  component: () => <AppLayout><UsuariosPage /></AppLayout>,
});

const tipoConfig: Record<string, { tone: any; icon: any; label: string }> = {
  estudante: { tone: "info", icon: GraduationCap, label: "Estudante" },
  professor: { tone: "accent", icon: Briefcase, label: "Professor" },
  visitante: { tone: "neutral", icon: UserCircle2, label: "Visitante" },
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function UsuariosPage() {
  const [u, setU] = useState<Usuario[] | null>(null);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("todos");

  useEffect(() => { LibraryAPI.listUsuarios().then(setU); }, []);

  const filtered = (u ?? []).filter((x) => {
    const matchQ = !q || x.nome.toLowerCase().includes(q.toLowerCase()) || x.email.toLowerCase().includes(q.toLowerCase());
    const matchT = tipo === "todos" || x.tipo === tipo;
    return matchQ && matchT;
  });

  const counts = {
    total: u?.length ?? 0,
    estudantes: u?.filter((x) => x.tipo === "estudante").length ?? 0,
    professores: u?.filter((x) => x.tipo === "professor").length ?? 0,
  };

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Comunidade leitora: estudantes, professores e visitantes."
        actions={<Button><Plus className="w-4 h-4" /> Novo usuário</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div><div className="mt-1 text-2xl font-display font-semibold">{counts.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Estudantes</div><div className="mt-1 text-2xl font-display font-semibold">{counts.estudantes}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground uppercase tracking-wider">Professores</div><div className="mt-1 text-2xl font-display font-semibold">{counts.professores}</div></Card>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-card text-sm">
            <option value="todos">Todos os perfis</option>
            <option value="estudante">Estudantes</option>
            <option value="professor">Professores</option>
            <option value="visitante">Visitantes</option>
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((x, i) => {
          const cfg = tipoConfig[x.tipo];
          const Icon = cfg.icon;
          return (
            <motion.div key={x.idusuarios} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-ocean text-white grid place-items-center font-semibold shadow-elegant">
                    {initials(x.nome)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold truncate">{x.nome}</div>
                      <Badge tone={cfg.tone}><Icon className="w-3 h-3" /> {cfg.label}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">CPF {x.cpf}</div>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="inline-flex items-center gap-1.5"><Mail className="w-3 h-3" /> {x.email}</div>
                      <div className="inline-flex items-center gap-1.5"><Phone className="w-3 h-3" /> {x.contato}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="text-muted-foreground">{x.idade} anos • {x.endereco.split("—")[1]?.trim() ?? "—"}</div>
                  <a className="text-primary hover:underline cursor-pointer">Ver histórico →</a>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
