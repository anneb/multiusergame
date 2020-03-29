
function sanitizeHtml(str) {
    let el = document.createElement('div');
    el.innerText = str;
    return el.innerHTML;
}


class GameChat {
    constructor (chatElement, gameClient) {
        this.chatElement = chatElement;
        this.gameClient = gameClient;
        this.chatElement.innerHTML = 
            `<div id="chatoutput"></div>
            <div>
            <input id="chatinput" type="text" placeholder="Send chat message">
            </div>`;
        this.chatOutput = this.chatElement.querySelector('#chatoutput');
        this.chatInput = this.chatElement.querySelector('#chatinput');
        this.chatElement.addEventListener('keydown', (e)=>this.keyDown(e));
    }
    update(gameState) {
        if (gameState.game && gameState.game.chat) {
            this.chatOutput.innerHTML = gameState.game.chat.map(message=>`${sanitizeHtml(message.user)}:${sanitizeHtml(message.message)}<br>`).join('\n');
        }
    }
    async keyDown(event) {
        if (event.key === 'Enter') {
            let message = this.chatInput.value;
            if (message !== '') {
                this.chatInput.value = '';
                let gameState = await this.gameClient.gameSendChatMessage(message);
                this.update(gameState);
            }
        }
    }
}