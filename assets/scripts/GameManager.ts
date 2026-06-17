import { _decorator, Component, director, Collider, ITriggerEvent } from 'cc';
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