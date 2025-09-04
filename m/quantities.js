export var SpeedUnit;
(function (SpeedUnit) {
    SpeedUnit["KmPerHour"] = "km/hr";
    SpeedUnit["MeterPerSecond"] = "m/s";
    SpeedUnit["MilePerHour"] = "mi/hr";
})(SpeedUnit || (SpeedUnit = {}));
export var DensityUnit;
(function (DensityUnit) {
    DensityUnit["KgPerMeter3"] = "kg/m3";
})(DensityUnit || (DensityUnit = {}));
export class Velocity {
    _convertTo(input) {
        if (this.unit !== input.unit) {
            return [0, 0, 0];
        }
        return [0, 0, 0];
    }
    constructor(unit, valueOrInput) {
        this.unit = unit;
        if (typeof valueOrInput === 'number') {
            this.value = valueOrInput;
            console.log('Constructing Velocity in normal constructor');
        }
        else {
            let input = valueOrInput;
            this.value = this._convertTo(input);
            console.log('Constructing Velocity in converting constructor');
        }
    }
}
export class Speed {
    _convertTo(input) {
        if (this.unit !== input.unit) {
            return 0;
        }
        return 0;
    }
    constructor(unit, valueOrInput) {
        this.unit = unit;
        if (typeof valueOrInput === 'number') {
            this.value = valueOrInput;
            console.log('Constructing Speed in normal constructor');
        }
        else {
            let input = valueOrInput;
            this.value = this._convertTo(input);
            console.log('Constructing Speed in converting constructor');
        }
    }
}
export class Density {
    _convertTo(input) {
        if (this.unit !== input.unit) {
            return 0;
        }
        return 0;
    }
    constructor(unit, valueOrInput) {
        this.unit = unit;
        if (typeof valueOrInput === 'number') {
            this.value = valueOrInput;
            console.log('Constructing Density in normal constructor');
        }
        else {
            let input = valueOrInput;
            this.value = this._convertTo(input);
            console.log('Constructing Density in converting constructor');
        }
    }
}
//# sourceMappingURL=quantities.js.map