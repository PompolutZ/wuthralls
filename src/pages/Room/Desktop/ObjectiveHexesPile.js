import React, { useState, useEffect, useContext } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import FlipIcon from '@material-ui/icons/Loop';
import { FirebaseContext } from '../../../firebase';
import { useAuthUser } from '../../../components/Session';

export default function ObjectiveHexesPile({ roomId, tokens, onSelectedTokenChange }) {
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const pointyTokenBaseWidth = 95;
    const [selectedToken, setSelectedToken] = useState(null);

    const handleTokenClick = token => () => {
        if(!selectedToken || selectedToken.id !== token.id) {
            setSelectedToken(token);
            onSelectedTokenChange(token);
        } else  {
            setSelectedToken(null);
            onSelectedTokenChange(null);
        }
    }

    const handleRemoveFromBoard = token => e => {
        console.log('Request remove token', token);
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.tokens.${token.id}`, {...token, isOnBoard: false, left: 0, top: 0, onBoard: {x: -1, y: -1}});
        firebase.addGenericMessage2(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} removed feature token from the board.`,
        })
    }

    const handleFlipFeature = token => e => {
        const updated = {
            ...token,
            isLethal: !token.isLethal,
        }
        
        e.preventDefault();
        firebase.updateBoardProperty(roomId, `board.tokens.${token.id}`, updated);
        firebase.addGenericMessage2(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} flipped feature token to the ${updated.isLethal ? 'lethal' : 'objective'} side.`,
        })
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
                overflow: 'scroll',
            }}
        >{
            tokens.map(token => (
                <div key={token.id} style={{ marginRight: '1rem', position: 'relative', }} onClick={handleTokenClick(token)}>
                    <img src={!token.isLethal ? `/assets/tokens/feature_front_${token.number}.png` : `/assets/tokens/feature_back.png`} style={{ width: selectedToken && selectedToken.id === token.id ? pointyTokenBaseWidth * .8 : pointyTokenBaseWidth * .7 }} />
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
                    {
                        token.isRevealed && (
                            <ButtonBase
                                    style={{
                                        position: 'absolute',
                                        top: '0%',
                                        right: '0%',
                                        backgroundColor: 'teal',
                                        color: 'white',
                                        width: '2rem',
                                        height: '2rem',
                                        borderRadius: '1.5rem',
                                    }}
                                    onClick={handleFlipFeature(token)}
                                >
                                    <FlipIcon
                                        style={{
                                            width: '1rem',
                                            height: '1rem',
                                        }}
                                    />
                            </ButtonBase>
                        )
                    }
                </div>
            ))
        }</div>
    );
}
