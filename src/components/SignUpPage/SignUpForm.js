import React from 'react';
import { withRouter } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
}

function SignUpForm({ history }) {
    const firebase = React.useContext(FirebaseContext)

    const [
        { username, email, passwordOne, passwordTwo, error, isAdmin },
        setSignUpFormState,
    ] = React.useState(INITIAL_STATE);

    const onSubmit = event => {
        const roles = {};

        if(isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }

        firebase
            .createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return firebase.user(authUser.user.uid).set({
                    username,
                    email,
                    roles,
                })
            })
            .then(() => {
                setSignUpFormState(INITIAL_STATE)
                history.push(ROUTES.HOME)
            })
            .catch(error =>
                setSignUpFormState(prev => ({ ...prev, error: error }))
            )

        event.preventDefault()
    }

    const onChange = event => {
        const { name, value } = event.target
        setSignUpFormState(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const onChangeCheckbox = event => {
        const { name, checked } = event.target;
        setSignUpFormState(prev => ({
            ...prev,
            [name]: checked
        }));
    }

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        username === ''

    return (
        <form onSubmit={onSubmit} style={{ flexGrow: 1 }}>
            <Grid container spacing={3} style={{  }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="username"
                        value={username}
                        onChange={onChange}
                        type="text"
                        placeholder="Your Heroic Name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="email"
                        value={email}
                        onChange={onChange}
                        type="text"
                        placeholder="Email Address (could be fake one)"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="passwordOne"
                        value={passwordOne}
                        onChange={onChange}
                        type="password"
                        placeholder="Password (if fake email don't forget it)"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="passwordTwo"
                        value={passwordTwo}
                        onChange={onChange}
                        type="password"
                        placeholder="Password one more time to remember"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" disabled={isInvalid} variant="contained" color="primary">
                        I confirm my desire to join the club and to become a thrall of Katophranes, or whoever in charge nowadays 
                    </Button>
                    {error && <p>{error.message}</p>}
                </Grid>
            </Grid>
        </form>
    )
}

export default withRouter(SignUpForm)
