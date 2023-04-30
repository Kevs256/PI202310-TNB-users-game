import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import { IInventory, IInventoryProducts } from '../interfaces/IInventory.js';

export interface InventoryInstance extends Model<IInventory>, IInventory {}
type InventoryModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): InventoryInstance;
};

export interface InventoryProductsInstance extends Model<IInventoryProducts>, IInventoryProducts {}
type InventoryProductsModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): InventoryProductsInstance;
};

export const inventoryModel = db.define('inventory', {
    id_inventory: {
      primaryKey: true,
      type: DataTypes.NUMBER,
      autoIncrement: true
    },
    id_user: DataTypes.STRING,
    coins: DataTypes.NUMBER
}, {
    freezeTableName: true,
    timestamps: false
}) as InventoryModelStatic;

export const inventoryProductsModel = db.define('inventoryProducts', {
  id_inventory_products: {
    primaryKey: true,
    type: DataTypes.NUMBER,
    autoIncrement: true
  },
  id_product: DataTypes.STRING,
  quantity: DataTypes.NUMBER,
  id_inventory: DataTypes.NUMBER,
}, {
  freezeTableName: true,
  timestamps: false
}) as InventoryProductsModelStatic;

inventoryModel.hasMany(inventoryProductsModel, { foreignKey: 'id_inventory' });
inventoryProductsModel.belongsTo(inventoryModel, { foreignKey: 'id_inventory' });