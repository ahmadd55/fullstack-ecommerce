import { DataTypes, Sequelize } from "sequelize";


export default (
  sequelizeInstance = sequelize,
  DataTypesInstance = DataTypes
) => {
  const User = sequelizeInstance.define(
    "User",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypesInstance.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      profilePicture: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["firstName"],
        },
        {
          fields: ["lastName"],
        },
        {
          fields: ["phone"],
        }
      ],
    }
  );

  User.associate = (models) => {
  if (models.UserAuthToken) {
    User.hasMany(models.UserAuthToken, { foreignKey: "userId", as: "authTokens" });
  }
  if (models.Product) {
    User.hasMany(models.Product,  { foreignKey: "userId", as: "products",  onDelete: "CASCADE" });
  }
  if (models.Wishlist) {
    User.hasMany(models.Wishlist, { foreignKey: "userId", as: "wishlists", onDelete: "CASCADE" });
  }
  if (models.Cart) {
    User.hasMany(models.Cart,     { foreignKey: "userId", as: "cartItems", onDelete: "CASCADE" });
  }
  if (models.Order) {
    User.hasMany(models.Order,    { foreignKey: "userId", as: "orders",    onDelete: "CASCADE" });
  }
  if (models.Address) {
    User.hasMany(models.Address, { foreignKey: "userId", as: "addresses", onDelete: "CASCADE" });
  }
};

  return User;
};