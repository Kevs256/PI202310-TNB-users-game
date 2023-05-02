import { Router } from "express";
import inventoryController from "../controllers/Inventory.controller.js";


export default class inventoryRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        this.router.route('/:id_user').get(inventoryController.getInventoryByUser);
        this.router.route('/:id_user').post(inventoryController.addToInventory);
        this.router.route('/:id_user/products/:id_product').delete(inventoryController.deleteFromInventory);
    }
}