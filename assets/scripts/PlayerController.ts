import { _decorator, Component, Animation, input, Input, Vec3, Collider, ITriggerEvent, RigidBody } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component 
{
    @property jumpHeight: number = 7.5;

    private collider: Collider | null = null;
    private rb: RigidBody | null = null;
    private anim: Animation | null = null;
    private tempVec: Vec3 = new Vec3();

    public start() 
    {
        this.collider = this.getComponent(Collider);
        this.rb = this.getComponent(RigidBody);
        this.anim = this.getComponentInChildren(Animation);

        if (this.anim != null)
            this.anim.play("Run");
        
        if (this.collider != null)
        {
            this.collider.on("onTriggerEnter", this.onRockHit, this);
            this.collider.on('onCollisionEnter', this.onGroundHit, this);
        }
        
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    }

    public onDestroy()
    {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);
        
        if (this.collider != null)
        {
            this.collider.off("onTriggerEnter", this.onRockHit, this);
            this.collider.off('onCollisionEnter', this.onGroundHit, this);
        }
    }
    
    private onTouch()
    {
        if (this.rb == null) return;

        this.rb.getLinearVelocity(this.tempVec);
        if (this.tempVec.y > 0.1 || this.tempVec.y < -0.1) return;

        this.tempVec.set(0, this.jumpHeight, 0);
        this.rb.setLinearVelocity(this.tempVec);

        if (this.anim)
            this.anim.play("Jump")

        if (GameManager.Instance)
            GameManager.Instance.onJump();
    }

    private onRockHit(event: ITriggerEvent)
    {
        if (GameManager.Instance == null) return
        GameManager.Instance.onCollision();
    }

    private onGroundHit()
    {
        if (this.anim == null) return
        this.anim.play("Run");
    }
}

