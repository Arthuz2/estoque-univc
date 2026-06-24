<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
  request("/produtos/" + id, "DELETE", null, callback);
}