def Vo設定():
    global Vo1, Vo2, Vo3, Vo4, Vo18, Vo19, Vo20, Vo34, Vo35, Vo36
    Vo1 = 1023
    Vo2 = 400
    Vo3 = 0
    Vo4 = 400
    Vo18 = 400
    Vo19 = 0
    Vo20 = 400
    Vo34 = 400
    Vo35 = 0
    Vo36 = 400

def on_button_pressed_a():
    global on_off, Start, R
    Vo設定()
    on_off = True
    Start = True
    R = 0
    music.play(music.create_sound_expression(WaveShape.SAWTOOTH,
            500,
            499,
            255,
            0,
            750,
            SoundExpressionEffect.NONE,
            InterpolationCurve.LINEAR),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_arrow(ArrowNames.SOUTH)
    basic.clear_screen()
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_pulsed_p2_high():
    global R
    if pins.pulse_duration() >= 18000:
        R += 1
pins.on_pulsed(DigitalPin.P2, PulseValue.HIGH, on_pulsed_p2_high)

def 加速度補正():
    global X, Xi, Xo, Xh, Y, Yi, Yo, Yh, Z, Zi, Zo, Zh
    X = Xi + Xo
    Xi = 0.92 * X
    Xo = 0.08 * input.acceleration(Dimension.X)
    X = Math.round(X)
    if -600 >= X or X >= 600:
        Xh = X
    else:
        Xh = 0
    Y = Yi + Yo
    Yi = 0.9 * Y
    Yo = 0.1 * input.acceleration(Dimension.Y)
    Y = Math.round(Y)
    if -50 >= Y or Y >= 50:
        Yh = Y
    else:
        Yh = 0
    Z = Zi + Zo
    Zi = 0.9 * Z
    Zo = 0.1 * input.acceleration(Dimension.Z)
    Z = Math.round(Z)
    if -1050 >= Z or Z >= -950:
        Zh = Z
    else:
        Zh = -1000

def on_button_pressed_ab():
    datalogger.delete_log(datalogger.DeleteType.FULL)
    music.play(music.builtin_playable_sound_effect(soundExpression.sad),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_icon(IconNames.NO)
    basic.pause(500)
    basic.clear_screen()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def on_button_pressed_b():
    global on_off, Log
    on_off = False
    Log = False
    music.play(music.create_sound_expression(WaveShape.NOISE,
            1600,
            1,
            255,
            0,
            300,
            SoundExpressionEffect.NONE,
            InterpolationCurve.CURVE),
        music.PlaybackMode.UNTIL_DONE)
    basic.show_leds("""
        . . . . .
        . # . # .
        . # . # .
        . # . # .
        # . . . .
        """)
    basic.clear_screen()
input.on_button_pressed(Button.B, on_button_pressed_b)

def VoVi制御():
    global Vo3, P, R, Start
    pins.analog_write_pin(AnalogPin.P1, Math.constrain(abs(P), 0, 1023))
    if P > 200:
        pins.digital_write_pin(DigitalPin.P8, 0)
        pins.digital_write_pin(DigitalPin.P9, 1)
    elif P <= 200 and P >= -200:
        pins.digital_write_pin(DigitalPin.P8, 1)
        pins.digital_write_pin(DigitalPin.P9, 1)
    else:
        pins.digital_write_pin(DigitalPin.P8, 1)
        pins.digital_write_pin(DigitalPin.P9, 0)
    if Start == True:
        Vo3 = 950
    else:
        Vo3 = 0
    if 6.7 <= R and R < 13.4:
        P = Vo2
    elif 13.4 <= R and R < 20.3:
        P = Vo3
    elif 20.3 <= R and R < 27.2:
        P = Vo4
    elif 80 <= R and R < 96.5 and Xh < -800:
        R = 96
    elif 103.2 <= R and R < 109.9:
        P = Vo18
    elif 109.9 <= R and R < 116.8:
        P = Vo19
        Start = False
    elif 116.8 <= R and R < 123.7:
        P = Vo20
    elif 176 <= R and R < 182.3 and Xh < -800:
        R = 188
    elif 194.1 <= R and R < 200.8:
        P = Vo34
    elif 200.8 <= R and R < 207.7:
        P = Vo35
    elif 207.7 <= R and R < 214.6:
        P = Vo36
    elif 260 <= R and R < 281.1 and Xh < -800:
        R = 287
    else:
        P = Vo1
    if R >= 288:
        R = 0
P = 0
Zh = 0
Zo = 0
Zi = 0
Z = 0
Yh = 0
Yo = 0
Yi = 0
Y = 0
Xh = 0
Xo = 0
Xi = 0
X = 0
R = 0
Start = False
Vo36 = 0
Vo35 = 0
Vo34 = 0
Vo20 = 0
Vo19 = 0
Vo18 = 0
Vo4 = 0
Vo3 = 0
Vo2 = 0
Vo1 = 0
on_off = False
Log = False
pins.set_events(DigitalPin.P2, PinEventType.PULSE)
pins.set_pull(DigitalPin.P2, PinPullMode.PULL_DOWN)
input.set_accelerometer_range(AcceleratorRange.EIGHT_G)
Log = False
on_off = False
music.play(music.builtin_playable_sound_effect(soundExpression.twinkle),
    music.PlaybackMode.UNTIL_DONE)
basic.show_icon(IconNames.DIAMOND)
basic.show_icon(IconNames.TARGET)
basic.show_icon(IconNames.SMALL_DIAMOND)
basic.clear_screen()

def on_forever():
    加速度補正()
    if on_off == True:
        VoVi制御()
    else:
        pins.analog_write_pin(AnalogPin.P1, 0)
basic.forever(on_forever)
