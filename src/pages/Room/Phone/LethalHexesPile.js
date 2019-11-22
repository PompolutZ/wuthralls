import React, { useState, useEffect, useContext } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import { FirebaseContext } from '../../../firebase';
import { useAuthUser } from '../../../components/Session';

export default function LethalHexesPile({ roomId, tokens, onSelectedTokenChange }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = token => () => {
        setSelectedToken(token);
        onSelectedTokenChange(token);
    }

    useEffect(() => {
        console.log('LethalHexesPile.OnUpdated', selectedToken);
    }, [selectedToken])

    const handleRemoveFromBoard = token => e => {
        console.log('Request remove token', token);
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.tokens.${token.id}`, {...token, isOnBoard: false, left: 0, top: 0, onBoard: {x: -1, y: -1}});
        firebase.addGenericMessage(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} removed lethal hex token from the board.`,
        })
    }

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
                <div key={token.id} style={{ marginRight: '1rem', position: 'relative', }} onClick={handleTokenClick(token)}>
                    <img src={`/assets/tokens/lethal.png`} style={{ width: selectedToken && selectedToken.id === token.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
                    <ButtonBase
                            style={{
                                position: 'absolute',
                                bottom: '0%',
                                right: '0%',
                                backgroundColor: 'red',
                                color: 'white',
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '1.5rem',
                            }}
                            onClick={handleRemoveFromBoard(token)}
                        >
                            <DeleteIcon
                                style={{
                                    width: '1rem',
                                    height: '1rem',
                                }}
                            />
                    </ButtonBase>
                </div>
            ))
        }</div>
    );
}
