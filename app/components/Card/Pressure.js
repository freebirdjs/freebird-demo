import React from 'react';
import PropTypes from 'prop-types';

var fgColor = "#FFF",
    bgColor = "#F5D76E",
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD";

const Pressure = ({enable, pValue}) => {
    enable = !!enable;

    let cardFgColor = enable ? fgColor : fgColorDisabled;
    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardValue = enable ? pValue.toFixed(1) : undefined;

    return (
        <div style={{width: "100%", height: "100%", backgroundColor: cardBgColor}}>
            <div style={{float: "left", width: "50%", height: "100%"}}>
                <div style={{position: "relative", top: "15%", left: "15%", width: "70%", height: "70%"}}>
                    <svg fill={cardFgColor} height="100%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm0-14v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1zm7 9c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zM6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"/>
                    </svg>
                </div>
            </div>

            <div style={{float: "left", width: "50%", height: "100%"}}>
                <div style={{position: "absolute", top: "30%", bottom: "0", left: "50%", right: "0", margin: "0", textAlign: "center", fontSize: "1.5em", color: "white"}}>
                    {cardValue} bar
                </div>
            </div>
        </div>
    );
}

export default Pressure
