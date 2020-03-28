const express = require("express");
const cors = require("cors");
const path = require("path");
const uuid = require("uuid-random");

// create an Express webserver 'app'
const app = express();
console.log(`Serving files from ${path.resolve(__dirname,'static')}`);
app.use(express.static(path.resolve(__dirname,'static'))); // serve files in subdirectory static
app.use(express.json()); // parse requests for json
app.use(cors()); // allow cross origin requests

// define webserver port
const port = 8080;

// here Maps are used to store games and users
// a Map can store any data and keeps track of this data by a unique key
// store data: Map.set('myuniquekey', anyData)
// test if data exists for 'myuniquekey': Map.has('myuniquekey')
// get data: data = Map.get('myuniquekey')
let gamesMap = new Map();
let usersMap = new Map();

// app.get assigns a function to http endpoint /hello for the 'GET' method
// the same endpoint ("/hello" in this example) can be called with different http methods, 
// currently 9 methods exist: (GET, POST, PUT, DELETE, HEAD, OPTIONS etc), see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
// the http 'GET' method is the default method for getting http data by http clients such as browsers, wget, curl
app.get("/hello", (req, res) => {
  // req contains request information from the http client (not used here)
  // res is used to send response information to the http client
  res.send("Hello World!")
});

app.get("/gamecreate", (req, res) => {
  let gameid = uuid();
  gamesMap.set(gameid, {
      createDate: new Date().toJSON(),
      userNames: []
  });
  res.json({ gameid: gameid });
});

app.get("/gamestate/:gameid/:userid", (req, res) => {
  const gameid = req.params.gameid;
  let userid = req.params.userid;
  if (!gamesMap.has(gameid)) {
    return res.json({ error: `game ${gameid} not found` });
  }
  if (!usersMap.has(userid)) {
      return res.json({error: `user ${userid} not found`})
  }
  let game = gamesMap.get(gameid);
  let user = usersMap.get(userid);

  res.json(Object.assign(game, user)); // combine game and user in single result
});

// by REST convention, the http PUT method is used for updates of EXISTING data
app.put("/gamestate/:gameid/:userid", (req, res) => {
  let gameid = req.params.gameid;
  if (gamesMap.has(gameid)) {
    let state = gamesMap.get(gameid);
    if (state) {
      console.log(req.body);
      gamesMap.set(gameid, req.body);
      res.json(req.body);
    }
  } else {
    res.json({ error: `game ${gameid} not found` });
  }
});

// by REST convention, the http POST method is used for creation of NEW data
app.post("/gameusercreate", (req, res) =>{
    let gameid = req.body.gameid;
    let newUserName = req.body.username;
    if (gamesMap.has(gameid)) {
        let state = gamesMap.get(gameid);
        if (state.userNames.find(userName=>userName == newUserName)) {
            res.json({error: `User "${newUserName}" already exists, choose another name`});
            return;
        }
        state.userNames.push(newUserName);
        let newUserid = uuid();
        usersMap.set(newUserid, {name: newUserName, gameid: gameid});
        res.json({userid: newUserid, name: newUserName});
    } else {
        res.json({error: `Unknown or expired gameid: ${gameid}`});
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));