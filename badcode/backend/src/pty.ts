// import pty 
import { spawn, IPty } from 'node-pty';
import { Socket } from 'socket.io';
const SHELL = 'bash';

// create a class that can create a psuedo terminal for us
// we have create, write and clear methods inside this class

export class TerminalManager {
    // need to store terminal and corresponding replId
    private session: {[replId: string] : {terminal: IPty}}

    constructor() {
        this.session = {}
    }

    createPty(replId: string, callback: (data: string) => void) {
        if(this.session[replId]) return;

        let term = spawn(SHELL, [], {
            cols: 100,
            name: 'xterm',
            cwd: "."
        })

        this.session[replId] = {terminal: term}

        term.onData(data => {
            callback(data)
        });
    }

    queryPty(replId: string, query: string) {
        console.log('querying pty')
        this.session[replId]?.terminal.write(query);
    }


}