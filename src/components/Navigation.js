import React from 'react'
import { Link, useLocation } from 'react-router-dom'
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
                <li>
                    <Link to={`/history`}>History</Link>
                </li>
                <li>
                    <Link to={`/future`}>Upcoming changes</Link>
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
                {/* {
                    !!authUser.roles[ROLES.ADMIN] && (
                        <li>
                            <Link to={ROUTES.ADMIN}>Admin</Link>
                        </li>
                    )
                } */}
                {
                    !!authUser.roles[ROLES.ADMIN] && (
                        <li>
                            <Link to="/playground">Playground</Link>
                        </li>
                    )
                }
                <li>
                    <SignOut />
                </li>
            </ul>
            <div>{authUser.username}</div>   
            <div>ver 0.15.0</div>
            <p> New: Wurmspat and Farstriders are here!.</p> 
            <p> New: Board setup which support short to short and longwise with offset placement!.</p> 
            <p> Note: Really badly tested!.</p> 
        </div>
    )
}

const NavigationNonAuth = () => (
    <span></span>
    //     <li>
    //         <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    //     </li>
    // </ul>
)

function Navigation() {
    const authUser = useAuthUser()
    const { pathname } = useLocation();
    
    if(pathname.includes('/v1/room')) {
        return <span></span>
    }

    return <div>{authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}</div>
}
export default Navigation
