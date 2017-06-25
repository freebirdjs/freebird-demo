var m = require('mraa');

/*******************************************************************/
/* Constants and  Register Map                                     */
/*******************************************************************/
var TSL2561_Address = 0x29;   //Device address

// Integration time
var INTEGRATION_TIME0_13MS  = 0x00, // 13.7ms
    INTEGRATION_TIME1_101MS = 0x01, // 101ms
    INTEGRATION_TIME2_402MS = 0x02; // 402ms

// Integration time
var GAIN_0X  = 0x00,    // No gain - Low
    GAIN_16X = 0x10;    // 16x gain - High

// Power control bits
var CONTROL_POWERON  = 0x03,     // ON
    CONTROL_POWEROFF = 0x00;    // OFF

// TSL2561 registers
var REGISTER_Control   = 0x80,
    REGISTER_Timing    = 0x81,
    REGISTER_Interrupt = 0x86,
    REGISTER_Channal0L = 0x8C,
    REGISTER_Channal0H = 0x8D,
    REGISTER_Channal1L = 0x8E,
    REGISTER_Channal1H = 0x8F;

// Lux calculations differ slightly for CS package
var LUX_SCALE         = 14,      // Scale by 2^14
    LUX_RATIOSCALE    = 9,       // Scale ratio by 2^9
    LUX_CHSCALE       = 10,      // Scale channel values by 2^10
    LUX_CHSCALE_TINT0 = 0x7517,  // 322/11 * 2^TSL2561_LUX_CHSCALE
    LUX_CHSCALE_TINT1 = 0x0FE7;  // 322/81 * 2^TSL2561_LUX_CHSCALE

// CS package Coefficients
var LUX_K1C = 0x0043,  // 0.130 * 2^RATIO_SCALE
    LUX_B1C = 0x0204,  // 0.0315 * 2^LUX_SCALE
    LUX_M1C = 0x01ad,  // 0.0262 * 2^LUX_SCALE
    LUX_K2C = 0x0085,  // 0.260 * 2^RATIO_SCALE
    LUX_B2C = 0x0228,  // 0.0337 * 2^LUX_SCALE
    LUX_M2C = 0x02c1,  // 0.0430 * 2^LUX_SCALE
    LUX_K3C = 0x00c8,  // 0.390 * 2^RATIO_SCALE
    LUX_B3C = 0x0253,  // 0.0363 * 2^LUX_SCALE
    LUX_M3C = 0x0363,  // 0.0529 * 2^LUX_SCALE
    LUX_K4C = 0x010a,  // 0.520 * 2^RATIO_SCALE
    LUX_B4C = 0x0282,  // 0.0392 * 2^LUX_SCALE
    LUX_M4C = 0x03df,  // 0.0605 * 2^LUX_SCALE
    LUX_K5C = 0x014d,  // 0.65 * 2^RATIO_SCALE
    LUX_B5C = 0x0177,  // 0.0229 * 2^LUX_SCALE
    LUX_M5C = 0x01dd,  // 0.0291 * 2^LUX_SCALE
    LUX_K6C = 0x019a,  // 0.80 * 2^RATIO_SCALE
    LUX_B6C = 0x0101,  // 0.0157 * 2^LUX_SCALE
    LUX_M6C = 0x0127,  // 0.0180 * 2^LUX_SCALE
    LUX_K7C = 0x029a,  // 1.3 * 2^RATIO_SCALE
    LUX_B7C = 0x0037,  // 0.00338 * 2^LUX_SCALE
    LUX_M7C = 0x002b,  // 0.00260 * 2^LUX_SCALE
    LUX_K8C = 0x029a,  // 1.3 * 2^RATIO_SCALE
    LUX_B8C = 0x0000,  // 0.000 * 2^LUX_SCALE
    LUX_M8C = 0x0000;  // 0.000 * 2^LUX_SCALE

/*******************************************************************/
/* Constructor of the Sensor                                       */
/*******************************************************************/
function Tsl2561(bus, gain, intTime) {
    this.i2c = null;
    this.bus = bus;
    this.addr = TSL2561_Address;    // TSL2561 Address = 0x29
    this.gain = gain;
    this.intTime = intTime;
};

Tsl2561.prototype.init = function (callback) {
    var gain = this.gain,
        intTime = this.intTime,
        i2c;

    callback = callback || function () {};

    this.i2c = this.i2c || new m.I2c(this.bus);
    i2c = this.i2c;
    i2c.address(this.addr);

    try {
        // POWER UP.
        i2c.writeReg(REGISTER_Control, CONTROL_POWERON);

        setTimeout(function () {
            try {
                // Gain & Integration time.
                i2c.writeReg(REGISTER_Timing, gain | intTime);

                // Set interrupt threshold to default.
                i2c.writeReg(REGISTER_Interrupt, 0x00);
                callback();
            } catch (e) {
                callback(e);
            }
        }, 2);

    } catch (e) {
        callback(e);
    }

    return this;
};

