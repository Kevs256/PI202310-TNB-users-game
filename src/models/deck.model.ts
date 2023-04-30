import {Model, DataTypes, BuildOptions} from 'sequelize';
import db from '../database/database.js';
import { IDeck, IDeckProducts } from '../interfaces/IDeck.js';

interface DeckInstance extends Model<IDeck>, IDeck {}
type DeckModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DeckInstance;
};

interface DeckProductsInstance extends Model<IDeckProducts>, IDeckProducts {}
type DeckProductsModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DeckProductsInstance;
};

export const deckModel = db.define('deck', {
    id_deck: {
      primaryKey: true,
      type: DataTypes.NUMBER,
      autoIncrement: true
    },
    id_user: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
}) as DeckModelStatic;

export const deckProductsModel = db.define('deckProducts', {
    id_deck_products: {
        primaryKey: true,
        type: DataTypes.NUMBER,
        autoIncrement: true
    },
    id_product: DataTypes.STRING,
    quantity: DataTypes.NUMBER,
    type: DataTypes.STRING,
    id_deck: DataTypes.NUMBER,
}, {
  freezeTableName: true,
  timestamps: false
}) as DeckProductsModelStatic;

deckModel.hasMany(deckProductsModel, { foreignKey: 'id_deck' });
deckProductsModel.belongsTo(deckModel, { foreignKey: 'id_deck' });