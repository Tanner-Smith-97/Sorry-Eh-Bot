import express from 'express';

//this mounts the program to the assosiated port
//provides a json object on http get
//All this is for Heroku
class App {
    public expressServer;

    constructor() {
        this.expressServer = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({message: 'Go away, world!'});
        });
        this.expressServer.use('/', router);
    }
}

export default new App().expressServer;