
GRANT INSERT, UPDATE, DELETE ON public.livros TO anon;
GRANT INSERT, UPDATE, DELETE ON public.autores TO anon;
GRANT INSERT, UPDATE, DELETE ON public.editoras TO anon;
GRANT INSERT, UPDATE, DELETE ON public.livros_autores TO anon;

CREATE POLICY "test_mode_anon_write_livros" ON public.livros FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "test_mode_anon_write_autores" ON public.autores FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "test_mode_anon_write_editoras" ON public.editoras FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "test_mode_anon_write_livros_autores" ON public.livros_autores FOR ALL TO anon USING (true) WITH CHECK (true);
