import React, { PropTypes } from 'react';
import BuzzerOnIcon from '../Icons/BuzzerOnIcon'
import BuzzerOffIcon from '../Icons/BuzzerOffIcon'

var csshake = require('../../styles/csshake.css');

var fgColor = "#FFF",
    bgColor = '#DB0A5B',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FFF",
    fgColorOff = "#FFF";

const Buzzer = ({ enable, onOff, onClick }) => {
    enable = !!enable;
    onOff = !!onOff;
    onClick = enable ? onClick || function () {
        console.log('Buzzer clicked');
    } : null;

    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardFgColor = enable ? (onOff ? fgColorOn : fgColorOff) : fgColorDisabled;

    let reallyOn = enable && onOff;
    let icon = reallyOn ? <BuzzerOnIcon fill={cardFgColor} /> : <BuzzerOffIcon fill={cardFgColor} />;
    let shakeClass = reallyOn ? csshake['shake-rotate'] + ' ' + csshake['shake-constant'] + ' ' + csshake['shake-constant--hover'] : '';

    return (
        <div className={shakeClass} style={{width: '100%', height: '100%', backgroundColor: cardBgColor }} onClick={onClick} >
            {icon}
        </div>
    );
}

Buzzer.propTypes = {
    enable: PropTypes.bool.isRequired,
    onOff: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Buzzer
