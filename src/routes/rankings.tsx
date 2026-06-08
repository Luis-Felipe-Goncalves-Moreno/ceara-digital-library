import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, FileDown, GraduationCap, Users as UsersIcon, Crown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Button, Badge } from "@/components/ui-kit";
import { useEmprestimos, useProfiles } from "@/lib/hooks/use-library";

export const Route = createFileRoute("/rankings")({
  head: () => ({
    meta: [
      { title: "Rankings — Bibliotech" },
      { name: "description", content: "Rank de alunos e turmas com mais empréstimos, exportável em PDF." },
    ],
  }),
  component: () => <AppLayout><RankingsPage /></AppLayout>,
});

type StudentRank = { usuario: { id: string; nome: string }; total: number; turma: string };
type TurmaRank = { turma: string; total: number; alunos: number; media: number };

function computeRanks(emp: any[], users: any[]): { students: StudentRank[]; turmas: TurmaRank[] } {
  const byUser = new Map<string, number>();
  emp.forEach((e) => byUser.set(e.usuario_id, (byUser.get(e.usuario_id) ?? 0) + 1));

  const students: StudentRank[] = users
    .filter((u) => u.turma)
    .map((u) => ({ usuario: { id: u.id, nome: u.nome }, total: byUser.get(u.id) ?? 0, turma: u.turma as string }))
    .sort((a, b) => b.total - a.total);

  const turmaMap = new Map<string, { total: number; alunos: number }>();
  students.forEach((s) => {
    const cur = turmaMap.get(s.turma) ?? { total: 0, alunos: 0 };
    turmaMap.set(s.turma, { total: cur.total + s.total, alunos: cur.alunos + 1 });
  });

  const turmas: TurmaRank[] = Array.from(turmaMap.entries())
    .map(([turma, v]) => ({ turma, total: v.total, alunos: v.alunos, media: v.total / Math.max(v.alunos, 1) }))
    .sort((a, b) => b.total - a.total);

  return { students, turmas };
}

