import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { warbandColors } from "../../../../data";
import PropTypes from "prop-types";
import { hexToRgb } from "../../../../utils";
import AttackDie from "../../../../components/AttackDie";
import DefenceDie from "../../../../components/DefenceDie";
import MagicDie from "../../../../components/MagicDie";

const useStyles = makeStyles(() => ({
    item: {
        // margin: '.5rem 1rem .5rem .5rem',
        padding: ".5rem",
        // borderRadius: '.3rem',
    },

    root: {
        flexGrow: 1,
    },
}));

const DiceRollMessage = React.memo(
    ({ author, value, type, timestamp, authorFaction }) => {
        const classes = useStyles();
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, [timestamp]);

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{
                    backgroundColor: hexToRgb(
                        warbandColors[authorFaction],
                        0.8
                    ),
                }}
            >
                <Typography
                    variant="body2"
                    style={{
                        color: "ghostwhite",
                        fontWeight: "bold",
                        fontSize: ".6rem",
                    }}
                >{`${author} rolls ${type}:`}</Typography>
                <Typography
                    variant="body2"
                    style={{ color: "lightgray", fontSize: ".6rem" }}
                >{`${
                    created &&
                    created.toLocaleString("en-US", {
                        hour12: false,
                    })
                }`}</Typography>
                <div style={{ display: "flex", margin: "1rem" }}>
                    {value.split(",").map((x, i) => (
                        <div
                            key={i}
                            style={{
                                width: 36,
                                height: 36,
                                marginRight: ".2rem",
                                backgroundColor: "white",
                                borderRadius: 36 * 0.2,
                                filter: "drop-shadow(2.5px 2.5px 5px black)",
                            }}
                        >
                            {type === "ATTACK" && (
                                <AttackDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz" ||
                                        authorFaction === "khagras-ravagers"
                                    }
                                />
                            )}
                            {type === "DEFENCE" && (
                                <DefenceDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz" ||
                                        authorFaction === "khagras-ravagers"
                                    }
                                />
                            )}
                            {type === "MAGIC" && (
                                <MagicDie size={36} side={Number(x)} />
                            )}
                            {type === "INITIATIVE" && i % 2 === 0 && (
                                <DefenceDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz" ||
                                        authorFaction === "khagras-ravagers"
                                    }
                                />
                            )}
                            {type === "INITIATIVE" && i % 2 !== 0 && (
                                <AttackDie
                                    accentColorHex={
                                        warbandColors[authorFaction]
                                    }
                                    size={36}
                                    side={Number(x)}
                                    useBlackOutline={
                                        authorFaction === "zarbags-gitz" ||
                                        authorFaction === "khagras-ravagers"
                                    }
                                />
                            )}
                        </div>
                    ))}
                </div>
            </Grid>
        );
    }
);

DiceRollMessage.displayName = "DiceRollMessage";
DiceRollMessage.propTypes = {
    author: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    timestamp: PropTypes.number,
    authorFaction: PropTypes.string,
};

export default DiceRollMessage;
