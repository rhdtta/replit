import express, {Express} from "express"
import { copyS3Folder } from "./aws";
export const initHttp = (app: Express) => {
    app.use(express.json());

    app.post('/projects', async (req, res) => {
        const {replId, language} = req.body;
        console.log('received replId', replId)

        if(!replId) {
            res.status(400).send('Bad request');
            return;
        }

        await copyS3Folder(`base/${language}`, `code/${replId}`);

        res.send('project created');
    })
}