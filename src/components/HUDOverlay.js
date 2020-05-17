import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import PropTypes from "prop-types";

function HUDOverlay({ onCloseOverlayClick, children, modified }) {
    return (
        <div
            style={{
                position: "fixed",
                width: "100%",
                minHeight: 100,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: "rgba(255,255,255,.9)",
                zIndex: "20000",
                display: "flex",
                flexFlow: "column nowrap",
            }}
        >
            {!modified && (
                <ButtonBase
                    style={{
                        position: "absolute",
                        bottom: "0%",
                        right: "0%",
                        marginRight: "2rem",
                        marginBottom: "2rem",
                        backgroundColor: "red",
                        color: "white",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "1.5rem",
                        boxShadow: "3px 3px 3px 0px black",
                        boxSizing: "border-box",
                        border: "2px solid white",
                    }}
                    onClick={onCloseOverlayClick}
                >
                    <AddIcon style={{ transform: "rotate(45deg)" }} />
                </ButtonBase>
            )}
            {modified && (
                <ButtonBase
                    style={{
                        position: "absolute",
                        bottom: "0%",
                        right: "0%",
                        marginRight: "2rem",
                        marginBottom: "2rem",
                        backgroundColor: "teal",
                        color: "white",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "1.5rem",
                        boxShadow: "3px 3px 3px 0px black",
                        boxSizing: "border-box",
                        border: "2px solid white",
                    }}
                    onClick={onCloseOverlayClick}
                >
                    <SaveIcon />
                </ButtonBase>
            )}
            <div
                style={{
                    boxSizing: "border-box",
                    border: "3px solid gray",
                    padding: ".2rem",
                    flex: "1 0 auto",
                    overflow: "scroll",
                }}
            >
                {children}
            </div>
        </div>
    );
}

HUDOverlay.propTypes = {
    onCloseOverlayClick: PropTypes.func,
    children: PropTypes.array,
    modified: PropTypes.bool,
};

export default HUDOverlay;
