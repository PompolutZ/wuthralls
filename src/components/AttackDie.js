import React, { useState } from 'react';
import SingleAssistIcon from '../components/CommonSVGs/SingleAssist';
import DoubleAssistIcon from '../components/CommonSVGs/DoubleAssist';
import AttackFuryIcon from '../components/CommonSVGs/AttackFury';
import AttackSmashIcon from '../components/CommonSVGs/AttackSmash';
import CritIcon from '../components/CommonSVGs/Crit';

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export default function AttackDie({ side, accentColorHex, size, useBlackOutline }) {
    const {r, g, b} = hexToRgb(accentColorHex);
    return (
        <div style={{ width: size, height: size, display: 'flex', boxSizing: 'border-box', border: `2px solid ${useBlackOutline ? 'black' : accentColorHex}`, borderRadius: size * .2, backgroundColor: `rgba(${r},${g},${b}, ${useBlackOutline ? 1 : .1})` }}>
            {
                Number(side) === 1 && <SingleAssistIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
            {
                Number(side) === 2 && <AttackFuryIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
            {
                Number(side) === 3 && <AttackSmashIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
            {
                Number(side) === 4 && <AttackSmashIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
            {
                Number(side) === 5 && <DoubleAssistIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
            {
                Number(side) === 6 && <CritIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? 'black' : accentColorHex }} />
            }
        </div>
    )
}
