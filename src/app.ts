import express from 'express';

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