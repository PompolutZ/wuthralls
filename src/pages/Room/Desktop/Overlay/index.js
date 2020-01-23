import React, { useEffect } from 'react';
import SendMessageOverlay from './SendMessageOverlay';
import RollDiceOverlay from './RollDiceOverlay';
import { useAuthUser } from '../../../../components/Session';
import ObjectiveInteractionOverlay from './ObjectiveInteractionOverlay';

export default function Overlay({ type, data, roomId, payload, onAction }) {
    const myself = useAuthUser();
    
    useEffect(() => {
        console.log('OVERLAY', type);
    }, [type, payload]);
    
    return (
        <div style={{ position: 'absolute', backgroundColor: 'rgba(255,255,255,.5)', top: 0, left: 0, bottom: 0, right: 0, display: 'flex' }}>
            <div style={{ margin: 'auto 1rem', display: 'flex', alignItems: 'center', width: '100%' }}>
                {
                    type === 'SEND_MESSAGE' && (
                        <SendMessageOverlay roomId={data.id} />                              
                    )
                }
                {
                    type === 'ROLL_DICE' && (
                        <RollDiceOverlay roomId={roomId} defaultAmount={4} myFaction={data[myself.uid].faction} />
                    )
                }
                {
                    type === 'OBJECTIVE_HIGHLIGHT' && (
                        <ObjectiveInteractionOverlay data={data} card={payload} onAction={onAction} />
                    )
                }
            </div>
        </div>                            
    )
}