import { jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { s as supabase } from "./client-thVVdJXN.js";
import "@supabase/supabase-js";
function IndexRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => {
      navigate({
        to: data.session ? "/dashboard" : "/auth",
        replace: true
      });
    });
  }, [navigate]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center text-sm text-muted-foreground", children: "Carregando..." });
}
export {
  IndexRedirect as component
};
