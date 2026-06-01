import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Filter, X } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Badge, Button } from "@/components/ui-kit";
import { LibraryAPI } from "@/lib/api/library.service";
import type { Livro } from "@/lib/types";

export const Route = createFileRoute("/pesquisa")({
  head: () => ({
    meta: [
      { title: "Pesquisa — Biblioteca Ceará" },
      { name: "description", content: "Busca inteligente no acervo com filtros e autocomplete." },
    ],
  }),
  component: () => <AppLayout><PesquisaPage /></AppLayout>,
});

function PesquisaPage() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [q, setQ] = useState("");
  const [autor, setAutor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [cat, setCat] = useState("");
  const [disp, setDisp] = useState<"qualquer" | "disponivel" | "indisponivel">("qualquer");

  useEffect(() => { LibraryAPI.listLivros().then(setLivros); }, []);

  const categorias = useMemo(() => Array.from(new Set(livros.map((l) => l.categoria))), [livros]);
  const autores = useMemo(() => Array.from(new Set(livros.flatMap((l) => l.autores?.map((a) => a.nome) ?? []))), [livros]);

  const suggestions = q ? livros.filter((l) => l.nome.toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];

  const results = livros.filter((l) => {
    const matchQ = !q || l.nome.toLowerCase().includes(q.toLowerCase());
    const matchAutor = !autor || l.autores?.some((a) => a.nome === autor);
    const matchIsbn = !isbn || l.isbn.includes(isbn);
    const matchCat = !cat || l.categoria === cat;
    const matchDisp =
      disp === "qualquer" ||
      (disp === "disponivel" && l.quantidade_disponivel > 0) ||
      (disp === "indisponivel" && l.quantidade_disponivel === 0);
    return matchQ && matchAutor && matchIsbn && matchCat && matchDisp;
  });

  const clear = () => { setQ(""); setAutor(""); setIsbn(""); setCat(""); setDisp("qualquer"); };

  return (
    <div>
      <PageHeader
        title="Pesquisa de livros"
        description="Encontre títulos por nome, autor, ISBN, categoria ou disponibilidade."
      />

      {/* Hero search */}
      <Card className="p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-50 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-card border border-border shadow-soft focus-within:shadow-elegant focus-within:border-primary/40 transition-all">
            <Search className="w-5 h-5 text-primary" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Digite o nome de um livro..."
              className="flex-1 bg-transparent outline-none text-base"
            />
            {q && (
              <button onClick={() => setQ("")} className="w-7 h-7 grid place-items-center rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 rounded-xl border border-border bg-card shadow-card overflow-hidden">
              {suggestions.map((s) => (
                <button key={s.idLivros} onClick={() => setQ(s.nome)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/60 transition-colors text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{s.nome}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{s.autores?.[0]?.nome}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <Card className="p-5 h-fit lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-sm inline-flex items-center gap-2"><Filter className="w-4 h-4" /> Filtros</div>
            <button onClick={clear} className="text-xs text-primary hover:underline">Limpar</button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">Autor</label>
              <select value={autor} onChange={(e) => setAutor(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                <option value="">Todos</option>
                {autores.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Categoria</label>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm">
                <option value="">Todas</option>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">ISBN</label>
              <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="978-..." className="mt-1 w-full h-10 px-3 rounded-xl border border-border bg-card text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Disponibilidade</label>
              <div className="mt-1 space-y-1">
                {[
                  { v: "qualquer", l: "Qualquer" },
                  { v: "disponivel", l: "Disponível agora" },
                  { v: "indisponivel", l: "Indisponível" },
                ].map((o) => (
                  <label key={o.v} className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={disp === o.v} onChange={() => setDisp(o.v as any)} />
                    {o.l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div>
          <div className="text-xs text-muted-foreground mb-3">{results.length} resultado(s)</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((l, i) => (
              <motion.div key={l.idLivros} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card hover className="p-4 flex gap-4">
                  <div className="w-16 h-20 rounded-lg gradient-ocean text-white grid place-items-center shrink-0 shadow-elegant">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{l.nome}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.autores?.[0]?.nome} • {l.editora?.nome}</div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <Badge tone="info">{l.categoria}</Badge>
                      <Badge tone={l.quantidade_disponivel > 0 ? "success" : "danger"}>
                        {l.quantidade_disponivel > 0 ? `${l.quantidade_disponivel} disponíveis` : "Indisponível"}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline">Detalhes</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
