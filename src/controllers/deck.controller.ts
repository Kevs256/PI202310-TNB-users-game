import { Request, Response, NextFunction } from "express";
import DecksModel from "../models/decks.model.js";
import mongoose from "mongoose";


const getDeckById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_deck } = req.params;
        const deck = await DecksModel.findOne({
            _id: id_deck
        });
        if (deck) {
            res.status(200).json({ status: true, data: deck });
        } else {
            res.status(404).json({ status: true, message: 'Deck not found' });
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}


const getDecksByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_usuario } = req.params;
        const decks = await DecksModel.find({ heroe: id_usuario });
        if (decks) {
            res.status(200).json({ status: true, data: decks });
        } else {
            res.status(404).json({ status: true, message: 'Deck not found' });
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const insertDeck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_usuario } = req.params;
        const cards = req.body.cards as {id_carta:string, type:number}[];
        const deck = await DecksModel.create({_id: new mongoose.Types.ObjectId().toString(), heroe: id_usuario});
        
        for(let i=0;i<cards.length;i++){
            await DecksModel.create({
                id_carta: cards[i].id_carta,
                id_mazo: deck._id,
                tipo: cards[i].type,
            });
        }

        res.status(200).json({ status: true, data: "ok" });
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}



export default {
    getDeckById,
    getDecksByUser,
    insertDeck
}