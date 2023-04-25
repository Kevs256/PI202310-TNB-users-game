import { Request, Response, NextFunction } from 'express';
import inventoryModel from '../models/inventory.model.js';


const getInventoryByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const inventory = await inventoryModel.findOne({ id_user });
        if (inventory) {
            return res.status(200).json({ status: true, data: inventory });
        } else {
            return res.status(404).json({ status: true, message: 'inventory not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const extractInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const { id_product } = req.body;
        const inventory = await inventoryModel.findOne({ id_user });
        const idx = inventory!.product.findIndex(product => product.id_product == id_product);
        if (idx == -1) {
            return res.status(400).json({ status: true, message: 'no tienes este producto' });
        } else {
            inventory!.product[idx].quantity -= 1;
            await inventory!.save();
            if (inventory!.product[idx].quantity == 0) {
                inventory!.product.splice(idx, 1);
                await inventory!.save();
            }
            return res.status(200).json({ status: true, message: 'product extraido' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const insertInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const { id_product, quantity } = req.body;
        const inventory = await inventoryModel.findOne({ id_user });
        if (!inventory) {
            await inventoryModel.create({
                id_user: id_user,
                product: [{ id_product: id_product, quantity: quantity }]
            });
            console.log("aca")
            return res.status(200).json({ status: true, message: 'product updated successfully' });
        }
        const idx = inventory!.product.findIndex(product => product.id_product == id_product);
        if (idx == -1) {
            inventory!.product.push({ id_product, quantity });
        } else {
            inventory!.product[idx].quantity += quantity;
        }
        await inventory!.save();
        return res.status(200).json({ status: true, message: 'Cart updated successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

export default {
    getInventoryByUser,
    extractInventory,
    insertInventory
}