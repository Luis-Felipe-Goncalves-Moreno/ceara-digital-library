import { createFileRoute } from "@tanstack/react-router";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, RadialBarChart, RadialBar, Legend } from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, PageHeader, Button } from "@/components/ui-kit";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Bibliotech" },
      { name: "description", content: "Indicadores analíticos e exportações." },
    ],
  }),
  component: () => <AppLayout><RelatoriosPage /></AppLayout>,
});

const trimestres = [
  { t: "1º Tri", emp: 240, dev: 220, atrasos: 18 },
  { t: "2º Tri", emp: 318, dev: 302, atrasos: 24 },
  { t: "3º Tri", emp: 402, dev: 388, atrasos: 17 },
  { t: "4º Tri", emp: 489, dev: 460, atrasos: 22 },
];

const semanal = Array.from({ length: 12 }).map((_, i) => ({
  s: `S${i + 1}`,
  ativos: 60 + Math.round(Math.sin(i) * 18 + i * 4),
}));

const desempenho = [
  { name: "Devolução em dia", value: 88, fill: "#008F4C" },
  { name: "Renovações", value: 64, fill: "#005CA9" },
  { name: "Satisfação", value: 92, fill: "#F4C542" },
];

function RelatoriosPage() {
  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Indicadores estratégicos e dados consolidados do acervo."
        actions={
          <>
            <Button variant="outline"><FileSpreadsheet className="w-4 h-4" /> Exportar Excel</Button>
            <Button><FileText className="w-4 h-4" /> Exportar PDF</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold">Desempenho por trimestre</div>
              <div className="text-xs text-muted-foreground">Empréstimos, devoluções e atrasos</div>
            </div>
            <button className="text-xs text-primary inline-flex items-center gap-1 hover:underline"><Download className="w-3.5 h-3.5" /> CSV</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trimestres}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="t" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }} />
                <Legend iconType="circle" />
                <Bar dataKey="emp" name="Empréstimos" fill="#005CA9" radius={[8, 8, 0, 0]} />
                <Bar dataKey="dev" name="Devoluções" fill="#008F4C" radius={[8, 8, 0, 0]} />
                <Bar dataKey="atrasos" name="Atrasos" fill="#F4C542" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Indicadores-chave</div>
          <div className="text-xs text-muted-foreground">Desempenho operacional</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="20%" outerRadius="100%" data={desempenho} startAngle={90} endAngle={-270}>
                <RadialBar background dataKey="value" cornerRadius={12} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 xl:col-span-3">
          <div className="text-sm font-semibold">Usuários ativos por semana</div>
          <div className="text-xs text-muted-foreground">Últimas 12 semanas</div>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={semanal}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis dataKey="s" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }} />
                <Line dataKey="ativos" stroke="#005CA9" strokeWidth={3} dot={{ r: 4, fill: "#005CA9" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
