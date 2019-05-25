/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/**
 * 自定义图形块
 */



/*****************************************************************************************************************************************
 *  小车类 ***************************************************************************************************************************** 
 ****************************************************************************************************************************************/

//% weight=5 color=#9900CC icon="\uf1b9"
namespace XRbit_小车 {
    const XRBIT_ADDRESS = 0x17
    export enum enMotor {
        //% blockId="leftMotor" block="左侧电机"
        leftMotor = 0x14,
        //% blockId="rightMotor" block="右侧电机"
        rightMotor = 0x15
    }

    export enum IRValue {
        Power = 0x45,
        Menu = 0x47,
        Test = 0x44,
        Plus = 0x40,
        Return = 0x43,
        Left = 0x07,
        Play = 0x15,
        Right = 0x09,
        Num0 = 0x16,
        Minus = 0x19,
        Cancle = 0x0D,
        Num1 = 0x0C,
        Num2 = 0x18,
        Num3 = 0x5E,
        Num4 = 0x08,
        Num5 = 0x1C,
        Num6 = 0x5A,
        Num7 = 0x42,
        Num8 = 0x52,
        Num9 = 0x4A 
         
    }

    function i2cwrite(addr: number, reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    //% blockId=XRbit_SetMotor block="SetMotor|Motor %Motor|Speed %Speed"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    //% Speed.min=-100 Speed.max=100
    export function SetMotor(Motor: enMotor, Speed: number): void {
        let buf1 = pins.createBuffer(2);
        let buf2 = pins.createBuffer(2);
        buf1[0] = 0xFF;
        buf1[1] = Motor;
        buf2[0] = Speed+100;
        buf2[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf1);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf2);
    }

    //% blockId=XRBIT_SetServoAngle block="SetServoAngle|Num %Num|Angle %Angle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    //% Num.min=1 Num.max=8 Angle.min=0 Angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function SetServoAngle(Num: number, Angle: number): void {
        let buf1 = pins.createBuffer(2);
        let buf2 = pins.createBuffer(2);
        buf1[0] = 0xFF;
        buf1[1] = Num;
        buf2[0] = Angle;
        buf2[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf1);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf2);
    }

    //% blockId=XRBIT_ReSetServoAngle block="ReSetServoAngle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    export function ReSetServoAngle(): void {
        let buf1 = pins.createBuffer(2);
        let buf2 = pins.createBuffer(2);
        buf1[0] = 0xFF;
        buf1[1] = 0x00;
        buf2[0] = 0x01;
        buf2[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf1);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf2);
    }
    //% blockId=XRBIT_SaveServoAngle block="SaveServoAngle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    export function SaveServoAngle(): void {
        let buf1 = pins.createBuffer(2);
        let buf2 = pins.createBuffer(2);
        buf1[0] = 0xFF;
        buf1[1] = 0x11;
        buf2[0] = 0x01;
        buf2[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf1);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf2);
    }
    //% blockId=irremote_on_pressed block = "irremote_on_pressed on |%IRValue| button pressed"
    //% color="#0fbc11"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function irremote_on_pressed(IRValue:IRValue): boolean {
        let irread: boolean = false;
        let IRreaddat = 0x00;
        let reg = pins.createBuffer(1);
        reg[0] = 0x16;
        pins.i2cWriteBuffer(XRBIT_ADDRESS, reg);
        IRreaddat = pins.i2cReadNumber(XRBIT_ADDRESS, NumberFormat.UInt8BE);
        if (IRreaddat == IRValue) {
            irread = true;
        }
        else { 
            irread = false;
        }
        return irread;
    }
}