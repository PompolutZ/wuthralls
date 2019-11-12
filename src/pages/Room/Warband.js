import React, { useState, useEffect } from 'react';

export default function Warband({ fighters, onSelectedFighterChange }) {
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
                overlow: 'scroll',
            }}
        >{
            fighters.map(fighter => (
                <div key={fighter.id} style={{ marginRight: '1rem' }} onClick={handleFighterClicked(fighter)}>
                    <img src={`/assets/fighters/${fighter.icon}.png`} style={{ width: selectedFighter && selectedFighter.id === fighter.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
                </div>
            ))
        }</div>
    );
}
