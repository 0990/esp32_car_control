import { _decorator, Component, Label, Node,Slider,EditBox,Button} from 'cc';
import { main } from './main';
const { ccclass, property } = _decorator;

@ccclass('settingPanel')
export class settingPanel extends Component {
    @property(Slider)
    sliderPStability: Slider | null = null;
    @property(Slider)
    sliderDStability: Slider | null = null;
    @property(Slider)
    sliderPSpeed: Slider | null = null;
    @property(Slider)
    sliderISpeed: Slider | null = null;

    @property(Button)
    btnClose: Button | null = null;

    @property(main)
    main: main|null = null;

     onLoad(){
        this.sliderPStability.progress = 0.5;
        this.sliderDStability.progress = 0.5;
        this.sliderPSpeed.progress = 0.5;
        this.sliderISpeed.progress = 0.5;
        this.sliderPStability!.node.on('slide', this.onSliderPStabilityCallback, this);
        this.sliderDStability!.node.on('slide', this.onSliderDStabilityCallback, this);
        this.sliderPSpeed!.node.on('slide', this.onSliderPSpeedCallback, this);
        this.sliderISpeed!.node.on('slide', this.onSliderISpeedCallback, this);
        this.btnClose.node.on(Button.EventType.CLICK, this.onClickCloseBtn, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onSliderPStabilityCallback(slider: Slider) {
        this.main.httpGet("fader3",slider.progress)
    }

    onSliderDStabilityCallback(slider: Slider) {
        this.main.httpGet("fader4",slider.progress)
    }

    onSliderPSpeedCallback(slider: Slider) {
        this.main.httpGet("fader5",slider.progress)
    }

    onSliderISpeedCallback(slider: Slider) {
        this.main.httpGet("fader6",slider.progress)
    }

    onClickCloseBtn (button: Button) {
        this.node.active = false;
    }
}


