import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../../context/AuthContext'

const Header: React.FC = (): JSX.Element => {

  let {user, logoutUser} = useContext(AuthContext)
  
  return (
    <div>
      <Link to='/'>Home</Link>
      <span> | </span>
      {user ? (<button onClick={logoutUser}>Logout</button>): (<Link to='/login'>Login</Link>)}

      {user && <p>Hello {user?.username}</p>}

    </div>
  )
}

export default Header