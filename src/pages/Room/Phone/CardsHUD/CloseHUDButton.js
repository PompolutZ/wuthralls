import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";

function ButtonIcon({ modified }) {
    return modified ? (
        <SaveIcon
            style={{
                width: "2rem",
                height: "2rem",
            }}
        />
    ) : (
        <AddIcon
            style={{
                width: "2rem",
                height: "2rem",
                transform: "rotate(45deg)",
            }}
        />
    );
}

function CloseHUDButton({ modified, onClick }) {
    return (
        <ButtonBase
            style={{
                position: "fixed",
                bottom: "0%",
                right: "0%",
                marginRight: "2rem",
                marginBottom: "2rem",
                backgroundColor: modified ? "teal" : "red",
                color: "white",
                width: "3rem",
                height: "3rem",
                boxShadow: "3px 3px 3px 0px black",
                boxSizing: "border-box",
                border: "2px solid white",
                borderRadius: "1.5rem",
            }}
            onClick={() => onClick(modified)}
        >
            <ButtonIcon modified={modified} />
        </ButtonBase>
    );
}

export default CloseHUDButton;
