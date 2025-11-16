
interface ScalarQuantity {
  unit: string;
  value: number;
}

interface VectorQuantity {
  unit: string;
  value: number[];
}

export enum SpeedUnit {
  KmPerHour = 'km/hr',
  MeterPerSecond = 'm/s',
  MilePerHour = 'mi/hr'
}
export enum DensityUnit {
  KgPerMeter3 = 'kg/m3',
}

export class Velocity implements VectorQuantity {
  public unit: SpeedUnit;
  public value: number[];

  private _convertTo(input: Velocity): number[] {
    if (this.unit !== input.unit) {

      return [0,0,0];
    }
    return [0,0,0];
  }

  constructor(unit: SpeedUnit, valueOrInput: number[] | Velocity) {
    this.unit = unit;

    if (typeof valueOrInput === 'number') {
      this.value = valueOrInput;
      console.log('Constructing Velocity in normal constructor');
    } else {
      const input = valueOrInput as Velocity;
      this.value = this._convertTo(input);
      console.log('Constructing Velocity in converting constructor');
    }
  }

}

export class Speed implements ScalarQuantity {
  public unit: SpeedUnit;
  public value: number;

  private _convertTo(input: Speed): number {
    if (this.unit !== input.unit) {

      return 0;
    }
    return 0;
  }

  constructor(unit: SpeedUnit, valueOrInput: number | Speed) {
    this.unit = unit;

    if (typeof valueOrInput === 'number') {
      this.value = valueOrInput;
      console.log('Constructing Speed in normal constructor');
    } else {
      const input = valueOrInput as Speed;
      this.value = this._convertTo(input);
      console.log('Constructing Speed in converting constructor');
    }
  }
}



export class Density implements ScalarQuantity {
  public unit: DensityUnit;
  public value: number;

  private _convertTo(input: Density): number {
    if (this.unit !== input.unit) {

      return 0;
    }
    return 0;
  }

  constructor(unit: DensityUnit, valueOrInput: number | Density) {
    this.unit = unit;

    if (typeof valueOrInput === 'number') {
      this.value = valueOrInput;
      console.log('Constructing Density in normal constructor');
    } else {
      const input = valueOrInput as Density;
      this.value = this._convertTo(input);
      console.log('Constructing Density in converting constructor');
    }
  }
}