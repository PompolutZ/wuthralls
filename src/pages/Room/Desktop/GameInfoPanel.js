import React from 'react';
import Typography from '@material-ui/core/Typography';
import { cardsDb } from '../../../data';

export default React.memo(({ myData, opponentData, round }) => {
    const myHand = myData && myData.hand ? myData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];
    const opponentHand = opponentData && opponentData.hand ? opponentData.hand.split(',').map(cardId => ({ ...cardsDb[cardId], id: cardId })) : [];

    return (
        <div style={{ flex: '0 0 100%', display: 'flex', borderBottom: '1px solid lighgray', paddingBottom: '.2rem', marginBottom: '.2rem', alignItems: 'center' }}>
        {
            myData && (
                <div style={{ display: 'flex', flexDirection: 'row-reverse', flex: 1, borderRight: '1px solid gray', paddingRight: '.2rem', alignItems: 'center' }}>
                    <img src={`/assets/factions/${myData.faction}-icon.png`} style={{ width: '1.5rem', height: '1.5rem' }} />
                    <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'goldenrod', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.gloryScored}</Typography>
                    </div>
                    <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'darkgray', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.glorySpent}</Typography>
                    </div>
                    <div style={{ marginRight: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'teal', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myData.activationsLeft}</Typography>
                    </div>
                    <div style={{ marginRight: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'goldenrod', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myHand.filter(c => c.type === 0).length}</Typography>
                    </div>
                    <div style={{ marginRight: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'teal', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{myHand.filter(c => c.type !== 0).length}</Typography>
                    </div>
                    {/* <ButtonBase onClick={handleIncreazeScaleFactor} style={{ flex: 1}}>
                        <ZoomInIcon />
                    </ButtonBase> */}
                </div>
            )
        }
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto .5rem auto .5rem' }}>
            <Typography style={{ fontSize: '.7rem'}}>{round}</Typography>
        <Typography style={{ fontSize: '.5rem'}}>round</Typography>
        </div>
        {
            opponentData && (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                    <img src={`/assets/factions/${opponentData.faction}-icon.png`} style={{ width: '1.5rem', height: '1.5rem', borderLeft: '1px solid gray', paddingLeft: '.2rem' }} />
                    <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'goldenrod', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.gloryScored}</Typography>
                    </div>
                    <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'darkgray', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.glorySpent}</Typography>
                    </div>
                    <div style={{ marginLeft: '.2rem', width: '1.2rem', height: '1.2rem', backgroundColor: 'teal', borderRadius: '1rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentData.activationsLeft}</Typography>
                    </div>
                    <div style={{ marginLeft: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'goldenrod', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentHand.filter(c => c.type === 0).length}</Typography>
                    </div>
                    <div style={{ marginLeft: '.2rem', width: '1rem', height: '1.5rem', backgroundColor: 'teal', borderRadius: '.2rem', color: 'white', display: 'flex' }}>
                        <Typography style={{ margin: 'auto', fontSize: '.7rem' }}>{opponentHand.filter(c => c.type !== 0).length}</Typography>
                    </div>
                    {/* <ButtonBase onClick={handleDecreaseScaleFactor}>
                        <ZoomOutIcon />
                    </ButtonBase> */}
                </div>
            )
        }
    </div> 

    );
})