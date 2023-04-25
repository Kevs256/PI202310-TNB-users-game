import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import deckRouter from './router/deck.router.js';
import mongoDb from './database/mongo.db.js';
import inventoryRouter from './router/inventory.router.js';

class Server{

    private app: express.Express
    
    constructor(){
        this.app = express();
        this.config();
        this.routes();
        this.start();
    }

    private config(){
        new mongoDb().connect();
        this.app.use(cors({
            origin: process.env.CLIENT_HOST! || '*',
            credentials: true
        }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    private routes(){
        this.app.use(deckRouter.router);
        this.app.use(inventoryRouter.router);
    }

    private start(){
        this.app.listen(parseInt(process.env.API_PORT!), process.env.API_HOST!, ()=>{
            console.log(`Listen on http://${process.env.API_HOST}:${process.env.API_PORT}/`);
        });
    }
}

new Server();