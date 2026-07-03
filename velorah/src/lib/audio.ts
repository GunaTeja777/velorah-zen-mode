class AmbientSynthesizer {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private sources: { stop: () => void }[] = []
  private chimeTimer: number | null = null
  private activeTheme: string = ""

  constructor() {}

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.gainNode = this.ctx.createGain()
      this.gainNode.connect(this.ctx.destination)
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime)
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume()
    }
  }

  // Generate white noise for rain/wind
  private createNoiseBuffer() {
    if (!this.ctx) return null
    const bufferSize = 2 * this.ctx.sampleRate
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    return noiseBuffer
  }

  // Generate pink noise for wind/leaves
  private createPinkNoiseBuffer() {
    if (!this.ctx) return null
    const bufferSize = 2 * this.ctx.sampleRate
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      b6 = white * 0.115926
      output[i] = pink * 0.11 // scale to prevent clipping
    }
    return noiseBuffer
  }

  public play(theme: string) {
    this.stop()
    this.activeTheme = theme
    this.init()

    if (!this.ctx || !this.gainNode) return

    // Fade in volume
    this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime)
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1.2)

    if (theme === "flowers") {
      // Flowers: Soft wind chimes and warm pad drone
      this.playPad(220, 221)
      this.startChimes()
    } else if (theme === "butterflies") {
      // Butterflies: Mystical high harp notes and forest chimes
      this.playPad(293.66, 294.66)
      this.startHarpArpeggio()
    } else if (theme === "mountains") {
      // Mountains: Howling wind gusts
      this.playWind()
    } else if (theme === "trees") {
      // Trees: Soothing heavy rain sound
      this.playRain()
    }
  }

  private playPad(freq1: number, freq2: number) {
    if (!this.ctx || !this.gainNode) return

    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const filter = this.ctx.createBiquadFilter()
    const oscGain = this.ctx.createGain()

    osc1.type = "sine"
    osc1.frequency.setValueAtTime(freq1, this.ctx.currentTime)

    osc2.type = "sine"
    osc2.frequency.setValueAtTime(freq2, this.ctx.currentTime)

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(150, this.ctx.currentTime)

    oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime)

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(oscGain)
    oscGain.connect(this.gainNode)

    osc1.start()
    osc2.start()

    this.sources.push({
      stop: () => {
        osc1.stop()
        osc2.stop()
      }
    })
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return
    const noiseBuffer = this.createNoiseBuffer()
    if (!noiseBuffer) return

    const source = this.ctx.createBufferSource()
    source.buffer = noiseBuffer
    source.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(700, this.ctx.currentTime)

    const rainGain = this.ctx.createGain()
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime)

    source.connect(filter)
    filter.connect(rainGain)
    rainGain.connect(this.gainNode)

    source.start()

    this.sources.push({
      stop: () => source.stop()
    })
  }

  private playWind() {
    if (!this.ctx || !this.gainNode) return
    const noiseBuffer = this.createPinkNoiseBuffer()
    if (!noiseBuffer) return

    const source = this.ctx.createBufferSource()
    source.buffer = noiseBuffer
    source.loop = true

    // Bandpass filter to create gusting wind effect
    const filter = this.ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.setValueAtTime(400, this.ctx.currentTime)
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime)

    // LFO to sweep filter frequency
    const lfo = this.ctx.createOscillator()
    const lfoGain = this.ctx.createGain()

    lfo.type = "sine"
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime)
    lfoGain.gain.setValueAtTime(230, this.ctx.currentTime)

    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    const windGain = this.ctx.createGain()
    windGain.gain.setValueAtTime(0.45, this.ctx.currentTime)

    source.connect(filter)
    filter.connect(windGain)
    windGain.connect(this.gainNode)

    lfo.start()
    source.start()

    this.sources.push({
      stop: () => {
        source.stop()
        lfo.stop()
      }
    })
  }

  private startChimes() {
    const triggerChime = () => {
      if (!this.ctx || !this.gainNode || this.activeTheme !== "flowers") return

      const osc = this.ctx.createOscillator()
      const chimeGain = this.ctx.createGain()

      const freqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]
      const f = freqs[Math.floor(Math.random() * freqs.length)]

      osc.type = "sine"
      osc.frequency.setValueAtTime(f, this.ctx.currentTime)

      chimeGain.gain.setValueAtTime(0, this.ctx.currentTime)
      chimeGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.05)
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.0)

      osc.connect(chimeGain)
      chimeGain.connect(this.gainNode)

      osc.start()
      osc.stop(this.ctx.currentTime + 4.1)

      const delay = 1500 + Math.random() * 4000
      this.chimeTimer = window.setTimeout(triggerChime, delay)
    }

    triggerChime()
  }

  private startHarpArpeggio() {
    const triggerHarp = () => {
      if (!this.ctx || !this.gainNode || this.activeTheme !== "butterflies") return

      const notes = [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00]
      const noteCount = 3 + Math.floor(Math.random() * 4)

      let playTime = this.ctx.currentTime

      for (let i = 0; i < noteCount; i++) {
        const osc = this.ctx.createOscillator()
        const harpGain = this.ctx.createGain()

        const f = notes[Math.floor(Math.random() * notes.length)]
        osc.type = "triangle"
        osc.frequency.setValueAtTime(f, playTime)

        harpGain.gain.setValueAtTime(0, playTime)
        harpGain.gain.linearRampToValueAtTime(0.03, playTime + 0.02)
        harpGain.gain.exponentialRampToValueAtTime(0.0001, playTime + 2.5)

        osc.connect(harpGain)
        harpGain.connect(this.gainNode)

        osc.start(playTime)
        osc.stop(playTime + 2.6)

        playTime += 0.15 + Math.random() * 0.2
      }

      const delay = 4000 + Math.random() * 5000
      this.chimeTimer = window.setTimeout(triggerHarp, delay)
    }

    triggerHarp()
  }

  public stop() {
    this.activeTheme = ""
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer)
      this.chimeTimer = null
    }

    if (this.ctx && this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime)
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime)
      this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5)
    }

    setTimeout(() => {
      this.sources.forEach((src) => {
        try {
          src.stop()
        } catch (e) {}
      })
      this.sources = []
    }, 600)
  }
}

export const ambientSound = new AmbientSynthesizer()
