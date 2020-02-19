import React, { useState, useEffect, useRef } from 'react';
import AttackDie from '../../components/AttackDie';
import DefenceDie from '../../components/DefenceDie';
import MagicDie from '../../components/MagicDie';

import * as SVG from 'svg.js';
import { defineGrid, extendHex } from 'honeycomb-grid';
import ButtonBase from '@material-ui/core/ButtonBase';
import { 
    cardsDb,
    boards as boardsData
} from '../../data';

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

// function Item({ id }) {
//     return (
//         <div style={{ width: 300 * (200 / 420), height: 420 * (200 / 420), position: 'absolute', left: "50%", marginLeft: -(300 * (200 / 420)) / 2 }}>
//             <img src={`/assets/cards/${id}.png`} style={{ width: '100%' }} />
//         </div>
//     )
// }

// function Container() {
//     const [items, setItems] = useState(["06001"]);
//     const containerRef = useRef(null);

//     useEffect(() => {
//         const { offsetHeight, offsetWidth } = containerRef.current;
//         console.log(offsetHeight, offsetWidth);
//     }, []);

//     return (
//         <div ref={containerRef} style={{ flexGrow: 1, backgroundColor: 'dimgray', position: 'relative' }}>
//             {
//                 items.map((id, index, arr) => (
//                     <Item key={id} id={id} />
//                 ))
//             }
//         </div>
//     )
// }

export default function Playground() {
    return (
        <div
            style={{
                background: 'white',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ flex: 1 }}></div>
            <div style={{ flex: '0 0 30%', backgroundColor: 'magenta', display: 'flex' }}>
            </div>
        </div>
    );
}
