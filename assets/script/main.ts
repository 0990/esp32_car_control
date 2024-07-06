import { _decorator, Component,Button, Node, Input,debug,EditBox,Toggle, sys,Label,Slider, Sprite,color} from 'cc';
const { ccclass, property } = _decorator;

const AP_IP = "192.168.4.1";

@ccclass('main')
export class main extends Component {
    isLedOn = false;
    isPro = false;

    @property(Button)
    btnForward: Button | null = null;
    @property(Button)
    btnBackWard: Button | null = null;
    @property(Button)
    btnTurnLeft: Button | null = null;
    @property(Button)
    btnTurnRight: Button | null = null;

    @property(Button)
    btnCheck: Button | null = null;

    @property(Button)
    btnBuzzer: Button | null = null;

    @property(Button)
    btnSetting: Button | null = null;

    @property(Button)
    btnLed: Button | null = null;

    @property(Button)
    btnPro: Button | null = null;

    @property(Button)
    btnServo: Button | null = null;

    @property(Toggle)
    toggleConnected: Toggle | null = null;

    @property(EditBox)
    ipEditBox: EditBox | null = null;

    @property(Label)
    tfPitch: Label | null = null;

    @property(Label)
    tfRoll: Label | null = null;

    @property(Slider)
    sliderPitch: Slider | null = null;

    @property(Slider)
    sliderRoll: Slider | null = null;

    @property(Node)
    settingPanel: Node|null = null;

    start() {

    }

