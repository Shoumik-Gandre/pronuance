import { List } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import RecorderCard from '../components/RecorderCard'
import AuthContext from '../context/AuthContext'

type ChallengeProps = {
  id: number,
  text: string,
  story?: number
}

const ChallengesPage = () => {
  let [challenges, setChallenges] = useState<any>([])
  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {

    const getChallenges = async () => {
      let response = await fetch('http://127.0.0.1:8000/app/api/sentences/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/Json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })
      let data = await response.json()

      if (response.status === 200) { setChallenges(data) }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    getChallenges()
  }, [authTokens.access, logoutUser])



  return (
    <div>
      <p>ChallengesPage</p>
      
      <List>
        {
          challenges.map((challenge: ChallengeProps) => <div key={challenge.id}><RecorderCard id={challenge.id} text={challenge.text} /></div>)
        }
      </List>
    </div>
  )
}

export default ChallengesPage