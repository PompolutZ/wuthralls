import React from 'react';
import FighterHUD from '../../components/FighterHUD';

// [`${myself.uid}_F3`]: {
    // type: 'FIGHTER',
    // icon: 'ironsouls-condemners-f3',
    // name: 'Tavian',
    // from: {x: -1, y: -1},
    // onBoard: {x: -1, y: -1},
    // isOnBoard: false,
    // isInspired: false,
    // wounds: 0,
// },


export default function Playground() {
    return (
        <div>
            <FighterHUD data={{
                id: 'FIGHTER_ID',
                type: 'FIGHTER',
                icon: 'ironsouls-condemners-f3',
                name: 'Tavian',
                from: {x: -1, y: -1},
                onBoard: {x: -1, y: -1},
                isOnBoard: false,
                isInspired: false,
                wounds: 0,
                guardTokens: 0,
                moveTokens: 0,
                chargeTokens: 0,
                upgrades: {
                    '05026': true,
                    '05027': true,
                }
            }} unspentGlory={5} availableUpgrades={['05025', '05028']} />
        </div>
    )
}