// BUTTONS
let clearBtn = document.querySelector(".clearProductsBtn");
let deleteItemBtns = document.querySelectorAll(".deleteItem");
let payBtn = document.querySelector(".payBtn");

// CONTENT
let unitsPrice = document.querySelector(".cartItem__price--price");
let totalProducts = document.querySelector(".totalProducts");
let totalPrice = document.querySelector(".totalPrice");

deleteItemBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    let id = Number(btn.value);
    let units = 1;
    fetch(`http://localhost:8080/api/carts/1/product/${id}/${units}`, {
      method: "DELETE",
    }).then((res) => {
      location.reload();
    });
  });
});
