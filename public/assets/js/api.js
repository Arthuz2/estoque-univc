const BASE_URL = "http://localhost:5000/api";

export function request(url, method, data, callback, errorCallback) {
  $.ajax({
    url: BASE_URL + url,
    method: method,
    contentType: "application/json",
    data: data ? JSON.stringify(data) : null,

    success: function (res) {
      callback(res);
    },

    error: function (xhr) {
      const mensagem =
        xhr.responseJSON?.erro || xhr.statusText || "Erro na API";
      if (errorCallback) {
        errorCallback(mensagem, xhr);
      } else {
        console.log("Erro na API:", mensagem, xhr);
      }
    },
  });
}
