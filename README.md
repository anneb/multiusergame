** Game Server (Poker)


*** Requirements
git
node


*** Install
```
git clone this_repository
cd this_repository
npm install
npm start
# open http://localhost:8080 in browser
```

*** How this works
The project consists of two main parts:
1. HTML and javascript to be handled by a browser, files in subdirectory 'static'. File 'gameclient.js' has all the code to communicate with the game server
2. A Node Express based http server, main file: 'index.js'. This server keeps the game state but also serves the files in subdirectory static