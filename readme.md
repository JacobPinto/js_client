### A test to build a JS client.

Some layout details:

![typical layout](share/layout.png)

So the render pipeline on the server side is RenderEngine, which produces output.jpeg. 
Next is Server.py which writes camera.json to file. On the client side we have viewer.html which displays output.jpeg and also captures mouse movement and sends it to the server to be written into camera.json. 
Step 1. Create  a html canvas on the client and capture mouse movements. This is then sent to the server. 
Step 2. Receive mouse movements from the client and write to camera.json. 
Step 3. Serve output.jpeg to the client and render it on screen.