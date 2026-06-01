import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, LayoutGrid, List, Filter, BookOpen, X, Upload, Pencil, Trash2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { LibraryAPI } from "@/lib/api/library.service";
import type { Livro } from "@/lib/types";

export const Route = createFileRoute("/livros")({
  head: () => ({
    meta: [
      { title: "Livros — Biblioteca Ceará" },
      { name: "description", content: "Catálogo, cadastro e edição de livros do acervo." },
    ],
  }),
  component: () => <AppLayout><LivrosPage /></AppLayout>,
});

function LivrosPage() {
  const [livros, setLivros] = useState<Livro[] | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("todas");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { LibraryAPI.listLivros().then(setLivros); }, []);

  const categorias = useMemo(
    () => Array.from(new Set((livros ?? []).map((l) => l.categoria))),
    [livros]
  );

  const filtered = (livros ?? []).filter((l) => {
    const matchesQ = !q || l.nome.toLowerCase().includes(q.toLowerCase()) || l.isbn.includes(q) || l.autores?.[0]?.nome.toLowerCase().includes(q.toLowerCase());
    const matchesC = cat === "todas" || l.categoria === cat;
    return matchesQ && matchesC;
  });

  return (
    <div>
      <PageHeader
        title="Acervo"
        description="Gerencie títulos, exemplares e disponibilidade da biblioteca."
        actions={
          <>
            <Button variant="outline" size="md"><Filter className="w-4 h-4" /> Exportar</Button>
            <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Novo livro</Button>
          </>
        }
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por título, autor ou ISBN..."
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
          <select
            value={cat} onChange={(e) => setCat(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-card text-sm"
          >
            <option value="todas">Todas as categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center rounded-xl border border-border p-1 bg-card">
            <button
              onClick={() => setView("table")}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-3.5 h-3.5" /> Tabela
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grade
            </button>
          </div>
        </div>
      </Card>

      {!livros && <SkeletonGrid />}

      {livros && view === "table" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Título</th>
                  <th className="py-3 px-4 font-medium">Autor</th>
                  <th className="py-3 px-4 font-medium">Categoria</th>
                  <th className="py-3 px-4 font-medium">Editora</th>
                  <th className="py-3 px-4 font-medium">ISBN</th>
                  <th className="py-3 px-4 font-medium">Disponibilidade</th>
                  <th className="py-3 px-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <motion.tr
                    key={l.idLivros}
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                    className="border-t border-border hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded-md gradient-ocean text-white grid place-items-center shrink-0 shadow-soft">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="font-medium">{l.nome}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{l.autores?.[0]?.nome ?? "—"}</td>
                    <td className="py-3 px-4"><Badge tone="info">{l.categoria}</Badge></td>
                    <td className="py-3 px-4 text-muted-foreground">{l.editora?.nome}</td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{l.isbn}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-ocean"
                            style={{ width: `${(l.quantidade_disponivel / l.quantidade_total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{l.quantidade_disponivel}/{l.quantidade_total}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-1">
                        <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted"><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="w-8 h-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
            <span>Mostrando {filtered.length} de {livros.length} títulos</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted">Anterior</button>
              <button className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground">1</button>
              <button className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted">2</button>
              <button className="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted">Próxima</button>
            </div>
          </div>
        </Card>
      )}

      {livros && view === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((l, i) => (
            <motion.div
              key={l.idLivros}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            >
              <Card hover className="p-4">
                <div className="aspect-[3/4] rounded-xl gradient-ocean text-white grid place-items-center mb-3 shadow-elegant">
                  <BookOpen className="w-10 h-10 opacity-90" />
                </div>
                <div className="text-sm font-semibold truncate">{l.nome}</div>
                <div className="text-xs text-muted-foreground truncate">{l.autores?.[0]?.nome}</div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge tone="info">{l.categoria}</Badge>
                  <span className="text-xs text-muted-foreground">{l.quantidade_disponivel}/{l.quantidade_total}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-glow border border-border overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <div className="font-display text-lg font-semibold">Cadastrar novo livro</div>
                  <div className="text-xs text-muted-foreground">Preencha os dados conforme a modelagem do acervo.</div>
                </div>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Título"><input className="input" placeholder="Ex.: O Quinze" /></Field>
                <Field label="ISBN"><input className="input" placeholder="978-..." /></Field>
                <Field label="Autor"><input className="input" placeholder="Ex.: Rachel de Queiroz" /></Field>
                <Field label="Editora"><input className="input" placeholder="Ex.: Editora Ceará" /></Field>
                <Field label="Categoria"><input className="input" placeholder="Romance, Poesia..." /></Field>
                <Field label="Ano de lançamento"><input className="input" type="number" placeholder="2024" /></Field>
                <Field label="Quantidade total"><input className="input" type="number" placeholder="10" /></Field>
                <Field label="Quantidade disponível"><input className="input" type="number" placeholder="10" /></Field>
                <div className="md:col-span-2">
                  <Field label="Capa do livro">
                    <div className="h-28 rounded-xl border border-dashed border-border grid place-items-center text-sm text-muted-foreground hover:bg-muted/40 cursor-pointer">
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="w-4 h-4" /> Clique para enviar (PNG, JPG até 5MB)
                      </div>
                    </div>
                  </Field>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-5 border-t border-border bg-muted/30">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => setModalOpen(false)}>Cadastrar livro</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.input { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-card); font-size: 14px; width: 100%; outline: none; transition: all .15s; }
        .input:focus { border-color: color-mix(in oklab, var(--color-primary) 50%, transparent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl shimmer" />
      ))}
    </div>
  );
}
