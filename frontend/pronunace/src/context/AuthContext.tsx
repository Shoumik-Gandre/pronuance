import { createContext, useEffect, useState } from "react"
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


export type AuthContextType = {
    username: string,
    loginUser: Function
}

const AuthContext = createContext<any>(null)

export default AuthContext


export const AuthProvider = ({ children }: any) => {

    let tokenstr = localStorage.getItem('authTokens')
    let token = tokenstr ? JSON.parse(tokenstr) : null
    let user_init = tokenstr ? jwt_decode(token.access) : null

    let [authTokens, setAuthTokens] = useState(() => token);
    let [user, setUser] = useState(user_init);
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const loginUser = async (event: React.FormEvent<HTMLFormElement>, toHome: boolean=false) => {
        event.preventDefault()

        const logindata = new FormData(event.currentTarget);

        let response = await fetch('http://127.0.0.1:8000/auth/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                'username': logindata.get('username'), 
                'password': logindata.get('password') 
            })
        });
        
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            if (toHome) { navigate('/') }
        } else {
            alert("Something went wrong!")
        }

    }

    const logoutUser = (toLogin: boolean = true) => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        if (toLogin === true) { navigate('/login') }
    }

    const updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/auth/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'refresh': authTokens?.refresh })
        })

        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    useEffect(() => {
        if (loading) { updateToken() }

        const fourMinutes = 1000 * 60 * 4

        let interval = setInterval(() => {
            if (authTokens) { updateToken() }
        }, fourMinutes)

        return () => clearInterval(interval)
    })

    return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>
}