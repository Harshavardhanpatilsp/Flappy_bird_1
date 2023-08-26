import { _decorator, Component, Node, CCInteger, input, Input, EventKeyboard, KeyCode, director, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
import { Ground } from './Ground';
import { Results } from './Results';
import { Bird } from './Bird';
const { ccclass, property } = _decorator;

import { PipePool } from './PipePool';
import { BirdAudio } from './BirdAudio';

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property({
        type:Ground,
        tooltip: 'Ground is here'
    })
    public ground: Ground

    @property({
        type: CCInteger
    })
    public speed: number = 300

    @property({
        type: Results,
        tooltip: 'Results go here'
    })
    public result: Results

    @property({
        type: CCInteger
    })
    public pipeSpeed: number = 200

    @property({
        type: Bird
    })
    public bird: Bird

    @property({
        type: PipePool
    })
    public pipeQueue: PipePool

    @property({
        type: BirdAudio
    })
    public clip: BirdAudio

    public isOver: boolean;

    onLoad(){
        console.log("1")
        this.initListener()
        this.result.resetScore()
        this.isOver = true
        director.pause()
    }

    initListener(){
        console.log("2")
        //input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)

        this.node.on(Node.EventType.TOUCH_START, () => {
            console.log("3");
            if(this.isOver == true){
                this.pipeSpeed = 200
                this.resetGame()
                this.bird.resetBird()
                this.startGame()
            }

            if(this.isOver == false){
                this.bird.fly()
                this.clip.onAudioQueue(0)
            }
        })
    }

    //Only for testing
    //onKeyDown(event: EventKeyboard){
    //    switch(event.keyCode){
    //        case KeyCode.KEY_A:
    //            this.gameOver()
    //            break;
    //        case KeyCode.KEY_P:
    //            this.result.addScore()
    //            break;
    //        case KeyCode.KEY_Q:
    //            this.resetGame()
    //            this.bird.resetBird()
    //    }

    //}

    startGame(){
        console.log("4")
        this.result.hideResults()
        this.pipeSpeed = 200
        director.resume()
    }

    gameOver(){
        console.log("5")
        this.result.showResults()
        this.isOver = true
        this.clip.onAudioQueue(3)
        director.pause()
    }

    resetGame(){
        console.log("6")
        this.result.resetScore()
        this.pipeQueue.reset()
        this.isOver = false
        this.startGame()
    }

    passPipe(){
        console.log("7")
        this.result.addScore()
        this.clip.onAudioQueue(1)
        if(this.result.currentscore % 3 == 0){
            this.pipeSpeed *= 1.5
        }
    }

    createPipe(){
        console.log("8")
        this.pipeQueue.addPool()
    }

    contactGroundPipe(){
        let collider = this.bird.getComponent(Collider2D)
        if(collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        this.bird.hitSomething = true;
        this.clip.onAudioQueue(2);
    }

    birdStruct(){
        this.contactGroundPipe()
        if(this.bird.hitSomething == true) {
            this.gameOver()
        }
    }

    update(){
        if(this.isOver == false) {
            this.birdStruct()
        }
    }
}

