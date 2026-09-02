import { DataTypes } from "sequelize";

export default (sequelizeInstance, DataTypesInstance = DataTypes) => {
  const Address = sequelizeInstance.define(
    "Address",
    {
      id: {
        type: DataTypesInstance.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypesInstance.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        defaultValue: "Home",
      },
      addressLine1: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      addressLine2: {
        type: DataTypesInstance.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypesInstance.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypesInstance.STRING,
        allowNull: false,
        defaultValue: "Pakistan",
      },
    },
    {
      tableName: "Addresses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [{ fields: ["userId"] }],
    }
  );

  Address.associate = (models) => {
    if (models.User) {
      Address.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  };

  return Address;
};