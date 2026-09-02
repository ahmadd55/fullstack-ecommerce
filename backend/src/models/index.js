"use strict";
import "dotenv/config.js";
import { Sequelize } from "sequelize";


import UserFactory          from "./user.js";
import UserAuthTokenFactory from "./user_auth_token.js";
import ProductFactory       from "./product.js";
import ProductImageFactory  from "./productImage.js";
import CategoryFactory      from "./category.js";
import SubCategoryFactory   from "./subCategory.js";
import WishlistFactory      from "./wishlist.js";
import CartFactory          from "./cart.js";
import AddressFactory       from "./address.js";
import { OrderFactory, OrderItemFactory } from "./order.js";


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
  }
);


const User          = UserFactory(sequelize, Sequelize);
const UserAuthToken = UserAuthTokenFactory(sequelize, Sequelize);
const Product       = ProductFactory(sequelize, Sequelize);
const ProductImage  = ProductImageFactory(sequelize, Sequelize);
const Category      = CategoryFactory(sequelize, Sequelize);
const SubCategory   = SubCategoryFactory(sequelize, Sequelize);
const Wishlist      = WishlistFactory(sequelize, Sequelize);
const Cart          = CartFactory(sequelize, Sequelize);
const Order         = OrderFactory(sequelize, Sequelize);
const OrderItem     = OrderItemFactory(sequelize, Sequelize);
const Address = AddressFactory(sequelize, Sequelize);


const db = {
  User,
  Address,
  UserAuthToken,
  Product,
  ProductImage,
  Category,
  SubCategory,
  Wishlist,
  Cart,
  Order,
  OrderItem,
};


Object.values(db).forEach((model) => {
  if (typeof model?.associate === "function") {
    model.associate(db);
  }
});


export {
  db,
  sequelize,
  Sequelize,
  User,
  UserAuthToken,
  Address,
  Product,
  ProductImage,
  Category,
  SubCategory,
  Wishlist,
  Cart,
  Order,
  OrderItem,
};