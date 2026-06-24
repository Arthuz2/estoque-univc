function listarProdutos(callback) {
  request("/produtos/", "GET", null, callback);
}

function criarProduto(produto, callback) {
  request("/produtos/", "POST", produto, callback);
}

function editarProduto(id, produto, callback) {
  request("/produtos/" + id, "PUT", produto, callback);
}

function excluirProdutoAPI(id, callback) {
  request("/produtos/" + id, "DELETE", null, callback);
}