import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Markdown from "react-markdown";
import PropTypes from "prop-types";

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

const cardDefaultWidth = 300;
const cardDefaultHeight = 420;

const CardMessageItem = React.memo(
    ({ author, isMineMessage, cardId, value, timestamp }) => {
        const classes = useStyles();
        const [highlight, setHighlight] = useState(false);
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        const handleSwitchHighglight = () => {
            setHighlight((prev) => !prev);
        };

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{
                    backgroundColor:
                        author === "Katophrane"
                            ? "rgba(0, 128, 128, 1)"
                            : isMineMessage
                            ? "rgba(255, 140, 0, 1)"
                            : "rgba(138, 43, 226, 1)",
                    // filter: 'drop-shadow(5px 5px 10px black)',
                }}
            >
                <div>
                    <Typography
                        variant="body2"
                        style={{
                            color: isMineMessage ? "magenta" : "ghostwhite",
                            fontWeight: "bold",
                            fontSize: ".6rem",
                        }}
                    >{`${author}`}</Typography>
                    <Typography
                        variant="body2"
                        style={{ color: "ghostwhite", fontSize: ".6rem" }}
                    >{`${
                        created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })
                    }`}</Typography>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ color: "white", flex: 1 }}>
                        <Markdown source={value} />
                    </div>
                    <Button
                        style={{ flex: "0 0 auto", color: "ghostwhite" }}
                        onClick={handleSwitchHighglight}
                    >
                        <VisibilityIcon />
                    </Button>
                </div>
                {highlight && (
                    <div
                        style={{
                            position: "fixed",
                            width: "100%",
                            height: "100%",
                            top: "0",
                            left: "0",
                            display: "flex",
                            zIndex: 100000,
                            perspective: "5rem",
                            backgroundColor: "rgba(255,255,255,.5)",
                        }}
                    >
                        <Paper
                            style={{
                                position: "relative",
                                flexShrink: 0,
                                width: cardDefaultWidth,
                                height: cardDefaultHeight,
                                margin: "auto",
                                borderRadius: "1rem",
                                backgroundPosition: "center center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `url(/assets/cards/${cardId}.png)`,
                            }}
                            elevation={10}
                            onClick={handleSwitchHighglight}
                        ></Paper>
                    </div>
                )}
            </Grid>
        );
    }
);

CardMessageItem.displayName = "CardMessageItem";
CardMessageItem.propTypes = {
    author: PropTypes.string,
    isMineMessage: PropTypes.bool,
    cardId: PropTypes.string,
    value: PropTypes.string,
    timestamp: PropTypes.number,
};
export default CardMessageItem;
