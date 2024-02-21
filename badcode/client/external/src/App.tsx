import { useMemo, useState } from "react";
import Sidebar from "./components/sidebar";
import { Code } from "./editor/code";
import styled from "@emotion/styled";
import { File, Directory, RemoteFiles, buildFileTree } from "./utils/file-manager";
import "./App.css";
import { FileTree } from "./components/file-tree";
import { Socket } from "socket.io-client";

export const Editor = ({rootContent, onSelect, selectedFile, socket}: {rootContent: RemoteFiles[], onSelect: (file: File) => Promise<void>, selectedFile: File | undefined, socket: Socket | null}) => {
  const rootDir = useMemo(() => {
    return buildFileTree(rootContent);
  }, [rootContent]);
  return (
    <div>
      <Main>
        <Sidebar>
          <FileTree
            rootDir={rootDir}
            selectedFile={selectedFile}
            onSelect={onSelect}
          />
        </Sidebar>
        <Code selectedFile={selectedFile} socket={socket}/>
      </Main>
    </div>
  );
};

const Main = styled.main`
  display: flex;
  width: 100vw;
  border-top: 2px solid blue;
`;

export default Editor;
