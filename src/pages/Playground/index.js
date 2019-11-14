import React, { useState } from 'react';
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
    const [data, setData] = useState({
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
    });

    const [unspentGlory, setUnspentGlory] = useState(2);
    const [availableUpgrades, setAvailableUpgrades] = useState(['05025', '05028']);

    const handleFighterUpdate = (type, payload) => {
        if(type === 'APPLY_UPGRADE') {
            setData({
                ...data,
                [payload.property]: payload.value,
            });

            setUnspentGlory(prev => prev - 1);
            setAvailableUpgrades(prev => prev.filter(upgrade => upgrade !== payload.appliedUpgrade));
        } else if(type === 'CHANGE_WOUNDS') {
            setData({
                ...data,
                [payload.property]: payload.value,
            })
        }
    }

    return (
        <div>
            <FighterHUD data={data} unspentGlory={unspentGlory} availableUpgrades={availableUpgrades} onUpdateFighter={handleFighterUpdate} />
        </div>
    )
}