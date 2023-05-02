import { Request, Response, NextFunction } from "express";
import {deckModel, deckProductsModel} from "../models/deck.model.js";
import { Op } from "sequelize";
import { inventoryModel, inventoryProductsModel } from "../models/inventory.model.js";
import { IProduct } from "interfaces/IProduct.js";

const getDeckByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const deck = await deckProductsModel.findAll({
            include: [{
                model: deckModel,
                where: {id_user},
                attributes: []
            }],
            attributes: ['id_product', 'quantity', 'type']
        });
        return res.status(200).json({ status: true, data: deck||[] });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const createDeck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user} = req.params;
        const products = req.body.products as IProduct[];

        let deck = await deckModel.findOne({where:{id_user}});

        if(!deck){
            deck = await deckModel.create({id_user});
        }else{
            await deckProductsModel.destroy({
                where: {id_deck: deck.id_deck}
            });
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

        const _products:{[key:string]:number} = {};
        for(let i=0;i<productsInInventory.length;i++){
            _products[productsInInventory[i].id_product] = productsInInventory[i].quantity;
        }
        const products_left:{id_product:string, quantity:number}[] = [];

        products.forEach(product=>{
            if(!_products[product.id_product]){
                products_left.push({
                    id_product: product.id_product,
                    quantity: product.quantity
                });
            }else if(_products[product.id_product] < product.quantity){
                products_left.push({
                    id_product: product.id_product,
                    quantity: product.quantity - _products[product.id_product]
                });
            }
        });

        if(products_left.length>0){
            return res.status(400).json({
                status: true,
                message: 'You dont have the following cards',
                data: products_left
            });
        }

        await deckProductsModel.bulkCreate(
            products.map(product=>({
                ...product,
                id_deck: deck?.id_deck!
            }))
        );
        
        return res.status(200).json({status: true, message: 'deck create/edit successfully'});
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

export default {
    getDeckByUser,
    createDeck
}