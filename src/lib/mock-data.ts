import type { Autor, Editora, Livro, Usuario, Funcionario, Emprestimo, Turma } from "./types";

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

export const TURMAS: Turma[] = [
  "1 Informática", "2 Informática", "3 Informática",
  "1 Administração", "3 Administração",
  "2 Finanças",
  "1 Meio-Ambiente", "2 Meio-Ambiente", "3 Meio-Ambiente",
  "1 Edificações", "3 Edificações",
  "2 Redes",
];

// Realistic student roster across the 12 classes (4-6 students per class)
const studentSeeds: Array<[string, Turma]> = [
  ["Ana Beatriz Lima", "1 Informática"],
  ["Lucas Fernandes Rocha", "1 Informática"],
  ["Marina Cordeiro", "1 Informática"],
  ["Pedro Henrique Sousa", "1 Informática"],
  ["Camila Vieira", "2 Informática"],
  ["Rafael Tavares", "2 Informática"],
  ["Beatriz Nogueira", "2 Informática"],
  ["Thiago Bezerra", "2 Informática"],
  ["Mariana Albuquerque", "3 Informática"],
  ["João Vitor Mendes", "3 Informática"],
  ["Larissa Pontes", "3 Informática"],
  ["Gustavo Almeida", "3 Informática"],
  ["Isabela Cunha", "3 Informática"],
  ["Felipe Carvalho", "1 Administração"],
  ["Júlia Moreira", "1 Administração"],
  ["Rodrigo Pinheiro", "1 Administração"],
  ["Amanda Sales", "1 Administração"],
  ["Vinícius Braga", "3 Administração"],
  ["Letícia Farias", "3 Administração"],
  ["Bruno Cavalcante", "3 Administração"],
  ["Patrícia Holanda", "3 Administração"],
  ["Eduardo Maia", "2 Finanças"],
  ["Sofia Ribeiro", "2 Finanças"],
  ["Henrique Castro", "2 Finanças"],
  ["Yasmin Coelho", "2 Finanças"],
  ["Diego Lacerda", "1 Meio-Ambiente"],
  ["Helena Aragão", "1 Meio-Ambiente"],
  ["Matheus Diniz", "1 Meio-Ambiente"],
  ["Clara Bandeira", "1 Meio-Ambiente"],
  ["Otávio Lemos", "2 Meio-Ambiente"],
  ["Natália Vasconcelos", "2 Meio-Ambiente"],
  ["Renan Magalhães", "2 Meio-Ambiente"],
  ["Bianca Tomé", "2 Meio-Ambiente"],
  ["Igor Moura", "3 Meio-Ambiente"],
  ["Carolina Pessoa", "3 Meio-Ambiente"],
  ["André Saraiva", "3 Meio-Ambiente"],
  ["Sabrina Quintela", "3 Meio-Ambiente"],
  ["Murilo Teixeira", "1 Edificações"],
  ["Tatiana Brito", "1 Edificações"],
  ["Caio Lobo", "1 Edificações"],
  ["Daniela Furtado", "1 Edificações"],
  ["Leandro Pimenta", "3 Edificações"],
  ["Aline Bastos", "3 Edificações"],
  ["Marcos Vinícius Paiva", "3 Edificações"],
  ["Priscila Macedo", "3 Edificações"],
  ["Arthur Sampaio", "2 Redes"],
  ["Júnior Holanda", "2 Redes"],
  ["Vanessa Coutinho", "2 Redes"],
  ["Erick Damasceno", "2 Redes"],
];

const cpf = (n: number) => {
  const s = String(n).padStart(11, "0");
  return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`;
};
const slugEmail = (nome: string) =>
  nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, "").trim().split(/\s+/).slice(0, 2).join(".");

export const usuarios: Usuario[] = [
  ...studentSeeds.map<Usuario>(([nome, turma], i) => ({
    idusuarios: i + 1,
    nome,
    data_nascimento: `200${3 + (i % 5)}-0${1 + (i % 9)}-1${i % 9}`,
    cpf: cpf(11111111111 + i * 1234567),
    contato: `(85) 99${String(100 + i).padStart(3, "0")}-${String(1000 + i).padStart(4, "0")}`,
    email: `${slugEmail(nome)}@ifce.edu.br`,
    idade: 15 + (i % 5),
    endereco: "Fortaleza/CE",
    tipo: "estudante",
    turma,
  })),
  // Professores
  { idusuarios: 101, nome: "Carlos Eduardo Sousa", data_nascimento: "1985-08-22", cpf: "222.222.222-22", contato: "(85) 99111-0102", email: "carlos.sousa@ifce.edu.br", idade: 39, endereco: "Fortaleza/CE", tipo: "professor" },
  { idusuarios: 102, nome: "Renata Cavalcante Albuquerque", data_nascimento: "1979-11-02", cpf: "555.555.555-55", contato: "(85) 99111-0105", email: "renata.albuquerque@ifce.edu.br", idade: 45, endereco: "Fortaleza/CE", tipo: "professor" },
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

// Deterministic pseudo-random for reproducible mock
function seeded(n: number) { return (Math.sin(n) * 10000) % 1; }

// Generate empréstimos so each student has a varying count (1..14)
const generated: Emprestimo[] = [];
let empSeq = 1;
usuarios.filter((u) => u.tipo === "estudante").forEach((u, idx) => {
  const count = 1 + Math.floor(Math.abs(seeded(idx + 1)) * 14); // 1..14
  for (let k = 0; k < count; k++) {
    const livro = livros[(idx + k) % livros.length];
    const offset = -(3 + ((idx * 7 + k * 11) % 60));
    const status = k === 0 && idx % 9 === 0 ? "atrasado" : k % 3 === 2 ? "devolvido" : "em_dia";
    generated.push({
      id: `E-${String(empSeq++).padStart(4, "0")}`,
      usuarios_idusuarios: u.idusuarios,
      Livros_idLivros: livro.idLivros,
      emprestimos: k + 1,
      data_emprestimo: d(offset),
      data_estimada: d(offset + 14),
      data_devolucao: status === "devolvido" ? d(offset + 10) : undefined,
      status,
      usuario: u,
      livro,
    });
  }
});

export const emprestimos: Emprestimo[] = generated;

export const atividadeRecente = [
  { id: 1, tipo: "emprestimo", texto: "Mariana Albuquerque retirou Dom Casmurro", quando: "há 12 min" },
  { id: 2, tipo: "devolucao", texto: "João Vitor devolveu A Hora da Estrela", quando: "há 1 h" },
  { id: 3, tipo: "cadastro", texto: "Novo livro cadastrado: Homo Deus", quando: "há 3 h" },
  { id: 4, tipo: "atraso", texto: "Empréstimo de Lucas Fernandes entrou em atraso", quando: "ontem" },
  { id: 5, tipo: "usuario", texto: "Camila Vieira atualizou contato", quando: "ontem" },
];
