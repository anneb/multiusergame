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
      let url  = this.baseUrl + path;
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
      let response = await fetch(url, options);
      if (response.ok) {
          try {
              let json = await response.json();
              return json;
          } catch(err) {
              return ({error: err.message})
          }
      }
      return ({error: 'Network response was not ok'})
  }
  async gameCreate() {
      return await this._fetch('gamecreate', 'GET');
  }
  async gameUserCreate(gameid, username) {
      return await this._fetch('gameusercreate', 'POST', {gameid:gameid, username:username})
  }
  async gameState(gameid, userid) {
    return await this._fetch(`gamestate/${gameid}/${userid}`, 'GET')
  }
}