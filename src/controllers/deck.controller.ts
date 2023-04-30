import { Request, Response, NextFunction } from "express";
import {deckModel, deckProductsModel} from "../models/deck.model.js";

const getDeckByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const deck = await deckProductsModel.findOne({
            include: [{
                model: deckModel,
                where: {id_user},
                attributes: []
            }],
            attributes: ['id_product', 'quantity']
        });
        return res.status(200).json({ status: true, data: deck });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const createDeck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user} = req.params;
        const products = req.body.products as {id_product:string, quantity:number}[];
        
        let deck = await deckModel.findOne({where:{id_user}});

        if(!deck){
            deck = await deckModel.create({id_user});
        }else{
            await deckProductsModel.destroy({
                where: {id_deck: deck.id_deck}
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