import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export const createUserAccount = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      nome: z.string(),
      role: z.enum(["admin", "estudante"]),
      turma: z.string().optional(),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "A chave SUPABASE_SERVICE_ROLE_KEY não está configurada no .env. Configure-a para poder criar contas pelo painel!"
      );
    }

    const adminAuthClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Criar o usuário através da API de Admin do Supabase
    const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Já cria com e-mail confirmado
      user_metadata: { nome: data.nome, turma: data.turma || null },
    });

    if (createError) throw new Error(createError.message);
    if (!newUser.user) throw new Error("Erro desconhecido ao criar usuário");

    // Inserir a role do usuário
    const { error: roleError } = await adminAuthClient
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: data.role });

    // Se falhar o insert por conflito, tenta dar update ou ignora (o admin pode já ter sido inserido se for o primeiro usuário)
    if (roleError && roleError.code !== "23505") { // 23505 = unique_violation
      throw new Error("Usuário criado, mas erro ao atribuir cargo: " + roleError.message);
    }

    return { success: true, userId: newUser.user.id };
  });
