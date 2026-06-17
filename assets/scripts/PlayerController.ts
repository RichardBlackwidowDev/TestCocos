import { _decorator, Component, Animation, input, Input, Vec3, Collider, ITriggerEvent } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component 
{
    @property jumpHeight: number = 3;
    @property jumpDuration: number = 0.5;
    @property speed: number = 5;

    private collider: Collider | null = null;
    private anim: Animation | null = null;
    private isJumping: boolean = false;
    private jumpTime: number = 0;
    private startY: number = 0;
    private tempVec: Vec3 = new Vec3();

    public start() 
    {
        this.collider = this.getComponent(Collider);
        this.anim = this.getComponentInChildren(Animation);
        this.startY = this.node.position.y;

        if (this.anim != null)
            this.anim.play("run");
        
        if (this.collider != null)
            this.collider.on("onTriggerEnter", this.onRockHit, this);
        
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    }

    public onDestroy()
    {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);
        
        if (this.collider != null)
            this.collider.off("onTriggerEnter", this.onRockHit, this);
    }

    public update(deltaTime: number) 
    {
        if (!this.isJumping) return;

        this.jumpTime += deltaTime;
        const t = this.jumpTime / this.jumpDuration;

        if (t >= 1)
        {
            this.land();
            return;
        }

        const y = this.startY + this.jumpHeight * 4 * t * (1 - t);
        this.tempVec.set(0, y, 0);
        this.node.setPosition(this.tempVec);
    }
    
    private onTouch()
    {
        if (this.isJumping) return;

        this.isJumping = true;
        this.jumpTime = 0;

        if (this.anim)
        {
            this.anim.play("Jump")
        }
    }

    private onRockHit(event: ITriggerEvent)
    {
        if (GameManager.Instance == null) return
        GameManager.Instance.onCollision();
    }

    private land()
    {
        this.isJumping = false;
        this.tempVec.set(0, this.startY, 0);
        this.node.setPosition(this.tempVec);

        if (this.anim)
        {
            this.anim.play("run");
        }
    }
}

