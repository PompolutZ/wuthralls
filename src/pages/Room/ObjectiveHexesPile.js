import React, { useState, useEffect } from 'react';

export default function ObjectiveHexesPile({ tokens, onSelectedTokenChange }) {
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = token => () => {
        setSelectedToken(token);
        onSelectedTokenChange(token);
    }

    useEffect(() => {
        console.log('ObjectiveHexesPile.OnUpdated', selectedToken);
    }, [selectedToken])

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                margin: '.5rem',
            }}
        >{
            tokens.map(token => (
                <div key={token.id} style={{ marginRight: '1rem' }} onClick={handleTokenClick(token)}>
                    <img src={token.isRevealed ? `/assets/tokens/feature_front_${token.number}.png` : `/assets/tokens/feature_back.png`} style={{ width: selectedToken && selectedToken.id === token.id ? pointyTokenBaseWidth * .5 : pointyTokenBaseWidth * .4 }} />
                </div>
            ))
        }</div>
    );
}
