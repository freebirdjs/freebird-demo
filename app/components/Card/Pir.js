import React from 'react';
import PirWatchIcon from '../Icons/PirWatchIcon'
import PirTriggeredIcon from '../Icons/PirTriggeredIcon'

var csshake = require('../../styles/csshake.css');

var fgColor = "#FFF",
    bgColor = '#4183D7',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FFF",
    fgColorOff = "#FFF";

const Pir = ({ enable, triggered, onClick }) => {
    enable = !!enable;
    triggered = !!triggered;
    onClick = onClick || function () {
        console.log('Pir clicked');
    };

    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardFgColor = enable ? (triggered ? fgColorOn : fgColorOff) : fgColorDisabled;

    let reallyTriggered = enable && triggered;
    let icon = reallyTriggered ? <PirTriggeredIcon fill={cardFgColor} /> : <PirWatchIcon fill={cardFgColor} />;
    let shakeClass = reallyTriggered ? csshake['shake-rotate'] + ' ' + csshake['shake-constant'] + ' ' + csshake['shake-constant--hover'] : '';

    return (
        <div className={shakeClass} style={{width: '100%', height: '100%', backgroundColor: cardBgColor}}>
            {icon}
        </div>
    );
}

// Pir.propTypes = {
//     enable: PropTypes.bool.isRequired,
//     triggered: PropTypes.bool.isRequired,
// //    onClick    // optional
// };

export default Pir
