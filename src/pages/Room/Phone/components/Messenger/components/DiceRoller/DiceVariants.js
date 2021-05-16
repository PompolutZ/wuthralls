import React from "react";
import AttackDie from "../../../../../../../components/AttackDie";
import DefenceDie from "../../../../../../../components/DefenceDie";
import MagicDie from "../../../../../../../components/MagicDie";
import { ATTACK, DEFENCE, MAGIC } from "../../constants";

export const DiceVariants = {
    [ATTACK]: <AttackDie />,
    [DEFENCE]: <DefenceDie />,
    [MAGIC]: <MagicDie />,
};
