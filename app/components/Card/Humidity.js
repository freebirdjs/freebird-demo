import React from 'react';
import HumidityIcon from '../../static/humid.png';

var fgColor = "#FFF",
    bgColor = "#8ED4E8",
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD";

const Humidity = ({enable, humid}) => {
    enable = !!enable;

    let cardFgColor = enable ? fgColor : fgColorDisabled;
    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardValue = enable ? humid : undefined;

    return (
        <div style={{width: "100%", height: "100%", backgroundColor: cardBgColor }}>
            <div style={{float: "left", width: "50%", height: "100%"}}>
                <div style={{position: "relative", top: "15%", left: "15%", width: "70%", height: "70%"}}>
                    <svg fill={cardFgColor} height="100%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <path transform="scale(0.5), translate(12)" d="M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z"/>
                        <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.46.27-1.08.64-2.19.64-1.11 0-1.73-.37-2.18-.64-.37-.23-.6-.36-1.15-.36s-.78.13-1.15.36c-.46.27-1.08.64-2.19.64v-2c.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36.56 0 .78-.13 1.15-.36.46-.27 1.08-.64 2.19-.64 1.11 0 1.73.37 2.18.64.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.23.59.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.56 0-.78.13-1.15.36-.45.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36s-.78.13-1.15.36c-.47.27-1.09.64-2.2.64v-2c.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.56 0 .78-.13 1.15-.36.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36s.78-.13 1.15-.36c.45-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36v2zM8.67 12c.56"/>
                    </svg>
                </div>
            </div>

            <div style={{float: "left", width: "50%", height: "100%"}}>
                <div style={{position: "absolute", top: "30%", bottom: "0", left: "50%", right: "0", margin: "0", textAlign: "center", fontSize: "1.5em", color: "white"}}>
                    {cardValue} %
                </div>
            </div>
        </div>
    );
}

export default Humidity
