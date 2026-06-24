### Classes e objetos

| Classe | Responsabilidade |
|--------|-----------------|
| `Produto` | Entidade de produto com atributos e comportamentos |
| `Movimentacao` | Classe base abstrata para movimentações de estoque |
| `Entrada` | Movimentação que adiciona quantidade ao estoque |
| `Saida` | Movimentação que remove quantidade do estoque |
| `ProdutoRepository` | Acesso ao banco para produtos |
| `MovimentacaoRepository` | Acesso ao banco para movimentações |
| `ProdutoService` | Regras de negócio de produto |
| `MovimentacaoService` | Regras de negócio de movimentação |

## Como executar

### Primeira execução

```bash
make setup
```

Esse comando faz build, sobe o container, inicializa as migrations e aplica no banco.

### Execuções seguintes

```bash
make up      # sobe o container
make migrate # aplica migrations pendentes
make down    # para o container
```

### Outros comandos

```bash
make migration msg="descricao"   # gera nova migration
```

A API ficará disponível em `http://localhost:5000`.

---

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

---

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

---

## Migrations

```bash
# Após alterar uma entidade, gerar nova migration:
make migration msg="add campo preco_custo em produto"

# Aplicar ao banco:
make migrate
```
