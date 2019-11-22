import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DesktopRoom from '../Desktop';
import PhoneRoom from '../Phone';

export default function RoomSizePicker({}) {
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'));

    if(isMd) {
        return <DesktopRoom />
    } else {
        return <PhoneRoom />
    }
}