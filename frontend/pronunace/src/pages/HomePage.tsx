import React, { useState, useContext } from 'react'
import { TextField, Typography, Button, CircularProgress } from '@mui/material'
import AuthContext from '../context/AuthContext'
import { APPEAL_WORD_TEXT } from '../constants/api_url';


const HomePage = () => {

  let { authTokens, logoutUser } = useContext(AuthContext)
  const [isLoadingAppeal, setIsLoadingAppeal] = useState(false)
  const [appealWord, setAppealWord] = useState("")

  const appealWordWithText = async (text: string) => {

    let formData = new FormData()

    formData.append('word', text)
    console.log(text)

    try {
      setIsLoadingAppeal(true)
      let response = await fetch(APPEAL_WORD_TEXT, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + String(authTokens.access) },
        body: formData
      })
      let data = await response.json()

      if (response.status === 200) {

        if (data.status === 'done') {
          setIsLoadingAppeal(false)
        }
      }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }
    catch { }
    finally {
      setIsLoadingAppeal(false)
    }
  }




  return (
    <>
      <Typography>HomePage</Typography>
      <TextField
        id="standard-search"
        label="Appeal Word"
        variant="standard"
        fullWidth={true}
        value={appealWord}
        onChange={(event) => {
          setAppealWord(event.target.value)
        }}
      />
      <Button
        variant="text"
        onClick={() => { appealWordWithText(String(appealWord)) }}
      >
        Appeal Word
      </Button>
      {
        isLoadingAppeal ? <CircularProgress /> : null
      }
    </>
  )
}

export default HomePage