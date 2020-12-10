import React, { useState, useEffect } from "react";
import * as SVG from "svg.js";
import { defineGrid, extendHex } from "honeycomb-grid";
import Typography from "@material-ui/core/Typography";
import MoveNextIcon from "@material-ui/icons/LabelImportant";
import FlipIcon from "@material-ui/icons/RotateRight";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ChangeOrientationIcon from "@material-ui/icons/Rotate90DegreesCcw";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { boards as boardsData } from "../../../data";

const baseBoardWidth = 757;
const baseBoardHeight = 495;

const verticalBoardHexes = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [0, 6],
    [1, 6],
    [2, 6],
    [3, 6],
    [4, 6],
    [0, 7],
    [2, 7],
    [4, 7],
];

const horizontalBoardHexes = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
];

const noOnesHexesHorizontal = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5],
    [6, 5],
];

const renderHex = (
    hex,
    svg,
    color,
    starting,
    lethals,
    blocked,
    orientation
) => {
    const { x, y } = hex.toPoint();
    const corners = hex.corners();
    const width = hex.width();
    const isLethal = lethals.some(([x, y]) => x === hex.x && y === hex.y);
    const isBlocked = blocked.some(([x, y]) => x === hex.x && y === hex.y);
    const isStarting = starting.some(([x, y]) => x === hex.x && y === hex.y);

    const handleMouseOver = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`); //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ "stroke-width": 1 })
                .animate(175)
                .attr({ "stroke-width": 3 });
        }
    };

    const handleMouseOut = () => {
        const element = SVG.get(`hex${hex.x}${hex.y}`);
        if (element) {
            element
                .stop(true, true)
                .attr({ "stroke-width": 3 })
                .animate(175)
                .attr({ "stroke-width": 1 });
        } //svg.children().find(c => c.node.id === `hex${hex.x}${hex.y}`);
    };

    const horizontalFill = isBlocked
        ? "dimgray"
        : isLethal
        ? "red"
        : hex.y < 5
        ? "rgba(220,20,60, .2)"
        : hex.y === 5
        ? "rgba(70,130,180, .2)"
        : "rgba(154,205,50, .2)";

    const verticalFill = isBlocked
        ? "dimgray"
        : isLethal
        ? "red"
        : hex.y < 7 || (hex.y === 7 && hex.x % 2 === 0)
        ? "rgba(220,20,60, .2)"
        : hex.y === 7 && hex.x % 2 !== 0
        ? "rgba(70,130,180, .2)"
        : "rgba(154,205,50, .2)";

    svg.polygon(corners.map(({ x, y }) => `${x},${y}`))
        //.style({ filter: isLethal ? 'drop-shadow(0px 0px 10px red)' : 'drop-shadow(0px 0px 0px white)' })
        .fill(orientation === "horizontal" ? horizontalFill : verticalFill)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .attr({ stroke: "dimgray", "stroke-width": 1 })
        .translate(x, y)
        .scale(0.9)
        .id(`hex${hex.x}${hex.y}`);

    if (isStarting) {
        if (orientation === "horizontal") {
            svg.path(
                "m 10.572581,21.214564 c 0,-0.21165 -0.7654993,-0.73053 -1.7011092,-1.153067 C 5.2659847,18.4332 4.8420488,17.951888 3.33374,13.774281 3.0860214,13.088167 2.5720905,12.526801 2.1916713,12.526801 1.8112521,12.526801 1.5,12.322668 1.5,12.073172 c 0,-0.249496 0.3112521,-0.453629 0.6916713,-0.453629 0.3804192,0 0.8866774,-0.561366 1.1250182,-1.24748 C 3.5550307,9.685949 4.0603108,8.546675 4.4395347,7.840341 4.8187582,7.1340088 5.1290323,6.1523293 5.1290323,5.6588317 c 0,-0.4934971 0.2023566,-0.7722045 0.4496815,-0.6193492 0.6470465,0.3998966 4.9324102,-1.6649547 5.1549702,-2.4838608 0.103005,-0.3790066 0.210962,-0.041502 0.239904,0.7500117 0.04562,1.2475379 -0.148774,1.5055811 -1.4602561,1.938409 C 7.7410182,5.8289589 5.8415474,7.684913 5.154646,9.502872 4.6009536,10.96828 4.8427338,11.615074 5.9496549,11.62963 c 0.6189664,0.0081 0.5653284,0.165323 -0.2777925,0.81406 -0.924329,0.711223 -0.9864158,0.958642 -0.5381768,2.144651 0.706304,1.868832 2.5885465,3.722844 4.3796463,4.313961 1.1609941,0.383162 1.5128781,0.754889 1.5128781,1.598187 0,0.604391 -0.102067,1.098893 -0.226815,1.098893 -0.124748,0 -0.226814,-0.173169 -0.226814,-0.384818 z m 2.303957,-0.595381 c -0.02945,-0.992626 0.32009,-1.379303 1.967943,-2.177014 1.989148,-0.962931 3.071138,-2.164895 3.891759,-4.323291 0.368966,-0.970455 0.258782,-1.215599 -0.806143,-1.793554 -0.688021,-0.373401 -0.932611,-0.68056 -0.553081,-0.694565 0.374244,-0.01381 0.943521,-0.192019 1.26506,-0.396021 1.419555,-0.900643 -2.041763,-5.665973 -4.509134,-6.2078986 -1.105174,-0.2427369 -1.284599,-0.4919988 -1.239595,-1.7220693 0.02894,-0.7910383 0.138999,-1.1320517 0.244573,-0.7578077 0.18554,0.6577222 4.347982,2.7300747 5.472339,2.72451 0.30404,-0.0015 0.441628,0.2869721 0.305752,0.64106 -0.135877,0.3540874 0.05038,1.1195863 0.413899,1.7011086 0.36352,0.581522 0.782861,1.585505 0.931867,2.231073 0.149008,0.645567 0.734659,1.399799 1.301448,1.676071 l 1.030525,0.502314 -1.017182,0.303847 c -0.689612,0.205998 -1.168358,0.865276 -1.486622,2.047214 -0.258191,0.958852 -0.668025,1.8661 -0.910741,2.016107 -0.242716,0.150006 -0.441302,0.771024 -0.441302,1.38004 0,0.766624 -0.252916,1.107301 -0.822053,1.107301 -1.133021,0 -4.488273,1.668189 -4.771644,2.372401 -0.12752,0.316903 -0.247971,0.03303 -0.267668,-0.630826 z m -1.005513,-3.329277 c -0.137399,-0.997984 -0.07749,-1.882561 0.133127,-1.965726 0.542168,-0.21408 0.477939,-2.34375 -0.07068,-2.34375 -0.249496,0 -0.470415,0.255166 -0.490932,0.567036 -0.185948,2.826636 -1.323584,5.364498 -1.323584,2.95268 0,-1.355446 -0.827955,-2.113874 -1.3628458,-1.248403 C 8.497153,15.670739 8.2584457,15.556628 7.8680865,14.827234 7.4786619,14.099588 7.4691135,13.667156 7.8327945,13.228947 8.1310465,12.869575 8.2146962,11.898558 8.0409862,10.812234 7.8812743,9.813452 7.9535362,8.633644 8.2015668,8.190437 8.5916025,7.493482 8.695176,7.578762 8.9681558,8.821631 c 0.173593,0.790364 0.181081,2.049592 0.016639,2.798286 -0.3724209,1.695621 0.9011649,2.459607 1.8765502,1.125688 0.516872,-0.706864 0.506748,-0.951285 -0.0656,-1.583719 -0.8683343,-0.959502 -0.859606,-1.643271 0.02531,-1.982847 0.535005,-0.2053 0.636768,-0.675706 0.427568,-1.976456 -0.228304,-1.4195313 -0.18515,-1.5647421 0.256227,-0.8621868 0.291923,0.4646649 0.418551,1.5363638 0.281396,2.3815528 -0.137155,0.845188 -0.05807,1.536707 0.175737,1.536707 0.23381,0 0.428235,-0.255166 0.432055,-0.567036 0.0047,-0.382695 0.144589,-0.349377 0.430334,0.102487 0.345745,0.546742 0.505576,0.463553 0.871558,-0.453629 l 0.44817,-1.123153 0.02876,1.098354 c 0.01581,0.604094 -0.302204,1.464057 -0.706707,1.911028 -0.906563,1.001739 -0.516443,2.207352 0.714267,2.207352 0.844566,0 0.893274,-0.203455 0.636607,-2.659111 -0.167651,-1.604002 -0.09681,-2.771052 0.178539,-2.941226 0.58311,-0.360382 1.102115,2.16887 0.740613,3.609208 -0.151245,0.602609 -0.04454,1.373328 0.23712,1.712709 0.667236,0.803971 0.139498,2.15117 -0.806867,2.059752 -1.48366,-0.14332 -1.872078,0.0518 -1.872078,0.940442 0,0.498992 -0.189936,0.907258 -0.422079,0.907258 -0.232143,0 -0.496183,0.4593 -0.586756,1.020666 -0.110905,0.687384 -0.246251,0.428166 -0.414494,-0.793851 z"
            )
                .width(width * 0.8)
                .height(width * 0.8)
                .translate(x + (width * 0.1) / 2, y + (width * 0.8) / 2)
                .id("starting");
        } else {
            svg.path(
                "m 10.572581,21.214564 c 0,-0.21165 -0.7654993,-0.73053 -1.7011092,-1.153067 C 5.2659847,18.4332 4.8420488,17.951888 3.33374,13.774281 3.0860214,13.088167 2.5720905,12.526801 2.1916713,12.526801 1.8112521,12.526801 1.5,12.322668 1.5,12.073172 c 0,-0.249496 0.3112521,-0.453629 0.6916713,-0.453629 0.3804192,0 0.8866774,-0.561366 1.1250182,-1.24748 C 3.5550307,9.685949 4.0603108,8.546675 4.4395347,7.840341 4.8187582,7.1340088 5.1290323,6.1523293 5.1290323,5.6588317 c 0,-0.4934971 0.2023566,-0.7722045 0.4496815,-0.6193492 0.6470465,0.3998966 4.9324102,-1.6649547 5.1549702,-2.4838608 0.103005,-0.3790066 0.210962,-0.041502 0.239904,0.7500117 0.04562,1.2475379 -0.148774,1.5055811 -1.4602561,1.938409 C 7.7410182,5.8289589 5.8415474,7.684913 5.154646,9.502872 4.6009536,10.96828 4.8427338,11.615074 5.9496549,11.62963 c 0.6189664,0.0081 0.5653284,0.165323 -0.2777925,0.81406 -0.924329,0.711223 -0.9864158,0.958642 -0.5381768,2.144651 0.706304,1.868832 2.5885465,3.722844 4.3796463,4.313961 1.1609941,0.383162 1.5128781,0.754889 1.5128781,1.598187 0,0.604391 -0.102067,1.098893 -0.226815,1.098893 -0.124748,0 -0.226814,-0.173169 -0.226814,-0.384818 z m 2.303957,-0.595381 c -0.02945,-0.992626 0.32009,-1.379303 1.967943,-2.177014 1.989148,-0.962931 3.071138,-2.164895 3.891759,-4.323291 0.368966,-0.970455 0.258782,-1.215599 -0.806143,-1.793554 -0.688021,-0.373401 -0.932611,-0.68056 -0.553081,-0.694565 0.374244,-0.01381 0.943521,-0.192019 1.26506,-0.396021 1.419555,-0.900643 -2.041763,-5.665973 -4.509134,-6.2078986 -1.105174,-0.2427369 -1.284599,-0.4919988 -1.239595,-1.7220693 0.02894,-0.7910383 0.138999,-1.1320517 0.244573,-0.7578077 0.18554,0.6577222 4.347982,2.7300747 5.472339,2.72451 0.30404,-0.0015 0.441628,0.2869721 0.305752,0.64106 -0.135877,0.3540874 0.05038,1.1195863 0.413899,1.7011086 0.36352,0.581522 0.782861,1.585505 0.931867,2.231073 0.149008,0.645567 0.734659,1.399799 1.301448,1.676071 l 1.030525,0.502314 -1.017182,0.303847 c -0.689612,0.205998 -1.168358,0.865276 -1.486622,2.047214 -0.258191,0.958852 -0.668025,1.8661 -0.910741,2.016107 -0.242716,0.150006 -0.441302,0.771024 -0.441302,1.38004 0,0.766624 -0.252916,1.107301 -0.822053,1.107301 -1.133021,0 -4.488273,1.668189 -4.771644,2.372401 -0.12752,0.316903 -0.247971,0.03303 -0.267668,-0.630826 z m -1.005513,-3.329277 c -0.137399,-0.997984 -0.07749,-1.882561 0.133127,-1.965726 0.542168,-0.21408 0.477939,-2.34375 -0.07068,-2.34375 -0.249496,0 -0.470415,0.255166 -0.490932,0.567036 -0.185948,2.826636 -1.323584,5.364498 -1.323584,2.95268 0,-1.355446 -0.827955,-2.113874 -1.3628458,-1.248403 C 8.497153,15.670739 8.2584457,15.556628 7.8680865,14.827234 7.4786619,14.099588 7.4691135,13.667156 7.8327945,13.228947 8.1310465,12.869575 8.2146962,11.898558 8.0409862,10.812234 7.8812743,9.813452 7.9535362,8.633644 8.2015668,8.190437 8.5916025,7.493482 8.695176,7.578762 8.9681558,8.821631 c 0.173593,0.790364 0.181081,2.049592 0.016639,2.798286 -0.3724209,1.695621 0.9011649,2.459607 1.8765502,1.125688 0.516872,-0.706864 0.506748,-0.951285 -0.0656,-1.583719 -0.8683343,-0.959502 -0.859606,-1.643271 0.02531,-1.982847 0.535005,-0.2053 0.636768,-0.675706 0.427568,-1.976456 -0.228304,-1.4195313 -0.18515,-1.5647421 0.256227,-0.8621868 0.291923,0.4646649 0.418551,1.5363638 0.281396,2.3815528 -0.137155,0.845188 -0.05807,1.536707 0.175737,1.536707 0.23381,0 0.428235,-0.255166 0.432055,-0.567036 0.0047,-0.382695 0.144589,-0.349377 0.430334,0.102487 0.345745,0.546742 0.505576,0.463553 0.871558,-0.453629 l 0.44817,-1.123153 0.02876,1.098354 c 0.01581,0.604094 -0.302204,1.464057 -0.706707,1.911028 -0.906563,1.001739 -0.516443,2.207352 0.714267,2.207352 0.844566,0 0.893274,-0.203455 0.636607,-2.659111 -0.167651,-1.604002 -0.09681,-2.771052 0.178539,-2.941226 0.58311,-0.360382 1.102115,2.16887 0.740613,3.609208 -0.151245,0.602609 -0.04454,1.373328 0.23712,1.712709 0.667236,0.803971 0.139498,2.15117 -0.806867,2.059752 -1.48366,-0.14332 -1.872078,0.0518 -1.872078,0.940442 0,0.498992 -0.189936,0.907258 -0.422079,0.907258 -0.232143,0 -0.496183,0.4593 -0.586756,1.020666 -0.110905,0.687384 -0.246251,0.428166 -0.414494,-0.793851 z"
            )
                .width(width * 0.8)
                .height(width * 0.8)
                .translate(x, y)
                .id("starting");
        }
    }
};

const modifyNoOnesArray = (array, offset) => {
    return offset > 0
        ? array.map(([x, y]) => [x + offset, y]).slice(0, 7 - offset)
        : array.slice(0, 7 - Math.abs(offset));
};

function BoardPlacer({ scale, onInitiaScaleChange, boardOffset = 0, data }) {
    const [scaleFactor, setScaleFactor] = useState(scale);
    const [draw, setDraw] = useState(null);

    useEffect(() => {
        const { offsetHeight, offsetWidth } = document.getElementById(
            "main_container"
        );
        let nextScaleFactor;
        if (data.orientation === "horizontal") {
            // scale based on width
            nextScaleFactor =
                offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94);
            setScaleFactor(nextScaleFactor);
            onInitiaScaleChange(nextScaleFactor);
        } else {
            nextScaleFactor = offsetHeight / (baseBoardWidth * 2);
            setScaleFactor(nextScaleFactor);
        }
    }, []);

    useEffect(() => {
        setScaleFactor(scale);
    }, [scale]);

    useEffect(() => {
        const { offsetHeight, offsetWidth } = document.getElementById(
            "main_container"
        );
        let nextScaleFactor;
        if (data.orientation === "horizontal") {
            // scale based on width
            nextScaleFactor =
                offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94);
            setScaleFactor(nextScaleFactor);
            onInitiaScaleChange(nextScaleFactor);
        } else {
            nextScaleFactor = offsetHeight / (baseBoardWidth * 2);
            setScaleFactor(nextScaleFactor);
        }
    }, [boardOffset]);

    useEffect(() => {
        const { offsetHeight, offsetWidth } = document.getElementById(
            "main_container"
        );
        let nextScaleFactor;
        if (data.orientation === "horizontal") {
            // scale based on width
            if (offsetHeight > offsetWidth) {
                // scale based on width
                nextScaleFactor =
                    offsetWidth / (baseBoardWidth + Math.abs(boardOffset) * 94);
                setScaleFactor(nextScaleFactor);
                onInitiaScaleChange(nextScaleFactor);
            } else {
                nextScaleFactor = offsetHeight / (baseBoardHeight * 2);
                setScaleFactor(nextScaleFactor);
                onInitiaScaleChange(nextScaleFactor);
            }
        } else {
            nextScaleFactor = offsetHeight / (baseBoardWidth * 2);
            setScaleFactor(nextScaleFactor);
        }

        const currentDraw = draw ? draw : SVG("svg_container");
        currentDraw.clear();
        const Hex = extendHex({
            orientation: data.orientation === "horizontal" ? "pointy" : "flat",
            size: 55 * nextScaleFactor,
            origin:
                data.orientation === "horizontal"
                    ? [0, (-55 / 2) * nextScaleFactor]
                    : [0, 0], //[0, 0] //[0, -55 / 2 * scaleFactor],
        });

        const Grid = defineGrid(Hex);
        Grid(...data.hexes).forEach((hex) => {
            // use hexSymbol and set its position for each hex
            renderHex(
                hex,
                currentDraw,
                "magenta",
                data.starting,
                data.lethals,
                data.blocked,
                data.orientation
            ); //lethals, blocked, startingHexes);
        });
        if (!draw) {
            setDraw(currentDraw);
        }
    }, [data]);

    return (
        <div
            id="main_container"
            style={{
                flex: "1 0 50%",
                position: "relative",
            }}
        >
            <div
                id="svg_container"
                style={{
                    width:
                        data.orientation === "horizontal"
                            ? baseBoardWidth * scaleFactor +
                              Math.abs(boardOffset) * (94 * scaleFactor)
                            : baseBoardHeight * scaleFactor, //baseBoardWidth * scaleFactor, //baseBoardHeight * 2 * scaleFactor,//baseBoardWidth * scaleFactor + (Math.abs(boardOffset) * (94 * scaleFactor)),
                    height:
                        data.orientation === "horizontal"
                            ? baseBoardHeight * 2 * scaleFactor
                            : baseBoardWidth * 2 * scaleFactor, //baseBoardWidth * scaleFactor * 2, //baseBoardHeight * 2 * scaleFactor,
                    background: "lightgray",
                    position: "absolute",
                    top: data.orientation === "horizontal" ? "50%" : 0,
                    left: data.orientation === "horizontal" ? "50%" : "50%",
                    marginTop:
                        data.orientation === "horizontal"
                            ? (-baseBoardHeight * 2 * scaleFactor) / 2
                            : 0,
                    marginLeft:
                        data.orientation === "horizontal"
                            ? (baseBoardWidth * scaleFactor +
                                  Math.abs(boardOffset) * (94 * scaleFactor)) /
                              -2
                            : -(baseBoardHeight * scaleFactor) / 2,
                    filter: "drop-shadow(2px 2px 5px dimgray)",
                    transition: "all .3s ease-out",
                }}
            ></div>
        </div>
    );
}

BoardPlacer.propTypes = {
    scale: PropTypes.number,
    onInitiaScaleChange: PropTypes.func,
    boardOffset: PropTypes.number,
    data: PropTypes.object,
};

function SecondBoardPicker({ onBoardPicked, top }) {
    const [scale, setScale] = useState(0.5);
    const [offset, setOffset] = useState(0);
    const [orientation, setOrientation] = useState("horizontal");
    const [selectedIndex, setSelectedIndex] = useState(15);
    const [topBoard, setTopBoard] = useState(top);
    const [bottomBoard, setBottomBoard] = useState({
        id: selectedIndex,
        rotate: 0,
    });
    const [boardHexes, setBoardHexes] = useState([
        ...horizontalBoardHexes.map(([x, y]) =>
            offset < 0 ? [x + Math.abs(offset), y] : [x, y]
        ),
        ...modifyNoOnesArray(noOnesHexesHorizontal, offset).map(([x, y]) =>
            offset < 0 ? [x + Math.abs(offset), y] : [x, y]
        ),
        ...horizontalBoardHexes.map(([x, y]) =>
            offset > 0 ? [x + offset, y + 6] : [x, y + 6]
        ),
    ]);
    const [startingHexes, setStartingHexes] = useState([
        ...boardsData[top.id][orientation].startingHexes[0].map(([x, y]) =>
            offset < 0 ? [x + Math.abs(offset), y] : [x, y]
        ),
        ...boardsData[selectedIndex][
            orientation
        ].startingHexes[0].map(([x, y]) =>
            offset > 0 ? [x + offset, y + 6] : [x, y + 6]
        ),
    ]);
    const [lethalHexes, setLethalHexes] = useState([
        ...boardsData[top.id][orientation].lethalHexes[0].map(([x, y]) =>
            offset < 0 ? [x + Math.abs(offset), y] : [x, y]
        ),
        ...boardsData[selectedIndex][orientation].lethalHexes[0].map(([x, y]) =>
            offset > 0 ? [x + offset, y + 6] : [x, y + 6]
        ),
    ]);
    const [blockedHexes, setBlockedHexes] = useState([
        ...boardsData[top.id][orientation].blockedHexes[0].map(([x, y]) =>
            offset < 0 ? [x + Math.abs(offset), y] : [x, y]
        ),
        ...boardsData[selectedIndex][
            orientation
        ].blockedHexes[0].map(([x, y]) =>
            offset > 0 ? [x + offset, y + 6] : [x, y + 6]
        ),
    ]);

    useEffect(() => {
        const hexes =
            orientation === "horizontal"
                ? [
                      ...horizontalBoardHexes.map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...modifyNoOnesArray(
                          noOnesHexesHorizontal,
                          offset
                      ).map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...horizontalBoardHexes.map(([x, y]) =>
                          offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                      ),
                  ]
                : [
                      ...verticalBoardHexes,
                      ...[
                          [1, 7],
                          [3, 7],
                      ],
                      ...verticalBoardHexes.map(([x, y]) => [x, y + 8]),
                  ];

        const lethals =
            orientation === "horizontal"
                ? [
                      ...boardsData[top.id][orientation].lethalHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].lethalHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) =>
                          offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                      ),
                  ]
                : [
                      ...boardsData[top.id][orientation].lethalHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].lethalHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) => [x, y + 8]),
                  ];

        const blocked =
            orientation === "horizontal"
                ? [
                      ...boardsData[top.id][orientation].blockedHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].blockedHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) =>
                          offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                      ),
                  ]
                : [
                      ...boardsData[top.id][orientation].blockedHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].blockedHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) => [x, y + 8]),
                  ];

        const starting =
            orientation === "horizontal"
                ? [
                      ...boardsData[top.id][orientation].startingHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].startingHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) =>
                          offset > 0 ? [x + offset, y + 6] : [x, y + 6]
                      ),
                  ]
                : [
                      ...boardsData[top.id][orientation].startingHexes[
                          topBoard.rotate
                      ].map(([x, y]) =>
                          offset < 0 ? [x + Math.abs(offset), y] : [x, y]
                      ),
                      ...boardsData[bottomBoard.id][orientation].startingHexes[
                          bottomBoard.rotate
                      ].map(([x, y]) => [x, y + 8]),
                  ];

        setBoardHexes(hexes);
        setStartingHexes(starting);
        setLethalHexes(lethals);
        setBlockedHexes(blocked);
    }, [selectedIndex, topBoard, bottomBoard, offset, orientation]);

    const handleMoveSelectionLeft = () => {
        const nextIndex = selectedIndex - 1 < 1 ? 20 : selectedIndex - 1;
        setSelectedIndex(nextIndex);
        setBottomBoard({
            ...bottomBoard,
            id: nextIndex,
        });
    };

    const handleMoveSelectionRight = () => {
        const nextIndex = selectedIndex + 1 > 20 ? 1 : selectedIndex + 1;
        setSelectedIndex(nextIndex);
        setBottomBoard({
            ...bottomBoard,
            id: nextIndex,
        });
    };

    const handleSelectCurrent = () => {
        onBoardPicked({
            top: topBoard,
            bottom: bottomBoard,
            offset: offset,
            orientation: orientation,
        });
    };

    const handleFlipTop = () => {
        setTopBoard({
            ...topBoard,
            rotate: topBoard.rotate === 0 ? 180 : 0,
        });
    };

    const handleFlipBottom = () => {
        setBottomBoard({
            ...bottomBoard,
            rotate: bottomBoard.rotate === 0 ? 180 : 0,
        });
    };

    const handleShiftRight = () => {
        const nextOffset = offset + 1 > 4 ? 4 : offset + 1;
        setOffset(nextOffset);
    };

    const handleShiftLeft = () => {
        const nextOffset = offset - 1 < -4 ? -4 : offset - 1;
        setOffset(nextOffset);
    };

    const handleChangeOrientation = () => {
        setOrientation(
            orientation === "horizontal" ? "vertical" : "horizontal"
        );
    };

    return (
        <div
            style={{
                // background: 'magenta',
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    flex: "0 1 10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6">{boardsData[top.id].name}</Typography>
            </div>
            <div
                style={{
                    // backgroundColor: 'teal',
                    flex: 1,
                    display: "flex",
                }}
            >
                <div
                    style={{
                        flex: "0 1 10%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ flex: 1, margin: ".2rem" }}
                        onClick={handleFlipTop}
                    >
                        <FlipIcon />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ flex: 1, margin: ".2rem" }}
                        onClick={handleMoveSelectionLeft}
                    >
                        <MoveNextIcon style={{ transform: "scaleX(-1)" }} />
                    </Button>
                    {orientation === "horizontal" && (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ flex: 1, margin: ".2rem" }}
                            onClick={handleShiftLeft}
                        >
                            <SkipNextIcon style={{ transform: "scaleX(-1)" }} />
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ flex: 1, margin: ".2rem" }}
                        onClick={handleFlipBottom}
                    >
                        <FlipIcon />
                    </Button>
                </div>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        overflow: "auto",
                    }}
                >
                    <BoardPlacer
                        scale={scale}
                        onInitiaScaleChange={setScale}
                        boardOffset={offset}
                        data={{
                            hexes: boardHexes,
                            boardOffset: offset,
                            starting: startingHexes,
                            lethals: lethalHexes,
                            blocked: blockedHexes,
                            orientation: orientation,
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: "0 1 10%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ flex: 1 }}></div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ flex: 1, margin: ".2rem" }}
                        onClick={handleMoveSelectionRight}
                    >
                        <MoveNextIcon />
                    </Button>
                    {orientation === "horizontal" && (
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ flex: 1, margin: ".2rem" }}
                            onClick={handleShiftRight}
                        >
                            <SkipNextIcon />
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ flex: 1, margin: ".2rem" }}
                        onClick={handleChangeOrientation}
                    >
                        <ChangeOrientationIcon />
                    </Button>
                </div>
            </div>
            <div
                style={{
                    flex: "0 1 20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h6">
                    {boardsData[selectedIndex].name}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectCurrent}
                >{`Pick this one!`}</Button>
            </div>
            {/* <div style={{ backgroundColor: 'orange', flex: '0 1 10%' }}></div> */}
        </div>
    );
}

SecondBoardPicker.propTypes = {
    onBoardPicked: PropTypes.func,
    top: PropTypes.object,
};

export default SecondBoardPicker;
