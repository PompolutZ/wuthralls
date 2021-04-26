import React from "react";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
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
                width: cardDefaultWidth * 0.4,
                height: cardDefaultHeight * 0.4,
                margin: "auto",
            }}
        >
            {children}
        </Paper>
    );
}

function DrawPile({ variant, onDraw, count }) {
    return (
        <Background variant={variant}>
            <ButtonBase
                style={{
                    position: "absolute",
                    bottom: "0%",
                    left: "50%",
                    marginLeft: "-1.5rem",
                    backgroundColor: "teal",
                    color: "white",
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "1.5rem",
                }}
                onClick={onDraw}
            >
                <DrawCardsIcon
                    style={{
                        width: "2rem",
                        height: "2rem",
                    }}
                />
            </ButtonBase>
            <Counter value={count} />
        </Background>
    );
}

export default DrawPile;
