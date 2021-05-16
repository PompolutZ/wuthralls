import React from "react";
import TelegramIcon from "@material-ui/icons/QuestionAnswer";
import Button from "@material-ui/core/ButtonBase";
import { makeStyles } from "@material-ui/core/styles";
import {
    AttackSmash,
    DefenceBlock,
    MagicChannel,
} from "../../../../../../components/CommonSVGs";
import {
    ATTACK_DICE_TRAY,
    DEFENCE_DICE_TRAY,
    INITIATIVE_DICE_TRAY,
    MAGIC_DICE_TRAY,
    TELEGRAM,
} from "../constants";

const useStyles = makeStyles(() => ({
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
                onClick={() => onPickService(TELEGRAM)}
            >
                <TelegramIcon />
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService(ATTACK_DICE_TRAY)}
            >
                <div className={classes.rect}>
                    <AttackSmash className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService(DEFENCE_DICE_TRAY)}
            >
                <div className={classes.rect}>
                    <DefenceBlock className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.btn}
                onClick={() => onPickService(MAGIC_DICE_TRAY)}
            >
                <div className={classes.rect}>
                    <MagicChannel className={classes.dieSideIcon} />
                </div>
            </Button>
            <Button
                className={classes.initiativeButton}
                onClick={() => onPickService(INITIATIVE_DICE_TRAY)}
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
