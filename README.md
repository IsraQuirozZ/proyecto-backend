# Proyecto E-commerce Back-End Coderhouse

## Descripción Del Proyecto

Este es un proyecto para mi curso de Back-End en Coderhouse, en este reposiotrio iré creando un back-end para un E-commerce. A lo largo del curso iremos completando varios desafíos para poco a poco ir armando el back-end de la tienda y se irán mostrando desafío tras desafío dando una explicación de que se hizo en el.

---

# Desafío 1 - Clases con ECMAScript

## Consigna
Defnir una clase "ProductManager" que gestione un conjunto de productos.

## Cómo usarla:

```
let productManager = new ProductManager("../data/products.json")
```

## Métodos que incluye:
1. Add Product
```
productManager.addProduct({
  title: "Producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
 })
```

2. Get Products
```
productManager.getProducts()
```

3. Get Product By Id
```
productManager.getProductById(id)
```

4. Update Product
```
productManager.updateProduct(id, data)
```

5. Delete Product
```
productManager.deleteProduct(id)
```
---

# Desafío 2 - Manejo de archivos

## Consigna
Agregar a la clase "ProductManager" una variable ***this.path*** la cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.
```
let productManager = new ProductManager("../data/products.json")
```

Los métodos de la clase son capaces de guardar/actualizar/borrar cierta información en el archivo de la ruta dada.

---
# Desafío 3 - Servidor con express

## Consigna
Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

### Aspectos incluidos
- Se utiliza la clase ProductManager que actualmente utilizamos con persistencia de archivos. 
- Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
- El servidor debe contar con los siguientes endpoints:
  - ruta ‘/products’, la cual lee el archivo de productos y los devuelve dentro de un objeto, cuenta con un query ***limit=number*** el cual sirve para indicar cuantos productos traer.
  - ruta ‘/products/:pid’, la cual recibe por req.params el pid (product Id), y devuelve sólo el producto solicitado. 


