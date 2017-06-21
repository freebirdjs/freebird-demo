import React, {PropTypes} from 'react';
import SwitchOnIcon from '../Icons/SwitchOnIcon';
import SwitchOffIcon from '../Icons/SwitchOffIcon';

var fgColor = "#FFF",
    bgColor = '#72E599',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FFF",
    fgColorOff = "#FFF";

const Switch = ({ enable, onOff, onClick }) => {
    enable = !!enable;
    onOff = !!onOff;
    onClick = onClick || function () {
        console.log('Switch clicked');
    };

    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardFgColor = enable ? (onOff ? fgColorOn : fgColorOff) : fgColorDisabled;

    let reallyOn = enable && onOff;
    let icon = reallyOn ? (<SwitchOnIcon fill={cardFgColor} />) : (<SwitchOffIcon fill={cardFgColor} />);

    return (
        <div style={{width: '100%', height: '100%', backgroundColor: cardBgColor}}>
            {icon}
        </div>
    );
}

Switch.propTypes = {
    enable: PropTypes.bool.isRequired,
    onOff: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};

export default Switch
