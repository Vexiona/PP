import './style.css';
import { Scene } from "./scene.js";
import { Renderer } from './renderer.js';

var pno: any = undefined;
var scene: Scene;

function connect(value: Response)
{
    const ws = new WebSocket('wss://' + window.location.host);
    ws.addEventListener('open', function(event)
    {
        ws.send('Hello Server!');
        window.addEventListener("keydown", event =>
        {
            if(event.key == 'ArrowUp' || event.key == 'w' || event.key == 'W')
                ws.send('W');
            else if(event.key == 'ArrowDown' || event.key == 's' || event.key == 'S')
                ws.send('S');
            else if(event.key == 'ArrowLeft' || event.key == 'a' || event.key == 'A')
                ws.send('A');
            else if(event.key == 'ArrowRight' || event.key == 'd' || event.key == 'D')
                ws.send('D');
        });
    });
    ws.addEventListener('message', function(event)
    {
        //console.log('Message from server: ', event.data);
        let renderData: RenderData;
        try
        {
            renderData = <RenderData>JSON.parse(event.data);
        }
        catch
        {
            console.log("Not JSON");
            return;
        }
        if(renderData.message === 'Player 1')
        {
            console.log("I am Player 1");
            pno = 1;
        }
        else if(renderData.message === 'Player 2')
        {
            console.log('I am Player 2');
            pno = 2;
        }
        else if(renderData.message === 'renderData')
        {
            scene.spheres[0].center[0] = renderData.player1!.x;
            scene.spheres[0].center[2] = renderData.player1!.y;
            scene.spheres[1].center[0] = renderData.player2!.x;
            scene.spheres[1].center[2] = renderData.player2!.y;
        }
    });
    ws.addEventListener('error', function(event)
    {
        console.log(event);
    });
    ws.addEventListener('close', function(event)
    {
        console.log('Connection closed', event.code, event.reason, event.wasClean);
    });
}

function login()
{
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
        .then(connect);
}

function main()
{
    var meta = document.createElement('meta');
    meta.httpEquiv = "origin-trial";
    meta.content = "AifDXz6Baft5VffNQoN10WMq4EpmwWAkdtyo+wvoS4uxTh51wM6Tdu0/eUJcPT8bkV/5fVM/6JfOvnsvbGg8NwkAAABQeyJvcmlnaW4iOiJodHRwczovL3ZleGlvbmEubmdyb2suaW86NDQzIiwiZmVhdHVyZSI6IldlYkdQVSIsImV4cGlyeSI6MTY3NTIwOTU5OX0=";
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    const canvasDiv = document.createElement('div');
    const canvas3d = document.createElement('canvas');
    canvas3d.id = 'game-window';
    canvas3d.width = 1920;
    canvas3d.height = 1080;
    const canvas2d = document.createElement('canvas');
    canvas2d.width = 1920;
    canvas2d.height = 1080;
    canvasDiv.appendChild(canvas3d);
    canvasDiv.appendChild(canvas2d);
    document.body.appendChild(canvasDiv);

    const canvas2dctx = canvas2d.getContext("2d");
    if(canvas2dctx === null) return;
    canvas2dctx.font = "bold 48px serif";
    canvas2dctx.fillStyle = "blue";
    canvas2dctx.fillText("Hello World!", 10, 10);


    scene = new Scene();

    const renderer = new Renderer(canvas3d, scene);

    renderer.Initialize()
        .then(() =>
        {
            login();
        });
}

window.onload = main;