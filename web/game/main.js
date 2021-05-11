const NTSC_screen = {
    width: 160,
    height: 228,
};
const scale = { x: 4, y: 2};
const dpr = 2;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const pixels_image = ctx.getImageData(0, 0, NTSC_screen.width * dpr, NTSC_screen.height * dpr);

const config = {
    type: Phaser.CANVAS,
    width: NTSC_screen.width * scale.x,
    height: NTSC_screen.height * scale.y,
    //backgroundColor: '#ff00ff',
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
const player = {
    keys: {
        up: null,
        down: null,
        left: null,
        right: null,
        fire: null,
    }
}
const gamedata = {
    video: {},
};

var audio_manager;

function preload ()
{
    this.load.script('./app-geckos-client');
    this.load.script('./AudioManager');
    this.load.script('./PlayerKeysEnum');
    this.load.script('./colors/ntsc');
    this.load.script('./mixingTable/mixingTable');
    // this.load.script('./test/test-output-data');
}

function create ()
{
    player.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    player.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    player.keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    player.keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    player.keys.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    
    let scaleX = scale.x / dpr;
    let scaleY = scale.y / dpr;
    canvas.width = this.game.config.width * dpr;
    canvas.height = this.game.config.height * dpr;
    this.textures.addCanvas('TIA_VIEW', canvas);
    let image = this.add.image(canvas.width / 2 * scaleX, canvas.height / 2 * scaleY, 'TIA_VIEW');
    image.scaleX = scaleX;
    image.scaleY = scaleY;

    setAlpha();

    // gamedata.video = JSON.parse('{' + output.replaceAll(/(\d+)\:/ig, '"$1":') + '"end":true}');
    // render(gamedata.video);

    // audio setup
    audio_manager = new AudioManager(1, 31440);  // sample rate: 262 * 228 * 60 / 114
}

function update() {
    let player_pressed_keys =
        (player.keys.up.isDown && PlayerKeysEnum.UP) +
        (player.keys.down.isDown && PlayerKeysEnum.DOWN) +
        (player.keys.left.isDown && PlayerKeysEnum.LEFT) +
        (player.keys.right.isDown && PlayerKeysEnum.RIGHT) +
        (player.keys.fire.isDown && PlayerKeysEnum.FIRE);

    render(gamedata.video);
}

function render(output) {
    const _dpr = dpr;
    const _pixels_image = pixels_image;
    const _ctx = ctx;
    const _output = output;
    const _colors = NTSC_colors;
    const _width = _pixels_image.width / _dpr;
    const _height = _pixels_image.height / _dpr;

    var pixels = _pixels_image.data;
    var last = 0;  // same in TIA

    let woffset = 4 * _pixels_image.width;

    for (let y = 0; y < _height; y++) {
        for (let x = 0; x < _width; x++) {
            let index = x + y * _width;
            let output_index = _output[index];
            
            if (output_index === undefined) {
                // missing pixel
                output_index = last;
            }

            let color = _colors[output_index];

            if (color === undefined) {
              //console.log('undefined color', index, output_index, last, _output);
              return;
            }

            let xdpr = x * _dpr;
            let ydpr = y * _dpr;
            for (var y1 = 0; y1 < _dpr; y1++) {
                let ydpry1 = (ydpr + y1) * woffset;
                for (var x1 = 0; x1 < _dpr; x1++) {
                    let offset = ((xdpr + x1) * 4) + ydpry1;
                    pixels[offset] = color.r;
                    pixels[offset + 1] = color.g;
                    pixels[offset + 2] = color.b;
                }
            }
            last = output_index;
        }
    }
    _ctx.putImageData(_pixels_image, 0, 0);
}

function build_complete_audio_fragment(incomplete_fragment) {
    let last = mixingTable[0];  // 0 same as /src/emucore/tia/Audio.cxx:118
    let fragment_size = 262;

    for (var i = 0, t = fragment_size; i < t; i++) {
        if (incomplete_fragment[i] === undefined) {
            incomplete_fragment[i] = last;
            continue;
        }

        incomplete_fragment[i] = mixingTable[incomplete_fragment[i]];

        last = incomplete_fragment[i];
    }
    return incomplete_fragment;  // return complete fragment now
}

/**
 * instead of setting alpha every game cycle
 * we just set it once
 */
function setAlpha()
{
    let pixels = pixels_image.data;
    for (var i = 0, t = pixels.length; i < t; i += 4) {
        pixels[i + 3] = 255;
    }
}