function RankingsPage() {
  const { data: emp = [] } = useEmprestimos();
  const { data: users = [] } = useProfiles();

  const { students, turmas } = useMemo(() => computeRanks(emp, users), [emp, users]);
  const top10 = students.slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Rankings de leitura"
        description="Reconhecimento dos alunos e turmas com maior número de empréstimos."
        actions={
          <>
            <Button variant="outline" onClick={() => exportRankingsPDF(students, turmas)}>
              <FileDown className="w-4 h-4" /> Baixar Rankings (PDF)
            </Button>
            <Button onClick={() => exportCertificatesPDF(top10)}>
              <Award className="w-4 h-4" /> Certificados Top 10
            </Button>
          </>
        }
      />

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {top10.slice(0, 3).map((s, i) => {
          const colors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-400 to-amber-700"];
          const icons = [Crown, Trophy, Medal];
          const Icon = icons[i];
          return (
            <motion.div key={s.usuario.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-5 relative overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${colors[i]} opacity-20 blur-2xl`} />
                <div className="flex items-center gap-4 relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[i]} text-white grid place-items-center shadow-elegant`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{i + 1}º lugar</div>
                    <div className="font-display font-semibold text-lg truncate">{s.usuario.nome}</div>
                    <div className="text-xs text-muted-foreground">{s.turma}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-3xl font-display font-bold text-primary">{s.total}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">empréstimos</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Students table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-semibold">Top alunos leitores</div>
              <div className="text-xs text-muted-foreground">Classificação por número de empréstimos</div>
            </div>
            <span className="ml-auto"><Badge tone="info">{students.length} alunos</Badge></span>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium w-12">#</th>
                  <th className="py-2.5 px-4 font-medium">Aluno</th>
                  <th className="py-2.5 px-4 font-medium">Turma</th>
                  <th className="py-2.5 px-4 font-medium text-right">Empréstimos</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.usuario.id} className={`border-t border-border hover:bg-muted/40 ${i < 10 ? "bg-primary/5" : ""}`}>
                    <td className="py-2.5 px-4 font-mono text-xs">
                      {i < 3 ? <span className="text-base">{["🥇","🥈","🥉"][i]}</span> : i + 1}
                    </td>
                    <td className="py-2.5 px-4 font-medium">{s.usuario.nome}</td>
                    <td className="py-2.5 px-4 text-muted-foreground text-xs">{s.turma}</td>
                    <td className="py-2.5 px-4 text-right font-semibold">{s.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Turmas table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-secondary" />
            <div>
              <div className="text-sm font-semibold">Top turmas</div>
              <div className="text-xs text-muted-foreground">Total de empréstimos por turma</div>
            </div>
            <span className="ml-auto"><Badge tone="accent">{turmas.length} turmas</Badge></span>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium w-12">#</th>
                  <th className="py-2.5 px-4 font-medium">Turma</th>
                  <th className="py-2.5 px-4 font-medium text-right">Alunos</th>
                  <th className="py-2.5 px-4 font-medium text-right">Média</th>
                  <th className="py-2.5 px-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((t, i) => {
                  const max = turmas[0]?.total || 1;
                  const pct = (t.total / max) * 100;
                  return (
                    <tr key={t.turma} className="border-t border-border hover:bg-muted/40">
                      <td className="py-2.5 px-4 font-mono text-xs">
                        {i < 3 ? <span className="text-base">{["🥇","🥈","🥉"][i]}</span> : i + 1}
                      </td>
                      <td className="py-2.5 px-4 font-medium">
                        <div>{t.turma}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full gradient-ocean" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-right text-muted-foreground">{t.alunos}</td>
                      <td className="py-2.5 px-4 text-right text-muted-foreground">{t.media.toFixed(1)}</td>
                      <td className="py-2.5 px-4 text-right font-semibold">{t.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============ PDF generation ============

const BLUE: [number, number, number] = [0, 92, 169];
const GREEN: [number, number, number] = [0, 143, 76];
const GOLD: [number, number, number] = [244, 197, 66];

function header(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 28, doc.internal.pageSize.getWidth(), 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Bibliotech v2.0 — Sistema Acadêmico", 14, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitle, 14, 21);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(`Emitido em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`, 14, 50);
  doc.setTextColor(20, 20, 20);
}

function footer(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(220);
    doc.line(14, h - 14, w - 14, h - 14);
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("Bibliotech • Documento gerado automaticamente", 14, h - 8);
    doc.text(`Página ${i} de ${pageCount}`, w - 14, h - 8, { align: "right" });
  }
}

function exportRankingsPDF(students: StudentRank[], turmas: TurmaRank[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  header(doc, "Ranking de Empréstimos", "Relatório consolidado de alunos e turmas");

  autoTable(doc, {
    startY: 58,
    head: [["#", "Aluno", "Turma", "Empréstimos"]],
    body: students.map((s, i) => [i + 1, s.usuario.nome, s.turma, s.total]),
    headStyles: { fillColor: BLUE, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 248, 252] },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 12, halign: "center" }, 3: { halign: "right", fontStyle: "bold" } },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index < 10 && data.column.index === 0) {
        data.cell.styles.fillColor = GOLD;
        data.cell.styles.textColor = [20, 20, 20];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  doc.addPage();
  header(doc, "Ranking por Turma", "Total de empréstimos agrupados por turma");
  autoTable(doc, {
    startY: 58,
    head: [["#", "Turma", "Alunos", "Média", "Total"]],
    body: turmas.map((t, i) => [i + 1, t.turma, t.alunos, t.media.toFixed(1), t.total]),
    headStyles: { fillColor: GREEN, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 250, 244] },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right", fontStyle: "bold" },
    },
  });

  footer(doc);
  doc.save(`rankings-biblioteca-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function exportCertificatesPDF(top10: StudentRank[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  top10.forEach((s, idx) => {
    if (idx > 0) doc.addPage();
    drawCertificate(doc, s, idx + 1);
  });
  doc.save(`certificados-top10-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function drawCertificate(doc: jsPDF, s: StudentRank, pos: number) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(252, 250, 244);
  doc.rect(0, 0, w, h, "F");

  // Outer decorative borders
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(2);
  doc.rect(8, 8, w - 16, h - 16);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.rect(12, 12, w - 24, h - 24);

  // Top band
  doc.setFillColor(...BLUE);
  doc.rect(12, 12, w - 24, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("BIBLIOTECH", w / 2, 22, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Sistema Acadêmico de Gerenciamento", w / 2, 28, { align: "center" });

  // Gold seal
  doc.setFillColor(...GOLD);
  doc.circle(w / 2, 56, 12, "F");
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${pos}º`, w / 2, 60, { align: "center" });

  // Title
  doc.setTextColor(20, 20, 20);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text("Certificado de Mérito", w / 2, 88, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text("Concedido a", w / 2, 102, { align: "center" });

  // Recipient
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...BLUE);
  doc.text(s.usuario.nome, w / 2, 118, { align: "center" });

  // Underline
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  const textWidth = doc.getTextWidth(s.usuario.nome);
  doc.line((w - textWidth) / 2 - 6, 122, (w + textWidth) / 2 + 6, 122);

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  const body =
    `Em reconhecimento ao destaque como leitor(a) ativo(a) da turma ${s.turma},`;
  const body2 =
    `figurando entre os 10 alunos com maior número de empréstimos no período,`;
  const body3 =
    `totalizando ${s.total} obras retiradas do acervo da Bibliotech.`;
  doc.text(body, w / 2, 138, { align: "center" });
  doc.text(body2, w / 2, 145, { align: "center" });
  doc.text(body3, w / 2, 152, { align: "center" });

  // Signatures
  const y = h - 38;
  doc.setDrawColor(80);
  doc.setLineWidth(0.3);
  doc.line(40, y, 110, y);
  doc.line(w - 110, y, w - 40, y);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Renata Cavalcante", 75, y + 5, { align: "center" });
  doc.text("Bibliotecária Responsável", 75, y + 10, { align: "center" });
  doc.text("Felipe Castro", w - 75, y + 5, { align: "center" });
  doc.text("Coordenação Acadêmica", w - 75, y + 10, { align: "center" });

  // Date
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Fortaleza/CE, ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`, w / 2, h - 18, { align: "center" });
}
