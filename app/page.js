'use client'
import { useState } from "react";
import{ Box, Stack, TextField, Button, styled, } from '@mui/material'
import React from "react";

export default function Home() {

  const [messages, setMessages] = useState([
    {
    role: 'assistant',
    content: `Welcome back sir, how can I help you today?`
  }
])

const ComicBubble = styled(Box)(({ isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: '16px',
  position: 'relative',
}));

const comicFont = {
  fontFamily: "'Comic Sans MS', 'Comic Neue', cursive",
};



const AnimatedButton = styled(Button)({
  transition: 'transform .3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  padding: '10px 20px',
  color: '#fff', 
  border: 'none', 
  borderRadius: '4px', 
  fontSize: '16px',
  fontFamily: 'Comic Sans MS',
});


  const [value, setValue] = React.useState(0);

  const [message, setMessage] = useState('')

  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


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
      backgroundImage: 'url(https://i.imgur.com/ZApCZum.jpeg)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  }}
  >
   <Box 
      sx={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        width: '100px', 
        height: '100px',
        backgroundImage: 'url(/images/JL.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }} 
      />
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
            <ComicBubble
            key={index}
            isUser={message.role !== 'assistant'}
            display="flex"
            justifyContent={
              message.role=== 'assistant' ? 'flex-start' : 'flex-end'
            }
            >
            <Box
              sx={{
                backgroundColor: message.role === 'assistant' ? '#ffffff' : '#ffffff',
                color: 'black',
                border: '2px solid black',
                borderRadius: '20px',
                padding: '16px',
                maxWidth: '75%',
                position: 'relative',
                fontFamily: comicFont.fontFamily,
                boxShadow: '4px 4px 0 #000',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: message.role === 'assistant' ? '20px 20px 0 0' : '0 20px 20px 0',
                  borderColor: message.role === 'assistant' ? '#ffffff transparent transparent transparent' : '#ffffff transparent transparent transparent',
                  top: message.role === 'assistant' ? '20px' : 'auto',
                  bottom: message.role !== 'assistant' ? '20px' : 'auto',
                  left: message.role === 'assistant' ? '-20px' : 'auto',
                  right: message.role !== 'assistant' ? '-20px' : 'auto',
                  transform: message.role === 'assistant' ? 'rotate(-35deg)' : 'rotate(35deg)',
                },
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: message.role === 'assistant' ? '22px 32px 0 0' : '0 0 22px 32px',
                  borderColor: message.role === 'assistant' ? '#000 transparent transparent transparent' : '#000 transparent transparent transparent',
                  top: message.role === 'assistant' ? '18px' : 'auto',
                  bottom: message.role !== 'assistant' ? '18px' : 'auto',
                  left: message.role === 'assistant' ? '-22px' : 'auto',
                  right: message.role !== 'assistant' ? '-22px' : 'auto',
                  transform: message.role === 'assistant' ? 'rotate(-35deg)' : 'rotate(35deg)',
                },
            }}
            >
              {message.content}
              </Box>
              </ComicBubble>
        ))
        }
      </Stack>
      <Stack
      direction="row"
      spacing={2}
      bgcolor = "" 
      borderRadius={16}>
      <TextField
      sx={{
      position: 'relative',
      '& .MuiOutlinedInput-root': {
      borderRadius: '20px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      border: '2.5px solid #000',
      },
      '& .MuiInputBase-input': {
      fontFamily: 'Comic Sans MS',
      padding: '10px',
    },
      }}
      label="Message"
      variant="outlined"
      fullWidth
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      />
      <AnimatedButton
      onClick={sendMessage}
      color = "error" 
      variant = "container"
      >Send
      </AnimatedButton>
      </Stack>
    </Stack>
  </Box>
  )
}
