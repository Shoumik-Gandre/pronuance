import { Divider, Typography } from '@mui/material'
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LogoutPage = () => {

    const {user, logoutUser} = useContext(AuthContext)

    useEffect(() => {
        if (user) { logoutUser(false) }
    }, [user, logoutUser])

    return (
        <div>
            <Typography variant='h2'>You have been Logged out</Typography>
            <Divider variant="fullWidth" />
            <Typography variant='h6' component={Link} to='/login'>
                Login again?
            </Typography>
        </div>
    )
}

export default LogoutPage