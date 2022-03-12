import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import StartPage from './pages/StartPage';
import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import InitialVerificationPage from './pages/InitialVerificationPage';
import UnsuccessfulInitialVerificationPage from './pages/UnsuccessfulInitialVerificationPage';

function App() {
  return (
     <div className="App">

          <PublicRoute path="/" exact>
            <StartPage/>
          </PublicRoute>
          <PublicRoute path="/auth">
            <AuthPage/>
          </PublicRoute>
          <PrivateRoute path="/home"> 
            <HomePage/>
          </PrivateRoute>
            <Switch>
              <Route path="/verification/unsuccessful" component={UnsuccessfulInitialVerificationPage}/>
              <Route path="/verification/:id/:token" component={InitialVerificationPage} />
            </Switch>

     </div>

  );
}

export default App;
