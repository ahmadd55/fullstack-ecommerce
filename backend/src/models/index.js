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


const isServerless = Boolean(process.env.VERCEL);

const connectionOptions = {
  dialect: "postgres",
  logging: false,
  // Every serverless invocation runs in its own container, so a normal-sized
  // pool per instance quickly exhausts Postgres connection slots.
  pool: isServerless
    ? { max: 1, min: 0, idle: 0, acquire: 10000 }
    : { max: 5, min: 0, idle: 10000, acquire: 30000 },
};

// Hosted Postgres (Neon, Supabase, Render) requires TLS; local Postgres usually has none.
if (process.env.DATABASE_URL || process.env.DB_SSL === "true") {
  connectionOptions.dialectOptions = {
    ssl: { require: true, rejectUnauthorized: false },
  };
}

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, connectionOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...connectionOptions,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
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