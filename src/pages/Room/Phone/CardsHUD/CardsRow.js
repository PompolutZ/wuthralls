import React from "react";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { cardDefaultHeight, cardDefaultWidth } from "../../../../constants/mix";

function CardsRow({ title, cards = [], onHighlightCard }) {
    return (
        <Grid item xs={12}>
            <Typography style={{ marginTop: "1rem" }}>
                {title} {`(${cards.length})`}
            </Typography>
            <Divider />
            <Grid container>
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        overflowX: "scroll",
                    }}
                >
                    {cards.map((card, idx, arr) => (
                        <Paper
                            key={card.id}
                            style={{
                                flexShrink: 0,
                                width: cardDefaultWidth * 0.4,
                                height: cardDefaultHeight * 0.4,
                                margin: `1rem ${
                                    idx === arr.length - 1 ? "1rem" : ".3rem"
                                } 0 ${idx === 0 ? "1rem" : "0"}`,
                                borderRadius: "1rem",
                                backgroundPosition: "center center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `url(/assets/cards/${card.id}.png)`,
                            }}
                            elevation={10}
                            onClick={onHighlightCard(card)}
                        />
                    ))}
                </div>
            </Grid>
        </Grid>
    );
}

export default CardsRow;
