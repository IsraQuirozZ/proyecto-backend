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
    let units = 1;
    fetch(
      `http://localhost:8080/api/carts/647f9a508af5814325d1e75a/product/${btn.value}/${units}`,
      {
        method: "DELETE",
      }
    ).then(() => {
      location.reload();
    });
  });
});
