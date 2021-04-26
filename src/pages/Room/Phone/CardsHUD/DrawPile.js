import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import DrawCardsIcon from "@material-ui/icons/GetApp";
import { Typography } from "@material-ui/core";
import { cardDefaultHeight, cardDefaultWidth } from "../../../../constants/mix";

function Counter({ value }) {
    return (
        <div
            style={{
                position: "absolute",
                zIndex: 1,
                top: "0%",
                left: "0%",
                backgroundColor: "goldenrod",
                width: "3rem",
                height: "3rem",
                display: "flex",
                borderRadius: "1.5rem",
            }}
        >
            <Typography
                style={{
                    color: "white",
                    margin: "auto",
                    fontSize: "1.5rem",
                }}
            >
                {value}
            </Typography>
        </div>
    );
}

function Background({ variant, children }) {
    const imageUrl =
        variant === "objective"
            ? "/assets/cards/objectives_back.png"
            : "/assets/cards/powers_back.png";

    return (
        <Paper
            style={{
                position: "relative",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                width: cardDefaultWidth * 0.3,
                height: cardDefaultHeight * 0.3,
                margin: "auto",
            }}
        >
            {children}
        </Paper>
    );
}

function DrawPile({ variant, onDraw, count }) {
    return (
        <div
            style={{
                display: "flex",
                margin: "auto",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Background variant={variant}>
                <Counter value={count} />
            </Background>
            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: "1rem",
                    color: "white",
                }}
                onClick={onDraw}
                disabled={count <= 0}
            >
                <DrawCardsIcon
                    style={{
                        width: "1.5rem",
                        height: "1.5rem",
                    }}
                />
                Draw
            </Button>
        </div>
    );
}

export default DrawPile;
