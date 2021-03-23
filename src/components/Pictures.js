import React from "react";

function Picture({ basePath, name, ...rest }) {
    return (
        <picture>
            <source type="image/webp" src={`${basePath}/${name}.webp`} />
            <img src={`${basePath}/${name}.png`} {...rest} />
        </picture>
    );
}

export function FighterPicture({ name, ...rest }) {
    return <Picture basePath="/assets/fighters" name={name} {...rest} />;
}

export function CounterPicture({ name, ...rest }) {
    return <Picture basePath="/assets/other" name={name} {...rest} />;
}

export function CardPicture({ name, ...rest }) {
    return <Picture basePath="/assets/cards" name={name} {...rest} />;
}
