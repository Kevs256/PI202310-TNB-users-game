import { Router } from "express";
import decksController from "../controllers/deck.controller.js";

class deckRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        this.router.route('/users/:id_user/decks').get(decksController.getDecksByUser);
        this.router.route('/users/:id_user/decks').post(decksController.insertDeck);
    }
}

export default new deckRouter();