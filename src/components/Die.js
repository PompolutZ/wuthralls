import React, { useEffect } from 'react';

function Die({ side, type, style }) {
    const prefix = type === 'ATTACK' ? 'A' : 'D';

    return <img src={`/assets/dice/${prefix}${side}.png`} style={style} alt="die" />
}

export default Die;