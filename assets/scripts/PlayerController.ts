import { _decorator, Component, Animation, input, Input, Vec3, Collider, ITriggerEvent, RigidBody, tween } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property jumpHeight: number = 7.5;

    private collider: Collider | null = null;
    private rb: RigidBody | null = null;
    private anim: Animation | null = null;

    private isDead: boolean = false;

    public start() {
        this.collider = this.getComponent(Collider);
        this.rb = this.getComponent(RigidBody);
        this.anim = this.getComponentInChildren(Animation);

        if (this.anim != null)
            this.anim.play("Run");

        this.setupCollisionHandlers();
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    }

    public onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);

        if (this.collider != null) {
            this.collider.off("onTriggerEnter", this.onRockHit, this);
            this.collider.off('onCollisionEnter', this.onGroundHit, this);
        }
    }

    private setupCollisionHandlers() {
        if (this.collider == null) return;

        this.collider.on("onTriggerEnter", this.onRockHit, this);
        this.collider.on('onCollisionEnter', this.onGroundHit, this);
    }

    private isGrounded(): boolean {
        const vel = new Vec3();
        this.rb.getLinearVelocity(vel);
        return vel.y > -0.1 && vel.y < 0.1;
    }

    private fall() {
        this.isDead = true;

        if (this.collider != null)
            this.collider.enabled = false;

        this.anim?.play("Idle");

        if (this.rb) {
            this.rb.useGravity = true;
            this.rb.setLinearVelocity(new Vec3(0, 5, -3));
        }

        this.scheduleOnce(() => {
            tween(this.node)
                .to(0.4, { eulerAngles: new Vec3(90, 0, 0) })
                .start();
        }, 0.3);

        this.scheduleOnce(() => {
            GameManager.Instance?.onCollision();
        }, 1);
    }

    private onTouch() {
        if (this.isDead || GameManager.Instance?.isGameOver) return;
        if (!this.isGrounded()) return;

        this.rb.setLinearVelocity(new Vec3(0, this.jumpHeight, 0));

        if (this.anim)
            this.anim.play("Jump")

        GameManager.Instance.onJump();
    }

    private onRockHit(event: ITriggerEvent) {
        if (this.isDead) return;
        this.fall();
    }

    private onGroundHit() {
        if (this.anim == null) return
        this.anim.play("Run");
    }
}

