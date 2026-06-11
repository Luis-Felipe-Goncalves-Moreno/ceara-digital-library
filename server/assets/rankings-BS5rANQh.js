import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileDown, Award, Crown, Trophy, Medal, GraduationCap, Users } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { A as AppLayout, b as useEmprestimos, u as useProfiles, P as PageHeader, B as Button, C as Card, a as Badge } from "./ui-kit-BmPG-GCF.js";
import "@tanstack/react-router";
import "./client-thVVdJXN.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
function computeRanks(emp, users) {
  const byUser = /* @__PURE__ */ new Map();
  emp.forEach((e) => byUser.set(e.usuario_id, (byUser.get(e.usuario_id) ?? 0) + 1));
  const students = users.filter((u) => u.turma).map((u) => ({
    usuario: {
      id: u.id,
      nome: u.nome
    },
    total: byUser.get(u.id) ?? 0,
    turma: u.turma
  })).sort((a, b) => b.total - a.total);
  const turmaMap = /* @__PURE__ */ new Map();
  students.forEach((s) => {
    const cur = turmaMap.get(s.turma) ?? {
      total: 0,
      alunos: 0
    };
    turmaMap.set(s.turma, {
      total: cur.total + s.total,
      alunos: cur.alunos + 1
    });
  });
  const turmas = Array.from(turmaMap.entries()).map(([turma, v]) => ({
    turma,
    total: v.total,
    alunos: v.alunos,
    media: v.total / Math.max(v.alunos, 1)
  })).sort((a, b) => b.total - a.total);
  return {
    students,
    turmas
  };
}
function RankingsPage() {
  const {
    data: emp = []
  } = useEmprestimos();
  const {
    data: users = []
  } = useProfiles();
  const {
    students,
    turmas
  } = useMemo(() => computeRanks(emp, users), [emp, users]);
  const top10 = students.slice(0, 10);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Rankings de leitura", description: "Reconhecimento dos alunos e turmas com maior número de empréstimos.", actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => exportRankingsPDF(students, turmas), children: [
        /* @__PURE__ */ jsx(FileDown, { className: "w-4 h-4" }),
        " Baixar Rankings (PDF)"
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: () => exportCertificatesPDF(top10), children: [
        /* @__PURE__ */ jsx(Award, { className: "w-4 h-4" }),
        " Certificados Top 10"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: top10.slice(0, 3).map((s, i) => {
      const colors = ["from-amber-400 to-yellow-500", "from-slate-300 to-slate-400", "from-orange-400 to-amber-700"];
      const icons = [Crown, Trophy, Medal];
      const Icon = icons[i];
      return /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0,
        y: 12
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: i * 0.08
      }, children: /* @__PURE__ */ jsxs(Card, { className: "p-5 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: `absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${colors[i]} opacity-20 blur-2xl` }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative", children: [
          /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[i]} text-white grid place-items-center shadow-elegant`, children: /* @__PURE__ */ jsx(Icon, { className: "w-7 h-7" }) }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
              i + 1,
              "º lugar"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-display font-semibold text-lg truncate", children: s.usuario.nome }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.turma })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ml-auto text-right", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-display font-bold text-primary", children: s.total }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase text-muted-foreground", children: "empréstimos" })
          ] })
        ] })
      ] }) }, s.usuario.id);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "w-4 h-4 text-primary" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Top alunos leitores" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Classificação por número de empréstimos" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto", children: /* @__PURE__ */ jsxs(Badge, { tone: "info", children: [
            students.length,
            " alunos"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[520px] overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs uppercase text-muted-foreground", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium w-12", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium", children: "Aluno" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium", children: "Turma" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium text-right", children: "Empréstimos" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: students.map((s, i) => /* @__PURE__ */ jsxs("tr", { className: `border-t border-border hover:bg-muted/40 ${i < 10 ? "bg-primary/5" : ""}`, children: [
            /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-mono text-xs", children: i < 3 ? /* @__PURE__ */ jsx("span", { className: "text-base", children: ["🥇", "🥈", "🥉"][i] }) : i + 1 }),
            /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-medium", children: s.usuario.nome }),
            /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-muted-foreground text-xs", children: s.turma }),
            /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-right font-semibold", children: s.total })
          ] }, s.usuario.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-secondary" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold", children: "Top turmas" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Total de empréstimos por turma" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto", children: /* @__PURE__ */ jsxs(Badge, { tone: "accent", children: [
            turmas.length,
            " turmas"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "max-h-[520px] overflow-y-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 sticky top-0", children: /* @__PURE__ */ jsxs("tr", { className: "text-left text-xs uppercase text-muted-foreground", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium w-12", children: "#" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium", children: "Turma" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium text-right", children: "Alunos" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium text-right", children: "Média" }),
            /* @__PURE__ */ jsx("th", { className: "py-2.5 px-4 font-medium text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: turmas.map((t, i) => {
            const max = turmas[0]?.total || 1;
            const pct = t.total / max * 100;
            return /* @__PURE__ */ jsxs("tr", { className: "border-t border-border hover:bg-muted/40", children: [
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 font-mono text-xs", children: i < 3 ? /* @__PURE__ */ jsx("span", { className: "text-base", children: ["🥇", "🥈", "🥉"][i] }) : i + 1 }),
              /* @__PURE__ */ jsxs("td", { className: "py-2.5 px-4 font-medium", children: [
                /* @__PURE__ */ jsx("div", { children: t.turma }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full gradient-ocean", style: {
                  width: `${pct}%`
                } }) })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-right text-muted-foreground", children: t.alunos }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-right text-muted-foreground", children: t.media.toFixed(1) }),
              /* @__PURE__ */ jsx("td", { className: "py-2.5 px-4 text-right font-semibold", children: t.total })
            ] }, t.turma);
          }) })
        ] }) })
      ] })
    ] })
  ] });
}
const BLUE = [0, 92, 169];
const GREEN = [0, 143, 76];
const GOLD = [244, 197, 66];
function header(doc, title, subtitle) {
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 28, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 28, doc.internal.pageSize.getWidth(), 1.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Bibliotech v2.1 — Sistema Acadêmico", 14, 13);
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
  doc.text(`Emitido em ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} às ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`, 14, 50);
  doc.setTextColor(20, 20, 20);
}
function footer(doc) {
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
    doc.text(`Página ${i} de ${pageCount}`, w - 14, h - 8, {
      align: "right"
    });
  }
}
function exportRankingsPDF(students, turmas) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  header(doc, "Ranking de Empréstimos", "Relatório consolidado de alunos e turmas");
  autoTable(doc, {
    startY: 58,
    head: [["#", "Aluno", "Turma", "Empréstimos"]],
    body: students.map((s, i) => [i + 1, s.usuario.nome, s.turma, s.total]),
    headStyles: {
      fillColor: BLUE,
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 248, 252]
    },
    styles: {
      fontSize: 9,
      cellPadding: 2.5
    },
    columnStyles: {
      0: {
        cellWidth: 12,
        halign: "center"
      },
      3: {
        halign: "right",
        fontStyle: "bold"
      }
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.row.index < 10 && data.column.index === 0) {
        data.cell.styles.fillColor = GOLD;
        data.cell.styles.textColor = [20, 20, 20];
        data.cell.styles.fontStyle = "bold";
      }
    }
  });
  doc.addPage();
  header(doc, "Ranking por Turma", "Total de empréstimos agrupados por turma");
  autoTable(doc, {
    startY: 58,
    head: [["#", "Turma", "Alunos", "Média", "Total"]],
    body: turmas.map((t, i) => [i + 1, t.turma, t.alunos, t.media.toFixed(1), t.total]),
    headStyles: {
      fillColor: GREEN,
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [240, 250, 244]
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: {
        cellWidth: 14,
        halign: "center"
      },
      2: {
        halign: "right"
      },
      3: {
        halign: "right"
      },
      4: {
        halign: "right",
        fontStyle: "bold"
      }
    }
  });
  footer(doc);
  doc.save(`rankings-biblioteca-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`);
}
function exportCertificatesPDF(top10) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  top10.forEach((s, idx) => {
    if (idx > 0) doc.addPage();
    drawCertificate(doc, s, idx + 1);
  });
  doc.save(`certificados-top10-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.pdf`);
}
function drawCertificate(doc, s, pos) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(252, 250, 244);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(2);
  doc.rect(8, 8, w - 16, h - 16);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.rect(12, 12, w - 24, h - 24);
  doc.setFillColor(...BLUE);
  doc.rect(12, 12, w - 24, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("BIBLIOTECH", w / 2, 22, {
    align: "center"
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Sistema Acadêmico de Gerenciamento", w / 2, 28, {
    align: "center"
  });
  doc.setFillColor(...GOLD);
  doc.circle(w / 2, 56, 12, "F");
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${pos}º`, w / 2, 60, {
    align: "center"
  });
  doc.setTextColor(20, 20, 20);
  doc.setFont("times", "bold");
  doc.setFontSize(34);
  doc.text("Certificado de Mérito", w / 2, 88, {
    align: "center"
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(90, 90, 90);
  doc.text("Concedido a", w / 2, 102, {
    align: "center"
  });
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...BLUE);
  doc.text(s.usuario.nome, w / 2, 118, {
    align: "center"
  });
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  const textWidth = doc.getTextWidth(s.usuario.nome);
  doc.line((w - textWidth) / 2 - 6, 122, (w + textWidth) / 2 + 6, 122);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  const body = `Em reconhecimento ao destaque como leitor(a) ativo(a) da turma ${s.turma},`;
  const body2 = `figurando entre os 10 alunos com maior número de empréstimos no período,`;
  const body3 = `totalizando ${s.total} obras retiradas do acervo da Bibliotech.`;
  doc.text(body, w / 2, 138, {
    align: "center"
  });
  doc.text(body2, w / 2, 145, {
    align: "center"
  });
  doc.text(body3, w / 2, 152, {
    align: "center"
  });
  const y = h - 38;
  doc.setDrawColor(80);
  doc.setLineWidth(0.3);
  doc.line(40, y, 110, y);
  doc.line(w - 110, y, w - 40, y);
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Renata Cavalcante", 75, y + 5, {
    align: "center"
  });
  doc.text("Bibliotecária Responsável", 75, y + 10, {
    align: "center"
  });
  doc.text("Felipe Castro", w - 75, y + 5, {
    align: "center"
  });
  doc.text("Coordenação Acadêmica", w - 75, y + 10, {
    align: "center"
  });
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Fortaleza/CE, ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })}`, w / 2, h - 18, {
    align: "center"
  });
}
const SplitComponent = () => /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(RankingsPage, {}) });
export {
  SplitComponent as component
};
