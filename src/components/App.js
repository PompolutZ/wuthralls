import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Landing from './Landing';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import PasswordForget from './PasswordForget';
import Home from './Home';
import Account from './Account';
import Admin from './Admin';
import * as ROUTES from '../constants/routes';
import Tables from '../pages/Tables';
import Prepare from '../pages/Prepare';
import Game from '../pages/Game';
import InteractiveBoard from '../pages/InteractiveBoard';
import Rooms from '../pages/Rooms';
import Playground from '../pages/Playground';
import RoomSizePicker from '../pages/Room/RoomSizePicker';
import SpawnRoom from '../pages/SpawnRoom';
import History from '../pages/History';
import Future from '../pages/Future';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import UserUpdater from '../pages/UserUpdater';
import PlayerInfo from '../pages/PlayerInfo';

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

function App() {
    const [open, setOpen] = useState(false);
    return (
        <Router>
            <div style={{ width: '100%', height: '100%' }}>
                <Navigation />

                <Route exact path={ROUTES.LANDING} component={Rooms} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForget}
                />
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route path={ROUTES.ADMIN} component={Admin} />
                <Route
                    exact
                    path="/:version/room/:roomId/prepare"
                    component={Prepare}
                />
                <Route exact path="/:version/new/room" component={SpawnRoom} />
                <Route path="/:version/game/:tableId" component={Game} />
                <Route path="/playground" component={Playground} />
                <Route path="/users-updater" component={UserUpdater} />
                <Route
                    exact
                    path="/:version/room/:roomId"
                    component={RoomSizePicker}
                />
                <Route exact path="/history" component={History} />
                <Route exact path="/future" component={Future} />
                <Route exact path="/player-info" component={PlayerInfo} />
            </div>
        </Router>
    );
}

export default App;
