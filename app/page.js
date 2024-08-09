'use client'
import Image from "next/image";
import { useState } from "react";
import{ Box, Stack, TextField, Button, styled} from '@mui/material'
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

  const handleClickOpen = () => {
    setOpen(true);
  };

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

const openAnimation = keyframes`
  0% {
    height: 0px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }
  
  15% {
    height: 15px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }
  
  25% {
    height: 25px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }

  35% {
    height: 35px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }

  50% {
    height: 50px; /* Partially expand height */
    opacity: 0.5; /* Fade in slightly */
  }

  65% {
    height: 65px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }

  75% {
    height: 75px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }

  90% {
    height: 90px; /* Start from zero height */
    opacity: 0; /* Start fully transparent */
  }

  100% {
    height: 100%; /* Expand to full height */
    opacity: 1; /* Fully opaque */
  }
`;

const AnimatedDialogContent = styled(DialogContent)(({ theme }) => ({
  position: 'relative',
  animation: `${openAnimation} 0.6s ease-out forwards`, // Smooth vertical expansion
  backgroundColor: theme.palette.background.paper,
  borderRadius: '12px', // Rounded corners for a cleaner look
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  overflow: 'hidden', // Ensure no overflow issues
  width: '400px', // Maintain a consistent width throughout the animation
}));
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
        <AnimatedDialogContent>
          <Box sx={{ padding: 3 }}>
            <Typography 
            variant="h6" 
            sx={{ 
            marginBottom: 2, 
            textAlign: 'center',
            }}>
              JARVIS
            </Typography>
            <Typography 
            variant="body1" 
            sx={{ 
            marginBottom: 3, 
            textAlign: 'center'
            }}>
              Welcome Back Sir.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose} sx={{ marginRight: 1 }}>
              Close
            </Button>
          </Box>
        </AnimatedDialogContent>
      </Dialog>
    </>

    <Stack 
    bgcolor=""
    direction = "column"
    width = "800px"
    height = "650px"
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
      spacing={2}
      bgcolor = "transparent " >
      <TextField
      variant="standard"
      label = "Enter Message"
      fullWidth
      value = {message}
      onChange={(e) => setMessage(e.target.value)}
      />
      <Button 
      variant = "contained" 
      onClick={sendMessage}
      color = "secondary" >
        Send
      </Button>
      </Stack>
    </Stack>
  </Box>
  )
}
