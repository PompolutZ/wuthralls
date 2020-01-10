import React, { useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DesktopRoom from '../Desktop';
import PhoneRoom from '../Phone';

export default function RoomSizePicker({}) {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));
    const [loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setLoaded(true);
    }, [])

    if(!loaded) return <span>Loading...</span>;
    
    if(isLg) {
        console.log('DESKTOP ROOM');
        return <DesktopRoom />
    } else {
        console.log('PHONE ROOM');
        return <PhoneRoom />
    }
}