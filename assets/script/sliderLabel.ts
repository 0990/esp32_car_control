import { _decorator, Component, Label, Node,Slider,EditBox} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('sliderLabel')
export class sliderLabel extends Component {
    @property(Slider)
    slider: Slider | null = null;

    @property(Label)
    label: Label | null = null;

     onLoad(){
        this.onSliderCallback(this.slider)
        this.slider!.node.on('slide', this.onSliderCallback, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onSliderCallback(slider: Slider) {
        var x = slider.progress-0.5;
        this.label.string = Math.ceil(x*200).toString()+"%";
    }
}


