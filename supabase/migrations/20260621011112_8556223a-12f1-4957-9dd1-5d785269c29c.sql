GRANT INSERT, UPDATE, DELETE ON public.emprestimos TO anon;
CREATE POLICY "test_mode_anon_write_emprestimos" ON public.emprestimos FOR ALL TO anon USING (true) WITH CHECK (true);