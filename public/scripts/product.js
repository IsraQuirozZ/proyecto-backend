let counter = document.querySelector(".counter");
let sumBtn = document.querySelector(".sumBtn");
let subBtn = document.querySelector(".subBtn");
let addBtn = document.querySelector(".addBtn");

let units = 0;

sumBtn.addEventListener("click", () => {
  units = units + 1;
  counter.innerHTML = units;
  console.log(units);
});

subBtn.addEventListener("click", () => {
  if (units > 0) {
    units = units - 1;
    counter.innerHTML = units;
  }
});

addBtn.addEventListener("click", () => {
  let id = Number(addBtn.value);
  fetch(`http://localhost:8080/api/carts/1/product/${id}/${units}`, {
    method: "PUT",
  }).then((res) => console.log(res));
  counter.innerHTML = 0;
});
