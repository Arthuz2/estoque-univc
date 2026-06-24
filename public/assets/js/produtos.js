import { request } from "./api.js";

export function listarProdutos(callback, errorCallback) {
  request("/produtos/", "GET", null, callback, errorCallback);
}

export function criarProduto(produto, callback, errorCallback) {
  request("/produtos/", "POST", produto, callback, errorCallback);
}

export function editarProduto(id, produto, callback, errorCallback) {
  request("/produtos/" + id, "PUT", produto, callback, errorCallback);
}

export function excluirProdutoAPI(id, callback, errorCallback) {
  request("/produtos/" + id, "DELETE", null, callback, errorCallback);
}
