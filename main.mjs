import Game from "./game.mjs";

document.getElementById('settings').onsubmit = e => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const FD = new FormData(e.currentTarget);
    
    window._game = new Game(FD.get('players-count'));

    return false;
}