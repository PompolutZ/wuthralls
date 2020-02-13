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
                {
                    !!authUser.roles[ROLES.ADMIN] && (
                        <li>
                            <Link to="/users-updater">Users Updater</Link>
                        </li>
                    )
                }
                <li>
                    <SignOut />
                </li>
            </ul>
            <div>Welcome {authUser.username} to the Club (ver. 0.16)</div>   
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
