import React, { Component } from "react";
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';

import * as ROUTES from "../../constants/routes";
import SignUpForm from './SignUpForm';

const SignUpPage = () => (
  <div style={{ margin: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <img src={`/wuc-pwa-192.png`} style={{ width: '3rem', boxSizing: "border-box", borderRadius: '1.5rem' }}/>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" style={{ flex: 1, marginLeft: '1rem' }}>WUnderworlds Club</Typography>
            <Typography variant="body2" style={{ flex: 1, marginLeft: '1rem' }}><i>Join us in the City of Mirrors fallen into Beastgrave mountain.</i></Typography>
        </div>
    </div>

    <SignUpForm />
</div>
);

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };
