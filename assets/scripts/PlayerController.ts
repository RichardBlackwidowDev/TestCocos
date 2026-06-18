import { _decorator, Component, Animation, input, Input, Vec3, Collider, ITriggerEvent, RigidBody, tween, director } from 'cc';
import { ObstacleSpawner } from './ObstacleSpawner';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property jumpHeight: number = 7.5;

    private collider: Collider | null = null;
    private rb: RigidBody | null = null;
    private anim: Animation | null = null;

    private isDead: boolean = false;
    private tempVec: Vec3 = new Vec3();
    private spawner: ObstacleSpawner | null = null;

    // ─── Lifecycle ───────────────────────────────────────

    public start() {
        this.collider = this.getComponent(Collider);
        this.rb = this.getComponent(RigidBody);
        this.anim = this.getComponentInChildren(Animation);

        if (this.anim != null)
            this.anim.play("Run");

        this.spawner = director.getScene()?.getComponentInChildren(ObstacleSpawner);
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

    // ─── Init helpers ────────────────────────────────────

    private setupCollisionHandlers() {
        if (this.collider == null) return;

        this.collider.on("onTriggerEnter", this.onRockHit, this);
        this.collider.on('onCollisionEnter', this.onGroundHit, this);
    }

    // ─── Gameplay ────────────────────────────────────────

    private isGrounded(): boolean {
        this.rb.getLinearVelocity(this.tempVec);
        return this.tempVec.y > -0.1 && this.tempVec.y < 0.1;
    }

    private onTouch() {
        if (this.isDead || GameManager.Instance?.isGameOver) return;
        if (!this.isGrounded()) return;

        this.tempVec.set(0, this.jumpHeight, 0);
        this.rb.setLinearVelocity(this.tempVec);

        if (this.anim)
            this.anim.play("Jump")

        GameManager.Instance?.onJump();
    }

    private onRockHit(event: ITriggerEvent) {
        if (this.isDead) return;
        this.fall();
    }

    private onGroundHit() {
        if (this.anim == null) return
        this.anim.play("Run");

        GameManager.Instance?.onLanded();
    }

    // ─── Death ───────────────────────────────────────────

    private fall() {
        this.isDead = true;
        this.disablePlayer();
        this.applyFallImpulse();

        this.scheduleOnce(() => this.playFallAnimation(), 0.3);
        this.scheduleOnce(() => {
            this.spawner?.stop();
            GameManager.Instance?.onCollision();
        }, 1);
    }

    private disablePlayer() {
        if (this.collider != null)
            this.collider.enabled = false;
    }

    private applyFallImpulse() {
        if (this.rb == null) return;

        this.rb.useGravity = true;
        this.tempVec.set(0, 5, -3);
        this.rb.setLinearVelocity(this.tempVec);
    }

    private playFallAnimation() {
        tween(this.node)
            .to(0.4, { eulerAngles: new Vec3(90, 0, 0) })
            .start();
    }
}

