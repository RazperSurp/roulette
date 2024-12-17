export default class Player {
    _LIB = {
        STATE: {
            "DEAD": 0,
            "ALIVE": 1
        }
    }

    ID;

    _START_SIZE = 6;
    _SIZE = 6;
    _START_ROUNDS = 1;
    _ROUNDS = 1;
    _STATE = this._LIB.STATE.ALIVE;

    _convertColorsToHex(chance) {
        let hex = '';

        const R_TO_HEX = Number(0 + Math.floor(5 * chance)).toString(16);
        hex += R_TO_HEX.length < 2 ? `0${R_TO_HEX}` : R_TO_HEX;

        const G_TO_HEX = Number(255 - Math.floor(5 * chance)).toString(16);
        hex += G_TO_HEX.length < 2 ? `0${G_TO_HEX}` : G_TO_HEX;

        const B_TO_HEX = Number(0).toString(16);
        hex += B_TO_HEX.length < 2 ? `0${B_TO_HEX}` : B_TO_HEX;

        return `#${hex}`;
    }

    _CURRENT_TRY = 0;

    _SIZE_PENALTY_PER_TRY = -1;

    INTERFACE;

    constructor () {
        return this;
    }

    updateSettings(size, rounds) {
        this._CURRENT_TRY = 0;
        
        this._SIZE = Number(size);
        this._ROUNDS = Number(rounds);

        if (this._SIZE < this._ROUNDS) this._ROUNDS = this._SIZE;
        this._START_SIZE = this._SIZE;
        this._START_ROUNDS = this._ROUNDS;

        this.INTERFACE.querySelector(`label[for="size-${this.ID}"]`).innerText = 'Камор осталось';
        this.INTERFACE.querySelector('.rounds').classList.add('roll');
        setTimeout(() => { this.INTERFACE.querySelector('.rounds').classList.remove('roll') }, 1000);

        this._updateChance();
        this._updateInputs();
        this._changeState(this._LIB.STATE.ALIVE);
    }

    _updateChance() {
        let CHANCE = Math.round(this._ROUNDS / this._SIZE * 100);
        const CHANCE_BLOCK = this.INTERFACE.querySelector(`div.chance`);

        if (CHANCE > 100) CHANCE = 100;

        CHANCE_BLOCK.innerText = `${CHANCE}%`;
        CHANCE_BLOCK.style.backgroundColor = this._convertColorsToHex(CHANCE);
    }

    _changeState(status) {
        this._STATE = status;
        if (this._STATE == this._LIB.STATE.DEAD) {
            this.INTERFACE.querySelector('div.chance').innerText = '';
            this.INTERFACE.classList.add('dead');
            const BUTTON = this.INTERFACE.querySelector('button');
            BUTTON.innerText = 'ЗАСТРЕЛИЛСЯ!'
            BUTTON.onclick = e => {
                this._updateInputs();
                this.INTERFACE.classList.remove('dead');

                const FORM = this.INTERFACE.querySelector('form')
                FORM.classList.remove('updated');

                BUTTON.setAttribute('type', 'submit');
            }
        }
    } 

    _updateInputs(size = null, rounds = null) {
        this.INTERFACE.querySelector('input[name="size"]').value = size ?? this._START_SIZE;
        this.INTERFACE.querySelector('input[name="rounds"]').value = rounds ?? this._START_ROUNDS;
    }

    pullTrigger() {
        this._CURRENT_TRY++;

        this.INTERFACE.querySelector('.rounds').classList.add('next');
        setTimeout(() => { this.INTERFACE.querySelector('.rounds').classList.remove('next'); }, 250);

        const RND = Math.floor(Math.random() * this._SIZE);
        console.log(RND, this._SIZE, this._ROUNDS);
        if (RND < this._ROUNDS) {
            this.INTERFACE.querySelector('input[name="rounds"]').value = 0;
            this._changeState(this._LIB.STATE.DEAD);

            this._updateInputs(this._SIZE, this._ROUNDS);
        }

        this._SIZE += this._SIZE_PENALTY_PER_TRY;
        this._updateInputs(this._SIZE, this._ROUNDS);

        this._updateChance();

        return false;
    }
}