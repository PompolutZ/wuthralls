import React, { useState } from 'react';
import SingleAssistIcon from './CommonSVGs/SingleAssist';
import DefenceDodgeIcon from '../components/CommonSVGs/DefenceDodge';
import DefenceBlockIcon from '../components/CommonSVGs/DefenceBlock';
import DoubleAssistIcon from '../components/CommonSVGs/DoubleAssist';
import CritIcon from '../components/CommonSVGs/Crit';


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export default function DefenceDie({ side, accentColorHex, size, useBlackOutline }) {
    const {r, g, b} = hexToRgb(accentColorHex);
    return (
        <div style={{ width: size, height: size, display: 'flex', boxSizing: 'border-box', border: `2px solid ${useBlackOutline ? 'black' : accentColorHex}`, borderRadius: size * .2, backgroundColor: useBlackOutline ? 'black' : `rgba(${r},${g},${b})` }}>
            {
                Number(side) === 1 && <SingleAssistIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
            {
                Number(side) === 2 && <DefenceDodgeIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
            {
                Number(side) === 3 && <DefenceBlockIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
            {
                Number(side) === 4 && <DefenceBlockIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
            {
                Number(side) === 5 && <DoubleAssistIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
            {
                Number(side) === 6 && <CritIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: useBlackOutline ? `rgba(${r},${g},${b})` : 'white' }} />
            }
        </div>
    )
}
