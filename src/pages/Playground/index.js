import React from "react";

import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";

export default function Playground() {
    return (
        <div
            style={{
                background: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    flex: 1,
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ButtonBase
                    style={{
                        width: "3rem",
                        height: "3rem",
                        display: "flex",
                        background: "teal",
                        color: "white",
                    }}
                >
                    <AddIcon
                        style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            margin: "auto",
                        }}
                    />
                </ButtonBase>
            </div>
            <div
                style={{
                    flex: "0 0 30%",
                    backgroundColor: "magenta",
                    display: "flex",
                }}
            ></div>
        </div>
    );
}
