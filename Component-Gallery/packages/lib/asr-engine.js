/* eslint-disable */
var e = {
    d: (t, s) => {
      for (var a in s)
        e.o(s, a) &&
          !e.o(t, a) &&
          Object.defineProperty(t, a, { enumerable: !0, get: s[a] })
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t)
  },
  t = {}
e.d(t, { A: () => l })
var s = (function () {
  var e = ['debug', 'info', 'warn', 'error', 'none'],
    t = {
      logLevel: 'debug',
      enableStackTrace: !1,
      enableStore: !1,
      messageFormat: function (e) {
        return e
      },
      consoleFormat: function (e) {
        console.log(`${e.type.toUpperCase()}:`, e.message)
      }
    },
    a = t,
    i = []
  function n(t, s, n) {
    var r = e.indexOf(a.logLevel)
    if (e.indexOf(t) >= r) {
      var o = { type: t, message: s, timestamp: Date.now() }
      n && a.enableStackTrace && (o.stackTrace = n),
        a.consoleFormat(a.messageFormat(o)),
        a.enableStore &&
          (i.push(o), localStorage.setItem('JSLog', JSON.stringify(i)))
    }
  }
  return {
    debug: function (e, t) {
      n('debug', e, t)
    },
    info: function (e, t) {
      n('info', e, t)
    },
    warn: function (e, t) {
      n('warn', e, t)
    },
    error: function (e, t) {
      n('error', e, t)
    },
    configure: function (e) {
      a = Object.assign({}, t, e)
    },
    extend: function (e) {
      Object.assign(s, e)
    }
  }
})()
const a = s
class i {
  constructor(e) {
    this.init(e)
  }
}
;(i.uuid = function () {
  for (var e = [], t = '0123456789abcdef', s = 0; s < 36; s++)
    e[s] = t.substr(Math.floor(16 * Math.random()), 1)
  return (
    (e[14] = '4'),
    (e[19] = t.substr((3 & e[19]) | 8, 1)),
    (e[8] = e[13] = e[18] = e[23] = '-'),
    e.join('')
  )
}),
  (i.stringToByte = function (e) {
    var t,
      s,
      a = new Array()
    t = e.length
    for (var i = 0; i < t; i++)
      (s = e.charCodeAt(i)) >= 65536 && s <= 1114111
        ? (a.push(((s >> 18) & 7) | 240),
          a.push(((s >> 12) & 63) | 128),
          a.push(((s >> 6) & 63) | 128),
          a.push((63 & s) | 128))
        : s >= 2048 && s <= 65535
        ? (a.push(((s >> 12) & 15) | 224),
          a.push(((s >> 6) & 63) | 128),
          a.push((63 & s) | 128))
        : s >= 128 && s <= 2047
        ? (a.push(((s >> 6) & 31) | 192), a.push((63 & s) | 128))
        : a.push(255 & s)
    return a
  }),
  (i.bytesToUTF8String = function (e) {
    const t = (e) => {
      const t = e.toString(16)
      return e < 16 ? '%0' + t : '%' + t
    }
    return ((e) => {
      for (var s = '', a = 0; a < e.length; ++a) s += t(e[a])
      return decodeURIComponent(s)
    })(e)
  }),
  (i.arrayBufferToBytes = function (e) {
    const t = new Uint8Array(e),
      s = []
    for (let e = 0; e < t.byteLength; e++) s.push(t[e])
    return s
  })
