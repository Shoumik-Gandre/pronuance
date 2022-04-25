import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {

  let [ratings, setRatings] = useState<any>([])
  let { authTokens, logoutUser } = useContext(AuthContext)

  useEffect(() => {

    const getRatings = async () => {

      let response = await fetch('http://127.0.0.1:8000/app/api/ratings/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/Json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        }
      })

      let data = await response.json()
      
      if (response.status === 200) { setRatings(data) }
      else if (response.statusText === "Unauthorized") { logoutUser() }
    }

    getRatings()
  }, [authTokens.access, logoutUser])

  

  return (
    <div>
      <p>HomePage</p>

      <ul>
        {ratings.map((rating: any) => (
          <li key={rating.id}>{rating.id} {rating.user} {rating.word} {rating.score}</li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage