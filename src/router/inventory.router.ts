import { Router } from "express";
import inventoryController from "../controllers/Inventory.controller.js";


class inventoryRouter {

    router:Router;

    constructor(){
        this.router = Router();
        this.config();
    }

    private config(){
        //insertar en el inventario, se pueden insertar varios y si existe se modifica la cantidad
        this.router.route('/users/:id_user/inventory').post(inventoryController.insertInventory);
        //sacar para subasta, si tiene mas de una se modifica la cnatidad
        this.router.route('/users/:id_user/inventory').put(inventoryController.extractInventory);
        //obtener el inventario con id de usuario
        this.router.route('/users/:id_user/inventory').get(inventoryController.getInventoryByUser);
    }
}

export default new inventoryRouter();