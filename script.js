let total = 0;
const entregaSelect = document.getElementById("entrega");
const enderecoBox = document.getElementById("enderecoBox");

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
        <select data-preco="${p.preco}">
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