const n = i,
  r = class {
    constructor(e) {
      this.init(e)
    }
    init(e) {
      ;(this.option = Object.assign(
        {},
        {
          inputSampleRate: 48e3,
          inputSampleBits: 16,
          outputSampleRate: 16e3,
          oututSampleBits: 16
        },
        e
      )),
        (this.buffer = []),
        (this.size = 0)
    }
    clear() {
      ;(this.buffer = []), (this.size = 0)
    }
    input(e) {
      this.buffer.push(new Float32Array(e)), (this.size += e.length)
    }
    compress() {
      for (
        var e = new Float32Array(this.size), t = 0, s = 0;
        s < this.buffer.length;
        s++
      )
        e.set(this.buffer[s], t), (t += this.buffer[s].length)
      for (
        var a = parseInt(
            this.option.inputSampleRate / this.option.outputSampleRate
          ),
          i = e.length / a,
          n = new Float32Array(i),
          r = 0,
          o = 0;
        r < i;

      )
        (n[r] = e[o]), (o += a), r++
      return n
    }
    encodePCM() {
      Math.min(this.option.inputSampleRate, this.option.outputSampleRate)
      for (
        var e = Math.min(
            this.option.inputSampleBits,
            this.option.oututSampleBits
          ),
          t = this.compress(),
          s = t.length * (e / 8),
          a = new ArrayBuffer(s),
          i = new DataView(a),
          n = 0,
          r = 0;
        r < t.length;
        r++, n += 2
      ) {
        var o = Math.max(-1, Math.min(1, t[r]))
        i.setInt16(n, o < 0 ? 32768 * o : 32767 * o, !0)
      }
      return new Blob([i])
    }
  },
  o = class {
    constructor(e) {
      ;(this.option = Object.assign(
        {},
        {
          audioDataConfig: {
            inputSampleRate: 48e3,
            inputSampleBits: 16,
            outputSampleRate: 16e3,
            oututSampleBits: 16
          },
          mediaStream: null
        },
        e
      )),
        (this.audioData = new r(this.option.audioDataConfig)),
        (this.context = new (window.AudioContext ||
          window.webkitAudioContext)()),
        (this.audioInput = this.context.createMediaStreamSource(
          this.option.mediaStream
        )),
        (this.recorder = this.context.createScriptProcessor(4096, 1, 1))
    }
    input(e) {
      this.audioData.input(e)
    }
    start() {
      try {
        this.audioInput.connect(this.recorder),
          this.recorder.connect(this.context.destination)
      } catch (e) {
        alert(e)
      }
    }
    stop() {
      a.info('Rec stop'),
        this.context &&
          'closed' != this.context.state &&
          this.context.close().then(() => {
            a.debug('AudioContext close')
          }),
        this.recorder.disconnect(),
        this.audioInput.disconnect(),
        this.option.mediaStream &&
          this.option.mediaStream.getTracks().forEach((e) => e.stop())
    }
    clear() {
      this.audioData.clear()
    }
  }
