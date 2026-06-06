import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { User, Bell, Shield, Palette, Save } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Button, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Bibliotech" },
      { name: "description", content: "Perfil, preferências, permissões e tema." },
    ],
  }),
  component: () => <AppLayout><ConfigPage /></AppLayout>,
});

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "preferencias", label: "Preferências", icon: Palette },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "permissoes", label: "Permissões", icon: Shield },
] as const;

function ConfigPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("perfil");

  return (
    <div>
      <PageHeader title="Configurações" description="Personalize seu acesso e ajustes do sistema." />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        <Card className="p-2 h-fit">
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id} onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              );
            })}
          </nav>
        </Card>

        <Card className="p-6">
          {tab === "perfil" && (
            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-ocean text-white grid place-items-center text-lg font-semibold shadow-elegant">RC</div>
                <div>
                  <div className="font-semibold">Renata Cavalcante</div>
                  <div className="text-xs text-muted-foreground">Bibliotecária • Acesso completo</div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Alterar foto</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <F label="Nome completo"><input className="i" defaultValue="Renata Cavalcante" /></F>
                <F label="E-mail"><input className="i" defaultValue="renata.c@biblioteca.ce.gov.br" /></F>
                <F label="Cargo"><input className="i" defaultValue="Bibliotecária" /></F>
                <F label="Telefone"><input className="i" defaultValue="(85) 98800-1001" /></F>
              </div>
              <div className="flex justify-end">
                <Button><Save className="w-4 h-4" /> Salvar alterações</Button>
              </div>
            </div>
          )}

          {tab === "preferencias" && (
            <div className="space-y-4 max-w-2xl">
              <Toggle title="Modo escuro automático" desc="Sincronizar com o sistema operacional." />
              <Toggle title="Animações reduzidas" desc="Diminui o uso de microinterações." />
              <Toggle title="Visualização compacta" desc="Mais densidade de informação em tabelas." defaultChecked />
              <Toggle title="Idioma" desc="Português do Brasil (pt-BR)" />
            </div>
          )}

          {tab === "notificacoes" && (
            <div className="space-y-4 max-w-2xl">
              <Toggle title="E-mail de atrasos" desc="Receber resumo diário de empréstimos atrasados." defaultChecked />
              <Toggle title="Notificações push" desc="Alertas no navegador para eventos críticos." />
              <Toggle title="Resumo semanal" desc="Relatório toda segunda-feira pela manhã." defaultChecked />
            </div>
          )}

          {tab === "permissoes" && (
            <div className="space-y-3 max-w-2xl">
              {[
                { role: "Administrador", desc: "Acesso total, incluindo configurações.", tone: "danger" as const },
                { role: "Bibliotecário", desc: "Gestão de acervo, empréstimos e usuários.", tone: "info" as const },
                { role: "Assistente", desc: "Operações de balcão e devoluções.", tone: "accent" as const },
                { role: "Estudante", desc: "Pesquisa de acervo e visualização de empréstimos próprios.", tone: "neutral" as const },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between p-4 rounded-xl border border-border">
                  <div>
                    <div className="font-medium text-sm">{r.role}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                  <Badge tone={r.tone}>Permissões</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <style>{`.i { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-card); font-size: 14px; width: 100%; outline: none; }
        .i:focus { border-color: color-mix(in oklab, var(--color-primary) 50%, transparent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }`}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>{children}</label>;
}

function Toggle({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
