import React from "react";
import DiceRoller from "./DiceRoller";
import InitiativeRoller from "./DiceRoller/InitiativeRoller";
import Telegram from "./Telegram";

export const Services = {
    Telegram: <Telegram />,
    AttackDiceTray: <DiceRoller type="ATTACK" initialAmount={2} />,
    DefenceDiceTray: <DiceRoller type="DEFENCE" initialAmount={1} />,
    MagicDiceTray: <DiceRoller type="MAGIC" initialAmount={2} />,
    InitiativeDiceTray: <InitiativeRoller />,
};
