function AudioManager(channels, sampleRate)
{
  channels = channels === undefined ? 1 : channels;
  sampleRate = sampleRate === undefined ? 44100 : sampleRate;

  let scheduleAt = 0;
  
  init = init.bind(this);
  createBufferSource = createBufferSource.bind(this);
  createBuffer = createBuffer.bind(this);

  init();

  this.appendFragment = function(fragment, channel) {
    channel = channel === undefined ? 0 : channel;

    let source = createBufferSource();
    source.buffer = createBuffer(Float32Array.from(fragment));

    if (scheduleAt - this.context.currentTime < 0) {
      scheduleAt = this.context.currentTime;
    }
    source.start(scheduleAt);
    scheduleAt += source.buffer.duration;
    
  }

  function init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }

  function createBufferSource() {
    let source = this.context.createBufferSource();
    
    source.loop = false;
    source.connect(this.context.destination);

    return source;
  }

  function createBuffer(fragment) {
    let buffer_object = this.context.createBuffer(channels, fragment.length, sampleRate);

    for (var channel = 0; channel < channels; channel++) {
      buffer_object.copyToChannel(fragment, channel, 0);
    }

    return buffer_object;
  }
}