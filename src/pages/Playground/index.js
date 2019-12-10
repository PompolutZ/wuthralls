import React, { useState } from 'react';
import AttackDie from '../../components/AttackDie';
import DefenceDie from '../../components/DefenceDie';
import MagicDie from '../../components/MagicDie';

export default function Playground() {
    return (
        <div>
            <AttackDie accentColorHex="#FF0000" size={36} side={6} />            
            <DefenceDie accentColorHex="#FF0000" size={36} side={1} />            
            <MagicDie size={36} side={6} />            
        </div>
    );
}
