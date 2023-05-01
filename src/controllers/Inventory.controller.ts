import { Request, Response, NextFunction } from "express";
import {InventoryProductsInstance, inventoryModel, inventoryProductsModel} from "../models/inventory.model.js";
import { Op } from "sequelize";
import { IInventoryProducts } from "interfaces/IInventory.js";

const getInventoryByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const inventory = await inventoryModel.findOne({where:{id_user}});
        if(!inventory){
            return res.status(404).json({ status: true, message: 'inventory not found' });
        }
        const inventoryProducts = await inventoryProductsModel.findAll({
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
        interface IProduct {id_product:string, quantity:number};
        const { id_user} = req.params;
        const products = req.body.products as IProduct[];

        let inventory = await inventoryModel.findOne({where:{id_user}});

        if(!inventory){
            inventory = await inventoryModel.create({id_user, coins: 50});
        }

        const productsInInventory = await inventoryProductsModel.findAll({
            include: [{
                model: inventoryModel,
                where: {id_user}
            }],
            where: {
                id_product: {
                    [Op.in]: products.map(p=>p.id_product)
                }
            }
        });

        const _products:{[key:string]:InventoryProductsInstance} = {};
        for(let i=0;i<productsInInventory.length;i++){
            _products[productsInInventory[i].id_product] = productsInInventory[i];
        }

        const toCreate:IInventoryProducts[] = [];

        products.forEach(async(product)=>{
            let _product = {...product, id_inventory: inventory?.id_inventory!};
            if(_products[product.id_product]){
                _product.quantity += _products[product.id_product].quantity;
                await inventoryProductsModel.update(_product, {
                    where: {
                        id_inventory_products: _products[product.id_product].id_inventory_products
                    }
                });
            }else{
                toCreate.push(_product);
            }
        });

        await inventoryProductsModel.bulkCreate(toCreate);

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