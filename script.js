let move_speed = 3, gravity = 0.4;

let fish = document.querySelector('.fish');
let fish_props = fish.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// initially state is start, fish is hidden, and message is styled to look like a popup 
let game_state = 'Start';
fish.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    // start game on enter and if it is not pressed when already in game, then remove all old pipes
    // (basically restart the game, select all pipes)
    if (e.key == 'Enter' && game_state != 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // show fish, reset position, score, and call play()
        fish.style.display = 'block';
        fish.style.top = '40vh';
        game_state = 'Play';
        // innerHTML allows to modify the look of the page
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    // move function controls the movement of pipes and checks for collision between the fish and pipes
    function move() {
        if (game_state != 'Play') return;
        // select all pipes and iterate over them
        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            // get the size and position of the pipe and fish
            let pipe_sprite_props = element.getBoundingClientRect();
            fish_props = fish.getBoundingClientRect();
            // if the pipe has moved off the left edge of the screen, simply remove it
            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                // if collided - end the game, show message with updated text and color
                if (fish_props.left < pipe_sprite_props.left + pipe_sprite_props.width
                    && fish_props.left + fish_props.width > pipe_sprite_props.left
                    && fish_props.top < pipe_sprite_props.top + pipe_sprite_props.height
                    && fish_props.top + fish_props.height > pipe_sprite_props.top) {

                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    fish.style.display = 'none';
                    return;
                } else {
                    // else increase the score once passed the pipe and move the pipe
                    if (pipe_sprite_props.right < fish_props.left
                        && pipe_sprite_props.right + move_speed >= fish_props.left
                        && element.increase_score == '1') {
                        score_val.innerHTML = + score_val.innerHTML + 1;
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let fish_dy = 0;
    // this function takes care of applying gravity, that is, dragging the fish down
    function apply_gravity() {
        if (game_state != 'Play') return;
        fish_dy = fish_dy + gravity;

        document.addEventListener('keydown', (e) => {
            // controls the height of the 'jump' of the fish
            if (e.key == ' ') {
                fish_dy = -7.6;
            }
        });

        // if moves out of the screen - end the game (this one doesn't show the game over message as in case with
        // pipe collision, instead it just reloads the initial state) 
        if (fish_props.top <= 0 || fish_props.bottom >= background.bottom) {
            game_state = 'End';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        // updating fish properties
        fish.style.top = fish_props.top + fish_dy + 'px';
        fish_props = fish.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;
    // this function creates and displays two pipes (top and bottom) 
    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0; // reset pipe separation to 0

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
