## Multi-User Game Server (Poker)
A multi-user (game) server with UI for use without account registration. Instances (games) can be created by anyone. The created instance can be shared with others as web-URLs, so that groups can work (play) together.

### Features
* instance (game) creation
* shared game state
* private user state
* chat box


### Requirements
* git
* node


### Install
```
git clone this_repository
cd this_repository
npm install
npm start
# open http://localhost:8080 in browser
```

### How this works
The project consists of two main components:
1. HTML and javascript to be handled by a browser, files live under subdirectory 'static'. File 'gameclient.js' has all the code to communicate with the game server
2. A Node Express based http server, main file: 'index.js'. This server keeps the game state but also serves static files from subdirectory 'static'