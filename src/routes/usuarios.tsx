import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap, UserCircle2, Mail, Loader2, ShieldAlert, Plus, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { useProfiles } from "@/lib/hooks/use-library";
import { useServerFn } from "@tanstack/react-start";
import { createUserAccount } from "@/lib/admin.functions";
import { toast } from "sonner";

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

const TURMAS = [
  "1 Informática", "2 Informática", "3 Informática",
  "1 Administração", "3 Administração",
  "2 Finanças",
  "1 Meio-Ambiente", "2 Meio-Ambiente", "3 Meio-Ambiente",
  "1 Edificações", "3 Edificações",
  "2 Redes",
];

function UsuariosPage() {
  const { data: u = [], isLoading, refetch } = useProfiles();
  const createUser = useServerFn(createUserAccount);
  
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState<string>("todos");
  
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "estudante">("estudante");
  const [turma, setTurma] = useState("");
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "estudante" && !turma) return toast.error("Selecione a turma do estudante.");
    setIsCreating(true);
    try {
      await createUser({ data: { email, password, nome, role, turma: role === "estudante" ? turma : undefined } });
      toast.success("Usuário criado com sucesso!");
      setShowForm(false);
      setNome("");
      setEmail("");
      setPassword("");
      setTurma("");
      refetch();
    } catch (err: any) {
      toast.error(err.message ?? "Erro desconhecido ao criar usuário.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Usuários" 
        description="Comunidade leitora cadastrada na plataforma."
        actions={
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "primary"}>
            {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Novo Usuário</>}
          </Button>
        }
      />

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <Card className="p-5 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Criar Conta (Service Role)</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Requer `SUPABASE_SERVICE_ROLE_KEY` configurado no `.env` para criar contas sem realizar logout.</p>
              
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Cargo</label>
                  <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                    <option value="estudante">Estudante (Aluno)</option>
                    <option value="admin">Administrador (Bibliotecário)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nome Completo</label>
                  <input required value={nome} onChange={e => setNome(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" placeholder="Ex: Felipe Silva" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">E-mail</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" placeholder="aluno@bibliotech.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Senha Forte</label>
                  <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" placeholder="Min. 6 caracteres" />
                </div>
                {role === "estudante" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Turma</label>
                    <select required value={turma} onChange={e => setTurma(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                      <option value="">Selecione a turma...</option>
                      {TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                )}
                <div className={role === "estudante" ? "md:col-span-3" : "md:col-span-4"}>
                  <Button type="submit" disabled={isCreating} className="w-full">
                    {isCreating ? "Criando..." : "Confirmar e Criar"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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

