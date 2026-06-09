
-- Modo teste: permitir leitura pública (anon) das tabelas do acervo para visualização sem login.
GRANT SELECT ON public.livros TO anon;
GRANT SELECT ON public.autores TO anon;
GRANT SELECT ON public.editoras TO anon;
GRANT SELECT ON public.livros_autores TO anon;
GRANT SELECT ON public.emprestimos TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.user_roles TO anon;

CREATE POLICY "test_mode_anon_read_livros" ON public.livros FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_autores" ON public.autores FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_editoras" ON public.editoras FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_livros_autores" ON public.livros_autores FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_emprestimos" ON public.emprestimos FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_profiles" ON public.profiles FOR SELECT TO anon USING (true);
CREATE POLICY "test_mode_anon_read_user_roles" ON public.user_roles FOR SELECT TO anon USING (true);
