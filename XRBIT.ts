/**
 * 使用此文件来定义自定义函数和图形块。
 * 想了解更详细的信息，请前往 https://makecode.microbit.org/blocks/custom
 */

/**
 * 自定义图形块
 */

/*****************************************************************************************************************************************
 *  传感器类 ***************************************************************************************************************************** 
 ****************************************************************************************************************************************/

//% color="#87CEEB" weight=24 icon="\uf1b6"
namespace XRbit_传感器 {

    export enum enVoice {
        //% blockId="Voice" block="有声音"
        Voice = 0,
        //% blockId="NoVoice" block="无声音"
        NoVoice = 1
    }

    export enum enIR {
        //% blockId="Get" block="检测到"
        Get = 0,
        //% blockId="NoVoice" block="未检测"
        NoGet = 1
    }

    export enum enLight {
        //% blockId="Open" block="打开"
        Open = 0,
        //% blockId="Close" block="关闭"
        Close = 1
    }

    export enum enBuzzer {
        //% blockId="NoBeep" block="不响"
        NoBeep = 0,
        //% blockId="Beep" block="响"
        Beep
    }

    //% blockId=XRbit_Buzzer block="Buzzer|pin %pin|value %value"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% value.min=0 value.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Buzzer(pin: DigitalPin, value: enBuzzer): void {
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, value);
    }

    //% blockId=XRbit_IR_Sensor block="IR_Sensor|pin %pin| |%value|障碍物"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function IR_Sensor(pin: DigitalPin, value: enIR): boolean {
        pins.setPull(pin, PinPullMode.PullUp);
        if (pins.digitalReadPin(pin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=XRbit_Car_Ligth block="Car_Ligth |pin %pin| |%value|车灯"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Car_Ligth(pin: DigitalPin, value: enLight): boolean {
        pins.setPull(pin, PinPullMode.PullUp);
        if (pins.digitalReadPin(pin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=XRbit_ultrasonic block="Ultrasonic|Trig %Trig|Echo %Echo"
    //% color="#87CEEB"
    //% weight=100
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic(Trig: DigitalPin, Echo: DigitalPin): number {
        // send pulse
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(Trig, PinPullMode.PullNone);
            pins.digitalWritePin(Trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(Trig, 1);
            control.waitMicros(15);
            pins.digitalWritePin(Trig, 0);

            let d = pins.pulseIn(Echo, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40)
        }
        list.sort();
        let length = (list[1] + list[2] + list[3])/3;
        return  Math.floor(length);
    }
}

/*****************************************************************************************************************************************
 *  小车类 ***************************************************************************************************************************** 
 ****************************************************************************************************************************************/

//% weight=5 color=#9900CC icon="\uf1b9"
namespace XRbit_小车 {
    const XRBIT_ADDRESS = 0x17
    export enum Motor {
        //% blockId="leftMotor" block="leftMotor"
        M1 = 0x14,
        //% blockId="rightMotor" block="rightMotor"
        M2 = 0x15
    }

    export enum MovementGroups {
        //% blockId="goforward" block="goforward"
        goforward = 0x01,
        //% blockId="goback" block="goback"
        goback = 0x02,
        //% blockId="turnleft" block="turnleft"
        turnleft = 0x03,
        //% blockId="turnright" block="turnright"
        turnright = 0x04,
        //% blockId="stop" block="stop"
        stop = 0x00
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
    //% blockId=SetMotor block="SetMotor|Motor %Motor|Speed %Speed"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    //% Speed.min=-100 Speed.max=100
    export function SetMotor(Motor: Motor, Speed: number): void {
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