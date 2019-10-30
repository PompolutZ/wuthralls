import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Die from './Die';

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function DiceTray({ defaultAmount }) {
    const [values, setValues] = useState(defaultAmount ? new Array(defaultAmount).fill(1) : []);

    const handleRollClick = () => {
        const updated = values.map(_ => getRandomIntInclusive(1, 6));
        setValues(updated);
    }

    const handleAddMore = () => {
        setValues(prev => [...prev, 1]);
    }

    const handleMakeLess = () => {
        setValues(prev => prev.slice(1))
    }

    return (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
            <div style={{ display: 'flex' }}>
                {
                    values.length > 0 && (
                        values.map((x, i) => (
                            <Die key={i} side={x} type="ATTACK" style={{ width: '3rem', height: '3rem', marginRight: '.2rem' }} />
                        ))
                    )
                }
            </div>
            <div style={{ display: 'flex' }}>
                <Button variant="contained" color="primary" onClick={handleMakeLess}>
                    Less
                </Button>

                <Button onClick={handleRollClick}>
                    Roll
                </Button>

                <Button variant="contained" color="primary" onClick={handleAddMore}>
                    More
                </Button>
            </div>
        </div>
    )
}

export default DiceTray;