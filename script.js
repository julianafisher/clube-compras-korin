let total = 0;

const entregaSelect = document.getElementById("entrega");
const enderecoBox = document.getElementById("enderecoBox");

const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLScozibR0X2-GwYH75h-3_HIljxxL1Qrq36bbpoToYvBMzdsgA/formResponse";

entregaSelect.addEventListener("change", () => {
  enderecoBox.style.display =
    entregaSelect.value === "entrega" ? "block" : "none";
  calcularTotal();
});

fetch("produtos.json")
  .then(res => res.json())
  .then(produtos => {
    const container = document.getElementById("produtos");

    produtos.forEach(p => {
      const div = document.createElement("div");
      div.className = "produto";

      div.innerHTML = `
        <strong>${p.nome}</strong><br>
        R$ ${p.preco.toFixed(2)}<br>
        Quantidade:
        <select data-preco="${p.preco}" data-nome="${p.nome}">
          ${[0,1,2,3,4,5,6,10,15,20,25].map(q => 
            `<option value="${q}">${q}</option>`).join("")}
        </select>
      `;

      container.appendChild(div);
    });

    document.querySelectorAll("select[data-preco]")
      .forEach(sel => sel.addEventListener("change", calcularTotal));
  });

function calcularTotal() {
  total = 0;

  document.querySelectorAll("select[data-preco]").forEach(sel => {
    total += sel.value * sel.dataset.preco;
  });

  if (entregaSelect.value === "entrega") {
    total += 20;
  }

  document.getElementById("total").innerText = total.toFixed(2);
}

function montarItensPedido() {
  let itens = [];

  document.querySelectorAll("select[data-preco]").forEach(sel => {
    const qtd = parseInt(sel.value);
    if (qtd > 0) {
      itens.push(`${sel.dataset.nome} | ${qtd}`);
    }
  });

  return itens.join("\n");
}

function enviarPedido(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const johreiCenter = document.getElementById("johrei").value;
  const tipoPedido = entregaSelect.value === "entrega" ? "Entrega" : "Retirada";
  const endereco = document.getElementById("endereco").value || "";
  const itens = montarItensPedido();

  if (!itens) {
    alert("Selecione pelo menos um item.");
    return;
  }

  const formData = new FormData();
  formData.append("entry.621146305", nome);
  formData.append("entry.1330450663", telefone);
  formData.append("entry.601790336", johreiCenter);
  formData.append("entry.1925880808", tipoPedido);
  formData.append("entry.284588275", endereco);
  formData.append("entry.584953114", itens);

  fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLScozibR0X2-GwYH75h-3_HIljxxL1Qrq36bbpoToYvBMzdsgA/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  alert("Pedido enviado com sucesso!");
  document.getElementById("pedidoForm").reset();
  document.getElementById("total").innerText = "0.00";
}


