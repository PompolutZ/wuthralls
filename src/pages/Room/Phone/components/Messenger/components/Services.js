import React from "react";
import {
    ATTACK_DICE_TRAY,
    DEFENCE_DICE_TRAY,
    INITIATIVE_DICE_TRAY,
    MAGIC_DICE_TRAY,
    TELEGRAM,
} from "../constants";
import DiceRoller from "./DiceRoller";
import InitiativeRoller from "./DiceRoller/InitiativeRoller";
import Telegram from "./Telegram";

export const Services = {
    [TELEGRAM]: <Telegram />,
    [ATTACK_DICE_TRAY]: <DiceRoller type="ATTACK" initialAmount={2} />,
    [DEFENCE_DICE_TRAY]: <DiceRoller type="DEFENCE" initialAmount={1} />,
    [MAGIC_DICE_TRAY]: <DiceRoller type="MAGIC" initialAmount={2} />,
    [INITIATIVE_DICE_TRAY]: <InitiativeRoller />,
};
