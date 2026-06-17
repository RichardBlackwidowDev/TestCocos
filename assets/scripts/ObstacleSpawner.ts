import { _decorator, Component, Prefab, Node, instantiate, Vec3, math, screen } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('ObstacleSpawner')
export class ObstacleSpawner extends Component {
    @property({ type: Prefab }) rockPrefab: Prefab | null = null;
    @property poolSize: number = 3;
    @property spawnZ: number = 10;
    @property despawnZ: number = -10;
    @property minDelay: number = 0.8;
    @property maxDelay: number = 2;
    @property speed: number = 5;

    private pool: Node[] = [];
    private rockIndex: number = 0;
    private timer: number = 0;
    private delay: number = 0;
    private tempVec: Vec3 = new Vec3();

    // ─── Lifecycle ───────────────────────────────────────

    public start() {
        if (this.rockPrefab == null) {
            console.warn("ObstacleSpawner: rockPrefab is not assigned.");
            return;
        }

        this.adjustToOrientation();
        this.createPool();
        this.activateNextRock();
        this.delay = this.getRandomDelay();
    }

    public update(deltaTime: number) {
        this.moveRocks(deltaTime);

        if (GameManager.Instance?.isGameOver) return;

        this.updateSpawnTimer(deltaTime);
    }

    // ─── Orientation ──────────────────────────────────────

    private adjustToOrientation() {
        const w = screen.windowSize.width / screen.devicePixelRatio;
        const h = screen.windowSize.height / screen.devicePixelRatio;

        if (w > h) {
            this.spawnZ = 20;
            this.despawnZ = -50;
            this.poolSize = 6;
        }
    }

    // ─── Pool management ────────────────────────────────

    private createPool() {
        for (let i = 0; i < this.poolSize; i++) {
            const rock = instantiate(this.rockPrefab);
            rock.active = false;
            this.node.addChild(rock);
            this.pool.push(rock);
        }
    }

    public resetAll() {
        for (const rock of this.pool)
            rock.active = false;

        this.timer = 0;
        this.rockIndex = 0;
    }

    // ─── Movement ────────────────────────────────────────

    private moveRocks(deltaTime: number) {
        for (const rock of this.pool) {
            if (rock.active == false) continue;

            rock.getPosition(this.tempVec);
            this.tempVec.z -= this.speed * deltaTime;
            rock.setPosition(this.tempVec);

            if (this.tempVec.z <= this.despawnZ)
                rock.active = false;
        }
    }

    // ─── Spawning ────────────────────────────────────────

    private updateSpawnTimer(deltaTime: number) {
        this.timer += deltaTime;

        if (this.timer < this.delay) return;

        this.activateNextRock();
        this.timer = 0;
        this.delay = this.getRandomDelay();

    }

    private activateNextRock() {
        const rock = this.pool[this.rockIndex];
        rock.setPosition(new Vec3(0, 0, this.spawnZ));
        rock.active = true;
        this.rockIndex = (this.rockIndex + 1) % this.poolSize;
    }

    private getRandomDelay(): number {
        return this.minDelay + math.random() * (this.maxDelay - this.minDelay);
    }
}