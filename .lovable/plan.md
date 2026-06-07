## Objetivo
Transformar o Bibliotech em uma aplicação pronta para produção, com banco de dados real (Lovable Cloud / Postgres) e enriquecimento automático de livros via ISBN usando a Open Library API + Google Books (fallback), incluindo capas.

## 1. Habilitar Lovable Cloud
Ativa Postgres, Auth e Storage gerenciados. Necessário antes de qualquer migration.

## 2. Esquema do banco (migration SQL)
Tabelas em `public`, todas com RLS habilitada e GRANTs explícitos:

- `app_role` (enum): `admin`, `bibliotecario`, `professor`, `estudante`
- `turma` (enum): as 12 turmas do colégio
- `profiles` — espelho de `auth.users` (id, nome, email, turma?, tipo)
- `user_roles` (id, user_id, role) + função `has_role()` SECURITY DEFINER
- `autores` (id, nome, nacionalidade, data_nascimento, cpf?, email?)
- `editoras` (id, nome, cidade, pais, cnpj?)
- `livros` (id, isbn UNIQUE, nome, subtitulo, categoria, ano, paginas, sinopse, capa_url, quantidade_total, quantidade_disponivel, editora_id)
- `livros_autores` (livro_id, autor_id) — N:N
- `emprestimos` (id, usuario_id → profiles, livro_id, data_emprestimo, data_estimada, data_devolucao, status)
- Trigger `handle_new_user` que cria profile + role default `estudante` ao registrar

### Políticas RLS
- Leitura pública (anon + authenticated) em `livros`, `autores`, `editoras`, `livros_autores` (catálogo é público)
- `profiles`: usuário lê o próprio; bibliotecários/admins leem todos
- `user_roles`: usuário lê os próprios; admin gerencia
- `emprestimos`: estudante vê os próprios; bibliotecário/admin gerenciam tudo

## 3. Autenticação
- Página `/auth` (login + cadastro com email/senha)
- Rota `_authenticated` já existente protege tudo
- Auto-confirm de email habilitado para desenvolvimento

## 4. Integração ISBN → metadados + capa
Server function `lookupIsbn(isbn)`:
1. Tenta `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data`
2. Fallback `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}`
3. Capa: `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg` (ou `imageLinks.thumbnail` do Google)
4. Retorna `{ titulo, subtitulo, autores[], editora, ano, paginas, categoria, sinopse, capa_url }`

UI: na tela **Livros** → botão "Adicionar por ISBN" abre dialog, digita ISBN, preenche o form automaticamente, usuário confirma quantidade e salva no banco.

## 5. Server functions (substituem os mocks)
Em `src/lib/api/*.functions.ts`:
- `listLivros`, `getLivro`, `createLivro`, `updateLivroEstoque`, `lookupIsbn`
- `listUsuarios`, `getMeuPerfil`
- `listEmprestimos`, `criarEmprestimo`, `devolverEmprestimo`
- `metricsDashboard`, `rankingAlunos`, `rankingTurmas`

Usa `requireSupabaseAuth` para operações sensíveis; leitura de catálogo via `supabaseAdmin` em fn pública.

## 6. Refatoração das telas
Substituir todas as chamadas a `LibraryAPI` (mock) pelas server functions via TanStack Query. Telas afetadas: `dashboard`, `livros`, `usuarios`, `emprestimos`, `rankings`, `relatorios`, `pesquisa`.

`src/lib/mock-data.ts` → mantido apenas como **seed opcional** chamado uma única vez via botão "Popular dados de exemplo" (admin only), para você ter dados reais já no primeiro login.

## 7. Seed inicial real
Script SQL na própria migration insere:
- 12 turmas (enum)
- 1 usuário admin (criado depois via signup; role admin atribuída via SQL após primeiro login)
- Editoras e autores já conhecidos
- (Livros ficam vazios — você cadastra via ISBN, é a graça do sistema)

## 8. Detalhes técnicos
- Capas externas via `<img>` direto (Open Library serve com CORS)
- Sem armazenamento local de imagens (evita custo de Storage agora)
- Tipos TS regenerados a partir do schema Supabase
- Versão bump → `v2.1` no badge do sidebar

## Entregáveis
- Migration SQL completa
- 4-5 arquivos `*.functions.ts` novos
- Refator de 6 rotas para consumir dados reais
- Tela `/auth` funcional
- Diálogo "Adicionar livro por ISBN" em `/livros`
- App pronto para publicar

## Confirmação
Posso prosseguir com esse plano? Em particular, confirma:
1. **Auth por email/senha** (sem Google/Apple por enquanto)?
2. Primeiro usuário a se cadastrar vira **admin** automaticamente (prático para você subir em produção)?
