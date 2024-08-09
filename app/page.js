'use client'
import Image from "next/image";
import { useState } from "react";
import{ Box, Stack, TextField, Button, SpeedDial,SpeedDialIcon, SpeedDialAction} from '@mui/material'
import React from "react";
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';


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
