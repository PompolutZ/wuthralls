import React from 'react'
import { Link } from 'react-router-dom'
import * as ROUTES from '../constants/routes'
import * as ROLES from '../constants/roles'
import SignOut from './SignOut'
import { useAuthUser } from './Session'

function NavigationAuth({ authUser }) {
    return (
        <div>
            <ul>
                <li>
                    <Link to={ROUTES.LANDING}>Rooms</Link>
                </li>
                {/* <li>
                    <Link to={ROUTES.HOME}>Home</Link>
                </li>
                <li>
                    <Link to={ROUTES.ACCOUNT}>Account</Link>
                </li>
                <li>
                    <Link to="/playground">Playground</Link>
                </li> */}
                {
                    !!authUser.roles[ROLES.ADMIN] && (
                        <li>
                            <Link to={ROUTES.ADMIN}>Admin</Link>
                        </li>
                    )
                }
                <li>
                    <SignOut />
                </li>
            </ul>
            <div>{authUser.uid}</div>   
            <div>ver 1.1</div> 
        </div>
    )
}

const NavigationNonAuth = () => (
    <ul>
        {/* <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
        </li> */}
        <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
    </ul>
)

function Navigation() {
    const authUser = useAuthUser()

    return <div>{authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}</div>
}
export default Navigation
