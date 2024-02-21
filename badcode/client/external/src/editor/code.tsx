import React from 'react'
import Editor from "@monaco-editor/react";
import {File} from "../utils/file-manager";
import styled from "@emotion/styled";
import { Socket } from 'socket.io-client';
// import { editor } from '@monaco-editor/react';

export const Code = ({selectedFile, socket}: { selectedFile: File | undefined , socket: Socket | null}) => {
  if (!selectedFile)
    return null

  const code = selectedFile.content
  let language = selectedFile.name.split('.').pop()

  if (language === "js" || language === "jsx")
    language = "javascript";
  else if (language === "ts" || language === "tsx")
    language = "typescript"

  function debounce(func: (value: string) => void, wait: number) {
    let timeout: number;
    return ((value: string) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(value), wait)
    })
  }

  return (
    <Div>
      <Editor
        height="100vh"
        language={language}
        value={code}
        theme="vs-dark"
        // @ts-ignore: Unreachable code error
        onChange={debounce((value) => {
          socket?.emit('updateFile', selectedFile.path, value)
        }, 500)}
      />
    </Div>
  )
}

const Div = styled.div`
  width: calc(100% - 250px);
  margin: 0;
  font-size: 16px;
`
