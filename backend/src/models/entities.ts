// Entidades alinhadas ao modelo conceitual fornecido (DER em imagem).
// Estes tipos espelham os campos das tabelas e servem como contrato
// entre os Models (ORM) e os Controllers.

export interface Autor {
  idAutor: number;
  nome: string;
  data_nascimento: string;
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
}

export interface LivrosHasAutor {
  Livros_idLivros: number;
  Autor_idAutor: number;
}

export interface Usuario {
  idusuarios: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  contato: string;
  email: string;
  idade: number;
  endereco: string;
}

export interface Funcionario {
  idfuncionarios: number;
  nome: string;
  data_nascimento: string;
  cargo: string;
  idade: number;
  contato: string;
  email: string;
}

export interface UsuariosHasLivros {
  usuarios_idusuarios: number;
  Livros_idLivros: number;
  emprestimos: number;
  data_emprestimo: string;
  data_estimada: string;
  data_devolucao?: string | null;
}
