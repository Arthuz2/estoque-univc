# StockFlow — Controle de Estoque

API REST em Flask para gerenciamento de produtos e movimentações de estoque, com uma interface web servida pelo próprio backend.

## Stack

- **Backend:** Python 3.12, Flask, Flask-SQLAlchemy, Flask-Migrate (Alembic)
- **Banco:** SQLite (via `DATABASE_URL`, trocável por Postgres/MySQL)
- **Frontend:** HTML + Bootstrap 5, jQuery e AJAX
- **Infra:** Docker

## Estrutura do projeto

```
.
├── run.py                  # ponto de entrada (cria e roda a app)
├── config.py               # configuração (DB, flags do SQLAlchemy)
├── src/
│   ├── __init__.py         # create_app(): registra blueprints e serve o front
│   ├── controllers/        # rotas HTTP (camada de API)
│   ├── services/           # regras de negócio
│   ├── repositories/       # acesso ao banco
│   ├── entity/             # modelos SQLAlchemy (Produto, Movimentacao, Entrada, Saida)
│   └── exceptions.py       # exceções de domínio
├── public/                 # frontend estático servido pelo Flask
│   ├── index.html
│   └── assets/
│       ├── js/             # api.js, app.js, produtos.js, movimentacao.js
│       └── styles/
├── migrations/             # migrations do Alembic (versionadas)
├── Dockerfile
├── docker-compose.yml
└── Makefile
```

### Camadas do backend

| Classe | Responsabilidade |
|--------|-----------------|
| `Produto` | Entidade de produto com atributos e comportamentos |
| `Movimentacao` | Classe base para movimentações de estoque (polimórfica) |
| `Entrada` | Movimentação que adiciona quantidade ao estoque |
| `Saida` | Movimentação que remove quantidade (valida estoque disponível) |
| `ProdutoRepository` | Acesso ao banco para produtos |
| `MovimentacaoRepository` | Acesso ao banco para movimentações |
| `ProdutoService` | Regras de negócio de produto |
| `MovimentacaoService` | Regras de negócio de movimentação |

## Como executar

### Primeira execução

```bash
make setup
```

Faz build, sobe o container e aplica as migrations já versionadas no banco (`flask db upgrade`).

### Execuções seguintes

```bash
make up      # sobe o container
make down    # para o container
make migrate # aplica migrations pendentes
```

Aplicação disponível em **http://localhost:5000** — a mesma origem serve tanto a interface web (raiz `/`) quanto a API (`/api/...`).

## Frontend

O diretório `public/` é servido pelo Flask, e a rota `/` entrega o `index.html`. Como o front e a API compartilham a mesma origem (`localhost:5000`), o JavaScript consome a API por caminhos **relativos** (`/api/...`) via `$.ajax`.

- `assets/js/api.js` — wrapper genérico de `$.ajax` (`BASE_URL = "/api"`)
- `assets/js/produtos.js` — chamadas de produtos (listar, criar, editar, excluir)
- `assets/js/movimentacao.js` — chamadas de movimentações (entrada, saída, histórico)
- `assets/js/app.js` — controla a UI (tabela, busca, modal de cadastro/edição)

Como o container roda com `debug=True` e monta o projeto por volume, editar arquivos em `public/` reflete direto no navegador (basta atualizar a página).

## Endpoints

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/produtos/` | Lista todos os produtos |
| `GET` | `/api/produtos/<id>` | Busca produto por ID |
| `POST` | `/api/produtos/` | Cadastra novo produto |
| `PUT` | `/api/produtos/<id>` | Atualiza produto |
| `DELETE` | `/api/produtos/<id>` | Remove produto |

### Movimentações

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/movimentacoes/` | Histórico completo |
| `GET` | `/api/movimentacoes/produto/<id>` | Histórico por produto |
| `POST` | `/api/movimentacoes/entrada` | Registra entrada no estoque |
| `POST` | `/api/movimentacoes/saida` | Registra saída do estoque |

## Exemplos de uso

### Cadastrar produto

```bash
curl -X POST http://localhost:5000/api/produtos/ \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teclado Mecânico", "preco": 299.90, "descricao": "Switch red", "quantidade": 10}'
```

```json
{
  "id": 1,
  "nome": "Teclado Mecânico",
  "descricao": "Switch red",
  "preco": 299.90,
  "quantidade": 10,
  "disponivel": true,
  "criado_em": "2026-06-14T12:00:00",
  "atualizado_em": "2026-06-14T12:00:00"
}
```

### Registrar entrada

```bash
curl -X POST http://localhost:5000/api/movimentacoes/entrada \
  -H "Content-Type: application/json" \
  -d '{"produto_id": 1, "quantidade": 5, "observacao": "Reposição de estoque"}'
```

```json
{
  "id": 1,
  "tipo": "entrada",
  "produto_id": 1,
  "quantidade": 5,
  "descricao": "Entrada de 5 unidade(s)",
  "observacao": "Reposição de estoque",
  "criado_em": "2026-06-14T12:01:00"
}
```

### Registrar saída

```bash
curl -X POST http://localhost:5000/api/movimentacoes/saida \
  -H "Content-Type: application/json" \
  -d '{"produto_id": 1, "quantidade": 3}'
```

### Saída com estoque insuficiente

```json
{
  "erro": "Estoque insuficiente: disponível 2, solicitado 3"
}
```

## Migrations

```bash
# Após alterar uma entidade, gerar nova migration:
make migration msg="add campo preco_custo em produto"

# Aplicar ao banco:
make migrate
```
