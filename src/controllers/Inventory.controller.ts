import { Request, Response, NextFunction } from "express";
import {inventoryModel, inventoryProductsModel} from "../models/inventory.model.js";

const getInventoryByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const inventory = await inventoryModel.findOne({where:{id_user}});
        if(!inventory){
            return res.status(404).json({ status: true, message: 'inventory not found' });
        }
        const inventoryProducts = await inventoryProductsModel.findOne({
            include: [{
                model: inventoryModel,
                where: {id_user},
                attributes: []
            }],
            attributes: ['id_product', 'quantity']
        });

        return res.status(200).json({ status: true, data: {coins: inventory?.coins, inventory: inventoryProducts} });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const addToInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user} = req.params;
        const products = req.body.products as {id_product:string, quantity:number}[];
    
        let inventory = await inventoryModel.findOne({where:{id_user}});

        if(!inventory){
            inventory = await inventoryModel.create({id_user, coins: 50});
        }

        await inventoryProductsModel.bulkCreate(
            products.map(product=>({
                ...product,
                id_inventory: inventory?.id_inventory!
            }))
        );
        
        return res.status(200).json({status: true, message: 'products add successfully'});
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const deleteFromInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id_user, id_product} = req.params;
    
        let inventory = await inventoryModel.findOne({where:{id_user}});

        if(!inventory){
            return res.status(404).json({status: true, message: 'Inventory not found'});
        }

        await inventoryProductsModel.destroy({
            where: {
                id_inventory: inventory.id_inventory,
                id_product
            }
        })
        
        return res.status(200).json({status: true, message: 'products deleted successfully'});
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

export default {
    getInventoryByUser,
    addToInventory,
    deleteFromInventory
}