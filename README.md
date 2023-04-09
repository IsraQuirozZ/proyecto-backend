# Proyecto E-commerce Back-End Coderhouse

## Descripción Del Proyecto

Este es un proyecto para mi curso de Back-End en Coderhouse, en este reposiotrio iré creando un back-end para un E-commerce, a lo largo del curso iremos completando varios desafíos para poco a poco ir armando el back-end de la tienda y se irán mostrando desafiío tras desafío dando una explicación de que se hizo en el.

---

# Desafío 1

## Consigna

Realizar una clase "ProductManager" que gestione un conjunto de productos.

## Aspectos que incluye

1. Se crea desde su constructor con el elemento products, el cual es un arreglo vacío.

```
const product = new ProductManager()
```

2. Cada producto que gestione cuenta con las propiedades:

  - title (nombre del producto)
  - description (descripción del producto)
  - price (precio)
  - thumbnail (ruta de imagen)
  - code (código identificador)
  - stock (número de piezas disponibles)

3. Cuenta con el método “addProduct” el cual agrega un producto al arreglo de productos inicial.

```
product.addProduct({
  title: "Producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
 })
```

   - Se valida que no se repita el campo “code” y que todos los campos sean obligatorios.
  - Al agregarlo, se crea con un id autoincrementable.

4. Cuenta con el método “getProducts” el cual devuelve el arreglo con todos los productos creados hasta el momento.

```
product.getProducts()
```

5. Cuenta con el método “getProductById” el cual busca en el arreglo el producto que coincida con el id proporcionado.

```
product.getProductById(3)
```

  - En caso de no coincidir ningún id, se muestra en consola un error “Not found”.
