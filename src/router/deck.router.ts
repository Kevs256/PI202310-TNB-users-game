import deckController from "controllers/deck.controller";
import { Router } from "express";

export default class deckRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        this.router.route('/:id_user').get(deckController.getDeckByUser);
        this.router.route('/:id_user').post(deckController.createDeck);
    }
}