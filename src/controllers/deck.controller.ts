import { Request, Response, NextFunction } from "express";
import DecksModel from "../models/decks.model.js";

const getDecksByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user } = req.params;
        const deck = await DecksModel.findOne({ id_user });
        console.log(deck)
        if (deck) {
            return res.status(200).json({ status: true, data: deck });
        } else {
            return res.status(404).json({ status: true, message: 'Deck not found' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

const insertDeck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id_user} = req.params;
        const { hero , armors , weapon , items , epics } = req.body
        const deck = await DecksModel.findOne({id_user});
        if(!deck){
            await DecksModel.create({
                id_user:id_user, hero:hero, armors:armors, weapon: weapon, items:items, epics:epics
            });
            return res.status(200).json({status: true, message: 'deck create successfully'});
        }else{
            await DecksModel.findOneAndUpdate({ id_user: id_user }, { 
                hero: hero,
                armors: armors,
                weapon: weapon,
                items: items,
                epics: epics
              });
              return res.status(200).json({status: true, message: 'deck edit successfully'});
        }
    } catch (error) {
        console.log((error as Error).message);
        res.status(500).json({ status: false, message: 'Server internal error' });
    }
}

export default {
    getDecksByUser,
    insertDeck
}