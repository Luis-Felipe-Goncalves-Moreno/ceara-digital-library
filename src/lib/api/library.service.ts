/**
 * Library service layer.
 *
 * Wraps the mock data behind an async API shape that mirrors what a
 * future REST client (Node.js + Express) will expose. When the real
 * backend is ready, swap the body of each function for `fetch()` calls
 * to the corresponding endpoint — the rest of the app stays untouched.
 *
 * Suggested REST mapping:
 *   GET    /api/livros           -> listLivros
 *   GET    /api/livros/:id       -> getLivro
 *   POST   /api/livros           -> createLivro
 *   PUT    /api/livros/:id       -> updateLivro
 *   DELETE /api/livros/:id       -> deleteLivro
 *   ... same shape for /usuarios, /emprestimos, /autores, /editoras
 */
import {
  livros as mockLivros,
  usuarios as mockUsuarios,
  emprestimos as mockEmprestimos,
  autores as mockAutores,
  editoras as mockEditoras,
  funcionarios as mockFuncionarios,
  atividadeRecente,
} from "../mock-data";
import type { Livro, Usuario, Emprestimo, Autor, Editora, Funcionario } from "../types";

const delay = <T,>(data: T, ms = 250): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

export const LibraryAPI = {
  // Livros
  listLivros: () => delay<Livro[]>(mockLivros),
  getLivro: (id: number) => delay(mockLivros.find((l) => l.idLivros === id) ?? null),

  // Usuários
  listUsuarios: () => delay<Usuario[]>(mockUsuarios),
  getUsuario: (id: number) => delay(mockUsuarios.find((u) => u.idusuarios === id) ?? null),

  // Empréstimos
  listEmprestimos: () => delay<Emprestimo[]>(mockEmprestimos),

  // Catálogos
  listAutores: () => delay<Autor[]>(mockAutores),
  listEditoras: () => delay<Editora[]>(mockEditoras),
  listFuncionarios: () => delay<Funcionario[]>(mockFuncionarios),

  // Atividades / dashboard
  recentActivity: () => delay(atividadeRecente),

  metrics: () =>
    delay({
      totalLivros: mockLivros.reduce((a, l) => a + l.quantidade_total, 0),
      titulosUnicos: mockLivros.length,
      emprestimosAtivos: mockEmprestimos.filter((e) => e.status !== "devolvido").length,
      atrasados: mockEmprestimos.filter((e) => e.status === "atrasado").length,
      devolvidos: mockEmprestimos.filter((e) => e.status === "devolvido").length,
      usuarios: mockUsuarios.length,
      funcionarios: mockFuncionarios.length,
    }),
};

export type LibraryAPIType = typeof LibraryAPI;
