import { faker } from "@faker-js/faker";

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: faker.commerce.price(),
    thumbnail: faker.image.url(),
    stock: faker.string.numeric({ min: 5, max: 100 }),
    rating: faker.string.numeric({ min: 0, max: 5 }),
  };
};

export default generateProduct;
