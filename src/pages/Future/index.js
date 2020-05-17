import React from "react";

export default function Future() {
    return (
        <div style={{ margin: "1rem" }}>
            <h4>Upcoming (in no particular order):</h4>
            <ul>
                <li>
                    Make sure that scatter token is sync with both players via
                    server
                </li>
                <li>
                    Make possible to click on coordinates of hexes visible in
                    messages to highlight such hex on the board
                </li>
                <li>
                    Change so that every modification to a fighter happens
                    locally and sync to server only on exit
                </li>
                <li>
                    Make possible to play upgrades from hand by selecting
                    fighter which needs to receive that upgrade
                </li>
                <li>
                    Add quick action, similar to pass power, for drawing a power
                    card
                </li>
                <li>
                    Add quick action, similar to pass power, for changing the
                    objective card
                </li>
                <li>
                    Make possible to select fighter on board rather than via
                    Actions panel only
                </li>
            </ul>
        </div>
    );
}
