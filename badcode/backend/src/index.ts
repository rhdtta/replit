import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import { initWs } from './ws';
import { initHttp } from './http';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors())
const httpServer = createServer(app);

initWs(httpServer);
initHttp(app);

httpServer.listen(3000, () => {
    console.log('listening on 3000')
})