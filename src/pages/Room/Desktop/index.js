import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { FirebaseContext } from '../../../firebase';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Messenger from './Messager';
import ActionsPalette from './ActionsPalette';
import { useAuthUser } from '../../../components/Session';
import { cardsDb } from '../../../data/index';
import CardsHUD from './CardsHUD';
import useKatophrane from '../../../components/hooks/useKatophrane';
import MyPanel from './MyPanel';
import OpponentPanel from './OpponentPanel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import DeleteIcon from '@material-ui/icons/Delete';
import ReturnToPileIcon from '@material-ui/icons/Eject';
import Glory from '../../../components/CommonSVGs/Glory';
import { shuffle } from '../../../common/function';
import __isEqual from 'lodash/isEqual';
import RollDice from '../../../components/CommonSVGs/RollDice';
import SendIcon from '@material-ui/icons/Send';
import SendMessageAction from '../Phone/SendMessageAction';
import RollDiceAction from '../Phone/RollDiceAction';
import Overlay from './Overlay';
import Board from './Main/Board';
import Scrollbar from 'react-scrollbars-custom';
import Warbands from './Warbands';
import Cards from './CardsPanel';
import GameInfoPanel from './GameInfoPanel';
import Hexes from './Hexes';

const propertyToCards = (source, property) => {
    return (
        source &&
        source[property] &&
        source[property]
            .split(',')
            .map(cardId => ({ ...cardsDb[cardId], id: cardId }))
    );
};

const useStyles = makeStyles(theme => ({
    tabs: {
        width: '100%',
    },

    root: {
        width: '100%',
        flex: 1,
        display: 'flex',
        height: '100%',
        flexFlow: 'column nowrap',
        '& > *': {
            flex: '1 100%',
        },
    },

    boardContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        '-webkit-scrollbar': '0px',
        overflow: 'auto',
    },
}));

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const aspectRatio = 420 / 300;

const ObjectivesInHand = React.memo(({ objectives, onHighlight }) => (
    <>
        {objectives &&
            objectives.map(card => (
                <div key={card.id} onClick={onHighlight(card)}>
                    <img
                        src={`/assets/cards/${card.id}.png`}
                        style={{
                            maxHeight: '10rem',
                            margin: 'auto .5rem auto auto',
                            flex: '0 0 auto',
                        }}
                    />
                </div>
            ))}
    </>
));

