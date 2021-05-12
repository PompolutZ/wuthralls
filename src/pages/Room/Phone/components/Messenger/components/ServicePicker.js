import React from "react";
import TelegramIcon from "@material-ui/icons/QuestionAnswer";
import Button from "@material-ui/core/ButtonBase";
import { makeStyles } from "@material-ui/core/styles";
import {
    AttackSmash,
    DefenceBlock,
    MagicChannel,
} from "../../../../../../components/CommonSVGs";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "grid",
        gridTemplateColumns: "10% 10% 10% 10% 10%",
    },

    btn: {
        color: "white",
        borderRadius: ".5rem",
        padding: ".25rem",
    },

    rect: {
        display: "grid",
        placeContent: "center",
        boxSizing: "border-box",
        border: "1px solid white",
        borderRadius: ".25rem",
        background: "rgba(255,255,255,.1)",
    },

    dieSideIcon: {
        margin: ".25rem",
        width: "1rem",
        height: "1rem",
    },

    initiativeButton: {
        color: "white",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        columnGap: "2px",
        rowGap: "2px",
        transform: "scale(.5)",
    },
}));

function ServicePicker({ onPickService }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Button
                className={classes.btn}
                onClick={() => onPickService("Telegram")}
            >
                <TelegramIcon />
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService("AttackDiceTray")}
            >
                <div className={classes.rect}>
                    <AttackSmash className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService("DefenceDiceTray")}
            >
                <div className={classes.rect}>
                    <DefenceBlock className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService("MagicDiceTray")}
            >
                <div className={classes.rect}>
                    <MagicChannel className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.initiativeButton}
                onClick={() => onPickService("InitiativeDiceTray")}
            >
                <div className={classes.rect}>
                    <AttackSmash className={classes.dieSideIcon} />
                </div>
                <div className={classes.rect}>
                    <DefenceBlock className={classes.dieSideIcon} />
                </div>
                <div className={classes.rect}>
                    <DefenceBlock className={classes.dieSideIcon} />
                </div>
                <div className={classes.rect}>
                    <AttackSmash className={classes.dieSideIcon} />
                </div>
            </Button>
        </div>
    );
}

export default ServicePicker;
