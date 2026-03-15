### This project is an attempt to build a full-stack web app with an interactive web GUI.

- Starting with the Client, which is a simple web GUI built using TS.
  - The Client follows a simple MVC pattern.
  - The display is split into multiple levels similar to typical applications like Blender, FreeCAD etc.
  - A top level Workspace contains the various toolbars.
![workspace](share/workbench.png)

  - A second level Toolbar contians the various buttons.
![workspace](share/toolbar.png)

  - The buttons themselves are a mix of various input elements to allow complex inputs.
![workspace](share/button.png)

  - The MVC pattern enables the buttons to interact with each other via an observer pattern.

- The Server is built using Express.js and follow a simple design. The Server will use gRPC to communcate with other processes on it's host.