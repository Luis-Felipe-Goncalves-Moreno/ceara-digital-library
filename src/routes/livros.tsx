import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, LayoutGrid, List, BookOpen, X, Trash2, Sparkles, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { useLivros, useCreateLivro, useDeleteLivro, useSession, isStaff } from "@/lib/hooks/use-library";
import { lookupIsbn } from "@/lib/isbn.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/livros")({
  head: () => ({
    meta: [
      { title: "Livros — Bibliotech" },
      { name: "description", content: "Catálogo de livros com cadastro automático por ISBN." },
    ],
  }),
  component: () => <AppLayout><LivrosPage /></AppLayout>,
});

function LivrosPage() {
  const { roles } = useSession();
  const staff = isStaff(roles);
  const { data: livros, isLoading } = useLivros();
  const createLivro = useCreateLivro();
  const deleteLivro = useDeleteLivro();
  const lookup = useServerFn(lookupIsbn);

  const [view, setView] = useState<"table" | "grid">("grid");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("todas");
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [isbn, setIsbn] = useState("");
  const [looking, setLooking] = useState(false);
  const [form, setForm] = useState({
    nome: "", subtitulo: "", categoria: "", ano: "", paginas: "",
    sinopse: "", capa_url: "", editora_nome: "", autores: "",
    quantidade_total: "5",
  });

  const categorias = useMemo(
    () => Array.from(new Set((livros ?? []).map((l: any) => l.categoria).filter(Boolean))),
    [livros]
  );

  const filtered = (livros ?? []).filter((l: any) => {
    const matchesQ = !q || l.nome.toLowerCase().includes(q.toLowerCase()) || l.isbn?.includes(q) ||
      l.autores?.some((a: any) => a.nome.toLowerCase().includes(q.toLowerCase()));
    const matchesC = cat === "todas" || l.categoria === cat;
    return matchesQ && matchesC;
  });

  const doLookup = async () => {
    if (!isbn.trim()) return;
    setLooking(true);
    try {
      const r = await lookup({ data: { isbn: isbn.trim() } });
      setForm({
        nome: r.titulo,
        subtitulo: r.subtitulo ?? "",
        categoria: r.categoria ?? "",
        ano: r.ano ? String(r.ano) : "",
        paginas: r.paginas ? String(r.paginas) : "",
        sinopse: r.sinopse ?? "",
        capa_url: r.capa_url ?? "",
        editora_nome: r.editora ?? "",
        autores: r.autores.join(", "),
        quantidade_total: "5",
      });
      toast.success(r.fonte === "none" ? "ISBN não encontrado. Preencha manualmente." : `Dados encontrados (${r.fonte}).`);
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao consultar ISBN");
    } finally {
      setLooking(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLivro.mutateAsync({
        isbn: isbn.trim(),
        nome: form.nome,
        subtitulo: form.subtitulo || undefined,
        categoria: form.categoria || undefined,
        ano: form.ano ? Number(form.ano) : undefined,
        paginas: form.paginas ? Number(form.paginas) : undefined,
        sinopse: form.sinopse || undefined,
        capa_url: form.capa_url || undefined,
        editora_nome: form.editora_nome || undefined,
        autores_nomes: form.autores.split(",").map((s) => s.trim()).filter(Boolean),
        quantidade_total: Number(form.quantidade_total) || 1,
      });
      toast.success("Livro cadastrado!");
      setModalOpen(false);
      setIsbn(""); setForm({ nome: "", subtitulo: "", categoria: "", ano: "", paginas: "", sinopse: "", capa_url: "", editora_nome: "", autores: "", quantidade_total: "5" });
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao cadastrar");
    }
  };

  return (
    <div>
      <PageHeader
        title="Acervo"
        description="Cadastre livros automaticamente pelo ISBN — capa e metadados via Open Library / Google Books."
        actions={staff && <Button onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Novo livro</Button>}
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-muted/60 border border-border flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar título, autor ou ISBN..."
              className="bg-transparent outline-none text-sm flex-1" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-card text-sm">
            <option value="todas">Todas as categorias</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center rounded-xl border border-border p-1 bg-card">
            <button onClick={() => setView("table")} className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <List className="w-3.5 h-3.5" /> Tabela
            </button>
            <button onClick={() => setView("grid")} className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <LayoutGrid className="w-3.5 h-3.5" /> Grade
            </button>
          </div>
        </div>
      </Card>

      {isLoading && <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl shimmer" />)}</div>}

      {!isLoading && filtered.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <div className="font-medium">Nenhum livro cadastrado ainda</div>
          <div className="text-sm text-muted-foreground mt-1">
            {staff ? "Clique em \"Novo livro\" e informe o ISBN — preenchemos o resto." : "Aguarde o bibliotecário cadastrar livros."}
          </div>
        </Card>
      )}

      {!isLoading && view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((l: any, i: number) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Card hover className="p-3 group">
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-muted relative">
                  {l.capa_url ? (
                    <img src={l.capa_url} alt={l.nome} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full gradient-ocean grid place-items-center text-white">
                      <BookOpen className="w-10 h-10 opacity-90" />
                    </div>
                  )}
                  {staff && (
                    <button onClick={() => { if (confirm(`Excluir "${l.nome}"?`)) deleteLivro.mutate(l.id); }}
                      className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-lg bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-sm font-semibold truncate" title={l.nome}>{l.nome}</div>
                <div className="text-xs text-muted-foreground truncate">{l.autores?.[0]?.nome ?? "—"}</div>
                <div className="mt-2 flex items-center justify-between">
                  {l.categoria && <Badge tone="info">{l.categoria}</Badge>}
                  <span className="text-xs text-muted-foreground ml-auto">{l.quantidade_disponivel}/{l.quantidade_total}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && view === "table" && filtered.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-3 px-4 font-medium">Título</th>
                  <th className="py-3 px-4 font-medium">Autor</th>
                  <th className="py-3 px-4 font-medium">Categoria</th>
                  <th className="py-3 px-4 font-medium">ISBN</th>
                  <th className="py-3 px-4 font-medium">Disp.</th>
                  {staff && <th className="py-3 px-4"></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l: any) => (
                  <tr key={l.id} className="border-t border-border hover:bg-muted/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {l.capa_url ? <img src={l.capa_url} className="w-9 h-12 rounded object-cover" alt="" /> :
                          <div className="w-9 h-12 rounded gradient-ocean text-white grid place-items-center"><BookOpen className="w-4 h-4" /></div>}
                        <div className="font-medium">{l.nome}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{l.autores?.[0]?.nome ?? "—"}</td>
                    <td className="py-3 px-4">{l.categoria && <Badge tone="info">{l.categoria}</Badge>}</td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{l.isbn}</td>
                    <td className="py-3 px-4 text-xs">{l.quantidade_disponivel}/{l.quantidade_total}</td>
                    {staff && (
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => { if (confirm(`Excluir "${l.nome}"?`)) deleteLivro.mutate(l.id); }}
                          className="w-8 h-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
            onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-card rounded-2xl shadow-glow border border-border my-8">
              <form onSubmit={submit}>
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <div>
                    <div className="font-display text-lg font-semibold">Cadastrar livro</div>
                    <div className="text-xs text-muted-foreground">Informe o ISBN e preenchemos os dados automaticamente.</div>
                  </div>
                  <button type="button" onClick={() => setModalOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex gap-2">
                    <input required value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN (ex.: 9788535914849)"
                      className="flex-1 h-11 px-3 rounded-xl border border-border bg-card text-sm font-mono outline-none focus:border-primary" />
                    <Button type="button" variant="outline" onClick={doLookup} disabled={looking || !isbn.trim()}>
                      {looking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      Buscar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 items-start">
                    {form.capa_url && (
                      <img src={form.capa_url} alt="" className="w-28 aspect-[2/3] object-cover rounded-lg border border-border" />
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Título *"><input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="input" /></Field>
                      <Field label="Subtítulo"><input value={form.subtitulo} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })} className="input" /></Field>
                      <Field label="Autores (vírgula)"><input value={form.autores} onChange={(e) => setForm({ ...form, autores: e.target.value })} className="input" placeholder="Autor 1, Autor 2" /></Field>
                      <Field label="Editora"><input value={form.editora_nome} onChange={(e) => setForm({ ...form, editora_nome: e.target.value })} className="input" /></Field>
                      <Field label="Categoria"><input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="input" /></Field>
                      <Field label="Ano"><input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} className="input" /></Field>
                      <Field label="Páginas"><input type="number" value={form.paginas} onChange={(e) => setForm({ ...form, paginas: e.target.value })} className="input" /></Field>
                      <Field label="Quantidade total *"><input required type="number" min={1} value={form.quantidade_total} onChange={(e) => setForm({ ...form, quantidade_total: e.target.value })} className="input" /></Field>
                      <div className="md:col-span-2">
                        <Field label="URL da capa"><input value={form.capa_url} onChange={(e) => setForm({ ...form, capa_url: e.target.value })} className="input" /></Field>
                      </div>
                      <div className="md:col-span-2">
                        <Field label="Sinopse"><textarea rows={3} value={form.sinopse} onChange={(e) => setForm({ ...form, sinopse: e.target.value })} className="input" style={{ height: "auto", padding: 10 }} /></Field>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-5 border-t border-border bg-muted/30">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={createLivro.isPending || !form.nome}>
                    {createLivro.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Cadastrar
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.input { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-card); font-size: 14px; width: 100%; outline: none; }
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
