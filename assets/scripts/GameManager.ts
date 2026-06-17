import { _decorator, Component, director, ResolutionPolicy, view, Node, Canvas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static Instance: GameManager;
    public isGameOver: boolean = false;

    private jumpCount: number = 0;
    private collisionCount: number = 0;

    // ─── Lifecycle ───────────────────────────────────────

    public start() {
        this.setupDesignResolution();
        this.setupCanvases();

        if (GameManager.Instance == null)
            GameManager.Instance = this;
        else
            this.destroy();
    }

    // ─── Init helpers ────────────────────────────────────

    private setupDesignResolution() {
        if (window.innerWidth > window.innerHeight)
            view.setDesignResolutionSize(1920, 1080, ResolutionPolicy.FIXED_WIDTH);
        else
            view.setDesignResolutionSize(1080, 1920, ResolutionPolicy.FIXED_HEIGHT);

        const canvases = director.getScene()?.getComponentsInChildren(Canvas);
        if (canvases) for (const c of canvases) {
            if (c.alignCanvasWithScreen) {
                c.alignCanvasWithScreen = false;
                c.alignCanvasWithScreen = true;
            }
        }
    }

    private setupCanvases() {
        const final = director.getScene()?.getChildByName("FinalScreen");
        if (final) final.active = false;
    }

    // ─── Events ──────────────────────────────────────────

    public onJump() {
        if (this.isGameOver) return;

        this.jumpCount++;
        console.log("Jump", this.jumpCount, "/ 5");

        if (this.jumpCount >= 5)
            this.showFinalScreen();
    }

    public onCollision() {
        if (this.isGameOver) return;

        this.collisionCount++;
        console.log("Collision", this.collisionCount);

        if (this.collisionCount >= 2) {
            this.showFinalScreen();
        }
        else {
            this.restartGame();
        }
    }

    // ─── Results ─────────────────────────────────────────

    private showFinalScreen() {
        this.isGameOver = true;
        console.log("Game Over - Final Screen");

        const scene = director.getScene();
        if (scene == null) return;

        const hud = scene.getChildByName("HUD");
        if (hud) hud.active = false;

        const final = scene.getChildByName("FinalScreen");
        if (final) final.active = true;
    }

    private restartGame() {
        director.loadScene("GameScene");
    }
}