    onLoad () {
        this.toggleConnected.isChecked=false;

        const ipValue = sys.localStorage.getItem("ip");
        if (ipValue) {
            this.ipEditBox.string = ipValue;
        } else {
            this.ipEditBox.string = "192.168.4.1";
        }

        const pitchValue = sys.localStorage.getItem("sliderPitch");
        if (pitchValue) {
            this.sliderPitch.progress = Number(pitchValue);
        } else {
            this.sliderPitch.progress = 0.5;
        }

        const rollValue = sys.localStorage.getItem("sliderRoll");
        if (rollValue) {
            this.sliderRoll.progress = Number(rollValue);
        } else {
            this.sliderRoll.progress = 0.5;
        }

        var self = this;
        this.btnForward.node.on(Input.EventType.TOUCH_START, function (event) {
            var value = self.sliderPitch.progress*0.5+0.5
            self.httpGet("fader1",value);
            self.triggerVibration();
        });

        this.btnForward.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader1",0.50);
        });

        this.btnBackWard.node.on(Input.EventType.TOUCH_START, function (event) {
            var value = self.sliderPitch.progress*-0.5+0.5
            self.httpGet("fader1",value);
            self.triggerVibration();
        });

        this.btnBackWard.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader1",0.50);
        });

        this.btnTurnLeft.node.on(Input.EventType.TOUCH_START, function (event) {
            var value = self.sliderRoll.progress*0.5+0.5
            self.httpGet("fader2",value);
            self.triggerVibration();
        });

        this.btnTurnLeft.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader2",0.50);
        });

        this.btnTurnRight.node.on(Input.EventType.TOUCH_START, function (event) {
            var value = self.sliderRoll.progress*-0.5+0.5
            self.httpGet("fader2",value);
            self.triggerVibration();
        });

        this.btnTurnRight.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader2",0.50);
        });

        this.btnBuzzer.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("push3",1);
            self.triggerVibration();
        });

        this.btnBuzzer.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("push3",0);
            self.triggerVibration();
        });

        this.btnServo.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("push1",1);
            self.triggerVibration();
        });

        this.btnServo.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("push1",0);
            self.triggerVibration();
        });

        this.btnCheck.node.on(Button.EventType.CLICK, this.onClickCheckBtn, this);
        this.btnLed.node.on(Button.EventType.CLICK, this.onClickLedBtn, this);
        this.btnPro.node.on(Button.EventType.CLICK, this.onClickProBtn, this);
        this.btnSetting.node.on(Button.EventType.CLICK, this.onClickSettingBtn, this);

        this.onSliderPitchCallback(this.sliderPitch);
        this.sliderPitch!.node.on('slide', this.onSliderPitchCallback, this);

        this.onSliderRollCallback(this.sliderRoll);
        this.sliderRoll!.node.on('slide', this.onSliderRollCallback, this);
    }

    triggerVibration() {
        // 检查浏览器是否支持震动功能
        if ('vibrate' in navigator) {
            // 触发震动，参数为震动时间（毫秒）
            navigator.vibrate(200);
        } else {
            console.log('当前浏览器不支持震动功能');
        }
    }


    onSliderPitchCallback(slider: Slider) {
        this.tfPitch.string = slider.progress.toFixed(3).toString();
        sys.localStorage.setItem("sliderPitch", slider.progress)
    }

    onSliderRollCallback(slider: Slider) {
        this.tfRoll.string = slider.progress.toFixed(3).toString();
        sys.localStorage.setItem("sliderRoll", slider.progress)
    }

    onClickCheckBtn (button: Button) {
        this.getStatus()
    }

    getStatus(){
        var ip = this.ipEditBox.string
        var url = "http://"+ip+"/status";
    
        sys.localStorage.setItem("ip", ip)

        var self = this;
        fetch(url).then((response: Response) => {
            return response.text()
        }).then((value) => {
            const params = new URLSearchParams(value);
            var isLedOn = params.get("led")=="1";
            var isPro = params.get("pro")=="1";
            var isAP = params.get("ap")=="1";
            self.setLedOn(isLedOn);
            self.setPro(isPro);
            self.toggleConnected.isChecked=true;
            if (isAP){
                self.ipEditBox.string = AP_IP;
            }
            console.log(value);
        }).catch((error) => {
            console.error('请求失败:', error);
            this.setLedOn(false);
            this.setPro(false);
            this.toggleConnected.isChecked=false;
        });
        console.info("httpGet",url);
    }

    onClickLedBtn(button:Button){
        var isLedOn = !this.isLedOn;
        if (isLedOn){
            this.httpGet("push4",1)
        }else{
            this.httpGet("push4",0)
        }
        this.getStatus();
        this.triggerVibration();
    }

    onClickProBtn(button:Button){
        var isPro = !this.isPro;
        if (isPro){
            this.httpGet("toggle1",1)
        }else{
            this.httpGet("toggle1",0)
        }
        this.getStatus();
        this.triggerVibration();
    }

    setLedOn(isLedOn){
        this.isLedOn = isLedOn;
        this.setButtonColor(this.btnLed,this.isLedOn);
    }

    setPro(isPro){
        this.isPro = isPro;
        this.setButtonColor(this.btnPro,this.isPro);
    }

    setButtonColor(button:Button,isOn:boolean){
        console.info("setButtonColor",button);
        if(isOn){
            button.getComponent(Sprite).color = color(39,235,70,181);
        }else{
            button.getComponent(Sprite).color = color(255,255,255);
        }
    }

    onClickSettingBtn(button:Button){
        this.settingPanel.active = true;
    }

    update(deltaTime: number) {
        
    }


    //forward fader1=0.77 0.50
    // httpGet(param:string,value:string) {
    //     var url = "http://"+this.ipEditBox.string+"/?"+param+"="+value;
    //     fetch(url).then((response: Response) => {
    //         return response.text()
    //     }).then((value) => {
    //         console.log(value);
    //     }).catch((error) => {
    //         console.error('请求失败:', error);
    //     });
    //     console.info("httpGet",url);
    // }

    httpGet(param:string,value:number) {
        var url = "http://"+this.ipEditBox.string+"/?"+param+"="+this.formatNumber(value).toString();
        fetch(url).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
        }).catch((error) => {
            console.error('请求失败:', error);
        });
        console.info("httpGet",url);
    }

    formatNumber(num: number): string {
        return num.toFixed(Math.min(3, (num.toString().split('.')[1] || '').length));
    }
}


