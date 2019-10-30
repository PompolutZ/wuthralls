import React from 'react';
import { withAuthorization } from './Session';
import DiceTray from './DiceTray';

function Home() {
    return (
        <div>
            Home
            <DiceTray defaultAmount={4} />
        </div>
    )
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);