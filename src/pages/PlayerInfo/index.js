import React, { useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { withAuthorization } from "../../components/Session";
import { FirebaseContext } from "../../firebase";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2),
    },
}));

function PlayerInfoPage() {
    const firebase = useContext(FirebaseContext);
    const classes = useStyles();
    const [data, setData] = useState(null);
    const { state } = useLocation();

    useEffect(() => {
        firebase
            .user(state.pid)
            .once("value")
            .then((snapshot) => {
                setData(snapshot.val());
            });
    }, [state]);

    return (
        <div className={classes.root}>
            <Typography variant="h5">{data && data.username}</Typography>
            <Divider />

            <Typography>
                Total games played: {data && data.totalGamesPlayed}
            </Typography>
            <Typography>Games Won: {data && data.gamesWon}</Typography>
            <Typography>
                Win Rate:{" "}
                {data &&
                    data.gamesWon &&
                    data.totalGamesPlayed &&
                    Math.round((data.gamesWon / data.totalGamesPlayed) * 100)}
                %
            </Typography>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography>Factions played with: </Typography>
                <div style={{ display: "flex", flexFlow: "row wrap" }}>
                    {data &&
                        data.factions &&
                        Object.entries(data.factions)
                            .sort((a, b) => b[1] - a[1])
                            .map(([faction, gamesPlayed]) => (
                                <img
                                    key={faction}
                                    src={`/assets/factions/${faction}-icon.png`}
                                    style={{
                                        width: `${
                                            3 +
                                            2 *
                                                (gamesPlayed /
                                                    data.totalGamesPlayed)
                                        }rem`,
                                        height: `${
                                            3 +
                                            2 *
                                                (gamesPlayed /
                                                    data.totalGamesPlayed)
                                        }rem`,
                                    }}
                                />
                            ))}
                </div>
            </div>
            {/* <PasswordForgetForm />
            <PasswordChangeForm /> */}
        </div>
    );
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(PlayerInfoPage);
