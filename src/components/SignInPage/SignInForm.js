import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import * as ROUTES from '../../constants/routes'
import { FirebaseContext } from '../../firebase';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
}

function SignInForm({ history }) {
    const [{ email, password, error }, setSignInFormState] = React.useState(INITIAL_STATE);
    const firebase = React.useContext(FirebaseContext);

    const isInvalid = password === '' || email === ''

    const onChange = event => {
        const { name, value } = event.target;
        setSignInFormState(prev => ({...prev, [name]: value}));
    }

    const onSubmit = event => {
        firebase
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                setSignInFormState(INITIAL_STATE);
                history.push(ROUTES.LANDING)
            })
            .catch(error => {
                setSignInFormState(prev => ({ ...prev, error: error }));
            });

        event.preventDefault();
    }

    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={3} style={{ padding: '1rem'}}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="email"
                        value={email}
                        onChange={onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="password"
                        value={password}
                        onChange={onChange}
                        type="password"
                        placeholder="Password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button disabled={isInvalid} type="submit" color="primary" variant="contained">
                        Sign In
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {error && <p>{error.message}</p>}
                </Grid>
            </Grid>

        </form>
    )
}

export default withRouter(SignInForm);