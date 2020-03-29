class GameClient {
  constructor(baseUrl) {
    if (!baseUrl || baseUrl.trim() === '') {
      this.baseUrl = './'
    } else {
      this.baseUrl = baseUrl.trim();
    }
    if (!this.baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
  }
  async _fetch(path, method, params) {
      let options = {method:method};
      switch (method) {
          case 'GET':
              if (params) {
                  path += "?" + Object.entries(params).map(entry=>`${entry[0]}=${encodeURIComponent(entry[1])}`).join('&')
              }
              break;
          case 'POST':
          case 'PUT':
            options.body = JSON.stringify(params);
            options.headers = {
              "Content-type":"application/json"
            }
            break;
      }
      try {
        let response = await fetch(this.baseUrl + path, options);
        if (response.ok) {
            try {
                let json = await response.json();
                return json;
            } catch(err) {
                return ({error: err.message})
            }
        }
      } catch(err) {
        return ({error: err.message})
      }
      return ({error: 'Network response was not ok'})
  }
  subscribeToUpdates(updateCallback) {
    if (updateCallback) {
      this.updateCallback = updateCallback;
    }
    if (this.gameid && this.updateCallback) {
      this.eventSource = new EventSource(`gameeventemitter/${this.gameid}`)
      this.eventSource.onmessage = (event) => {
        this.updateCallback();
        console.log('event received:' + event.data);
      }
      this.eventSource.onerror = (event) => {
        this.eventSource.close();
        this.subscribeToUpdates()
        console.log(`error event received`)
      }
      this.eventSource.onopen = (event) => {
        console.log('event source opened')
      }
    }
  }
  unsubscribeToUpdates() {
    console.log('closing event source');
    this.eventSource.close();
  }
  async gameCreate(name) {
      return await this._fetch('gamecreate', 'GET', {name: name});
  }
  async gameUserCreate(gameid, username) {
      return await this._fetch('gameusercreate', 'POST', {gameid:gameid, username:username})
  }
  async gameState(gameid, userid) {
    this.gameid = gameid;
    this.userid = userid;
    return await this._fetch(`gamestate/${gameid}/${userid}`, 'GET')
  }
  async gameSendChatMessage(message) {
    if (this.gameid && this.userid) {
      return await this._fetch('gamechat', 'POST', {gameid:this.gameid, userid:this.userid, message:message});
    }
  }
}