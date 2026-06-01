// =============================================================
// Domain types — derived from the conceptual ER model provided.
// Designed to map 1:1 with future SQL tables / Node.js models.
// =============================================================

export interface Autor {
  idAutor: number;
  nome: string;
  data_nascimento: string; // ISO date
  cpf: string;
  nacionalidade: string;
  email?: string;
}

export interface Editora {
  ideditora: number;
  nome: string;
  cidade: string;
  pais: string;
  cnpj: string;
}

export interface Livro {
  idLivros: number;
  nome: string;
  data_lancamento: string;
  categoria: string;
  isbn: string;
  quantidade_total: number;
  quantidade_disponivel: number;
  editora_ideditora: number;
  // joined / virtual:
  autores?: Autor[];
  editora?: Editora;
  capa_url?: string;
}

export type Turma =
  | "1 Informática" | "2 Informática" | "3 Informática"
  | "1 Administração" | "3 Administração"
  | "2 Finanças"
  | "1 Meio-Ambiente" | "2 Meio-Ambiente" | "3 Meio-Ambiente"
  | "1 Edificações" | "3 Edificações"
  | "2 Redes";

export interface Usuario {
  idusuarios: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  contato: string;
  email: string;
  idade: number;
  endereco: string;
  tipo: "estudante" | "professor" | "visitante";
  turma?: Turma;
  avatar_url?: string;
}

export interface Funcionario {
  idfuncionarios: number;
  nome: string;
  data_nascimento: string;
  cargo: "bibliotecario" | "administrador" | "assistente";
  idade: number;
  contato: string;
  email: string;
  avatar_url?: string;
}

export type StatusEmprestimo = "em_dia" | "atrasado" | "devolvido" | "renovado";

export interface Emprestimo {
  // composite key in DER: usuarios_idusuarios + Livros_idLivros + emprestimos
  id: string;
  usuarios_idusuarios: number;
  Livros_idLivros: number;
  emprestimos: number; // sequence per user/book
  data_emprestimo: string;
  data_estimada: string;
  data_devolucao?: string | null;
  status: StatusEmprestimo;
  // joined:
  usuario?: Usuario;
  livro?: Livro;
}
