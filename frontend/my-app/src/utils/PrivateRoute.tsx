import { useContext } from 'react';
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';


const PrivateRoute = ({
    redirectPath = '/login',
    children,
  }: any) => {
    let {user} = useContext(AuthContext)

    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
  
    return children;
  };


export default PrivateRoute