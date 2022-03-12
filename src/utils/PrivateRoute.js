import { Route, Redirect } from "react-router-dom";
import React, {useContext} from 'react';
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({children, ...rest}) => {
    let {authTokens} = useContext(AuthContext)
    return (
        <Route {...rest}>{!authTokens ? <Redirect to='/auth'/> : children}</Route>
    )
}

export default PrivateRoute
