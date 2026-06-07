
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'bibliotecario', 'professor', 'estudante');
CREATE TYPE public.turma AS ENUM (
  '1 Informática','2 Informática','3 Informática',
  '1 Administração','3 Administração',
  '2 Finanças',
  '1 Meio-Ambiente','2 Meio-Ambiente','3 Meio-Ambiente',
  '1 Edificações','3 Edificações',
  '2 Redes'
);
CREATE TYPE public.status_emprestimo AS ENUM ('em_dia','atrasado','devolvido','renovado');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ============ profiles ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  turma public.turma,
  matricula TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ user_roles ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','bibliotecario')
  )
$$;

-- Policies for profiles / user_roles
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "profiles self insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "roles self read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "roles admin manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ Auto-create profile + role on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_first BOOLEAN;
  v_turma public.turma;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles) INTO is_first;

  BEGIN
    v_turma := (NEW.raw_user_meta_data->>'turma')::public.turma;
  EXCEPTION WHEN OTHERS THEN v_turma := NULL;
  END;

  INSERT INTO public.profiles (id, nome, email, turma, matricula)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email,'@',1)),
    NEW.email,
    v_turma,
    NEW.raw_user_meta_data->>'matricula'
  );

  IF is_first THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin');
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'bibliotecario');
  ELSE
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'estudante');
  END IF;

  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ autores ============
CREATE TABLE public.autores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  data_nascimento DATE,
  nacionalidade TEXT,
  cpf TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.autores TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.autores TO authenticated;
GRANT ALL ON public.autores TO service_role;
ALTER TABLE public.autores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "autores read all" ON public.autores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "autores staff write" ON public.autores FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ editoras ============
CREATE TABLE public.editoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cidade TEXT,
  pais TEXT,
  cnpj TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.editoras TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.editoras TO authenticated;
GRANT ALL ON public.editoras TO service_role;
ALTER TABLE public.editoras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editoras read all" ON public.editoras FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "editoras staff write" ON public.editoras FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ livros ============
CREATE TABLE public.livros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  subtitulo TEXT,
  categoria TEXT,
  ano INTEGER,
  paginas INTEGER,
  sinopse TEXT,
  capa_url TEXT,
  quantidade_total INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_total >= 0),
  quantidade_disponivel INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_disponivel >= 0),
  editora_id UUID REFERENCES public.editoras(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.livros TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.livros TO authenticated;
GRANT ALL ON public.livros TO service_role;
ALTER TABLE public.livros ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER livros_updated BEFORE UPDATE ON public.livros FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "livros read all" ON public.livros FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "livros staff write" ON public.livros FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ livros_autores ============
CREATE TABLE public.livros_autores (
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES public.autores(id) ON DELETE CASCADE,
  PRIMARY KEY (livro_id, autor_id)
);
GRANT SELECT ON public.livros_autores TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.livros_autores TO authenticated;
GRANT ALL ON public.livros_autores TO service_role;
ALTER TABLE public.livros_autores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "la read all" ON public.livros_autores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "la staff write" ON public.livros_autores FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ emprestimos ============
CREATE TABLE public.emprestimos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  livro_id UUID NOT NULL REFERENCES public.livros(id) ON DELETE RESTRICT,
  data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
  data_estimada DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  data_devolucao DATE,
  status public.status_emprestimo NOT NULL DEFAULT 'em_dia',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emprestimos TO authenticated;
GRANT ALL ON public.emprestimos TO service_role;
ALTER TABLE public.emprestimos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER emp_updated BEFORE UPDATE ON public.emprestimos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX emp_usuario_idx ON public.emprestimos(usuario_id);
CREATE INDEX emp_livro_idx ON public.emprestimos(livro_id);
CREATE INDEX emp_status_idx ON public.emprestimos(status);

CREATE POLICY "emp self read" ON public.emprestimos FOR SELECT TO authenticated
  USING (usuario_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "emp staff write" ON public.emprestimos FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ Estoque automático ============
CREATE OR REPLACE FUNCTION public.adjust_stock_on_emprestimo()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.livros SET quantidade_disponivel = quantidade_disponivel - 1
      WHERE id = NEW.livro_id AND quantidade_disponivel > 0;
    IF NOT FOUND THEN RAISE EXCEPTION 'Sem exemplares disponíveis'; END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status <> 'devolvido' AND NEW.status = 'devolvido' THEN
      UPDATE public.livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = NEW.livro_id;
    ELSIF OLD.status = 'devolvido' AND NEW.status <> 'devolvido' THEN
      UPDATE public.livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = NEW.livro_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.status <> 'devolvido' THEN
      UPDATE public.livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = OLD.livro_id;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER emp_stock_trg
AFTER INSERT OR UPDATE OR DELETE ON public.emprestimos
FOR EACH ROW EXECUTE FUNCTION public.adjust_stock_on_emprestimo();
