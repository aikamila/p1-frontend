import { Route, Redirect } from "react-router-dom";
import React, {useContext} from 'react';
import AuthContext from "../context/AuthContext";


const PublicRoute = ({children, ...rest}) => {
    let {authTokens} = useContext(AuthContext)
    return (
        <Route {...rest}>{authTokens ? <Redirect to='/home'/> : children}</Route>
    )
}

export default PublicRoute