Tsl2561.prototype.close = function (callback) {
    callback = callback || function () {};

    try {
        this.i2c.writeReg(REGISTER_Control, CONTROL_POWEROFF);
        this.i2c = null;
        callback(null);
    } catch (e) {
        callback(e);
    }

    return this;
};

Tsl2561.prototype.writeReg = function (reg, val, callback) {
    callback = callback || function () {};

    try {
        // Write register to I2C
        this.i2c.writeByte(reg);

        // Write value to I2C
        this.i2c.writeByte(val);

        setTimeout(function () {
            callback(null);
        }, 100);
    } catch (e) {
        setImmediate(function () {
            callback(e);
        });
    }

    return this;
};

Tsl2561.prototype.readReg = function (reg, callback) {
    var val;

    try {
        // Write register to I2C
        this.i2c.writeByte(reg);

        // Read 1 byte from bus
        val = this.i2c.readByte();

        setImmediate(function () {
            callback(null, val);
        });
    } catch (e) {
        setImmediate(function () {
            callback(e);
        });
    }

    return this;
};

Tsl2561.prototype.readLux = function (callback) {
    var self = this,
        lux,
        ch0Low,
        ch0High,
        ch1Low,
        ch1High;

    this.readReg(REGISTER_Channal0L, function (err, valCh0Low) {
        if (err) {
            callback(err);
        } else {
            ch0Low = valCh0Low;
            self.readReg(REGISTER_Channal0H, function (err, valCh0High) {
                if (err) {
                    callback(err);
                } else {
                    ch0High = valCh0High;
                    self.readReg(REGISTER_Channal1L, function (err, valCh1Low) {
                        if (err) {
                            callback(err);
                        } else {
                            ch1Low = valCh1Low;
                            self.readReg(REGISTER_Channal1H, function (err, valCh1High) {
                                if (err) {
                                    callback(err);
                                } else {
                                    ch1High = valCh1High;
                                    lux = self.calcLuxSync(ch0High, ch0Low, ch1High, ch1Low);
                                    callback(null, lux);
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    return this;
};

Tsl2561.prototype.calcLuxSync = function (ch0H, ch0L, ch1H, ch1L) {
    var rawLuxCh0 = 0,
        rawLuxCh1 = 0,
        scale = 0,
        channel0 = 0, 
        channel1 = 0,
        ratio1 = 0,
        ratio = 0,
        b = 0,
        m = 0,
        tempLux = 0;

    rawLuxCh0 = ch0H*256 + ch0L;
    rawLuxCh1 = ch1H*256 + ch1L;

    if (this.intTime === 0)             // 13.7 msec
        scale = LUX_CHSCALE_TINT0;
    else if (this.intTime === 1)        // 101 msec
        scale = LUX_CHSCALE_TINT1;  
    else if (this.intTime === 2)        // assume no scaling
        scale = (1 << LUX_CHSCALE);

    // scale if gain is NOT 16X
    if(!this.gain)
        scale = scale << 4;

    // scale the channel values
    channel0 = (rawLuxCh0 * scale) >> LUX_CHSCALE;
    channel1 = (rawLuxCh1 * scale) >> LUX_CHSCALE;

    // find the ratio of the channel values (Channel1/Channel0)
    // protect against divide by zero
    if (channel0 != 0)
        ratio1 = (channel1 << (LUX_RATIOSCALE+1)) / channel0;

    // round the ratio value
    ratio = (ratio1 + 1) >> 1;

    // CS package
    // Check if ratio <= eachBreak ?
    if ((ratio >= 0) && (ratio <= LUX_K1C )) {
        b = LUX_B1C;
        m = LUX_M1C;
    } else if (ratio <= LUX_K2C) {
        b = LUX_B2C;
        m = LUX_M2C;
    } else if (ratio <= LUX_K3C) {
        b = LUX_B3C;
        m = LUX_M3C;
    } else if (ratio <= LUX_K4C) {
        b = LUX_B4C;
        m = LUX_M4C;
    } else if (ratio <= LUX_K5C) {
        b = LUX_B5C;
        m = LUX_M5C;
    } else if (ratio <= LUX_K6C) {
        b = LUX_B6C;
        m = LUX_M6C;
    } else if (ratio <= LUX_K7C) {
        b = LUX_B7C;
        m = LUX_M7C;
    } else if (ratio > LUX_K8C) {
        b = LUX_B8C;
        m = LUX_M8C;
    }

    tempLux = ((channel0 * b) - (channel1 * m));

    // do not allow negative lux value
    if (tempLux < 0)
        tempLux = 0;

    // round lsb (2^(LUX_SCALE-1))
    tempLux += (1 << (LUX_SCALE-1));

    // strip off fractional portion
    return (tempLux >> LUX_SCALE);
};

module.exports = Tsl2561;