export default function DesktopRoom() {
    const classes = useStyles();
    const myself = useAuthUser();
    const firebase = useContext(FirebaseContext);
    const { state } = useLocation();
    const [data, setData] = useState(state);
    const [messages, setMessages] = useState(null);
    const [overlay, setOverlay] = useState(null);
    const [overlayPayload, setOverlayPayload] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [opponentData, setOpponentData] = useState(state.players.length > 1 ? state[state.players.find(p => p !== myself.uid)] : null)
    const [boardScaleFactor, setBoardScaleFactor] = useState(.5);
    const [leftPanelSelectedTab, setLeftPanelSelectedTab] = useState(0);


    useEffect(() => {
        const unsubscribe = firebase.setRoomListener(state.id, snapshot => {
            if (snapshot.exists) {
                console.log('READ SERVER STATE');
                const serverData = { ...snapshot.data(), id: snapshot.id };
                console.log('SERVER', serverData);
                if (__isEqual(data, serverData)) return;
                console.log('SHOULD UPDATE LOCAL');
                setData(serverData);
            }
        });

        const unsubscribeFromMessages = firebase.fstore
            .collection('messages')
            .doc(state.id)
            .onSnapshot(s => {
                if (!s.data()) return;
                const msgs = Object.entries(s.data()).map(([key, value]) => ({
                    ...value,
                    id: Number(key),
                }));

                if (__isEqual(msgs, messages)) return;

                setMessages(msgs);
            });

        document.addEventListener('keydown', onKeyPress, false);

        return () => {
            unsubscribe();
            unsubscribeFromMessages();
            document.removeEventListener('keydown', onKeyPress, false);
        };
    }, []);

    const onKeyPress = e => {
        if (e.code === 'Escape') {
            setOverlay(null);
            setOverlayPayload(null);
            setSelectedElement(null);
        }
    };

    const handleClick = (type, payload) => () => {
        setOverlay(type);
        setOverlayPayload(payload);
    };

    const handleHighlightCard = (card, type) => {
        console.log(card, type);
        setOverlay(type);
        setOverlayPayload(card);
    };

    const onSelectedElementChange = element => {

    }

    const handleShowFighterInfo = fighter => {

    }

    const handleChangeLeftPanelTab = (event, newValue) => {
        setLeftPanelSelectedTab(newValue);
    }

    const handleCardsDataChange = async (key, value) => {
        console.log(key, value);
        setData({
            ...data,
            [key]: value
        });

        try {
            await firebase.updateBoardProperty(state.id, key, value);
        } catch(e) {
            console.error(e);
        }
    }

    const handleOverlayAction = ({ type, payload }) => {
        console.log('OnAction', type, payload);
        setOverlay(null);
        setOverlayPayload(null);

        switch (type) {
            case 'SCORE_OBJECTIVE':
                const nextGloryScored = Number(data[myself.uid].gloryScored) + Number(payload.glory);
                const nextHand = data[myself.uid].hand.split(',').filter(c => c !== payload.id).join(',');
                const nextScoredObjectives = data[myself.uid].sObjs ? `${data[myself.uid].sObjs},${payload.id}` : `${payload.id}`;
                setData({
                    ...data,
                    [myself.uid] : {
                        ...data[myself.uid],
                        gloryScored: nextGloryScored,
                        hand: nextHand,
                        sObjs: nextScoredObjectives
                    }
                })

                firebase.updateRoom(state.id, {
                    [`${myself.uid}.gloryScored`]: nextGloryScored,
                    [`${myself.uid}.hand`]: nextHand,
                    [`${myself.uid}.sObjs`]: nextScoredObjectives,
                });
                break;
            case 'RETURN_OBJECTIVE_TO_PILE': 
                const nextHand2 = data[myself.uid].hand.split(',').filter(c => c !== payload.id).join(',');
                const nextObjectivesPile = shuffle([...data[myself.uid].oDeck.split(','), payload.id]).join(',');
                setData({
                    ...data,
                    [myself.uid] : {
                        ...data[myself.uid],
                        hand: nextHand2,
                        oDeck: nextObjectivesPile
                    }
                })
                firebase.updateRoom(state.id, {
                    [`${myself.uid}.hand`]: nextHand2,
                    [`${myself.uid}.oDeck`]: nextObjectivesPile,
                });

                break;
            case 'DISCARD_OBJECTIVE': 
                const nextHand3 = data[myself.uid].hand.split(',').filter(c => c !== payload.id).join(',');
                const nextDiscardObjectives = data[myself.uid].dObjs ? `${data[myself.uid].dObjs},${payload.id}` : `${payload.id}`;
                setData({
                    ...data,
                    [myself.uid] : {
                        ...data[myself.uid],
                        hand: nextHand3,
                        dObjs: nextDiscardObjectives
                    }
                })
                firebase.updateRoom(state.id, {
                    [`${myself.uid}.hand`]: nextHand3,
                    [`${myself.uid}.dObjs`]: nextDiscardObjectives,
                });

                break;
            default:
                break;
        }
    }

    return (
        <div className={classes.root}>
            <div
                style={{
                    flex: '0 0 auto',
                }}
            >
                <GameInfoPanel myData={data[myself.uid]} opponentData={opponentData} round={state.status.round} />
            </div>
            <div
                style={{ flex: 2, display: 'flex' }}
            >
                <div style={{ backgroundColor: 'lightgray', flex: 1, display: 'flex', boxSizing: 'border-box', borderRadius: '.5rem', marginRight: '.5rem', marginBottom: '.5rem', marginLeft: '.5rem', flexDirection: 'column' }}>
                    <Tabs value={leftPanelSelectedTab} onChange={handleChangeLeftPanelTab} variant="standard">
                        <Tab label="Fighters" />
                        <Tab label="Hexes" />
                    </Tabs>
                    {
                        leftPanelSelectedTab === 0 && (
                            <div style={{ backgroundColor: 'lightgray', flex: 1, display: 'flex', boxSizing: 'border-box', borderRadius: '.5rem', marginRight: '.5rem', marginBottom: '.5rem', marginLeft: '.5rem'}} >
                                <Warbands 
                                    roomId={data.id}
                                    onSelectedFighterChange={setSelectedElement}
                                    myfighters={Object.entries(data.board.fighters)
                                        .map(([id, value]) => ({ ...value, id: id }))
                                        .filter(token => token.id.startsWith(myself.uid))}
                                    enemyFighters={Object.entries(data.board.fighters)
                                        .map(([id, value]) => ({ ...value, id: id }))
                                        .filter(token => !token.id.startsWith(myself.uid))}
                                    onShowSelectedFighterInfo={handleShowFighterInfo}
                                    playerInfo={data[myself.uid]}                    
                                />                                      
                            </div>              
                        )
                    }
                    {
                        leftPanelSelectedTab === 1 && (
                            <div style={{ backgroundColor: 'lightgray', flex: 1, display: 'flex', boxSizing: 'border-box', borderRadius: '.5rem', marginRight: '.5rem', marginBottom: '.5rem', marginLeft: '.5rem'}} >
                                <Hexes roomId={data.id} tokens={data.board.tokens} onSelectedElementChange={setSelectedElement} orientation={data.status.orientation} />
                            </div>              
                        )
                    }
                </div>
                <div
                    style={{
                        flex: 2,
                        position: 'relative',
                        display: 'flex',
                    }}
                >
                    <div
                        style={{
                            filter: overlay ? 'blur(3px)' : '',
                            color: 'white',
                            fontSize: '2rem',
                            flexGrow: 1,
                            position: 'relative',
                        }}
                    >
                        <div className={classes.boardContainer}>
                            <Scrollbar
                                trackYProps={{
                                    renderer: props => {
                                        const {
                                            elementRef,
                                            style,
                                            ...restProps
                                        } = props;
                                        return (
                                            <span
                                                {...restProps}
                                                style={{ ...style, background: 'rgba(255,69,0, .5)', width: 5 }}
                                                ref={elementRef}
                                                className="trackY"
                                            />
                                        );
                                    },
                                }}

                                trackXProps={{
                                    renderer: props => {
                                        const {
                                            elementRef,
                                            style,
                                            ...restProps
                                        } = props;
                                        return (
                                            <span
                                                {...restProps}
                                                style={{ ...style, background: 'rgba(255,69,0, .5)', height: 5 }}
                                                ref={elementRef}
                                                className="trackY"
                                            />
                                        );
                                    },
                                }}
                            >
                                <Board
                                    roomId={state.id} 
                                    state={data} 
                                    selectedElement={selectedElement}
                                    scaleFactor={boardScaleFactor} 
                                    onScaleFactorChange={setBoardScaleFactor}
                                />
                            </Scrollbar>
                        </div>
                    </div>
                    {overlay && (
                        <Overlay
                            type={overlay}
                            data={data}
                            roomId={state.id}
                            payload={overlayPayload}
                            onAction={handleOverlayAction}
                        />
                    )}
                </div>
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ flexGrow: 1, position: 'relative' }}>
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Scrollbar
                                trackYProps={{
                                    renderer: props => {
                                        const {
                                            elementRef,
                                            style,
                                            ...restProps
                                        } = props;
                                        return (
                                            <span
                                                {...restProps}
                                                style={{ ...style, background: 'rgba(255,69,0)', width: 5 }}
                                                ref={elementRef}
                                                className="trackY"
                                            />
                                        );
                                    },
                                }}

                                trackXProps={{
                                    renderer: props => {
                                        const {
                                            elementRef,
                                            style,
                                            ...restProps
                                        } = props;
                                        return (
                                            <span
                                                {...restProps}
                                                style={{ ...style, background: 'rgba(255,69,0)', height: 5 }}
                                                ref={elementRef}
                                                className="trackY"
                                            />
                                        );
                                    },
                                }}
                            >
                                <Messenger
                                    roomId={state.id}
                                    state={data}
                                    messages={messages}
                                />
                            </Scrollbar>
                        </div>
                    </div>
                    <div
                        style={{ padding: '.5rem' }}
                    >
                        <ButtonBase
                            onClick={handleClick('ROLL_DICE')}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: 'orangered',
                                color: 'white',
                                borderRadius: '1.5rem',
                                marginRight: '.5rem',
                                filter: 'drop-shadow(2px 2px 5px black)',
                                boxSizing: 'border-box',
                                border: '2px solid white',
                            }}
                        >
                            <RollDice
                                style={{ width: '1.5rem', height: '1.5rem' }}
                            />
                        </ButtonBase>
                        <ButtonBase
                            onClick={handleClick('SEND_MESSAGE')}
                            style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: 'orangered',
                                color: 'white',
                                borderRadius: '1.5rem',
                                filter: 'drop-shadow(2px 2px 5px black)',
                                boxSizing: 'border-box',
                                border: '2px solid white',
                            }}
                        >
                            <SendIcon
                                style={{ width: '1.5rem', height: '1.5rem' }}
                            />
                        </ButtonBase>
                    </div>
                </div>
            </div>
            <div style={{ flex: '0 1 20%'}}>
                <Cards
                    data={data[myself.uid]}
                    onHighlightCard={handleHighlightCard}
                    onDataChange={handleCardsDataChange}
                />
            </div>
        </div>
    );
}