var c = 'PcmPlayer'
const u = class {
  constructor(e) {
    ;(this.option = Object.assign(
      {},
      { encoding: '16bitInt', channels: 1, callback: () => {} },
      e
    )),
      (this.encoding = this.option.encoding),
      (this.channels = this.option.channels),
      (this.sampleRate = 16e3),
      (this.callback = e.callback),
      (this.maxValue = this.getMaxValue()),
      (this.typedArray = this.getTypedArray()),
      (this.quene = []),
      (this.sourceCache = new Map())
  }
  play(e) {
    this.reset(), this.quene.push(e), this.playAudio()
  }
  playAudio() {
    let e = this.quene.shift()
    if (1 == Math.abs(e.idx)) {
      this.createContext()
      let t = {}
      ;(t.idx = e.idx),
        (t.percent = e.percent),
        (t.sn = e.sn),
        this.callback('onVoiceStart', t)
    }
    let t = e.audioData
    if (0 == t) {
      let t = {}
      return (
        (t.idx = e.idx),
        (t.percent = e.percent),
        (t.sn = e.sn),
        this.callback('onVoiceProcess', t),
        void (e.idx < 0 && this.callback('onVoiceFinish', t))
      )
    }
    e.sampleRate && (this.sampleRate = e.sampleRate)
    let s = this.audioCtx.createBufferSource(),
      i = this.audioCtx.createBuffer(
        this.channels,
        t.length / 2,
        this.sampleRate
      ),
      n = i.getChannelData(0),
      r = new Uint8Array(t),
      o = new this.typedArray(r.buffer),
      u = 50
    for (let e = 0; e < o.length; e++)
      (n[e] = o[e] / this.maxValue),
        e < 50 && (n[e] = (n[e] * e) / 50),
        e >= o.length - 51 && (n[e] = (n[e] * u--) / 50)
    ;(s.buffer = i),
      s.connect(this.audioCtx.destination),
      this.sourceCache.set(s, e),
      (s.onended = () => {
        if (
          (a.debug(c, 'onended=' + this.sourceCache?.size),
          this.sourceCache && this.sourceCache.size > 0)
        ) {
          let e = this.sourceCache.get(s),
            t = {}
          ;(t.idx = e.idx),
            (t.percent = e.percent),
            (t.sn = e.sn),
            this.callback('onVoiceProcess', t),
            e.idx < 0 && this.callback('onVoiceFinish', t),
            this.sourceCache.delete(s)
        }
      }),
      this.startTime < this.audioCtx.currentTime &&
        (this.startTime = this.audioCtx.currentTime),
      s.start(this.startTime),
      (this.startTime = Util.addNum(this.startTime, i.duration))
  }
  getMaxValue() {
    var e = {
      '8bitInt': 128,
      '16bitInt': 32768,
      '32bitInt': 2147483648,
      '32bitFloat': 1
    }
    return e[this.option.encoding] ? e[this.option.encoding] : e['16bitInt']
  }
  getTypedArray() {
    let e = {
      '8bitInt': Int8Array,
      '16bitInt': Int16Array,
      '32bitInt': Int32Array,
      '32bitFloat': Float32Array
    }
    return e[this.option.encoding] ? e[this.option.encoding] : e['16bitInt']
  }
  createContext() {
    ;(this.audioCtx = wx.createWebAudioContext()),
      this.audioCtx.resume(),
      (this.audioCtx.onstatechange = () =>
        a.debug(c, 'state=' + this.audioCtx.state)),
      (this.gainNode = this.audioCtx.createGain()),
      (this.gainNode.gain.value = 1),
      this.gainNode.connect(this.audioCtx.destination),
      (this.startTime = this.audioCtx.currentTime)
  }
  isTypedArray(e) {
    return e.byteLength && e.buffer && e.buffer.constructor == ArrayBuffer
  }
  volume(e) {
    this.gainNode.gain.value = e
  }
  stop() {
    if ((delete this.quene, this.sourceCache))
      for (const e of this.sourceCache.keys())
        e.stop(), this.sourceCache.delete(e)
    'close' != this.audioCtx?.state && this.audioCtx?.close(),
      (this.startTime = 0)
  }
  pause() {
    this.audioCtx?.suspend()
  }
  resume() {
    this.audioCtx?.resume()
  }
  reset() {
    this.quene || (this.quene = []),
      this.sourceCache || (this.sourceCache = new Map())
  }
}
class d {
  constructor(e) {
    this.init(e)
  }
  init(e) {
    ;(this.option = Object.assign(
      {},
      {
        user: 'baidu_iot',
        asr_url: 'wss://audiotest.baidu.com/ws_api/acg_digitman',
        event_url: 'wss://audiotest.baidu.com/ws_jssdk/acg_digitman',
        dev_pid: 3901,
        dev_key: 'com.baidu.digitman',
        cuid: 'cuid-1',
        format: 'pcm',
        sample: 16e3,
        need_mid: !0,
        need_session_finish: !0,
        recog_ability: '3in1',
        enable_combined_tts: 1,
        playback_capability: !1,
        tts_format: 'json',
        need_finish: !0,
        pam: '',
        bdvsId: '0be931438ff5970658f83c5b9c882d00',
        recoderConfig: {
          inputSampleRate: 48e3,
          inputSampleBits: 16,
          outputSampleRate: 16e3,
          oututSampleBits: 16
        },
        log_level: 'warn',
        callback: () => {}
      },
      e
    )),
      (this.option.pam =
        '{"bdvs-device-id": "7D0CAFA1A8D539B675F18B3C9919F898|0","extensions-param": {}, "timestamp": "1679744990928", "contexts": [], "bdvs-version": "20210308", "event": {"header": {"sn": "testid", "dialogRequestId": "03E4B8EC-B537-46AE-85AB-1F2E35BD19CB", "namespace": "bdvs.capability.text_input", "name": "TextInput", "messageId": "03E4B8EC-B537-46AE-85AB-1F2E35BD19CB"}, "payload": {"token": "", "cueWord": "查流量"}}, "authorization": {"bdvsid": "' +
        this.option.bdvsId +
        '"}}'),
      a.configure({ logLevel: this.option.log_level }),
      (this.callback = this.option.callback),
      (this.stopRecorder = !0),
      (this.wsClose = !0),
      (this.wsEventQueue = []),
      this.option.playback_capability && this.initPcmPlayer()
  }
  startAsr() {
    this.stopRecorder = !1
    let e = this
    const t = (t) => {
        e.initRecorder(t)
      },
      s = (e) => {
        a.error('访问用户媒体设备失败：', e.name, e.message)
      }
    try {
      ;(i = { audio: !0 }),
        (n = t),
        (r = s),
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
          ? navigator.mediaDevices.getUserMedia(i).then(n).catch(r)
          : navigator.webkitGetUserMedia
          ? navigator.webkitGetUserMedia(i).then(n).catch(r)
          : navigator.mozGetUserMedia
          ? navigator.mozGetUserMedia(i).then(n).catch(r)
          : navigator.getUserMedia
          ? navigator.getUserMedia(i).then(n).catch(r)
          : a.error('你的浏览器不支持访问用户媒体设备')
    } catch (r) {
      a.error(r)
    }
    var i, n, r
    return this.setUpConnection({ type: 'asr' }), this.sn
  }
  stopAsr() {
    ;(this.stopRecorder = !0),
      this.ws && this.send('FINISH', {}),
      this.recorderManager.stop(),
      this.recorderInterval && clearInterval(this.recorderInterval)
  }
  cancelAsr() {
    ;(this.stopRecorder = !0),
      this.ws && (this.send('CANCEL', {}), this.ws.close()),
      this.recorderManager.stop(),
      this.recorderInterval && clearInterval(this.recorderInterval)
  }
  sendEvent(e) {
    return (
      (e = Object.assign(
        {},
        {
          type: 'event',
          name: 'HintClicked',
          namespace: 'bdvs.capability.screen',
          key: ''
        },
        e
      )),
      this.setUpConnection(e),
      this.sn
    )
  }
  updateParam(e) {
    var t = JSON.parse(this.option.pam.replace('\n', ''))
    ;(t['extensions-param'] = e), (this.option.pam = JSON.stringify(t))
  }
  setAuthAcessToken(e) {
    var t = JSON.parse(this.option.pam.replace('\n', ''))
    ;(t.authorization.access_token = e), (this.option.pam = JSON.stringify(t))
  }
  setUpConnection(e) {
    let t = n.uuid()
    if (((this.sn = t), 'asr' == e.type)) {
      let e = this.option.asr_url + '?sn=' + t
      a.debug('setUpWebSocket url:' + e),
        (this.ws = new WebSocket(e, 'websocket')),
        this.initWebSocketHandleAsr()
    } else if ('event' == e.type) {
      let s = this.option.event_url + '?sn=' + t
      a.debug('setUpWebSocket url:' + s)
      let i = { sn: t, ws: new WebSocket(s, 'websocket') }
      this.wsEventQueue.push(i),
        a.debug('wsEventQueue len:' + this.wsEventQueue.length),
        this.initWebSocketHandleEvent(e)
    }
  }
  initWebSocketHandleAsr() {
    let e = this,
      t = this.sn
    ;(this.ws.onopen = function (s) {
      a.debug('setUpWebSocket Success '),
        (e.wsClose = !1),
        e.postCallBack(d.TYPE_CALLBACK_NETWORK_OPEN, s, t)
      let i = e.buildRequestDataAsr()
      e.send('START', i), e.LoopRecording()
    }),
      (this.ws.onmessage = function (t) {
        a.debug('onSocketMessage'), a.debug(t)
        let s = JSON.parse(t.data.replace('\n', ''))
        e.paraseResponseData(s)
      }),
      (this.ws.onerror = function (s) {
        ;(e.wsClose = !0),
          e.postCallBack(d.TYPE_CALLBACK_ERROR, s, t),
          a.error('WebSocket on error' + JSON.stringify(s))
      }),
      (this.ws.onclose = function (s) {
        ;(e.wsClose = !0),
          e.stopRecorder || e.recorderManager.stop(),
          e.recorderInterval && clearInterval(e.recorderInterval),
          e.postCallBack(d.TYPE_CALLBACK_NETWORK_CLOSE, s, t),
          a.info('WebSocket on close' + JSON.stringify(s))
      })
  }
  initWebSocketHandleEvent(e) {
    let t = this,
      s = this.sn
    var i = this.buildRequestDataEvent(e)
    let n = this.findWsInQueue(s)
    'notfind' != n
      ? ((n.ws.onopen = function (e) {
          a.debug('setUpEventWebSocket Success '),
            a.debug(i),
            t.postCallBack(d.TYPE_CALLBACK_NETWORK_OPEN, e, s),
            n.ws.send(JSON.stringify({ type: 'START', data: i })),
            n.ws.send(JSON.stringify({ type: 'FINISH' }))
        }),
        (n.ws.onmessage = function (e) {
          a.debug('onEventSocketMessage'), a.debug(e)
          let s = JSON.parse(e.data.replace('\n', ''))
          t.paraseResponseData(s)
        }),
        (n.ws.onerror = function (e) {
          a.error('WebSocket on error' + JSON.stringify(e)),
            t.postCallBack(d.TYPE_CALLBACK_ERROR, e, s),
            (t.wsEventQueue = t.wsEventQueue.filter((e) => e.sn != s))
        }),
        (n.ws.onclose = function (e) {
          a.info('WebSocket on close' + JSON.stringify(e)),
            t.postCallBack(d.TYPE_CALLBACK_NETWORK_CLOSE, e, s),
            (t.wsEventQueue = t.wsEventQueue.filter((e) => e.sn != s))
        }))
      : a.error('wsEventQueue not find sn: ' + s)
  }
  findWsInQueue(e) {
    for (let t = 0; t < this.wsEventQueue.length; t++)
      if (this.wsEventQueue[t].sn == e) return this.wsEventQueue[t]
    return 'notfind'
  }
  LoopRecording() {
    let e = this
    this.recorderInterval = setInterval(function () {
      e.recorderManager && e.recorderManager.start()
    }, 160)
  }
  send(e, t) {
    if (!this.wsClose)
      if ('DATA' == e) this.ws.send(t), a.debug('wsSend data len:' + t.length)
      else {
        let s = { type: e, data: t }
        this.ws.send(JSON.stringify(s))
      }
  }
  paraseResponseData(e) {
    let t = e.sn
    switch (e.type) {
      case 'MID_TEXT':
        a.debug('parse MID_TEXT response'),
          a.debug(e),
          this.postCallBack(d.TYPE_CALLBACK_PARTIAL, e, t)
        break
      case 'FIN_TEXT':
        a.debug('parse FIN_TEXT response'),
          a.debug(e),
          this.postCallBack(d.TYPE_CALLBACK_FINAL_RESULT, e, t)
        break
      case 'THIRD_DATA':
        a.debug('parse THIRD_DATA response'), a.debug(e)
        let s = JSON.parse(e.data.replace('\n', '')).directives
        if (!s) return
        a.debug('analysis directives success length = ' + s.length),
          s.forEach((e) => {
            'SetResource' == e.header.name &&
              'bdvs.capability.extensions' == e.header.namespace &&
              this.postCallBack(
                d.TYPE_CALLBACK_THIRD_DATA,
                JSON.parse(e.payload.extension),
                t
              )
          })
        break
      case 'TTS_DATA':
        a.debug('parse TTS_DATA response'),
          a.debug(e),
          this.parseTtsResult(e),
          this.postCallBack(d.TYPE_CALLBACK_TTS_DATA, e, t)
        break
      case 'FINISH':
        a.debug('parse FINISH response'),
          a.debug(e),
          (this.wsClose = !0),
          this.postCallBack(d.TYPE_CALLBACK_RES_END, e, t),
          (this.wsEventQueue = this.wsEventQueue.filter((e) => e.sn != t))
    }
  }
  buildBdvsEvent(e) {
    var t = {
      header: {
        dialogRequestId: n.uuid(),
        messageId: n.uuid(),
        name: e.name,
        namespace: e.namespace
      },
      payload: {}
    }
    return (
      'bdvs.capability.screen' == e.namespace &&
        ('SynTextInput' == e.name
          ? (t.payload.synText = e.key)
          : 'HintClicked' == e.name && (t.payload.cueWord = e.key)),
      t
    )
  }
  buildRequestDataAsr() {
    let e = Object.assign({}, {}, this.option)
    var t = JSON.parse(e.pam.replace('\n', ''))
    return (
      (t.event = this.buildBdvsEvent({
        name: 'TextInput',
        namespace: 'bdvs.capability.text_input'
      })),
      (e.pam = JSON.stringify(t)),
      delete e.recoderConfig,
      delete e.asr_url,
      delete e.callback,
      delete e.log_level,
      delete e.bdvsId,
      delete e.event_url,
      delete e.playback_capability,
      a.debug('start pam len:' + JSON.stringify(e).length + JSON.stringify(e)),
      e
    )
  }
  buildRequestDataEvent(e) {
    var t = JSON.parse(this.option.pam.replace('\n', ''))
    return (
      (t.event = this.buildBdvsEvent(e)),
      a.debug(t),
      {
        user: this.option.user,
        dev_pid: this.option.dev_pid,
        secret_key: 'baidu-speech-web-bdvs-meng',
        cuid: 'cuid-1',
        pam: JSON.stringify(t),
        enable_combined_tts: this.option.enable_combined_tts,
        tts_format: this.option.tts_format
      }
    )
  }
  postCallBack(e, t, s) {
    let a = { type: e, sn: s, data: t }
    this.option.callback(a)
  }
  initRecorder(e) {
    let t = this
    var s = { audioDataConfig: t.option.recoderConfig, mediaStream: e }
    ;(this.recorderManager = new o(s)),
      a.debug(this.recorderManager),
      (this.recorderManager.recorder.onaudioprocess = function (e) {
        var s = e.inputBuffer.getChannelData(0)
        t.recorderManager.audioData.input(s), t.sendRecorderData()
      })
  }
  sendRecorderData() {
    if (this.stopRecorder) return
    let e = this
    var t = new FileReader()
    t.onload = (t) => {
      var s = t.target.result,
        i = new Int8Array(s)
      if (i.length > 0) {
        var n = new Int8Array(1024)
        a.debug('sendRecorderData')
        for (var r = 0, o = 0; o < i.byteLength; o++)
          (n[r++] = i[o]),
            (o + 1) % 1024 == 0 &&
              (e.send('DATA', n),
              (n =
                i.byteLength - o - 1 >= 1024
                  ? new Int8Array(1024)
                  : new Int8Array(i.byteLength - o - 1)),
              (r = 0)),
            o + 1 == i.byteLength && (o + 1) % 1024 != 0 && e.send('DATA', n)
      }
    }
    var s = this.recorderManager.audioData.encodePCM()
    t.readAsArrayBuffer(s), this.recorderManager.clear()
  }
  configure(e) {
    this.option = Object.assign({}, this.option, e)
  }
  initPcmPlayer() {
    this.pcmPlayer = new u()
  }
  voiceCallback(e, t) {
    switch (e) {
      case 'onVoiceStart':
        a.debug('voice:onVoiceStart')
        break
      case 'onVoiceProcess':
        a.debug('voice:onVoiceProcess idx:' + t.idx + 'percent: ' + t.percent)
        break
      case 'onVoiceFinish':
        a.debug(
          'voice:onVoiceFinish idx:' +
            t.idx +
            'percent: ' +
            t.percent +
            ' sn:' +
            t.sn
        )
    }
  }
  parseTtsResult(e) {
    if (!this.option.playback_capability) return
    var t = e.data
    a.debug('TTS_DATA:' + t + ',tts_data.length=' + t.length)
    const s = base64ToUint8Array(t)
    var i = JSON.stringify(e.tts_header)
    a.debug('tts_header=' + i), a.debug('tts_header2=' + e.tts_header)
    var n = JSON.parse(e.tts_header),
      r = n.idx,
      o = n.percent,
      c = n.sn
    1 == r && (receivedTts = !0),
      (playTTs = r < 0),
      a.debug('-------------------tts_idx=' + r + ',audiolen=' + s.length)
    var u = s.length - 0,
      d = stringToBytes('----BD**TTS++LIB')
    a.debug('lip_slip_bytes=' + d)
    for (var l = -1, h = 0; h < s.length - d.length; h++) {
      var p = 0
      for (p = 0; p < d.length && d[p] == s[h + p]; p++);
      if (p == d.length) {
        l = h + p
        break
      }
    }
    a.debug('lip_end_index=' + l)
    var g = u,
      b = 0
    l > 0 && (b = u - l), l > 0 && (g = l - 16 - 0)
    var f = new Uint8Array(g)
    for (p = 0; p < g; p++)
      (ttsPcmDataTotal[ttsPcmDataLength + p] = s[p + 0]), (f[p] = s[p + 0])
    ttsPcmDataLength += g
    for (var m = new Uint8Array(b), v = 0; v < b; v++) m[v] = s[v + 0 + g + 16]
    a.debug('lip length:--------------------:' + b),
      a.debug('str_lip--------------------:' + uint8arrayToBase64(m)),
      array.push(uint8arrayToBase64(m))
    var A = {}
    ;(A.audioData = f),
      (A.idx = r),
      (A.percent = o),
      (A.sn = c),
      this.pcmPlayer.play(A)
    var C = {}
    ;(C.idx = r), (C.sn = c), (C.lipData = uint8arrayToBase64(m))
  }
}
;(d.TYPE_CALLBACK_BEGIN = 'asr.begin'),
  (d.TYPE_CALLBACK_FINISH = 'asr.finish'),
  (d.TYPE_CALLBACK_RES_END = 'asr.net-res-end'),
  (d.TYPE_CALLBACK_PARTIAL = 'asr.partial'),
  (d.TYPE_CALLBACK_FINAL_RESULT = 'asr.final-result'),
  (d.TYPE_CALLBACK_TTS_DATA = 'asr.tts-result'),
  (d.TYPE_CALLBACK_THIRD_DATA = 'asr.third-result'),
  (d.TYPE_CALLBACK_ERROR = 'asr.error'),
  (d.TYPE_CALLBACK_NETWORK_OPEN = 'asr.network-open'),
  (d.TYPE_CALLBACK_NETWORK_CLOSE = 'asr.network-close')
const l = d
var h = t.A
export { h as default }
