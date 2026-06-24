import { request } from './api.js'

export function listarProdutos(callback) {
  request("/produtos/", "GET", null, callback);
}

export function criarProduto(produto, callback) {
  request("/produtos/", "POST", produto, callback);
}

export function editarProduto(id, produto, callback) {
  request("/produtos/" + id, "PUT", produto, callback);
}

export function excluirProdutoAPI(id, callback) {
  request("/produtos/" + id, "DELETE", null, callback);
}