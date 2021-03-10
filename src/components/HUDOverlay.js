import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import PropTypes from "prop-types";
import Grow from "@material-ui/core/Grow";

function Overlay(props) {
    const [portalHost, setPortalHost] = useState(undefined);

    useLayoutEffect(() => {
        const domNode = document.createElement("div");
        domNode.setAttribute("id", "overlay");
        document.body.appendChild(domNode);
        setPortalHost(domNode);

        document.body.style.height = "100vh";
        document.body.style.overflowY = "hidden";
        document.body.style.paddingRight = "15px";

        const rootElement = document.getElementById("root");
        rootElement.style.filter = "blur(3px)";

        return () => {
            const node = document.getElementById("overlay");
            if (node) {
                document.body.removeChild(node);

                document.body.style.overflowY = "";
                document.body.style.paddingRight = "";

                const rootElement = document.getElementById("root");
                rootElement.style.filter = "";
            }
        };
    }, []);

    return portalHost
        ? ReactDOM.createPortal(props.children, portalHost)
        : null;
}

function HUDOverlay({ onCloseOverlayClick, children, modified }) {
    return (
        <Overlay>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 9999,
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gridTemplateRows: "1fr auto",
                }}
            >
                <div
                    style={{
                        gridColumn: "1/2",
                        gridRow: "1/3",
                        background: "rgba(0, 0, 0, .4)",
                    }}
                />
                <div
                    style={{
                        gridColumn: "1/2",
                        gridRow: "1/2",
                        overflow: "scroll",
                    }}
                >
                    <Grow timeout={375} in mountOnEnter unmountOnExit>
                        {children}
                    </Grow>
                </div>
                <ButtonBase
                    style={{
                        backgroundColor: modified ? "teal" : "red",
                        gridRow: "2/3",
                        gridColumn: "1/2",
                        color: "white",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "1.5rem",
                        boxShadow: "3px 3px 3px 0px black",
                        boxSizing: "border-box",
                        border: "2px solid white",
                        margin: "1rem 1rem 1rem auto",
                    }}
                    onClick={onCloseOverlayClick}
                >
                    {modified ? (
                        <SaveIcon />
                    ) : (
                        <AddIcon style={{ transform: "rotate(45deg)" }} />
                    )}
                </ButtonBase>
            </div>
        </Overlay>
    );
}

HUDOverlay.propTypes = {
    onCloseOverlayClick: PropTypes.func,
    children: PropTypes.element,
    modified: PropTypes.bool,
};

export default HUDOverlay;
