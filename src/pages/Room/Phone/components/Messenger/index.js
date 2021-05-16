import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ServicePicker from "./components/ServicePicker";
import { Services } from "./components/Services";
import { TELEGRAM } from "./constants";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: "flex",
        padding: "1rem .5rem",
        flexDirection: "column",
    },

    message: {
        flex: 1,
    },

    sendButton: () => ({
        color: "rgba(255,255,255, .9)",
    }),
}));

function Messenger() {
    const classes = useStyles();
    const [activeService, setActiveService] = useState(TELEGRAM);

    return (
        <div className={classes.root}>
            <ServicePicker onPickService={setActiveService} />

            {Services[activeService]}
        </div>
    );
}

export default Messenger;
