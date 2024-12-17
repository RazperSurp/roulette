import Player from "./player.mjs";

export default class Game {
    _PLAYERS = [];
    _REVOLVER_INTERFACE = document.getElementById('revolver-interface');
    _GAME_FIELD = document.getElementById('game-field');

    constructor (playersCount) {
        this._GAME_FIELD.classList.remove('ready');
        setTimeout(() => {
            this._GAME_FIELD.innerHTML = '';

            for (let i = 0; i < playersCount; i++) {
                const CURRENT_PLAYER = new Player()
                this._PLAYERS.push(CURRENT_PLAYER);
                const APPENDED_INTERFACE = this._renderRevolverInterface(this._PLAYERS.length - 1);
                
                CURRENT_PLAYER.ID = i;
                CURRENT_PLAYER.INTERFACE = APPENDED_INTERFACE;

                APPENDED_INTERFACE.querySelector('form').onsubmit = e => {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const FD = new FormData(e.currentTarget);
                    CURRENT_PLAYER.updateSettings(FD.get('size'), FD.get('rounds'));

                    const SUBMIT_BUTTON = e.currentTarget.querySelector('button[type="submit"]');
                    SUBMIT_BUTTON.setAttribute('type', 'button');
                    SUBMIT_BUTTON.innerText = 'Выстрел!';

                    SUBMIT_BUTTON.onclick = e => { CURRENT_PLAYER.pullTrigger() };

                    e.currentTarget.classList.add('updated');

                    return false;
                }
            }

            setTimeout(() => { this._GAME_FIELD.classList.add('ready'); }, 500);
            
        }, 500);
    }

    _renderRevolverInterface(id) {
        const REVOLVER_INTERFACE = document.createElement('div');
        REVOLVER_INTERFACE.classList.add('revolver-interface');
        REVOLVER_INTERFACE.setAttribute('id', `revolver-interface-${id}`)

        REVOLVER_INTERFACE.innerHTML = this._REVOLVER_INTERFACE.innerHTML;
        this._GAME_FIELD.appendChild(REVOLVER_INTERFACE);
        [...document.getElementById(`revolver-interface-${id}`).children].forEach(node => { this._appendCustomId(node, id) })

        return REVOLVER_INTERFACE;
    }

    _appendCustomId(root, id) {
        if (root.hasAttribute('id')) root.setAttribute('id', `${root.getAttribute('id')}-${id}`);
        if (root.hasAttribute('for')) root.setAttribute('for', `${root.getAttribute('for')}-${id}`);
        if (root.children.length > 0) [...root.children].forEach(child => { this._appendCustomId(child, id) });
    }
}