import mongoose from 'mongoose';

const InventoryModel = mongoose.model('Inventory', new mongoose.Schema({
    _id: String,
    id_user: String,
    product: [
        {
          id_product: { type: String, required: true },
          quantity: { type: Number, required: true }
        }
      ],
}));

export default InventoryModel;
