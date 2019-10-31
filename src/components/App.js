import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navigation from './Navigation'
import Landing from './Landing'
import SignUpPage from './SignUpPage'
import SignInPage from './SignInPage'
import PasswordForget from './PasswordForget'
import Home from './Home'
import Account from './Account'
import Admin from './Admin'
import * as ROUTES from '../constants/routes'
import Tables from '../pages/Tables'
import Prepare from '../pages/Prepare'
import Game from '../pages/Game'

function App() {
    return (
        <Router>
            <div>
                <Navigation />

                <hr />

                <Route exact path={ROUTES.LANDING} component={Tables} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForget}
                />
                <Route path={ROUTES.HOME} component={Home} />
                <Route path={ROUTES.ACCOUNT} component={Account} />
                <Route path={ROUTES.ADMIN} component={Admin} />
                <Route path="/:version/table/:tableId/prepare" component={Prepare} />
                <Route path="/:version/game/:tableId" component={Game} />
            </div>
        </Router>
    )
}

export default App
