import React from 'react';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import Shedule from './routes/Shedule';
import Page404 from './routes/Page404';
import Home from './routes/Home';
import './Routes.css';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
          <Route 
            exact path="/" 
            render={()=><Redirect to="/home" />} />
          <Route 
            exact path="/home"
            component={Home} 
             /> 
          <Route 
            exact path="/shedule" 
            component={Shedule}/>
          <Route 
            path="*"
            children={Page404} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
