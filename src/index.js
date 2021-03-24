import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import Firebase, { FirebaseContext } from "./firebase";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";

function Root() {
    const defaultTheme = useTheme();
    const theme = createMuiTheme({
        ...defaultTheme,
        palette: {
            ...defaultTheme.palette,
            primary: {
                main: "rgba(255,69,0,1)",
            },
            success: {
                main: "#4caf50",
            },
            info: {
                main: "#2196f3",
            },
            warning: {
                main: "#ff9800",
            },
        },
    });

    return (
        <FirebaseContext.Provider value={new Firebase()}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </FirebaseContext.Provider>
    );
}

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
