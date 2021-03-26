import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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

const ChatMessageItem = React.memo(
    ({ author, isMineMessage, value, timestamp }) => {
        const classes = useStyles();
        const [created, setCreated] = useState(null);

        useEffect(() => {
            const date = new Date();
            date.setTime(timestamp);
            setCreated(date);
        }, []);

        return (
            <Grid
                id={timestamp}
                item
                xs={12}
                className={classes.item}
                style={{
                    backgroundColor: "#36393F",
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
                        style={{ color: "#727479", fontSize: ".6rem" }}
                    >{`${
                        created &&
                        created.toLocaleString("en-US", {
                            hour12: false,
                        })
                    }`}</Typography>
                </div>
                <div
                    style={{
                        color:
                            author === "Katophrane"
                                ? "#ACD0D4"
                                : isMineMessage
                                ? "#FFEFD5"
                                : "#FA8072",
                    }}
                >
                    <Markdown source={value} />
                </div>
            </Grid>
        );
    }
);

ChatMessageItem.displayName = "ChatMessageItem";
ChatMessageItem.propTypes = {
    author: PropTypes.string,
    isMineMessage: PropTypes.bool,
    value: PropTypes.string,
    timestamp: PropTypes.number,
};

export default ChatMessageItem;
