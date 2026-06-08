-- =========================================================
-- DUMP DE DADOS FICTÍCIOS PARA TESTES DO SISTEMA
-- Copie e cole no SQL Editor do seu Supabase
-- =========================================================

-- 1. Inserindo Editoras
INSERT INTO public.editoras (id, nome, cidade, pais, cnpj) VALUES 
('11111111-1111-1111-1111-111111111111', 'Editora Ceará', 'Fortaleza', 'Brasil', '12.345.678/0001-90'),
('22222222-2222-2222-2222-222222222222', 'Companhia das Letras', 'São Paulo', 'Brasil', '23.456.789/0001-12'),
('33333333-3333-3333-3333-333333333333', 'Record', 'Rio de Janeiro', 'Brasil', '34.567.890/0001-23'),
('44444444-4444-4444-4444-444444444444', 'Harper Collins', 'Nova York', 'EUA', '45.678.901/0001-34');

-- 2. Inserindo Autores
INSERT INTO public.autores (id, nome, data_nascimento, nacionalidade, cpf) VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rachel de Queiroz', '1910-11-17', 'Brasileira', '111.222.333-44'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'José de Alencar', '1829-05-01', 'Brasileira', '222.333.444-55'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Patativa do Assaré', '1909-03-05', 'Brasileira', '333.444.555-66'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Machado de Assis', '1839-06-21', 'Brasileira', '444.555.666-77'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Clarice Lispector', '1920-12-10', 'Brasileira', '555.666.777-88'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Yuval Noah Harari', '1976-02-24', 'Israelense', '666.777.888-99');

-- 3. Inserindo Livros
INSERT INTO public.livros (id, isbn, nome, categoria, ano, quantidade_total, quantidade_disponivel, editora_id) VALUES 
('10000000-0000-0000-0000-000000000001', '978-85-01-00001-1', 'O Quinze', 'Romance', 1930, 12, 12, '11111111-1111-1111-1111-111111111111'),
('10000000-0000-0000-0000-000000000002', '978-85-01-00002-2', 'Iracema', 'Romance', 1865, 8, 8, '22222222-2222-2222-2222-222222222222'),
('10000000-0000-0000-0000-000000000003', '978-85-01-00003-3', 'Cante Lá Que Eu Canto Cá', 'Poesia', 1978, 6, 6, '11111111-1111-1111-1111-111111111111'),
('10000000-0000-0000-0000-000000000004', '978-85-01-00004-4', 'Dom Casmurro', 'Romance', 1899, 15, 15, '33333333-3333-3333-3333-333333333333'),
('10000000-0000-0000-0000-000000000005', '978-85-01-00005-5', 'A Hora da Estrela', 'Ficção', 1977, 10, 10, '22222222-2222-2222-2222-222222222222'),
('10000000-0000-0000-0000-000000000006', '978-85-01-00006-6', 'Sapiens', 'História', 2011, 20, 20, '44444444-4444-4444-4444-444444444444'),
('10000000-0000-0000-0000-000000000007', '978-85-01-00007-7', 'Memórias Póstumas de Brás Cubas', 'Romance', 1881, 9, 9, '33333333-3333-3333-3333-333333333333'),
('10000000-0000-0000-0000-000000000008', '978-85-01-00008-8', 'Homo Deus', 'História', 2016, 11, 11, '44444444-4444-4444-4444-444444444444');

-- 4. Relacionando Livros aos Autores
INSERT INTO public.livros_autores (livro_id, autor_id) VALUES 
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('10000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
('10000000-0000-0000-0000-000000000003', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),
('10000000-0000-0000-0000-000000000004', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('10000000-0000-0000-0000-000000000005', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
('10000000-0000-0000-0000-000000000006', 'ffffffff-ffff-ffff-ffff-ffffffffffff'),
('10000000-0000-0000-0000-000000000007', 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
('10000000-0000-0000-0000-000000000008', 'ffffffff-ffff-ffff-ffff-ffffffffffff');
