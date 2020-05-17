import React, { useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import { useAuthUser, withAuthorization } from "./Session";
import { FirebaseContext } from "../firebase";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(2),
    },
}));

// import { PasswordForgetForm } from '../PasswordForget';
// import PasswordChangeForm from '../PasswordChange';

function AccountPage() {
    const firebase = useContext(FirebaseContext);
    const classes = useStyles();
    const authUser = useAuthUser();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!authUser) return;

        firebase
            .user(authUser.uid)
            .once("value")
            .then((snapshot) => {
                setData(snapshot.val());
            });
    }, [authUser]);

    if (!authUser) return <h1>User Unknown</h1>;

    return (
        <div className={classes.root}>
            <Typography variant="h5">{authUser.username}</Typography>
            <Divider />

            <Typography>
                Total games played: {data && data.totalGamesPlayed}
            </Typography>
            <Typography>Games Won: {data && data.gamesWon}</Typography>
            <Typography>
                Win Rate:{" "}
                {data &&
                    Math.round((data.gamesWon / data.totalGamesPlayed) * 100)}
                %
            </Typography>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <Typography>Factions played with: </Typography>
                <div style={{ display: "flex", flexFlow: "row wrap" }}>
                    {data &&
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

export default withAuthorization(condition)(AccountPage);
