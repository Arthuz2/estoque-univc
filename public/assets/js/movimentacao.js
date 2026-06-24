function entradaEstoque(dados, callback) {
  request("/movimentacoes/entrada", "POST", dados, callback);
}

function saidaEstoque(dados, callback) {
  request("/movimentacoes/saida", "POST", dados, callback);
}

function listarMovimentacoes(callback) {
  request("/movimentacoes/", "GET", null, callback);
}

function movimentacoesPorProduto(id, callback) {
  request("/movimentacoes/produto/" + id, "GET", null, callback);
}