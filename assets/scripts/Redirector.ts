import { _decorator, Component, sys } from 'cc';
const { ccclass } = _decorator;

@ccclass('Redirector')
export class Redirector extends Component 
{
    public redirectToStore()
    {
        if (sys.os == sys.OS.IOS)
            sys.openURL("https://www.apple.com/app-store/");
        else
            sys.openURL("https://play.google.com/store/games");
    }
}