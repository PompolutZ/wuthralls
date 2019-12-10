import React, { useState } from 'react';
import MagicChannelIcon from '../components/CommonSVGs/MagicChannel';
import MagicFocusIcon from '../components/CommonSVGs/MagicFocus';
import CritIcon from '../components/CommonSVGs/Crit';

export default function MagicDie({ side, size }) {
    return (
        <div style={{ width: size, height: size, display: 'flex', boxSizing: 'border-box', border: `2px solid indigo`, borderRadius: size * .2, background: 'rgb(255,255,255)', background: 'linear-gradient(212deg, rgba(255,255,255,1) 0%, rgba(195,251,77,1) 20%, rgba(18,255,225,1) 80%, rgba(255,255,255,1) 100%)', }}>
            {
                Number(side) === 1 && <MagicChannelIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
            {
                Number(side) === 2 && <MagicFocusIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
            {
                Number(side) === 3 && <MagicChannelIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
            {
                Number(side) === 4 && <MagicFocusIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
            {
                Number(side) === 5 && <MagicChannelIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
            {
                Number(side) === 6 && <CritIcon style={{ margin: 'auto', width: size * .8, height: size * .8, color: 'indigo' }} />
            }
        </div>
    )
}
