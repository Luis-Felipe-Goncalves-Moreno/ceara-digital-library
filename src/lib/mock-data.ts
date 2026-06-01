import type { Autor, Editora, Livro, Usuario, Funcionario, Emprestimo } from "./types";

export const autores: Autor[] = [
  { idAutor: 1, nome: "Rachel de Queiroz", data_nascimento: "1910-11-17", cpf: "111.222.333-44", nacionalidade: "Brasileira", email: "rachel@academia.br" },
  { idAutor: 2, nome: "José de Alencar", data_nascimento: "1829-05-01", cpf: "222.333.444-55", nacionalidade: "Brasileira" },
  { idAutor: 3, nome: "Patativa do Assaré", data_nascimento: "1909-03-05", cpf: "333.444.555-66", nacionalidade: "Brasileira" },
  { idAutor: 4, nome: "Machado de Assis", data_nascimento: "1839-06-21", cpf: "444.555.666-77", nacionalidade: "Brasileira" },
  { idAutor: 5, nome: "Clarice Lispector", data_nascimento: "1920-12-10", cpf: "555.666.777-88", nacionalidade: "Brasileira" },
  { idAutor: 6, nome: "Yuval Noah Harari", data_nascimento: "1976-02-24", cpf: "666.777.888-99", nacionalidade: "Israelense" },
];

export const editoras: Editora[] = [
  { ideditora: 1, nome: "Editora Ceará", cidade: "Fortaleza", pais: "Brasil", cnpj: "12.345.678/0001-90" },
  { ideditora: 2, nome: "Companhia das Letras", cidade: "São Paulo", pais: "Brasil", cnpj: "23.456.789/0001-12" },
  { ideditora: 3, nome: "Record", cidade: "Rio de Janeiro", pais: "Brasil", cnpj: "34.567.890/0001-23" },
  { ideditora: 4, nome: "Harper Collins", cidade: "Nova York", pais: "EUA", cnpj: "45.678.901/0001-34" },
];

export const livros: Livro[] = [
  { idLivros: 1, nome: "O Quinze", data_lancamento: "1930-01-01", categoria: "Romance", isbn: "978-85-01-00001-1", quantidade_total: 12, quantidade_disponivel: 7, editora_ideditora: 1, autores: [autores[0]], editora: editoras[0] },
  { idLivros: 2, nome: "Iracema", data_lancamento: "1865-01-01", categoria: "Romance", isbn: "978-85-01-00002-2", quantidade_total: 8, quantidade_disponivel: 3, editora_ideditora: 2, autores: [autores[1]], editora: editoras[1] },
  { idLivros: 3, nome: "Cante Lá Que Eu Canto Cá", data_lancamento: "1978-01-01", categoria: "Poesia", isbn: "978-85-01-00003-3", quantidade_total: 6, quantidade_disponivel: 6, editora_ideditora: 1, autores: [autores[2]], editora: editoras[0] },
  { idLivros: 4, nome: "Dom Casmurro", data_lancamento: "1899-01-01", categoria: "Romance", isbn: "978-85-01-00004-4", quantidade_total: 15, quantidade_disponivel: 10, editora_ideditora: 3, autores: [autores[3]], editora: editoras[2] },
  { idLivros: 5, nome: "A Hora da Estrela", data_lancamento: "1977-01-01", categoria: "Ficção", isbn: "978-85-01-00005-5", quantidade_total: 10, quantidade_disponivel: 4, editora_ideditora: 2, autores: [autores[4]], editora: editoras[1] },
  { idLivros: 6, nome: "Sapiens", data_lancamento: "2011-01-01", categoria: "História", isbn: "978-85-01-00006-6", quantidade_total: 20, quantidade_disponivel: 12, editora_ideditora: 4, autores: [autores[5]], editora: editoras[3] },
  { idLivros: 7, nome: "Memórias Póstumas de Brás Cubas", data_lancamento: "1881-01-01", categoria: "Romance", isbn: "978-85-01-00007-7", quantidade_total: 9, quantidade_disponivel: 0, editora_ideditora: 3, autores: [autores[3]], editora: editoras[2] },
  { idLivros: 8, nome: "Homo Deus", data_lancamento: "2016-01-01", categoria: "História", isbn: "978-85-01-00008-8", quantidade_total: 11, quantidade_disponivel: 8, editora_ideditora: 4, autores: [autores[5]], editora: editoras[3] },
];

