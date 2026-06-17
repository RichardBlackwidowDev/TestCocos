import { _decorator, Component, director, Collider, ITriggerEvent, sys, ResolutionPolicy, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component 
{
    public static Instance: GameManager;

    private jumpCount: number = 0;
    private collisionCount: number = 0;
    private isGameOver: boolean = false;

    public start()
    {
        const size = view.getFrameSize();
        const w = size.width;
        const h = size.height;

        if (w > h)
            view.setDesignResolutionSize(1920, 1080, ResolutionPolicy.FIXED_WIDTH);
        else
            view.setDesignResolutionSize(1080, 1920, ResolutionPolicy.FIXED_HEIGHT);

    
        if (GameManager.Instance == null)
            GameManager.Instance = this;
        else
            this.destroy();
    }

    public onJump()
    {
        if (this.isGameOver) return;

        this.jumpCount++;
        console.log("Jump", this.jumpCount, "/ 5");

        if (this.jumpCount >= 5)
            this.showFinalScreen();
    }

    public onCollision()
    {
        if (this.isGameOver) return;

        this.collisionCount++;
        console.log("Collision", this.collisionCount);

        if (this.collisionCount >= 2)
        {
            this.showFinalScreen();
        }
        else
        {
            this.restartGame();
        }
    }

    private restartGame()
    {
        director.loadScene("GameScene");
    }

    private showFinalScreen()
    {
        this.isGameOver = true;
        console.log("Game Over - Final Screen");
    }
}