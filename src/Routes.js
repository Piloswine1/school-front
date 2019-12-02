import React from 'react';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import Shedule from './routes/Shedule';
import Page404 from './routes/Page404';
import Home from './routes/Home';
import AdminPage from './routes/AdminPage';
import GroupEditor from './routes/GroupEditor';
import SheduleEditor from './routes/SheduleEditor';
import Group from './routes/Group';
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
            component={Home}/> 
          <Route 
            exact path="/shedule" 
            component={Shedule}/>
          <Route 
            path="/shedule/:id" 
            component={Group}/>
          <Route
            exact path="/admin"
            component={AdminPage}/>
          <Route 
            exact path="/admin/group-editor"
            component={GroupEditor}/>
          <Route
            exact path="/admin/shedule-editor"
            component={SheduleEditor}/>
          <Route 
            path="*"
            component={Page404} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
