function Vo設定 () {
    Vo0 = 1023
    Vo1 = 500
    Vo2 = 500
    Vo3 = 0
    Vo4 = 500
    Vo17 = 500
    Vo18 = 500
    Vo19 = 0
    Vo20 = 500
    Vo33 = 500
    Vo34 = 500
    Vo35 = 0
    Vo36 = 500
}
input.onButtonPressed(Button.A, function () {
    Vo設定()
    on_off = true
    Start = true
    R = 0
    music.play(music.createSoundExpression(WaveShape.Sawtooth, 500, 499, 255, 0, 750, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    basic.showArrow(ArrowNames.South)
    basic.clearScreen()
})
pins.onPulsed(DigitalPin.P2, PulseValue.High, function () {
    if (pins.pulseDuration() >= 13000) {
        R += 1
    }
})
function 加速度補正 () {
    X = Xi + Xo
    Xi = 0.93 * X
    Xo = 0.07 * input.acceleration(Dimension.X)
    X = Math.round(X)
    if (-500 >= X || X >= 500) {
        Xh = X
    } else {
        Xh = 0
    }
    Y = Yi + Yo
    Yi = 0.93 * Y
    Yo = 0.07 * input.acceleration(Dimension.Y)
    Y = Math.round(Y)
    if (-50 >= Y || Y >= 50) {
        Yh = Y
    } else {
        Yh = 0
    }
    Z = Zi + Zo
    Zi = 0.9 * Z
    Zo = 0.1 * input.acceleration(Dimension.Z)
    Z = Math.round(Z)
    if (-1100 >= Z || Z >= -900) {
        Zh = Z
    } else {
        Zh = -1000
    }
}
input.onButtonPressed(Button.AB, function () {
    datalogger.deleteLog(datalogger.DeleteType.Full)
    music.play(music.builtinPlayableSoundEffect(soundExpression.sad), music.PlaybackMode.UntilDone)
    basic.showIcon(IconNames.No)
    basic.pause(500)
    basic.clearScreen()
})
input.onButtonPressed(Button.B, function () {
    on_off = false
    Log = false
    music.play(music.createSoundExpression(WaveShape.Noise, 1600, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.UntilDone)
    basic.showLeds(`
        . . . . .
        . # . # .
        . # . # .
        . # . # .
        # . . . .
        `)
    basic.clearScreen()
})
function VoVi制御 () {
    pins.analogWritePin(AnalogPin.P1, Math.constrain(Math.abs(P), 0, 1023))
    if (P > 200) {
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.digitalWritePin(DigitalPin.P9, 1)
    } else if (P <= 200 && P >= -200) {
        pins.digitalWritePin(DigitalPin.P8, 1)
        pins.digitalWritePin(DigitalPin.P9, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P8, 1)
        pins.digitalWritePin(DigitalPin.P9, 0)
    }
    if (Start == true) {
        Vo3 = 950
    } else {
        Vo3 = 0
    }
    if (0 <= R && R < 6.7) {
        if (Xh <= -1000) {
            R = 0
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo1
        }
    } else if (6.7 <= R && R < 13.4) {
        if (Xh <= -1000) {
            R = 0
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo2
        }
    } else if (13.4 <= R && R < 20.3) {
        P = Vo3
    } else if (20.3 <= R && R < 27.2) {
        P = Vo4
    } else if (96.5 <= R && R < 103.2) {
        if (Xh <= -1000) {
            R = 96
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo17
        }
    } else if (103.2 <= R && R < 109.9) {
        if (Xh <= -1000) {
            R = 96
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo18
        }
    } else if (109.9 <= R && R < 116.8) {
        P = Vo19
        Start = false
    } else if (116.8 <= R && R < 123.7) {
        P = Vo20
    } else if (187.4 <= R && R < 194.1) {
        if (Xh <= -1000) {
            R = 187
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo33
        }
    } else if (194.1 <= R && R < 200.8) {
        if (Xh <= -1000) {
            R = 187
        } else if (Yh <= -250) {
            P = -600
            basic.pause(1000)
        } else {
            P = Vo34
        }
    } else if (200.8 <= R && R < 207.7) {
        P = Vo35
    } else if (207.7 <= R && R < 214.6) {
        P = Vo36
    } else {
        P = Vo0
    }
    if (R >= 288) {
        R = 0
    }
}
let P = 0
let Zh = 0
let Zo = 0
let Zi = 0
let Z = 0
let Yh = 0
let Yo = 0
let Yi = 0
let Y = 0
let Xh = 0
let Xo = 0
let Xi = 0
let X = 0
let R = 0
let Start = false
let Vo36 = 0
let Vo35 = 0
let Vo34 = 0
let Vo33 = 0
let Vo20 = 0
let Vo19 = 0
let Vo18 = 0
let Vo17 = 0
let Vo4 = 0
let Vo3 = 0
let Vo2 = 0
let Vo1 = 0
let Vo0 = 0
let on_off = false
let Log = false
pins.setEvents(DigitalPin.P2, PinEventType.Pulse)
pins.setPull(DigitalPin.P2, PinPullMode.PullDown)
input.setAccelerometerRange(AcceleratorRange.EightG)
Log = false
on_off = false
basic.showIcon(IconNames.Diamond)
basic.showIcon(IconNames.Target)
basic.showIcon(IconNames.SmallDiamond)
basic.clearScreen()
basic.forever(function () {
    if (on_off == true) {
        VoVi制御()
    } else {
        pins.analogWritePin(AnalogPin.P1, 0)
    }
})
basic.forever(function () {
    加速度補正()
})
