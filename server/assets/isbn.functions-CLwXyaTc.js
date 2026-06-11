import { c as createServerRpc } from "./createServerRpc-DEKA3yU_.js";
import { a as createServerFn } from "./server-kq0mmrF1.js";
import { z } from "zod";
import "node:async_hooks";
import "node:stream";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
async function tryOpenLibrary(isbn) {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    if (!res.ok) return null;
    const json = await res.json();
    const book = json[`ISBN:${isbn}`];
    if (!book) return null;
    return {
      isbn,
      titulo: book.title ?? "Sem título",
      subtitulo: book.subtitle,
      autores: (book.authors ?? []).map((a) => a.name).filter(Boolean),
      editora: book.publishers?.[0]?.name,
      ano: book.publish_date ? Number(String(book.publish_date).match(/\d{4}/)?.[0]) : void 0,
      paginas: book.number_of_pages,
      categoria: book.subjects?.[0]?.name,
      sinopse: book.notes ?? book.excerpts?.[0]?.text,
      capa_url: book.cover?.large || book.cover?.medium,
      fonte: "openlibrary"
    };
  } catch {
    return null;
  }
}
async function tryGoogleBooks(isbn) {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    if (!res.ok) return null;
    const json = await res.json();
    const item = json.items?.[0];
    if (!item) return null;
    const v = item.volumeInfo ?? {};
    return {
      isbn,
      titulo: v.title ?? "Sem título",
      subtitulo: v.subtitle,
      autores: v.authors ?? [],
      editora: v.publisher,
      ano: v.publishedDate ? Number(String(v.publishedDate).slice(0, 4)) : void 0,
      paginas: v.pageCount,
      categoria: v.categories?.[0],
      sinopse: v.description,
      capa_url: v.imageLinks?.thumbnail?.replace("http://", "https://"),
      fonte: "googlebooks"
    };
  } catch {
    return null;
  }
}
async function downloadImageAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return void 0;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 1e3) return void 0;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Erro ao baixar imagem da capa:", error);
    return void 0;
  }
}
const lookupIsbn_createServerFn_handler = createServerRpc({
  id: "f4dc482465e25c46e0259b5759cab3c929c7fe9aa6bbd5db365ff02233bf4fc8",
  name: "lookupIsbn",
  filename: "src/lib/isbn.functions.ts"
}, (opts) => lookupIsbn.__executeServer(opts));
const lookupIsbn = createServerFn({
  method: "POST"
}).inputValidator((d) => z.object({
  isbn: z.string().min(8).max(20)
}).parse(d)).handler(lookupIsbn_createServerFn_handler, async ({
  data
}) => {
  const isbn = data.isbn.replace(/[^0-9Xx]/g, "");
  const r1 = await tryOpenLibrary(isbn);
  let result;
  if (r1 && r1.autores.length > 0) {
    result = r1;
  } else {
    const r2 = await tryGoogleBooks(isbn);
    if (r2) {
      result = {
        ...r2,
        capa_url: r2.capa_url ?? r1?.capa_url
      };
    } else if (r1) {
      result = r1;
    } else {
      result = {
        isbn,
        titulo: "",
        autores: [],
        fonte: "none"
      };
    }
  }
  if (result.capa_url) {
    const base64 = await downloadImageAsBase64(result.capa_url);
    if (base64) {
      result.capa_url = base64;
    }
  }
  return result;
});
export {
  lookupIsbn_createServerFn_handler
};
