'use client'
import Image from "next/image";
import { useState } from "react";
import{ Box, Stack, TextField, Button, SpeedDial,SpeedDialIcon, SpeedDialAction} from '@mui/material'
import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@emotion/react';



export default function Home() {
  const [messages, setMessages] = useState([
    {
    role: 'assistant',
    content: `Welcome back sir, how can I help you today?`
  }
])

  const [value, setValue] = React.useState(0);

  const [message, setMessage] = useState('')

  const [open, setOpen] = useState(true);
  
  const handleClose = () => {
    setOpen(false);
  };

  const moveBg = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

  const sendMessage = async()=>{
    setMessage('')
    setMessages((messages)=>[
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ""}
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then( async (res)=>{
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}){
        if (done){
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages)=>{
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return[
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
  <Box 
  sx={{
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)', // Background gradient
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  }}
  >
   <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
          animation: `${moveBg} 10s linear infinite`,
        }}
      />  
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h4" align="center" >
            JARVIS
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[100],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Welcome Back Sir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Enter Site
          </Button>
        </DialogActions>
      </Dialog>
    </>

    <Stack 
    bgcolor="white"
    direction = "column"
    width = "800px"
    height = "700px"
    border = "1px solid black"
    p={2}
    spacing={3}
    >
      <Stack
      direction="column"
      spacing={2}
      flexGrow={1}
      overflow = "auto"
      maxHeight="100%"
      >
        {messages.map((message,index)=> (
            <Box
            key={index}
            display="flex"
            justifyContent={
              message.role=== 'assistant' ? 'flex-start' : 'flex-end'
            }
            >
            <Box
            bgcolor={
              message.role === 'assistant' 
              ? '#7282ba' 
              : 'secondary.main'
            }
            color="white"
            borderRadius={0}
            p={3}
            >
              {message.content}
              </Box></Box>
        ))
        }
      </Stack>
      <Stack
      direction="row"
      spacing={2}>
      <TextField
      label = "message"
      fullWidth
      value = {message}
      onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant = "contained" onClick={sendMessage} >
        Send
      </Button>
      </Stack>
    </Stack>
  </Box>
  )
}
