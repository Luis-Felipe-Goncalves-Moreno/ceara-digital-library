import { c as createServerRpc } from "./createServerRpc-DEKA3yU_.js";
import { a as createServerFn } from "./server-kq0mmrF1.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import "node:async_hooks";
import "node:stream";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
const createUserAccount_createServerFn_handler = createServerRpc({
  id: "9f4cccad096f8a3353ec88a2b7e2de3316155b18cc0a12d4decd2198c0b7bd40",
  name: "createUserAccount",
  filename: "src/lib/admin.functions.ts"
}, (opts) => createUserAccount.__executeServer(opts));
const createUserAccount = createServerFn({
  method: "POST"
}).inputValidator((d) => z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nome: z.string(),
  role: z.enum(["admin", "estudante"]),
  turma: z.string().optional()
}).parse(d)).handler(createUserAccount_createServerFn_handler, async ({
  data
}) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("A chave SUPABASE_SERVICE_ROLE_KEY não está configurada no .env. Configure-a para poder criar contas pelo painel!");
  }
  const adminAuthClient = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  const {
    data: newUser,
    error: createError
  } = await adminAuthClient.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    // Já cria com e-mail confirmado
    user_metadata: {
      nome: data.nome,
      turma: data.turma || null
    }
  });
  if (createError) throw new Error(createError.message);
  if (!newUser.user) throw new Error("Erro desconhecido ao criar usuário");
  const {
    error: roleError
  } = await adminAuthClient.from("user_roles").insert({
    user_id: newUser.user.id,
    role: data.role
  });
  if (roleError && roleError.code !== "23505") {
    throw new Error("Usuário criado, mas erro ao atribuir cargo: " + roleError.message);
  }
  return {
    success: true,
    userId: newUser.user.id
  };
});
export {
  createUserAccount_createServerFn_handler
};
