import React, { useEffect } from 'react';

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function Die({ side, type, style }) {
    const prefix = type === 'ATTACK' ? 'A' : type === 'DEFENCE' ? 'D' : type === 'MAGIC' ? 'M' : ['A', 'D'][getRandomIntInclusive(0, 1)];

    return <img src={`/assets/dice/${prefix}${side}.png`} style={style} alt="die" />
}

export default Die;