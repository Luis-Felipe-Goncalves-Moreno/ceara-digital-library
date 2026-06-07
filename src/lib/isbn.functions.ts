import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface IsbnLookupResult {
  isbn: string;
  titulo: string;
  subtitulo?: string;
  autores: string[];
  editora?: string;
  ano?: number;
  paginas?: number;
  categoria?: string;
  sinopse?: string;
  capa_url?: string;
  fonte: "openlibrary" | "googlebooks" | "none";
}

async function tryOpenLibrary(isbn: string): Promise<IsbnLookupResult | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, any>;
    const book = json[`ISBN:${isbn}`];
    if (!book) return null;
    return {
      isbn,
      titulo: book.title ?? "Sem título",
      subtitulo: book.subtitle,
      autores: (book.authors ?? []).map((a: any) => a.name).filter(Boolean),
      editora: book.publishers?.[0]?.name,
      ano: book.publish_date ? Number(String(book.publish_date).match(/\d{4}/)?.[0]) : undefined,
      paginas: book.number_of_pages,
      categoria: book.subjects?.[0]?.name,
      sinopse: book.notes ?? book.excerpts?.[0]?.text,
      capa_url:
        book.cover?.large ||
        book.cover?.medium ||
        `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
      fonte: "openlibrary",
    };
  } catch {
    return null;
  }
}

async function tryGoogleBooks(isbn: string): Promise<IsbnLookupResult | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
    );
    if (!res.ok) return null;
    const json = (await res.json()) as any;
    const item = json.items?.[0];
    if (!item) return null;
    const v = item.volumeInfo ?? {};
    return {
      isbn,
      titulo: v.title ?? "Sem título",
      subtitulo: v.subtitle,
      autores: v.authors ?? [],
      editora: v.publisher,
      ano: v.publishedDate ? Number(String(v.publishedDate).slice(0, 4)) : undefined,
      paginas: v.pageCount,
      categoria: v.categories?.[0],
      sinopse: v.description,
      capa_url: v.imageLinks?.thumbnail?.replace("http://", "https://"),
      fonte: "googlebooks",
    };
  } catch {
    return null;
  }
}

export const lookupIsbn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ isbn: z.string().min(8).max(20) }).parse(d))
  .handler(async ({ data }): Promise<IsbnLookupResult> => {
    const isbn = data.isbn.replace(/[^0-9Xx]/g, "");
    const r1 = await tryOpenLibrary(isbn);
    if (r1 && r1.autores.length > 0) return r1;
    const r2 = await tryGoogleBooks(isbn);
    if (r2) return { ...r2, capa_url: r2.capa_url ?? r1?.capa_url };
    if (r1) return r1;
    return {
      isbn,
      titulo: "",
      autores: [],
      capa_url: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
      fonte: "none",
    };
  });
