import React, { useState, useEffect, useContext } from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import { FirebaseContext } from '../../../firebase';
import { useAuthUser } from '../../../components/Session';
import Typography from '@material-ui/core/Typography';

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
        firebase.addGenericMessage2(roomId, {
            author: 'Katophrane',
            type: 'INFO',
            subtype: 'PLACEMENT',
            value: `${myself.username} removed lethal hex token from the board.`,
        })
    }
    return (
        <>{
            tokens.map(token => {
                console.log(token.id, selectedToken && selectedToken.id === token.id);

                return (
                    <div key={token.id} style={{ marginRight: '1rem', paddingTop: '1rem', paddingLeft: '1rem' }} onClick={handleTokenClick(token)}>
                        <div style={{ width: pointyTokenBaseWidth * .7, position: 'relative'  }}>
                            <img src={`/assets/tokens/lethal.png`} style={{ width: '100%', filter: selectedToken && selectedToken.id === token.id ? 'drop-shadow(0 2px 10px magenta)' : '' }} />
                            {
                                selectedToken && selectedToken.id === token.id && (
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
                                                boxSizing: 'border-box',
                                                border: '2px solid white',
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
                                )
                            }
                        </div>
                        <Typography>{`${token.id}`}</Typography>
                    </div>
                )
            })
        }</>
    );
}
