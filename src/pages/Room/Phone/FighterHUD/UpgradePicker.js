import React, { useState } from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import Paper from "@material-ui/core/Paper";
import MoveNextIcon from "@material-ui/icons/LabelImportant";
import DoneIcon from "@material-ui/icons/Done";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { cardsDb } from "../../../../data";
import PropTypes from "prop-types";

const cardImageWidth = 300;
const cardImageHeight = 420;

function UpgradePicker({
    playerInfo,
    onUpgradePickerOpen,
    isOpen,
    onUpgradeSelected,
}) {
    const [availableUpgrades, setAvailableUpgrades] = useState(
        playerInfo &&
            playerInfo.hand &&
            playerInfo.hand
                .split(",")
                .map((cardId) => ({ ...cardsDb[cardId], id: cardId }))
                .filter((c) => c.type === "Upgrade")
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClickAway = () => {
        onUpgradePickerOpen(false);
    };

    const handleMoverSelectionToRight = () => {
        if (currentIndex < availableUpgrades.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handleMoveSelectionToLeft = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const selectUpgrade = (card) => () => {
        onUpgradeSelected(card);
        setAvailableUpgrades((prev) => prev.filter((c) => c.id !== card.id));
        onUpgradePickerOpen(false);
    };

    if (!availableUpgrades || availableUpgrades.length === 0) {
        return null;
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            {isOpen ? (
                <div
                    style={{
                        position: "fixed",
                        width: cardImageWidth * 1.2,
                        height: cardImageHeight * 1.2,
                        top: "50%",
                        left: "50%",
                        marginTop: (-cardImageHeight * 1.2) / 2,
                        marginLeft: (-cardImageWidth * 1.2) / 2,
                        display: "flex",
                        zIndex: 1,
                        filter: "drop-shadow(0px 0px 10px black)",
                    }}
                >
                    <Paper
                        style={{
                            flexShrink: 0,
                            width: cardImageWidth * 0.8,
                            height: cardImageHeight * 0.8,
                            margin: "auto",
                            borderRadius: "1rem",
                            backgroundPosition: "center center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url(/assets/cards/${availableUpgrades[currentIndex].id}.png)`,
                        }}
                        elevation={10}
                    />
                    <ButtonBase
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: 0,
                            marginRight: "1.5rem",
                            backgroundColor: "teal",
                            color: "white",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "1.5rem",
                        }}
                        onClick={handleMoverSelectionToRight}
                    >
                        <MoveNextIcon
                            style={{ width: "2rem", height: "2rem" }}
                        />
                    </ButtonBase>
                    <ButtonBase
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            marginLeft: "1.5rem",
                            backgroundColor: "teal",
                            color: "white",
                            width: "3rem",
                            height: "3rem",
                            borderRadius: "1.5rem",
                        }}
                        onClick={handleMoveSelectionToLeft}
                    >
                        <MoveNextIcon
                            style={{
                                width: "2rem",
                                height: "2rem",
                                transform: "rotate(180deg)",
                            }}
                        />
                    </ButtonBase>
                    <ButtonBase
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            marginLeft: "-2.5rem",
                            backgroundColor: "green",
                            color: "white",
                            width: "5rem",
                            height: "5rem",
                            borderRadius: "2.5rem",
                        }}
                        onClick={selectUpgrade(availableUpgrades[currentIndex])}
                    >
                        <DoneIcon style={{ width: "4rem", height: "4rem" }} />
                    </ButtonBase>
                </div>
            ) : null}
        </ClickAwayListener>
    );
}

UpgradePicker.propTypes = {
    playerInfo: PropTypes.object,
    onUpgradePickerOpen: PropTypes.func,
    isOpen: PropTypes.bool,
    onUpgradeSelected: PropTypes.func,
};

export default UpgradePicker;
