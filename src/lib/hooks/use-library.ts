import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

// ============ Auth ============
export interface SessionState {
  user: User | null;
  profile: { id: string; nome: string; email: string; turma: string | null; matricula: string | null; avatar_url: string | null } | null;
  roles: string[];
  loading: boolean;
}

export function useSession(): SessionState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });
  const rolesQ = useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      return (data ?? []).map((r) => r.role as string);
    },
  });

  return { user, profile: profileQ.data ?? null, roles: rolesQ.data ?? [], loading };
}

export function isStaff(roles: string[]) {
  // Modo teste: sem login, libera ações de staff (admin/bibliotecário).
  if (!roles || roles.length === 0) return true;
  return roles.includes("admin") || roles.includes("bibliotecario");
}

// ============ Livros ============
export function useLivros() {
  return useQuery({
    queryKey: ["livros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livros")
        .select("*, editora:editoras(*), livros_autores(autor:autores(*))")
        .order("nome");
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        ...l,
        autores: (l.livros_autores ?? []).map((la: any) => la.autor).filter(Boolean),
      }));
    },
  });
}

export function useCreateLivro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      isbn: string;
      nome: string;
      subtitulo?: string;
      categoria?: string;
      ano?: number;
      paginas?: number;
      sinopse?: string;
      capa_url?: string;
      quantidade_total: number;
      editora_nome?: string;
      autores_nomes: string[];
    }) => {
      let editora_id: string | null = null;
      if (input.editora_nome) {
        const { data: ex } = await supabase.from("editoras").select("id").eq("nome", input.editora_nome).maybeSingle();
        if (ex) editora_id = ex.id;
        else {
          const { data: ne, error } = await supabase.from("editoras").insert({ nome: input.editora_nome }).select("id").single();
          if (error) throw error;
          editora_id = ne.id;
        }
      }

      const { data: livro, error: lErr } = await supabase
        .from("livros")
        .insert({
          isbn: input.isbn,
          nome: input.nome,
          subtitulo: input.subtitulo,
          categoria: input.categoria,
          ano: input.ano,
          paginas: input.paginas,
          sinopse: input.sinopse,
          capa_url: input.capa_url,
          quantidade_total: input.quantidade_total,
          quantidade_disponivel: input.quantidade_total,
          editora_id,
        })
        .select("*")
        .single();
      if (lErr) throw lErr;

      for (const nome of input.autores_nomes) {
        let autor_id: string;
        const { data: ex } = await supabase.from("autores").select("id").eq("nome", nome).maybeSingle();
        if (ex) autor_id = ex.id;
        else {
          const { data: na, error } = await supabase.from("autores").insert({ nome }).select("id").single();
          if (error) throw error;
          autor_id = na.id;
        }
        await supabase.from("livros_autores").insert({ livro_id: livro.id, autor_id });
      }
      return livro;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["livros"] }),
  });
}

export function useDeleteLivro() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("livros").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["livros"] }),
  });
}

// ============ Empréstimos ============
export function useEmprestimos() {
  return useQuery({
    queryKey: ["emprestimos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emprestimos")
        .select("*, usuario:profiles(*), livro:livros(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCriarEmprestimo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { usuario_id: string; livro_id: string; dias?: number }) => {
      const dataEst = new Date();
      dataEst.setDate(dataEst.getDate() + (input.dias ?? 14));
      const { error } = await supabase.from("emprestimos").insert({
        usuario_id: input.usuario_id,
        livro_id: input.livro_id,
        data_estimada: dataEst.toISOString().slice(0, 10),
        status: "em_dia",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
    },
  });
}

export function useDevolverEmprestimo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("emprestimos")
        .update({ status: "devolvido", data_devolucao: new Date().toISOString().slice(0, 10) })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emprestimos"] });
      qc.invalidateQueries({ queryKey: ["livros"] });
    },
  });
}

// ============ Usuários ============
export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("nome");
      if (error) throw error;
      return data ?? [];
    },
  });
}
