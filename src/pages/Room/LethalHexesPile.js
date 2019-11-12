import React, { useState, useEffect } from 'react';

export default function LethalHexesPile({ tokens, onSelectedTokenChange }) {
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = token => () => {
        setSelectedToken(token);
        onSelectedTokenChange(token);
    }

    useEffect(() => {
        console.log('LethalHexesPile.OnUpdated', selectedToken);
    }, [selectedToken])

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
            tokens.map(token => (
                <div key={token.id} style={{ marginRight: '1rem' }} onClick={handleTokenClick(token)}>
                    <img src={`/assets/tokens/lethal.png`} style={{ width: selectedToken && selectedToken.id === token.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
                </div>
            ))
        }</div>
    );
}
