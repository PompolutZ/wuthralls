import React from "react";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

const StyledInspirationButton = styled(Button)`
    background: ${({ $isInspired }) =>
        $isInspired ? "linear-gradient(#3b4955, #38362b)" : "#a47f3e"};
    color: white;
    font-weight: 700;
    margin: 0.5rem 0;

    &:hover {
        background: ${({ $isInspired }) =>
            $isInspired ? "linear-gradient(#3b4955, #38362b)" : "#a47f3e"};
    }
`;

function InspirationButton({ isInspired, ...rest }) {
    return (
        <StyledInspirationButton {...rest} $isInspired={isInspired}>
            {isInspired ? "Un-Inspire" : "Inspire"}
        </StyledInspirationButton>
    );
}

export default InspirationButton;
