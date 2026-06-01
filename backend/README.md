# Backend — Node.js + Express (estrutura preparada)

Esta pasta contém o **esqueleto organizacional** do backend que será implementado
quando o banco de dados relacional (baseado no modelo conceitual fornecido pelo
professor) for refinado e materializado.

A arquitetura é a tradicional em camadas:

```
backend/
├── src/
│   ├── routes/         # Definição dos endpoints REST (Express Router)
│   ├── controllers/    # Recebem a request, validam, chamam o service
│   ├── services/       # Regras de negócio puras
│   ├── models/         # Modelos / entidades mapeadas para o banco
│   ├── validators/     # Schemas Zod / Joi para validação de input
│   ├── middlewares/    # Auth, logger, error handler
│   ├── config/         # Conexão com banco e variáveis de ambiente
│   └── server.ts       # Bootstrap do Express
└── package.json
```

## Mapeamento de endpoints planejados

| Recurso       | Endpoint base       | Métodos                   |
|---------------|---------------------|---------------------------|
| Livros        | `/api/livros`       | GET, POST, PUT, DELETE    |
| Autores       | `/api/autores`      | GET, POST, PUT, DELETE    |
| Editoras      | `/api/editoras`     | GET, POST, PUT, DELETE    |
| Usuários      | `/api/usuarios`     | GET, POST, PUT, DELETE    |
| Funcionários  | `/api/funcionarios` | GET, POST, PUT, DELETE    |
| Empréstimos   | `/api/emprestimos`  | GET, POST, PATCH (devolver/renovar) |
| Auth          | `/api/auth`         | POST `/login`, `/logout`  |

Enquanto o backend não está implementado, o frontend consome `src/lib/api/library.service.ts`
que devolve dados mockados. Para conectar ao backend real, basta substituir o corpo
dessas funções por chamadas `fetch()` aos endpoints acima.
