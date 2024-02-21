import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RemoteFiles, Directory, buildFileTree, Type, File } from "../../external/src/utils/file-manager";
import styled from '@emotion/styled';
import {Terminal} from './Terminal'

import Editor from '../../external/src/App'

// constants 
const EXECUTION_ENGINE_URI = "ws://localhost:3000";

const Workspace = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: 16px;
  width: 100%;
`;

const TopPanel = styled.div`
  flex: 1;
  height: 60vh;
`;

const BottomPanel = styled.div`
  flex: 1;
  width: 100%;
  background: #000;
  color: #fff;
  height: 40vh;
  position: absolute;
  bottom: 0;
  padding: 8px 0 0 8px;
  border: 1px red dashed;
`;

function useSocket(replId: string) {
    const [conn, setConn] = useState<Socket | null>(null);
    
    useEffect(() => {
        const sockt = io(`${EXECUTION_ENGINE_URI}?replId=${replId}`);
        setConn(sockt)

        return () => {
            sockt.disconnect();
        }
    }, [replId])

    return conn;
}

export const CodingPage = () => {
    const [param] = useSearchParams()
    const replId = param.get('replId') as string;

    const socket = useSocket(replId);
    
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [rootContent, setRootContent] = useState<RemoteFiles[]>([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        socket?.on('loaded', (data: {rootContent: RemoteFiles[]}) => {
            setRootContent(data.rootContent);
        })
        socket?.on('disconnect', () => {
            navigate(`/`)
            // console.log('disconnected')
        })
    }, [socket])


    const onSelect = async(file: File) => {
        if(file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (updatedTree: {rootContent: RemoteFiles[]}) => {
                setRootContent(prev => {
                    return [...prev, ...updatedTree.rootContent]
                })
            })
        } else {
            socket?.emit("loadFile", file.path, (data: string) => {
                file.content = data;
                setSelectedFile(file)
            })
        }
    };

    const handleClick = (socket: Socket | null) => {
        socket?.emit('initTerminal', replId, (data: string) => {
            console.log('data from pty', data)
        })
        setShowTerminal(!showTerminal)
    }


    return(
        <>
            <div>
                <button onClick={() => handleClick(socket)}>Open Console</button>
            </div>
            <Workspace>
                <TopPanel>
                    <Editor rootContent={rootContent} onSelect={onSelect} selectedFile={selectedFile} socket={socket}/>
                </TopPanel>
                {showTerminal &&
                <BottomPanel>
                    {/* {showOutput && <Output />} */}
                    <Terminal  />
                </BottomPanel>}
            </Workspace>
        </>
    )
}