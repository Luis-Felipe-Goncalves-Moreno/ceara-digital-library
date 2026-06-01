// Exemplo de controller (esqueleto). Implementar quando o banco estiver pronto.
//
// import { Request, Response, NextFunction } from "express";
// import { LivrosService } from "../services/livros.service";
//
// export const LivrosController = {
//   list: async (_req: Request, res: Response, next: NextFunction) => {
//     try { res.json(await LivrosService.list()); } catch (e) { next(e); }
//   },
//   getById: async (req: Request, res: Response, next: NextFunction) => {
//     try { res.json(await LivrosService.getById(Number(req.params.id))); } catch (e) { next(e); }
//   },
//   create: async (req: Request, res: Response, next: NextFunction) => {
//     try { res.status(201).json(await LivrosService.create(req.body)); } catch (e) { next(e); }
//   },
//   update: async (req: Request, res: Response, next: NextFunction) => {
//     try { res.json(await LivrosService.update(Number(req.params.id), req.body)); } catch (e) { next(e); }
//   },
//   remove: async (req: Request, res: Response, next: NextFunction) => {
//     try { res.status(204).end(await LivrosService.remove(Number(req.params.id))); } catch (e) { next(e); }
//   },
// };

export {};
