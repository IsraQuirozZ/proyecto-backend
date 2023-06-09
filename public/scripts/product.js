let counter = document.querySelector(".counter");
let sumBtn = document.querySelector(".sumBtn");
let subBtn = document.querySelector(".subBtn");
let addBtn = document.querySelector(".addBtn");

let units = 1;
counter.innerHTML = units;

sumBtn.addEventListener("click", () => {
  units = units + 1;
  counter.innerHTML = units;
});

subBtn.addEventListener("click", () => {
  if (units > 1) {
    units = units - 1;
    counter.innerHTML = units;
  }
});

addBtn.addEventListener("click", () => {
  let id = addBtn.value;
  fetch(`http://localhost:8080/api/carts/647f9a508af5814325d1e75a/product/${id}/${units}`, {
    method: "PUT",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 404 || res.status === 400) {
        addBtn.innerHTML = res.response.toUpperCase();
      }
      counter.innerHTML = 1;
    });
});
