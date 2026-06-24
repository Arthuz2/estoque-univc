const BASE_URL = "http://localhost:5000/api";

function request(url, method, data, callback) {

  $.ajax({
    url: BASE_URL + url,
    method: method,
    contentType: "application/json",
    data: data ? JSON.stringify(data) : null,

    success: function(res) {
      callback(res);
    },

    error: function(err) {
      console.log("Erro na API:", err);
    }

  });

}