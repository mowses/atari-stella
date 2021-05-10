const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const pixels_image = ctx.getImageData(0, 0, 160, 228);

const config = {
    type: Phaser.CANVAS,
    width: 400,
    height: 300,
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
    //this.load.script('./test/test-output-data');
}

function create ()
{
    player.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    player.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    player.keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    player.keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    player.keys.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    
    canvas.width = this.game.config.width;
    canvas.height = this.game.config.height;
    this.textures.addCanvas('TIA_VIEW', canvas);
    this.add.image(canvas.width / 2, canvas.height / 2, 'TIA_VIEW');

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
    const _pixels_image = pixels_image;
    const _ctx = ctx;
    const _output = output;
    const _colors = NTSC_colors;
    const _width = _pixels_image.width;
    const _height = _pixels_image.height;

    var pixels = _pixels_image.data;
    var last = 0;  // same in TIA

    for (let y = 0; y < _height; y++) {
        for (let x = 0; x < _width; x++) {
            let index = x + y * _width;
            let output_index = _output[index];
            
            if (output_index === undefined) {
                // missing pixel
                output_index = last;
            }

            let offset = index * 4;
            let color = _colors[output_index];

            if (color === undefined) {
              //console.log('undefined color', index, output_index, last, _output);
              return;
            }
            
            pixels[offset] = color.r;
            pixels[offset + 1] = color.g;
            pixels[offset + 2] = color.b;
            pixels[offset + 3] = color.a;
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