export const usuarios: Usuario[] = [
  { idusuarios: 1, nome: "Ana Beatriz Lima", data_nascimento: "2003-04-12", cpf: "111.111.111-11", contato: "(85) 99111-0001", email: "ana.lima@ifce.edu.br", idade: 21, endereco: "Rua Pedro Pereira, 100 — Fortaleza/CE", tipo: "estudante" },
  { idusuarios: 2, nome: "Carlos Eduardo Sousa", data_nascimento: "1985-08-22", cpf: "222.222.222-22", contato: "(85) 99111-0002", email: "carlos.sousa@ifce.edu.br", idade: 39, endereco: "Av. Beira-Mar, 2200 — Fortaleza/CE", tipo: "professor" },
  { idusuarios: 3, nome: "Mariana Albuquerque", data_nascimento: "2002-01-30", cpf: "333.333.333-33", contato: "(85) 99111-0003", email: "mariana.a@ifce.edu.br", idade: 22, endereco: "Rua Major Facundo, 88 — Fortaleza/CE", tipo: "estudante" },
  { idusuarios: 4, nome: "João Vitor Mendes", data_nascimento: "2001-09-09", cpf: "444.444.444-44", contato: "(85) 99111-0004", email: "joao.mendes@ifce.edu.br", idade: 23, endereco: "Rua Senador Pompeu, 500 — Fortaleza/CE", tipo: "estudante" },
  { idusuarios: 5, nome: "Patrícia Holanda", data_nascimento: "1979-11-02", cpf: "555.555.555-55", contato: "(85) 99111-0005", email: "patricia.h@ifce.edu.br", idade: 45, endereco: "Rua dos Tabajaras, 12 — Fortaleza/CE", tipo: "professor" },
  { idusuarios: 6, nome: "Lucas Fernandes", data_nascimento: "2004-06-18", cpf: "666.666.666-66", contato: "(85) 99111-0006", email: "lucas.f@ifce.edu.br", idade: 20, endereco: "Rua Padre Mororó, 33 — Fortaleza/CE", tipo: "estudante" },
];

export const funcionarios: Funcionario[] = [
  { idfuncionarios: 1, nome: "Renata Cavalcante", data_nascimento: "1988-03-14", cargo: "bibliotecario", idade: 36, contato: "(85) 98800-1001", email: "renata.c@biblioteca.ce.gov.br" },
  { idfuncionarios: 2, nome: "Felipe Castro", data_nascimento: "1982-07-25", cargo: "administrador", idade: 42, contato: "(85) 98800-1002", email: "felipe.castro@biblioteca.ce.gov.br" },
  { idfuncionarios: 3, nome: "Juliana Maia", data_nascimento: "1995-12-01", cargo: "assistente", idade: 28, contato: "(85) 98800-1003", email: "juliana.maia@biblioteca.ce.gov.br" },
];

const today = new Date();
const d = (offsetDays: number) => {
  const x = new Date(today); x.setDate(x.getDate() + offsetDays); return x.toISOString().slice(0, 10);
};

export const emprestimos: Emprestimo[] = [
  { id: "E-0001", usuarios_idusuarios: 1, Livros_idLivros: 1, emprestimos: 1, data_emprestimo: d(-5), data_estimada: d(9), status: "em_dia", usuario: usuarios[0], livro: livros[0] },
  { id: "E-0002", usuarios_idusuarios: 2, Livros_idLivros: 6, emprestimos: 1, data_emprestimo: d(-20), data_estimada: d(-6), status: "atrasado", usuario: usuarios[1], livro: livros[5] },
  { id: "E-0003", usuarios_idusuarios: 3, Livros_idLivros: 4, emprestimos: 1, data_emprestimo: d(-2), data_estimada: d(12), status: "em_dia", usuario: usuarios[2], livro: livros[3] },
  { id: "E-0004", usuarios_idusuarios: 4, Livros_idLivros: 5, emprestimos: 1, data_emprestimo: d(-30), data_estimada: d(-16), data_devolucao: d(-15), status: "devolvido", usuario: usuarios[3], livro: livros[4] },
  { id: "E-0005", usuarios_idusuarios: 5, Livros_idLivros: 8, emprestimos: 1, data_emprestimo: d(-10), data_estimada: d(4), status: "em_dia", usuario: usuarios[4], livro: livros[7] },
  { id: "E-0006", usuarios_idusuarios: 6, Livros_idLivros: 2, emprestimos: 1, data_emprestimo: d(-25), data_estimada: d(-11), status: "atrasado", usuario: usuarios[5], livro: livros[1] },
  { id: "E-0007", usuarios_idusuarios: 1, Livros_idLivros: 7, emprestimos: 2, data_emprestimo: d(-45), data_estimada: d(-31), data_devolucao: d(-30), status: "devolvido", usuario: usuarios[0], livro: livros[6] },
  { id: "E-0008", usuarios_idusuarios: 3, Livros_idLivros: 6, emprestimos: 2, data_emprestimo: d(-1), data_estimada: d(13), status: "em_dia", usuario: usuarios[2], livro: livros[5] },
];

export const atividadeRecente = [
  { id: 1, tipo: "emprestimo", texto: "Mariana Albuquerque retirou Dom Casmurro", quando: "há 12 min" },
  { id: 2, tipo: "devolucao", texto: "João Vitor devolveu A Hora da Estrela", quando: "há 1 h" },
  { id: 3, tipo: "cadastro", texto: "Novo livro cadastrado: Homo Deus", quando: "há 3 h" },
  { id: 4, tipo: "atraso", texto: "Empréstimo E-0002 entrou em atraso", quando: "ontem" },
  { id: 5, tipo: "usuario", texto: "Lucas Fernandes atualizou contato", quando: "ontem" },
];
