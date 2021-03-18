import React from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

const StyledInspirationButton = styled(Button)`
    background: ${(props) => (props.isInspired ? "teal" : "goldenrod")};
    color: white;
    &:hover {
        background: ${(props) => (props.isInspired ? "teal" : "goldenrod")};
    }
`;

function InspirationButton(props) {
    return (
        <StyledInspirationButton props={props}>
            {props.isInspired ? "Un-Inspire" : "Inspire"}
        </StyledInspirationButton>
    );
}

export default InspirationButton;
