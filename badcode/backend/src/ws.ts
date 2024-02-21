import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { fetchS3Folder, saveToS3 } from './aws';
import { fetchDir, fetchFileContent, saveFile } from './fs';
import path from "path"
import { TerminalManager } from './pty';

const terminalManager = new TerminalManager()

export const initWs = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', async (socket: Socket) => {
        const replId = socket.handshake.query.replId as string;
        if(!replId) {
            socket.disconnect();
            return;
        }
        await fetchS3Folder(`code/${replId}`, path.join(__dirname, `../tmp/${replId}`));

        socket.emit('loaded', {
            rootContent: await fetchDir(path.join(__dirname, `../tmp/${replId}/repl`), "")
        })

        initHandlers(socket, replId);
    })

    io.on('error', (error: any) => {
        console.error('WebSocket server error:', error);
    });
}

const initHandlers = (socket: Socket, replId: String) => {
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
    socket.on("fetchDir", async(dirPath: string, callback) => {
        const updatedDir = {
            rootContent: await fetchDir(path.join(__dirname, `../tmp/${replId}/repl/${dirPath}`), dirPath)
        }
        callback(updatedDir);
    })    
    socket.on("loadFile", async(filePath: string, callback) => {
        const content = await fetchFileContent(path.join(__dirname, `../tmp/${replId}/repl/${filePath}`));
        callback(content)
    })    
    socket.on("updateFile", async(filePath: string, value) => {
        await saveFile(path.join(__dirname, `../tmp/${replId}/repl/${filePath}`), value);
        await saveToS3(`code/${replId}`, filePath, value);
        console.log('saved in temp and remote')
    })    
    socket.on('initTerminal', (replId, callback) => {
        terminalManager.createPty(replId, callback)
        console.log(replId)
    })
    socket.on('queryTerminal', (replId, query) => {
        terminalManager.queryPty(replId, query)
    })
}