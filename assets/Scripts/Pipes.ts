import { _decorator, Component, Node, ToggleContainerComponent, Vec3, screen, find, UITransform } from 'cc';
const { ccclass, property } = _decorator;

const random = (min, max) => {
    return Math.random() * (max-min) + min;
}

@ccclass('Pipe')
export class Pipe extends Component {
    @property({
        type: Node,
        tooltip: "Top Pipe"
    })
    public topPipe: Node

    @property({
        type: Node,
        tooltip: "Bottom Pipe"
    })
    public bottomPipe: Node


    public tempStartLocationUp: Vec3 = new Vec3(0,0,0)
    public tempStartLocationDown: Vec3 = new Vec3(0,0,0)
    public scene = screen.windowSize

    public game
    public pipeSpeed:number
    public tempSpeed:number
    isPass:boolean

    onLoad(){
        this.game = find("GameCtrl").getComponent("GameCtrl")
        this.pipeSpeed = this.game.pipeSpeed
        this.initPos()
        this.isPass = false
    }

    initPos(){
        this.tempStartLocationUp.x = (this.topPipe.getComponent(UITransform).width + this.scene.width)
        this.tempStartLocationDown.x = (this.topPipe.getComponent(UITransform).width + this.scene.width)

        let gap = random(90,100);
        let topHeight = random(0, 450);

        this.tempStartLocationUp.y = topHeight;
        this.tempStartLocationDown.y = (topHeight - (gap * 10))

        this.bottomPipe.setPosition(this.tempStartLocationDown)
        this.topPipe.setPosition(this.tempStartLocationUp)
    }


    update(deltaTime){

       
        console.log(this.pipeSpeed)


        this.tempSpeed = this.pipeSpeed * deltaTime

        this.tempStartLocationDown = this.bottomPipe.position;
        this.tempStartLocationUp = this.topPipe.position;

        this.tempStartLocationDown.x -= this.tempSpeed
        this.tempStartLocationUp.x -= this.tempSpeed

        this.bottomPipe.setPosition(this.tempStartLocationDown)
        this.topPipe.setPosition(this.tempStartLocationUp)

        console.log(this.topPipe.position.x)
        console.log(this.scene.width)

        if(this.isPass == false && this.topPipe.position.x <= 0){
            this.isPass = true
            this.game.passPipe()
        }

        if(this.topPipe.position.x < (0 - this.scene.width)){
            this.game.createPipe()
            this.destroy()
        }
    }
}

