'use client'
import Image from "next/image";
import { useState } from "react";
import{ Box, Stack, TextField, Button, BottomNavigation, BottomNavigationAction, SpeedDial,SpeedDialIcon, SpeedDialAction } from '@mui/material'
import React from "react";
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';





export default function Home() {
  const [messages, setMessages] = useState([
    {
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agent, how can I assist you today?`
  }
])

  const [value, setValue] = React.useState(0);


  const [message, setMessage] = useState('')

  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

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
  background: 'linear-gradient(to right, #fcfcfc, #e8c1c8)',
  height: '100vh',
  display: 'flex',
  flexDirection: "column",
  justifyContent: 'center',
  alignItems: 'center'
}}
  >

<SpeedDial
  ariaLabel="SpeedDial basic example"
  sx={{ position: 'absolute', bottom: 16, right: 16 }}
  icon={<SpeedDialIcon />}
>
  {actions.map((action) => (
    <SpeedDialAction
      key={action.name}
      icon={action.icon}
      tooltipTitle={action.name}
    />
  ))}
</SpeedDial>

    <Stack 
    bgcolor="white"
    direction = "column"
    width = "600px"
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
              ? 'primary.main' 
              : 'secondary.main'
            }
            color="white"
            borderRadius={16}
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
