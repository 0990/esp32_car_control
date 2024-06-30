import { _decorator, Component,Button, Node, Input,debug,EditBox,Toggle, sys} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
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

    @property(Toggle)
    connectedToggle: Toggle | null = null;

    @property(Toggle)
    proToggle: Toggle | null = null;

    @property(EditBox)
    ipEditBox: EditBox | null = null;


    start() {

    }

    onLoad () {
        this.connectedToggle.isChecked=false;
        this.proToggle.isChecked=false;


        const value = sys.localStorage.getItem("ip");
        if (value) {
            this.ipEditBox.string = value;
        } else {
            this.ipEditBox.string = "192.168.4.1";
        }

        var self = this;
        this.btnForward.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("fader1","0.77");
        });

        this.btnForward.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader1","0.50");
        });

        this.btnBackWard.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("fader1","0.23");
        });

        this.btnBackWard.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader1","0.50");
        });

        this.btnTurnLeft.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("fader2","0.76");
        });

        this.btnTurnLeft.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader2","0.50");
        });

        this.btnTurnRight.node.on(Input.EventType.TOUCH_START, function (event) {
            self.httpGet("fader2","0.24");
        });

        this.btnTurnRight.node.on(Input.EventType.TOUCH_END, function (event) {
            self.httpGet("fader2","0.50");
        });

        this.btnCheck.node.on(Button.EventType.CLICK, this.onClickCheckBtn, this);
     
    }

    onClickCheckBtn (button: Button) {
        var ip = this.ipEditBox.string
        var url = "http://"+ip+"/status";

        sys.localStorage.setItem("ip", ip)
        fetch(url).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
            this.connectedToggle.isChecked=true;
        }).catch((error) => {
            console.error('请求失败:', error);
            this.connectedToggle.isChecked=false;
        });
        console.info("httpGet",url);
    }

    update(deltaTime: number) {
        
    }


    //forward fader1=0.77 0.50
    httpGet(param:string,value:string) {
        var url = "http://"+this.ipEditBox.string+"/?"+param+"="+value;
        fetch(url).then((response: Response) => {
            return response.text()
        }).then((value) => {
            console.log(value);
        }).catch((error) => {
            console.error('请求失败:', error);
        });
        console.info("httpGet",url);
    }

    //backward fader1=0.23 0.50
    onClickBackward(button:Button){

    }

    //left fader2=0.76 0.50
    onClickLeft(button:Button){

    }

    
    //right fader2=0.24 0.50
    onClickRight(button:Button){

    }

    //push3=1 0
    onClickBupper(){

    }
}


