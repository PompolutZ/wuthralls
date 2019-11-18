import React, { useState, useEffect } from 'react';
import { useAuthUser } from '../../components/Session';

export default function Warband({ myfighters, enemyFighters, onSelectedFighterChange }) {
    const myself = useAuthUser();
    const fighters = [...myfighters, ...enemyFighters];
    const pointyTokenBaseWidth = 95;
    const [selectedFighter, setSelectedFighter] = useState(null);

    const handleFighterClicked = fighter => () => {
        setSelectedFighter(fighter);
        onSelectedFighterChange(fighter);
    }

    useEffect(() => {
        console.log('Warband.OnUpdated', selectedFighter);
    }, [selectedFighter])

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                margin: '.5rem',
                overflow: 'scroll',
            }}
        >
            {
                fighters.map(fighter => (
                    <div key={fighter.id} style={{ marginRight: '1rem' }} onClick={handleFighterClicked(fighter)}>
                        <img src={`/assets/fighters/${fighter.icon}-icon.png`} style={{ 
                            width: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7,
                            border: fighter.id.startsWith(myself.uid) ? '3px solid green' : '3px dashed red',
                            borderRadius: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
                    </div>
                ))
            }                
        </div>
    );
}
