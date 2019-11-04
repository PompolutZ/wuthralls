import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthUser } from '../../components/Session';
import DiceTray from '../../components/DiceTray';
import { FirebaseContext } from '../../firebase';
import { Typography, Button } from '@material-ui/core';
import { boards } from '../../data';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as SVG from 'svg.js';

const baseBoardWidth = 757;
const baseBoardHeight = 495;

function InitiativeRollMaker({ data, tableId }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const [myPreviousRollResult, setMyPreviousRollResult] = useState((myself && data[myself.uid]) || null);

    useEffect(() => {
        console.log(data);
        console.log('Prev Roll Res: ', myPreviousRollResult);
    }, []);

    useEffect(() => {
        console.log("Updated Data");
        setMyPreviousRollResult((myself && data[myself.uid]) || null);
    }, [data]);

    const handleMyRollForInitiative = async rollResult => {
        console.log(myself.uid, 'rolled', rollResult);
        await firebase.updateInitiativeRoll(tableId, myself.uid, rollResult.join())
    }

    return (
        <div>
            <DiceTray defaultAmount={4} rollResult={myPreviousRollResult} onRollBeingMade={handleMyRollForInitiative} canRoll={data.waitingFor.includes(myself.uid)} />
        </div>
    );
}

export default InitiativeRollMaker;