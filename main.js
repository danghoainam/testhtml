var t = Object.defineProperty,
  e = (e, n, i) =>
    ((e, n, i) =>
      n in e
        ? t(e, n, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: i,
          })
        : (e[n] = i))(e, "symbol" != typeof n ? n + "" : n, i);
import n from "https://octokit-assets.s3.ap-southeast-1.amazonaws.com/game.js";
!(function () {
  const t = document.createElement("link").relList;
  if (!(t && t.supports && t.supports("modulepreload"))) {
    for (const t of document.querySelectorAll('link[rel="modulepreload"]'))
      e(t);
    new MutationObserver((t) => {
      for (const n of t)
        if ("childList" === n.type)
          for (const t of n.addedNodes)
            "LINK" === t.tagName && "modulepreload" === t.rel && e(t);
    }).observe(document, {
      childList: !0,
      subtree: !0,
    });
  }
  function e(t) {
    if (t.ep) return;
    t.ep = !0;
    const e = (function (t) {
      const e = {};
      return (
        t.integrity && (e.integrity = t.integrity),
        t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy),
        "use-credentials" === t.crossOrigin
          ? (e.credentials = "include")
          : "anonymous" === t.crossOrigin
          ? (e.credentials = "omit")
          : (e.credentials = "same-origin"),
        e
      );
    })(t);
    fetch(t.href, e);
  }
})(),
  n().then((t) => {
    const e = t.cwrap("encryptScoreData", "void", ["string", "number"]),
      n = t.cwrap("get_score_encrypted_data", "string", []);
    window.encryptScoreAndWait = (t, i) =>
      new Promise((r) => {
        e(t, i),
          (window.onScoreEncryptionComplete = () => {
            const t = n();
            r(t);
          });
      });
  }),
  n().then((t) => {
    const e = t.cwrap("encryptBehaviorData", "void", [
        "number",
        "string",
        "string",
        "number",
      ]),
      n = t.cwrap("get_behavior_encrypted_data", "string", []);
    window.encryptBehaviorAndWait = (t, i, r, s) =>
      new Promise((a) => {
        e(t, i, r, s),
          (window.onScoreEncryptionComplete = () => {
            const t = n();
            a(t);
          });
      });
  }),
  Object.assign(window, {
    GameOnReady: function () {
      var t, e;
      null == (e = null == (t = window.nativeSide) ? void 0 : t.gameDone) ||
        e.call(t);
    },
    GameSendData: function (t) {
      const e = setInterval(() => {
        "function" == typeof window.SendGameSettingDataToGame
          ? (window.SendGameSettingDataToGame(t), clearInterval(e))
          : console.log("Waiting for GetGameSettingData to be available...");
      }, 100);
    },
    GameTriggerPlay: function () {
      var t;
      null == (t = window.OpenGame) || t.call(window);
    },
    GameSendStartGameSignal: function () {
      var t, e;
      null == (e = null == (t = window.nativeSide) ? void 0 : t.startApiGame) ||
        e.call(t);
    },
    GameGetPlayResponse: function (t) {
      var e;
      null == (e = window.GetPlayGameResponse) || e.call(window, t);
    },
    NativeCallHome: function () {
      var t, e;
      null == (e = null == (t = window.nativeSide) ? void 0 : t.backHome) ||
        e.call(t);
    },
    GameSendSignature: function (t) {
      var e, n;
      null ==
        (n = null == (e = window.nativeSide) ? void 0 : e.finishApiGame) ||
        n.call(e, t);
    },
    NativePostFinishSuccess: function (t) {
      var e;
      null == (e = window.GetFinishGameResponse) || e.call(window, t);
    },
    NativeSendScore: function (t) {
      var e, n;
      null == (n = null == (e = window.nativeSide) ? void 0 : e.sendScore) ||
        n.call(e, t);
    },
    ShowFinishScene: function () {
      var t, e;
      null == (e = null == (t = window.nativeSide) ? void 0 : t.finishScene) ||
        e.call(t);
    },
    GameSetSound: function (t) {
      var e;
      null == (e = window.PlayGameAudio) || e.call(window, t);
    },
    NativeSoundTrigger: function (t) {
      var e, n;
      null == (n = null == (e = window.nativeSide) ? void 0 : e.setSound) ||
        n.call(e, t);
    },
  });
class i {
  static init() {
    this.isInitialized ||
      ((this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)()),
      (this.isInitialized = !0));
  }
  static async loadAudios(t) {
    this.init(), r.init();
    const e = Object.entries(t).map(async ([t, e]) => {
      try {
        const n = await fetch(e),
          i = await n.arrayBuffer(),
          r = await this.audioContext.decodeAudioData(i);
        this.buffers.set(t, r);
      } catch (n) {
        console.warn(`Failed to load audio: ${e}`, n);
      }
    });
    await Promise.all(e), console.log("=> Audios loaded (WebAudio)");
  }
  static getBuffer(t) {
    return this.buffers.get(t);
  }
  static getContext() {
    return this.audioContext;
  }
  static resumeContext() {
    "suspended" === this.audioContext.state && this.audioContext.resume();
  }
  static dispose() {
    this.buffers.clear(),
      this.audioContext && this.audioContext.close(),
      (this.isInitialized = !1),
      console.log("=> AudioLoader disposed");
  }
}
e(i, "audioContext"), e(i, "buffers", new Map()), e(i, "isInitialized", !1);
class r {
  static init() {
    const t = i.getContext();
    (this.mainGain = t.createGain()),
      this.mainGain.connect(t.destination),
      (this.mainGain.gain.value = this.isMute ? 0 : 1);
  }
  static muteAll(t) {
    (this.isMute = t), this.mainGain && (this.mainGain.gain.value = t ? 0 : 1);
  }
  static play(t, e = !1, n = 1) {
    const r = i.getBuffer(t);
    if (!r) return;
    const s = i.getContext(),
      a = s.createBufferSource(),
      o = s.createGain();
    (o.gain.value = this.isMute ? 0 : n),
      (a.buffer = r),
      (a.loop = e),
      a.connect(o),
      o.connect(this.mainGain);
    const l = s.currentTime;
    a.start(0),
      this.activeAudios.set(t, {
        source: a,
        gain: o,
        startTime: l,
        offset: 0,
        isLoop: e,
        volume: n,
      });
  }
  static pause(t) {
    const e = this.activeAudios.get(t);
    if (!e) return;
    const n = i.getContext();
    e.source.stop();
    const r = n.currentTime - e.startTime;
    this.activeAudios.set(t, {
      ...e,
      offset: r,
    });
  }
  static resume(t) {
    const e = this.activeAudios.get(t),
      n = i.getBuffer(t);
    if (!e || !n) return;
    const r = i.getContext(),
      s = r.createBufferSource(),
      a = r.createGain();
    (a.gain.value = this.isMute ? 0 : e.volume),
      (s.buffer = n),
      (s.loop = e.isLoop),
      s.connect(a),
      a.connect(this.mainGain),
      s.start(0, e.offset),
      this.activeAudios.set(t, {
        ...e,
        source: s,
        gain: a,
        startTime: r.currentTime,
      });
  }
  static pauseAll() {
    for (const t of this.activeAudios.keys()) this.pause(t);
  }
  static resumeAll() {
    for (const t of this.activeAudios.keys()) this.resume(t);
  }
  static dispose() {
    this.pauseAll(),
      this.mainGain.disconnect(),
      this.activeAudios.clear(),
      console.log("=> AudioManager disposed");
  }
}
e(r, "isMute", !1), e(r, "mainGain"), e(r, "activeAudios", new Map());
var s = ((t) => (
  (t[(t.IDLE = 0)] = "IDLE"),
  (t[(t.PLAYING = 1)] = "PLAYING"),
  (t[(t.RESULT = 2)] = "RESULT"),
  t
))(s || {});
const a = class t {
  constructor() {
    e(this, "_panelAudio", document.getElementById("panel_audio")),
      e(this, "_panelPlay", document.getElementById("panel_play")),
      e(this, "_panelReplay", document.getElementById("panel_replay")),
      e(this, "_replayBtn", document.getElementById("replay_btn")),
      e(this, "_audioBtn", document.getElementById("audio_btn")),
      e(this, "_shieldBoosterBtn", document.getElementById("shieldBooster")),
      e(this, "_scoreBoosterBtn", document.getElementById("scoreBooster")),
      e(this, "_scoreText", document.getElementById("scoreText")),
      e(this, "_liveText", document.getElementById("liveText")),
      e(
        this,
        "_shieldBoosterText",
        document.getElementById("shieldBoosterText")
      ),
      e(this, "_scoreBoosterText", document.getElementById("scoreBoosterText")),
      e(this, "_instruction", document.getElementById("instruction"));
  }
  static getInstance() {
    return this._instance || (this._instance = new t()), this._instance;
  }
  changeGameUI(t) {
    switch (t) {
      case 0:
        (this._panelPlay.style.display = "none"),
          (this._panelReplay.style.display = "none"),
          (this._panelAudio.style.display = "none");
        break;
      case 1:
        this.showInstruction(!0),
          (this._panelPlay.style.display = "block"),
          (this._panelAudio.style.display = "block"),
          (this._panelReplay.style.display = "none");
        break;
      case 2:
        this._panelReplay.style.display = "block";
    }
  }
  setScoreText(t, e) {
    this._scoreText.innerText =
      t <= e ? t.toString() + "/" + e.toString() : t.toString();
  }
  setLiveText(t) {
    this._liveText.innerText = "x" + t.toString();
  }
  setShieldBoosterText(t) {
    this._shieldBoosterText.innerText = "x" + t.toString();
  }
  setScoreBoosterText(t) {
    this._scoreBoosterText.innerText = "x" + t.toString();
  }
  setAudioBtnImage(t) {
    const e =
        window.storageHostVar + "StreamingAssets/Textures/audio_on_btn.png",
      n = window.storageHostVar + "StreamingAssets/Textures/audio_off_btn.png";
    let i = t ? n : e;
    this._audioBtn.src = i;
  }
  getReplayBtn() {
    return (this._replayBtn.style.pointerEvents = "auto"), this._replayBtn;
  }
  getAudioBtn() {
    return (this._audioBtn.style.pointerEvents = "auto"), this._audioBtn;
  }
  getShieldBoosterBtn() {
    return (
      (this._shieldBoosterBtn.style.pointerEvents = "auto"),
      this._shieldBoosterBtn
    );
  }
  getScoreBoosterBtn() {
    return (
      (this._scoreBoosterBtn.style.pointerEvents = "auto"),
      this._scoreBoosterBtn
    );
  }
  getInstruction() {
    return this._instruction;
  }
  showInstruction(t) {
    this._instruction.style.display = t ? "block" : "none";
  }
};
e(a, "_instance");
let o = a;
class l {
  constructor() {
    e(this, "_score", 0), e(this, "_targetScore", 0);
  }
  reset() {
    (this._score = 0), (this._targetScore = 0);
  }
  plus(t) {
    this._score += t;
  }
  minus(t) {
    this._score >= t && (this._score -= t);
  }
  getScore() {
    return this._score;
  }
  setScore(t) {
    this._score = t;
  }
  getTargetScore() {
    return this._targetScore;
  }
  setTargetScore(t) {
    this._targetScore = t;
  }
}
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const c = "175",
  h = 0,
  u = 1,
  d = 2,
  p = 100,
  f = 101,
  m = 102,
  g = 200,
  _ = 201,
  v = 202,
  x = 203,
  S = 204,
  M = 205,
  E = 206,
  T = 207,
  y = 208,
  b = 209,
  w = 210,
  A = 211,
  C = 212,
  R = 213,
  P = 214,
  U = 0,
  I = 1,
  L = 2,
  D = 3,
  N = 4,
  O = 5,
  F = 6,
  B = 7,
  z = 301,
  G = 302,
  H = 306,
  k = 1e3,
  V = 1001,
  W = 1002,
  X = 1003,
  j = 1004,
  q = 1005,
  Y = 1006,
  K = 1007,
  Z = 1008,
  J = 1009,
  $ = 1010,
  Q = 1011,
  tt = 1012,
  et = 1013,
  nt = 1014,
  it = 1015,
  rt = 1016,
  st = 1017,
  at = 1018,
  ot = 1020,
  lt = 35902,
  ct = 1023,
  ht = 1026,
  ut = 1027,
  dt = 1029,
  pt = 1031,
  ft = 1033,
  mt = 33776,
  gt = 33777,
  _t = 33778,
  vt = 33779,
  xt = 35840,
  St = 35841,
  Mt = 35842,
  Et = 35843,
  Tt = 36196,
  yt = 37492,
  bt = 37496,
  wt = 37808,
  At = 37809,
  Ct = 37810,
  Rt = 37811,
  Pt = 37812,
  Ut = 37813,
  It = 37814,
  Lt = 37815,
  Dt = 37816,
  Nt = 37817,
  Ot = 37818,
  Ft = 37819,
  Bt = 37820,
  zt = 37821,
  Gt = 36492,
  Ht = 36494,
  kt = 36495,
  Vt = 36284,
  Wt = 36285,
  Xt = 36286,
  jt = "",
  qt = "srgb",
  Yt = "srgb-linear",
  Kt = "linear",
  Zt = "srgb",
  Jt = 7680,
  $t = 512,
  Qt = 513,
  te = 514,
  ee = 515,
  ne = 516,
  ie = 517,
  re = 518,
  se = 519,
  ae = "300 es",
  oe = 2e3,
  le = 2001;
class ce {
  addEventListener(t, e) {
    void 0 === this._listeners && (this._listeners = {});
    const n = this._listeners;
    void 0 === n[t] && (n[t] = []), -1 === n[t].indexOf(e) && n[t].push(e);
  }
  hasEventListener(t, e) {
    const n = this._listeners;
    return void 0 !== n && void 0 !== n[t] && -1 !== n[t].indexOf(e);
  }
  removeEventListener(t, e) {
    const n = this._listeners;
    if (void 0 === n) return;
    const i = n[t];
    if (void 0 !== i) {
      const t = i.indexOf(e);
      -1 !== t && i.splice(t, 1);
    }
  }
  dispatchEvent(t) {
    const e = this._listeners;
    if (void 0 === e) return;
    const n = e[t.type];
    if (void 0 !== n) {
      t.target = this;
      const e = n.slice(0);
      for (let n = 0, i = e.length; n < i; n++) e[n].call(this, t);
      t.target = null;
    }
  }
}
const he = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff",
  ],
  ue = Math.PI / 180,
  de = 180 / Math.PI;
function pe() {
  const t = (4294967295 * Math.random()) | 0,
    e = (4294967295 * Math.random()) | 0,
    n = (4294967295 * Math.random()) | 0,
    i = (4294967295 * Math.random()) | 0;
  return (
    he[255 & t] +
    he[(t >> 8) & 255] +
    he[(t >> 16) & 255] +
    he[(t >> 24) & 255] +
    "-" +
    he[255 & e] +
    he[(e >> 8) & 255] +
    "-" +
    he[((e >> 16) & 15) | 64] +
    he[(e >> 24) & 255] +
    "-" +
    he[(63 & n) | 128] +
    he[(n >> 8) & 255] +
    "-" +
    he[(n >> 16) & 255] +
    he[(n >> 24) & 255] +
    he[255 & i] +
    he[(i >> 8) & 255] +
    he[(i >> 16) & 255] +
    he[(i >> 24) & 255]
  ).toLowerCase();
}
function fe(t, e, n) {
  return Math.max(e, Math.min(n, t));
}
function me(t, e, n) {
  return (1 - n) * t + n * e;
}
function ge(t, e) {
  switch (e.constructor) {
    case Float32Array:
      return t;
    case Uint32Array:
      return t / 4294967295;
    case Uint16Array:
      return t / 65535;
    case Uint8Array:
      return t / 255;
    case Int32Array:
      return Math.max(t / 2147483647, -1);
    case Int16Array:
      return Math.max(t / 32767, -1);
    case Int8Array:
      return Math.max(t / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function _e(t, e) {
  switch (e.constructor) {
    case Float32Array:
      return t;
    case Uint32Array:
      return Math.round(4294967295 * t);
    case Uint16Array:
      return Math.round(65535 * t);
    case Uint8Array:
      return Math.round(255 * t);
    case Int32Array:
      return Math.round(2147483647 * t);
    case Int16Array:
      return Math.round(32767 * t);
    case Int8Array:
      return Math.round(127 * t);
    default:
      throw new Error("Invalid component type.");
  }
}
let ve = class t {
  constructor(e = 0, n = 0) {
    (t.prototype.isVector2 = !0), (this.x = e), (this.y = n);
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return (this.x = t), (this.y = e), this;
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return (this.x = t.x), (this.y = t.y), this;
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), this;
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), this;
  }
  addVectors(t, e) {
    return (this.x = t.x + e.x), (this.y = t.y + e.y), this;
  }
  addScaledVector(t, e) {
    return (this.x += t.x * e), (this.y += t.y * e), this;
  }
  sub(t) {
    return (this.x -= t.x), (this.y -= t.y), this;
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), this;
  }
  subVectors(t, e) {
    return (this.x = t.x - e.x), (this.y = t.y - e.y), this;
  }
  multiply(t) {
    return (this.x *= t.x), (this.y *= t.y), this;
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), this;
  }
  divide(t) {
    return (this.x /= t.x), (this.y /= t.y), this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      i = t.elements;
    return (
      (this.x = i[0] * e + i[3] * n + i[6]),
      (this.y = i[1] * e + i[4] * n + i[7]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)), (this.y = Math.min(this.y, t.y)), this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)), (this.y = Math.max(this.y, t.y)), this
    );
  }
  clamp(t, e) {
    return (
      (this.x = fe(this.x, t.x, e.x)), (this.y = fe(this.y, t.y, e.y)), this
    );
  }
  clampScalar(t, e) {
    return (this.x = fe(this.x, t, e)), (this.y = fe(this.y, t, e)), this;
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(fe(n, t, e));
  }
  floor() {
    return (this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this;
  }
  ceil() {
    return (this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this;
  }
  round() {
    return (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this;
  }
  roundToZero() {
    return (this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), this;
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (0 === e) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(fe(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (this.x += (t.x - this.x) * e), (this.y += (t.y - this.y) * e), this;
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n), (this.y = t.y + (e.y - t.y) * n), this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return (this.x = t[e]), (this.y = t[e + 1]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.x), (t[e + 1] = this.y), t;
  }
  fromBufferAttribute(t, e) {
    return (this.x = t.getX(e)), (this.y = t.getY(e)), this;
  }
  rotateAround(t, e) {
    const n = Math.cos(e),
      i = Math.sin(e),
      r = this.x - t.x,
      s = this.y - t.y;
    return (this.x = r * n - s * i + t.x), (this.y = r * i + s * n + t.y), this;
  }
  random() {
    return (this.x = Math.random()), (this.y = Math.random()), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
};
class xe {
  constructor(t, e, n, i, r, s, a, o, l) {
    (xe.prototype.isMatrix3 = !0),
      (this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      void 0 !== t && this.set(t, e, n, i, r, s, a, o, l);
  }
  set(t, e, n, i, r, s, a, o, l) {
    const c = this.elements;
    return (
      (c[0] = t),
      (c[1] = i),
      (c[2] = a),
      (c[3] = e),
      (c[4] = r),
      (c[5] = o),
      (c[6] = n),
      (c[7] = s),
      (c[8] = l),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrix3Column(this, 0),
      e.setFromMatrix3Column(this, 1),
      n.setFromMatrix3Column(this, 2),
      this
    );
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return (
      this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      i = e.elements,
      r = this.elements,
      s = n[0],
      a = n[3],
      o = n[6],
      l = n[1],
      c = n[4],
      h = n[7],
      u = n[2],
      d = n[5],
      p = n[8],
      f = i[0],
      m = i[3],
      g = i[6],
      _ = i[1],
      v = i[4],
      x = i[7],
      S = i[2],
      M = i[5],
      E = i[8];
    return (
      (r[0] = s * f + a * _ + o * S),
      (r[3] = s * m + a * v + o * M),
      (r[6] = s * g + a * x + o * E),
      (r[1] = l * f + c * _ + h * S),
      (r[4] = l * m + c * v + h * M),
      (r[7] = l * g + c * x + h * E),
      (r[2] = u * f + d * _ + p * S),
      (r[5] = u * m + d * v + p * M),
      (r[8] = u * g + d * x + p * E),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[3] *= t),
      (e[6] *= t),
      (e[1] *= t),
      (e[4] *= t),
      (e[7] *= t),
      (e[2] *= t),
      (e[5] *= t),
      (e[8] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      i = t[2],
      r = t[3],
      s = t[4],
      a = t[5],
      o = t[6],
      l = t[7],
      c = t[8];
    return (
      e * s * c - e * a * l - n * r * c + n * a * o + i * r * l - i * s * o
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      i = t[2],
      r = t[3],
      s = t[4],
      a = t[5],
      o = t[6],
      l = t[7],
      c = t[8],
      h = c * s - a * l,
      u = a * o - c * r,
      d = l * r - s * o,
      p = e * h + n * u + i * d;
    if (0 === p) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const f = 1 / p;
    return (
      (t[0] = h * f),
      (t[1] = (i * l - c * n) * f),
      (t[2] = (a * n - i * s) * f),
      (t[3] = u * f),
      (t[4] = (c * e - i * o) * f),
      (t[5] = (i * r - a * e) * f),
      (t[6] = d * f),
      (t[7] = (n * o - l * e) * f),
      (t[8] = (s * e - n * r) * f),
      this
    );
  }
  transpose() {
    let t;
    const e = this.elements;
    return (
      (t = e[1]),
      (e[1] = e[3]),
      (e[3] = t),
      (t = e[2]),
      (e[2] = e[6]),
      (e[6] = t),
      (t = e[5]),
      (e[5] = e[7]),
      (e[7] = t),
      this
    );
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return (
      (t[0] = e[0]),
      (t[1] = e[3]),
      (t[2] = e[6]),
      (t[3] = e[1]),
      (t[4] = e[4]),
      (t[5] = e[7]),
      (t[6] = e[2]),
      (t[7] = e[5]),
      (t[8] = e[8]),
      this
    );
  }
  setUvTransform(t, e, n, i, r, s, a) {
    const o = Math.cos(r),
      l = Math.sin(r);
    return (
      this.set(
        n * o,
        n * l,
        -n * (o * s + l * a) + s + t,
        -i * l,
        i * o,
        -i * (-l * s + o * a) + a + e,
        0,
        0,
        1
      ),
      this
    );
  }
  scale(t, e) {
    return this.premultiply(Se.makeScale(t, e)), this;
  }
  rotate(t) {
    return this.premultiply(Se.makeRotation(-t)), this;
  }
  translate(t, e) {
    return this.premultiply(Se.makeTranslation(t, e)), this;
  }
  makeTranslation(t, e) {
    return (
      t.isVector2
        ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1)
        : this.set(1, 0, t, 0, 1, e, 0, 0, 1),
      this
    );
  }
  makeRotation(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this;
  }
  makeScale(t, e) {
    return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this;
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let i = 0; i < 9; i++) if (e[i] !== n[i]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      t
    );
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Se = new xe();
function Me(t) {
  for (let e = t.length - 1; e >= 0; --e) if (t[e] >= 65535) return !0;
  return !1;
}
function Ee(t) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", t);
}
function Te() {
  const t = Ee("canvas");
  return (t.style.display = "block"), t;
}
const ye = {};
function be(t) {
  t in ye || ((ye[t] = !0), console.warn(t));
}
const we = new xe().set(
    0.4123908,
    0.3575843,
    0.1804808,
    0.212639,
    0.7151687,
    0.0721923,
    0.0193308,
    0.1191948,
    0.9505322
  ),
  Ae = new xe().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715
  );
function Ce() {
  const t = {
      enabled: !0,
      workingColorSpace: Yt,
      spaces: {},
      convert: function (t, e, n) {
        return !1 !== this.enabled && e !== n && e && n
          ? (this.spaces[e].transfer === Zt &&
              ((t.r = Pe(t.r)), (t.g = Pe(t.g)), (t.b = Pe(t.b))),
            this.spaces[e].primaries !== this.spaces[n].primaries &&
              (t.applyMatrix3(this.spaces[e].toXYZ),
              t.applyMatrix3(this.spaces[n].fromXYZ)),
            this.spaces[n].transfer === Zt &&
              ((t.r = Ue(t.r)), (t.g = Ue(t.g)), (t.b = Ue(t.b))),
            t)
          : t;
      },
      fromWorkingColorSpace: function (t, e) {
        return this.convert(t, this.workingColorSpace, e);
      },
      toWorkingColorSpace: function (t, e) {
        return this.convert(t, e, this.workingColorSpace);
      },
      getPrimaries: function (t) {
        return this.spaces[t].primaries;
      },
      getTransfer: function (t) {
        return t === jt ? Kt : this.spaces[t].transfer;
      },
      getLuminanceCoefficients: function (t, e = this.workingColorSpace) {
        return t.fromArray(this.spaces[e].luminanceCoefficients);
      },
      define: function (t) {
        Object.assign(this.spaces, t);
      },
      _getMatrix: function (t, e, n) {
        return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ);
      },
      _getDrawingBufferColorSpace: function (t) {
        return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace;
      },
      _getUnpackColorSpace: function (t = this.workingColorSpace) {
        return this.spaces[t].workingColorSpaceConfig.unpackColorSpace;
      },
    },
    e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
    n = [0.2126, 0.7152, 0.0722],
    i = [0.3127, 0.329];
  return (
    t.define({
      [Yt]: {
        primaries: e,
        whitePoint: i,
        transfer: Kt,
        toXYZ: we,
        fromXYZ: Ae,
        luminanceCoefficients: n,
        workingColorSpaceConfig: {
          unpackColorSpace: qt,
        },
        outputColorSpaceConfig: {
          drawingBufferColorSpace: qt,
        },
      },
      [qt]: {
        primaries: e,
        whitePoint: i,
        transfer: Zt,
        toXYZ: we,
        fromXYZ: Ae,
        luminanceCoefficients: n,
        outputColorSpaceConfig: {
          drawingBufferColorSpace: qt,
        },
      },
    }),
    t
  );
}
const Re = Ce();
function Pe(t) {
  return t < 0.04045
    ? 0.0773993808 * t
    : Math.pow(0.9478672986 * t + 0.0521327014, 2.4);
}
function Ue(t) {
  return t < 0.0031308 ? 12.92 * t : 1.055 * Math.pow(t, 0.41666) - 0.055;
}
let Ie;
class Le {
  static getDataURL(t, e = "image/png") {
    if (/^data:/i.test(t.src)) return t.src;
    if ("undefined" == typeof HTMLCanvasElement) return t.src;
    let n;
    if (t instanceof HTMLCanvasElement) n = t;
    else {
      void 0 === Ie && (Ie = Ee("canvas")),
        (Ie.width = t.width),
        (Ie.height = t.height);
      const e = Ie.getContext("2d");
      t instanceof ImageData
        ? e.putImageData(t, 0, 0)
        : e.drawImage(t, 0, 0, t.width, t.height),
        (n = Ie);
    }
    return n.toDataURL(e);
  }
  static sRGBToLinear(t) {
    if (
      ("undefined" != typeof HTMLImageElement &&
        t instanceof HTMLImageElement) ||
      ("undefined" != typeof HTMLCanvasElement &&
        t instanceof HTMLCanvasElement) ||
      ("undefined" != typeof ImageBitmap && t instanceof ImageBitmap)
    ) {
      const e = Ee("canvas");
      (e.width = t.width), (e.height = t.height);
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const i = n.getImageData(0, 0, t.width, t.height),
        r = i.data;
      for (let t = 0; t < r.length; t++) r[t] = 255 * Pe(r[t] / 255);
      return n.putImageData(i, 0, 0), e;
    }
    if (t.data) {
      const e = t.data.slice(0);
      for (let t = 0; t < e.length; t++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray
          ? (e[t] = Math.floor(255 * Pe(e[t] / 255)))
          : (e[t] = Pe(e[t]));
      return {
        data: e,
        width: t.width,
        height: t.height,
      };
    }
    return (
      console.warn(
        "THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."
      ),
      t
    );
  }
}
let De = 0;
class Ne {
  constructor(t = null) {
    (this.isSource = !0),
      Object.defineProperty(this, "id", {
        value: De++,
      }),
      (this.uuid = pe()),
      (this.data = t),
      (this.dataReady = !0),
      (this.version = 0);
  }
  set needsUpdate(t) {
    !0 === t && this.version++;
  }
  toJSON(t) {
    const e = void 0 === t || "string" == typeof t;
    if (!e && void 0 !== t.images[this.uuid]) return t.images[this.uuid];
    const n = {
        uuid: this.uuid,
        url: "",
      },
      i = this.data;
    if (null !== i) {
      let t;
      if (Array.isArray(i)) {
        t = [];
        for (let e = 0, n = i.length; e < n; e++)
          i[e].isDataTexture ? t.push(Oe(i[e].image)) : t.push(Oe(i[e]));
      } else t = Oe(i);
      n.url = t;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function Oe(t) {
  return ("undefined" != typeof HTMLImageElement &&
    t instanceof HTMLImageElement) ||
    ("undefined" != typeof HTMLCanvasElement &&
      t instanceof HTMLCanvasElement) ||
    ("undefined" != typeof ImageBitmap && t instanceof ImageBitmap)
    ? Le.getDataURL(t)
    : t.data
    ? {
        data: Array.from(t.data),
        width: t.width,
        height: t.height,
        type: t.data.constructor.name,
      }
    : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Fe = 0;
class Be extends ce {
  constructor(
    t = Be.DEFAULT_IMAGE,
    e = Be.DEFAULT_MAPPING,
    n = 1001,
    i = 1001,
    r = 1006,
    s = 1008,
    a = 1023,
    o = 1009,
    l = Be.DEFAULT_ANISOTROPY,
    c = ""
  ) {
    super(),
      (this.isTexture = !0),
      Object.defineProperty(this, "id", {
        value: Fe++,
      }),
      (this.uuid = pe()),
      (this.name = ""),
      (this.source = new Ne(t)),
      (this.mipmaps = []),
      (this.mapping = e),
      (this.channel = 0),
      (this.wrapS = n),
      (this.wrapT = i),
      (this.magFilter = r),
      (this.minFilter = s),
      (this.anisotropy = l),
      (this.format = a),
      (this.internalFormat = null),
      (this.type = o),
      (this.offset = new ve(0, 0)),
      (this.repeat = new ve(1, 1)),
      (this.center = new ve(0, 0)),
      (this.rotation = 0),
      (this.matrixAutoUpdate = !0),
      (this.matrix = new xe()),
      (this.generateMipmaps = !0),
      (this.premultiplyAlpha = !1),
      (this.flipY = !0),
      (this.unpackAlignment = 4),
      (this.colorSpace = c),
      (this.userData = {}),
      (this.version = 0),
      (this.onUpdate = null),
      (this.renderTarget = null),
      (this.isRenderTargetTexture = !1),
      (this.pmremVersion = 0);
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(
      this.offset.x,
      this.offset.y,
      this.repeat.x,
      this.repeat.y,
      this.rotation,
      this.center.x,
      this.center.y
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.source = t.source),
      (this.mipmaps = t.mipmaps.slice(0)),
      (this.mapping = t.mapping),
      (this.channel = t.channel),
      (this.wrapS = t.wrapS),
      (this.wrapT = t.wrapT),
      (this.magFilter = t.magFilter),
      (this.minFilter = t.minFilter),
      (this.anisotropy = t.anisotropy),
      (this.format = t.format),
      (this.internalFormat = t.internalFormat),
      (this.type = t.type),
      this.offset.copy(t.offset),
      this.repeat.copy(t.repeat),
      this.center.copy(t.center),
      (this.rotation = t.rotation),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this.matrix.copy(t.matrix),
      (this.generateMipmaps = t.generateMipmaps),
      (this.premultiplyAlpha = t.premultiplyAlpha),
      (this.flipY = t.flipY),
      (this.unpackAlignment = t.unpackAlignment),
      (this.colorSpace = t.colorSpace),
      (this.renderTarget = t.renderTarget),
      (this.isRenderTargetTexture = t.isRenderTargetTexture),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      (this.needsUpdate = !0),
      this
    );
  }
  toJSON(t) {
    const e = void 0 === t || "string" == typeof t;
    if (!e && void 0 !== t.textures[this.uuid]) return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON",
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment,
    };
    return (
      Object.keys(this.userData).length > 0 && (n.userData = this.userData),
      e || (t.textures[this.uuid] = n),
      n
    );
  }
  dispose() {
    this.dispatchEvent({
      type: "dispose",
    });
  }
  transformUv(t) {
    if (300 !== this.mapping) return t;
    if ((t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1))
      switch (this.wrapS) {
        case k:
          t.x = t.x - Math.floor(t.x);
          break;
        case V:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case W:
          1 === Math.abs(Math.floor(t.x) % 2)
            ? (t.x = Math.ceil(t.x) - t.x)
            : (t.x = t.x - Math.floor(t.x));
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case k:
          t.y = t.y - Math.floor(t.y);
          break;
        case V:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case W:
          1 === Math.abs(Math.floor(t.y) % 2)
            ? (t.y = Math.ceil(t.y) - t.y)
            : (t.y = t.y - Math.floor(t.y));
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  set needsUpdate(t) {
    !0 === t && (this.version++, (this.source.needsUpdate = !0));
  }
  set needsPMREMUpdate(t) {
    !0 === t && this.pmremVersion++;
  }
}
(Be.DEFAULT_IMAGE = null),
  (Be.DEFAULT_MAPPING = 300),
  (Be.DEFAULT_ANISOTROPY = 1);
class ze {
  constructor(t = 0, e = 0, n = 0, i = 1) {
    (ze.prototype.isVector4 = !0),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      (this.w = i);
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, i) {
    return (this.x = t), (this.y = e), (this.z = n), (this.w = i), this;
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), (this.z = t), (this.w = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setZ(t) {
    return (this.z = t), this;
  }
  setW(t) {
    return (this.w = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return (
      (this.x = t.x),
      (this.y = t.y),
      (this.z = t.z),
      (this.w = void 0 !== t.w ? t.w : 1),
      this
    );
  }
  add(t) {
    return (
      (this.x += t.x), (this.y += t.y), (this.z += t.z), (this.w += t.w), this
    );
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), (this.z += t), (this.w += t), this;
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x),
      (this.y = t.y + e.y),
      (this.z = t.z + e.z),
      (this.w = t.w + e.w),
      this
    );
  }
  addScaledVector(t, e) {
    return (
      (this.x += t.x * e),
      (this.y += t.y * e),
      (this.z += t.z * e),
      (this.w += t.w * e),
      this
    );
  }
  sub(t) {
    return (
      (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), (this.w -= t.w), this
    );
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), (this.z -= t), (this.w -= t), this;
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x),
      (this.y = t.y - e.y),
      (this.z = t.z - e.z),
      (this.w = t.w - e.w),
      this
    );
  }
  multiply(t) {
    return (
      (this.x *= t.x), (this.y *= t.y), (this.z *= t.z), (this.w *= t.w), this
    );
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), (this.z *= t), (this.w *= t), this;
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      i = this.z,
      r = this.w,
      s = t.elements;
    return (
      (this.x = s[0] * e + s[4] * n + s[8] * i + s[12] * r),
      (this.y = s[1] * e + s[5] * n + s[9] * i + s[13] * r),
      (this.z = s[2] * e + s[6] * n + s[10] * i + s[14] * r),
      (this.w = s[3] * e + s[7] * n + s[11] * i + s[15] * r),
      this
    );
  }
  divide(t) {
    return (
      (this.x /= t.x), (this.y /= t.y), (this.z /= t.z), (this.w /= t.w), this
    );
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return (
      e < 1e-4
        ? ((this.x = 1), (this.y = 0), (this.z = 0))
        : ((this.x = t.x / e), (this.y = t.y / e), (this.z = t.z / e)),
      this
    );
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, i, r;
    const s = 0.01,
      a = 0.1,
      o = t.elements,
      l = o[0],
      c = o[4],
      h = o[8],
      u = o[1],
      d = o[5],
      p = o[9],
      f = o[2],
      m = o[6],
      g = o[10];
    if (Math.abs(c - u) < s && Math.abs(h - f) < s && Math.abs(p - m) < s) {
      if (
        Math.abs(c + u) < a &&
        Math.abs(h + f) < a &&
        Math.abs(p + m) < a &&
        Math.abs(l + d + g - 3) < a
      )
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const t = (l + 1) / 2,
        o = (d + 1) / 2,
        _ = (g + 1) / 2,
        v = (c + u) / 4,
        x = (h + f) / 4,
        S = (p + m) / 4;
      return (
        t > o && t > _
          ? t < s
            ? ((n = 0), (i = 0.707106781), (r = 0.707106781))
            : ((n = Math.sqrt(t)), (i = v / n), (r = x / n))
          : o > _
          ? o < s
            ? ((n = 0.707106781), (i = 0), (r = 0.707106781))
            : ((i = Math.sqrt(o)), (n = v / i), (r = S / i))
          : _ < s
          ? ((n = 0.707106781), (i = 0.707106781), (r = 0))
          : ((r = Math.sqrt(_)), (n = x / r), (i = S / r)),
        this.set(n, i, r, e),
        this
      );
    }
    let _ = Math.sqrt(
      (m - p) * (m - p) + (h - f) * (h - f) + (u - c) * (u - c)
    );
    return (
      Math.abs(_) < 0.001 && (_ = 1),
      (this.x = (m - p) / _),
      (this.y = (h - f) / _),
      (this.z = (u - c) / _),
      (this.w = Math.acos((l + d + g - 1) / 2)),
      this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return (
      (this.x = e[12]),
      (this.y = e[13]),
      (this.z = e[14]),
      (this.w = e[15]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      (this.w = Math.min(this.w, t.w)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      (this.w = Math.max(this.w, t.w)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = fe(this.x, t.x, e.x)),
      (this.y = fe(this.y, t.y, e.y)),
      (this.z = fe(this.z, t.z, e.z)),
      (this.w = fe(this.w, t.w, e.w)),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = fe(this.x, t, e)),
      (this.y = fe(this.y, t, e)),
      (this.z = fe(this.z, t, e)),
      (this.w = fe(this.w, t, e)),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(fe(n, t, e));
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      (this.w = Math.floor(this.w)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      (this.w = Math.ceil(this.w)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      (this.w = Math.round(this.w)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      (this.w = Math.trunc(this.w)),
      this
    );
  }
  negate() {
    return (
      (this.x = -this.x),
      (this.y = -this.y),
      (this.z = -this.z),
      (this.w = -this.w),
      this
    );
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  manhattanLength() {
    return (
      Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
    );
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      (this.w += (t.w - this.w) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      (this.w = t.w + (e.w - t.w) * n),
      this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return (
      (this.x = t[e]),
      (this.y = t[e + 1]),
      (this.z = t[e + 2]),
      (this.w = t[e + 3]),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this.x),
      (t[e + 1] = this.y),
      (t[e + 2] = this.z),
      (t[e + 3] = this.w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)),
      (this.y = t.getY(e)),
      (this.z = t.getZ(e)),
      (this.w = t.getW(e)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      (this.w = Math.random()),
      this
    );
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class Ge extends ce {
  constructor(t = 1, e = 1, n = {}) {
    super(),
      (this.isRenderTarget = !0),
      (this.width = t),
      (this.height = e),
      (this.depth = 1),
      (this.scissor = new ze(0, 0, t, e)),
      (this.scissorTest = !1),
      (this.viewport = new ze(0, 0, t, e));
    const i = {
      width: t,
      height: e,
      depth: 1,
    };
    n = Object.assign(
      {
        generateMipmaps: !1,
        internalFormat: null,
        minFilter: Y,
        depthBuffer: !0,
        stencilBuffer: !1,
        resolveDepthBuffer: !0,
        resolveStencilBuffer: !0,
        depthTexture: null,
        samples: 0,
        count: 1,
      },
      n
    );
    const r = new Be(
      i,
      n.mapping,
      n.wrapS,
      n.wrapT,
      n.magFilter,
      n.minFilter,
      n.format,
      n.type,
      n.anisotropy,
      n.colorSpace
    );
    (r.flipY = !1),
      (r.generateMipmaps = n.generateMipmaps),
      (r.internalFormat = n.internalFormat),
      (this.textures = []);
    const s = n.count;
    for (let a = 0; a < s; a++)
      (this.textures[a] = r.clone()),
        (this.textures[a].isRenderTargetTexture = !0),
        (this.textures[a].renderTarget = this);
    (this.depthBuffer = n.depthBuffer),
      (this.stencilBuffer = n.stencilBuffer),
      (this.resolveDepthBuffer = n.resolveDepthBuffer),
      (this.resolveStencilBuffer = n.resolveStencilBuffer),
      (this._depthTexture = n.depthTexture),
      (this.samples = n.samples);
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  set depthTexture(t) {
    null !== this._depthTexture && (this._depthTexture.renderTarget = null),
      null !== t && (t.renderTarget = this),
      (this._depthTexture = t);
  }
  get depthTexture() {
    return this._depthTexture;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      (this.width = t), (this.height = e), (this.depth = n);
      for (let i = 0, r = this.textures.length; i < r; i++)
        (this.textures[i].image.width = t),
          (this.textures[i].image.height = e),
          (this.textures[i].image.depth = n);
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.width = t.width),
      (this.height = t.height),
      (this.depth = t.depth),
      this.scissor.copy(t.scissor),
      (this.scissorTest = t.scissorTest),
      this.viewport.copy(t.viewport),
      (this.textures.length = 0);
    for (let e = 0, n = t.textures.length; e < n; e++) {
      (this.textures[e] = t.textures[e].clone()),
        (this.textures[e].isRenderTargetTexture = !0),
        (this.textures[e].renderTarget = this);
      const n = Object.assign({}, t.textures[e].image);
      this.textures[e].source = new Ne(n);
    }
    return (
      (this.depthBuffer = t.depthBuffer),
      (this.stencilBuffer = t.stencilBuffer),
      (this.resolveDepthBuffer = t.resolveDepthBuffer),
      (this.resolveStencilBuffer = t.resolveStencilBuffer),
      null !== t.depthTexture && (this.depthTexture = t.depthTexture.clone()),
      (this.samples = t.samples),
      this
    );
  }
  dispose() {
    this.dispatchEvent({
      type: "dispose",
    });
  }
}
class He extends Ge {
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), (this.isWebGLRenderTarget = !0);
  }
}
class ke extends Be {
  constructor(t = null, e = 1, n = 1, i = 1) {
    super(null),
      (this.isDataArrayTexture = !0),
      (this.image = {
        data: t,
        width: e,
        height: n,
        depth: i,
      }),
      (this.magFilter = X),
      (this.minFilter = X),
      (this.wrapR = V),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1),
      (this.layerUpdates = new Set());
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class Ve extends Be {
  constructor(t = null, e = 1, n = 1, i = 1) {
    super(null),
      (this.isData3DTexture = !0),
      (this.image = {
        data: t,
        width: e,
        height: n,
        depth: i,
      }),
      (this.magFilter = X),
      (this.minFilter = X),
      (this.wrapR = V),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1);
  }
}
class We {
  constructor(t = 0, e = 0, n = 0, i = 1) {
    (this.isQuaternion = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = i);
  }
  static slerpFlat(t, e, n, i, r, s, a) {
    let o = n[i + 0],
      l = n[i + 1],
      c = n[i + 2],
      h = n[i + 3];
    const u = r[s + 0],
      d = r[s + 1],
      p = r[s + 2],
      f = r[s + 3];
    if (0 === a)
      return (
        (t[e + 0] = o), (t[e + 1] = l), (t[e + 2] = c), void (t[e + 3] = h)
      );
    if (1 === a)
      return (
        (t[e + 0] = u), (t[e + 1] = d), (t[e + 2] = p), void (t[e + 3] = f)
      );
    if (h !== f || o !== u || l !== d || c !== p) {
      let t = 1 - a;
      const e = o * u + l * d + c * p + h * f,
        n = e >= 0 ? 1 : -1,
        i = 1 - e * e;
      if (i > Number.EPSILON) {
        const r = Math.sqrt(i),
          s = Math.atan2(r, e * n);
        (t = Math.sin(t * s) / r), (a = Math.sin(a * s) / r);
      }
      const r = a * n;
      if (
        ((o = o * t + u * r),
        (l = l * t + d * r),
        (c = c * t + p * r),
        (h = h * t + f * r),
        t === 1 - a)
      ) {
        const t = 1 / Math.sqrt(o * o + l * l + c * c + h * h);
        (o *= t), (l *= t), (c *= t), (h *= t);
      }
    }
    (t[e] = o), (t[e + 1] = l), (t[e + 2] = c), (t[e + 3] = h);
  }
  static multiplyQuaternionsFlat(t, e, n, i, r, s) {
    const a = n[i],
      o = n[i + 1],
      l = n[i + 2],
      c = n[i + 3],
      h = r[s],
      u = r[s + 1],
      d = r[s + 2],
      p = r[s + 3];
    return (
      (t[e] = a * p + c * h + o * d - l * u),
      (t[e + 1] = o * p + c * u + l * h - a * d),
      (t[e + 2] = l * p + c * d + a * u - o * h),
      (t[e + 3] = c * p - a * h - o * u - l * d),
      t
    );
  }
  get x() {
    return this._x;
  }
  set x(t) {
    (this._x = t), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    (this._y = t), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    (this._z = t), this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(t) {
    (this._w = t), this._onChangeCallback();
  }
  set(t, e, n, i) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = i),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return (
      (this._x = t.x),
      (this._y = t.y),
      (this._z = t.z),
      (this._w = t.w),
      this._onChangeCallback(),
      this
    );
  }
  setFromEuler(t, e = !0) {
    const n = t._x,
      i = t._y,
      r = t._z,
      s = t._order,
      a = Math.cos,
      o = Math.sin,
      l = a(n / 2),
      c = a(i / 2),
      h = a(r / 2),
      u = o(n / 2),
      d = o(i / 2),
      p = o(r / 2);
    switch (s) {
      case "XYZ":
        (this._x = u * c * h + l * d * p),
          (this._y = l * d * h - u * c * p),
          (this._z = l * c * p + u * d * h),
          (this._w = l * c * h - u * d * p);
        break;
      case "YXZ":
        (this._x = u * c * h + l * d * p),
          (this._y = l * d * h - u * c * p),
          (this._z = l * c * p - u * d * h),
          (this._w = l * c * h + u * d * p);
        break;
      case "ZXY":
        (this._x = u * c * h - l * d * p),
          (this._y = l * d * h + u * c * p),
          (this._z = l * c * p + u * d * h),
          (this._w = l * c * h - u * d * p);
        break;
      case "ZYX":
        (this._x = u * c * h - l * d * p),
          (this._y = l * d * h + u * c * p),
          (this._z = l * c * p - u * d * h),
          (this._w = l * c * h + u * d * p);
        break;
      case "YZX":
        (this._x = u * c * h + l * d * p),
          (this._y = l * d * h + u * c * p),
          (this._z = l * c * p - u * d * h),
          (this._w = l * c * h - u * d * p);
        break;
      case "XZY":
        (this._x = u * c * h - l * d * p),
          (this._y = l * d * h - u * c * p),
          (this._z = l * c * p + u * d * h),
          (this._w = l * c * h + u * d * p);
        break;
      default:
        console.warn(
          "THREE.Quaternion: .setFromEuler() encountered an unknown order: " + s
        );
    }
    return !0 === e && this._onChangeCallback(), this;
  }
  setFromAxisAngle(t, e) {
    const n = e / 2,
      i = Math.sin(n);
    return (
      (this._x = t.x * i),
      (this._y = t.y * i),
      (this._z = t.z * i),
      (this._w = Math.cos(n)),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t) {
    const e = t.elements,
      n = e[0],
      i = e[4],
      r = e[8],
      s = e[1],
      a = e[5],
      o = e[9],
      l = e[2],
      c = e[6],
      h = e[10],
      u = n + a + h;
    if (u > 0) {
      const t = 0.5 / Math.sqrt(u + 1);
      (this._w = 0.25 / t),
        (this._x = (c - o) * t),
        (this._y = (r - l) * t),
        (this._z = (s - i) * t);
    } else if (n > a && n > h) {
      const t = 2 * Math.sqrt(1 + n - a - h);
      (this._w = (c - o) / t),
        (this._x = 0.25 * t),
        (this._y = (i + s) / t),
        (this._z = (r + l) / t);
    } else if (a > h) {
      const t = 2 * Math.sqrt(1 + a - n - h);
      (this._w = (r - l) / t),
        (this._x = (i + s) / t),
        (this._y = 0.25 * t),
        (this._z = (o + c) / t);
    } else {
      const t = 2 * Math.sqrt(1 + h - n - a);
      (this._w = (s - i) / t),
        (this._x = (r + l) / t),
        (this._y = (o + c) / t),
        (this._z = 0.25 * t);
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return (
      n < Number.EPSILON
        ? ((n = 0),
          Math.abs(t.x) > Math.abs(t.z)
            ? ((this._x = -t.y), (this._y = t.x), (this._z = 0), (this._w = n))
            : ((this._x = 0), (this._y = -t.z), (this._z = t.y), (this._w = n)))
        : ((this._x = t.y * e.z - t.z * e.y),
          (this._y = t.z * e.x - t.x * e.z),
          (this._z = t.x * e.y - t.y * e.x),
          (this._w = n)),
      this.normalize()
    );
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(fe(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (0 === n) return this;
    const i = Math.min(1, e / n);
    return this.slerp(t, i), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return (
      (this._x *= -1),
      (this._y *= -1),
      (this._z *= -1),
      this._onChangeCallback(),
      this
    );
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }
  length() {
    return Math.sqrt(
      this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w
    );
  }
  normalize() {
    let t = this.length();
    return (
      0 === t
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((t = 1 / t),
          (this._x = this._x * t),
          (this._y = this._y * t),
          (this._z = this._z * t),
          (this._w = this._w * t)),
      this._onChangeCallback(),
      this
    );
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x,
      i = t._y,
      r = t._z,
      s = t._w,
      a = e._x,
      o = e._y,
      l = e._z,
      c = e._w;
    return (
      (this._x = n * c + s * a + i * l - r * o),
      (this._y = i * c + s * o + r * a - n * l),
      (this._z = r * c + s * l + n * o - i * a),
      (this._w = s * c - n * a - i * o - r * l),
      this._onChangeCallback(),
      this
    );
  }
  slerp(t, e) {
    if (0 === e) return this;
    if (1 === e) return this.copy(t);
    const n = this._x,
      i = this._y,
      r = this._z,
      s = this._w;
    let a = s * t._w + n * t._x + i * t._y + r * t._z;
    if (
      (a < 0
        ? ((this._w = -t._w),
          (this._x = -t._x),
          (this._y = -t._y),
          (this._z = -t._z),
          (a = -a))
        : this.copy(t),
      a >= 1)
    )
      return (this._w = s), (this._x = n), (this._y = i), (this._z = r), this;
    const o = 1 - a * a;
    if (o <= Number.EPSILON) {
      const t = 1 - e;
      return (
        (this._w = t * s + e * this._w),
        (this._x = t * n + e * this._x),
        (this._y = t * i + e * this._y),
        (this._z = t * r + e * this._z),
        this.normalize(),
        this
      );
    }
    const l = Math.sqrt(o),
      c = Math.atan2(l, a),
      h = Math.sin((1 - e) * c) / l,
      u = Math.sin(e * c) / l;
    return (
      (this._w = s * h + this._w * u),
      (this._x = n * h + this._x * u),
      (this._y = i * h + this._y * u),
      (this._z = r * h + this._z * u),
      this._onChangeCallback(),
      this
    );
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(),
      e = 2 * Math.PI * Math.random(),
      n = Math.random(),
      i = Math.sqrt(1 - n),
      r = Math.sqrt(n);
    return this.set(
      i * Math.sin(t),
      i * Math.cos(t),
      r * Math.sin(e),
      r * Math.cos(e)
    );
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._w === this._w
    );
  }
  fromArray(t, e = 0) {
    return (
      (this._x = t[e]),
      (this._y = t[e + 1]),
      (this._z = t[e + 2]),
      (this._w = t[e + 3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this._x = t.getX(e)),
      (this._y = t.getY(e)),
      (this._z = t.getZ(e)),
      (this._w = t.getW(e)),
      this._onChangeCallback(),
      this
    );
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return (this._onChangeCallback = t), this;
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
let Xe = class t {
  constructor(e = 0, n = 0, i = 0) {
    (t.prototype.isVector3 = !0), (this.x = e), (this.y = n), (this.z = i);
  }
  set(t, e, n) {
    return (
      void 0 === n && (n = this.z),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      this
    );
  }
  setScalar(t) {
    return (this.x = t), (this.y = t), (this.z = t), this;
  }
  setX(t) {
    return (this.x = t), this;
  }
  setY(t) {
    return (this.y = t), this;
  }
  setZ(t) {
    return (this.z = t), this;
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return (this.x = t.x), (this.y = t.y), (this.z = t.z), this;
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), (this.z += t.z), this;
  }
  addScalar(t) {
    return (this.x += t), (this.y += t), (this.z += t), this;
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x), (this.y = t.y + e.y), (this.z = t.z + e.z), this
    );
  }
  addScaledVector(t, e) {
    return (this.x += t.x * e), (this.y += t.y * e), (this.z += t.z * e), this;
  }
  sub(t) {
    return (this.x -= t.x), (this.y -= t.y), (this.z -= t.z), this;
  }
  subScalar(t) {
    return (this.x -= t), (this.y -= t), (this.z -= t), this;
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x), (this.y = t.y - e.y), (this.z = t.z - e.z), this
    );
  }
  multiply(t) {
    return (this.x *= t.x), (this.y *= t.y), (this.z *= t.z), this;
  }
  multiplyScalar(t) {
    return (this.x *= t), (this.y *= t), (this.z *= t), this;
  }
  multiplyVectors(t, e) {
    return (
      (this.x = t.x * e.x), (this.y = t.y * e.y), (this.z = t.z * e.z), this
    );
  }
  applyEuler(t) {
    return this.applyQuaternion(qe.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(qe.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      i = this.z,
      r = t.elements;
    return (
      (this.x = r[0] * e + r[3] * n + r[6] * i),
      (this.y = r[1] * e + r[4] * n + r[7] * i),
      (this.z = r[2] * e + r[5] * n + r[8] * i),
      this
    );
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      i = this.z,
      r = t.elements,
      s = 1 / (r[3] * e + r[7] * n + r[11] * i + r[15]);
    return (
      (this.x = (r[0] * e + r[4] * n + r[8] * i + r[12]) * s),
      (this.y = (r[1] * e + r[5] * n + r[9] * i + r[13]) * s),
      (this.z = (r[2] * e + r[6] * n + r[10] * i + r[14]) * s),
      this
    );
  }
  applyQuaternion(t) {
    const e = this.x,
      n = this.y,
      i = this.z,
      r = t.x,
      s = t.y,
      a = t.z,
      o = t.w,
      l = 2 * (s * i - a * n),
      c = 2 * (a * e - r * i),
      h = 2 * (r * n - s * e);
    return (
      (this.x = e + o * l + s * h - a * c),
      (this.y = n + o * c + a * l - r * h),
      (this.z = i + o * h + r * c - s * l),
      this
    );
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
      t.projectionMatrix
    );
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(
      t.matrixWorld
    );
  }
  transformDirection(t) {
    const e = this.x,
      n = this.y,
      i = this.z,
      r = t.elements;
    return (
      (this.x = r[0] * e + r[4] * n + r[8] * i),
      (this.y = r[1] * e + r[5] * n + r[9] * i),
      (this.z = r[2] * e + r[6] * n + r[10] * i),
      this.normalize()
    );
  }
  divide(t) {
    return (this.x /= t.x), (this.y /= t.y), (this.z /= t.z), this;
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = fe(this.x, t.x, e.x)),
      (this.y = fe(this.y, t.y, e.y)),
      (this.z = fe(this.z, t.z, e.z)),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = fe(this.x, t, e)),
      (this.y = fe(this.y, t, e)),
      (this.z = fe(this.z, t, e)),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(fe(n, t, e));
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      this
    );
  }
  negate() {
    return (this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this;
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      this
    );
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x,
      i = t.y,
      r = t.z,
      s = e.x,
      a = e.y,
      o = e.z;
    return (
      (this.x = i * o - r * a),
      (this.y = r * s - n * o),
      (this.z = n * a - i * s),
      this
    );
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (0 === e) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return je.copy(this).projectOnVector(t), this.sub(je);
  }
  reflect(t) {
    return this.sub(je.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (0 === e) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(fe(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y,
      i = this.z - t.z;
    return e * e + n * n + i * i;
  }
  manhattanDistanceTo(t) {
    return (
      Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z)
    );
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const i = Math.sin(e) * t;
    return (
      (this.x = i * Math.sin(n)),
      (this.y = Math.cos(e) * t),
      (this.z = i * Math.cos(n)),
      this
    );
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return (
      (this.x = t * Math.sin(e)), (this.y = n), (this.z = t * Math.cos(e)), this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return (this.x = e[12]), (this.y = e[13]), (this.z = e[14]), this;
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(),
      n = this.setFromMatrixColumn(t, 1).length(),
      i = this.setFromMatrixColumn(t, 2).length();
    return (this.x = e), (this.y = n), (this.z = i), this;
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, 4 * e);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, 3 * e);
  }
  setFromEuler(t) {
    return (this.x = t._x), (this.y = t._y), (this.z = t._z), this;
  }
  setFromColor(t) {
    return (this.x = t.r), (this.y = t.g), (this.z = t.b), this;
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return (this.x = t[e]), (this.y = t[e + 1]), (this.z = t[e + 2]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.x), (t[e + 1] = this.y), (t[e + 2] = this.z), t;
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)), (this.y = t.getY(e)), (this.z = t.getZ(e)), this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      this
    );
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2,
      e = 2 * Math.random() - 1,
      n = Math.sqrt(1 - e * e);
    return (
      (this.x = n * Math.cos(t)), (this.y = e), (this.z = n * Math.sin(t)), this
    );
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
};
const je = new Xe(),
  qe = new We();
class Ye {
  constructor(
    t = new Xe(1 / 0, 1 / 0, 1 / 0),
    e = new Xe(-1 / 0, -1 / 0, -1 / 0)
  ) {
    (this.isBox3 = !0), (this.min = t), (this.max = e);
  }
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(Ze.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(Ze.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = Ze.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = this.min.z = 1 / 0),
      (this.max.x = this.max.y = this.max.z = -1 / 0),
      this
    );
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  getCenter(t) {
    return this.isEmpty()
      ? t.set(0, 0, 0)
      : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (void 0 !== n) {
      const i = n.getAttribute("position");
      if (!0 === e && void 0 !== i && !0 !== t.isInstancedMesh)
        for (let e = 0, n = i.count; e < n; e++)
          !0 === t.isMesh
            ? t.getVertexPosition(e, Ze)
            : Ze.fromBufferAttribute(i, e),
            Ze.applyMatrix4(t.matrixWorld),
            this.expandByPoint(Ze);
      else
        void 0 !== t.boundingBox
          ? (null === t.boundingBox && t.computeBoundingBox(),
            Je.copy(t.boundingBox))
          : (null === n.boundingBox && n.computeBoundingBox(),
            Je.copy(n.boundingBox)),
          Je.applyMatrix4(t.matrixWorld),
          this.union(Je);
    }
    const i = t.children;
    for (let r = 0, s = i.length; r < s; r++) this.expandByObject(i[r], e);
    return this;
  }
  containsPoint(t) {
    return (
      t.x >= this.min.x &&
      t.x <= this.max.x &&
      t.y >= this.min.y &&
      t.y <= this.max.y &&
      t.z >= this.min.z &&
      t.z <= this.max.z
    );
  }
  containsBox(t) {
    return (
      this.min.x <= t.min.x &&
      t.max.x <= this.max.x &&
      this.min.y <= t.min.y &&
      t.max.y <= this.max.y &&
      this.min.z <= t.min.z &&
      t.max.z <= this.max.z
    );
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(t) {
    return (
      t.max.x >= this.min.x &&
      t.min.x <= this.max.x &&
      t.max.y >= this.min.y &&
      t.min.y <= this.max.y &&
      t.max.z >= this.min.z &&
      t.min.z <= this.max.z
    );
  }
  intersectsSphere(t) {
    return (
      this.clampPoint(t.center, Ze),
      Ze.distanceToSquared(t.center) <= t.radius * t.radius
    );
  }
  intersectsPlane(t) {
    let e, n;
    return (
      t.normal.x > 0
        ? ((e = t.normal.x * this.min.x), (n = t.normal.x * this.max.x))
        : ((e = t.normal.x * this.max.x), (n = t.normal.x * this.min.x)),
      t.normal.y > 0
        ? ((e += t.normal.y * this.min.y), (n += t.normal.y * this.max.y))
        : ((e += t.normal.y * this.max.y), (n += t.normal.y * this.min.y)),
      t.normal.z > 0
        ? ((e += t.normal.z * this.min.z), (n += t.normal.z * this.max.z))
        : ((e += t.normal.z * this.max.z), (n += t.normal.z * this.min.z)),
      e <= -t.constant && n >= -t.constant
    );
  }
  intersectsTriangle(t) {
    if (this.isEmpty()) return !1;
    this.getCenter(sn),
      an.subVectors(this.max, sn),
      $e.subVectors(t.a, sn),
      Qe.subVectors(t.b, sn),
      tn.subVectors(t.c, sn),
      en.subVectors(Qe, $e),
      nn.subVectors(tn, Qe),
      rn.subVectors($e, tn);
    let e = [
      0,
      -en.z,
      en.y,
      0,
      -nn.z,
      nn.y,
      0,
      -rn.z,
      rn.y,
      en.z,
      0,
      -en.x,
      nn.z,
      0,
      -nn.x,
      rn.z,
      0,
      -rn.x,
      -en.y,
      en.x,
      0,
      -nn.y,
      nn.x,
      0,
      -rn.y,
      rn.x,
      0,
    ];
    return (
      !!cn(e, $e, Qe, tn, an) &&
      ((e = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      !!cn(e, $e, Qe, tn, an) &&
        (on.crossVectors(en, nn),
        (e = [on.x, on.y, on.z]),
        cn(e, $e, Qe, tn, an)))
    );
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, Ze).distanceTo(t);
  }
  getBoundingSphere(t) {
    return (
      this.isEmpty()
        ? t.makeEmpty()
        : (this.getCenter(t.center),
          (t.radius = 0.5 * this.getSize(Ze).length())),
      t
    );
  }
  intersect(t) {
    return (
      this.min.max(t.min),
      this.max.min(t.max),
      this.isEmpty() && this.makeEmpty(),
      this
    );
  }
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  applyMatrix4(t) {
    return (
      this.isEmpty() ||
        (Ke[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t),
        Ke[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t),
        Ke[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t),
        Ke[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t),
        Ke[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t),
        Ke[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t),
        Ke[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t),
        Ke[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t),
        this.setFromPoints(Ke)),
      this
    );
  }
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const Ke = [
    new Xe(),
    new Xe(),
    new Xe(),
    new Xe(),
    new Xe(),
    new Xe(),
    new Xe(),
    new Xe(),
  ],
  Ze = new Xe(),
  Je = new Ye(),
  $e = new Xe(),
  Qe = new Xe(),
  tn = new Xe(),
  en = new Xe(),
  nn = new Xe(),
  rn = new Xe(),
  sn = new Xe(),
  an = new Xe(),
  on = new Xe(),
  ln = new Xe();
function cn(t, e, n, i, r) {
  for (let s = 0, a = t.length - 3; s <= a; s += 3) {
    ln.fromArray(t, s);
    const a =
        r.x * Math.abs(ln.x) + r.y * Math.abs(ln.y) + r.z * Math.abs(ln.z),
      o = e.dot(ln),
      l = n.dot(ln),
      c = i.dot(ln);
    if (Math.max(-Math.max(o, l, c), Math.min(o, l, c)) > a) return !1;
  }
  return !0;
}
const hn = new Ye(),
  un = new Xe(),
  dn = new Xe();
class pn {
  constructor(t = new Xe(), e = -1) {
    (this.isSphere = !0), (this.center = t), (this.radius = e);
  }
  set(t, e) {
    return this.center.copy(t), (this.radius = e), this;
  }
  setFromPoints(t, e) {
    const n = this.center;
    void 0 !== e ? n.copy(e) : hn.setFromPoints(t).getCenter(n);
    let i = 0;
    for (let r = 0, s = t.length; r < s; r++)
      i = Math.max(i, n.distanceToSquared(t[r]));
    return (this.radius = Math.sqrt(i)), this;
  }
  copy(t) {
    return this.center.copy(t.center), (this.radius = t.radius), this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), (this.radius = -1), this;
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return (
      e.copy(t),
      n > this.radius * this.radius &&
        (e.sub(this.center).normalize(),
        e.multiplyScalar(this.radius).add(this.center)),
      e
    );
  }
  getBoundingBox(t) {
    return this.isEmpty()
      ? (t.makeEmpty(), t)
      : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return (
      this.center.applyMatrix4(t),
      (this.radius = this.radius * t.getMaxScaleOnAxis()),
      this
    );
  }
  translate(t) {
    return this.center.add(t), this;
  }
  expandByPoint(t) {
    if (this.isEmpty()) return this.center.copy(t), (this.radius = 0), this;
    un.subVectors(t, this.center);
    const e = un.lengthSq();
    if (e > this.radius * this.radius) {
      const t = Math.sqrt(e),
        n = 0.5 * (t - this.radius);
      this.center.addScaledVector(un, n / t), (this.radius += n);
    }
    return this;
  }
  union(t) {
    return t.isEmpty()
      ? this
      : this.isEmpty()
      ? (this.copy(t), this)
      : (!0 === this.center.equals(t.center)
          ? (this.radius = Math.max(this.radius, t.radius))
          : (dn.subVectors(t.center, this.center).setLength(t.radius),
            this.expandByPoint(un.copy(t.center).add(dn)),
            this.expandByPoint(un.copy(t.center).sub(dn))),
        this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const fn = new Xe(),
  mn = new Xe(),
  gn = new Xe(),
  _n = new Xe(),
  vn = new Xe(),
  xn = new Xe(),
  Sn = new Xe();
class Mn {
  constructor(t = new Xe(), e = new Xe(0, 0, -1)) {
    (this.origin = t), (this.direction = e);
  }
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  recast(t) {
    return this.origin.copy(this.at(t, fn)), this;
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0
      ? e.copy(this.origin)
      : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = fn.subVectors(t, this.origin).dot(this.direction);
    return e < 0
      ? this.origin.distanceToSquared(t)
      : (fn.copy(this.origin).addScaledVector(this.direction, e),
        fn.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, i) {
    mn.copy(t).add(e).multiplyScalar(0.5),
      gn.copy(e).sub(t).normalize(),
      _n.copy(this.origin).sub(mn);
    const r = 0.5 * t.distanceTo(e),
      s = -this.direction.dot(gn),
      a = _n.dot(this.direction),
      o = -_n.dot(gn),
      l = _n.lengthSq(),
      c = Math.abs(1 - s * s);
    let h, u, d, p;
    if (c > 0)
      if (((h = s * o - a), (u = s * a - o), (p = r * c), h >= 0))
        if (u >= -p)
          if (u <= p) {
            const t = 1 / c;
            (h *= t),
              (u *= t),
              (d = h * (h + s * u + 2 * a) + u * (s * h + u + 2 * o) + l);
          } else
            (u = r),
              (h = Math.max(0, -(s * u + a))),
              (d = -h * h + u * (u + 2 * o) + l);
        else
          (u = -r),
            (h = Math.max(0, -(s * u + a))),
            (d = -h * h + u * (u + 2 * o) + l);
      else
        u <= -p
          ? ((h = Math.max(0, -(-s * r + a))),
            (u = h > 0 ? -r : Math.min(Math.max(-r, -o), r)),
            (d = -h * h + u * (u + 2 * o) + l))
          : u <= p
          ? ((h = 0),
            (u = Math.min(Math.max(-r, -o), r)),
            (d = u * (u + 2 * o) + l))
          : ((h = Math.max(0, -(s * r + a))),
            (u = h > 0 ? r : Math.min(Math.max(-r, -o), r)),
            (d = -h * h + u * (u + 2 * o) + l));
    else
      (u = s > 0 ? -r : r),
        (h = Math.max(0, -(s * u + a))),
        (d = -h * h + u * (u + 2 * o) + l);
    return (
      n && n.copy(this.origin).addScaledVector(this.direction, h),
      i && i.copy(mn).addScaledVector(gn, u),
      d
    );
  }
  intersectSphere(t, e) {
    fn.subVectors(t.center, this.origin);
    const n = fn.dot(this.direction),
      i = fn.dot(fn) - n * n,
      r = t.radius * t.radius;
    if (i > r) return null;
    const s = Math.sqrt(r - i),
      a = n - s,
      o = n + s;
    return o < 0 ? null : a < 0 ? this.at(o, e) : this.at(a, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (0 === e) return 0 === t.distanceToPoint(this.origin) ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return null === n ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    if (0 === e) return !0;
    return t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, i, r, s, a, o;
    const l = 1 / this.direction.x,
      c = 1 / this.direction.y,
      h = 1 / this.direction.z,
      u = this.origin;
    return (
      l >= 0
        ? ((n = (t.min.x - u.x) * l), (i = (t.max.x - u.x) * l))
        : ((n = (t.max.x - u.x) * l), (i = (t.min.x - u.x) * l)),
      c >= 0
        ? ((r = (t.min.y - u.y) * c), (s = (t.max.y - u.y) * c))
        : ((r = (t.max.y - u.y) * c), (s = (t.min.y - u.y) * c)),
      n > s || r > i
        ? null
        : ((r > n || isNaN(n)) && (n = r),
          (s < i || isNaN(i)) && (i = s),
          h >= 0
            ? ((a = (t.min.z - u.z) * h), (o = (t.max.z - u.z) * h))
            : ((a = (t.max.z - u.z) * h), (o = (t.min.z - u.z) * h)),
          n > o || a > i
            ? null
            : ((a > n || n != n) && (n = a),
              (o < i || i != i) && (i = o),
              i < 0 ? null : this.at(n >= 0 ? n : i, e)))
    );
  }
  intersectsBox(t) {
    return null !== this.intersectBox(t, fn);
  }
  intersectTriangle(t, e, n, i, r) {
    vn.subVectors(e, t), xn.subVectors(n, t), Sn.crossVectors(vn, xn);
    let s,
      a = this.direction.dot(Sn);
    if (a > 0) {
      if (i) return null;
      s = 1;
    } else {
      if (!(a < 0)) return null;
      (s = -1), (a = -a);
    }
    _n.subVectors(this.origin, t);
    const o = s * this.direction.dot(xn.crossVectors(_n, xn));
    if (o < 0) return null;
    const l = s * this.direction.dot(vn.cross(_n));
    if (l < 0) return null;
    if (o + l > a) return null;
    const c = -s * _n.dot(Sn);
    return c < 0 ? null : this.at(c / a, r);
  }
  applyMatrix4(t) {
    return (
      this.origin.applyMatrix4(t), this.direction.transformDirection(t), this
    );
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class En {
  constructor(t, e, n, i, r, s, a, o, l, c, h, u, d, p, f, m) {
    (En.prototype.isMatrix4 = !0),
      (this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      void 0 !== t && this.set(t, e, n, i, r, s, a, o, l, c, h, u, d, p, f, m);
  }
  set(t, e, n, i, r, s, a, o, l, c, h, u, d, p, f, m) {
    const g = this.elements;
    return (
      (g[0] = t),
      (g[4] = e),
      (g[8] = n),
      (g[12] = i),
      (g[1] = r),
      (g[5] = s),
      (g[9] = a),
      (g[13] = o),
      (g[2] = l),
      (g[6] = c),
      (g[10] = h),
      (g[14] = u),
      (g[3] = d),
      (g[7] = p),
      (g[11] = f),
      (g[15] = m),
      this
    );
  }
  identity() {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  clone() {
    return new En().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      (e[9] = n[9]),
      (e[10] = n[10]),
      (e[11] = n[11]),
      (e[12] = n[12]),
      (e[13] = n[13]),
      (e[14] = n[14]),
      (e[15] = n[15]),
      this
    );
  }
  copyPosition(t) {
    const e = this.elements,
      n = t.elements;
    return (e[12] = n[12]), (e[13] = n[13]), (e[14] = n[14]), this;
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return (
      this.set(
        e[0],
        e[3],
        e[6],
        0,
        e[1],
        e[4],
        e[7],
        0,
        e[2],
        e[5],
        e[8],
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrixColumn(this, 0),
      e.setFromMatrixColumn(this, 1),
      n.setFromMatrixColumn(this, 2),
      this
    );
  }
  makeBasis(t, e, n) {
    return (
      this.set(
        t.x,
        e.x,
        n.x,
        0,
        t.y,
        e.y,
        n.y,
        0,
        t.z,
        e.z,
        n.z,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  extractRotation(t) {
    const e = this.elements,
      n = t.elements,
      i = 1 / Tn.setFromMatrixColumn(t, 0).length(),
      r = 1 / Tn.setFromMatrixColumn(t, 1).length(),
      s = 1 / Tn.setFromMatrixColumn(t, 2).length();
    return (
      (e[0] = n[0] * i),
      (e[1] = n[1] * i),
      (e[2] = n[2] * i),
      (e[3] = 0),
      (e[4] = n[4] * r),
      (e[5] = n[5] * r),
      (e[6] = n[6] * r),
      (e[7] = 0),
      (e[8] = n[8] * s),
      (e[9] = n[9] * s),
      (e[10] = n[10] * s),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromEuler(t) {
    const e = this.elements,
      n = t.x,
      i = t.y,
      r = t.z,
      s = Math.cos(n),
      a = Math.sin(n),
      o = Math.cos(i),
      l = Math.sin(i),
      c = Math.cos(r),
      h = Math.sin(r);
    if ("XYZ" === t.order) {
      const t = s * c,
        n = s * h,
        i = a * c,
        r = a * h;
      (e[0] = o * c),
        (e[4] = -o * h),
        (e[8] = l),
        (e[1] = n + i * l),
        (e[5] = t - r * l),
        (e[9] = -a * o),
        (e[2] = r - t * l),
        (e[6] = i + n * l),
        (e[10] = s * o);
    } else if ("YXZ" === t.order) {
      const t = o * c,
        n = o * h,
        i = l * c,
        r = l * h;
      (e[0] = t + r * a),
        (e[4] = i * a - n),
        (e[8] = s * l),
        (e[1] = s * h),
        (e[5] = s * c),
        (e[9] = -a),
        (e[2] = n * a - i),
        (e[6] = r + t * a),
        (e[10] = s * o);
    } else if ("ZXY" === t.order) {
      const t = o * c,
        n = o * h,
        i = l * c,
        r = l * h;
      (e[0] = t - r * a),
        (e[4] = -s * h),
        (e[8] = i + n * a),
        (e[1] = n + i * a),
        (e[5] = s * c),
        (e[9] = r - t * a),
        (e[2] = -s * l),
        (e[6] = a),
        (e[10] = s * o);
    } else if ("ZYX" === t.order) {
      const t = s * c,
        n = s * h,
        i = a * c,
        r = a * h;
      (e[0] = o * c),
        (e[4] = i * l - n),
        (e[8] = t * l + r),
        (e[1] = o * h),
        (e[5] = r * l + t),
        (e[9] = n * l - i),
        (e[2] = -l),
        (e[6] = a * o),
        (e[10] = s * o);
    } else if ("YZX" === t.order) {
      const t = s * o,
        n = s * l,
        i = a * o,
        r = a * l;
      (e[0] = o * c),
        (e[4] = r - t * h),
        (e[8] = i * h + n),
        (e[1] = h),
        (e[5] = s * c),
        (e[9] = -a * c),
        (e[2] = -l * c),
        (e[6] = n * h + i),
        (e[10] = t - r * h);
    } else if ("XZY" === t.order) {
      const t = s * o,
        n = s * l,
        i = a * o,
        r = a * l;
      (e[0] = o * c),
        (e[4] = -h),
        (e[8] = l * c),
        (e[1] = t * h + r),
        (e[5] = s * c),
        (e[9] = n * h - i),
        (e[2] = i * h - n),
        (e[6] = a * c),
        (e[10] = r * h + t);
    }
    return (
      (e[3] = 0),
      (e[7] = 0),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromQuaternion(t) {
    return this.compose(bn, t, wn);
  }
  lookAt(t, e, n) {
    const i = this.elements;
    return (
      Rn.subVectors(t, e),
      0 === Rn.lengthSq() && (Rn.z = 1),
      Rn.normalize(),
      An.crossVectors(n, Rn),
      0 === An.lengthSq() &&
        (1 === Math.abs(n.z) ? (Rn.x += 1e-4) : (Rn.z += 1e-4),
        Rn.normalize(),
        An.crossVectors(n, Rn)),
      An.normalize(),
      Cn.crossVectors(Rn, An),
      (i[0] = An.x),
      (i[4] = Cn.x),
      (i[8] = Rn.x),
      (i[1] = An.y),
      (i[5] = Cn.y),
      (i[9] = Rn.y),
      (i[2] = An.z),
      (i[6] = Cn.z),
      (i[10] = Rn.z),
      this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      i = e.elements,
      r = this.elements,
      s = n[0],
      a = n[4],
      o = n[8],
      l = n[12],
      c = n[1],
      h = n[5],
      u = n[9],
      d = n[13],
      p = n[2],
      f = n[6],
      m = n[10],
      g = n[14],
      _ = n[3],
      v = n[7],
      x = n[11],
      S = n[15],
      M = i[0],
      E = i[4],
      T = i[8],
      y = i[12],
      b = i[1],
      w = i[5],
      A = i[9],
      C = i[13],
      R = i[2],
      P = i[6],
      U = i[10],
      I = i[14],
      L = i[3],
      D = i[7],
      N = i[11],
      O = i[15];
    return (
      (r[0] = s * M + a * b + o * R + l * L),
      (r[4] = s * E + a * w + o * P + l * D),
      (r[8] = s * T + a * A + o * U + l * N),
      (r[12] = s * y + a * C + o * I + l * O),
      (r[1] = c * M + h * b + u * R + d * L),
      (r[5] = c * E + h * w + u * P + d * D),
      (r[9] = c * T + h * A + u * U + d * N),
      (r[13] = c * y + h * C + u * I + d * O),
      (r[2] = p * M + f * b + m * R + g * L),
      (r[6] = p * E + f * w + m * P + g * D),
      (r[10] = p * T + f * A + m * U + g * N),
      (r[14] = p * y + f * C + m * I + g * O),
      (r[3] = _ * M + v * b + x * R + S * L),
      (r[7] = _ * E + v * w + x * P + S * D),
      (r[11] = _ * T + v * A + x * U + S * N),
      (r[15] = _ * y + v * C + x * I + S * O),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[4] *= t),
      (e[8] *= t),
      (e[12] *= t),
      (e[1] *= t),
      (e[5] *= t),
      (e[9] *= t),
      (e[13] *= t),
      (e[2] *= t),
      (e[6] *= t),
      (e[10] *= t),
      (e[14] *= t),
      (e[3] *= t),
      (e[7] *= t),
      (e[11] *= t),
      (e[15] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[4],
      i = t[8],
      r = t[12],
      s = t[1],
      a = t[5],
      o = t[9],
      l = t[13],
      c = t[2],
      h = t[6],
      u = t[10],
      d = t[14];
    return (
      t[3] *
        (+r * o * h -
          i * l * h -
          r * a * u +
          n * l * u +
          i * a * d -
          n * o * d) +
      t[7] *
        (+e * o * d -
          e * l * u +
          r * s * u -
          i * s * d +
          i * l * c -
          r * o * c) +
      t[11] *
        (+e * l * h -
          e * a * d -
          r * s * h +
          n * s * d +
          r * a * c -
          n * l * c) +
      t[15] *
        (-i * a * c - e * o * h + e * a * u + i * s * h - n * s * u + n * o * c)
    );
  }
  transpose() {
    const t = this.elements;
    let e;
    return (
      (e = t[1]),
      (t[1] = t[4]),
      (t[4] = e),
      (e = t[2]),
      (t[2] = t[8]),
      (t[8] = e),
      (e = t[6]),
      (t[6] = t[9]),
      (t[9] = e),
      (e = t[3]),
      (t[3] = t[12]),
      (t[12] = e),
      (e = t[7]),
      (t[7] = t[13]),
      (t[13] = e),
      (e = t[11]),
      (t[11] = t[14]),
      (t[14] = e),
      this
    );
  }
  setPosition(t, e, n) {
    const i = this.elements;
    return (
      t.isVector3
        ? ((i[12] = t.x), (i[13] = t.y), (i[14] = t.z))
        : ((i[12] = t), (i[13] = e), (i[14] = n)),
      this
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      i = t[2],
      r = t[3],
      s = t[4],
      a = t[5],
      o = t[6],
      l = t[7],
      c = t[8],
      h = t[9],
      u = t[10],
      d = t[11],
      p = t[12],
      f = t[13],
      m = t[14],
      g = t[15],
      _ = h * m * l - f * u * l + f * o * d - a * m * d - h * o * g + a * u * g,
      v = p * u * l - c * m * l - p * o * d + s * m * d + c * o * g - s * u * g,
      x = c * f * l - p * h * l + p * a * d - s * f * d - c * a * g + s * h * g,
      S = p * h * o - c * f * o - p * a * u + s * f * u + c * a * m - s * h * m,
      M = e * _ + n * v + i * x + r * S;
    if (0 === M)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const E = 1 / M;
    return (
      (t[0] = _ * E),
      (t[1] =
        (f * u * r -
          h * m * r -
          f * i * d +
          n * m * d +
          h * i * g -
          n * u * g) *
        E),
      (t[2] =
        (a * m * r -
          f * o * r +
          f * i * l -
          n * m * l -
          a * i * g +
          n * o * g) *
        E),
      (t[3] =
        (h * o * r -
          a * u * r -
          h * i * l +
          n * u * l +
          a * i * d -
          n * o * d) *
        E),
      (t[4] = v * E),
      (t[5] =
        (c * m * r -
          p * u * r +
          p * i * d -
          e * m * d -
          c * i * g +
          e * u * g) *
        E),
      (t[6] =
        (p * o * r -
          s * m * r -
          p * i * l +
          e * m * l +
          s * i * g -
          e * o * g) *
        E),
      (t[7] =
        (s * u * r -
          c * o * r +
          c * i * l -
          e * u * l -
          s * i * d +
          e * o * d) *
        E),
      (t[8] = x * E),
      (t[9] =
        (p * h * r -
          c * f * r -
          p * n * d +
          e * f * d +
          c * n * g -
          e * h * g) *
        E),
      (t[10] =
        (s * f * r -
          p * a * r +
          p * n * l -
          e * f * l -
          s * n * g +
          e * a * g) *
        E),
      (t[11] =
        (c * a * r -
          s * h * r -
          c * n * l +
          e * h * l +
          s * n * d -
          e * a * d) *
        E),
      (t[12] = S * E),
      (t[13] =
        (c * f * i -
          p * h * i +
          p * n * u -
          e * f * u -
          c * n * m +
          e * h * m) *
        E),
      (t[14] =
        (p * a * i -
          s * f * i -
          p * n * o +
          e * f * o +
          s * n * m -
          e * a * m) *
        E),
      (t[15] =
        (s * h * i -
          c * a * i +
          c * n * o -
          e * h * o -
          s * n * u +
          e * a * u) *
        E),
      this
    );
  }
  scale(t) {
    const e = this.elements,
      n = t.x,
      i = t.y,
      r = t.z;
    return (
      (e[0] *= n),
      (e[4] *= i),
      (e[8] *= r),
      (e[1] *= n),
      (e[5] *= i),
      (e[9] *= r),
      (e[2] *= n),
      (e[6] *= i),
      (e[10] *= r),
      (e[3] *= n),
      (e[7] *= i),
      (e[11] *= r),
      this
    );
  }
  getMaxScaleOnAxis() {
    const t = this.elements,
      e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
      n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
      i = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, i));
  }
  makeTranslation(t, e, n) {
    return (
      t.isVector3
        ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1)
        : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1),
      this
    );
  }
  makeRotationX(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationY(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this;
  }
  makeRotationZ(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e),
      i = Math.sin(e),
      r = 1 - n,
      s = t.x,
      a = t.y,
      o = t.z,
      l = r * s,
      c = r * a;
    return (
      this.set(
        l * s + n,
        l * a - i * o,
        l * o + i * a,
        0,
        l * a + i * o,
        c * a + n,
        c * o - i * s,
        0,
        l * o - i * a,
        c * o + i * s,
        r * o * o + n,
        0,
        0,
        0,
        0,
        1
      ),
      this
    );
  }
  makeScale(t, e, n) {
    return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
  }
  makeShear(t, e, n, i, r, s) {
    return this.set(1, n, r, 0, t, 1, s, 0, e, i, 1, 0, 0, 0, 0, 1), this;
  }
  compose(t, e, n) {
    const i = this.elements,
      r = e._x,
      s = e._y,
      a = e._z,
      o = e._w,
      l = r + r,
      c = s + s,
      h = a + a,
      u = r * l,
      d = r * c,
      p = r * h,
      f = s * c,
      m = s * h,
      g = a * h,
      _ = o * l,
      v = o * c,
      x = o * h,
      S = n.x,
      M = n.y,
      E = n.z;
    return (
      (i[0] = (1 - (f + g)) * S),
      (i[1] = (d + x) * S),
      (i[2] = (p - v) * S),
      (i[3] = 0),
      (i[4] = (d - x) * M),
      (i[5] = (1 - (u + g)) * M),
      (i[6] = (m + _) * M),
      (i[7] = 0),
      (i[8] = (p + v) * E),
      (i[9] = (m - _) * E),
      (i[10] = (1 - (u + f)) * E),
      (i[11] = 0),
      (i[12] = t.x),
      (i[13] = t.y),
      (i[14] = t.z),
      (i[15] = 1),
      this
    );
  }
  decompose(t, e, n) {
    const i = this.elements;
    let r = Tn.set(i[0], i[1], i[2]).length();
    const s = Tn.set(i[4], i[5], i[6]).length(),
      a = Tn.set(i[8], i[9], i[10]).length();
    this.determinant() < 0 && (r = -r),
      (t.x = i[12]),
      (t.y = i[13]),
      (t.z = i[14]),
      yn.copy(this);
    const o = 1 / r,
      l = 1 / s,
      c = 1 / a;
    return (
      (yn.elements[0] *= o),
      (yn.elements[1] *= o),
      (yn.elements[2] *= o),
      (yn.elements[4] *= l),
      (yn.elements[5] *= l),
      (yn.elements[6] *= l),
      (yn.elements[8] *= c),
      (yn.elements[9] *= c),
      (yn.elements[10] *= c),
      e.setFromRotationMatrix(yn),
      (n.x = r),
      (n.y = s),
      (n.z = a),
      this
    );
  }
  makePerspective(t, e, n, i, r, s, a = 2e3) {
    const o = this.elements,
      l = (2 * r) / (e - t),
      c = (2 * r) / (n - i),
      h = (e + t) / (e - t),
      u = (n + i) / (n - i);
    let d, p;
    if (a === oe) (d = -(s + r) / (s - r)), (p = (-2 * s * r) / (s - r));
    else {
      if (a !== le)
        throw new Error(
          "THREE.Matrix4.makePerspective(): Invalid coordinate system: " + a
        );
      (d = -s / (s - r)), (p = (-s * r) / (s - r));
    }
    return (
      (o[0] = l),
      (o[4] = 0),
      (o[8] = h),
      (o[12] = 0),
      (o[1] = 0),
      (o[5] = c),
      (o[9] = u),
      (o[13] = 0),
      (o[2] = 0),
      (o[6] = 0),
      (o[10] = d),
      (o[14] = p),
      (o[3] = 0),
      (o[7] = 0),
      (o[11] = -1),
      (o[15] = 0),
      this
    );
  }
  makeOrthographic(t, e, n, i, r, s, a = 2e3) {
    const o = this.elements,
      l = 1 / (e - t),
      c = 1 / (n - i),
      h = 1 / (s - r),
      u = (e + t) * l,
      d = (n + i) * c;
    let p, f;
    if (a === oe) (p = (s + r) * h), (f = -2 * h);
    else {
      if (a !== le)
        throw new Error(
          "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + a
        );
      (p = r * h), (f = -1 * h);
    }
    return (
      (o[0] = 2 * l),
      (o[4] = 0),
      (o[8] = 0),
      (o[12] = -u),
      (o[1] = 0),
      (o[5] = 2 * c),
      (o[9] = 0),
      (o[13] = -d),
      (o[2] = 0),
      (o[6] = 0),
      (o[10] = f),
      (o[14] = -p),
      (o[3] = 0),
      (o[7] = 0),
      (o[11] = 0),
      (o[15] = 1),
      this
    );
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let i = 0; i < 16; i++) if (e[i] !== n[i]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      (t[e + 9] = n[9]),
      (t[e + 10] = n[10]),
      (t[e + 11] = n[11]),
      (t[e + 12] = n[12]),
      (t[e + 13] = n[13]),
      (t[e + 14] = n[14]),
      (t[e + 15] = n[15]),
      t
    );
  }
}
const Tn = new Xe(),
  yn = new En(),
  bn = new Xe(0, 0, 0),
  wn = new Xe(1, 1, 1),
  An = new Xe(),
  Cn = new Xe(),
  Rn = new Xe(),
  Pn = new En(),
  Un = new We();
class In {
  constructor(t = 0, e = 0, n = 0, i = In.DEFAULT_ORDER) {
    (this.isEuler = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = i);
  }
  get x() {
    return this._x;
  }
  set x(t) {
    (this._x = t), this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(t) {
    (this._y = t), this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(t) {
    (this._z = t), this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(t) {
    (this._order = t), this._onChangeCallback();
  }
  set(t, e, n, i = this._order) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = i),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return (
      (this._x = t._x),
      (this._y = t._y),
      (this._z = t._z),
      (this._order = t._order),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const i = t.elements,
      r = i[0],
      s = i[4],
      a = i[8],
      o = i[1],
      l = i[5],
      c = i[9],
      h = i[2],
      u = i[6],
      d = i[10];
    switch (e) {
      case "XYZ":
        (this._y = Math.asin(fe(a, -1, 1))),
          Math.abs(a) < 0.9999999
            ? ((this._x = Math.atan2(-c, d)), (this._z = Math.atan2(-s, r)))
            : ((this._x = Math.atan2(u, l)), (this._z = 0));
        break;
      case "YXZ":
        (this._x = Math.asin(-fe(c, -1, 1))),
          Math.abs(c) < 0.9999999
            ? ((this._y = Math.atan2(a, d)), (this._z = Math.atan2(o, l)))
            : ((this._y = Math.atan2(-h, r)), (this._z = 0));
        break;
      case "ZXY":
        (this._x = Math.asin(fe(u, -1, 1))),
          Math.abs(u) < 0.9999999
            ? ((this._y = Math.atan2(-h, d)), (this._z = Math.atan2(-s, l)))
            : ((this._y = 0), (this._z = Math.atan2(o, r)));
        break;
      case "ZYX":
        (this._y = Math.asin(-fe(h, -1, 1))),
          Math.abs(h) < 0.9999999
            ? ((this._x = Math.atan2(u, d)), (this._z = Math.atan2(o, r)))
            : ((this._x = 0), (this._z = Math.atan2(-s, l)));
        break;
      case "YZX":
        (this._z = Math.asin(fe(o, -1, 1))),
          Math.abs(o) < 0.9999999
            ? ((this._x = Math.atan2(-c, l)), (this._y = Math.atan2(-h, r)))
            : ((this._x = 0), (this._y = Math.atan2(a, d)));
        break;
      case "XZY":
        (this._z = Math.asin(-fe(s, -1, 1))),
          Math.abs(s) < 0.9999999
            ? ((this._x = Math.atan2(u, l)), (this._y = Math.atan2(a, r)))
            : ((this._x = Math.atan2(-c, d)), (this._y = 0));
        break;
      default:
        console.warn(
          "THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
            e
        );
    }
    return (this._order = e), !0 === n && this._onChangeCallback(), this;
  }
  setFromQuaternion(t, e, n) {
    return (
      Pn.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Pn, e, n)
    );
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return Un.setFromEuler(this), this.setFromQuaternion(Un, t);
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._order === this._order
    );
  }
  fromArray(t) {
    return (
      (this._x = t[0]),
      (this._y = t[1]),
      (this._z = t[2]),
      void 0 !== t[3] && (this._order = t[3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._order),
      t
    );
  }
  _onChange(t) {
    return (this._onChangeCallback = t), this;
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
In.DEFAULT_ORDER = "XYZ";
class Ln {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = (1 << t) >>> 0;
  }
  enable(t) {
    this.mask |= 1 << t;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= 1 << t;
  }
  disable(t) {
    this.mask &= ~(1 << t);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return !!(this.mask & t.mask);
  }
  isEnabled(t) {
    return !!(this.mask & (1 << t));
  }
}
let Dn = 0;
const Nn = new Xe(),
  On = new We(),
  Fn = new En(),
  Bn = new Xe(),
  zn = new Xe(),
  Gn = new Xe(),
  Hn = new We(),
  kn = new Xe(1, 0, 0),
  Vn = new Xe(0, 1, 0),
  Wn = new Xe(0, 0, 1),
  Xn = {
    type: "added",
  },
  jn = {
    type: "removed",
  },
  qn = {
    type: "childadded",
    child: null,
  },
  Yn = {
    type: "childremoved",
    child: null,
  };
class Kn extends ce {
  constructor() {
    super(),
      (this.isObject3D = !0),
      Object.defineProperty(this, "id", {
        value: Dn++,
      }),
      (this.uuid = pe()),
      (this.name = ""),
      (this.type = "Object3D"),
      (this.parent = null),
      (this.children = []),
      (this.up = Kn.DEFAULT_UP.clone());
    const t = new Xe(),
      e = new In(),
      n = new We(),
      i = new Xe(1, 1, 1);
    e._onChange(function () {
      n.setFromEuler(e, !1);
    }),
      n._onChange(function () {
        e.setFromQuaternion(n, void 0, !1);
      }),
      Object.defineProperties(this, {
        position: {
          configurable: !0,
          enumerable: !0,
          value: t,
        },
        rotation: {
          configurable: !0,
          enumerable: !0,
          value: e,
        },
        quaternion: {
          configurable: !0,
          enumerable: !0,
          value: n,
        },
        scale: {
          configurable: !0,
          enumerable: !0,
          value: i,
        },
        modelViewMatrix: {
          value: new En(),
        },
        normalMatrix: {
          value: new xe(),
        },
      }),
      (this.matrix = new En()),
      (this.matrixWorld = new En()),
      (this.matrixAutoUpdate = Kn.DEFAULT_MATRIX_AUTO_UPDATE),
      (this.matrixWorldAutoUpdate = Kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
      (this.matrixWorldNeedsUpdate = !1),
      (this.layers = new Ln()),
      (this.visible = !0),
      (this.castShadow = !1),
      (this.receiveShadow = !1),
      (this.frustumCulled = !0),
      (this.renderOrder = 0),
      (this.animations = []),
      (this.customDepthMaterial = void 0),
      (this.customDistanceMaterial = void 0),
      (this.userData = {});
  }
  onBeforeShadow() {}
  onAfterShadow() {}
  onBeforeRender() {}
  onAfterRender() {}
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(),
      this.matrix.premultiply(t),
      this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return On.setFromAxisAngle(t, e), this.quaternion.multiply(On), this;
  }
  rotateOnWorldAxis(t, e) {
    return On.setFromAxisAngle(t, e), this.quaternion.premultiply(On), this;
  }
  rotateX(t) {
    return this.rotateOnAxis(kn, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(Vn, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(Wn, t);
  }
  translateOnAxis(t, e) {
    return (
      Nn.copy(t).applyQuaternion(this.quaternion),
      this.position.add(Nn.multiplyScalar(e)),
      this
    );
  }
  translateX(t) {
    return this.translateOnAxis(kn, t);
  }
  translateY(t) {
    return this.translateOnAxis(Vn, t);
  }
  translateZ(t) {
    return this.translateOnAxis(Wn, t);
  }
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      t.applyMatrix4(Fn.copy(this.matrixWorld).invert())
    );
  }
  lookAt(t, e, n) {
    t.isVector3 ? Bn.copy(t) : Bn.set(t, e, n);
    const i = this.parent;
    this.updateWorldMatrix(!0, !1),
      zn.setFromMatrixPosition(this.matrixWorld),
      this.isCamera || this.isLight
        ? Fn.lookAt(zn, Bn, this.up)
        : Fn.lookAt(Bn, zn, this.up),
      this.quaternion.setFromRotationMatrix(Fn),
      i &&
        (Fn.extractRotation(i.matrixWorld),
        On.setFromRotationMatrix(Fn),
        this.quaternion.premultiply(On.invert()));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
      return this;
    }
    return t === this
      ? (console.error(
          "THREE.Object3D.add: object can't be added as a child of itself.",
          t
        ),
        this)
      : (t && t.isObject3D
          ? (t.removeFromParent(),
            (t.parent = this),
            this.children.push(t),
            t.dispatchEvent(Xn),
            (qn.child = t),
            this.dispatchEvent(qn),
            (qn.child = null))
          : console.error(
              "THREE.Object3D.add: object not an instance of THREE.Object3D.",
              t
            ),
        this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++) this.remove(arguments[t]);
      return this;
    }
    const e = this.children.indexOf(t);
    return (
      -1 !== e &&
        ((t.parent = null),
        this.children.splice(e, 1),
        t.dispatchEvent(jn),
        (Yn.child = t),
        this.dispatchEvent(Yn),
        (Yn.child = null)),
      this
    );
  }
  removeFromParent() {
    const t = this.parent;
    return null !== t && t.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      Fn.copy(this.matrixWorld).invert(),
      null !== t.parent &&
        (t.parent.updateWorldMatrix(!0, !1), Fn.multiply(t.parent.matrixWorld)),
      t.applyMatrix4(Fn),
      t.removeFromParent(),
      (t.parent = this),
      this.children.push(t),
      t.updateWorldMatrix(!1, !0),
      t.dispatchEvent(Xn),
      (qn.child = t),
      this.dispatchEvent(qn),
      (qn.child = null),
      this
    );
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, i = this.children.length; n < i; n++) {
      const i = this.children[n].getObjectByProperty(t, e);
      if (void 0 !== i) return i;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const i = this.children;
    for (let r = 0, s = i.length; r < s; r++)
      i[r].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return (
      this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld)
    );
  }
  getWorldQuaternion(t) {
    return (
      this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(zn, t, Gn), t
    );
  }
  getWorldScale(t) {
    return (
      this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(zn, Hn, t), t
    );
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {}
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) e[n].traverse(t);
  }
  traverseVisible(t) {
    if (!1 === this.visible) return;
    t(this);
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    null !== e && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale),
      (this.matrixWorldNeedsUpdate = !0);
  }
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(),
      (this.matrixWorldNeedsUpdate || t) &&
        (!0 === this.matrixWorldAutoUpdate &&
          (null === this.parent
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(
                this.parent.matrixWorld,
                this.matrix
              )),
        (this.matrixWorldNeedsUpdate = !1),
        (t = !0));
    const e = this.children;
    for (let n = 0, i = e.length; n < i; n++) {
      e[n].updateMatrixWorld(t);
    }
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (
      (!0 === t && null !== n && n.updateWorldMatrix(!0, !1),
      this.matrixAutoUpdate && this.updateMatrix(),
      !0 === this.matrixWorldAutoUpdate &&
        (null === this.parent
          ? this.matrixWorld.copy(this.matrix)
          : this.matrixWorld.multiplyMatrices(
              this.parent.matrixWorld,
              this.matrix
            )),
      !0 === e)
    ) {
      const t = this.children;
      for (let e = 0, n = t.length; e < n; e++) {
        t[e].updateWorldMatrix(!1, !0);
      }
    }
  }
  toJSON(t) {
    const e = void 0 === t || "string" == typeof t,
      n = {};
    e &&
      ((t = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {},
      }),
      (n.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON",
      }));
    const i = {};
    function r(e, n) {
      return void 0 === e[n.uuid] && (e[n.uuid] = n.toJSON(t)), n.uuid;
    }
    if (
      ((i.uuid = this.uuid),
      (i.type = this.type),
      "" !== this.name && (i.name = this.name),
      !0 === this.castShadow && (i.castShadow = !0),
      !0 === this.receiveShadow && (i.receiveShadow = !0),
      !1 === this.visible && (i.visible = !1),
      !1 === this.frustumCulled && (i.frustumCulled = !1),
      0 !== this.renderOrder && (i.renderOrder = this.renderOrder),
      Object.keys(this.userData).length > 0 && (i.userData = this.userData),
      (i.layers = this.layers.mask),
      (i.matrix = this.matrix.toArray()),
      (i.up = this.up.toArray()),
      !1 === this.matrixAutoUpdate && (i.matrixAutoUpdate = !1),
      this.isInstancedMesh &&
        ((i.type = "InstancedMesh"),
        (i.count = this.count),
        (i.instanceMatrix = this.instanceMatrix.toJSON()),
        null !== this.instanceColor &&
          (i.instanceColor = this.instanceColor.toJSON())),
      this.isBatchedMesh &&
        ((i.type = "BatchedMesh"),
        (i.perObjectFrustumCulled = this.perObjectFrustumCulled),
        (i.sortObjects = this.sortObjects),
        (i.drawRanges = this._drawRanges),
        (i.reservedRanges = this._reservedRanges),
        (i.visibility = this._visibility),
        (i.active = this._active),
        (i.bounds = this._bounds.map((t) => ({
          boxInitialized: t.boxInitialized,
          boxMin: t.box.min.toArray(),
          boxMax: t.box.max.toArray(),
          sphereInitialized: t.sphereInitialized,
          sphereRadius: t.sphere.radius,
          sphereCenter: t.sphere.center.toArray(),
        }))),
        (i.maxInstanceCount = this._maxInstanceCount),
        (i.maxVertexCount = this._maxVertexCount),
        (i.maxIndexCount = this._maxIndexCount),
        (i.geometryInitialized = this._geometryInitialized),
        (i.geometryCount = this._geometryCount),
        (i.matricesTexture = this._matricesTexture.toJSON(t)),
        null !== this._colorsTexture &&
          (i.colorsTexture = this._colorsTexture.toJSON(t)),
        null !== this.boundingSphere &&
          (i.boundingSphere = {
            center: i.boundingSphere.center.toArray(),
            radius: i.boundingSphere.radius,
          }),
        null !== this.boundingBox &&
          (i.boundingBox = {
            min: i.boundingBox.min.toArray(),
            max: i.boundingBox.max.toArray(),
          })),
      this.isScene)
    )
      this.background &&
        (this.background.isColor
          ? (i.background = this.background.toJSON())
          : this.background.isTexture &&
            (i.background = this.background.toJSON(t).uuid)),
        this.environment &&
          this.environment.isTexture &&
          !0 !== this.environment.isRenderTargetTexture &&
          (i.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      i.geometry = r(t.geometries, this.geometry);
      const e = this.geometry.parameters;
      if (void 0 !== e && void 0 !== e.shapes) {
        const n = e.shapes;
        if (Array.isArray(n))
          for (let e = 0, i = n.length; e < i; e++) {
            const i = n[e];
            r(t.shapes, i);
          }
        else r(t.shapes, n);
      }
    }
    if (
      (this.isSkinnedMesh &&
        ((i.bindMode = this.bindMode),
        (i.bindMatrix = this.bindMatrix.toArray()),
        void 0 !== this.skeleton &&
          (r(t.skeletons, this.skeleton), (i.skeleton = this.skeleton.uuid))),
      void 0 !== this.material)
    )
      if (Array.isArray(this.material)) {
        const e = [];
        for (let n = 0, i = this.material.length; n < i; n++)
          e.push(r(t.materials, this.material[n]));
        i.material = e;
      } else i.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      i.children = [];
      for (let e = 0; e < this.children.length; e++)
        i.children.push(this.children[e].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      i.animations = [];
      for (let e = 0; e < this.animations.length; e++) {
        const n = this.animations[e];
        i.animations.push(r(t.animations, n));
      }
    }
    if (e) {
      const e = s(t.geometries),
        i = s(t.materials),
        r = s(t.textures),
        a = s(t.images),
        o = s(t.shapes),
        l = s(t.skeletons),
        c = s(t.animations),
        h = s(t.nodes);
      e.length > 0 && (n.geometries = e),
        i.length > 0 && (n.materials = i),
        r.length > 0 && (n.textures = r),
        a.length > 0 && (n.images = a),
        o.length > 0 && (n.shapes = o),
        l.length > 0 && (n.skeletons = l),
        c.length > 0 && (n.animations = c),
        h.length > 0 && (n.nodes = h);
    }
    return (n.object = i), n;
    function s(t) {
      const e = [];
      for (const n in t) {
        const i = t[n];
        delete i.metadata, e.push(i);
      }
      return e;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (
      ((this.name = t.name),
      this.up.copy(t.up),
      this.position.copy(t.position),
      (this.rotation.order = t.rotation.order),
      this.quaternion.copy(t.quaternion),
      this.scale.copy(t.scale),
      this.matrix.copy(t.matrix),
      this.matrixWorld.copy(t.matrixWorld),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      (this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate),
      (this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate),
      (this.layers.mask = t.layers.mask),
      (this.visible = t.visible),
      (this.castShadow = t.castShadow),
      (this.receiveShadow = t.receiveShadow),
      (this.frustumCulled = t.frustumCulled),
      (this.renderOrder = t.renderOrder),
      (this.animations = t.animations.slice()),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      !0 === e)
    )
      for (let n = 0; n < t.children.length; n++) {
        const e = t.children[n];
        this.add(e.clone());
      }
    return this;
  }
}
(Kn.DEFAULT_UP = new Xe(0, 1, 0)),
  (Kn.DEFAULT_MATRIX_AUTO_UPDATE = !0),
  (Kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0);
const Zn = new Xe(),
  Jn = new Xe(),
  $n = new Xe(),
  Qn = new Xe(),
  ti = new Xe(),
  ei = new Xe(),
  ni = new Xe(),
  ii = new Xe(),
  ri = new Xe(),
  si = new Xe(),
  ai = new ze(),
  oi = new ze(),
  li = new ze();
class ci {
  constructor(t = new Xe(), e = new Xe(), n = new Xe()) {
    (this.a = t), (this.b = e), (this.c = n);
  }
  static getNormal(t, e, n, i) {
    i.subVectors(n, e), Zn.subVectors(t, e), i.cross(Zn);
    const r = i.lengthSq();
    return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0);
  }
  static getBarycoord(t, e, n, i, r) {
    Zn.subVectors(i, e), Jn.subVectors(n, e), $n.subVectors(t, e);
    const s = Zn.dot(Zn),
      a = Zn.dot(Jn),
      o = Zn.dot($n),
      l = Jn.dot(Jn),
      c = Jn.dot($n),
      h = s * l - a * a;
    if (0 === h) return r.set(0, 0, 0), null;
    const u = 1 / h,
      d = (l * o - a * c) * u,
      p = (s * c - a * o) * u;
    return r.set(1 - d - p, p, d);
  }
  static containsPoint(t, e, n, i) {
    return (
      null !== this.getBarycoord(t, e, n, i, Qn) &&
      Qn.x >= 0 &&
      Qn.y >= 0 &&
      Qn.x + Qn.y <= 1
    );
  }
  static getInterpolation(t, e, n, i, r, s, a, o) {
    return null === this.getBarycoord(t, e, n, i, Qn)
      ? ((o.x = 0),
        (o.y = 0),
        "z" in o && (o.z = 0),
        "w" in o && (o.w = 0),
        null)
      : (o.setScalar(0),
        o.addScaledVector(r, Qn.x),
        o.addScaledVector(s, Qn.y),
        o.addScaledVector(a, Qn.z),
        o);
  }
  static getInterpolatedAttribute(t, e, n, i, r, s) {
    return (
      ai.setScalar(0),
      oi.setScalar(0),
      li.setScalar(0),
      ai.fromBufferAttribute(t, e),
      oi.fromBufferAttribute(t, n),
      li.fromBufferAttribute(t, i),
      s.setScalar(0),
      s.addScaledVector(ai, r.x),
      s.addScaledVector(oi, r.y),
      s.addScaledVector(li, r.z),
      s
    );
  }
  static isFrontFacing(t, e, n, i) {
    return Zn.subVectors(n, e), Jn.subVectors(t, e), Zn.cross(Jn).dot(i) < 0;
  }
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  setFromPointsAndIndices(t, e, n, i) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[i]), this;
  }
  setFromAttributeAndIndices(t, e, n, i) {
    return (
      this.a.fromBufferAttribute(t, e),
      this.b.fromBufferAttribute(t, n),
      this.c.fromBufferAttribute(t, i),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  getArea() {
    return (
      Zn.subVectors(this.c, this.b),
      Jn.subVectors(this.a, this.b),
      0.5 * Zn.cross(Jn).length()
    );
  }
  getMidpoint(t) {
    return t
      .addVectors(this.a, this.b)
      .add(this.c)
      .multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return ci.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return ci.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, i, r) {
    return ci.getInterpolation(t, this.a, this.b, this.c, e, n, i, r);
  }
  containsPoint(t) {
    return ci.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return ci.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a,
      i = this.b,
      r = this.c;
    let s, a;
    ti.subVectors(i, n), ei.subVectors(r, n), ii.subVectors(t, n);
    const o = ti.dot(ii),
      l = ei.dot(ii);
    if (o <= 0 && l <= 0) return e.copy(n);
    ri.subVectors(t, i);
    const c = ti.dot(ri),
      h = ei.dot(ri);
    if (c >= 0 && h <= c) return e.copy(i);
    const u = o * h - c * l;
    if (u <= 0 && o >= 0 && c <= 0)
      return (s = o / (o - c)), e.copy(n).addScaledVector(ti, s);
    si.subVectors(t, r);
    const d = ti.dot(si),
      p = ei.dot(si);
    if (p >= 0 && d <= p) return e.copy(r);
    const f = d * l - o * p;
    if (f <= 0 && l >= 0 && p <= 0)
      return (a = l / (l - p)), e.copy(n).addScaledVector(ei, a);
    const m = c * p - d * h;
    if (m <= 0 && h - c >= 0 && d - p >= 0)
      return (
        ni.subVectors(r, i),
        (a = (h - c) / (h - c + (d - p))),
        e.copy(i).addScaledVector(ni, a)
      );
    const g = 1 / (m + f + u);
    return (
      (s = f * g),
      (a = u * g),
      e.copy(n).addScaledVector(ti, s).addScaledVector(ei, a)
    );
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const hi = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  },
  ui = {
    h: 0,
    s: 0,
    l: 0,
  },
  di = {
    h: 0,
    s: 0,
    l: 0,
  };
function pi(t, e, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? t + 6 * (e - t) * n
      : n < 0.5
      ? e
      : n < 2 / 3
      ? t + 6 * (e - t) * (2 / 3 - n)
      : t
  );
}
class fi {
  constructor(t, e, n) {
    return (
      (this.isColor = !0),
      (this.r = 1),
      (this.g = 1),
      (this.b = 1),
      this.set(t, e, n)
    );
  }
  set(t, e, n) {
    if (void 0 === e && void 0 === n) {
      const e = t;
      e && e.isColor
        ? this.copy(e)
        : "number" == typeof e
        ? this.setHex(e)
        : "string" == typeof e && this.setStyle(e);
    } else this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return (this.r = t), (this.g = t), (this.b = t), this;
  }
  setHex(t, e = qt) {
    return (
      (t = Math.floor(t)),
      (this.r = ((t >> 16) & 255) / 255),
      (this.g = ((t >> 8) & 255) / 255),
      (this.b = (255 & t) / 255),
      Re.toWorkingColorSpace(this, e),
      this
    );
  }
  setRGB(t, e, n, i = Re.workingColorSpace) {
    return (
      (this.r = t),
      (this.g = e),
      (this.b = n),
      Re.toWorkingColorSpace(this, i),
      this
    );
  }
  setHSL(t, e, n, i = Re.workingColorSpace) {
    var r;
    if (
      ((t = ((t % (r = 1)) + r) % r),
      (e = fe(e, 0, 1)),
      (n = fe(n, 0, 1)),
      0 === e)
    )
      this.r = this.g = this.b = n;
    else {
      const i = n <= 0.5 ? n * (1 + e) : n + e - n * e,
        r = 2 * n - i;
      (this.r = pi(r, i, t + 1 / 3)),
        (this.g = pi(r, i, t)),
        (this.b = pi(r, i, t - 1 / 3));
    }
    return Re.toWorkingColorSpace(this, i), this;
  }
  setStyle(t, e = qt) {
    function n(e) {
      void 0 !== e &&
        parseFloat(e) < 1 &&
        console.warn(
          "THREE.Color: Alpha component of " + t + " will be ignored."
        );
    }
    let i;
    if ((i = /^(\w+)\(([^\)]*)\)/.exec(t))) {
      let r;
      const s = i[1],
        a = i[2];
      switch (s) {
        case "rgb":
        case "rgba":
          if (
            (r =
              /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))
          )
            return (
              n(r[4]),
              this.setRGB(
                Math.min(255, parseInt(r[1], 10)) / 255,
                Math.min(255, parseInt(r[2], 10)) / 255,
                Math.min(255, parseInt(r[3], 10)) / 255,
                e
              )
            );
          if (
            (r =
              /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))
          )
            return (
              n(r[4]),
              this.setRGB(
                Math.min(100, parseInt(r[1], 10)) / 100,
                Math.min(100, parseInt(r[2], 10)) / 100,
                Math.min(100, parseInt(r[3], 10)) / 100,
                e
              )
            );
          break;
        case "hsl":
        case "hsla":
          if (
            (r =
              /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                a
              ))
          )
            return (
              n(r[4]),
              this.setHSL(
                parseFloat(r[1]) / 360,
                parseFloat(r[2]) / 100,
                parseFloat(r[3]) / 100,
                e
              )
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if ((i = /^\#([A-Fa-f\d]+)$/.exec(t))) {
      const n = i[1],
        r = n.length;
      if (3 === r)
        return this.setRGB(
          parseInt(n.charAt(0), 16) / 15,
          parseInt(n.charAt(1), 16) / 15,
          parseInt(n.charAt(2), 16) / 15,
          e
        );
      if (6 === r) return this.setHex(parseInt(n, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0) return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = qt) {
    const n = hi[t.toLowerCase()];
    return (
      void 0 !== n
        ? this.setHex(n, e)
        : console.warn("THREE.Color: Unknown color " + t),
      this
    );
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return (this.r = t.r), (this.g = t.g), (this.b = t.b), this;
  }
  copySRGBToLinear(t) {
    return (this.r = Pe(t.r)), (this.g = Pe(t.g)), (this.b = Pe(t.b)), this;
  }
  copyLinearToSRGB(t) {
    return (this.r = Ue(t.r)), (this.g = Ue(t.g)), (this.b = Ue(t.b)), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(t = qt) {
    return (
      Re.fromWorkingColorSpace(mi.copy(this), t),
      65536 * Math.round(fe(255 * mi.r, 0, 255)) +
        256 * Math.round(fe(255 * mi.g, 0, 255)) +
        Math.round(fe(255 * mi.b, 0, 255))
    );
  }
  getHexString(t = qt) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Re.workingColorSpace) {
    Re.fromWorkingColorSpace(mi.copy(this), e);
    const n = mi.r,
      i = mi.g,
      r = mi.b,
      s = Math.max(n, i, r),
      a = Math.min(n, i, r);
    let o, l;
    const c = (a + s) / 2;
    if (a === s) (o = 0), (l = 0);
    else {
      const t = s - a;
      switch (((l = c <= 0.5 ? t / (s + a) : t / (2 - s - a)), s)) {
        case n:
          o = (i - r) / t + (i < r ? 6 : 0);
          break;
        case i:
          o = (r - n) / t + 2;
          break;
        case r:
          o = (n - i) / t + 4;
      }
      o /= 6;
    }
    return (t.h = o), (t.s = l), (t.l = c), t;
  }
  getRGB(t, e = Re.workingColorSpace) {
    return (
      Re.fromWorkingColorSpace(mi.copy(this), e),
      (t.r = mi.r),
      (t.g = mi.g),
      (t.b = mi.b),
      t
    );
  }
  getStyle(t = qt) {
    Re.fromWorkingColorSpace(mi.copy(this), t);
    const e = mi.r,
      n = mi.g,
      i = mi.b;
    return t !== qt
      ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`
      : `rgb(${Math.round(255 * e)},${Math.round(255 * n)},${Math.round(
          255 * i
        )})`;
  }
  offsetHSL(t, e, n) {
    return this.getHSL(ui), this.setHSL(ui.h + t, ui.s + e, ui.l + n);
  }
  add(t) {
    return (this.r += t.r), (this.g += t.g), (this.b += t.b), this;
  }
  addColors(t, e) {
    return (
      (this.r = t.r + e.r), (this.g = t.g + e.g), (this.b = t.b + e.b), this
    );
  }
  addScalar(t) {
    return (this.r += t), (this.g += t), (this.b += t), this;
  }
  sub(t) {
    return (
      (this.r = Math.max(0, this.r - t.r)),
      (this.g = Math.max(0, this.g - t.g)),
      (this.b = Math.max(0, this.b - t.b)),
      this
    );
  }
  multiply(t) {
    return (this.r *= t.r), (this.g *= t.g), (this.b *= t.b), this;
  }
  multiplyScalar(t) {
    return (this.r *= t), (this.g *= t), (this.b *= t), this;
  }
  lerp(t, e) {
    return (
      (this.r += (t.r - this.r) * e),
      (this.g += (t.g - this.g) * e),
      (this.b += (t.b - this.b) * e),
      this
    );
  }
  lerpColors(t, e, n) {
    return (
      (this.r = t.r + (e.r - t.r) * n),
      (this.g = t.g + (e.g - t.g) * n),
      (this.b = t.b + (e.b - t.b) * n),
      this
    );
  }
  lerpHSL(t, e) {
    this.getHSL(ui), t.getHSL(di);
    const n = me(ui.h, di.h, e),
      i = me(ui.s, di.s, e),
      r = me(ui.l, di.l, e);
    return this.setHSL(n, i, r), this;
  }
  setFromVector3(t) {
    return (this.r = t.x), (this.g = t.y), (this.b = t.z), this;
  }
  applyMatrix3(t) {
    const e = this.r,
      n = this.g,
      i = this.b,
      r = t.elements;
    return (
      (this.r = r[0] * e + r[3] * n + r[6] * i),
      (this.g = r[1] * e + r[4] * n + r[7] * i),
      (this.b = r[2] * e + r[5] * n + r[8] * i),
      this
    );
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return (this.r = t[e]), (this.g = t[e + 1]), (this.b = t[e + 2]), this;
  }
  toArray(t = [], e = 0) {
    return (t[e] = this.r), (t[e + 1] = this.g), (t[e + 2] = this.b), t;
  }
  fromBufferAttribute(t, e) {
    return (
      (this.r = t.getX(e)), (this.g = t.getY(e)), (this.b = t.getZ(e)), this
    );
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const mi = new fi();
fi.NAMES = hi;
let gi = 0;
class _i extends ce {
  constructor() {
    super(),
      (this.isMaterial = !0),
      Object.defineProperty(this, "id", {
        value: gi++,
      }),
      (this.uuid = pe()),
      (this.name = ""),
      (this.type = "Material"),
      (this.blending = 1),
      (this.side = 0),
      (this.vertexColors = !1),
      (this.opacity = 1),
      (this.transparent = !1),
      (this.alphaHash = !1),
      (this.blendSrc = 204),
      (this.blendDst = 205),
      (this.blendEquation = p),
      (this.blendSrcAlpha = null),
      (this.blendDstAlpha = null),
      (this.blendEquationAlpha = null),
      (this.blendColor = new fi(0, 0, 0)),
      (this.blendAlpha = 0),
      (this.depthFunc = 3),
      (this.depthTest = !0),
      (this.depthWrite = !0),
      (this.stencilWriteMask = 255),
      (this.stencilFunc = 519),
      (this.stencilRef = 0),
      (this.stencilFuncMask = 255),
      (this.stencilFail = Jt),
      (this.stencilZFail = Jt),
      (this.stencilZPass = Jt),
      (this.stencilWrite = !1),
      (this.clippingPlanes = null),
      (this.clipIntersection = !1),
      (this.clipShadows = !1),
      (this.shadowSide = null),
      (this.colorWrite = !0),
      (this.precision = null),
      (this.polygonOffset = !1),
      (this.polygonOffsetFactor = 0),
      (this.polygonOffsetUnits = 0),
      (this.dithering = !1),
      (this.alphaToCoverage = !1),
      (this.premultipliedAlpha = !1),
      (this.forceSinglePass = !1),
      (this.allowOverride = !0),
      (this.visible = !0),
      (this.toneMapped = !0),
      (this.userData = {}),
      (this.version = 0),
      (this._alphaTest = 0);
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, (this._alphaTest = t);
  }
  onBeforeRender() {}
  onBeforeCompile() {}
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (void 0 !== t)
      for (const e in t) {
        const n = t[e];
        if (void 0 === n) {
          console.warn(
            `THREE.Material: parameter '${e}' has value of undefined.`
          );
          continue;
        }
        const i = this[e];
        void 0 !== i
          ? i && i.isColor
            ? i.set(n)
            : i && i.isVector3 && n && n.isVector3
            ? i.copy(n)
            : (this[e] = n)
          : console.warn(
              `THREE.Material: '${e}' is not a property of THREE.${this.type}.`
            );
      }
  }
  toJSON(t) {
    const e = void 0 === t || "string" == typeof t;
    e &&
      (t = {
        textures: {},
        images: {},
      });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON",
      },
    };
    function i(t) {
      const e = [];
      for (const n in t) {
        const i = t[n];
        delete i.metadata, e.push(i);
      }
      return e;
    }
    if (
      ((n.uuid = this.uuid),
      (n.type = this.type),
      "" !== this.name && (n.name = this.name),
      this.color && this.color.isColor && (n.color = this.color.getHex()),
      void 0 !== this.roughness && (n.roughness = this.roughness),
      void 0 !== this.metalness && (n.metalness = this.metalness),
      void 0 !== this.sheen && (n.sheen = this.sheen),
      this.sheenColor &&
        this.sheenColor.isColor &&
        (n.sheenColor = this.sheenColor.getHex()),
      void 0 !== this.sheenRoughness &&
        (n.sheenRoughness = this.sheenRoughness),
      this.emissive &&
        this.emissive.isColor &&
        (n.emissive = this.emissive.getHex()),
      void 0 !== this.emissiveIntensity &&
        1 !== this.emissiveIntensity &&
        (n.emissiveIntensity = this.emissiveIntensity),
      this.specular &&
        this.specular.isColor &&
        (n.specular = this.specular.getHex()),
      void 0 !== this.specularIntensity &&
        (n.specularIntensity = this.specularIntensity),
      this.specularColor &&
        this.specularColor.isColor &&
        (n.specularColor = this.specularColor.getHex()),
      void 0 !== this.shininess && (n.shininess = this.shininess),
      void 0 !== this.clearcoat && (n.clearcoat = this.clearcoat),
      void 0 !== this.clearcoatRoughness &&
        (n.clearcoatRoughness = this.clearcoatRoughness),
      this.clearcoatMap &&
        this.clearcoatMap.isTexture &&
        (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid),
      this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture &&
        (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid),
      this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture &&
        ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid),
        (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
      void 0 !== this.dispersion && (n.dispersion = this.dispersion),
      void 0 !== this.iridescence && (n.iridescence = this.iridescence),
      void 0 !== this.iridescenceIOR &&
        (n.iridescenceIOR = this.iridescenceIOR),
      void 0 !== this.iridescenceThicknessRange &&
        (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
      this.iridescenceMap &&
        this.iridescenceMap.isTexture &&
        (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid),
      this.iridescenceThicknessMap &&
        this.iridescenceThicknessMap.isTexture &&
        (n.iridescenceThicknessMap =
          this.iridescenceThicknessMap.toJSON(t).uuid),
      void 0 !== this.anisotropy && (n.anisotropy = this.anisotropy),
      void 0 !== this.anisotropyRotation &&
        (n.anisotropyRotation = this.anisotropyRotation),
      this.anisotropyMap &&
        this.anisotropyMap.isTexture &&
        (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid),
      this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid),
      this.matcap &&
        this.matcap.isTexture &&
        (n.matcap = this.matcap.toJSON(t).uuid),
      this.alphaMap &&
        this.alphaMap.isTexture &&
        (n.alphaMap = this.alphaMap.toJSON(t).uuid),
      this.lightMap &&
        this.lightMap.isTexture &&
        ((n.lightMap = this.lightMap.toJSON(t).uuid),
        (n.lightMapIntensity = this.lightMapIntensity)),
      this.aoMap &&
        this.aoMap.isTexture &&
        ((n.aoMap = this.aoMap.toJSON(t).uuid),
        (n.aoMapIntensity = this.aoMapIntensity)),
      this.bumpMap &&
        this.bumpMap.isTexture &&
        ((n.bumpMap = this.bumpMap.toJSON(t).uuid),
        (n.bumpScale = this.bumpScale)),
      this.normalMap &&
        this.normalMap.isTexture &&
        ((n.normalMap = this.normalMap.toJSON(t).uuid),
        (n.normalMapType = this.normalMapType),
        (n.normalScale = this.normalScale.toArray())),
      this.displacementMap &&
        this.displacementMap.isTexture &&
        ((n.displacementMap = this.displacementMap.toJSON(t).uuid),
        (n.displacementScale = this.displacementScale),
        (n.displacementBias = this.displacementBias)),
      this.roughnessMap &&
        this.roughnessMap.isTexture &&
        (n.roughnessMap = this.roughnessMap.toJSON(t).uuid),
      this.metalnessMap &&
        this.metalnessMap.isTexture &&
        (n.metalnessMap = this.metalnessMap.toJSON(t).uuid),
      this.emissiveMap &&
        this.emissiveMap.isTexture &&
        (n.emissiveMap = this.emissiveMap.toJSON(t).uuid),
      this.specularMap &&
        this.specularMap.isTexture &&
        (n.specularMap = this.specularMap.toJSON(t).uuid),
      this.specularIntensityMap &&
        this.specularIntensityMap.isTexture &&
        (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid),
      this.specularColorMap &&
        this.specularColorMap.isTexture &&
        (n.specularColorMap = this.specularColorMap.toJSON(t).uuid),
      this.envMap &&
        this.envMap.isTexture &&
        ((n.envMap = this.envMap.toJSON(t).uuid),
        void 0 !== this.combine && (n.combine = this.combine)),
      void 0 !== this.envMapRotation &&
        (n.envMapRotation = this.envMapRotation.toArray()),
      void 0 !== this.envMapIntensity &&
        (n.envMapIntensity = this.envMapIntensity),
      void 0 !== this.reflectivity && (n.reflectivity = this.reflectivity),
      void 0 !== this.refractionRatio &&
        (n.refractionRatio = this.refractionRatio),
      this.gradientMap &&
        this.gradientMap.isTexture &&
        (n.gradientMap = this.gradientMap.toJSON(t).uuid),
      void 0 !== this.transmission && (n.transmission = this.transmission),
      this.transmissionMap &&
        this.transmissionMap.isTexture &&
        (n.transmissionMap = this.transmissionMap.toJSON(t).uuid),
      void 0 !== this.thickness && (n.thickness = this.thickness),
      this.thicknessMap &&
        this.thicknessMap.isTexture &&
        (n.thicknessMap = this.thicknessMap.toJSON(t).uuid),
      void 0 !== this.attenuationDistance &&
        this.attenuationDistance !== 1 / 0 &&
        (n.attenuationDistance = this.attenuationDistance),
      void 0 !== this.attenuationColor &&
        (n.attenuationColor = this.attenuationColor.getHex()),
      void 0 !== this.size && (n.size = this.size),
      null !== this.shadowSide && (n.shadowSide = this.shadowSide),
      void 0 !== this.sizeAttenuation &&
        (n.sizeAttenuation = this.sizeAttenuation),
      1 !== this.blending && (n.blending = this.blending),
      0 !== this.side && (n.side = this.side),
      !0 === this.vertexColors && (n.vertexColors = !0),
      this.opacity < 1 && (n.opacity = this.opacity),
      !0 === this.transparent && (n.transparent = !0),
      204 !== this.blendSrc && (n.blendSrc = this.blendSrc),
      205 !== this.blendDst && (n.blendDst = this.blendDst),
      this.blendEquation !== p && (n.blendEquation = this.blendEquation),
      null !== this.blendSrcAlpha && (n.blendSrcAlpha = this.blendSrcAlpha),
      null !== this.blendDstAlpha && (n.blendDstAlpha = this.blendDstAlpha),
      null !== this.blendEquationAlpha &&
        (n.blendEquationAlpha = this.blendEquationAlpha),
      this.blendColor &&
        this.blendColor.isColor &&
        (n.blendColor = this.blendColor.getHex()),
      0 !== this.blendAlpha && (n.blendAlpha = this.blendAlpha),
      3 !== this.depthFunc && (n.depthFunc = this.depthFunc),
      !1 === this.depthTest && (n.depthTest = this.depthTest),
      !1 === this.depthWrite && (n.depthWrite = this.depthWrite),
      !1 === this.colorWrite && (n.colorWrite = this.colorWrite),
      255 !== this.stencilWriteMask &&
        (n.stencilWriteMask = this.stencilWriteMask),
      519 !== this.stencilFunc && (n.stencilFunc = this.stencilFunc),
      0 !== this.stencilRef && (n.stencilRef = this.stencilRef),
      255 !== this.stencilFuncMask &&
        (n.stencilFuncMask = this.stencilFuncMask),
      this.stencilFail !== Jt && (n.stencilFail = this.stencilFail),
      this.stencilZFail !== Jt && (n.stencilZFail = this.stencilZFail),
      this.stencilZPass !== Jt && (n.stencilZPass = this.stencilZPass),
      !0 === this.stencilWrite && (n.stencilWrite = this.stencilWrite),
      void 0 !== this.rotation &&
        0 !== this.rotation &&
        (n.rotation = this.rotation),
      !0 === this.polygonOffset && (n.polygonOffset = !0),
      0 !== this.polygonOffsetFactor &&
        (n.polygonOffsetFactor = this.polygonOffsetFactor),
      0 !== this.polygonOffsetUnits &&
        (n.polygonOffsetUnits = this.polygonOffsetUnits),
      void 0 !== this.linewidth &&
        1 !== this.linewidth &&
        (n.linewidth = this.linewidth),
      void 0 !== this.dashSize && (n.dashSize = this.dashSize),
      void 0 !== this.gapSize && (n.gapSize = this.gapSize),
      void 0 !== this.scale && (n.scale = this.scale),
      !0 === this.dithering && (n.dithering = !0),
      this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
      !0 === this.alphaHash && (n.alphaHash = !0),
      !0 === this.alphaToCoverage && (n.alphaToCoverage = !0),
      !0 === this.premultipliedAlpha && (n.premultipliedAlpha = !0),
      !0 === this.forceSinglePass && (n.forceSinglePass = !0),
      !0 === this.wireframe && (n.wireframe = !0),
      this.wireframeLinewidth > 1 &&
        (n.wireframeLinewidth = this.wireframeLinewidth),
      "round" !== this.wireframeLinecap &&
        (n.wireframeLinecap = this.wireframeLinecap),
      "round" !== this.wireframeLinejoin &&
        (n.wireframeLinejoin = this.wireframeLinejoin),
      !0 === this.flatShading && (n.flatShading = !0),
      !1 === this.visible && (n.visible = !1),
      !1 === this.toneMapped && (n.toneMapped = !1),
      !1 === this.fog && (n.fog = !1),
      Object.keys(this.userData).length > 0 && (n.userData = this.userData),
      e)
    ) {
      const e = i(t.textures),
        r = i(t.images);
      e.length > 0 && (n.textures = e), r.length > 0 && (n.images = r);
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.name = t.name),
      (this.blending = t.blending),
      (this.side = t.side),
      (this.vertexColors = t.vertexColors),
      (this.opacity = t.opacity),
      (this.transparent = t.transparent),
      (this.blendSrc = t.blendSrc),
      (this.blendDst = t.blendDst),
      (this.blendEquation = t.blendEquation),
      (this.blendSrcAlpha = t.blendSrcAlpha),
      (this.blendDstAlpha = t.blendDstAlpha),
      (this.blendEquationAlpha = t.blendEquationAlpha),
      this.blendColor.copy(t.blendColor),
      (this.blendAlpha = t.blendAlpha),
      (this.depthFunc = t.depthFunc),
      (this.depthTest = t.depthTest),
      (this.depthWrite = t.depthWrite),
      (this.stencilWriteMask = t.stencilWriteMask),
      (this.stencilFunc = t.stencilFunc),
      (this.stencilRef = t.stencilRef),
      (this.stencilFuncMask = t.stencilFuncMask),
      (this.stencilFail = t.stencilFail),
      (this.stencilZFail = t.stencilZFail),
      (this.stencilZPass = t.stencilZPass),
      (this.stencilWrite = t.stencilWrite);
    const e = t.clippingPlanes;
    let n = null;
    if (null !== e) {
      const t = e.length;
      n = new Array(t);
      for (let i = 0; i !== t; ++i) n[i] = e[i].clone();
    }
    return (
      (this.clippingPlanes = n),
      (this.clipIntersection = t.clipIntersection),
      (this.clipShadows = t.clipShadows),
      (this.shadowSide = t.shadowSide),
      (this.colorWrite = t.colorWrite),
      (this.precision = t.precision),
      (this.polygonOffset = t.polygonOffset),
      (this.polygonOffsetFactor = t.polygonOffsetFactor),
      (this.polygonOffsetUnits = t.polygonOffsetUnits),
      (this.dithering = t.dithering),
      (this.alphaTest = t.alphaTest),
      (this.alphaHash = t.alphaHash),
      (this.alphaToCoverage = t.alphaToCoverage),
      (this.premultipliedAlpha = t.premultipliedAlpha),
      (this.forceSinglePass = t.forceSinglePass),
      (this.visible = t.visible),
      (this.toneMapped = t.toneMapped),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      this
    );
  }
  dispose() {
    this.dispatchEvent({
      type: "dispose",
    });
  }
  set needsUpdate(t) {
    !0 === t && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class vi extends _i {
  constructor(t) {
    super(),
      (this.isMeshBasicMaterial = !0),
      (this.type = "MeshBasicMaterial"),
      (this.color = new fi(16777215)),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new In()),
      (this.combine = 0),
      (this.reflectivity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.fog = !0),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      this.color.copy(t.color),
      (this.map = t.map),
      (this.lightMap = t.lightMap),
      (this.lightMapIntensity = t.lightMapIntensity),
      (this.aoMap = t.aoMap),
      (this.aoMapIntensity = t.aoMapIntensity),
      (this.specularMap = t.specularMap),
      (this.alphaMap = t.alphaMap),
      (this.envMap = t.envMap),
      this.envMapRotation.copy(t.envMapRotation),
      (this.combine = t.combine),
      (this.reflectivity = t.reflectivity),
      (this.refractionRatio = t.refractionRatio),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.wireframeLinecap = t.wireframeLinecap),
      (this.wireframeLinejoin = t.wireframeLinejoin),
      (this.fog = t.fog),
      this
    );
  }
}
const xi = new Xe(),
  Si = new ve();
let Mi = 0;
class Ei {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError(
        "THREE.BufferAttribute: array should be a Typed Array."
      );
    (this.isBufferAttribute = !0),
      Object.defineProperty(this, "id", {
        value: Mi++,
      }),
      (this.name = ""),
      (this.array = t),
      (this.itemSize = e),
      (this.count = void 0 !== t ? t.length / e : 0),
      (this.normalized = n),
      (this.usage = 35044),
      (this.updateRanges = []),
      (this.gpuType = it),
      (this.version = 0);
  }
  onUploadCallback() {}
  set needsUpdate(t) {
    !0 === t && this.version++;
  }
  setUsage(t) {
    return (this.usage = t), this;
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({
      start: t,
      count: e,
    });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.array = new t.array.constructor(t.array)),
      (this.itemSize = t.itemSize),
      (this.count = t.count),
      (this.normalized = t.normalized),
      (this.usage = t.usage),
      (this.gpuType = t.gpuType),
      this
    );
  }
  copyAt(t, e, n) {
    (t *= this.itemSize), (n *= e.itemSize);
    for (let i = 0, r = this.itemSize; i < r; i++)
      this.array[t + i] = e.array[n + i];
    return this;
  }
  copyArray(t) {
    return this.array.set(t), this;
  }
  applyMatrix3(t) {
    if (2 === this.itemSize)
      for (let e = 0, n = this.count; e < n; e++)
        Si.fromBufferAttribute(this, e),
          Si.applyMatrix3(t),
          this.setXY(e, Si.x, Si.y);
    else if (3 === this.itemSize)
      for (let e = 0, n = this.count; e < n; e++)
        xi.fromBufferAttribute(this, e),
          xi.applyMatrix3(t),
          this.setXYZ(e, xi.x, xi.y, xi.z);
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      xi.fromBufferAttribute(this, e),
        xi.applyMatrix4(t),
        this.setXYZ(e, xi.x, xi.y, xi.z);
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      xi.fromBufferAttribute(this, e),
        xi.applyNormalMatrix(t),
        this.setXYZ(e, xi.x, xi.y, xi.z);
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      xi.fromBufferAttribute(this, e),
        xi.transformDirection(t),
        this.setXYZ(e, xi.x, xi.y, xi.z);
    return this;
  }
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = ge(n, this.array)), n;
  }
  setComponent(t, e, n) {
    return (
      this.normalized && (n = _e(n, this.array)),
      (this.array[t * this.itemSize + e] = n),
      this
    );
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = ge(e, this.array)), e;
  }
  setX(t, e) {
    return (
      this.normalized && (e = _e(e, this.array)),
      (this.array[t * this.itemSize] = e),
      this
    );
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = ge(e, this.array)), e;
  }
  setY(t, e) {
    return (
      this.normalized && (e = _e(e, this.array)),
      (this.array[t * this.itemSize + 1] = e),
      this
    );
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = ge(e, this.array)), e;
  }
  setZ(t, e) {
    return (
      this.normalized && (e = _e(e, this.array)),
      (this.array[t * this.itemSize + 2] = e),
      this
    );
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = ge(e, this.array)), e;
  }
  setW(t, e) {
    return (
      this.normalized && (e = _e(e, this.array)),
      (this.array[t * this.itemSize + 3] = e),
      this
    );
  }
  setXY(t, e, n) {
    return (
      (t *= this.itemSize),
      this.normalized && ((e = _e(e, this.array)), (n = _e(n, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      this
    );
  }
  setXYZ(t, e, n, i) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = _e(e, this.array)),
        (n = _e(n, this.array)),
        (i = _e(i, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = i),
      this
    );
  }
  setXYZW(t, e, n, i, r) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = _e(e, this.array)),
        (n = _e(n, this.array)),
        (i = _e(i, this.array)),
        (r = _e(r, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = i),
      (this.array[t + 3] = r),
      this
    );
  }
  onUpload(t) {
    return (this.onUploadCallback = t), this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized,
    };
    return (
      "" !== this.name && (t.name = this.name),
      35044 !== this.usage && (t.usage = this.usage),
      t
    );
  }
}
class Ti extends Ei {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class yi extends Ei {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class bi extends Ei {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let wi = 0;
const Ai = new En(),
  Ci = new Kn(),
  Ri = new Xe(),
  Pi = new Ye(),
  Ui = new Ye(),
  Ii = new Xe();
class Li extends ce {
  constructor() {
    super(),
      (this.isBufferGeometry = !0),
      Object.defineProperty(this, "id", {
        value: wi++,
      }),
      (this.uuid = pe()),
      (this.name = ""),
      (this.type = "BufferGeometry"),
      (this.index = null),
      (this.indirect = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.morphTargetsRelative = !1),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.drawRange = {
        start: 0,
        count: 1 / 0,
      }),
      (this.userData = {});
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return (
      Array.isArray(t)
        ? (this.index = new (Me(t) ? yi : Ti)(t, 1))
        : (this.index = t),
      this
    );
  }
  setIndirect(t) {
    return (this.indirect = t), this;
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return (this.attributes[t] = e), this;
  }
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  hasAttribute(t) {
    return void 0 !== this.attributes[t];
  }
  addGroup(t, e, n = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: n,
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    (this.drawRange.start = t), (this.drawRange.count = e);
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    void 0 !== e && (e.applyMatrix4(t), (e.needsUpdate = !0));
    const n = this.attributes.normal;
    if (void 0 !== n) {
      const e = new xe().getNormalMatrix(t);
      n.applyNormalMatrix(e), (n.needsUpdate = !0);
    }
    const i = this.attributes.tangent;
    return (
      void 0 !== i && (i.transformDirection(t), (i.needsUpdate = !0)),
      null !== this.boundingBox && this.computeBoundingBox(),
      null !== this.boundingSphere && this.computeBoundingSphere(),
      this
    );
  }
  applyQuaternion(t) {
    return Ai.makeRotationFromQuaternion(t), this.applyMatrix4(Ai), this;
  }
  rotateX(t) {
    return Ai.makeRotationX(t), this.applyMatrix4(Ai), this;
  }
  rotateY(t) {
    return Ai.makeRotationY(t), this.applyMatrix4(Ai), this;
  }
  rotateZ(t) {
    return Ai.makeRotationZ(t), this.applyMatrix4(Ai), this;
  }
  translate(t, e, n) {
    return Ai.makeTranslation(t, e, n), this.applyMatrix4(Ai), this;
  }
  scale(t, e, n) {
    return Ai.makeScale(t, e, n), this.applyMatrix4(Ai), this;
  }
  lookAt(t) {
    return Ci.lookAt(t), Ci.updateMatrix(), this.applyMatrix4(Ci.matrix), this;
  }
  center() {
    return (
      this.computeBoundingBox(),
      this.boundingBox.getCenter(Ri).negate(),
      this.translate(Ri.x, Ri.y, Ri.z),
      this
    );
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (void 0 === e) {
      const e = [];
      for (let n = 0, i = t.length; n < i; n++) {
        const i = t[n];
        e.push(i.x, i.y, i.z || 0);
      }
      this.setAttribute("position", new bi(e, 3));
    } else {
      const n = Math.min(t.length, e.count);
      for (let i = 0; i < n; i++) {
        const n = t[i];
        e.setXYZ(i, n.x, n.y, n.z || 0);
      }
      t.length > e.count &&
        console.warn(
          "THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."
        ),
        (e.needsUpdate = !0);
    }
    return this;
  }
  computeBoundingBox() {
    null === this.boundingBox && (this.boundingBox = new Ye());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute)
      return (
        console.error(
          "THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
          this
        ),
        void this.boundingBox.set(
          new Xe(-1 / 0, -1 / 0, -1 / 0),
          new Xe(1 / 0, 1 / 0, 1 / 0)
        )
      );
    if (void 0 !== t) {
      if ((this.boundingBox.setFromBufferAttribute(t), e))
        for (let n = 0, i = e.length; n < i; n++) {
          const t = e[n];
          Pi.setFromBufferAttribute(t),
            this.morphTargetsRelative
              ? (Ii.addVectors(this.boundingBox.min, Pi.min),
                this.boundingBox.expandByPoint(Ii),
                Ii.addVectors(this.boundingBox.max, Pi.max),
                this.boundingBox.expandByPoint(Ii))
              : (this.boundingBox.expandByPoint(Pi.min),
                this.boundingBox.expandByPoint(Pi.max));
        }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) ||
      isNaN(this.boundingBox.min.y) ||
      isNaN(this.boundingBox.min.z)) &&
      console.error(
        'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
        this
      );
  }
  computeBoundingSphere() {
    null === this.boundingSphere && (this.boundingSphere = new pn());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute)
      return (
        console.error(
          "THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
          this
        ),
        void this.boundingSphere.set(new Xe(), 1 / 0)
      );
    if (t) {
      const n = this.boundingSphere.center;
      if ((Pi.setFromBufferAttribute(t), e))
        for (let t = 0, r = e.length; t < r; t++) {
          const n = e[t];
          Ui.setFromBufferAttribute(n),
            this.morphTargetsRelative
              ? (Ii.addVectors(Pi.min, Ui.min),
                Pi.expandByPoint(Ii),
                Ii.addVectors(Pi.max, Ui.max),
                Pi.expandByPoint(Ii))
              : (Pi.expandByPoint(Ui.min), Pi.expandByPoint(Ui.max));
        }
      Pi.getCenter(n);
      let i = 0;
      for (let e = 0, r = t.count; e < r; e++)
        Ii.fromBufferAttribute(t, e),
          (i = Math.max(i, n.distanceToSquared(Ii)));
      if (e)
        for (let r = 0, s = e.length; r < s; r++) {
          const s = e[r],
            a = this.morphTargetsRelative;
          for (let e = 0, r = s.count; e < r; e++)
            Ii.fromBufferAttribute(s, e),
              a && (Ri.fromBufferAttribute(t, e), Ii.add(Ri)),
              (i = Math.max(i, n.distanceToSquared(Ii)));
        }
      (this.boundingSphere.radius = Math.sqrt(i)),
        isNaN(this.boundingSphere.radius) &&
          console.error(
            'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
            this
          );
    }
  }
  computeTangents() {
    const t = this.index,
      e = this.attributes;
    if (
      null === t ||
      void 0 === e.position ||
      void 0 === e.normal ||
      void 0 === e.uv
    )
      return void console.error(
        "THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)"
      );
    const n = e.position,
      i = e.normal,
      r = e.uv;
    !1 === this.hasAttribute("tangent") &&
      this.setAttribute("tangent", new Ei(new Float32Array(4 * n.count), 4));
    const s = this.getAttribute("tangent"),
      a = [],
      o = [];
    for (let T = 0; T < n.count; T++) (a[T] = new Xe()), (o[T] = new Xe());
    const l = new Xe(),
      c = new Xe(),
      h = new Xe(),
      u = new ve(),
      d = new ve(),
      p = new ve(),
      f = new Xe(),
      m = new Xe();
    function g(t, e, i) {
      l.fromBufferAttribute(n, t),
        c.fromBufferAttribute(n, e),
        h.fromBufferAttribute(n, i),
        u.fromBufferAttribute(r, t),
        d.fromBufferAttribute(r, e),
        p.fromBufferAttribute(r, i),
        c.sub(l),
        h.sub(l),
        d.sub(u),
        p.sub(u);
      const s = 1 / (d.x * p.y - p.x * d.y);
      isFinite(s) &&
        (f
          .copy(c)
          .multiplyScalar(p.y)
          .addScaledVector(h, -d.y)
          .multiplyScalar(s),
        m
          .copy(h)
          .multiplyScalar(d.x)
          .addScaledVector(c, -p.x)
          .multiplyScalar(s),
        a[t].add(f),
        a[e].add(f),
        a[i].add(f),
        o[t].add(m),
        o[e].add(m),
        o[i].add(m));
    }
    let _ = this.groups;
    0 === _.length &&
      (_ = [
        {
          start: 0,
          count: t.count,
        },
      ]);
    for (let T = 0, y = _.length; T < y; ++T) {
      const e = _[T],
        n = e.start;
      for (let i = n, r = n + e.count; i < r; i += 3)
        g(t.getX(i + 0), t.getX(i + 1), t.getX(i + 2));
    }
    const v = new Xe(),
      x = new Xe(),
      S = new Xe(),
      M = new Xe();
    function E(t) {
      S.fromBufferAttribute(i, t), M.copy(S);
      const e = a[t];
      v.copy(e),
        v.sub(S.multiplyScalar(S.dot(e))).normalize(),
        x.crossVectors(M, e);
      const n = x.dot(o[t]) < 0 ? -1 : 1;
      s.setXYZW(t, v.x, v.y, v.z, n);
    }
    for (let T = 0, y = _.length; T < y; ++T) {
      const e = _[T],
        n = e.start;
      for (let i = n, r = n + e.count; i < r; i += 3)
        E(t.getX(i + 0)), E(t.getX(i + 1)), E(t.getX(i + 2));
    }
  }
  computeVertexNormals() {
    const t = this.index,
      e = this.getAttribute("position");
    if (void 0 !== e) {
      let n = this.getAttribute("normal");
      if (void 0 === n)
        (n = new Ei(new Float32Array(3 * e.count), 3)),
          this.setAttribute("normal", n);
      else for (let t = 0, e = n.count; t < e; t++) n.setXYZ(t, 0, 0, 0);
      const i = new Xe(),
        r = new Xe(),
        s = new Xe(),
        a = new Xe(),
        o = new Xe(),
        l = new Xe(),
        c = new Xe(),
        h = new Xe();
      if (t)
        for (let u = 0, d = t.count; u < d; u += 3) {
          const d = t.getX(u + 0),
            p = t.getX(u + 1),
            f = t.getX(u + 2);
          i.fromBufferAttribute(e, d),
            r.fromBufferAttribute(e, p),
            s.fromBufferAttribute(e, f),
            c.subVectors(s, r),
            h.subVectors(i, r),
            c.cross(h),
            a.fromBufferAttribute(n, d),
            o.fromBufferAttribute(n, p),
            l.fromBufferAttribute(n, f),
            a.add(c),
            o.add(c),
            l.add(c),
            n.setXYZ(d, a.x, a.y, a.z),
            n.setXYZ(p, o.x, o.y, o.z),
            n.setXYZ(f, l.x, l.y, l.z);
        }
      else
        for (let t = 0, u = e.count; t < u; t += 3)
          i.fromBufferAttribute(e, t + 0),
            r.fromBufferAttribute(e, t + 1),
            s.fromBufferAttribute(e, t + 2),
            c.subVectors(s, r),
            h.subVectors(i, r),
            c.cross(h),
            n.setXYZ(t + 0, c.x, c.y, c.z),
            n.setXYZ(t + 1, c.x, c.y, c.z),
            n.setXYZ(t + 2, c.x, c.y, c.z);
      this.normalizeNormals(), (n.needsUpdate = !0);
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      Ii.fromBufferAttribute(t, e),
        Ii.normalize(),
        t.setXYZ(e, Ii.x, Ii.y, Ii.z);
  }
  toNonIndexed() {
    function t(t, e) {
      const n = t.array,
        i = t.itemSize,
        r = t.normalized,
        s = new n.constructor(e.length * i);
      let a = 0,
        o = 0;
      for (let l = 0, c = e.length; l < c; l++) {
        a = t.isInterleavedBufferAttribute
          ? e[l] * t.data.stride + t.offset
          : e[l] * i;
        for (let t = 0; t < i; t++) s[o++] = n[a++];
      }
      return new Ei(s, i, r);
    }
    if (null === this.index)
      return (
        console.warn(
          "THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."
        ),
        this
      );
    const e = new Li(),
      n = this.index.array,
      i = this.attributes;
    for (const a in i) {
      const r = t(i[a], n);
      e.setAttribute(a, r);
    }
    const r = this.morphAttributes;
    for (const a in r) {
      const i = [],
        s = r[a];
      for (let e = 0, r = s.length; e < r; e++) {
        const r = t(s[e], n);
        i.push(r);
      }
      e.morphAttributes[a] = i;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const s = this.groups;
    for (let a = 0, o = s.length; a < o; a++) {
      const t = s[a];
      e.addGroup(t.start, t.count, t.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON",
      },
    };
    if (
      ((t.uuid = this.uuid),
      (t.type = this.type),
      "" !== this.name && (t.name = this.name),
      Object.keys(this.userData).length > 0 && (t.userData = this.userData),
      void 0 !== this.parameters)
    ) {
      const e = this.parameters;
      for (const n in e) void 0 !== e[n] && (t[n] = e[n]);
      return t;
    }
    t.data = {
      attributes: {},
    };
    const e = this.index;
    null !== e &&
      (t.data.index = {
        type: e.array.constructor.name,
        array: Array.prototype.slice.call(e.array),
      });
    const n = this.attributes;
    for (const o in n) {
      const e = n[o];
      t.data.attributes[o] = e.toJSON(t.data);
    }
    const i = {};
    let r = !1;
    for (const o in this.morphAttributes) {
      const e = this.morphAttributes[o],
        n = [];
      for (let i = 0, r = e.length; i < r; i++) {
        const r = e[i];
        n.push(r.toJSON(t.data));
      }
      n.length > 0 && ((i[o] = n), (r = !0));
    }
    r &&
      ((t.data.morphAttributes = i),
      (t.data.morphTargetsRelative = this.morphTargetsRelative));
    const s = this.groups;
    s.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(s)));
    const a = this.boundingSphere;
    return (
      null !== a &&
        (t.data.boundingSphere = {
          center: a.center.toArray(),
          radius: a.radius,
        }),
      t
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    (this.index = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null);
    const e = {};
    this.name = t.name;
    const n = t.index;
    null !== n && this.setIndex(n.clone());
    const i = t.attributes;
    for (const l in i) {
      const t = i[l];
      this.setAttribute(l, t.clone(e));
    }
    const r = t.morphAttributes;
    for (const l in r) {
      const t = [],
        n = r[l];
      for (let i = 0, r = n.length; i < r; i++) t.push(n[i].clone(e));
      this.morphAttributes[l] = t;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const s = t.groups;
    for (let l = 0, c = s.length; l < c; l++) {
      const t = s[l];
      this.addGroup(t.start, t.count, t.materialIndex);
    }
    const a = t.boundingBox;
    null !== a && (this.boundingBox = a.clone());
    const o = t.boundingSphere;
    return (
      null !== o && (this.boundingSphere = o.clone()),
      (this.drawRange.start = t.drawRange.start),
      (this.drawRange.count = t.drawRange.count),
      (this.userData = t.userData),
      this
    );
  }
  dispose() {
    this.dispatchEvent({
      type: "dispose",
    });
  }
}
const Di = new En(),
  Ni = new Mn(),
  Oi = new pn(),
  Fi = new Xe(),
  Bi = new Xe(),
  zi = new Xe(),
  Gi = new Xe(),
  Hi = new Xe(),
  ki = new Xe(),
  Vi = new Xe(),
  Wi = new Xe();
class Xi extends Kn {
  constructor(t = new Li(), e = new vi()) {
    super(),
      (this.isMesh = !0),
      (this.type = "Mesh"),
      (this.geometry = t),
      (this.material = e),
      (this.morphTargetDictionary = void 0),
      (this.morphTargetInfluences = void 0),
      this.updateMorphTargets();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      void 0 !== t.morphTargetInfluences &&
        (this.morphTargetInfluences = t.morphTargetInfluences.slice()),
      void 0 !== t.morphTargetDictionary &&
        (this.morphTargetDictionary = Object.assign(
          {},
          t.morphTargetDictionary
        )),
      (this.material = Array.isArray(t.material)
        ? t.material.slice()
        : t.material),
      (this.geometry = t.geometry),
      this
    );
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes,
      e = Object.keys(t);
    if (e.length > 0) {
      const n = t[e[0]];
      if (void 0 !== n) {
        (this.morphTargetInfluences = []), (this.morphTargetDictionary = {});
        for (let t = 0, e = n.length; t < e; t++) {
          const e = n[t].name || String(t);
          this.morphTargetInfluences.push(0),
            (this.morphTargetDictionary[e] = t);
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry,
      i = n.attributes.position,
      r = n.morphAttributes.position,
      s = n.morphTargetsRelative;
    e.fromBufferAttribute(i, t);
    const a = this.morphTargetInfluences;
    if (r && a) {
      ki.set(0, 0, 0);
      for (let n = 0, i = r.length; n < i; n++) {
        const i = a[n],
          o = r[n];
        0 !== i &&
          (Hi.fromBufferAttribute(o, t),
          s ? ki.addScaledVector(Hi, i) : ki.addScaledVector(Hi.sub(e), i));
      }
      e.add(ki);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry,
      i = this.material,
      r = this.matrixWorld;
    if (void 0 !== i) {
      if (
        (null === n.boundingSphere && n.computeBoundingSphere(),
        Oi.copy(n.boundingSphere),
        Oi.applyMatrix4(r),
        Ni.copy(t.ray).recast(t.near),
        !1 === Oi.containsPoint(Ni.origin))
      ) {
        if (null === Ni.intersectSphere(Oi, Fi)) return;
        if (Ni.origin.distanceToSquared(Fi) > (t.far - t.near) ** 2) return;
      }
      Di.copy(r).invert(),
        Ni.copy(t.ray).applyMatrix4(Di),
        (null !== n.boundingBox && !1 === Ni.intersectsBox(n.boundingBox)) ||
          this._computeIntersections(t, e, Ni);
    }
  }
  _computeIntersections(t, e, n) {
    let i;
    const r = this.geometry,
      s = this.material,
      a = r.index,
      o = r.attributes.position,
      l = r.attributes.uv,
      c = r.attributes.uv1,
      h = r.attributes.normal,
      u = r.groups,
      d = r.drawRange;
    if (null !== a)
      if (Array.isArray(s))
        for (let p = 0, f = u.length; p < f; p++) {
          const r = u[p],
            o = s[r.materialIndex];
          for (
            let s = Math.max(r.start, d.start),
              u = Math.min(
                a.count,
                Math.min(r.start + r.count, d.start + d.count)
              );
            s < u;
            s += 3
          ) {
            (i = ji(
              this,
              o,
              t,
              n,
              l,
              c,
              h,
              a.getX(s),
              a.getX(s + 1),
              a.getX(s + 2)
            )),
              i &&
                ((i.faceIndex = Math.floor(s / 3)),
                (i.face.materialIndex = r.materialIndex),
                e.push(i));
          }
        }
      else {
        for (
          let r = Math.max(0, d.start),
            o = Math.min(a.count, d.start + d.count);
          r < o;
          r += 3
        ) {
          (i = ji(
            this,
            s,
            t,
            n,
            l,
            c,
            h,
            a.getX(r),
            a.getX(r + 1),
            a.getX(r + 2)
          )),
            i && ((i.faceIndex = Math.floor(r / 3)), e.push(i));
        }
      }
    else if (void 0 !== o)
      if (Array.isArray(s))
        for (let p = 0, f = u.length; p < f; p++) {
          const r = u[p],
            a = s[r.materialIndex];
          for (
            let s = Math.max(r.start, d.start),
              u = Math.min(
                o.count,
                Math.min(r.start + r.count, d.start + d.count)
              );
            s < u;
            s += 3
          ) {
            (i = ji(this, a, t, n, l, c, h, s, s + 1, s + 2)),
              i &&
                ((i.faceIndex = Math.floor(s / 3)),
                (i.face.materialIndex = r.materialIndex),
                e.push(i));
          }
        }
      else {
        for (
          let r = Math.max(0, d.start),
            a = Math.min(o.count, d.start + d.count);
          r < a;
          r += 3
        ) {
          (i = ji(this, s, t, n, l, c, h, r, r + 1, r + 2)),
            i && ((i.faceIndex = Math.floor(r / 3)), e.push(i));
        }
      }
  }
}
function ji(t, e, n, i, r, s, a, o, l, c) {
  t.getVertexPosition(o, Bi),
    t.getVertexPosition(l, zi),
    t.getVertexPosition(c, Gi);
  const h = (function (t, e, n, i, r, s, a, o) {
    let l;
    if (
      ((l =
        1 === e.side
          ? i.intersectTriangle(a, s, r, !0, o)
          : i.intersectTriangle(r, s, a, 0 === e.side, o)),
      null === l)
    )
      return null;
    Wi.copy(o), Wi.applyMatrix4(t.matrixWorld);
    const c = n.ray.origin.distanceTo(Wi);
    return c < n.near || c > n.far
      ? null
      : {
          distance: c,
          point: Wi.clone(),
          object: t,
        };
  })(t, e, n, i, Bi, zi, Gi, Vi);
  if (h) {
    const t = new Xe();
    ci.getBarycoord(Vi, Bi, zi, Gi, t),
      r && (h.uv = ci.getInterpolatedAttribute(r, o, l, c, t, new ve())),
      s && (h.uv1 = ci.getInterpolatedAttribute(s, o, l, c, t, new ve())),
      a &&
        ((h.normal = ci.getInterpolatedAttribute(a, o, l, c, t, new Xe())),
        h.normal.dot(i.direction) > 0 && h.normal.multiplyScalar(-1));
    const e = {
      a: o,
      b: l,
      c: c,
      normal: new Xe(),
      materialIndex: 0,
    };
    ci.getNormal(Bi, zi, Gi, e.normal), (h.face = e), (h.barycoord = t);
  }
  return h;
}
class qi extends Li {
  constructor(t = 1, e = 1, n = 1, i = 1, r = 1, s = 1) {
    super(),
      (this.type = "BoxGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        depth: n,
        widthSegments: i,
        heightSegments: r,
        depthSegments: s,
      });
    const a = this;
    (i = Math.floor(i)), (r = Math.floor(r)), (s = Math.floor(s));
    const o = [],
      l = [],
      c = [],
      h = [];
    let u = 0,
      d = 0;
    function p(t, e, n, i, r, s, p, f, m, g, _) {
      const v = s / m,
        x = p / g,
        S = s / 2,
        M = p / 2,
        E = f / 2,
        T = m + 1,
        y = g + 1;
      let b = 0,
        w = 0;
      const A = new Xe();
      for (let a = 0; a < y; a++) {
        const s = a * x - M;
        for (let o = 0; o < T; o++) {
          const u = o * v - S;
          (A[t] = u * i),
            (A[e] = s * r),
            (A[n] = E),
            l.push(A.x, A.y, A.z),
            (A[t] = 0),
            (A[e] = 0),
            (A[n] = f > 0 ? 1 : -1),
            c.push(A.x, A.y, A.z),
            h.push(o / m),
            h.push(1 - a / g),
            (b += 1);
        }
      }
      for (let a = 0; a < g; a++)
        for (let t = 0; t < m; t++) {
          const e = u + t + T * a,
            n = u + t + T * (a + 1),
            i = u + (t + 1) + T * (a + 1),
            r = u + (t + 1) + T * a;
          o.push(e, n, r), o.push(n, i, r), (w += 6);
        }
      a.addGroup(d, w, _), (d += w), (u += b);
    }
    p("z", "y", "x", -1, -1, n, e, t, s, r, 0),
      p("z", "y", "x", 1, -1, n, e, -t, s, r, 1),
      p("x", "z", "y", 1, 1, t, n, e, i, s, 2),
      p("x", "z", "y", 1, -1, t, n, -e, i, s, 3),
      p("x", "y", "z", 1, -1, t, e, n, i, r, 4),
      p("x", "y", "z", -1, -1, t, e, -n, i, r, 5),
      this.setIndex(o),
      this.setAttribute("position", new bi(l, 3)),
      this.setAttribute("normal", new bi(c, 3)),
      this.setAttribute("uv", new bi(h, 2));
  }
  copy(t) {
    return (
      super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
    );
  }
  static fromJSON(t) {
    return new qi(
      t.width,
      t.height,
      t.depth,
      t.widthSegments,
      t.heightSegments,
      t.depthSegments
    );
  }
}
function Yi(t) {
  const e = {};
  for (const n in t) {
    e[n] = {};
    for (const i in t[n]) {
      const r = t[n][i];
      r &&
      (r.isColor ||
        r.isMatrix3 ||
        r.isMatrix4 ||
        r.isVector2 ||
        r.isVector3 ||
        r.isVector4 ||
        r.isTexture ||
        r.isQuaternion)
        ? r.isRenderTargetTexture
          ? (console.warn(
              "UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."
            ),
            (e[n][i] = null))
          : (e[n][i] = r.clone())
        : Array.isArray(r)
        ? (e[n][i] = r.slice())
        : (e[n][i] = r);
    }
  }
  return e;
}
function Ki(t) {
  const e = {};
  for (let n = 0; n < t.length; n++) {
    const i = Yi(t[n]);
    for (const t in i) e[t] = i[t];
  }
  return e;
}
function Zi(t) {
  const e = t.getRenderTarget();
  return null === e
    ? t.outputColorSpace
    : !0 === e.isXRRenderTarget
    ? e.texture.colorSpace
    : Re.workingColorSpace;
}
const Ji = {
  clone: Yi,
  merge: Ki,
};
class $i extends _i {
  constructor(t) {
    super(),
      (this.isShaderMaterial = !0),
      (this.type = "ShaderMaterial"),
      (this.defines = {}),
      (this.uniforms = {}),
      (this.uniformsGroups = []),
      (this.vertexShader =
        "void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}"),
      (this.fragmentShader =
        "void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}"),
      (this.linewidth = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.fog = !1),
      (this.lights = !1),
      (this.clipping = !1),
      (this.forceSinglePass = !0),
      (this.extensions = {
        clipCullDistance: !1,
        multiDraw: !1,
      }),
      (this.defaultAttributeValues = {
        color: [1, 1, 1],
        uv: [0, 0],
        uv1: [0, 0],
      }),
      (this.index0AttributeName = void 0),
      (this.uniformsNeedUpdate = !1),
      (this.glslVersion = null),
      void 0 !== t && this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.fragmentShader = t.fragmentShader),
      (this.vertexShader = t.vertexShader),
      (this.uniforms = Yi(t.uniforms)),
      (this.uniformsGroups = (function (t) {
        const e = [];
        for (let n = 0; n < t.length; n++) e.push(t[n].clone());
        return e;
      })(t.uniformsGroups)),
      (this.defines = Object.assign({}, t.defines)),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.fog = t.fog),
      (this.lights = t.lights),
      (this.clipping = t.clipping),
      (this.extensions = Object.assign({}, t.extensions)),
      (this.glslVersion = t.glslVersion),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    (e.glslVersion = this.glslVersion), (e.uniforms = {});
    for (const i in this.uniforms) {
      const n = this.uniforms[i].value;
      n && n.isTexture
        ? (e.uniforms[i] = {
            type: "t",
            value: n.toJSON(t).uuid,
          })
        : n && n.isColor
        ? (e.uniforms[i] = {
            type: "c",
            value: n.getHex(),
          })
        : n && n.isVector2
        ? (e.uniforms[i] = {
            type: "v2",
            value: n.toArray(),
          })
        : n && n.isVector3
        ? (e.uniforms[i] = {
            type: "v3",
            value: n.toArray(),
          })
        : n && n.isVector4
        ? (e.uniforms[i] = {
            type: "v4",
            value: n.toArray(),
          })
        : n && n.isMatrix3
        ? (e.uniforms[i] = {
            type: "m3",
            value: n.toArray(),
          })
        : n && n.isMatrix4
        ? (e.uniforms[i] = {
            type: "m4",
            value: n.toArray(),
          })
        : (e.uniforms[i] = {
            value: n,
          });
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines),
      (e.vertexShader = this.vertexShader),
      (e.fragmentShader = this.fragmentShader),
      (e.lights = this.lights),
      (e.clipping = this.clipping);
    const n = {};
    for (const i in this.extensions) !0 === this.extensions[i] && (n[i] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class Qi extends Kn {
  constructor() {
    super(),
      (this.isCamera = !0),
      (this.type = "Camera"),
      (this.matrixWorldInverse = new En()),
      (this.projectionMatrix = new En()),
      (this.projectionMatrixInverse = new En()),
      (this.coordinateSystem = oe);
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      this.matrixWorldInverse.copy(t.matrixWorldInverse),
      this.projectionMatrix.copy(t.projectionMatrix),
      this.projectionMatrixInverse.copy(t.projectionMatrixInverse),
      (this.coordinateSystem = t.coordinateSystem),
      this
    );
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t),
      this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e),
      this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const tr = new Xe(),
  er = new ve(),
  nr = new ve();
class ir extends Qi {
  constructor(t = 50, e = 1, n = 0.1, i = 2e3) {
    super(),
      (this.isPerspectiveCamera = !0),
      (this.type = "PerspectiveCamera"),
      (this.fov = t),
      (this.zoom = 1),
      (this.near = n),
      (this.far = i),
      (this.focus = 10),
      (this.aspect = e),
      (this.view = null),
      (this.filmGauge = 35),
      (this.filmOffset = 0),
      this.updateProjectionMatrix();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.fov = t.fov),
      (this.zoom = t.zoom),
      (this.near = t.near),
      (this.far = t.far),
      (this.focus = t.focus),
      (this.aspect = t.aspect),
      (this.view = null === t.view ? null : Object.assign({}, t.view)),
      (this.filmGauge = t.filmGauge),
      (this.filmOffset = t.filmOffset),
      this
    );
  }
  setFocalLength(t) {
    const e = (0.5 * this.getFilmHeight()) / t;
    (this.fov = 2 * de * Math.atan(e)), this.updateProjectionMatrix();
  }
  getFocalLength() {
    const t = Math.tan(0.5 * ue * this.fov);
    return (0.5 * this.getFilmHeight()) / t;
  }
  getEffectiveFOV() {
    return 2 * de * Math.atan(Math.tan(0.5 * ue * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(t, e, n) {
    tr.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      e.set(tr.x, tr.y).multiplyScalar(-t / tr.z),
      tr.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      n.set(tr.x, tr.y).multiplyScalar(-t / tr.z);
  }
  getViewSize(t, e) {
    return this.getViewBounds(t, er, nr), e.subVectors(nr, er);
  }
  setViewOffset(t, e, n, i, r, s) {
    (this.aspect = t / e),
      null === this.view &&
        (this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1,
        }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = i),
      (this.view.width = r),
      (this.view.height = s),
      this.updateProjectionMatrix();
  }
  clearViewOffset() {
    null !== this.view && (this.view.enabled = !1),
      this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = (t * Math.tan(0.5 * ue * this.fov)) / this.zoom,
      n = 2 * e,
      i = this.aspect * n,
      r = -0.5 * i;
    const s = this.view;
    if (null !== this.view && this.view.enabled) {
      const t = s.fullWidth,
        a = s.fullHeight;
      (r += (s.offsetX * i) / t),
        (e -= (s.offsetY * n) / a),
        (i *= s.width / t),
        (n *= s.height / a);
    }
    const a = this.filmOffset;
    0 !== a && (r += (t * a) / this.getFilmWidth()),
      this.projectionMatrix.makePerspective(
        r,
        r + i,
        e,
        e - n,
        t,
        this.far,
        this.coordinateSystem
      ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.fov = this.fov),
      (e.object.zoom = this.zoom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      (e.object.focus = this.focus),
      (e.object.aspect = this.aspect),
      null !== this.view && (e.object.view = Object.assign({}, this.view)),
      (e.object.filmGauge = this.filmGauge),
      (e.object.filmOffset = this.filmOffset),
      e
    );
  }
}
const rr = -90;
class sr extends Kn {
  constructor(t, e, n) {
    super(),
      (this.type = "CubeCamera"),
      (this.renderTarget = n),
      (this.coordinateSystem = null),
      (this.activeMipmapLevel = 0);
    const i = new ir(rr, 1, t, e);
    (i.layers = this.layers), this.add(i);
    const r = new ir(rr, 1, t, e);
    (r.layers = this.layers), this.add(r);
    const s = new ir(rr, 1, t, e);
    (s.layers = this.layers), this.add(s);
    const a = new ir(rr, 1, t, e);
    (a.layers = this.layers), this.add(a);
    const o = new ir(rr, 1, t, e);
    (o.layers = this.layers), this.add(o);
    const l = new ir(rr, 1, t, e);
    (l.layers = this.layers), this.add(l);
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem,
      e = this.children.concat(),
      [n, i, r, s, a, o] = e;
    for (const l of e) this.remove(l);
    if (t === oe)
      n.up.set(0, 1, 0),
        n.lookAt(1, 0, 0),
        i.up.set(0, 1, 0),
        i.lookAt(-1, 0, 0),
        r.up.set(0, 0, -1),
        r.lookAt(0, 1, 0),
        s.up.set(0, 0, 1),
        s.lookAt(0, -1, 0),
        a.up.set(0, 1, 0),
        a.lookAt(0, 0, 1),
        o.up.set(0, 1, 0),
        o.lookAt(0, 0, -1);
    else {
      if (t !== le)
        throw new Error(
          "THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
            t
        );
      n.up.set(0, -1, 0),
        n.lookAt(-1, 0, 0),
        i.up.set(0, -1, 0),
        i.lookAt(1, 0, 0),
        r.up.set(0, 0, 1),
        r.lookAt(0, 1, 0),
        s.up.set(0, 0, -1),
        s.lookAt(0, -1, 0),
        a.up.set(0, -1, 0),
        a.lookAt(0, 0, 1),
        o.up.set(0, -1, 0),
        o.lookAt(0, 0, -1);
    }
    for (const l of e) this.add(l), l.updateMatrixWorld();
  }
  update(t, e) {
    null === this.parent && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: i } = this;
    this.coordinateSystem !== t.coordinateSystem &&
      ((this.coordinateSystem = t.coordinateSystem),
      this.updateCoordinateSystem());
    const [r, s, a, o, l, c] = this.children,
      h = t.getRenderTarget(),
      u = t.getActiveCubeFace(),
      d = t.getActiveMipmapLevel(),
      p = t.xr.enabled;
    t.xr.enabled = !1;
    const f = n.texture.generateMipmaps;
    (n.texture.generateMipmaps = !1),
      t.setRenderTarget(n, 0, i),
      t.render(e, r),
      t.setRenderTarget(n, 1, i),
      t.render(e, s),
      t.setRenderTarget(n, 2, i),
      t.render(e, a),
      t.setRenderTarget(n, 3, i),
      t.render(e, o),
      t.setRenderTarget(n, 4, i),
      t.render(e, l),
      (n.texture.generateMipmaps = f),
      t.setRenderTarget(n, 5, i),
      t.render(e, c),
      t.setRenderTarget(h, u, d),
      (t.xr.enabled = p),
      (n.texture.needsPMREMUpdate = !0);
  }
}
class ar extends Be {
  constructor(t = [], e = 301, n, i, r, s, a, o, l, c) {
    super(t, e, n, i, r, s, a, o, l, c),
      (this.isCubeTexture = !0),
      (this.flipY = !1);
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class or extends He {
  constructor(t = 1, e = {}) {
    super(t, t, e), (this.isWebGLCubeRenderTarget = !0);
    const n = {
        width: t,
        height: t,
        depth: 1,
      },
      i = [n, n, n, n, n, n];
    (this.texture = new ar(
      i,
      e.mapping,
      e.wrapS,
      e.wrapT,
      e.magFilter,
      e.minFilter,
      e.format,
      e.type,
      e.anisotropy,
      e.colorSpace
    )),
      (this.texture.isRenderTargetTexture = !0),
      (this.texture.generateMipmaps =
        void 0 !== e.generateMipmaps && e.generateMipmaps),
      (this.texture.minFilter = void 0 !== e.minFilter ? e.minFilter : Y);
  }
  fromEquirectangularTexture(t, e) {
    (this.texture.type = e.type),
      (this.texture.colorSpace = e.colorSpace),
      (this.texture.generateMipmaps = e.generateMipmaps),
      (this.texture.minFilter = e.minFilter),
      (this.texture.magFilter = e.magFilter);
    const n = {
        uniforms: {
          tEquirect: {
            value: null,
          },
        },
        vertexShader:
          "\n\n\t\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\t\tvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t\t\t\t\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n\t\t\t\t}\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t\t\t\t\t#include <begin_vertex>\n\t\t\t\t\t#include <project_vertex>\n\n\t\t\t\t}\n\t\t\t",
        fragmentShader:
          "\n\n\t\t\t\tuniform sampler2D tEquirect;\n\n\t\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\t\t#include <common>\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\tvec3 direction = normalize( vWorldDirection );\n\n\t\t\t\t\tvec2 sampleUV = equirectUv( direction );\n\n\t\t\t\t\tgl_FragColor = texture2D( tEquirect, sampleUV );\n\n\t\t\t\t}\n\t\t\t",
      },
      i = new qi(5, 5, 5),
      r = new $i({
        name: "CubemapFromEquirect",
        uniforms: Yi(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: 1,
        blending: 0,
      });
    r.uniforms.tEquirect.value = e;
    const s = new Xi(i, r),
      a = e.minFilter;
    e.minFilter === Z && (e.minFilter = Y);
    return (
      new sr(1, 10, this).update(t, s),
      (e.minFilter = a),
      s.geometry.dispose(),
      s.material.dispose(),
      this
    );
  }
  clear(t, e = !0, n = !0, i = !0) {
    const r = t.getRenderTarget();
    for (let s = 0; s < 6; s++) t.setRenderTarget(this, s), t.clear(e, n, i);
    t.setRenderTarget(r);
  }
}
class lr extends Kn {
  constructor() {
    super(), (this.isGroup = !0), (this.type = "Group");
  }
}
const cr = {
  type: "move",
};
class hr {
  constructor() {
    (this._targetRay = null), (this._grip = null), (this._hand = null);
  }
  getHandSpace() {
    return (
      null === this._hand &&
        ((this._hand = new lr()),
        (this._hand.matrixAutoUpdate = !1),
        (this._hand.visible = !1),
        (this._hand.joints = {}),
        (this._hand.inputState = {
          pinching: !1,
        })),
      this._hand
    );
  }
  getTargetRaySpace() {
    return (
      null === this._targetRay &&
        ((this._targetRay = new lr()),
        (this._targetRay.matrixAutoUpdate = !1),
        (this._targetRay.visible = !1),
        (this._targetRay.hasLinearVelocity = !1),
        (this._targetRay.linearVelocity = new Xe()),
        (this._targetRay.hasAngularVelocity = !1),
        (this._targetRay.angularVelocity = new Xe())),
      this._targetRay
    );
  }
  getGripSpace() {
    return (
      null === this._grip &&
        ((this._grip = new lr()),
        (this._grip.matrixAutoUpdate = !1),
        (this._grip.visible = !1),
        (this._grip.hasLinearVelocity = !1),
        (this._grip.linearVelocity = new Xe()),
        (this._grip.hasAngularVelocity = !1),
        (this._grip.angularVelocity = new Xe())),
      this._grip
    );
  }
  dispatchEvent(t) {
    return (
      null !== this._targetRay && this._targetRay.dispatchEvent(t),
      null !== this._grip && this._grip.dispatchEvent(t),
      null !== this._hand && this._hand.dispatchEvent(t),
      this
    );
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e) for (const n of t.hand.values()) this._getHandJoint(e, n);
    }
    return (
      this.dispatchEvent({
        type: "connected",
        data: t,
      }),
      this
    );
  }
  disconnect(t) {
    return (
      this.dispatchEvent({
        type: "disconnected",
        data: t,
      }),
      null !== this._targetRay && (this._targetRay.visible = !1),
      null !== this._grip && (this._grip.visible = !1),
      null !== this._hand && (this._hand.visible = !1),
      this
    );
  }
  update(t, e, n) {
    let i = null,
      r = null,
      s = null;
    const a = this._targetRay,
      o = this._grip,
      l = this._hand;
    if (t && "visible-blurred" !== e.session.visibilityState) {
      if (l && t.hand) {
        s = !0;
        for (const s of t.hand.values()) {
          const t = e.getJointPose(s, n),
            i = this._getHandJoint(l, s);
          null !== t &&
            (i.matrix.fromArray(t.transform.matrix),
            i.matrix.decompose(i.position, i.rotation, i.scale),
            (i.matrixWorldNeedsUpdate = !0),
            (i.jointRadius = t.radius)),
            (i.visible = null !== t);
        }
        const i = l.joints["index-finger-tip"],
          r = l.joints["thumb-tip"],
          a = i.position.distanceTo(r.position),
          o = 0.02,
          c = 0.005;
        l.inputState.pinching && a > o + c
          ? ((l.inputState.pinching = !1),
            this.dispatchEvent({
              type: "pinchend",
              handedness: t.handedness,
              target: this,
            }))
          : !l.inputState.pinching &&
            a <= o - c &&
            ((l.inputState.pinching = !0),
            this.dispatchEvent({
              type: "pinchstart",
              handedness: t.handedness,
              target: this,
            }));
      } else
        null !== o &&
          t.gripSpace &&
          ((r = e.getPose(t.gripSpace, n)),
          null !== r &&
            (o.matrix.fromArray(r.transform.matrix),
            o.matrix.decompose(o.position, o.rotation, o.scale),
            (o.matrixWorldNeedsUpdate = !0),
            r.linearVelocity
              ? ((o.hasLinearVelocity = !0),
                o.linearVelocity.copy(r.linearVelocity))
              : (o.hasLinearVelocity = !1),
            r.angularVelocity
              ? ((o.hasAngularVelocity = !0),
                o.angularVelocity.copy(r.angularVelocity))
              : (o.hasAngularVelocity = !1)));
      null !== a &&
        ((i = e.getPose(t.targetRaySpace, n)),
        null === i && null !== r && (i = r),
        null !== i &&
          (a.matrix.fromArray(i.transform.matrix),
          a.matrix.decompose(a.position, a.rotation, a.scale),
          (a.matrixWorldNeedsUpdate = !0),
          i.linearVelocity
            ? ((a.hasLinearVelocity = !0),
              a.linearVelocity.copy(i.linearVelocity))
            : (a.hasLinearVelocity = !1),
          i.angularVelocity
            ? ((a.hasAngularVelocity = !0),
              a.angularVelocity.copy(i.angularVelocity))
            : (a.hasAngularVelocity = !1),
          this.dispatchEvent(cr)));
    }
    return (
      null !== a && (a.visible = null !== i),
      null !== o && (o.visible = null !== r),
      null !== l && (l.visible = null !== s),
      this
    );
  }
  _getHandJoint(t, e) {
    if (void 0 === t.joints[e.jointName]) {
      const n = new lr();
      (n.matrixAutoUpdate = !1),
        (n.visible = !1),
        (t.joints[e.jointName] = n),
        t.add(n);
    }
    return t.joints[e.jointName];
  }
}
class ur extends Kn {
  constructor() {
    super(),
      (this.isScene = !0),
      (this.type = "Scene"),
      (this.background = null),
      (this.environment = null),
      (this.fog = null),
      (this.backgroundBlurriness = 0),
      (this.backgroundIntensity = 1),
      (this.backgroundRotation = new In()),
      (this.environmentIntensity = 1),
      (this.environmentRotation = new In()),
      (this.overrideMaterial = null),
      "undefined" != typeof __THREE_DEVTOOLS__ &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", {
            detail: this,
          })
        );
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      null !== t.background && (this.background = t.background.clone()),
      null !== t.environment && (this.environment = t.environment.clone()),
      null !== t.fog && (this.fog = t.fog.clone()),
      (this.backgroundBlurriness = t.backgroundBlurriness),
      (this.backgroundIntensity = t.backgroundIntensity),
      this.backgroundRotation.copy(t.backgroundRotation),
      (this.environmentIntensity = t.environmentIntensity),
      this.environmentRotation.copy(t.environmentRotation),
      null !== t.overrideMaterial &&
        (this.overrideMaterial = t.overrideMaterial.clone()),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      null !== this.fog && (e.object.fog = this.fog.toJSON()),
      this.backgroundBlurriness > 0 &&
        (e.object.backgroundBlurriness = this.backgroundBlurriness),
      1 !== this.backgroundIntensity &&
        (e.object.backgroundIntensity = this.backgroundIntensity),
      (e.object.backgroundRotation = this.backgroundRotation.toArray()),
      1 !== this.environmentIntensity &&
        (e.object.environmentIntensity = this.environmentIntensity),
      (e.object.environmentRotation = this.environmentRotation.toArray()),
      e
    );
  }
}
const dr = new Xe(),
  pr = new Xe(),
  fr = new xe();
class mr {
  constructor(t = new Xe(1, 0, 0), e = 0) {
    (this.isPlane = !0), (this.normal = t), (this.constant = e);
  }
  set(t, e) {
    return this.normal.copy(t), (this.constant = e), this;
  }
  setComponents(t, e, n, i) {
    return this.normal.set(t, e, n), (this.constant = i), this;
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), (this.constant = -e.dot(this.normal)), this;
  }
  setFromCoplanarPoints(t, e, n) {
    const i = dr.subVectors(n, e).cross(pr.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(i, t), this;
  }
  copy(t) {
    return this.normal.copy(t.normal), (this.constant = t.constant), this;
  }
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), (this.constant *= t), this;
  }
  negate() {
    return (this.constant *= -1), this.normal.negate(), this;
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(dr),
      i = this.normal.dot(n);
    if (0 === i)
      return 0 === this.distanceToPoint(t.start) ? e.copy(t.start) : null;
    const r = -(t.start.dot(this.normal) + this.constant) / i;
    return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start),
      n = this.distanceToPoint(t.end);
    return (e < 0 && n > 0) || (n < 0 && e > 0);
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || fr.getNormalMatrix(t),
      i = this.coplanarPoint(dr).applyMatrix4(t),
      r = this.normal.applyMatrix3(n).normalize();
    return (this.constant = -i.dot(r)), this;
  }
  translate(t) {
    return (this.constant -= t.dot(this.normal)), this;
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const gr = new pn(),
  _r = new Xe();
class vr {
  constructor(
    t = new mr(),
    e = new mr(),
    n = new mr(),
    i = new mr(),
    r = new mr(),
    s = new mr()
  ) {
    this.planes = [t, e, n, i, r, s];
  }
  set(t, e, n, i, r, s) {
    const a = this.planes;
    return (
      a[0].copy(t),
      a[1].copy(e),
      a[2].copy(n),
      a[3].copy(i),
      a[4].copy(r),
      a[5].copy(s),
      this
    );
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = 2e3) {
    const n = this.planes,
      i = t.elements,
      r = i[0],
      s = i[1],
      a = i[2],
      o = i[3],
      l = i[4],
      c = i[5],
      h = i[6],
      u = i[7],
      d = i[8],
      p = i[9],
      f = i[10],
      m = i[11],
      g = i[12],
      _ = i[13],
      v = i[14],
      x = i[15];
    if (
      (n[0].setComponents(o - r, u - l, m - d, x - g).normalize(),
      n[1].setComponents(o + r, u + l, m + d, x + g).normalize(),
      n[2].setComponents(o + s, u + c, m + p, x + _).normalize(),
      n[3].setComponents(o - s, u - c, m - p, x - _).normalize(),
      n[4].setComponents(o - a, u - h, m - f, x - v).normalize(),
      e === oe)
    )
      n[5].setComponents(o + a, u + h, m + f, x + v).normalize();
    else {
      if (e !== le)
        throw new Error(
          "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
            e
        );
      n[5].setComponents(a, h, f, v).normalize();
    }
    return this;
  }
  intersectsObject(t) {
    if (void 0 !== t.boundingSphere)
      null === t.boundingSphere && t.computeBoundingSphere(),
        gr.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      null === e.boundingSphere && e.computeBoundingSphere(),
        gr.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(gr);
  }
  intersectsSprite(t) {
    return (
      gr.center.set(0, 0, 0),
      (gr.radius = 0.7071067811865476),
      gr.applyMatrix4(t.matrixWorld),
      this.intersectsSphere(gr)
    );
  }
  intersectsSphere(t) {
    const e = this.planes,
      n = t.center,
      i = -t.radius;
    for (let r = 0; r < 6; r++) {
      if (e[r].distanceToPoint(n) < i) return !1;
    }
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const i = e[n];
      if (
        ((_r.x = i.normal.x > 0 ? t.max.x : t.min.x),
        (_r.y = i.normal.y > 0 ? t.max.y : t.min.y),
        (_r.z = i.normal.z > 0 ? t.max.z : t.min.z),
        i.distanceToPoint(_r) < 0)
      )
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class xr extends Be {
  constructor(t, e, n = 1014, i, r, s, a = 1003, o = 1003, l, c = 1026) {
    if (c !== ht && c !== ut)
      throw new Error(
        "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat"
      );
    super(null, i, r, s, a, o, c, n, l),
      (this.isDepthTexture = !0),
      (this.image = {
        width: t,
        height: e,
      }),
      (this.flipY = !1),
      (this.generateMipmaps = !1),
      (this.compareFunction = null);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.source = new Ne(Object.assign({}, t.image))),
      (this.compareFunction = t.compareFunction),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      null !== this.compareFunction &&
        (e.compareFunction = this.compareFunction),
      e
    );
  }
}
class Sr extends Li {
  constructor(t = 1, e = 1, n = 1, i = 1) {
    super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        widthSegments: n,
        heightSegments: i,
      });
    const r = t / 2,
      s = e / 2,
      a = Math.floor(n),
      o = Math.floor(i),
      l = a + 1,
      c = o + 1,
      h = t / a,
      u = e / o,
      d = [],
      p = [],
      f = [],
      m = [];
    for (let g = 0; g < c; g++) {
      const t = g * u - s;
      for (let e = 0; e < l; e++) {
        const n = e * h - r;
        p.push(n, -t, 0), f.push(0, 0, 1), m.push(e / a), m.push(1 - g / o);
      }
    }
    for (let g = 0; g < o; g++)
      for (let t = 0; t < a; t++) {
        const e = t + l * g,
          n = t + l * (g + 1),
          i = t + 1 + l * (g + 1),
          r = t + 1 + l * g;
        d.push(e, n, r), d.push(n, i, r);
      }
    this.setIndex(d),
      this.setAttribute("position", new bi(p, 3)),
      this.setAttribute("normal", new bi(f, 3)),
      this.setAttribute("uv", new bi(m, 2));
  }
  copy(t) {
    return (
      super.copy(t), (this.parameters = Object.assign({}, t.parameters)), this
    );
  }
  static fromJSON(t) {
    return new Sr(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
class Mr extends _i {
  constructor(t) {
    super(),
      (this.isMeshDepthMaterial = !0),
      (this.type = "MeshDepthMaterial"),
      (this.depthPacking = 3200),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.depthPacking = t.depthPacking),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      this
    );
  }
}
class Er extends _i {
  constructor(t) {
    super(),
      (this.isMeshDistanceMaterial = !0),
      (this.type = "MeshDistanceMaterial"),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      this.setValues(t);
  }
  copy(t) {
    return (
      super.copy(t),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      this
    );
  }
}
const Tr = {
  enabled: !1,
  files: {},
  add: function (t, e) {
    !1 !== this.enabled && (this.files[t] = e);
  },
  get: function (t) {
    if (!1 !== this.enabled) return this.files[t];
  },
  remove: function (t) {
    delete this.files[t];
  },
  clear: function () {
    this.files = {};
  },
};
class yr {
  constructor(t, e, n) {
    const i = this;
    let r,
      s = !1,
      a = 0,
      o = 0;
    const l = [];
    (this.onStart = void 0),
      (this.onLoad = t),
      (this.onProgress = e),
      (this.onError = n),
      (this.itemStart = function (t) {
        o++, !1 === s && void 0 !== i.onStart && i.onStart(t, a, o), (s = !0);
      }),
      (this.itemEnd = function (t) {
        a++,
          void 0 !== i.onProgress && i.onProgress(t, a, o),
          a === o && ((s = !1), void 0 !== i.onLoad && i.onLoad());
      }),
      (this.itemError = function (t) {
        void 0 !== i.onError && i.onError(t);
      }),
      (this.resolveURL = function (t) {
        return r ? r(t) : t;
      }),
      (this.setURLModifier = function (t) {
        return (r = t), this;
      }),
      (this.addHandler = function (t, e) {
        return l.push(t, e), this;
      }),
      (this.removeHandler = function (t) {
        const e = l.indexOf(t);
        return -1 !== e && l.splice(e, 2), this;
      }),
      (this.getHandler = function (t) {
        for (let e = 0, n = l.length; e < n; e += 2) {
          const n = l[e],
            i = l[e + 1];
          if ((n.global && (n.lastIndex = 0), n.test(t))) return i;
        }
        return null;
      });
  }
}
const br = new yr();
class wr {
  constructor(t) {
    (this.manager = void 0 !== t ? t : br),
      (this.crossOrigin = "anonymous"),
      (this.withCredentials = !1),
      (this.path = ""),
      (this.resourcePath = ""),
      (this.requestHeader = {});
  }
  load() {}
  loadAsync(t, e) {
    const n = this;
    return new Promise(function (i, r) {
      n.load(t, i, e, r);
    });
  }
  parse() {}
  setCrossOrigin(t) {
    return (this.crossOrigin = t), this;
  }
  setWithCredentials(t) {
    return (this.withCredentials = t), this;
  }
  setPath(t) {
    return (this.path = t), this;
  }
  setResourcePath(t) {
    return (this.resourcePath = t), this;
  }
  setRequestHeader(t) {
    return (this.requestHeader = t), this;
  }
}
wr.DEFAULT_MATERIAL_NAME = "__DEFAULT";
class Ar extends wr {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    void 0 !== this.path && (t = this.path + t),
      (t = this.manager.resolveURL(t));
    const r = this,
      s = Tr.get(t);
    if (void 0 !== s)
      return (
        r.manager.itemStart(t),
        setTimeout(function () {
          e && e(s), r.manager.itemEnd(t);
        }, 0),
        s
      );
    const a = Ee("img");
    function o() {
      c(), Tr.add(t, this), e && e(this), r.manager.itemEnd(t);
    }
    function l(e) {
      c(), i && i(e), r.manager.itemError(t), r.manager.itemEnd(t);
    }
    function c() {
      a.removeEventListener("load", o, !1),
        a.removeEventListener("error", l, !1);
    }
    return (
      a.addEventListener("load", o, !1),
      a.addEventListener("error", l, !1),
      "data:" !== t.slice(0, 5) &&
        void 0 !== this.crossOrigin &&
        (a.crossOrigin = this.crossOrigin),
      r.manager.itemStart(t),
      (a.src = t),
      a
    );
  }
}
class Cr extends wr {
  constructor(t) {
    super(t);
  }
  load(t, e, n, i) {
    const r = new Be(),
      s = new Ar(this.manager);
    return (
      s.setCrossOrigin(this.crossOrigin),
      s.setPath(this.path),
      s.load(
        t,
        function (t) {
          (r.image = t), (r.needsUpdate = !0), void 0 !== e && e(r);
        },
        n,
        i
      ),
      r
    );
  }
}
class Rr extends Qi {
  constructor(t = -1, e = 1, n = 1, i = -1, r = 0.1, s = 2e3) {
    super(),
      (this.isOrthographicCamera = !0),
      (this.type = "OrthographicCamera"),
      (this.zoom = 1),
      (this.view = null),
      (this.left = t),
      (this.right = e),
      (this.top = n),
      (this.bottom = i),
      (this.near = r),
      (this.far = s),
      this.updateProjectionMatrix();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.left = t.left),
      (this.right = t.right),
      (this.top = t.top),
      (this.bottom = t.bottom),
      (this.near = t.near),
      (this.far = t.far),
      (this.zoom = t.zoom),
      (this.view = null === t.view ? null : Object.assign({}, t.view)),
      this
    );
  }
  setViewOffset(t, e, n, i, r, s) {
    null === this.view &&
      (this.view = {
        enabled: !0,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1,
      }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = i),
      (this.view.width = r),
      (this.view.height = s),
      this.updateProjectionMatrix();
  }
  clearViewOffset() {
    null !== this.view && (this.view.enabled = !1),
      this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom),
      e = (this.top - this.bottom) / (2 * this.zoom),
      n = (this.right + this.left) / 2,
      i = (this.top + this.bottom) / 2;
    let r = n - t,
      s = n + t,
      a = i + e,
      o = i - e;
    if (null !== this.view && this.view.enabled) {
      const t = (this.right - this.left) / this.view.fullWidth / this.zoom,
        e = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      (r += t * this.view.offsetX),
        (s = r + t * this.view.width),
        (a -= e * this.view.offsetY),
        (o = a - e * this.view.height);
    }
    this.projectionMatrix.makeOrthographic(
      r,
      s,
      a,
      o,
      this.near,
      this.far,
      this.coordinateSystem
    ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.zoom = this.zoom),
      (e.object.left = this.left),
      (e.object.right = this.right),
      (e.object.top = this.top),
      (e.object.bottom = this.bottom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      null !== this.view && (e.object.view = Object.assign({}, this.view)),
      e
    );
  }
}
class Pr extends ir {
  constructor(t = []) {
    super(), (this.isArrayCamera = !0), (this.cameras = t), (this.index = 0);
  }
}
function Ur(t, e, n, i) {
  const r = (function (t) {
    switch (t) {
      case J:
      case $:
        return {
          byteLength: 1,
          components: 1,
        };
      case tt:
      case Q:
      case rt:
        return {
          byteLength: 2,
          components: 1,
        };
      case st:
      case at:
        return {
          byteLength: 2,
          components: 4,
        };
      case nt:
      case et:
      case it:
        return {
          byteLength: 4,
          components: 1,
        };
      case lt:
        return {
          byteLength: 4,
          components: 3,
        };
    }
    throw new Error(`Unknown texture type ${t}.`);
  })(i);
  switch (n) {
    case 1021:
    case 1024:
      return t * e;
    case 1025:
      return t * e * 2;
    case 1028:
    case dt:
      return ((t * e) / r.components) * r.byteLength;
    case 1030:
    case pt:
      return ((t * e * 2) / r.components) * r.byteLength;
    case 1022:
      return ((t * e * 3) / r.components) * r.byteLength;
    case ct:
    case ft:
      return ((t * e * 4) / r.components) * r.byteLength;
    case mt:
    case gt:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case _t:
    case vt:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case St:
    case Et:
      return (Math.max(t, 16) * Math.max(e, 8)) / 4;
    case xt:
    case Mt:
      return (Math.max(t, 8) * Math.max(e, 8)) / 2;
    case Tt:
    case yt:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case bt:
    case wt:
      return Math.floor((t + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case At:
      return Math.floor((t + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case Ct:
      return Math.floor((t + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case Rt:
      return Math.floor((t + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case Pt:
      return Math.floor((t + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case Ut:
      return Math.floor((t + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case It:
      return Math.floor((t + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case Lt:
      return Math.floor((t + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case Dt:
      return Math.floor((t + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case Nt:
      return Math.floor((t + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case Ot:
      return Math.floor((t + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case Ft:
      return Math.floor((t + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case Bt:
      return Math.floor((t + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case zt:
      return Math.floor((t + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    case Gt:
    case Ht:
    case kt:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 16;
    case 36283:
    case Vt:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 8;
    case Wt:
    case Xt:
      return Math.ceil(t / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${n} format.`);
}
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
function Ir() {
  let t = null,
    e = !1,
    n = null,
    i = null;
  function r(e, s) {
    n(e, s), (i = t.requestAnimationFrame(r));
  }
  return {
    start: function () {
      !0 !== e && null !== n && ((i = t.requestAnimationFrame(r)), (e = !0));
    },
    stop: function () {
      t.cancelAnimationFrame(i), (e = !1);
    },
    setAnimationLoop: function (t) {
      n = t;
    },
    setContext: function (e) {
      t = e;
    },
  };
}
function Lr(t) {
  const e = new WeakMap();
  return {
    get: function (t) {
      return t.isInterleavedBufferAttribute && (t = t.data), e.get(t);
    },
    remove: function (n) {
      n.isInterleavedBufferAttribute && (n = n.data);
      const i = e.get(n);
      i && (t.deleteBuffer(i.buffer), e.delete(n));
    },
    update: function (n, i) {
      if (
        (n.isInterleavedBufferAttribute && (n = n.data), n.isGLBufferAttribute)
      ) {
        const t = e.get(n);
        return void (
          (!t || t.version < n.version) &&
          e.set(n, {
            buffer: n.buffer,
            type: n.type,
            bytesPerElement: n.elementSize,
            version: n.version,
          })
        );
      }
      const r = e.get(n);
      if (void 0 === r)
        e.set(
          n,
          (function (e, n) {
            const i = e.array,
              r = e.usage,
              s = i.byteLength,
              a = t.createBuffer();
            let o;
            if (
              (t.bindBuffer(n, a),
              t.bufferData(n, i, r),
              e.onUploadCallback(),
              i instanceof Float32Array)
            )
              o = t.FLOAT;
            else if (i instanceof Uint16Array)
              o = e.isFloat16BufferAttribute ? t.HALF_FLOAT : t.UNSIGNED_SHORT;
            else if (i instanceof Int16Array) o = t.SHORT;
            else if (i instanceof Uint32Array) o = t.UNSIGNED_INT;
            else if (i instanceof Int32Array) o = t.INT;
            else if (i instanceof Int8Array) o = t.BYTE;
            else if (i instanceof Uint8Array) o = t.UNSIGNED_BYTE;
            else {
              if (!(i instanceof Uint8ClampedArray))
                throw new Error(
                  "THREE.WebGLAttributes: Unsupported buffer data format: " + i
                );
              o = t.UNSIGNED_BYTE;
            }
            return {
              buffer: a,
              type: o,
              bytesPerElement: i.BYTES_PER_ELEMENT,
              version: e.version,
              size: s,
            };
          })(n, i)
        );
      else if (r.version < n.version) {
        if (r.size !== n.array.byteLength)
          throw new Error(
            "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported."
          );
        !(function (e, n, i) {
          const r = n.array,
            s = n.updateRanges;
          if ((t.bindBuffer(i, e), 0 === s.length)) t.bufferSubData(i, 0, r);
          else {
            s.sort((t, e) => t.start - e.start);
            let e = 0;
            for (let t = 1; t < s.length; t++) {
              const n = s[e],
                i = s[t];
              i.start <= n.start + n.count + 1
                ? (n.count = Math.max(n.count, i.start + i.count - n.start))
                : (++e, (s[e] = i));
            }
            s.length = e + 1;
            for (let n = 0, a = s.length; n < a; n++) {
              const e = s[n];
              t.bufferSubData(
                i,
                e.start * r.BYTES_PER_ELEMENT,
                r,
                e.start,
                e.count
              );
            }
            n.clearUpdateRanges();
          }
          n.onUploadCallback();
        })(r.buffer, n, i),
          (r.version = n.version);
      }
    },
  };
}
"undefined" != typeof __THREE_DEVTOOLS__ &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", {
      detail: {
        revision: c,
      },
    })
  ),
  "undefined" != typeof window &&
    (window.__THREE__
      ? console.warn("WARNING: Multiple instances of Three.js being imported.")
      : (window.__THREE__ = c));
const Dr = {
    alphahash_fragment:
      "#ifdef USE_ALPHAHASH\n\tif ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
    alphahash_pars_fragment:
      "#ifdef USE_ALPHAHASH\n\tconst float ALPHA_HASH_SCALE = 0.05;\n\tfloat hash2D( vec2 value ) {\n\t\treturn fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n\t}\n\tfloat hash3D( vec3 value ) {\n\t\treturn hash2D( vec2( hash2D( value.xy ), value.z ) );\n\t}\n\tfloat getAlphaHashThreshold( vec3 position ) {\n\t\tfloat maxDeriv = max(\n\t\t\tlength( dFdx( position.xyz ) ),\n\t\t\tlength( dFdy( position.xyz ) )\n\t\t);\n\t\tfloat pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n\t\tvec2 pixScales = vec2(\n\t\t\texp2( floor( log2( pixScale ) ) ),\n\t\t\texp2( ceil( log2( pixScale ) ) )\n\t\t);\n\t\tvec2 alpha = vec2(\n\t\t\thash3D( floor( pixScales.x * position.xyz ) ),\n\t\t\thash3D( floor( pixScales.y * position.xyz ) )\n\t\t);\n\t\tfloat lerpFactor = fract( log2( pixScale ) );\n\t\tfloat x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n\t\tfloat a = min( lerpFactor, 1.0 - lerpFactor );\n\t\tvec3 cases = vec3(\n\t\t\tx * x / ( 2.0 * a * ( 1.0 - a ) ),\n\t\t\t( x - 0.5 * a ) / ( 1.0 - a ),\n\t\t\t1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n\t\t);\n\t\tfloat threshold = ( x < ( 1.0 - a ) )\n\t\t\t? ( ( x < a ) ? cases.x : cases.y )\n\t\t\t: cases.z;\n\t\treturn clamp( threshold , 1.0e-6, 1.0 );\n\t}\n#endif",
    alphamap_fragment:
      "#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
    alphamap_pars_fragment:
      "#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif",
    alphatest_fragment:
      "#ifdef USE_ALPHATEST\n\t#ifdef ALPHA_TO_COVERAGE\n\tdiffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n\tif ( diffuseColor.a == 0.0 ) discard;\n\t#else\n\tif ( diffuseColor.a < alphaTest ) discard;\n\t#endif\n#endif",
    alphatest_pars_fragment:
      "#ifdef USE_ALPHATEST\n\tuniform float alphaTest;\n#endif",
    aomap_fragment:
      "#ifdef USE_AOMAP\n\tfloat ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n\treflectedLight.indirectDiffuse *= ambientOcclusion;\n\t#if defined( USE_CLEARCOAT ) \n\t\tclearcoatSpecularIndirect *= ambientOcclusion;\n\t#endif\n\t#if defined( USE_SHEEN ) \n\t\tsheenSpecularIndirect *= ambientOcclusion;\n\t#endif\n\t#if defined( USE_ENVMAP ) && defined( STANDARD )\n\t\tfloat dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n\t#endif\n#endif",
    aomap_pars_fragment:
      "#ifdef USE_AOMAP\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n#endif",
    batching_pars_vertex:
      "#ifdef USE_BATCHING\n\t#if ! defined( GL_ANGLE_multi_draw )\n\t#define gl_DrawID _gl_DrawID\n\tuniform int _gl_DrawID;\n\t#endif\n\tuniform highp sampler2D batchingTexture;\n\tuniform highp usampler2D batchingIdTexture;\n\tmat4 getBatchingMatrix( const in float i ) {\n\t\tint size = textureSize( batchingTexture, 0 ).x;\n\t\tint j = int( i ) * 4;\n\t\tint x = j % size;\n\t\tint y = j / size;\n\t\tvec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n\t\tvec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n\t\tvec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n\t\tvec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n\t\treturn mat4( v1, v2, v3, v4 );\n\t}\n\tfloat getIndirectIndex( const in int i ) {\n\t\tint size = textureSize( batchingIdTexture, 0 ).x;\n\t\tint x = i % size;\n\t\tint y = i / size;\n\t\treturn float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n\t}\n#endif\n#ifdef USE_BATCHING_COLOR\n\tuniform sampler2D batchingColorTexture;\n\tvec3 getBatchingColor( const in float i ) {\n\t\tint size = textureSize( batchingColorTexture, 0 ).x;\n\t\tint j = int( i );\n\t\tint x = j % size;\n\t\tint y = j / size;\n\t\treturn texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;\n\t}\n#endif",
    batching_vertex:
      "#ifdef USE_BATCHING\n\tmat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
    begin_vertex:
      "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n\tvPosition = vec3( position );\n#endif",
    beginnormal_vertex:
      "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n\tvec3 objectTangent = vec3( tangent.xyz );\n#endif",
    bsdfs:
      "float G_BlinnPhong_Implicit( ) {\n\treturn 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\tvec3 F = F_Schlick( specularColor, 1.0, dotVH );\n\tfloat G = G_BlinnPhong_Implicit( );\n\tfloat D = D_BlinnPhong( shininess, dotNH );\n\treturn F * ( G * D );\n} // validated",
    iridescence_fragment:
      "#ifdef USE_IRIDESCENCE\n\tconst mat3 XYZ_TO_REC709 = mat3(\n\t\t 3.2404542, -0.9692660,  0.0556434,\n\t\t-1.5371385,  1.8760108, -0.2040259,\n\t\t-0.4985314,  0.0415560,  1.0572252\n\t);\n\tvec3 Fresnel0ToIor( vec3 fresnel0 ) {\n\t\tvec3 sqrtF0 = sqrt( fresnel0 );\n\t\treturn ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n\t}\n\tvec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n\t\treturn pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n\t}\n\tfloat IorToFresnel0( float transmittedIor, float incidentIor ) {\n\t\treturn pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n\t}\n\tvec3 evalSensitivity( float OPD, vec3 shift ) {\n\t\tfloat phase = 2.0 * PI * OPD * 1.0e-9;\n\t\tvec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n\t\tvec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n\t\tvec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n\t\tvec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n\t\txyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n\t\txyz /= 1.0685e-7;\n\t\tvec3 rgb = XYZ_TO_REC709 * xyz;\n\t\treturn rgb;\n\t}\n\tvec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n\t\tvec3 I;\n\t\tfloat iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n\t\tfloat sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n\t\tfloat cosTheta2Sq = 1.0 - sinTheta2Sq;\n\t\tif ( cosTheta2Sq < 0.0 ) {\n\t\t\treturn vec3( 1.0 );\n\t\t}\n\t\tfloat cosTheta2 = sqrt( cosTheta2Sq );\n\t\tfloat R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n\t\tfloat R12 = F_Schlick( R0, 1.0, cosTheta1 );\n\t\tfloat T121 = 1.0 - R12;\n\t\tfloat phi12 = 0.0;\n\t\tif ( iridescenceIOR < outsideIOR ) phi12 = PI;\n\t\tfloat phi21 = PI - phi12;\n\t\tvec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );\t\tvec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n\t\tvec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n\t\tvec3 phi23 = vec3( 0.0 );\n\t\tif ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n\t\tif ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n\t\tif ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n\t\tfloat OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n\t\tvec3 phi = vec3( phi21 ) + phi23;\n\t\tvec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n\t\tvec3 r123 = sqrt( R123 );\n\t\tvec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n\t\tvec3 C0 = R12 + Rs;\n\t\tI = C0;\n\t\tvec3 Cm = Rs - T121;\n\t\tfor ( int m = 1; m <= 2; ++ m ) {\n\t\t\tCm *= r123;\n\t\t\tvec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n\t\t\tI += Cm * Sm;\n\t\t}\n\t\treturn max( I, vec3( 0.0 ) );\n\t}\n#endif",
    bumpmap_pars_fragment:
      "#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd() {\n\t\tvec2 dSTdx = dFdx( vBumpMapUv );\n\t\tvec2 dSTdy = dFdy( vBumpMapUv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n\t\tvec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n\t\tvec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 ) * faceDirection;\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif",
    clipping_planes_fragment:
      "#if NUM_CLIPPING_PLANES > 0\n\tvec4 plane;\n\t#ifdef ALPHA_TO_COVERAGE\n\t\tfloat distanceToPlane, distanceGradient;\n\t\tfloat clipOpacity = 1.0;\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tdistanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n\t\t\tdistanceGradient = fwidth( distanceToPlane ) / 2.0;\n\t\t\tclipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n\t\t\tif ( clipOpacity == 0.0 ) discard;\n\t\t}\n\t\t#pragma unroll_loop_end\n\t\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\t\t\tfloat unionClipOpacity = 1.0;\n\t\t\t#pragma unroll_loop_start\n\t\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\t\t\t\tplane = clippingPlanes[ i ];\n\t\t\t\tdistanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n\t\t\t\tdistanceGradient = fwidth( distanceToPlane ) / 2.0;\n\t\t\t\tunionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n\t\t\t}\n\t\t\t#pragma unroll_loop_end\n\t\t\tclipOpacity *= 1.0 - unionClipOpacity;\n\t\t#endif\n\t\tdiffuseColor.a *= clipOpacity;\n\t\tif ( diffuseColor.a == 0.0 ) discard;\n\t#else\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tif ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n\t\t}\n\t\t#pragma unroll_loop_end\n\t\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\t\t\tbool clipped = true;\n\t\t\t#pragma unroll_loop_start\n\t\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\t\t\t\tplane = clippingPlanes[ i ];\n\t\t\t\tclipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n\t\t\t}\n\t\t\t#pragma unroll_loop_end\n\t\t\tif ( clipped ) discard;\n\t\t#endif\n\t#endif\n#endif",
    clipping_planes_pars_fragment:
      "#if NUM_CLIPPING_PLANES > 0\n\tvarying vec3 vClipPosition;\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
    clipping_planes_pars_vertex:
      "#if NUM_CLIPPING_PLANES > 0\n\tvarying vec3 vClipPosition;\n#endif",
    clipping_planes_vertex:
      "#if NUM_CLIPPING_PLANES > 0\n\tvClipPosition = - mvPosition.xyz;\n#endif",
    color_fragment:
      "#if defined( USE_COLOR_ALPHA )\n\tdiffuseColor *= vColor;\n#elif defined( USE_COLOR )\n\tdiffuseColor.rgb *= vColor;\n#endif",
    color_pars_fragment:
      "#if defined( USE_COLOR_ALPHA )\n\tvarying vec4 vColor;\n#elif defined( USE_COLOR )\n\tvarying vec3 vColor;\n#endif",
    color_pars_vertex:
      "#if defined( USE_COLOR_ALPHA )\n\tvarying vec4 vColor;\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n\tvarying vec3 vColor;\n#endif",
    color_vertex:
      "#if defined( USE_COLOR_ALPHA )\n\tvColor = vec4( 1.0 );\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n\tvColor = vec3( 1.0 );\n#endif\n#ifdef USE_COLOR\n\tvColor *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n\tvColor.xyz *= instanceColor.xyz;\n#endif\n#ifdef USE_BATCHING_COLOR\n\tvec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );\n\tvColor.xyz *= batchingColor.xyz;\n#endif",
    common:
      "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\treturn fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n\tfloat precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n\tfloat precisionSafeLength( vec3 v ) {\n\t\tfloat maxComponent = max3( abs( v ) );\n\t\treturn length( v / maxComponent ) * maxComponent;\n\t}\n#endif\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n\tvarying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n}\nmat3 transposeMat3( const in mat3 m ) {\n\tmat3 tmp;\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\treturn tmp;\n}\nbool isPerspectiveMatrix( mat4 m ) {\n\treturn m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n\tfloat u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\tfloat v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\treturn vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n\treturn RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n\tfloat fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n\treturn f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n\tfloat fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n\treturn f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
    cube_uv_reflection_fragment:
      "#ifdef ENVMAP_TYPE_CUBE_UV\n\t#define cubeUV_minMipLevel 4.0\n\t#define cubeUV_minTileSize 16.0\n\tfloat getFace( vec3 direction ) {\n\t\tvec3 absDirection = abs( direction );\n\t\tfloat face = - 1.0;\n\t\tif ( absDirection.x > absDirection.z ) {\n\t\t\tif ( absDirection.x > absDirection.y )\n\t\t\t\tface = direction.x > 0.0 ? 0.0 : 3.0;\n\t\t\telse\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\t\t} else {\n\t\t\tif ( absDirection.z > absDirection.y )\n\t\t\t\tface = direction.z > 0.0 ? 2.0 : 5.0;\n\t\t\telse\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\t\t}\n\t\treturn face;\n\t}\n\tvec2 getUV( vec3 direction, float face ) {\n\t\tvec2 uv;\n\t\tif ( face == 0.0 ) {\n\t\t\tuv = vec2( direction.z, direction.y ) / abs( direction.x );\n\t\t} else if ( face == 1.0 ) {\n\t\t\tuv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n\t\t} else if ( face == 2.0 ) {\n\t\t\tuv = vec2( - direction.x, direction.y ) / abs( direction.z );\n\t\t} else if ( face == 3.0 ) {\n\t\t\tuv = vec2( - direction.z, direction.y ) / abs( direction.x );\n\t\t} else if ( face == 4.0 ) {\n\t\t\tuv = vec2( - direction.x, direction.z ) / abs( direction.y );\n\t\t} else {\n\t\t\tuv = vec2( direction.x, direction.y ) / abs( direction.z );\n\t\t}\n\t\treturn 0.5 * ( uv + 1.0 );\n\t}\n\tvec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n\t\tfloat face = getFace( direction );\n\t\tfloat filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n\t\tmipInt = max( mipInt, cubeUV_minMipLevel );\n\t\tfloat faceSize = exp2( mipInt );\n\t\thighp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n\t\tif ( face > 2.0 ) {\n\t\t\tuv.y += faceSize;\n\t\t\tface -= 3.0;\n\t\t}\n\t\tuv.x += face * faceSize;\n\t\tuv.x += filterInt * 3.0 * cubeUV_minTileSize;\n\t\tuv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n\t\tuv.x *= CUBEUV_TEXEL_WIDTH;\n\t\tuv.y *= CUBEUV_TEXEL_HEIGHT;\n\t\t#ifdef texture2DGradEXT\n\t\t\treturn texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n\t\t#else\n\t\t\treturn texture2D( envMap, uv ).rgb;\n\t\t#endif\n\t}\n\t#define cubeUV_r0 1.0\n\t#define cubeUV_m0 - 2.0\n\t#define cubeUV_r1 0.8\n\t#define cubeUV_m1 - 1.0\n\t#define cubeUV_r4 0.4\n\t#define cubeUV_m4 2.0\n\t#define cubeUV_r5 0.305\n\t#define cubeUV_m5 3.0\n\t#define cubeUV_r6 0.21\n\t#define cubeUV_m6 4.0\n\tfloat roughnessToMip( float roughness ) {\n\t\tfloat mip = 0.0;\n\t\tif ( roughness >= cubeUV_r1 ) {\n\t\t\tmip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n\t\t} else if ( roughness >= cubeUV_r4 ) {\n\t\t\tmip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n\t\t} else if ( roughness >= cubeUV_r5 ) {\n\t\t\tmip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n\t\t} else if ( roughness >= cubeUV_r6 ) {\n\t\t\tmip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n\t\t} else {\n\t\t\tmip = - 2.0 * log2( 1.16 * roughness );\t\t}\n\t\treturn mip;\n\t}\n\tvec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n\t\tfloat mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n\t\tfloat mipF = fract( mip );\n\t\tfloat mipInt = floor( mip );\n\t\tvec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n\t\tif ( mipF == 0.0 ) {\n\t\t\treturn vec4( color0, 1.0 );\n\t\t} else {\n\t\t\tvec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n\t\t\treturn vec4( mix( color0, color1, mipF ), 1.0 );\n\t\t}\n\t}\n#endif",
    defaultnormal_vertex:
      "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n\tvec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n\tmat3 bm = mat3( batchingMatrix );\n\ttransformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n\ttransformedNormal = bm * transformedNormal;\n\t#ifdef USE_TANGENT\n\t\ttransformedTangent = bm * transformedTangent;\n\t#endif\n#endif\n#ifdef USE_INSTANCING\n\tmat3 im = mat3( instanceMatrix );\n\ttransformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n\ttransformedNormal = im * transformedNormal;\n\t#ifdef USE_TANGENT\n\t\ttransformedTangent = im * transformedTangent;\n\t#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n\ttransformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n\ttransformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n\t#ifdef FLIP_SIDED\n\t\ttransformedTangent = - transformedTangent;\n\t#endif\n#endif",
    displacementmap_pars_vertex:
      "#ifdef USE_DISPLACEMENTMAP\n\tuniform sampler2D displacementMap;\n\tuniform float displacementScale;\n\tuniform float displacementBias;\n#endif",
    displacementmap_vertex:
      "#ifdef USE_DISPLACEMENTMAP\n\ttransformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
    emissivemap_fragment:
      "#ifdef USE_EMISSIVEMAP\n\tvec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n\t#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n\t\temissiveColor = sRGBTransferEOTF( emissiveColor );\n\t#endif\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
    emissivemap_pars_fragment:
      "#ifdef USE_EMISSIVEMAP\n\tuniform sampler2D emissiveMap;\n#endif",
    colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
    colorspace_pars_fragment:
      "vec4 LinearTransferOETF( in vec4 value ) {\n\treturn value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
    envmap_fragment:
      "#ifdef USE_ENVMAP\n\t#ifdef ENV_WORLDPOS\n\t\tvec3 cameraToFrag;\n\t\tif ( isOrthographic ) {\n\t\t\tcameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\t\t} else {\n\t\t\tcameraToFrag = normalize( vWorldPosition - cameraPosition );\n\t\t}\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvec3 reflectVec = reflect( cameraToFrag, worldNormal );\n\t\t#else\n\t\t\tvec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n\t\t#endif\n\t#else\n\t\tvec3 reflectVec = vReflect;\n\t#endif\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tvec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#else\n\t\tvec4 envColor = vec4( 0.0 );\n\t#endif\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\t#endif\n#endif",
    envmap_common_pars_fragment:
      "#ifdef USE_ENVMAP\n\tuniform float envMapIntensity;\n\tuniform float flipEnvMap;\n\tuniform mat3 envMapRotation;\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\t\n#endif",
    envmap_pars_fragment:
      "#ifdef USE_ENVMAP\n\tuniform float reflectivity;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\t\t#define ENV_WORLDPOS\n\t#endif\n\t#ifdef ENV_WORLDPOS\n\t\tvarying vec3 vWorldPosition;\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n#endif",
    envmap_pars_vertex:
      "#ifdef USE_ENVMAP\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\t\t#define ENV_WORLDPOS\n\t#endif\n\t#ifdef ENV_WORLDPOS\n\t\t\n\t\tvarying vec3 vWorldPosition;\n\t#else\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\t#endif\n#endif",
    envmap_physical_pars_fragment:
      "#ifdef USE_ENVMAP\n\tvec3 getIBLIrradiance( const in vec3 normal ) {\n\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\t\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n\t\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\t\t#else\n\t\t\treturn vec3( 0.0 );\n\t\t#endif\n\t}\n\tvec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\t\t\tvec3 reflectVec = reflect( - viewDir, normal );\n\t\t\treflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );\n\t\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n\t\t\treturn envMapColor.rgb * envMapIntensity;\n\t\t#else\n\t\t\treturn vec3( 0.0 );\n\t\t#endif\n\t}\n\t#ifdef USE_ANISOTROPY\n\t\tvec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n\t\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\t\t\t\tvec3 bentNormal = cross( bitangent, viewDir );\n\t\t\t\tbentNormal = normalize( cross( bentNormal, bitangent ) );\n\t\t\t\tbentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n\t\t\t\treturn getIBLRadiance( viewDir, bentNormal, roughness );\n\t\t\t#else\n\t\t\t\treturn vec3( 0.0 );\n\t\t\t#endif\n\t\t}\n\t#endif\n#endif",
    envmap_vertex:
      "#ifdef USE_ENVMAP\n\t#ifdef ENV_WORLDPOS\n\t\tvWorldPosition = worldPosition.xyz;\n\t#else\n\t\tvec3 cameraToVertex;\n\t\tif ( isOrthographic ) {\n\t\t\tcameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\t\t} else {\n\t\t\tcameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\t\t}\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\t\t#else\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t#endif\n\t#endif\n#endif",
    fog_vertex: "#ifdef USE_FOG\n\tvFogDepth = - mvPosition.z;\n#endif",
    fog_pars_vertex: "#ifdef USE_FOG\n\tvarying float vFogDepth;\n#endif",
    fog_fragment:
      "#ifdef USE_FOG\n\t#ifdef FOG_EXP2\n\t\tfloat fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n\t#else\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n\t#endif\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
    fog_pars_fragment:
      "#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\tvarying float vFogDepth;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif",
    gradientmap_pars_fragment:
      "#ifdef USE_GRADIENTMAP\n\tuniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n\tfloat dotNL = dot( normal, lightDirection );\n\tvec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n\t#ifdef USE_GRADIENTMAP\n\t\treturn vec3( texture2D( gradientMap, coord ).r );\n\t#else\n\t\tvec2 fw = fwidth( coord ) * 0.5;\n\t\treturn mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n\t#endif\n}",
    lightmap_pars_fragment:
      "#ifdef USE_LIGHTMAP\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n#endif",
    lights_lambert_fragment:
      "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
    lights_lambert_pars_fragment:
      "varying vec3 vViewPosition;\nstruct LambertMaterial {\n\tvec3 diffuseColor;\n\tfloat specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_Lambert\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Lambert",
    lights_pars_begin:
      "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n\tuniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n\tfloat x = normal.x, y = normal.y, z = normal.z;\n\tvec3 result = shCoefficients[ 0 ] * 0.886227;\n\tresult += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n\tresult += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n\tresult += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n\tresult += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n\tresult += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n\tresult += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n\tresult += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n\tresult += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n\treturn result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\tvec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n\treturn irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\tvec3 irradiance = ambientLightColor;\n\treturn irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\tif ( cutoffDistance > 0.0 ) {\n\t\tdistanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\t}\n\treturn distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n\treturn smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_DIR_LIGHTS > 0\n\tstruct DirectionalLight {\n\t\tvec3 direction;\n\t\tvec3 color;\n\t};\n\tuniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\tvoid getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n\t\tlight.color = directionalLight.color;\n\t\tlight.direction = directionalLight.direction;\n\t\tlight.visible = true;\n\t}\n#endif\n#if NUM_POINT_LIGHTS > 0\n\tstruct PointLight {\n\t\tvec3 position;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t};\n\tuniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n\tvoid getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n\t\tvec3 lVector = pointLight.position - geometryPosition;\n\t\tlight.direction = normalize( lVector );\n\t\tfloat lightDistance = length( lVector );\n\t\tlight.color = pointLight.color;\n\t\tlight.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n\t\tlight.visible = ( light.color != vec3( 0.0 ) );\n\t}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n\tstruct SpotLight {\n\t\tvec3 position;\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tfloat coneCos;\n\t\tfloat penumbraCos;\n\t};\n\tuniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n\tvoid getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n\t\tvec3 lVector = spotLight.position - geometryPosition;\n\t\tlight.direction = normalize( lVector );\n\t\tfloat angleCos = dot( light.direction, spotLight.direction );\n\t\tfloat spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\t\tif ( spotAttenuation > 0.0 ) {\n\t\t\tfloat lightDistance = length( lVector );\n\t\t\tlight.color = spotLight.color * spotAttenuation;\n\t\t\tlight.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n\t\t\tlight.visible = ( light.color != vec3( 0.0 ) );\n\t\t} else {\n\t\t\tlight.color = vec3( 0.0 );\n\t\t\tlight.visible = false;\n\t\t}\n\t}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n\tstruct RectAreaLight {\n\t\tvec3 color;\n\t\tvec3 position;\n\t\tvec3 halfWidth;\n\t\tvec3 halfHeight;\n\t};\n\tuniform sampler2D ltc_1;\tuniform sampler2D ltc_2;\n\tuniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n\tstruct HemisphereLight {\n\t\tvec3 direction;\n\t\tvec3 skyColor;\n\t\tvec3 groundColor;\n\t};\n\tuniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n\tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n\t\tfloat dotNL = dot( normal, hemiLight.direction );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\t\treturn irradiance;\n\t}\n#endif",
    lights_toon_fragment:
      "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
    lights_toon_pars_fragment:
      "varying vec3 vViewPosition;\nstruct ToonMaterial {\n\tvec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\tvec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_Toon\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Toon",
    lights_phong_fragment:
      "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
    lights_phong_pars_fragment:
      "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n\tvec3 diffuseColor;\n\tvec3 specularColor;\n\tfloat specularShininess;\n\tfloat specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\treflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct\t\t\t\tRE_Direct_BlinnPhong\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_BlinnPhong",
    lights_physical_fragment:
      "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n\tmaterial.ior = ior;\n\t#ifdef USE_SPECULAR\n\t\tfloat specularIntensityFactor = specularIntensity;\n\t\tvec3 specularColorFactor = specularColor;\n\t\t#ifdef USE_SPECULAR_COLORMAP\n\t\t\tspecularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n\t\t#endif\n\t\t#ifdef USE_SPECULAR_INTENSITYMAP\n\t\t\tspecularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n\t\t#endif\n\t\tmaterial.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n\t#else\n\t\tfloat specularIntensityFactor = 1.0;\n\t\tvec3 specularColorFactor = vec3( 1.0 );\n\t\tmaterial.specularF90 = 1.0;\n\t#endif\n\tmaterial.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );\n#else\n\tmaterial.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );\n\tmaterial.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n\tmaterial.clearcoat = clearcoat;\n\tmaterial.clearcoatRoughness = clearcoatRoughness;\n\tmaterial.clearcoatF0 = vec3( 0.04 );\n\tmaterial.clearcoatF90 = 1.0;\n\t#ifdef USE_CLEARCOATMAP\n\t\tmaterial.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n\t#endif\n\t#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\t\tmaterial.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n\t#endif\n\tmaterial.clearcoat = saturate( material.clearcoat );\tmaterial.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n\tmaterial.clearcoatRoughness += geometryRoughness;\n\tmaterial.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n\tmaterial.dispersion = dispersion;\n#endif\n#ifdef USE_IRIDESCENCE\n\tmaterial.iridescence = iridescence;\n\tmaterial.iridescenceIOR = iridescenceIOR;\n\t#ifdef USE_IRIDESCENCEMAP\n\t\tmaterial.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n\t#endif\n\t#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\t\tmaterial.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n\t#else\n\t\tmaterial.iridescenceThickness = iridescenceThicknessMaximum;\n\t#endif\n#endif\n#ifdef USE_SHEEN\n\tmaterial.sheenColor = sheenColor;\n\t#ifdef USE_SHEEN_COLORMAP\n\t\tmaterial.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n\t#endif\n\tmaterial.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );\n\t#ifdef USE_SHEEN_ROUGHNESSMAP\n\t\tmaterial.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n\t#endif\n#endif\n#ifdef USE_ANISOTROPY\n\t#ifdef USE_ANISOTROPYMAP\n\t\tmat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n\t\tvec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n\t\tvec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n\t#else\n\t\tvec2 anisotropyV = anisotropyVector;\n\t#endif\n\tmaterial.anisotropy = length( anisotropyV );\n\tif( material.anisotropy == 0.0 ) {\n\t\tanisotropyV = vec2( 1.0, 0.0 );\n\t} else {\n\t\tanisotropyV /= material.anisotropy;\n\t\tmaterial.anisotropy = saturate( material.anisotropy );\n\t}\n\tmaterial.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n\tmaterial.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n\tmaterial.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
    lights_physical_pars_fragment:
      "struct PhysicalMaterial {\n\tvec3 diffuseColor;\n\tfloat roughness;\n\tvec3 specularColor;\n\tfloat specularF90;\n\tfloat dispersion;\n\t#ifdef USE_CLEARCOAT\n\t\tfloat clearcoat;\n\t\tfloat clearcoatRoughness;\n\t\tvec3 clearcoatF0;\n\t\tfloat clearcoatF90;\n\t#endif\n\t#ifdef USE_IRIDESCENCE\n\t\tfloat iridescence;\n\t\tfloat iridescenceIOR;\n\t\tfloat iridescenceThickness;\n\t\tvec3 iridescenceFresnel;\n\t\tvec3 iridescenceF0;\n\t#endif\n\t#ifdef USE_SHEEN\n\t\tvec3 sheenColor;\n\t\tfloat sheenRoughness;\n\t#endif\n\t#ifdef IOR\n\t\tfloat ior;\n\t#endif\n\t#ifdef USE_TRANSMISSION\n\t\tfloat transmission;\n\t\tfloat transmissionAlpha;\n\t\tfloat thickness;\n\t\tfloat attenuationDistance;\n\t\tvec3 attenuationColor;\n\t#endif\n\t#ifdef USE_ANISOTROPY\n\t\tfloat anisotropy;\n\t\tfloat alphaT;\n\t\tvec3 anisotropyT;\n\t\tvec3 anisotropyB;\n\t#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\tfloat a2 = pow2( alpha );\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\treturn 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\tfloat a2 = pow2( alpha );\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n\tfloat V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n\t\tfloat gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n\t\tfloat gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n\t\tfloat v = 0.5 / ( gv + gl );\n\t\treturn saturate(v);\n\t}\n\tfloat D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n\t\tfloat a2 = alphaT * alphaB;\n\t\thighp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n\t\thighp float v2 = dot( v, v );\n\t\tfloat w2 = a2 / v2;\n\t\treturn RECIPROCAL_PI * a2 * pow2 ( w2 );\n\t}\n#endif\n#ifdef USE_CLEARCOAT\n\tvec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n\t\tvec3 f0 = material.clearcoatF0;\n\t\tfloat f90 = material.clearcoatF90;\n\t\tfloat roughness = material.clearcoatRoughness;\n\t\tfloat alpha = pow2( roughness );\n\t\tvec3 halfDir = normalize( lightDir + viewDir );\n\t\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\t\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\t\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\t\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\t\tvec3 F = F_Schlick( f0, f90, dotVH );\n\t\tfloat V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\t\tfloat D = D_GGX( alpha, dotNH );\n\t\treturn F * ( V * D );\n\t}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n\tvec3 f0 = material.specularColor;\n\tfloat f90 = material.specularF90;\n\tfloat roughness = material.roughness;\n\tfloat alpha = pow2( roughness );\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\tvec3 F = F_Schlick( f0, f90, dotVH );\n\t#ifdef USE_IRIDESCENCE\n\t\tF = mix( F, material.iridescenceFresnel, material.iridescence );\n\t#endif\n\t#ifdef USE_ANISOTROPY\n\t\tfloat dotTL = dot( material.anisotropyT, lightDir );\n\t\tfloat dotTV = dot( material.anisotropyT, viewDir );\n\t\tfloat dotTH = dot( material.anisotropyT, halfDir );\n\t\tfloat dotBL = dot( material.anisotropyB, lightDir );\n\t\tfloat dotBV = dot( material.anisotropyB, viewDir );\n\t\tfloat dotBH = dot( material.anisotropyB, halfDir );\n\t\tfloat V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n\t\tfloat D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n\t#else\n\t\tfloat V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\t\tfloat D = D_GGX( alpha, dotNH );\n\t#endif\n\treturn F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n\tconst float LUT_SIZE = 64.0;\n\tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\tconst float LUT_BIAS = 0.5 / LUT_SIZE;\n\tfloat dotNV = saturate( dot( N, V ) );\n\tvec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n\tuv = uv * LUT_SCALE + LUT_BIAS;\n\treturn uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n\tfloat l = length( f );\n\treturn max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n\tfloat x = dot( v1, v2 );\n\tfloat y = abs( x );\n\tfloat a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n\tfloat b = 3.4175940 + ( 4.1616724 + y ) * y;\n\tfloat v = a / b;\n\tfloat theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n\treturn cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n\tvec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n\tvec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n\tvec3 lightNormal = cross( v1, v2 );\n\tif( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n\tvec3 T1, T2;\n\tT1 = normalize( V - N * dot( V, N ) );\n\tT2 = - cross( N, T1 );\n\tmat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n\tvec3 coords[ 4 ];\n\tcoords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n\tcoords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n\tcoords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n\tcoords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n\tcoords[ 0 ] = normalize( coords[ 0 ] );\n\tcoords[ 1 ] = normalize( coords[ 1 ] );\n\tcoords[ 2 ] = normalize( coords[ 2 ] );\n\tcoords[ 3 ] = normalize( coords[ 3 ] );\n\tvec3 vectorFormFactor = vec3( 0.0 );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n\tfloat result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n\treturn vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n\tfloat alpha = pow2( roughness );\n\tfloat invAlpha = 1.0 / alpha;\n\tfloat cos2h = dotNH * dotNH;\n\tfloat sin2h = max( 1.0 - cos2h, 0.0078125 );\n\treturn ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n\treturn saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat D = D_Charlie( sheenRoughness, dotNH );\n\tfloat V = V_Neubelt( dotNV, dotNL );\n\treturn sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat r2 = roughness * roughness;\n\tfloat a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;\n\tfloat b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;\n\tfloat DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );\n\treturn saturate( DG * RECIPROCAL_PI );\n}\nvec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\tvec4 r = roughness * c0 + c1;\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\tvec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;\n\treturn fab;\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n\tvec2 fab = DFGApprox( normal, viewDir, roughness );\n\treturn specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n\tvec2 fab = DFGApprox( normal, viewDir, roughness );\n\t#ifdef USE_IRIDESCENCE\n\t\tvec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n\t#else\n\t\tvec3 Fr = specularColor;\n\t#endif\n\tvec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n\tfloat Ess = fab.x + fab.y;\n\tfloat Ems = 1.0 - Ess;\n\tvec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;\tvec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n\tsingleScatter += FssEss;\n\tmultiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n\tvoid RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\t\tvec3 normal = geometryNormal;\n\t\tvec3 viewDir = geometryViewDir;\n\t\tvec3 position = geometryPosition;\n\t\tvec3 lightPos = rectAreaLight.position;\n\t\tvec3 halfWidth = rectAreaLight.halfWidth;\n\t\tvec3 halfHeight = rectAreaLight.halfHeight;\n\t\tvec3 lightColor = rectAreaLight.color;\n\t\tfloat roughness = material.roughness;\n\t\tvec3 rectCoords[ 4 ];\n\t\trectCoords[ 0 ] = lightPos + halfWidth - halfHeight;\t\trectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n\t\trectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n\t\trectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n\t\tvec2 uv = LTC_Uv( normal, viewDir, roughness );\n\t\tvec4 t1 = texture2D( ltc_1, uv );\n\t\tvec4 t2 = texture2D( ltc_2, uv );\n\t\tmat3 mInv = mat3(\n\t\t\tvec3( t1.x, 0, t1.y ),\n\t\t\tvec3(    0, 1,    0 ),\n\t\t\tvec3( t1.z, 0, t1.w )\n\t\t);\n\t\tvec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );\n\t\treflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n\t\treflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n\t}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\tfloat dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\t#ifdef USE_CLEARCOAT\n\t\tfloat dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n\t\tvec3 ccIrradiance = dotNLcc * directLight.color;\n\t\tclearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n\t#endif\n\t#ifdef USE_SHEEN\n\t\tsheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n\t#endif\n\treflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n\t#ifdef USE_CLEARCOAT\n\t\tclearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n\t#endif\n\t#ifdef USE_SHEEN\n\t\tsheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n\t#endif\n\tvec3 singleScattering = vec3( 0.0 );\n\tvec3 multiScattering = vec3( 0.0 );\n\tvec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n\t#ifdef USE_IRIDESCENCE\n\t\tcomputeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );\n\t#else\n\t\tcomputeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );\n\t#endif\n\tvec3 totalScattering = singleScattering + multiScattering;\n\tvec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );\n\treflectedLight.indirectSpecular += radiance * singleScattering;\n\treflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;\n\treflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;\n}\n#define RE_Direct\t\t\t\tRE_Direct_Physical\n#define RE_Direct_RectArea\t\tRE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular\t\tRE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
    lights_fragment_begin:
      "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n\tgeometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n\tfloat dotNVi = saturate( dot( normal, geometryViewDir ) );\n\tif ( material.iridescenceThickness == 0.0 ) {\n\t\tmaterial.iridescence = 0.0;\n\t} else {\n\t\tmaterial.iridescence = saturate( material.iridescence );\n\t}\n\tif ( material.iridescence > 0.0 ) {\n\t\tmaterial.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n\t\tmaterial.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );\n\t}\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\tPointLight pointLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n\tPointLightShadow pointLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\t\tpointLight = pointLights[ i ];\n\t\tgetPointLightInfo( pointLight, geometryPosition, directLight );\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n\t\tpointLightShadow = pointLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\tSpotLight spotLight;\n\tvec4 spotColor;\n\tvec3 spotLightCoord;\n\tbool inSpotLightMap;\n\t#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n\tSpotLightShadow spotLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\t\tspotLight = spotLights[ i ];\n\t\tgetSpotLightInfo( spotLight, geometryPosition, directLight );\n\t\t#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n\t\t#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n\t\t#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\t#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n\t\t#else\n\t\t#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n\t\t#endif\n\t\t#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n\t\t\tspotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n\t\t\tinSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n\t\t\tspotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n\t\t\tdirectLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n\t\t#endif\n\t\t#undef SPOT_LIGHT_MAP_INDEX\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\tspotLightShadow = spotLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\tDirectionalLight directionalLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n\tDirectionalLightShadow directionalLightShadow;\n\t#endif\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\t\tdirectionalLight = directionalLights[ i ];\n\t\tgetDirectionalLightInfo( directionalLight, directLight );\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n\t\tdirectionalLightShadow = directionalLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\t\tRE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\tRectAreaLight rectAreaLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\t\trectAreaLight = rectAreaLights[ i ];\n\t\tRE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n\t}\n\t#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n\tvec3 iblIrradiance = vec3( 0.0 );\n\tvec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\t#if defined( USE_LIGHT_PROBES )\n\t\tirradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n\t#endif\n\t#if ( NUM_HEMI_LIGHTS > 0 )\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\t\t\tirradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n\t\t}\n\t\t#pragma unroll_loop_end\n\t#endif\n#endif\n#if defined( RE_IndirectSpecular )\n\tvec3 radiance = vec3( 0.0 );\n\tvec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
    lights_fragment_maps:
      "#if defined( RE_IndirectDiffuse )\n\t#ifdef USE_LIGHTMAP\n\t\tvec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n\t\tvec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n\t\tirradiance += lightMapIrradiance;\n\t#endif\n\t#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )\n\t\tiblIrradiance += getIBLIrradiance( geometryNormal );\n\t#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\t#ifdef USE_ANISOTROPY\n\t\tradiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n\t#else\n\t\tradiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n\t#endif\n\t#ifdef USE_CLEARCOAT\n\t\tclearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n\t#endif\n#endif",
    lights_fragment_end:
      "#if defined( RE_IndirectDiffuse )\n\tRE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n\tRE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
    logdepthbuf_fragment:
      "#if defined( USE_LOGDEPTHBUF )\n\tgl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
    logdepthbuf_pars_fragment:
      "#if defined( USE_LOGDEPTHBUF )\n\tuniform float logDepthBufFC;\n\tvarying float vFragDepth;\n\tvarying float vIsPerspective;\n#endif",
    logdepthbuf_pars_vertex:
      "#ifdef USE_LOGDEPTHBUF\n\tvarying float vFragDepth;\n\tvarying float vIsPerspective;\n#endif",
    logdepthbuf_vertex:
      "#ifdef USE_LOGDEPTHBUF\n\tvFragDepth = 1.0 + gl_Position.w;\n\tvIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
    map_fragment:
      "#ifdef USE_MAP\n\tvec4 sampledDiffuseColor = texture2D( map, vMapUv );\n\t#ifdef DECODE_VIDEO_TEXTURE\n\t\tsampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n\t#endif\n\tdiffuseColor *= sampledDiffuseColor;\n#endif",
    map_pars_fragment: "#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif",
    map_particle_fragment:
      "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\t#if defined( USE_POINTS_UV )\n\t\tvec2 uv = vUv;\n\t#else\n\t\tvec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n\t#endif\n#endif\n#ifdef USE_MAP\n\tdiffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n\tdiffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
    map_particle_pars_fragment:
      "#if defined( USE_POINTS_UV )\n\tvarying vec2 vUv;\n#else\n\t#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\t\tuniform mat3 uvTransform;\n\t#endif\n#endif\n#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n\tuniform sampler2D alphaMap;\n#endif",
    metalnessmap_fragment:
      "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n\tvec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n\tmetalnessFactor *= texelMetalness.b;\n#endif",
    metalnessmap_pars_fragment:
      "#ifdef USE_METALNESSMAP\n\tuniform sampler2D metalnessMap;\n#endif",
    morphinstance_vertex:
      "#ifdef USE_INSTANCING_MORPH\n\tfloat morphTargetInfluences[ MORPHTARGETS_COUNT ];\n\tfloat morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\t\tmorphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n\t}\n#endif",
    morphcolor_vertex:
      "#if defined( USE_MORPHCOLORS )\n\tvColor *= morphTargetBaseInfluence;\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\t\t#if defined( USE_COLOR_ALPHA )\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n\t\t#elif defined( USE_COLOR )\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n\t\t#endif\n\t}\n#endif",
    morphnormal_vertex:
      "#ifdef USE_MORPHNORMALS\n\tobjectNormal *= morphTargetBaseInfluence;\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\t\tif ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n\t}\n#endif",
    morphtarget_pars_vertex:
      "#ifdef USE_MORPHTARGETS\n\t#ifndef USE_INSTANCING_MORPH\n\t\tuniform float morphTargetBaseInfluence;\n\t\tuniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n\t#endif\n\tuniform sampler2DArray morphTargetsTexture;\n\tuniform ivec2 morphTargetsTextureSize;\n\tvec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n\t\tint texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n\t\tint y = texelIndex / morphTargetsTextureSize.x;\n\t\tint x = texelIndex - y * morphTargetsTextureSize.x;\n\t\tivec3 morphUV = ivec3( x, y, morphTargetIndex );\n\t\treturn texelFetch( morphTargetsTexture, morphUV, 0 );\n\t}\n#endif",
    morphtarget_vertex:
      "#ifdef USE_MORPHTARGETS\n\ttransformed *= morphTargetBaseInfluence;\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\t\tif ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n\t}\n#endif",
    normal_fragment_begin:
      "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n\tvec3 fdx = dFdx( vViewPosition );\n\tvec3 fdy = dFdy( vViewPosition );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n#else\n\tvec3 normal = normalize( vNormal );\n\t#ifdef DOUBLE_SIDED\n\t\tnormal *= faceDirection;\n\t#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n\t#ifdef USE_TANGENT\n\t\tmat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\t#else\n\t\tmat3 tbn = getTangentFrame( - vViewPosition, normal,\n\t\t#if defined( USE_NORMALMAP )\n\t\t\tvNormalMapUv\n\t\t#elif defined( USE_CLEARCOAT_NORMALMAP )\n\t\t\tvClearcoatNormalMapUv\n\t\t#else\n\t\t\tvUv\n\t\t#endif\n\t\t);\n\t#endif\n\t#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\t\ttbn[0] *= faceDirection;\n\t\ttbn[1] *= faceDirection;\n\t#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\t#ifdef USE_TANGENT\n\t\tmat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\t#else\n\t\tmat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n\t#endif\n\t#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\t\ttbn2[0] *= faceDirection;\n\t\ttbn2[1] *= faceDirection;\n\t#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
    normal_fragment_maps:
      "#ifdef USE_NORMALMAP_OBJECTSPACE\n\tnormal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n\t#ifdef FLIP_SIDED\n\t\tnormal = - normal;\n\t#endif\n\t#ifdef DOUBLE_SIDED\n\t\tnormal = normal * faceDirection;\n\t#endif\n\tnormal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n\tvec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n\tmapN.xy *= normalScale;\n\tnormal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n\tnormal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
    normal_pars_fragment:
      "#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif",
    normal_pars_vertex:
      "#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n\t#ifdef USE_TANGENT\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\t#endif\n#endif",
    normal_vertex:
      "#ifndef FLAT_SHADED\n\tvNormal = normalize( transformedNormal );\n\t#ifdef USE_TANGENT\n\t\tvTangent = normalize( transformedTangent );\n\t\tvBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n\t#endif\n#endif",
    normalmap_pars_fragment:
      "#ifdef USE_NORMALMAP\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n\tuniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n\tmat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n\t\tvec3 q0 = dFdx( eye_pos.xyz );\n\t\tvec3 q1 = dFdy( eye_pos.xyz );\n\t\tvec2 st0 = dFdx( uv.st );\n\t\tvec2 st1 = dFdy( uv.st );\n\t\tvec3 N = surf_norm;\n\t\tvec3 q1perp = cross( q1, N );\n\t\tvec3 q0perp = cross( N, q0 );\n\t\tvec3 T = q1perp * st0.x + q0perp * st1.x;\n\t\tvec3 B = q1perp * st0.y + q0perp * st1.y;\n\t\tfloat det = max( dot( T, T ), dot( B, B ) );\n\t\tfloat scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n\t\treturn mat3( T * scale, B * scale, N );\n\t}\n#endif",
    clearcoat_normal_fragment_begin:
      "#ifdef USE_CLEARCOAT\n\tvec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
    clearcoat_normal_fragment_maps:
      "#ifdef USE_CLEARCOAT_NORMALMAP\n\tvec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n\tclearcoatMapN.xy *= clearcoatNormalScale;\n\tclearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
    clearcoat_pars_fragment:
      "#ifdef USE_CLEARCOATMAP\n\tuniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\tuniform sampler2D clearcoatNormalMap;\n\tuniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\tuniform sampler2D clearcoatRoughnessMap;\n#endif",
    iridescence_pars_fragment:
      "#ifdef USE_IRIDESCENCEMAP\n\tuniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\tuniform sampler2D iridescenceThicknessMap;\n#endif",
    opaque_fragment:
      "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
    packing:
      "vec3 packNormalToRGB( const in vec3 normal ) {\n\treturn normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n\treturn 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n\tif( v <= 0.0 )\n\t\treturn vec4( 0., 0., 0., 0. );\n\tif( v >= 1.0 )\n\t\treturn vec4( 1., 1., 1., 1. );\n\tfloat vuf;\n\tfloat af = modf( v * PackFactors.a, vuf );\n\tfloat bf = modf( vuf * ShiftRight8, vuf );\n\tfloat gf = modf( vuf * ShiftRight8, vuf );\n\treturn vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n\tif( v <= 0.0 )\n\t\treturn vec3( 0., 0., 0. );\n\tif( v >= 1.0 )\n\t\treturn vec3( 1., 1., 1. );\n\tfloat vuf;\n\tfloat bf = modf( v * PackFactors.b, vuf );\n\tfloat gf = modf( vuf * ShiftRight8, vuf );\n\treturn vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n\tif( v <= 0.0 )\n\t\treturn vec2( 0., 0. );\n\tif( v >= 1.0 )\n\t\treturn vec2( 1., 1. );\n\tfloat vuf;\n\tfloat gf = modf( v * 256., vuf );\n\treturn vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\treturn dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n\treturn dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n\treturn v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n\tvec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n\treturn vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n\treturn vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n\treturn depth * ( near - far ) - near;\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n\treturn ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n\treturn ( near * far ) / ( ( far - near ) * depth - far );\n}",
    premultiplied_alpha_fragment:
      "#ifdef PREMULTIPLIED_ALPHA\n\tgl_FragColor.rgb *= gl_FragColor.a;\n#endif",
    project_vertex:
      "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n\tmvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n\tmvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
    dithering_fragment:
      "#ifdef DITHERING\n\tgl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
    dithering_pars_fragment:
      "#ifdef DITHERING\n\tvec3 dithering( vec3 color ) {\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\t\treturn color + dither_shift_RGB;\n\t}\n#endif",
    roughnessmap_fragment:
      "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n\tvec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n\troughnessFactor *= texelRoughness.g;\n#endif",
    roughnessmap_pars_fragment:
      "#ifdef USE_ROUGHNESSMAP\n\tuniform sampler2D roughnessMap;\n#endif",
    shadowmap_pars_fragment:
      "#if NUM_SPOT_LIGHT_COORDS > 0\n\tvarying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n\tuniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t\tuniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\t#endif\n\tfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\t\treturn step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\t}\n\tvec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {\n\t\treturn unpackRGBATo2Half( texture2D( shadow, uv ) );\n\t}\n\tfloat VSMShadow (sampler2D shadow, vec2 uv, float compare ){\n\t\tfloat occlusion = 1.0;\n\t\tvec2 distribution = texture2DDistribution( shadow, uv );\n\t\tfloat hard_shadow = step( compare , distribution.x );\n\t\tif (hard_shadow != 1.0 ) {\n\t\t\tfloat distance = compare - distribution.x ;\n\t\t\tfloat variance = max( 0.00000, distribution.y * distribution.y );\n\t\t\tfloat softness_probability = variance / (variance + distance * distance );\t\t\tsoftness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );\t\t\tocclusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );\n\t\t}\n\t\treturn occlusion;\n\t}\n\tfloat getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\t\tfloat shadow = 1.0;\n\t\tshadowCoord.xyz /= shadowCoord.w;\n\t\tshadowCoord.z += shadowBias;\n\t\tbool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n\t\tbool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n\t\tif ( frustumTest ) {\n\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\tfloat dx2 = dx0 / 2.0;\n\t\t\tfloat dy2 = dy0 / 2.0;\n\t\t\tfloat dx3 = dx1 / 2.0;\n\t\t\tfloat dy3 = dy1 / 2.0;\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 17.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx = texelSize.x;\n\t\t\tfloat dy = texelSize.y;\n\t\t\tvec2 uv = shadowCoord.xy;\n\t\t\tvec2 f = fract( uv * shadowMapSize + 0.5 );\n\t\t\tuv -= f * texelSize;\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, uv, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t f.y )\n\t\t\t) * ( 1.0 / 9.0 );\n\t\t#elif defined( SHADOWMAP_TYPE_VSM )\n\t\t\tshadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#else\n\t\t\tshadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\t\t#endif\n\t\t}\n\t\treturn mix( 1.0, shadow, shadowIntensity );\n\t}\n\tvec2 cubeToUV( vec3 v, float texelSizeY ) {\n\t\tvec3 absV = abs( v );\n\t\tfloat scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\t\tabsV *= scaleToCube;\n\t\tv *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\t\tvec2 planar = v.xy;\n\t\tfloat almostATexel = 1.5 * texelSizeY;\n\t\tfloat almostOne = 1.0 - almostATexel;\n\t\tif ( absV.z >= almostOne ) {\n\t\t\tif ( v.z > 0.0 )\n\t\t\t\tplanar.x = 4.0 - v.x;\n\t\t} else if ( absV.x >= almostOne ) {\n\t\t\tfloat signX = sign( v.x );\n\t\t\tplanar.x = v.z * signX + 2.0 * signX;\n\t\t} else if ( absV.y >= almostOne ) {\n\t\t\tfloat signY = sign( v.y );\n\t\t\tplanar.x = v.x + 2.0 * signY + 2.0;\n\t\t\tplanar.y = v.z * signY - 2.0;\n\t\t}\n\t\treturn vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\t}\n\tfloat getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n\t\tfloat shadow = 1.0;\n\t\tvec3 lightToPosition = shadowCoord.xyz;\n\t\t\n\t\tfloat lightToPositionLength = length( lightToPosition );\n\t\tif ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {\n\t\t\tfloat dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );\t\t\tdp += shadowBias;\n\t\t\tvec3 bd3D = normalize( lightToPosition );\n\t\t\tvec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\t\t\t#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )\n\t\t\t\tvec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\t\t\t\tshadow = (\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\t\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\t\t\t\t) * ( 1.0 / 9.0 );\n\t\t\t#else\n\t\t\t\tshadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\t\t\t#endif\n\t\t}\n\t\treturn mix( 1.0, shadow, shadowIntensity );\n\t}\n#endif",
    shadowmap_pars_vertex:
      "#if NUM_SPOT_LIGHT_COORDS > 0\n\tuniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n\tvarying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t\tuniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t\tuniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowIntensity;\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\t#endif\n#endif",
    shadowmap_vertex:
      "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n\tvec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\tvec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\t\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n\t\t\tvDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n\t\t}\n\t\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\t\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n\t\t\tvPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n\t\t}\n\t\t#pragma unroll_loop_end\n\t#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n\t\tshadowWorldPosition = worldPosition;\n\t\t#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\t\tshadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n\t\t#endif\n\t\tvSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n\t}\n\t#pragma unroll_loop_end\n#endif",
    shadowmask_pars_fragment:
      "float getShadowMask() {\n\tfloat shadow = 1.0;\n\t#ifdef USE_SHADOWMAP\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\tDirectionalLightShadow directionalLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\t\tdirectionalLight = directionalLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\tSpotLightShadow spotLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n\t\tspotLight = spotLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\tPointLightShadow pointLight;\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\t\tpointLight = pointLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\t}\n\t#pragma unroll_loop_end\n\t#endif\n\t#endif\n\treturn shadow;\n}",
    skinbase_vertex:
      "#ifdef USE_SKINNING\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
    skinning_pars_vertex:
      "#ifdef USE_SKINNING\n\tuniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n\tuniform highp sampler2D boneTexture;\n\tmat4 getBoneMatrix( const in float i ) {\n\t\tint size = textureSize( boneTexture, 0 ).x;\n\t\tint j = int( i ) * 4;\n\t\tint x = j % size;\n\t\tint y = j / size;\n\t\tvec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n\t\tvec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n\t\tvec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n\t\tvec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n\t\treturn mat4( v1, v2, v3, v4 );\n\t}\n#endif",
    skinning_vertex:
      "#ifdef USE_SKINNING\n\tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\ttransformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
    skinnormal_vertex:
      "#ifdef USE_SKINNING\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\tskinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\t#ifdef USE_TANGENT\n\t\tobjectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\t#endif\n#endif",
    specularmap_fragment:
      "float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",
    specularmap_pars_fragment:
      "#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",
    tonemapping_fragment:
      "#if defined( TONE_MAPPING )\n\tgl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
    tonemapping_pars_fragment:
      "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n\treturn saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\treturn saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n\tcolor *= toneMappingExposure;\n\tcolor = max( vec3( 0.0 ), color - 0.004 );\n\treturn pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n\tvec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n\tvec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n\treturn a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n\tconst mat3 ACESInputMat = mat3(\n\t\tvec3( 0.59719, 0.07600, 0.02840 ),\t\tvec3( 0.35458, 0.90834, 0.13383 ),\n\t\tvec3( 0.04823, 0.01566, 0.83777 )\n\t);\n\tconst mat3 ACESOutputMat = mat3(\n\t\tvec3(  1.60475, -0.10208, -0.00327 ),\t\tvec3( -0.53108,  1.10813, -0.07276 ),\n\t\tvec3( -0.07367, -0.00605,  1.07602 )\n\t);\n\tcolor *= toneMappingExposure / 0.6;\n\tcolor = ACESInputMat * color;\n\tcolor = RRTAndODTFit( color );\n\tcolor = ACESOutputMat * color;\n\treturn saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n\tvec3( 1.6605, - 0.1246, - 0.0182 ),\n\tvec3( - 0.5876, 1.1329, - 0.1006 ),\n\tvec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n\tvec3( 0.6274, 0.0691, 0.0164 ),\n\tvec3( 0.3293, 0.9195, 0.0880 ),\n\tvec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n\tvec3 x2 = x * x;\n\tvec3 x4 = x2 * x2;\n\treturn + 15.5 * x4 * x2\n\t\t- 40.14 * x4 * x\n\t\t+ 31.96 * x4\n\t\t- 6.868 * x2 * x\n\t\t+ 0.4298 * x2\n\t\t+ 0.1191 * x\n\t\t- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n\tconst mat3 AgXInsetMatrix = mat3(\n\t\tvec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n\t\tvec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n\t\tvec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n\t);\n\tconst mat3 AgXOutsetMatrix = mat3(\n\t\tvec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n\t\tvec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n\t\tvec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n\t);\n\tconst float AgxMinEv = - 12.47393;\tconst float AgxMaxEv = 4.026069;\n\tcolor *= toneMappingExposure;\n\tcolor = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n\tcolor = AgXInsetMatrix * color;\n\tcolor = max( color, 1e-10 );\tcolor = log2( color );\n\tcolor = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n\tcolor = clamp( color, 0.0, 1.0 );\n\tcolor = agxDefaultContrastApprox( color );\n\tcolor = AgXOutsetMatrix * color;\n\tcolor = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n\tcolor = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n\tcolor = clamp( color, 0.0, 1.0 );\n\treturn color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n\tconst float StartCompression = 0.8 - 0.04;\n\tconst float Desaturation = 0.15;\n\tcolor *= toneMappingExposure;\n\tfloat x = min( color.r, min( color.g, color.b ) );\n\tfloat offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n\tcolor -= offset;\n\tfloat peak = max( color.r, max( color.g, color.b ) );\n\tif ( peak < StartCompression ) return color;\n\tfloat d = 1. - StartCompression;\n\tfloat newPeak = 1. - d * d / ( peak + d - StartCompression );\n\tcolor *= newPeak / peak;\n\tfloat g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n\treturn mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
    transmission_fragment:
      "#ifdef USE_TRANSMISSION\n\tmaterial.transmission = transmission;\n\tmaterial.transmissionAlpha = 1.0;\n\tmaterial.thickness = thickness;\n\tmaterial.attenuationDistance = attenuationDistance;\n\tmaterial.attenuationColor = attenuationColor;\n\t#ifdef USE_TRANSMISSIONMAP\n\t\tmaterial.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n\t#endif\n\t#ifdef USE_THICKNESSMAP\n\t\tmaterial.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n\t#endif\n\tvec3 pos = vWorldPosition;\n\tvec3 v = normalize( cameraPosition - pos );\n\tvec3 n = inverseTransformDirection( normal, viewMatrix );\n\tvec4 transmitted = getIBLVolumeRefraction(\n\t\tn, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n\t\tpos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n\t\tmaterial.attenuationColor, material.attenuationDistance );\n\tmaterial.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n\ttotalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
    transmission_pars_fragment:
      "#ifdef USE_TRANSMISSION\n\tuniform float transmission;\n\tuniform float thickness;\n\tuniform float attenuationDistance;\n\tuniform vec3 attenuationColor;\n\t#ifdef USE_TRANSMISSIONMAP\n\t\tuniform sampler2D transmissionMap;\n\t#endif\n\t#ifdef USE_THICKNESSMAP\n\t\tuniform sampler2D thicknessMap;\n\t#endif\n\tuniform vec2 transmissionSamplerSize;\n\tuniform sampler2D transmissionSamplerMap;\n\tuniform mat4 modelMatrix;\n\tuniform mat4 projectionMatrix;\n\tvarying vec3 vWorldPosition;\n\tfloat w0( float a ) {\n\t\treturn ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n\t}\n\tfloat w1( float a ) {\n\t\treturn ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n\t}\n\tfloat w2( float a ){\n\t\treturn ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n\t}\n\tfloat w3( float a ) {\n\t\treturn ( 1.0 / 6.0 ) * ( a * a * a );\n\t}\n\tfloat g0( float a ) {\n\t\treturn w0( a ) + w1( a );\n\t}\n\tfloat g1( float a ) {\n\t\treturn w2( a ) + w3( a );\n\t}\n\tfloat h0( float a ) {\n\t\treturn - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n\t}\n\tfloat h1( float a ) {\n\t\treturn 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n\t}\n\tvec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n\t\tuv = uv * texelSize.zw + 0.5;\n\t\tvec2 iuv = floor( uv );\n\t\tvec2 fuv = fract( uv );\n\t\tfloat g0x = g0( fuv.x );\n\t\tfloat g1x = g1( fuv.x );\n\t\tfloat h0x = h0( fuv.x );\n\t\tfloat h1x = h1( fuv.x );\n\t\tfloat h0y = h0( fuv.y );\n\t\tfloat h1y = h1( fuv.y );\n\t\tvec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n\t\treturn g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n\t\t\tg1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n\t}\n\tvec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n\t\tvec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n\t\tvec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n\t\tvec2 fLodSizeInv = 1.0 / fLodSize;\n\t\tvec2 cLodSizeInv = 1.0 / cLodSize;\n\t\tvec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n\t\tvec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n\t\treturn mix( fSample, cSample, fract( lod ) );\n\t}\n\tvec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n\t\tvec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n\t\tvec3 modelScale;\n\t\tmodelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n\t\tmodelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n\t\tmodelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n\t\treturn normalize( refractionVector ) * thickness * modelScale;\n\t}\n\tfloat applyIorToRoughness( const in float roughness, const in float ior ) {\n\t\treturn roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n\t}\n\tvec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n\t\tfloat lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n\t\treturn textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n\t}\n\tvec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n\t\tif ( isinf( attenuationDistance ) ) {\n\t\t\treturn vec3( 1.0 );\n\t\t} else {\n\t\t\tvec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n\t\t\tvec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );\t\t\treturn transmittance;\n\t\t}\n\t}\n\tvec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n\t\tconst in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n\t\tconst in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n\t\tconst in vec3 attenuationColor, const in float attenuationDistance ) {\n\t\tvec4 transmittedLight;\n\t\tvec3 transmittance;\n\t\t#ifdef USE_DISPERSION\n\t\t\tfloat halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n\t\t\tvec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n\t\t\tfor ( int i = 0; i < 3; i ++ ) {\n\t\t\t\tvec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n\t\t\t\tvec3 refractedRayExit = position + transmissionRay;\n\t\t\t\tvec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n\t\t\t\tvec2 refractionCoords = ndcPos.xy / ndcPos.w;\n\t\t\t\trefractionCoords += 1.0;\n\t\t\t\trefractionCoords /= 2.0;\n\t\t\t\tvec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n\t\t\t\ttransmittedLight[ i ] = transmissionSample[ i ];\n\t\t\t\ttransmittedLight.a += transmissionSample.a;\n\t\t\t\ttransmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n\t\t\t}\n\t\t\ttransmittedLight.a /= 3.0;\n\t\t#else\n\t\t\tvec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n\t\t\tvec3 refractedRayExit = position + transmissionRay;\n\t\t\tvec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n\t\t\tvec2 refractionCoords = ndcPos.xy / ndcPos.w;\n\t\t\trefractionCoords += 1.0;\n\t\t\trefractionCoords /= 2.0;\n\t\t\ttransmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n\t\t\ttransmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n\t\t#endif\n\t\tvec3 attenuatedColor = transmittance * transmittedLight.rgb;\n\t\tvec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n\t\tfloat transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n\t\treturn vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n\t}\n#endif",
    uv_pars_fragment:
      "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\tvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\n\tvarying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n\tvarying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n\tvarying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n\tvarying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n\tvarying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n\tvarying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n\tvarying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n\tvarying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n\tvarying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n\tvarying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n\tvarying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\tvarying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\tvarying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\tvarying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\tvarying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\tvarying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\tvarying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n\tvarying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\tvarying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\tvarying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\tuniform mat3 transmissionMapTransform;\n\tvarying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n\tuniform mat3 thicknessMapTransform;\n\tvarying vec2 vThicknessMapUv;\n#endif",
    uv_pars_vertex:
      "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\tvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\n\tuniform mat3 mapTransform;\n\tvarying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n\tuniform mat3 alphaMapTransform;\n\tvarying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n\tuniform mat3 lightMapTransform;\n\tvarying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n\tuniform mat3 aoMapTransform;\n\tvarying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n\tuniform mat3 bumpMapTransform;\n\tvarying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n\tuniform mat3 normalMapTransform;\n\tvarying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n\tuniform mat3 displacementMapTransform;\n\tvarying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n\tuniform mat3 emissiveMapTransform;\n\tvarying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n\tuniform mat3 metalnessMapTransform;\n\tvarying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n\tuniform mat3 roughnessMapTransform;\n\tvarying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n\tuniform mat3 anisotropyMapTransform;\n\tvarying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n\tuniform mat3 clearcoatMapTransform;\n\tvarying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\tuniform mat3 clearcoatNormalMapTransform;\n\tvarying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\tuniform mat3 clearcoatRoughnessMapTransform;\n\tvarying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\tuniform mat3 sheenColorMapTransform;\n\tvarying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\tuniform mat3 sheenRoughnessMapTransform;\n\tvarying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\tuniform mat3 iridescenceMapTransform;\n\tvarying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\tuniform mat3 iridescenceThicknessMapTransform;\n\tvarying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n\tuniform mat3 specularMapTransform;\n\tvarying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\tuniform mat3 specularColorMapTransform;\n\tvarying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\tuniform mat3 specularIntensityMapTransform;\n\tvarying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\tuniform mat3 transmissionMapTransform;\n\tvarying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n\tuniform mat3 thicknessMapTransform;\n\tvarying vec2 vThicknessMapUv;\n#endif",
    uv_vertex:
      "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\tvUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n\tvMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n\tvAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n\tvLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n\tvAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n\tvBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n\tvNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n\tvDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n\tvEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n\tvMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n\tvRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n\tvAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n\tvClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\tvClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\tvClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\tvIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\tvIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\tvSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\tvSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n\tvSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\tvSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\tvSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\tvTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n\tvThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
    worldpos_vertex:
      "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n\tvec4 worldPosition = vec4( transformed, 1.0 );\n\t#ifdef USE_BATCHING\n\t\tworldPosition = batchingMatrix * worldPosition;\n\t#endif\n\t#ifdef USE_INSTANCING\n\t\tworldPosition = instanceMatrix * worldPosition;\n\t#endif\n\tworldPosition = modelMatrix * worldPosition;\n#endif",
    background_vert:
      "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\tgl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
    background_frag:
      "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n\tvec4 texColor = texture2D( t2D, vUv );\n\t#ifdef DECODE_VIDEO_TEXTURE\n\t\ttexColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n\t#endif\n\ttexColor.rgb *= backgroundIntensity;\n\tgl_FragColor = texColor;\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n}",
    backgroundCube_vert:
      "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\tgl_Position.z = gl_Position.w;\n}",
    backgroundCube_frag:
      "#ifdef ENVMAP_TYPE_CUBE\n\tuniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n\tuniform sampler2D envMap;\n#endif\nuniform float flipEnvMap;\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tvec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );\n\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\t\tvec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n\t#else\n\t\tvec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t#endif\n\ttexColor.rgb *= backgroundIntensity;\n\tgl_FragColor = texColor;\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n}",
    cube_vert:
      "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\tgl_Position.z = gl_Position.w;\n}",
    cube_frag:
      "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n\tvec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n\tgl_FragColor = texColor;\n\tgl_FragColor.a *= opacity;\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n}",
    depth_vert:
      "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n\t#include <uv_vertex>\n\t#include <batching_vertex>\n\t#include <skinbase_vertex>\n\t#include <morphinstance_vertex>\n\t#ifdef USE_DISPLACEMENTMAP\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvHighPrecisionZW = gl_Position.zw;\n}",
    depth_frag:
      "#if DEPTH_PACKING == 3200\n\tuniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n\tvec4 diffuseColor = vec4( 1.0 );\n\t#include <clipping_planes_fragment>\n\t#if DEPTH_PACKING == 3200\n\t\tdiffuseColor.a = opacity;\n\t#endif\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <logdepthbuf_fragment>\n\tfloat fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;\n\t#if DEPTH_PACKING == 3200\n\t\tgl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n\t#elif DEPTH_PACKING == 3201\n\t\tgl_FragColor = packDepthToRGBA( fragCoordZ );\n\t#elif DEPTH_PACKING == 3202\n\t\tgl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n\t#elif DEPTH_PACKING == 3203\n\t\tgl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n\t#endif\n}",
    distanceRGBA_vert:
      "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <batching_vertex>\n\t#include <skinbase_vertex>\n\t#include <morphinstance_vertex>\n\t#ifdef USE_DISPLACEMENTMAP\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\tvWorldPosition = worldPosition.xyz;\n}",
    distanceRGBA_frag:
      "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main () {\n\tvec4 diffuseColor = vec4( 1.0 );\n\t#include <clipping_planes_fragment>\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\tfloat dist = length( vWorldPosition - referencePosition );\n\tdist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n\tdist = saturate( dist );\n\tgl_FragColor = packDepthToRGBA( dist );\n}",
    equirect_vert:
      "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\t#include <begin_vertex>\n\t#include <project_vertex>\n}",
    equirect_frag:
      "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n\tvec3 direction = normalize( vWorldDirection );\n\tvec2 sampleUV = equirectUv( direction );\n\tgl_FragColor = texture2D( tEquirect, sampleUV );\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n}",
    linedashed_vert:
      "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\tvLineDistance = scale * lineDistance;\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n}",
    linedashed_frag:
      "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tif ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n\tvec3 outgoingLight = vec3( 0.0 );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n}",
    meshbasic_vert:
      "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinbase_vertex>\n\t\t#include <skinnormal_vertex>\n\t\t#include <defaultnormal_vertex>\n\t#endif\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <fog_vertex>\n}",
    meshbasic_frag:
      "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n\tvarying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\t#ifdef USE_LIGHTMAP\n\t\tvec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n\t\treflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n\t#else\n\t\treflectedLight.indirectDiffuse += vec3( 1.0 );\n\t#endif\n\t#include <aomap_fragment>\n\treflectedLight.indirectDiffuse *= diffuseColor.rgb;\n\tvec3 outgoingLight = reflectedLight.indirectDiffuse;\n\t#include <envmap_fragment>\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    meshlambert_vert:
      "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
    meshlambert_frag:
      "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_lambert_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\t#include <envmap_fragment>\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    meshmatcap_vert:
      "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n\tvViewPosition = - mvPosition.xyz;\n}",
    meshmatcap_frag:
      "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\tvec3 viewDir = normalize( vViewPosition );\n\tvec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n\tvec3 y = cross( viewDir, x );\n\tvec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n\t#ifdef USE_MATCAP\n\t\tvec4 matcapColor = texture2D( matcap, uv );\n\t#else\n\t\tvec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n\t#endif\n\tvec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    meshnormal_vert:
      "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\tvarying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\tvViewPosition = - mvPosition.xyz;\n#endif\n}",
    meshnormal_frag:
      "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\tvarying vec3 vViewPosition;\n#endif\n#include <packing>\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n\t#include <clipping_planes_fragment>\n\t#include <logdepthbuf_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\tgl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );\n\t#ifdef OPAQUE\n\t\tgl_FragColor.a = 1.0;\n\t#endif\n}",
    meshphong_vert:
      "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
    meshphong_frag:
      "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_phong_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\t#include <envmap_fragment>\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    meshphysical_vert:
      "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n\tvarying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n\tvWorldPosition = worldPosition.xyz;\n#endif\n}",
    meshphysical_frag:
      "#define STANDARD\n#ifdef PHYSICAL\n\t#define IOR\n\t#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n\tuniform float ior;\n#endif\n#ifdef USE_SPECULAR\n\tuniform float specularIntensity;\n\tuniform vec3 specularColor;\n\t#ifdef USE_SPECULAR_COLORMAP\n\t\tuniform sampler2D specularColorMap;\n\t#endif\n\t#ifdef USE_SPECULAR_INTENSITYMAP\n\t\tuniform sampler2D specularIntensityMap;\n\t#endif\n#endif\n#ifdef USE_CLEARCOAT\n\tuniform float clearcoat;\n\tuniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n\tuniform float dispersion;\n#endif\n#ifdef USE_IRIDESCENCE\n\tuniform float iridescence;\n\tuniform float iridescenceIOR;\n\tuniform float iridescenceThicknessMinimum;\n\tuniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n\tuniform vec3 sheenColor;\n\tuniform float sheenRoughness;\n\t#ifdef USE_SHEEN_COLORMAP\n\t\tuniform sampler2D sheenColorMap;\n\t#endif\n\t#ifdef USE_SHEEN_ROUGHNESSMAP\n\t\tuniform sampler2D sheenRoughnessMap;\n\t#endif\n#endif\n#ifdef USE_ANISOTROPY\n\tuniform vec2 anisotropyVector;\n\t#ifdef USE_ANISOTROPYMAP\n\t\tuniform sampler2D anisotropyMap;\n\t#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <roughnessmap_fragment>\n\t#include <metalnessmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <clearcoat_normal_fragment_begin>\n\t#include <clearcoat_normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_physical_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n\tvec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n\t#include <transmission_fragment>\n\tvec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n\t#ifdef USE_SHEEN\n\t\tfloat sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );\n\t\toutgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;\n\t#endif\n\t#ifdef USE_CLEARCOAT\n\t\tfloat dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n\t\tvec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n\t\toutgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n\t#endif\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    meshtoon_vert:
      "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\tvViewPosition = - mvPosition.xyz;\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
    meshtoon_frag:
      "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\t#include <lights_toon_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\t#include <aomap_fragment>\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n}",
    points_vert:
      "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n\tvarying vec2 vUv;\n\tuniform mat3 uvTransform;\n#endif\nvoid main() {\n\t#ifdef USE_POINTS_UV\n\t\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\t#endif\n\t#include <color_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphcolor_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\tgl_PointSize = size;\n\t#ifdef USE_SIZEATTENUATION\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\t\tif ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n\t#endif\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <fog_vertex>\n}",
    points_frag:
      "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tvec3 outgoingLight = vec3( 0.0 );\n\t#include <logdepthbuf_fragment>\n\t#include <map_particle_fragment>\n\t#include <color_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n}",
    shadow_vert:
      "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n\t#include <batching_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphinstance_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n}",
    shadow_frag:
      "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <packing>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n\t#include <logdepthbuf_fragment>\n\tgl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n}",
    sprite_vert:
      "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n\t#include <uv_vertex>\n\tvec4 mvPosition = modelViewMatrix[ 3 ];\n\tvec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n\t#ifndef USE_SIZEATTENUATION\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\t\tif ( isPerspective ) scale *= - mvPosition.z;\n\t#endif\n\tvec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n\tvec2 rotatedPosition;\n\trotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n\trotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n\tmvPosition.xy += rotatedPosition;\n\tgl_Position = projectionMatrix * mvPosition;\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n}",
    sprite_frag:
      "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\t#include <clipping_planes_fragment>\n\tvec3 outgoingLight = vec3( 0.0 );\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\toutgoingLight = diffuseColor.rgb;\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n}",
  },
  Nr = {
    common: {
      diffuse: {
        value: new fi(16777215),
      },
      opacity: {
        value: 1,
      },
      map: {
        value: null,
      },
      mapTransform: {
        value: new xe(),
      },
      alphaMap: {
        value: null,
      },
      alphaMapTransform: {
        value: new xe(),
      },
      alphaTest: {
        value: 0,
      },
    },
    specularmap: {
      specularMap: {
        value: null,
      },
      specularMapTransform: {
        value: new xe(),
      },
    },
    envmap: {
      envMap: {
        value: null,
      },
      envMapRotation: {
        value: new xe(),
      },
      flipEnvMap: {
        value: -1,
      },
      reflectivity: {
        value: 1,
      },
      ior: {
        value: 1.5,
      },
      refractionRatio: {
        value: 0.98,
      },
    },
    aomap: {
      aoMap: {
        value: null,
      },
      aoMapIntensity: {
        value: 1,
      },
      aoMapTransform: {
        value: new xe(),
      },
    },
    lightmap: {
      lightMap: {
        value: null,
      },
      lightMapIntensity: {
        value: 1,
      },
      lightMapTransform: {
        value: new xe(),
      },
    },
    bumpmap: {
      bumpMap: {
        value: null,
      },
      bumpMapTransform: {
        value: new xe(),
      },
      bumpScale: {
        value: 1,
      },
    },
    normalmap: {
      normalMap: {
        value: null,
      },
      normalMapTransform: {
        value: new xe(),
      },
      normalScale: {
        value: new ve(1, 1),
      },
    },
    displacementmap: {
      displacementMap: {
        value: null,
      },
      displacementMapTransform: {
        value: new xe(),
      },
      displacementScale: {
        value: 1,
      },
      displacementBias: {
        value: 0,
      },
    },
    emissivemap: {
      emissiveMap: {
        value: null,
      },
      emissiveMapTransform: {
        value: new xe(),
      },
    },
    metalnessmap: {
      metalnessMap: {
        value: null,
      },
      metalnessMapTransform: {
        value: new xe(),
      },
    },
    roughnessmap: {
      roughnessMap: {
        value: null,
      },
      roughnessMapTransform: {
        value: new xe(),
      },
    },
    gradientmap: {
      gradientMap: {
        value: null,
      },
    },
    fog: {
      fogDensity: {
        value: 25e-5,
      },
      fogNear: {
        value: 1,
      },
      fogFar: {
        value: 2e3,
      },
      fogColor: {
        value: new fi(16777215),
      },
    },
    lights: {
      ambientLightColor: {
        value: [],
      },
      lightProbe: {
        value: [],
      },
      directionalLights: {
        value: [],
        properties: {
          direction: {},
          color: {},
        },
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      directionalShadowMap: {
        value: [],
      },
      directionalShadowMatrix: {
        value: [],
      },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {},
        },
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      spotLightMap: {
        value: [],
      },
      spotShadowMap: {
        value: [],
      },
      spotLightMatrix: {
        value: [],
      },
      pointLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          decay: {},
          distance: {},
        },
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {},
        },
      },
      pointShadowMap: {
        value: [],
      },
      pointShadowMatrix: {
        value: [],
      },
      hemisphereLights: {
        value: [],
        properties: {
          direction: {},
          skyColor: {},
          groundColor: {},
        },
      },
      rectAreaLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          width: {},
          height: {},
        },
      },
      ltc_1: {
        value: null,
      },
      ltc_2: {
        value: null,
      },
    },
    points: {
      diffuse: {
        value: new fi(16777215),
      },
      opacity: {
        value: 1,
      },
      size: {
        value: 1,
      },
      scale: {
        value: 1,
      },
      map: {
        value: null,
      },
      alphaMap: {
        value: null,
      },
      alphaMapTransform: {
        value: new xe(),
      },
      alphaTest: {
        value: 0,
      },
      uvTransform: {
        value: new xe(),
      },
    },
    sprite: {
      diffuse: {
        value: new fi(16777215),
      },
      opacity: {
        value: 1,
      },
      center: {
        value: new ve(0.5, 0.5),
      },
      rotation: {
        value: 0,
      },
      map: {
        value: null,
      },
      mapTransform: {
        value: new xe(),
      },
      alphaMap: {
        value: null,
      },
      alphaMapTransform: {
        value: new xe(),
      },
      alphaTest: {
        value: 0,
      },
    },
  },
  Or = {
    basic: {
      uniforms: Ki([
        Nr.common,
        Nr.specularmap,
        Nr.envmap,
        Nr.aomap,
        Nr.lightmap,
        Nr.fog,
      ]),
      vertexShader: Dr.meshbasic_vert,
      fragmentShader: Dr.meshbasic_frag,
    },
    lambert: {
      uniforms: Ki([
        Nr.common,
        Nr.specularmap,
        Nr.envmap,
        Nr.aomap,
        Nr.lightmap,
        Nr.emissivemap,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        Nr.fog,
        Nr.lights,
        {
          emissive: {
            value: new fi(0),
          },
        },
      ]),
      vertexShader: Dr.meshlambert_vert,
      fragmentShader: Dr.meshlambert_frag,
    },
    phong: {
      uniforms: Ki([
        Nr.common,
        Nr.specularmap,
        Nr.envmap,
        Nr.aomap,
        Nr.lightmap,
        Nr.emissivemap,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        Nr.fog,
        Nr.lights,
        {
          emissive: {
            value: new fi(0),
          },
          specular: {
            value: new fi(1118481),
          },
          shininess: {
            value: 30,
          },
        },
      ]),
      vertexShader: Dr.meshphong_vert,
      fragmentShader: Dr.meshphong_frag,
    },
    standard: {
      uniforms: Ki([
        Nr.common,
        Nr.envmap,
        Nr.aomap,
        Nr.lightmap,
        Nr.emissivemap,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        Nr.roughnessmap,
        Nr.metalnessmap,
        Nr.fog,
        Nr.lights,
        {
          emissive: {
            value: new fi(0),
          },
          roughness: {
            value: 1,
          },
          metalness: {
            value: 0,
          },
          envMapIntensity: {
            value: 1,
          },
        },
      ]),
      vertexShader: Dr.meshphysical_vert,
      fragmentShader: Dr.meshphysical_frag,
    },
    toon: {
      uniforms: Ki([
        Nr.common,
        Nr.aomap,
        Nr.lightmap,
        Nr.emissivemap,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        Nr.gradientmap,
        Nr.fog,
        Nr.lights,
        {
          emissive: {
            value: new fi(0),
          },
        },
      ]),
      vertexShader: Dr.meshtoon_vert,
      fragmentShader: Dr.meshtoon_frag,
    },
    matcap: {
      uniforms: Ki([
        Nr.common,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        Nr.fog,
        {
          matcap: {
            value: null,
          },
        },
      ]),
      vertexShader: Dr.meshmatcap_vert,
      fragmentShader: Dr.meshmatcap_frag,
    },
    points: {
      uniforms: Ki([Nr.points, Nr.fog]),
      vertexShader: Dr.points_vert,
      fragmentShader: Dr.points_frag,
    },
    dashed: {
      uniforms: Ki([
        Nr.common,
        Nr.fog,
        {
          scale: {
            value: 1,
          },
          dashSize: {
            value: 1,
          },
          totalSize: {
            value: 2,
          },
        },
      ]),
      vertexShader: Dr.linedashed_vert,
      fragmentShader: Dr.linedashed_frag,
    },
    depth: {
      uniforms: Ki([Nr.common, Nr.displacementmap]),
      vertexShader: Dr.depth_vert,
      fragmentShader: Dr.depth_frag,
    },
    normal: {
      uniforms: Ki([
        Nr.common,
        Nr.bumpmap,
        Nr.normalmap,
        Nr.displacementmap,
        {
          opacity: {
            value: 1,
          },
        },
      ]),
      vertexShader: Dr.meshnormal_vert,
      fragmentShader: Dr.meshnormal_frag,
    },
    sprite: {
      uniforms: Ki([Nr.sprite, Nr.fog]),
      vertexShader: Dr.sprite_vert,
      fragmentShader: Dr.sprite_frag,
    },
    background: {
      uniforms: {
        uvTransform: {
          value: new xe(),
        },
        t2D: {
          value: null,
        },
        backgroundIntensity: {
          value: 1,
        },
      },
      vertexShader: Dr.background_vert,
      fragmentShader: Dr.background_frag,
    },
    backgroundCube: {
      uniforms: {
        envMap: {
          value: null,
        },
        flipEnvMap: {
          value: -1,
        },
        backgroundBlurriness: {
          value: 0,
        },
        backgroundIntensity: {
          value: 1,
        },
        backgroundRotation: {
          value: new xe(),
        },
      },
      vertexShader: Dr.backgroundCube_vert,
      fragmentShader: Dr.backgroundCube_frag,
    },
    cube: {
      uniforms: {
        tCube: {
          value: null,
        },
        tFlip: {
          value: -1,
        },
        opacity: {
          value: 1,
        },
      },
      vertexShader: Dr.cube_vert,
      fragmentShader: Dr.cube_frag,
    },
    equirect: {
      uniforms: {
        tEquirect: {
          value: null,
        },
      },
      vertexShader: Dr.equirect_vert,
      fragmentShader: Dr.equirect_frag,
    },
    distanceRGBA: {
      uniforms: Ki([
        Nr.common,
        Nr.displacementmap,
        {
          referencePosition: {
            value: new Xe(),
          },
          nearDistance: {
            value: 1,
          },
          farDistance: {
            value: 1e3,
          },
        },
      ]),
      vertexShader: Dr.distanceRGBA_vert,
      fragmentShader: Dr.distanceRGBA_frag,
    },
    shadow: {
      uniforms: Ki([
        Nr.lights,
        Nr.fog,
        {
          color: {
            value: new fi(0),
          },
          opacity: {
            value: 1,
          },
        },
      ]),
      vertexShader: Dr.shadow_vert,
      fragmentShader: Dr.shadow_frag,
    },
  };
Or.physical = {
  uniforms: Ki([
    Or.standard.uniforms,
    {
      clearcoat: {
        value: 0,
      },
      clearcoatMap: {
        value: null,
      },
      clearcoatMapTransform: {
        value: new xe(),
      },
      clearcoatNormalMap: {
        value: null,
      },
      clearcoatNormalMapTransform: {
        value: new xe(),
      },
      clearcoatNormalScale: {
        value: new ve(1, 1),
      },
      clearcoatRoughness: {
        value: 0,
      },
      clearcoatRoughnessMap: {
        value: null,
      },
      clearcoatRoughnessMapTransform: {
        value: new xe(),
      },
      dispersion: {
        value: 0,
      },
      iridescence: {
        value: 0,
      },
      iridescenceMap: {
        value: null,
      },
      iridescenceMapTransform: {
        value: new xe(),
      },
      iridescenceIOR: {
        value: 1.3,
      },
      iridescenceThicknessMinimum: {
        value: 100,
      },
      iridescenceThicknessMaximum: {
        value: 400,
      },
      iridescenceThicknessMap: {
        value: null,
      },
      iridescenceThicknessMapTransform: {
        value: new xe(),
      },
      sheen: {
        value: 0,
      },
      sheenColor: {
        value: new fi(0),
      },
      sheenColorMap: {
        value: null,
      },
      sheenColorMapTransform: {
        value: new xe(),
      },
      sheenRoughness: {
        value: 1,
      },
      sheenRoughnessMap: {
        value: null,
      },
      sheenRoughnessMapTransform: {
        value: new xe(),
      },
      transmission: {
        value: 0,
      },
      transmissionMap: {
        value: null,
      },
      transmissionMapTransform: {
        value: new xe(),
      },
      transmissionSamplerSize: {
        value: new ve(),
      },
      transmissionSamplerMap: {
        value: null,
      },
      thickness: {
        value: 0,
      },
      thicknessMap: {
        value: null,
      },
      thicknessMapTransform: {
        value: new xe(),
      },
      attenuationDistance: {
        value: 0,
      },
      attenuationColor: {
        value: new fi(0),
      },
      specularColor: {
        value: new fi(1, 1, 1),
      },
      specularColorMap: {
        value: null,
      },
      specularColorMapTransform: {
        value: new xe(),
      },
      specularIntensity: {
        value: 1,
      },
      specularIntensityMap: {
        value: null,
      },
      specularIntensityMapTransform: {
        value: new xe(),
      },
      anisotropyVector: {
        value: new ve(),
      },
      anisotropyMap: {
        value: null,
      },
      anisotropyMapTransform: {
        value: new xe(),
      },
    },
  ]),
  vertexShader: Dr.meshphysical_vert,
  fragmentShader: Dr.meshphysical_frag,
};
const Fr = {
    r: 0,
    b: 0,
    g: 0,
  },
  Br = new In(),
  zr = new En();
function Gr(t, e, n, i, r, s, a) {
  const o = new fi(0);
  let l,
    c,
    h = !0 === s ? 0 : 1,
    u = null,
    d = 0,
    p = null;
  function f(t) {
    let i = !0 === t.isScene ? t.background : null;
    if (i && i.isTexture) {
      i = (t.backgroundBlurriness > 0 ? n : e).get(i);
    }
    return i;
  }
  function m(e, n) {
    e.getRGB(Fr, Zi(t)), i.buffers.color.setClear(Fr.r, Fr.g, Fr.b, n, a);
  }
  return {
    getClearColor: function () {
      return o;
    },
    setClearColor: function (t, e = 1) {
      o.set(t), (h = e), m(o, h);
    },
    getClearAlpha: function () {
      return h;
    },
    setClearAlpha: function (t) {
      (h = t), m(o, h);
    },
    render: function (e) {
      let n = !1;
      const r = f(e);
      null === r ? m(o, h) : r && r.isColor && (m(r, 1), (n = !0));
      const s = t.xr.getEnvironmentBlendMode();
      "additive" === s
        ? i.buffers.color.setClear(0, 0, 0, 1, a)
        : "alpha-blend" === s && i.buffers.color.setClear(0, 0, 0, 0, a),
        (t.autoClear || n) &&
          (i.buffers.depth.setTest(!0),
          i.buffers.depth.setMask(!0),
          i.buffers.color.setMask(!0),
          t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil));
    },
    addToRenderList: function (e, n) {
      const i = f(n);
      i && (i.isCubeTexture || i.mapping === H)
        ? (void 0 === c &&
            ((c = new Xi(
              new qi(1, 1, 1),
              new $i({
                name: "BackgroundCubeMaterial",
                uniforms: Yi(Or.backgroundCube.uniforms),
                vertexShader: Or.backgroundCube.vertexShader,
                fragmentShader: Or.backgroundCube.fragmentShader,
                side: 1,
                depthTest: !1,
                depthWrite: !1,
                fog: !1,
                allowOverride: !1,
              })
            )),
            c.geometry.deleteAttribute("normal"),
            c.geometry.deleteAttribute("uv"),
            (c.onBeforeRender = function (t, e, n) {
              this.matrixWorld.copyPosition(n.matrixWorld);
            }),
            Object.defineProperty(c.material, "envMap", {
              get: function () {
                return this.uniforms.envMap.value;
              },
            }),
            r.update(c)),
          Br.copy(n.backgroundRotation),
          (Br.x *= -1),
          (Br.y *= -1),
          (Br.z *= -1),
          i.isCubeTexture &&
            !1 === i.isRenderTargetTexture &&
            ((Br.y *= -1), (Br.z *= -1)),
          (c.material.uniforms.envMap.value = i),
          (c.material.uniforms.flipEnvMap.value =
            i.isCubeTexture && !1 === i.isRenderTargetTexture ? -1 : 1),
          (c.material.uniforms.backgroundBlurriness.value =
            n.backgroundBlurriness),
          (c.material.uniforms.backgroundIntensity.value =
            n.backgroundIntensity),
          c.material.uniforms.backgroundRotation.value.setFromMatrix4(
            zr.makeRotationFromEuler(Br)
          ),
          (c.material.toneMapped = Re.getTransfer(i.colorSpace) !== Zt),
          (u === i && d === i.version && p === t.toneMapping) ||
            ((c.material.needsUpdate = !0),
            (u = i),
            (d = i.version),
            (p = t.toneMapping)),
          c.layers.enableAll(),
          e.unshift(c, c.geometry, c.material, 0, 0, null))
        : i &&
          i.isTexture &&
          (void 0 === l &&
            ((l = new Xi(
              new Sr(2, 2),
              new $i({
                name: "BackgroundMaterial",
                uniforms: Yi(Or.background.uniforms),
                vertexShader: Or.background.vertexShader,
                fragmentShader: Or.background.fragmentShader,
                side: 0,
                depthTest: !1,
                depthWrite: !1,
                fog: !1,
                allowOverride: !1,
              })
            )),
            l.geometry.deleteAttribute("normal"),
            Object.defineProperty(l.material, "map", {
              get: function () {
                return this.uniforms.t2D.value;
              },
            }),
            r.update(l)),
          (l.material.uniforms.t2D.value = i),
          (l.material.uniforms.backgroundIntensity.value =
            n.backgroundIntensity),
          (l.material.toneMapped = Re.getTransfer(i.colorSpace) !== Zt),
          !0 === i.matrixAutoUpdate && i.updateMatrix(),
          l.material.uniforms.uvTransform.value.copy(i.matrix),
          (u === i && d === i.version && p === t.toneMapping) ||
            ((l.material.needsUpdate = !0),
            (u = i),
            (d = i.version),
            (p = t.toneMapping)),
          l.layers.enableAll(),
          e.unshift(l, l.geometry, l.material, 0, 0, null));
    },
    dispose: function () {
      void 0 !== c &&
        (c.geometry.dispose(), c.material.dispose(), (c = void 0)),
        void 0 !== l &&
          (l.geometry.dispose(), l.material.dispose(), (l = void 0));
    },
  };
}
function Hr(t, e) {
  const n = t.getParameter(t.MAX_VERTEX_ATTRIBS),
    i = {},
    r = c(null);
  let s = r,
    a = !1;
  function o(e) {
    return t.bindVertexArray(e);
  }
  function l(e) {
    return t.deleteVertexArray(e);
  }
  function c(t) {
    const e = [],
      i = [],
      r = [];
    for (let s = 0; s < n; s++) (e[s] = 0), (i[s] = 0), (r[s] = 0);
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: e,
      enabledAttributes: i,
      attributeDivisors: r,
      object: t,
      attributes: {},
      index: null,
    };
  }
  function h() {
    const t = s.newAttributes;
    for (let e = 0, n = t.length; e < n; e++) t[e] = 0;
  }
  function u(t) {
    d(t, 0);
  }
  function d(e, n) {
    const i = s.newAttributes,
      r = s.enabledAttributes,
      a = s.attributeDivisors;
    (i[e] = 1),
      0 === r[e] && (t.enableVertexAttribArray(e), (r[e] = 1)),
      a[e] !== n && (t.vertexAttribDivisor(e, n), (a[e] = n));
  }
  function p() {
    const e = s.newAttributes,
      n = s.enabledAttributes;
    for (let i = 0, r = n.length; i < r; i++)
      n[i] !== e[i] && (t.disableVertexAttribArray(i), (n[i] = 0));
  }
  function f(e, n, i, r, s, a, o) {
    !0 === o
      ? t.vertexAttribIPointer(e, n, i, s, a)
      : t.vertexAttribPointer(e, n, i, r, s, a);
  }
  function m() {
    g(), (a = !0), s !== r && ((s = r), o(s.object));
  }
  function g() {
    (r.geometry = null), (r.program = null), (r.wireframe = !1);
  }
  return {
    setup: function (n, r, l, m, g) {
      let _ = !1;
      const v = (function (e, n, r) {
        const s = !0 === r.wireframe;
        let a = i[e.id];
        void 0 === a && ((a = {}), (i[e.id] = a));
        let o = a[n.id];
        void 0 === o && ((o = {}), (a[n.id] = o));
        let l = o[s];
        void 0 === l && ((l = c(t.createVertexArray())), (o[s] = l));
        return l;
      })(m, l, r);
      s !== v && ((s = v), o(s.object)),
        (_ = (function (t, e, n, i) {
          const r = s.attributes,
            a = e.attributes;
          let o = 0;
          const l = n.getAttributes();
          for (const s in l) {
            if (l[s].location >= 0) {
              const e = r[s];
              let n = a[s];
              if (
                (void 0 === n &&
                  ("instanceMatrix" === s &&
                    t.instanceMatrix &&
                    (n = t.instanceMatrix),
                  "instanceColor" === s &&
                    t.instanceColor &&
                    (n = t.instanceColor)),
                void 0 === e)
              )
                return !0;
              if (e.attribute !== n) return !0;
              if (n && e.data !== n.data) return !0;
              o++;
            }
          }
          return s.attributesNum !== o || s.index !== i;
        })(n, m, l, g)),
        _ &&
          (function (t, e, n, i) {
            const r = {},
              a = e.attributes;
            let o = 0;
            const l = n.getAttributes();
            for (const s in l) {
              if (l[s].location >= 0) {
                let e = a[s];
                void 0 === e &&
                  ("instanceMatrix" === s &&
                    t.instanceMatrix &&
                    (e = t.instanceMatrix),
                  "instanceColor" === s &&
                    t.instanceColor &&
                    (e = t.instanceColor));
                const n = {};
                (n.attribute = e),
                  e && e.data && (n.data = e.data),
                  (r[s] = n),
                  o++;
              }
            }
            (s.attributes = r), (s.attributesNum = o), (s.index = i);
          })(n, m, l, g),
        null !== g && e.update(g, t.ELEMENT_ARRAY_BUFFER),
        (_ || a) &&
          ((a = !1),
          (function (n, i, r, s) {
            h();
            const a = s.attributes,
              o = r.getAttributes(),
              l = i.defaultAttributeValues;
            for (const c in o) {
              const i = o[c];
              if (i.location >= 0) {
                let r = a[c];
                if (
                  (void 0 === r &&
                    ("instanceMatrix" === c &&
                      n.instanceMatrix &&
                      (r = n.instanceMatrix),
                    "instanceColor" === c &&
                      n.instanceColor &&
                      (r = n.instanceColor)),
                  void 0 !== r)
                ) {
                  const a = r.normalized,
                    o = r.itemSize,
                    l = e.get(r);
                  if (void 0 === l) continue;
                  const c = l.buffer,
                    h = l.type,
                    p = l.bytesPerElement,
                    m = h === t.INT || h === t.UNSIGNED_INT || r.gpuType === et;
                  if (r.isInterleavedBufferAttribute) {
                    const e = r.data,
                      l = e.stride,
                      g = r.offset;
                    if (e.isInstancedInterleavedBuffer) {
                      for (let t = 0; t < i.locationSize; t++)
                        d(i.location + t, e.meshPerAttribute);
                      !0 !== n.isInstancedMesh &&
                        void 0 === s._maxInstanceCount &&
                        (s._maxInstanceCount = e.meshPerAttribute * e.count);
                    } else
                      for (let t = 0; t < i.locationSize; t++)
                        u(i.location + t);
                    t.bindBuffer(t.ARRAY_BUFFER, c);
                    for (let t = 0; t < i.locationSize; t++)
                      f(
                        i.location + t,
                        o / i.locationSize,
                        h,
                        a,
                        l * p,
                        (g + (o / i.locationSize) * t) * p,
                        m
                      );
                  } else {
                    if (r.isInstancedBufferAttribute) {
                      for (let t = 0; t < i.locationSize; t++)
                        d(i.location + t, r.meshPerAttribute);
                      !0 !== n.isInstancedMesh &&
                        void 0 === s._maxInstanceCount &&
                        (s._maxInstanceCount = r.meshPerAttribute * r.count);
                    } else
                      for (let t = 0; t < i.locationSize; t++)
                        u(i.location + t);
                    t.bindBuffer(t.ARRAY_BUFFER, c);
                    for (let t = 0; t < i.locationSize; t++)
                      f(
                        i.location + t,
                        o / i.locationSize,
                        h,
                        a,
                        o * p,
                        (o / i.locationSize) * t * p,
                        m
                      );
                  }
                } else if (void 0 !== l) {
                  const e = l[c];
                  if (void 0 !== e)
                    switch (e.length) {
                      case 2:
                        t.vertexAttrib2fv(i.location, e);
                        break;
                      case 3:
                        t.vertexAttrib3fv(i.location, e);
                        break;
                      case 4:
                        t.vertexAttrib4fv(i.location, e);
                        break;
                      default:
                        t.vertexAttrib1fv(i.location, e);
                    }
                }
              }
            }
            p();
          })(n, r, l, m),
          null !== g && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, e.get(g).buffer));
    },
    reset: m,
    resetDefaultState: g,
    dispose: function () {
      m();
      for (const t in i) {
        const e = i[t];
        for (const t in e) {
          const n = e[t];
          for (const t in n) l(n[t].object), delete n[t];
          delete e[t];
        }
        delete i[t];
      }
    },
    releaseStatesOfGeometry: function (t) {
      if (void 0 === i[t.id]) return;
      const e = i[t.id];
      for (const n in e) {
        const t = e[n];
        for (const e in t) l(t[e].object), delete t[e];
        delete e[n];
      }
      delete i[t.id];
    },
    releaseStatesOfProgram: function (t) {
      for (const e in i) {
        const n = i[e];
        if (void 0 === n[t.id]) continue;
        const r = n[t.id];
        for (const t in r) l(r[t].object), delete r[t];
        delete n[t.id];
      }
    },
    initAttributes: h,
    enableAttribute: u,
    disableUnusedAttributes: p,
  };
}
function kr(t, e, n) {
  let i;
  function r(e, r, s) {
    0 !== s && (t.drawArraysInstanced(i, e, r, s), n.update(r, i, s));
  }
  (this.setMode = function (t) {
    i = t;
  }),
    (this.render = function (e, r) {
      t.drawArrays(i, e, r), n.update(r, i, 1);
    }),
    (this.renderInstances = r),
    (this.renderMultiDraw = function (t, r, s) {
      if (0 === s) return;
      e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i, t, 0, r, 0, s);
      let a = 0;
      for (let e = 0; e < s; e++) a += r[e];
      n.update(a, i, 1);
    }),
    (this.renderMultiDrawInstances = function (t, s, a, o) {
      if (0 === a) return;
      const l = e.get("WEBGL_multi_draw");
      if (null === l) for (let e = 0; e < t.length; e++) r(t[e], s[e], o[e]);
      else {
        l.multiDrawArraysInstancedWEBGL(i, t, 0, s, 0, o, 0, a);
        let e = 0;
        for (let t = 0; t < a; t++) e += s[t] * o[t];
        n.update(e, i, 1);
      }
    });
}
function Vr(t, e, n, i) {
  let r;
  function s(e) {
    if ("highp" === e) {
      if (
        t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_FLOAT).precision >
          0 &&
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT).precision >
          0
      )
        return "highp";
      e = "mediump";
    }
    return "mediump" === e &&
      t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_FLOAT).precision >
        0 &&
      t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_FLOAT).precision >
        0
      ? "mediump"
      : "lowp";
  }
  let a = void 0 !== n.precision ? n.precision : "highp";
  const o = s(a);
  o !== a &&
    (console.warn(
      "THREE.WebGLRenderer:",
      a,
      "not supported, using",
      o,
      "instead."
    ),
    (a = o));
  const l = !0 === n.logarithmicDepthBuffer,
    c = !0 === n.reverseDepthBuffer && e.has("EXT_clip_control"),
    h = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
    u = t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: function () {
      if (void 0 !== r) return r;
      if (!0 === e.has("EXT_texture_filter_anisotropic")) {
        const n = e.get("EXT_texture_filter_anisotropic");
        r = t.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      } else r = 0;
      return r;
    },
    getMaxPrecision: s,
    textureFormatReadable: function (e) {
      return (
        e === ct ||
        i.convert(e) === t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT)
      );
    },
    textureTypeReadable: function (n) {
      const r =
        n === rt &&
        (e.has("EXT_color_buffer_half_float") ||
          e.has("EXT_color_buffer_float"));
      return !(
        n !== J &&
        i.convert(n) !== t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE) &&
        n !== it &&
        !r
      );
    },
    precision: a,
    logarithmicDepthBuffer: l,
    reverseDepthBuffer: c,
    maxTextures: h,
    maxVertexTextures: u,
    maxTextureSize: t.getParameter(t.MAX_TEXTURE_SIZE),
    maxCubemapSize: t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),
    maxAttributes: t.getParameter(t.MAX_VERTEX_ATTRIBS),
    maxVertexUniforms: t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),
    maxVaryings: t.getParameter(t.MAX_VARYING_VECTORS),
    maxFragmentUniforms: t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),
    vertexTextures: u > 0,
    maxSamples: t.getParameter(t.MAX_SAMPLES),
  };
}
function Wr(t) {
  const e = this;
  let n = null,
    i = 0,
    r = !1,
    s = !1;
  const a = new mr(),
    o = new xe(),
    l = {
      value: null,
      needsUpdate: !1,
    };
  function c(t, n, i, r) {
    const s = null !== t ? t.length : 0;
    let c = null;
    if (0 !== s) {
      if (((c = l.value), !0 !== r || null === c)) {
        const e = i + 4 * s,
          r = n.matrixWorldInverse;
        o.getNormalMatrix(r),
          (null === c || c.length < e) && (c = new Float32Array(e));
        for (let n = 0, l = i; n !== s; ++n, l += 4)
          a.copy(t[n]).applyMatrix4(r, o),
            a.normal.toArray(c, l),
            (c[l + 3] = a.constant);
      }
      (l.value = c), (l.needsUpdate = !0);
    }
    return (e.numPlanes = s), (e.numIntersection = 0), c;
  }
  (this.uniform = l),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (t, e) {
      const n = 0 !== t.length || e || 0 !== i || r;
      return (r = e), (i = t.length), n;
    }),
    (this.beginShadows = function () {
      (s = !0), c(null);
    }),
    (this.endShadows = function () {
      s = !1;
    }),
    (this.setGlobalState = function (t, e) {
      n = c(t, e, 0);
    }),
    (this.setState = function (a, o, h) {
      const u = a.clippingPlanes,
        d = a.clipIntersection,
        p = a.clipShadows,
        f = t.get(a);
      if (!r || null === u || 0 === u.length || (s && !p))
        s
          ? c(null)
          : (function () {
              l.value !== n && ((l.value = n), (l.needsUpdate = i > 0));
              (e.numPlanes = i), (e.numIntersection = 0);
            })();
      else {
        const t = s ? 0 : i,
          e = 4 * t;
        let r = f.clippingState || null;
        (l.value = r), (r = c(u, o, e, h));
        for (let i = 0; i !== e; ++i) r[i] = n[i];
        (f.clippingState = r),
          (this.numIntersection = d ? this.numPlanes : 0),
          (this.numPlanes += t);
      }
    });
}
function Xr(t) {
  let e = new WeakMap();
  function n(t, e) {
    return 303 === e ? (t.mapping = z) : 304 === e && (t.mapping = G), t;
  }
  function i(t) {
    const n = t.target;
    n.removeEventListener("dispose", i);
    const r = e.get(n);
    void 0 !== r && (e.delete(n), r.dispose());
  }
  return {
    get: function (r) {
      if (r && r.isTexture) {
        const s = r.mapping;
        if (303 === s || 304 === s) {
          if (e.has(r)) {
            return n(e.get(r).texture, r.mapping);
          }
          {
            const s = r.image;
            if (s && s.height > 0) {
              const a = new or(s.height);
              return (
                a.fromEquirectangularTexture(t, r),
                e.set(r, a),
                r.addEventListener("dispose", i),
                n(a.texture, r.mapping)
              );
            }
            return null;
          }
        }
      }
      return r;
    },
    dispose: function () {
      e = new WeakMap();
    },
  };
}
const jr = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  qr = 20,
  Yr = new Rr(),
  Kr = new fi();
let Zr = null,
  Jr = 0,
  $r = 0,
  Qr = !1;
const ts = (1 + Math.sqrt(5)) / 2,
  es = 1 / ts,
  ns = [
    new Xe(-ts, es, 0),
    new Xe(ts, es, 0),
    new Xe(-es, 0, ts),
    new Xe(es, 0, ts),
    new Xe(0, ts, -es),
    new Xe(0, ts, es),
    new Xe(-1, 1, -1),
    new Xe(1, 1, -1),
    new Xe(-1, 1, 1),
    new Xe(1, 1, 1),
  ],
  is = new Xe();
class rs {
  constructor(t) {
    (this._renderer = t),
      (this._pingPongRenderTarget = null),
      (this._lodMax = 0),
      (this._cubeSize = 0),
      (this._lodPlanes = []),
      (this._sizeLods = []),
      (this._sigmas = []),
      (this._blurMaterial = null),
      (this._cubemapMaterial = null),
      (this._equirectMaterial = null),
      this._compileMaterial(this._blurMaterial);
  }
  fromScene(t, e = 0, n = 0.1, i = 100, r = {}) {
    const { size: s = 256, position: a = is } = r;
    (Zr = this._renderer.getRenderTarget()),
      (Jr = this._renderer.getActiveCubeFace()),
      ($r = this._renderer.getActiveMipmapLevel()),
      (Qr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1),
      this._setSize(s);
    const o = this._allocateTargets();
    return (
      (o.depthBuffer = !0),
      this._sceneToCubeUV(t, n, i, o, a),
      e > 0 && this._blur(o, 0, 0, e),
      this._applyPMREM(o),
      this._cleanup(o),
      o
    );
  }
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  compileCubemapShader() {
    null === this._cubemapMaterial &&
      ((this._cubemapMaterial = ls()),
      this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    null === this._equirectMaterial &&
      ((this._equirectMaterial = os()),
      this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    this._dispose(),
      null !== this._cubemapMaterial && this._cubemapMaterial.dispose(),
      null !== this._equirectMaterial && this._equirectMaterial.dispose();
  }
  _setSize(t) {
    (this._lodMax = Math.floor(Math.log2(t))),
      (this._cubeSize = Math.pow(2, this._lodMax));
  }
  _dispose() {
    null !== this._blurMaterial && this._blurMaterial.dispose(),
      null !== this._pingPongRenderTarget &&
        this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Zr, Jr, $r),
      (this._renderer.xr.enabled = Qr),
      (t.scissorTest = !1),
      as(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === z || t.mapping === G
      ? this._setSize(
          0 === t.image.length ? 16 : t.image[0].width || t.image[0].image.width
        )
      : this._setSize(t.image.width / 4),
      (Zr = this._renderer.getRenderTarget()),
      (Jr = this._renderer.getActiveCubeFace()),
      ($r = this._renderer.getActiveMipmapLevel()),
      (Qr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1);
    const n = e || this._allocateTargets();
    return (
      this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n
    );
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112),
      e = 4 * this._cubeSize,
      n = {
        magFilter: Y,
        minFilter: Y,
        generateMipmaps: !1,
        type: rt,
        format: ct,
        colorSpace: Yt,
        depthBuffer: !1,
      },
      i = ss(t, e, n);
    if (
      null === this._pingPongRenderTarget ||
      this._pingPongRenderTarget.width !== t ||
      this._pingPongRenderTarget.height !== e
    ) {
      null !== this._pingPongRenderTarget && this._dispose(),
        (this._pingPongRenderTarget = ss(t, e, n));
      const { _lodMax: i } = this;
      ({
        sizeLods: this._sizeLods,
        lodPlanes: this._lodPlanes,
        sigmas: this._sigmas,
      } = (function (t) {
        const e = [],
          n = [],
          i = [];
        let r = t;
        const s = t - 4 + 1 + jr.length;
        for (let a = 0; a < s; a++) {
          const s = Math.pow(2, r);
          n.push(s);
          let o = 1 / s;
          a > t - 4 ? (o = jr[a - t + 4 - 1]) : 0 === a && (o = 0), i.push(o);
          const l = 1 / (s - 2),
            c = -l,
            h = 1 + l,
            u = [c, c, h, c, h, h, c, c, h, h, c, h],
            d = 6,
            p = 6,
            f = 3,
            m = 2,
            g = 1,
            _ = new Float32Array(f * p * d),
            v = new Float32Array(m * p * d),
            x = new Float32Array(g * p * d);
          for (let t = 0; t < d; t++) {
            const e = ((t % 3) * 2) / 3 - 1,
              n = t > 2 ? 0 : -1,
              i = [
                e,
                n,
                0,
                e + 2 / 3,
                n,
                0,
                e + 2 / 3,
                n + 1,
                0,
                e,
                n,
                0,
                e + 2 / 3,
                n + 1,
                0,
                e,
                n + 1,
                0,
              ];
            _.set(i, f * p * t), v.set(u, m * p * t);
            const r = [t, t, t, t, t, t];
            x.set(r, g * p * t);
          }
          const S = new Li();
          S.setAttribute("position", new Ei(_, f)),
            S.setAttribute("uv", new Ei(v, m)),
            S.setAttribute("faceIndex", new Ei(x, g)),
            e.push(S),
            r > 4 && r--;
        }
        return {
          lodPlanes: e,
          sizeLods: n,
          sigmas: i,
        };
      })(i)),
        (this._blurMaterial = (function (t, e, n) {
          const i = new Float32Array(qr),
            r = new Xe(0, 1, 0),
            s = new $i({
              name: "SphericalGaussianBlur",
              defines: {
                n: qr,
                CUBEUV_TEXEL_WIDTH: 1 / e,
                CUBEUV_TEXEL_HEIGHT: 1 / n,
                CUBEUV_MAX_MIP: `${t}.0`,
              },
              uniforms: {
                envMap: {
                  value: null,
                },
                samples: {
                  value: 1,
                },
                weights: {
                  value: i,
                },
                latitudinal: {
                  value: !1,
                },
                dTheta: {
                  value: 0,
                },
                mipInt: {
                  value: 0,
                },
                poleAxis: {
                  value: r,
                },
              },
              vertexShader: cs(),
              fragmentShader:
                "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform int samples;\n\t\t\tuniform float weights[ n ];\n\t\t\tuniform bool latitudinal;\n\t\t\tuniform float dTheta;\n\t\t\tuniform float mipInt;\n\t\t\tuniform vec3 poleAxis;\n\n\t\t\t#define ENVMAP_TYPE_CUBE_UV\n\t\t\t#include <cube_uv_reflection_fragment>\n\n\t\t\tvec3 getSample( float theta, vec3 axis ) {\n\n\t\t\t\tfloat cosTheta = cos( theta );\n\t\t\t\t// Rodrigues' axis-angle rotation\n\t\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross( axis, vOutputDirection ) * sin( theta )\n\t\t\t\t\t+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n\t\t\t\treturn bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n\t\t\t\tif ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n\t\t\t\t\taxis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n\t\t\t\t}\n\n\t\t\t\taxis = normalize( axis );\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n\t\t\t\tfor ( int i = 1; i < n; i++ ) {\n\n\t\t\t\t\tif ( i >= samples ) {\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfloat theta = dTheta * float( i );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n\t\t\t\t}\n\n\t\t\t}\n\t\t",
              blending: 0,
              depthTest: !1,
              depthWrite: !1,
            });
          return s;
        })(i, t, e));
    }
    return i;
  }
  _compileMaterial(t) {
    const e = new Xi(this._lodPlanes[0], t);
    this._renderer.compile(e, Yr);
  }
  _sceneToCubeUV(t, e, n, i, r) {
    const s = new ir(90, 1, e, n),
      a = [1, -1, 1, 1, 1, 1],
      o = [1, 1, 1, -1, -1, -1],
      l = this._renderer,
      c = l.autoClear,
      h = l.toneMapping;
    l.getClearColor(Kr), (l.toneMapping = 0), (l.autoClear = !1);
    const u = new vi({
        name: "PMREM.Background",
        side: 1,
        depthWrite: !1,
        depthTest: !1,
      }),
      d = new Xi(new qi(), u);
    let p = !1;
    const f = t.background;
    f
      ? f.isColor && (u.color.copy(f), (t.background = null), (p = !0))
      : (u.color.copy(Kr), (p = !0));
    for (let m = 0; m < 6; m++) {
      const e = m % 3;
      0 === e
        ? (s.up.set(0, a[m], 0),
          s.position.set(r.x, r.y, r.z),
          s.lookAt(r.x + o[m], r.y, r.z))
        : 1 === e
        ? (s.up.set(0, 0, a[m]),
          s.position.set(r.x, r.y, r.z),
          s.lookAt(r.x, r.y + o[m], r.z))
        : (s.up.set(0, a[m], 0),
          s.position.set(r.x, r.y, r.z),
          s.lookAt(r.x, r.y, r.z + o[m]));
      const n = this._cubeSize;
      as(i, e * n, m > 2 ? n : 0, n, n),
        l.setRenderTarget(i),
        p && l.render(d, s),
        l.render(t, s);
    }
    d.geometry.dispose(),
      d.material.dispose(),
      (l.toneMapping = h),
      (l.autoClear = c),
      (t.background = f);
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer,
      i = t.mapping === z || t.mapping === G;
    i
      ? (null === this._cubemapMaterial && (this._cubemapMaterial = ls()),
        (this._cubemapMaterial.uniforms.flipEnvMap.value =
          !1 === t.isRenderTargetTexture ? -1 : 1))
      : null === this._equirectMaterial && (this._equirectMaterial = os());
    const r = i ? this._cubemapMaterial : this._equirectMaterial,
      s = new Xi(this._lodPlanes[0], r);
    r.uniforms.envMap.value = t;
    const a = this._cubeSize;
    as(e, 0, 0, 3 * a, 2 * a), n.setRenderTarget(e), n.render(s, Yr);
  }
  _applyPMREM(t) {
    const e = this._renderer,
      n = e.autoClear;
    e.autoClear = !1;
    const i = this._lodPlanes.length;
    for (let r = 1; r < i; r++) {
      const e = Math.sqrt(
          this._sigmas[r] * this._sigmas[r] -
            this._sigmas[r - 1] * this._sigmas[r - 1]
        ),
        n = ns[(i - r - 1) % ns.length];
      this._blur(t, r - 1, r, e, n);
    }
    e.autoClear = n;
  }
  _blur(t, e, n, i, r) {
    const s = this._pingPongRenderTarget;
    this._halfBlur(t, s, e, n, i, "latitudinal", r),
      this._halfBlur(s, t, n, n, i, "longitudinal", r);
  }
  _halfBlur(t, e, n, i, r, s, a) {
    const o = this._renderer,
      l = this._blurMaterial;
    "latitudinal" !== s &&
      "longitudinal" !== s &&
      console.error(
        "blur direction must be either latitudinal or longitudinal!"
      );
    const c = new Xi(this._lodPlanes[i], l),
      h = l.uniforms,
      u = this._sizeLods[n] - 1,
      d = isFinite(r) ? Math.PI / (2 * u) : (2 * Math.PI) / 39,
      p = r / d,
      f = isFinite(r) ? 1 + Math.floor(3 * p) : qr;
    f > qr &&
      console.warn(
        `sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to 20`
      );
    const m = [];
    let g = 0;
    for (let x = 0; x < qr; ++x) {
      const t = x / p,
        e = Math.exp((-t * t) / 2);
      m.push(e), 0 === x ? (g += e) : x < f && (g += 2 * e);
    }
    for (let x = 0; x < m.length; x++) m[x] = m[x] / g;
    (h.envMap.value = t.texture),
      (h.samples.value = f),
      (h.weights.value = m),
      (h.latitudinal.value = "latitudinal" === s),
      a && (h.poleAxis.value = a);
    const { _lodMax: _ } = this;
    (h.dTheta.value = d), (h.mipInt.value = _ - n);
    const v = this._sizeLods[i];
    as(
      e,
      3 * v * (i > _ - 4 ? i - _ + 4 : 0),
      4 * (this._cubeSize - v),
      3 * v,
      2 * v
    ),
      o.setRenderTarget(e),
      o.render(c, Yr);
  }
}
function ss(t, e, n) {
  const i = new He(t, e, n);
  return (
    (i.texture.mapping = H),
    (i.texture.name = "PMREM.cubeUv"),
    (i.scissorTest = !0),
    i
  );
}
function as(t, e, n, i, r) {
  t.viewport.set(e, n, i, r), t.scissor.set(e, n, i, r);
}
function os() {
  return new $i({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: {
        value: null,
      },
    },
    vertexShader: cs(),
    fragmentShader:
      "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\n\t\t\t#include <common>\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 outputDirection = normalize( vOutputDirection );\n\t\t\t\tvec2 uv = equirectUv( outputDirection );\n\n\t\t\t\tgl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n\t\t\t}\n\t\t",
    blending: 0,
    depthTest: !1,
    depthWrite: !1,
  });
}
function ls() {
  return new $i({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: {
        value: null,
      },
      flipEnvMap: {
        value: -1,
      },
    },
    vertexShader: cs(),
    fragmentShader:
      "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tuniform float flipEnvMap;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform samplerCube envMap;\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n\t\t\t}\n\t\t",
    blending: 0,
    depthTest: !1,
    depthWrite: !1,
  });
}
function cs() {
  return "\n\n\t\tprecision mediump float;\n\t\tprecision mediump int;\n\n\t\tattribute float faceIndex;\n\n\t\tvarying vec3 vOutputDirection;\n\n\t\t// RH coordinate system; PMREM face-indexing convention\n\t\tvec3 getDirection( vec2 uv, float face ) {\n\n\t\t\tuv = 2.0 * uv - 1.0;\n\n\t\t\tvec3 direction = vec3( uv, 1.0 );\n\n\t\t\tif ( face == 0.0 ) {\n\n\t\t\t\tdirection = direction.zyx; // ( 1, v, u ) pos x\n\n\t\t\t} else if ( face == 1.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n\t\t\t} else if ( face == 2.0 ) {\n\n\t\t\t\tdirection.x *= -1.0; // ( -u, v, 1 ) pos z\n\n\t\t\t} else if ( face == 3.0 ) {\n\n\t\t\t\tdirection = direction.zyx;\n\t\t\t\tdirection.xz *= -1.0; // ( -1, v, -u ) neg x\n\n\t\t\t} else if ( face == 4.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xy *= -1.0; // ( -u, -1, v ) neg y\n\n\t\t\t} else if ( face == 5.0 ) {\n\n\t\t\t\tdirection.z *= -1.0; // ( u, v, -1 ) neg z\n\n\t\t\t}\n\n\t\t\treturn direction;\n\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvOutputDirection = getDirection( uv, faceIndex );\n\t\t\tgl_Position = vec4( position, 1.0 );\n\n\t\t}\n\t";
}
function hs(t) {
  let e = new WeakMap(),
    n = null;
  function i(t) {
    const n = t.target;
    n.removeEventListener("dispose", i);
    const r = e.get(n);
    void 0 !== r && (e.delete(n), r.dispose());
  }
  return {
    get: function (r) {
      if (r && r.isTexture) {
        const s = r.mapping,
          a = 303 === s || 304 === s,
          o = s === z || s === G;
        if (a || o) {
          let s = e.get(r);
          const l = void 0 !== s ? s.texture.pmremVersion : 0;
          if (r.isRenderTargetTexture && r.pmremVersion !== l)
            return (
              null === n && (n = new rs(t)),
              (s = a ? n.fromEquirectangular(r, s) : n.fromCubemap(r, s)),
              (s.texture.pmremVersion = r.pmremVersion),
              e.set(r, s),
              s.texture
            );
          if (void 0 !== s) return s.texture;
          {
            const l = r.image;
            return (a && l && l.height > 0) ||
              (o &&
                l &&
                (function (t) {
                  let e = 0;
                  const n = 6;
                  for (let i = 0; i < n; i++) void 0 !== t[i] && e++;
                  return e === n;
                })(l))
              ? (null === n && (n = new rs(t)),
                (s = a ? n.fromEquirectangular(r) : n.fromCubemap(r)),
                (s.texture.pmremVersion = r.pmremVersion),
                e.set(r, s),
                r.addEventListener("dispose", i),
                s.texture)
              : null;
          }
        }
      }
      return r;
    },
    dispose: function () {
      (e = new WeakMap()), null !== n && (n.dispose(), (n = null));
    },
  };
}
function us(t) {
  const e = {};
  function n(n) {
    if (void 0 !== e[n]) return e[n];
    let i;
    switch (n) {
      case "WEBGL_depth_texture":
        i =
          t.getExtension("WEBGL_depth_texture") ||
          t.getExtension("MOZ_WEBGL_depth_texture") ||
          t.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        i =
          t.getExtension("EXT_texture_filter_anisotropic") ||
          t.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
          t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        i =
          t.getExtension("WEBGL_compressed_texture_s3tc") ||
          t.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
          t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        i =
          t.getExtension("WEBGL_compressed_texture_pvrtc") ||
          t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        i = t.getExtension(n);
    }
    return (e[n] = i), i;
  }
  return {
    has: function (t) {
      return null !== n(t);
    },
    init: function () {
      n("EXT_color_buffer_float"),
        n("WEBGL_clip_cull_distance"),
        n("OES_texture_float_linear"),
        n("EXT_color_buffer_half_float"),
        n("WEBGL_multisampled_render_to_texture"),
        n("WEBGL_render_shared_exponent");
    },
    get: function (t) {
      const e = n(t);
      return (
        null === e &&
          be("THREE.WebGLRenderer: " + t + " extension not supported."),
        e
      );
    },
  };
}
function ds(t, e, n, i) {
  const r = {},
    s = new WeakMap();
  function a(t) {
    const o = t.target;
    null !== o.index && e.remove(o.index);
    for (const n in o.attributes) e.remove(o.attributes[n]);
    o.removeEventListener("dispose", a), delete r[o.id];
    const l = s.get(o);
    l && (e.remove(l), s.delete(o)),
      i.releaseStatesOfGeometry(o),
      !0 === o.isInstancedBufferGeometry && delete o._maxInstanceCount,
      n.memory.geometries--;
  }
  function o(t) {
    const n = [],
      i = t.index,
      r = t.attributes.position;
    let a = 0;
    if (null !== i) {
      const t = i.array;
      a = i.version;
      for (let e = 0, i = t.length; e < i; e += 3) {
        const i = t[e + 0],
          r = t[e + 1],
          s = t[e + 2];
        n.push(i, r, r, s, s, i);
      }
    } else {
      if (void 0 === r) return;
      {
        const t = r.array;
        a = r.version;
        for (let e = 0, i = t.length / 3 - 1; e < i; e += 3) {
          const t = e + 0,
            i = e + 1,
            r = e + 2;
          n.push(t, i, i, r, r, t);
        }
      }
    }
    const o = new (Me(n) ? yi : Ti)(n, 1);
    o.version = a;
    const l = s.get(t);
    l && e.remove(l), s.set(t, o);
  }
  return {
    get: function (t, e) {
      return (
        !0 === r[e.id] ||
          (e.addEventListener("dispose", a),
          (r[e.id] = !0),
          n.memory.geometries++),
        e
      );
    },
    update: function (n) {
      const i = n.attributes;
      for (const r in i) e.update(i[r], t.ARRAY_BUFFER);
    },
    getWireframeAttribute: function (t) {
      const e = s.get(t);
      if (e) {
        const n = t.index;
        null !== n && e.version < n.version && o(t);
      } else o(t);
      return s.get(t);
    },
  };
}
function ps(t, e, n) {
  let i, r, s;
  function a(e, a, o) {
    0 !== o && (t.drawElementsInstanced(i, a, r, e * s, o), n.update(a, i, o));
  }
  (this.setMode = function (t) {
    i = t;
  }),
    (this.setIndex = function (t) {
      (r = t.type), (s = t.bytesPerElement);
    }),
    (this.render = function (e, a) {
      t.drawElements(i, a, r, e * s), n.update(a, i, 1);
    }),
    (this.renderInstances = a),
    (this.renderMultiDraw = function (t, s, a) {
      if (0 === a) return;
      e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i, s, 0, r, t, 0, a);
      let o = 0;
      for (let e = 0; e < a; e++) o += s[e];
      n.update(o, i, 1);
    }),
    (this.renderMultiDrawInstances = function (t, o, l, c) {
      if (0 === l) return;
      const h = e.get("WEBGL_multi_draw");
      if (null === h)
        for (let e = 0; e < t.length; e++) a(t[e] / s, o[e], c[e]);
      else {
        h.multiDrawElementsInstancedWEBGL(i, o, 0, r, t, 0, c, 0, l);
        let e = 0;
        for (let t = 0; t < l; t++) e += o[t] * c[t];
        n.update(e, i, 1);
      }
    });
}
function fs(t) {
  const e = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0,
  };
  return {
    memory: {
      geometries: 0,
      textures: 0,
    },
    render: e,
    programs: null,
    autoReset: !0,
    reset: function () {
      (e.calls = 0), (e.triangles = 0), (e.points = 0), (e.lines = 0);
    },
    update: function (n, i, r) {
      switch ((e.calls++, i)) {
        case t.TRIANGLES:
          e.triangles += r * (n / 3);
          break;
        case t.LINES:
          e.lines += r * (n / 2);
          break;
        case t.LINE_STRIP:
          e.lines += r * (n - 1);
          break;
        case t.LINE_LOOP:
          e.lines += r * n;
          break;
        case t.POINTS:
          e.points += r * n;
          break;
        default:
          console.error("THREE.WebGLInfo: Unknown draw mode:", i);
      }
    },
  };
}
function ms(t, e, n) {
  const i = new WeakMap(),
    r = new ze();
  return {
    update: function (s, a, o) {
      const l = s.morphTargetInfluences,
        c =
          a.morphAttributes.position ||
          a.morphAttributes.normal ||
          a.morphAttributes.color,
        h = void 0 !== c ? c.length : 0;
      let u = i.get(a);
      if (void 0 === u || u.count !== h) {
        let t = function () {
          _.dispose(), i.delete(a), a.removeEventListener("dispose", t);
        };
        void 0 !== u && u.texture.dispose();
        const n = void 0 !== a.morphAttributes.position,
          s = void 0 !== a.morphAttributes.normal,
          o = void 0 !== a.morphAttributes.color,
          l = a.morphAttributes.position || [],
          c = a.morphAttributes.normal || [],
          d = a.morphAttributes.color || [];
        let p = 0;
        !0 === n && (p = 1), !0 === s && (p = 2), !0 === o && (p = 3);
        let f = a.attributes.position.count * p,
          m = 1;
        f > e.maxTextureSize &&
          ((m = Math.ceil(f / e.maxTextureSize)), (f = e.maxTextureSize));
        const g = new Float32Array(f * m * 4 * h),
          _ = new ke(g, f, m, h);
        (_.type = it), (_.needsUpdate = !0);
        const v = 4 * p;
        for (let e = 0; e < h; e++) {
          const t = l[e],
            i = c[e],
            a = d[e],
            h = f * m * 4 * e;
          for (let e = 0; e < t.count; e++) {
            const l = e * v;
            !0 === n &&
              (r.fromBufferAttribute(t, e),
              (g[h + l + 0] = r.x),
              (g[h + l + 1] = r.y),
              (g[h + l + 2] = r.z),
              (g[h + l + 3] = 0)),
              !0 === s &&
                (r.fromBufferAttribute(i, e),
                (g[h + l + 4] = r.x),
                (g[h + l + 5] = r.y),
                (g[h + l + 6] = r.z),
                (g[h + l + 7] = 0)),
              !0 === o &&
                (r.fromBufferAttribute(a, e),
                (g[h + l + 8] = r.x),
                (g[h + l + 9] = r.y),
                (g[h + l + 10] = r.z),
                (g[h + l + 11] = 4 === a.itemSize ? r.w : 1));
          }
        }
        (u = {
          count: h,
          texture: _,
          size: new ve(f, m),
        }),
          i.set(a, u),
          a.addEventListener("dispose", t);
      }
      if (!0 === s.isInstancedMesh && null !== s.morphTexture)
        o.getUniforms().setValue(t, "morphTexture", s.morphTexture, n);
      else {
        let e = 0;
        for (let t = 0; t < l.length; t++) e += l[t];
        const n = a.morphTargetsRelative ? 1 : 1 - e;
        o.getUniforms().setValue(t, "morphTargetBaseInfluence", n),
          o.getUniforms().setValue(t, "morphTargetInfluences", l);
      }
      o.getUniforms().setValue(t, "morphTargetsTexture", u.texture, n),
        o.getUniforms().setValue(t, "morphTargetsTextureSize", u.size);
    },
  };
}
function gs(t, e, n, i) {
  let r = new WeakMap();
  function s(t) {
    const e = t.target;
    e.removeEventListener("dispose", s),
      n.remove(e.instanceMatrix),
      null !== e.instanceColor && n.remove(e.instanceColor);
  }
  return {
    update: function (a) {
      const o = i.render.frame,
        l = a.geometry,
        c = e.get(a, l);
      if (
        (r.get(c) !== o && (e.update(c), r.set(c, o)),
        a.isInstancedMesh &&
          (!1 === a.hasEventListener("dispose", s) &&
            a.addEventListener("dispose", s),
          r.get(a) !== o &&
            (n.update(a.instanceMatrix, t.ARRAY_BUFFER),
            null !== a.instanceColor &&
              n.update(a.instanceColor, t.ARRAY_BUFFER),
            r.set(a, o))),
        a.isSkinnedMesh)
      ) {
        const t = a.skeleton;
        r.get(t) !== o && (t.update(), r.set(t, o));
      }
      return c;
    },
    dispose: function () {
      r = new WeakMap();
    },
  };
}
const _s = new Be(),
  vs = new xr(1, 1),
  xs = new ke(),
  Ss = new Ve(),
  Ms = new ar(),
  Es = [],
  Ts = [],
  ys = new Float32Array(16),
  bs = new Float32Array(9),
  ws = new Float32Array(4);
function As(t, e, n) {
  const i = t[0];
  if (i <= 0 || i > 0) return t;
  const r = e * n;
  let s = Es[r];
  if ((void 0 === s && ((s = new Float32Array(r)), (Es[r] = s)), 0 !== e)) {
    i.toArray(s, 0);
    for (let i = 1, r = 0; i !== e; ++i) (r += n), t[i].toArray(s, r);
  }
  return s;
}
function Cs(t, e) {
  if (t.length !== e.length) return !1;
  for (let n = 0, i = t.length; n < i; n++) if (t[n] !== e[n]) return !1;
  return !0;
}
function Rs(t, e) {
  for (let n = 0, i = e.length; n < i; n++) t[n] = e[n];
}
function Ps(t, e) {
  let n = Ts[e];
  void 0 === n && ((n = new Int32Array(e)), (Ts[e] = n));
  for (let i = 0; i !== e; ++i) n[i] = t.allocateTextureUnit();
  return n;
}
function Us(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1f(this.addr, e), (n[0] = e));
}
function Is(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y) ||
      (t.uniform2f(this.addr, e.x, e.y), (n[0] = e.x), (n[1] = e.y));
  else {
    if (Cs(n, e)) return;
    t.uniform2fv(this.addr, e), Rs(n, e);
  }
}
function Ls(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z) ||
      (t.uniform3f(this.addr, e.x, e.y, e.z),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z));
  else if (void 0 !== e.r)
    (n[0] === e.r && n[1] === e.g && n[2] === e.b) ||
      (t.uniform3f(this.addr, e.r, e.g, e.b),
      (n[0] = e.r),
      (n[1] = e.g),
      (n[2] = e.b));
  else {
    if (Cs(n, e)) return;
    t.uniform3fv(this.addr, e), Rs(n, e);
  }
}
function Ds(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w) ||
      (t.uniform4f(this.addr, e.x, e.y, e.z, e.w),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z),
      (n[3] = e.w));
  else {
    if (Cs(n, e)) return;
    t.uniform4fv(this.addr, e), Rs(n, e);
  }
}
function Ns(t, e) {
  const n = this.cache,
    i = e.elements;
  if (void 0 === i) {
    if (Cs(n, e)) return;
    t.uniformMatrix2fv(this.addr, !1, e), Rs(n, e);
  } else {
    if (Cs(n, i)) return;
    ws.set(i), t.uniformMatrix2fv(this.addr, !1, ws), Rs(n, i);
  }
}
function Os(t, e) {
  const n = this.cache,
    i = e.elements;
  if (void 0 === i) {
    if (Cs(n, e)) return;
    t.uniformMatrix3fv(this.addr, !1, e), Rs(n, e);
  } else {
    if (Cs(n, i)) return;
    bs.set(i), t.uniformMatrix3fv(this.addr, !1, bs), Rs(n, i);
  }
}
function Fs(t, e) {
  const n = this.cache,
    i = e.elements;
  if (void 0 === i) {
    if (Cs(n, e)) return;
    t.uniformMatrix4fv(this.addr, !1, e), Rs(n, e);
  } else {
    if (Cs(n, i)) return;
    ys.set(i), t.uniformMatrix4fv(this.addr, !1, ys), Rs(n, i);
  }
}
function Bs(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1i(this.addr, e), (n[0] = e));
}
function zs(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y) ||
      (t.uniform2i(this.addr, e.x, e.y), (n[0] = e.x), (n[1] = e.y));
  else {
    if (Cs(n, e)) return;
    t.uniform2iv(this.addr, e), Rs(n, e);
  }
}
function Gs(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z) ||
      (t.uniform3i(this.addr, e.x, e.y, e.z),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z));
  else {
    if (Cs(n, e)) return;
    t.uniform3iv(this.addr, e), Rs(n, e);
  }
}
function Hs(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w) ||
      (t.uniform4i(this.addr, e.x, e.y, e.z, e.w),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z),
      (n[3] = e.w));
  else {
    if (Cs(n, e)) return;
    t.uniform4iv(this.addr, e), Rs(n, e);
  }
}
function ks(t, e) {
  const n = this.cache;
  n[0] !== e && (t.uniform1ui(this.addr, e), (n[0] = e));
}
function Vs(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y) ||
      (t.uniform2ui(this.addr, e.x, e.y), (n[0] = e.x), (n[1] = e.y));
  else {
    if (Cs(n, e)) return;
    t.uniform2uiv(this.addr, e), Rs(n, e);
  }
}
function Ws(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z) ||
      (t.uniform3ui(this.addr, e.x, e.y, e.z),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z));
  else {
    if (Cs(n, e)) return;
    t.uniform3uiv(this.addr, e), Rs(n, e);
  }
}
function Xs(t, e) {
  const n = this.cache;
  if (void 0 !== e.x)
    (n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w) ||
      (t.uniform4ui(this.addr, e.x, e.y, e.z, e.w),
      (n[0] = e.x),
      (n[1] = e.y),
      (n[2] = e.z),
      (n[3] = e.w));
  else {
    if (Cs(n, e)) return;
    t.uniform4uiv(this.addr, e), Rs(n, e);
  }
}
function js(t, e, n) {
  const i = this.cache,
    r = n.allocateTextureUnit();
  let s;
  i[0] !== r && (t.uniform1i(this.addr, r), (i[0] = r)),
    this.type === t.SAMPLER_2D_SHADOW
      ? ((vs.compareFunction = 515), (s = vs))
      : (s = _s),
    n.setTexture2D(e || s, r);
}
function qs(t, e, n) {
  const i = this.cache,
    r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), (i[0] = r)),
    n.setTexture3D(e || Ss, r);
}
function Ys(t, e, n) {
  const i = this.cache,
    r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), (i[0] = r)),
    n.setTextureCube(e || Ms, r);
}
function Ks(t, e, n) {
  const i = this.cache,
    r = n.allocateTextureUnit();
  i[0] !== r && (t.uniform1i(this.addr, r), (i[0] = r)),
    n.setTexture2DArray(e || xs, r);
}
function Zs(t, e) {
  t.uniform1fv(this.addr, e);
}
function Js(t, e) {
  const n = As(e, this.size, 2);
  t.uniform2fv(this.addr, n);
}
function $s(t, e) {
  const n = As(e, this.size, 3);
  t.uniform3fv(this.addr, n);
}
function Qs(t, e) {
  const n = As(e, this.size, 4);
  t.uniform4fv(this.addr, n);
}
function ta(t, e) {
  const n = As(e, this.size, 4);
  t.uniformMatrix2fv(this.addr, !1, n);
}
function ea(t, e) {
  const n = As(e, this.size, 9);
  t.uniformMatrix3fv(this.addr, !1, n);
}
function na(t, e) {
  const n = As(e, this.size, 16);
  t.uniformMatrix4fv(this.addr, !1, n);
}
function ia(t, e) {
  t.uniform1iv(this.addr, e);
}
function ra(t, e) {
  t.uniform2iv(this.addr, e);
}
function sa(t, e) {
  t.uniform3iv(this.addr, e);
}
function aa(t, e) {
  t.uniform4iv(this.addr, e);
}
function oa(t, e) {
  t.uniform1uiv(this.addr, e);
}
function la(t, e) {
  t.uniform2uiv(this.addr, e);
}
function ca(t, e) {
  t.uniform3uiv(this.addr, e);
}
function ha(t, e) {
  t.uniform4uiv(this.addr, e);
}
function ua(t, e, n) {
  const i = this.cache,
    r = e.length,
    s = Ps(n, r);
  Cs(i, s) || (t.uniform1iv(this.addr, s), Rs(i, s));
  for (let a = 0; a !== r; ++a) n.setTexture2D(e[a] || _s, s[a]);
}
function da(t, e, n) {
  const i = this.cache,
    r = e.length,
    s = Ps(n, r);
  Cs(i, s) || (t.uniform1iv(this.addr, s), Rs(i, s));
  for (let a = 0; a !== r; ++a) n.setTexture3D(e[a] || Ss, s[a]);
}
function pa(t, e, n) {
  const i = this.cache,
    r = e.length,
    s = Ps(n, r);
  Cs(i, s) || (t.uniform1iv(this.addr, s), Rs(i, s));
  for (let a = 0; a !== r; ++a) n.setTextureCube(e[a] || Ms, s[a]);
}
function fa(t, e, n) {
  const i = this.cache,
    r = e.length,
    s = Ps(n, r);
  Cs(i, s) || (t.uniform1iv(this.addr, s), Rs(i, s));
  for (let a = 0; a !== r; ++a) n.setTexture2DArray(e[a] || xs, s[a]);
}
class ma {
  constructor(t, e, n) {
    (this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.setValue = (function (t) {
        switch (t) {
          case 5126:
            return Us;
          case 35664:
            return Is;
          case 35665:
            return Ls;
          case 35666:
            return Ds;
          case 35674:
            return Ns;
          case 35675:
            return Os;
          case 35676:
            return Fs;
          case 5124:
          case 35670:
            return Bs;
          case 35667:
          case 35671:
            return zs;
          case 35668:
          case 35672:
            return Gs;
          case 35669:
          case 35673:
            return Hs;
          case 5125:
            return ks;
          case 36294:
            return Vs;
          case 36295:
            return Ws;
          case 36296:
            return Xs;
          case 35678:
          case 36198:
          case 36298:
          case 36306:
          case 35682:
            return js;
          case 35679:
          case 36299:
          case 36307:
            return qs;
          case 35680:
          case 36300:
          case 36308:
          case 36293:
            return Ys;
          case 36289:
          case 36303:
          case 36311:
          case 36292:
            return Ks;
        }
      })(e.type));
  }
}
class ga {
  constructor(t, e, n) {
    (this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.size = e.size),
      (this.setValue = (function (t) {
        switch (t) {
          case 5126:
            return Zs;
          case 35664:
            return Js;
          case 35665:
            return $s;
          case 35666:
            return Qs;
          case 35674:
            return ta;
          case 35675:
            return ea;
          case 35676:
            return na;
          case 5124:
          case 35670:
            return ia;
          case 35667:
          case 35671:
            return ra;
          case 35668:
          case 35672:
            return sa;
          case 35669:
          case 35673:
            return aa;
          case 5125:
            return oa;
          case 36294:
            return la;
          case 36295:
            return ca;
          case 36296:
            return ha;
          case 35678:
          case 36198:
          case 36298:
          case 36306:
          case 35682:
            return ua;
          case 35679:
          case 36299:
          case 36307:
            return da;
          case 35680:
          case 36300:
          case 36308:
          case 36293:
            return pa;
          case 36289:
          case 36303:
          case 36311:
          case 36292:
            return fa;
        }
      })(e.type));
  }
}
class _a {
  constructor(t) {
    (this.id = t), (this.seq = []), (this.map = {});
  }
  setValue(t, e, n) {
    const i = this.seq;
    for (let r = 0, s = i.length; r !== s; ++r) {
      const s = i[r];
      s.setValue(t, e[s.id], n);
    }
  }
}
const va = /(\w+)(\])?(\[|\.)?/g;
function xa(t, e) {
  t.seq.push(e), (t.map[e.id] = e);
}
function Sa(t, e, n) {
  const i = t.name,
    r = i.length;
  for (va.lastIndex = 0; ; ) {
    const s = va.exec(i),
      a = va.lastIndex;
    let o = s[1];
    const l = "]" === s[2],
      c = s[3];
    if ((l && (o |= 0), void 0 === c || ("[" === c && a + 2 === r))) {
      xa(n, void 0 === c ? new ma(o, t, e) : new ga(o, t, e));
      break;
    }
    {
      let t = n.map[o];
      void 0 === t && ((t = new _a(o)), xa(n, t)), (n = t);
    }
  }
}
class Ma {
  constructor(t, e) {
    (this.seq = []), (this.map = {});
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; ++i) {
      const n = t.getActiveUniform(e, i);
      Sa(n, t.getUniformLocation(e, n.name), this);
    }
  }
  setValue(t, e, n, i) {
    const r = this.map[e];
    void 0 !== r && r.setValue(t, n, i);
  }
  setOptional(t, e, n) {
    const i = e[n];
    void 0 !== i && this.setValue(t, n, i);
  }
  static upload(t, e, n, i) {
    for (let r = 0, s = e.length; r !== s; ++r) {
      const s = e[r],
        a = n[s.id];
      !1 !== a.needsUpdate && s.setValue(t, a.value, i);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let i = 0, r = t.length; i !== r; ++i) {
      const r = t[i];
      r.id in e && n.push(r);
    }
    return n;
  }
}
function Ea(t, e, n) {
  const i = t.createShader(e);
  return t.shaderSource(i, n), t.compileShader(i), i;
}
let Ta = 0;
const ya = new xe();
function ba(t, e, n) {
  const i = t.getShaderParameter(e, t.COMPILE_STATUS),
    r = t.getShaderInfoLog(e).trim();
  if (i && "" === r) return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const i = parseInt(s[1]);
    return (
      n.toUpperCase() +
      "\n\n" +
      r +
      "\n\n" +
      (function (t, e) {
        const n = t.split("\n"),
          i = [],
          r = Math.max(e - 6, 0),
          s = Math.min(e + 6, n.length);
        for (let a = r; a < s; a++) {
          const t = a + 1;
          i.push(`${t === e ? ">" : " "} ${t}: ${n[a]}`);
        }
        return i.join("\n");
      })(t.getShaderSource(e), i)
    );
  }
  return r;
}
function wa(t, e) {
  const n = (function (t) {
    Re._getMatrix(ya, Re.workingColorSpace, t);
    const e = `mat3( ${ya.elements.map((t) => t.toFixed(4))} )`;
    switch (Re.getTransfer(t)) {
      case Kt:
        return [e, "LinearTransferOETF"];
      case Zt:
        return [e, "sRGBTransferOETF"];
      default:
        return (
          console.warn("THREE.WebGLProgram: Unsupported color space: ", t),
          [e, "LinearTransferOETF"]
        );
    }
  })(e);
  return [
    `vec4 ${t}( vec4 value ) {`,
    `\treturn ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
    "}",
  ].join("\n");
}
function Aa(t, e) {
  let n;
  switch (e) {
    case 1:
      n = "Linear";
      break;
    case 2:
      n = "Reinhard";
      break;
    case 3:
      n = "Cineon";
      break;
    case 4:
      n = "ACESFilmic";
      break;
    case 6:
      n = "AgX";
      break;
    case 7:
      n = "Neutral";
      break;
    case 5:
      n = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e),
        (n = "Linear");
  }
  return (
    "vec3 " + t + "( vec3 color ) { return " + n + "ToneMapping( color ); }"
  );
}
const Ca = new Xe();
function Ra() {
  Re.getLuminanceCoefficients(Ca);
  return [
    "float luminance( const in vec3 rgb ) {",
    `\tconst vec3 weights = vec3( ${Ca.x.toFixed(4)}, ${Ca.y.toFixed(
      4
    )}, ${Ca.z.toFixed(4)} );`,
    "\treturn dot( weights, rgb );",
    "}",
  ].join("\n");
}
function Pa(t) {
  return "" !== t;
}
function Ua(t, e) {
  const n =
    e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return t
    .replace(/NUM_DIR_LIGHTS/g, e.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights)
    .replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps)
    .replace(/NUM_SPOT_LIGHT_COORDS/g, n)
    .replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, e.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function Ia(t, e) {
  return t
    .replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes)
    .replace(
      /UNION_CLIPPING_PLANES/g,
      e.numClippingPlanes - e.numClipIntersection
    );
}
const La = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Da(t) {
  return t.replace(La, Oa);
}
const Na = new Map();
function Oa(t, e) {
  let n = Dr[e];
  if (void 0 === n) {
    const t = Na.get(e);
    if (void 0 === t) throw new Error("Can not resolve #include <" + e + ">");
    (n = Dr[t]),
      console.warn(
        'THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
        e,
        t
      );
  }
  return Da(n);
}
const Fa =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Ba(t) {
  return t.replace(Fa, za);
}
function za(t, e, n, i) {
  let r = "";
  for (let s = parseInt(e); s < parseInt(n); s++)
    r += i
      .replace(/\[\s*i\s*\]/g, "[ " + s + " ]")
      .replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function Ga(t) {
  let e = `precision ${t.precision} float;\n\tprecision ${t.precision} int;\n\tprecision ${t.precision} sampler2D;\n\tprecision ${t.precision} samplerCube;\n\tprecision ${t.precision} sampler3D;\n\tprecision ${t.precision} sampler2DArray;\n\tprecision ${t.precision} sampler2DShadow;\n\tprecision ${t.precision} samplerCubeShadow;\n\tprecision ${t.precision} sampler2DArrayShadow;\n\tprecision ${t.precision} isampler2D;\n\tprecision ${t.precision} isampler3D;\n\tprecision ${t.precision} isamplerCube;\n\tprecision ${t.precision} isampler2DArray;\n\tprecision ${t.precision} usampler2D;\n\tprecision ${t.precision} usampler3D;\n\tprecision ${t.precision} usamplerCube;\n\tprecision ${t.precision} usampler2DArray;\n\t`;
  return (
    "highp" === t.precision
      ? (e += "\n#define HIGH_PRECISION")
      : "mediump" === t.precision
      ? (e += "\n#define MEDIUM_PRECISION")
      : "lowp" === t.precision && (e += "\n#define LOW_PRECISION"),
    e
  );
}
function Ha(t, e, n, i) {
  const r = t.getContext(),
    s = n.defines;
  let a = n.vertexShader,
    o = n.fragmentShader;
  const l = (function (t) {
      let e = "SHADOWMAP_TYPE_BASIC";
      return (
        1 === t.shadowMapType
          ? (e = "SHADOWMAP_TYPE_PCF")
          : 2 === t.shadowMapType
          ? (e = "SHADOWMAP_TYPE_PCF_SOFT")
          : 3 === t.shadowMapType && (e = "SHADOWMAP_TYPE_VSM"),
        e
      );
    })(n),
    c = (function (t) {
      let e = "ENVMAP_TYPE_CUBE";
      if (t.envMap)
        switch (t.envMapMode) {
          case z:
          case G:
            e = "ENVMAP_TYPE_CUBE";
            break;
          case H:
            e = "ENVMAP_TYPE_CUBE_UV";
        }
      return e;
    })(n),
    h = (function (t) {
      let e = "ENVMAP_MODE_REFLECTION";
      t.envMap && t.envMapMode === G && (e = "ENVMAP_MODE_REFRACTION");
      return e;
    })(n),
    u = (function (t) {
      let e = "ENVMAP_BLENDING_NONE";
      if (t.envMap)
        switch (t.combine) {
          case 0:
            e = "ENVMAP_BLENDING_MULTIPLY";
            break;
          case 1:
            e = "ENVMAP_BLENDING_MIX";
            break;
          case 2:
            e = "ENVMAP_BLENDING_ADD";
        }
      return e;
    })(n),
    d = (function (t) {
      const e = t.envMapCubeUVHeight;
      if (null === e) return null;
      const n = Math.log2(e) - 2,
        i = 1 / e;
      return {
        texelWidth: 1 / (3 * Math.max(Math.pow(2, n), 112)),
        texelHeight: i,
        maxMip: n,
      };
    })(n),
    p = (function (t) {
      return [
        t.extensionClipCullDistance
          ? "#extension GL_ANGLE_clip_cull_distance : require"
          : "",
        t.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
      ]
        .filter(Pa)
        .join("\n");
    })(n),
    f = (function (t) {
      const e = [];
      for (const n in t) {
        const i = t[n];
        !1 !== i && e.push("#define " + n + " " + i);
      }
      return e.join("\n");
    })(s),
    m = r.createProgram();
  let g,
    _,
    v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
  n.isRawShaderMaterial
    ? ((g = [
        "#define SHADER_TYPE " + n.shaderType,
        "#define SHADER_NAME " + n.shaderName,
        f,
      ]
        .filter(Pa)
        .join("\n")),
      g.length > 0 && (g += "\n"),
      (_ = [
        "#define SHADER_TYPE " + n.shaderType,
        "#define SHADER_NAME " + n.shaderName,
        f,
      ]
        .filter(Pa)
        .join("\n")),
      _.length > 0 && (_ += "\n"))
    : ((g = [
        Ga(n),
        "#define SHADER_TYPE " + n.shaderType,
        "#define SHADER_NAME " + n.shaderName,
        f,
        n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
        n.batching ? "#define USE_BATCHING" : "",
        n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
        n.instancing ? "#define USE_INSTANCING" : "",
        n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
        n.useFog && n.fog ? "#define USE_FOG" : "",
        n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
        n.map ? "#define USE_MAP" : "",
        n.envMap ? "#define USE_ENVMAP" : "",
        n.envMap ? "#define " + h : "",
        n.lightMap ? "#define USE_LIGHTMAP" : "",
        n.aoMap ? "#define USE_AOMAP" : "",
        n.bumpMap ? "#define USE_BUMPMAP" : "",
        n.normalMap ? "#define USE_NORMALMAP" : "",
        n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
        n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        n.anisotropy ? "#define USE_ANISOTROPY" : "",
        n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        n.specularMap ? "#define USE_SPECULARMAP" : "",
        n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        n.metalnessMap ? "#define USE_METALNESSMAP" : "",
        n.alphaMap ? "#define USE_ALPHAMAP" : "",
        n.alphaHash ? "#define USE_ALPHAHASH" : "",
        n.transmission ? "#define USE_TRANSMISSION" : "",
        n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        n.mapUv ? "#define MAP_UV " + n.mapUv : "",
        n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
        n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
        n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
        n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
        n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
        n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
        n.displacementMapUv
          ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv
          : "",
        n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
        n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
        n.anisotropyMapUv
          ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv
          : "",
        n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
        n.clearcoatNormalMapUv
          ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv
          : "",
        n.clearcoatRoughnessMapUv
          ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv
          : "",
        n.iridescenceMapUv
          ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv
          : "",
        n.iridescenceThicknessMapUv
          ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv
          : "",
        n.sheenColorMapUv
          ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv
          : "",
        n.sheenRoughnessMapUv
          ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv
          : "",
        n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
        n.specularColorMapUv
          ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv
          : "",
        n.specularIntensityMapUv
          ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv
          : "",
        n.transmissionMapUv
          ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv
          : "",
        n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
        n.vertexTangents && !1 === n.flatShading ? "#define USE_TANGENT" : "",
        n.vertexColors ? "#define USE_COLOR" : "",
        n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        n.vertexUv1s ? "#define USE_UV1" : "",
        n.vertexUv2s ? "#define USE_UV2" : "",
        n.vertexUv3s ? "#define USE_UV3" : "",
        n.pointsUvs ? "#define USE_POINTS_UV" : "",
        n.flatShading ? "#define FLAT_SHADED" : "",
        n.skinning ? "#define USE_SKINNING" : "",
        n.morphTargets ? "#define USE_MORPHTARGETS" : "",
        n.morphNormals && !1 === n.flatShading
          ? "#define USE_MORPHNORMALS"
          : "",
        n.morphColors ? "#define USE_MORPHCOLORS" : "",
        n.morphTargetsCount > 0
          ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride
          : "",
        n.morphTargetsCount > 0
          ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount
          : "",
        n.doubleSided ? "#define DOUBLE_SIDED" : "",
        n.flipSided ? "#define FLIP_SIDED" : "",
        n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        n.shadowMapEnabled ? "#define " + l : "",
        n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        n.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "\tattribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "\tattribute vec3 instanceColor;",
        "#endif",
        "#ifdef USE_INSTANCING_MORPH",
        "\tuniform sampler2D morphTexture;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_UV1",
        "\tattribute vec2 uv1;",
        "#endif",
        "#ifdef USE_UV2",
        "\tattribute vec2 uv2;",
        "#endif",
        "#ifdef USE_UV3",
        "\tattribute vec2 uv3;",
        "#endif",
        "#ifdef USE_TANGENT",
        "\tattribute vec4 tangent;",
        "#endif",
        "#if defined( USE_COLOR_ALPHA )",
        "\tattribute vec4 color;",
        "#elif defined( USE_COLOR )",
        "\tattribute vec3 color;",
        "#endif",
        "#ifdef USE_SKINNING",
        "\tattribute vec4 skinIndex;",
        "\tattribute vec4 skinWeight;",
        "#endif",
        "\n",
      ]
        .filter(Pa)
        .join("\n")),
      (_ = [
        Ga(n),
        "#define SHADER_TYPE " + n.shaderType,
        "#define SHADER_NAME " + n.shaderName,
        f,
        n.useFog && n.fog ? "#define USE_FOG" : "",
        n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
        n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
        n.map ? "#define USE_MAP" : "",
        n.matcap ? "#define USE_MATCAP" : "",
        n.envMap ? "#define USE_ENVMAP" : "",
        n.envMap ? "#define " + c : "",
        n.envMap ? "#define " + h : "",
        n.envMap ? "#define " + u : "",
        d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "",
        d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "",
        d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "",
        n.lightMap ? "#define USE_LIGHTMAP" : "",
        n.aoMap ? "#define USE_AOMAP" : "",
        n.bumpMap ? "#define USE_BUMPMAP" : "",
        n.normalMap ? "#define USE_NORMALMAP" : "",
        n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        n.anisotropy ? "#define USE_ANISOTROPY" : "",
        n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        n.clearcoat ? "#define USE_CLEARCOAT" : "",
        n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        n.dispersion ? "#define USE_DISPERSION" : "",
        n.iridescence ? "#define USE_IRIDESCENCE" : "",
        n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        n.specularMap ? "#define USE_SPECULARMAP" : "",
        n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        n.metalnessMap ? "#define USE_METALNESSMAP" : "",
        n.alphaMap ? "#define USE_ALPHAMAP" : "",
        n.alphaTest ? "#define USE_ALPHATEST" : "",
        n.alphaHash ? "#define USE_ALPHAHASH" : "",
        n.sheen ? "#define USE_SHEEN" : "",
        n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        n.transmission ? "#define USE_TRANSMISSION" : "",
        n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        n.vertexTangents && !1 === n.flatShading ? "#define USE_TANGENT" : "",
        n.vertexColors || n.instancingColor || n.batchingColor
          ? "#define USE_COLOR"
          : "",
        n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        n.vertexUv1s ? "#define USE_UV1" : "",
        n.vertexUv2s ? "#define USE_UV2" : "",
        n.vertexUv3s ? "#define USE_UV3" : "",
        n.pointsUvs ? "#define USE_POINTS_UV" : "",
        n.gradientMap ? "#define USE_GRADIENTMAP" : "",
        n.flatShading ? "#define FLAT_SHADED" : "",
        n.doubleSided ? "#define DOUBLE_SIDED" : "",
        n.flipSided ? "#define FLIP_SIDED" : "",
        n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        n.shadowMapEnabled ? "#define " + l : "",
        n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
        n.decodeVideoTextureEmissive
          ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE"
          : "",
        n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        n.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        0 !== n.toneMapping ? "#define TONE_MAPPING" : "",
        0 !== n.toneMapping ? Dr.tonemapping_pars_fragment : "",
        0 !== n.toneMapping ? Aa("toneMapping", n.toneMapping) : "",
        n.dithering ? "#define DITHERING" : "",
        n.opaque ? "#define OPAQUE" : "",
        Dr.colorspace_pars_fragment,
        wa("linearToOutputTexel", n.outputColorSpace),
        Ra(),
        n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
        "\n",
      ]
        .filter(Pa)
        .join("\n"))),
    (a = Da(a)),
    (a = Ua(a, n)),
    (a = Ia(a, n)),
    (o = Da(o)),
    (o = Ua(o, n)),
    (o = Ia(o, n)),
    (a = Ba(a)),
    (o = Ba(o)),
    !0 !== n.isRawShaderMaterial &&
      ((v = "#version 300 es\n"),
      (g =
        [
          p,
          "#define attribute in",
          "#define varying out",
          "#define texture2D texture",
        ].join("\n") +
        "\n" +
        g),
      (_ =
        [
          "#define varying in",
          n.glslVersion === ae
            ? ""
            : "layout(location = 0) out highp vec4 pc_fragColor;",
          n.glslVersion === ae ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad",
        ].join("\n") +
        "\n" +
        _));
  const x = v + g + a,
    S = v + _ + o,
    M = Ea(r, r.VERTEX_SHADER, x),
    E = Ea(r, r.FRAGMENT_SHADER, S);
  function T(e) {
    if (t.debug.checkShaderErrors) {
      const n = r.getProgramInfoLog(m).trim(),
        i = r.getShaderInfoLog(M).trim(),
        s = r.getShaderInfoLog(E).trim();
      let a = !0,
        o = !0;
      if (!1 === r.getProgramParameter(m, r.LINK_STATUS))
        if (((a = !1), "function" == typeof t.debug.onShaderError))
          t.debug.onShaderError(r, m, M, E);
        else {
          const t = ba(r, M, "vertex"),
            i = ba(r, E, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " +
              r.getError() +
              " - VALIDATE_STATUS " +
              r.getProgramParameter(m, r.VALIDATE_STATUS) +
              "\n\nMaterial Name: " +
              e.name +
              "\nMaterial Type: " +
              e.type +
              "\n\nProgram Info Log: " +
              n +
              "\n" +
              t +
              "\n" +
              i
          );
        }
      else
        "" !== n
          ? console.warn("THREE.WebGLProgram: Program Info Log:", n)
          : ("" !== i && "" !== s) || (o = !1);
      o &&
        (e.diagnostics = {
          runnable: a,
          programLog: n,
          vertexShader: {
            log: i,
            prefix: g,
          },
          fragmentShader: {
            log: s,
            prefix: _,
          },
        });
    }
    r.deleteShader(M),
      r.deleteShader(E),
      (y = new Ma(r, m)),
      (b = (function (t, e) {
        const n = {},
          i = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES);
        for (let r = 0; r < i; r++) {
          const i = t.getActiveAttrib(e, r),
            s = i.name;
          let a = 1;
          i.type === t.FLOAT_MAT2 && (a = 2),
            i.type === t.FLOAT_MAT3 && (a = 3),
            i.type === t.FLOAT_MAT4 && (a = 4),
            (n[s] = {
              type: i.type,
              location: t.getAttribLocation(e, s),
              locationSize: a,
            });
        }
        return n;
      })(r, m));
  }
  let y, b;
  r.attachShader(m, M),
    r.attachShader(m, E),
    void 0 !== n.index0AttributeName
      ? r.bindAttribLocation(m, 0, n.index0AttributeName)
      : !0 === n.morphTargets && r.bindAttribLocation(m, 0, "position"),
    r.linkProgram(m),
    (this.getUniforms = function () {
      return void 0 === y && T(this), y;
    }),
    (this.getAttributes = function () {
      return void 0 === b && T(this), b;
    });
  let w = !1 === n.rendererExtensionParallelShaderCompile;
  return (
    (this.isReady = function () {
      return !1 === w && (w = r.getProgramParameter(m, 37297)), w;
    }),
    (this.destroy = function () {
      i.releaseStatesOfProgram(this),
        r.deleteProgram(m),
        (this.program = void 0);
    }),
    (this.type = n.shaderType),
    (this.name = n.shaderName),
    (this.id = Ta++),
    (this.cacheKey = e),
    (this.usedTimes = 1),
    (this.program = m),
    (this.vertexShader = M),
    (this.fragmentShader = E),
    this
  );
}
let ka = 0;
class Va {
  constructor() {
    (this.shaderCache = new Map()), (this.materialCache = new Map());
  }
  update(t) {
    const e = t.vertexShader,
      n = t.fragmentShader,
      i = this._getShaderStage(e),
      r = this._getShaderStage(n),
      s = this._getShaderCacheForMaterial(t);
    return (
      !1 === s.has(i) && (s.add(i), i.usedTimes++),
      !1 === s.has(r) && (s.add(r), r.usedTimes++),
      this
    );
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, 0 === n.usedTimes && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return void 0 === n && ((n = new Set()), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return void 0 === n && ((n = new Wa(t)), e.set(t, n)), n;
  }
}
class Wa {
  constructor(t) {
    (this.id = ka++), (this.code = t), (this.usedTimes = 0);
  }
}
function Xa(t, e, n, i, r, s, a) {
  const o = new Ln(),
    l = new Va(),
    c = new Set(),
    h = [],
    u = r.logarithmicDepthBuffer,
    d = r.vertexTextures;
  let p = r.precision;
  const f = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite",
  };
  function m(t) {
    return c.add(t), 0 === t ? "uv" : `uv${t}`;
  }
  return {
    getParameters: function (s, o, h, g, _) {
      const v = g.fog,
        x = _.geometry,
        S = s.isMeshStandardMaterial ? g.environment : null,
        M = (s.isMeshStandardMaterial ? n : e).get(s.envMap || S),
        E = M && M.mapping === H ? M.image.height : null,
        T = f[s.type];
      null !== s.precision &&
        ((p = r.getMaxPrecision(s.precision)),
        p !== s.precision &&
          console.warn(
            "THREE.WebGLProgram.getParameters:",
            s.precision,
            "not supported, using",
            p,
            "instead."
          ));
      const y =
          x.morphAttributes.position ||
          x.morphAttributes.normal ||
          x.morphAttributes.color,
        b = void 0 !== y ? y.length : 0;
      let w,
        A,
        C,
        R,
        P = 0;
      if (
        (void 0 !== x.morphAttributes.position && (P = 1),
        void 0 !== x.morphAttributes.normal && (P = 2),
        void 0 !== x.morphAttributes.color && (P = 3),
        T)
      ) {
        const t = Or[T];
        (w = t.vertexShader), (A = t.fragmentShader);
      } else
        (w = s.vertexShader),
          (A = s.fragmentShader),
          l.update(s),
          (C = l.getVertexShaderID(s)),
          (R = l.getFragmentShaderID(s));
      const U = t.getRenderTarget(),
        I = t.state.buffers.depth.getReversed(),
        L = !0 === _.isInstancedMesh,
        D = !0 === _.isBatchedMesh,
        N = !!s.map,
        O = !!s.matcap,
        F = !!M,
        B = !!s.aoMap,
        z = !!s.lightMap,
        G = !!s.bumpMap,
        k = !!s.normalMap,
        V = !!s.displacementMap,
        W = !!s.emissiveMap,
        X = !!s.metalnessMap,
        j = !!s.roughnessMap,
        q = s.anisotropy > 0,
        Y = s.clearcoat > 0,
        K = s.dispersion > 0,
        Z = s.iridescence > 0,
        J = s.sheen > 0,
        $ = s.transmission > 0,
        Q = q && !!s.anisotropyMap,
        tt = Y && !!s.clearcoatMap,
        et = Y && !!s.clearcoatNormalMap,
        nt = Y && !!s.clearcoatRoughnessMap,
        it = Z && !!s.iridescenceMap,
        rt = Z && !!s.iridescenceThicknessMap,
        st = J && !!s.sheenColorMap,
        at = J && !!s.sheenRoughnessMap,
        ot = !!s.specularMap,
        lt = !!s.specularColorMap,
        ct = !!s.specularIntensityMap,
        ht = $ && !!s.transmissionMap,
        ut = $ && !!s.thicknessMap,
        dt = !!s.gradientMap,
        pt = !!s.alphaMap,
        ft = s.alphaTest > 0,
        mt = !!s.alphaHash,
        gt = !!s.extensions;
      let _t = 0;
      s.toneMapped &&
        ((null !== U && !0 !== U.isXRRenderTarget) || (_t = t.toneMapping));
      const vt = {
        shaderID: T,
        shaderType: s.type,
        shaderName: s.name,
        vertexShader: w,
        fragmentShader: A,
        defines: s.defines,
        customVertexShaderID: C,
        customFragmentShaderID: R,
        isRawShaderMaterial: !0 === s.isRawShaderMaterial,
        glslVersion: s.glslVersion,
        precision: p,
        batching: D,
        batchingColor: D && null !== _._colorsTexture,
        instancing: L,
        instancingColor: L && null !== _.instanceColor,
        instancingMorph: L && null !== _.morphTexture,
        supportsVertexTextures: d,
        outputColorSpace:
          null === U
            ? t.outputColorSpace
            : !0 === U.isXRRenderTarget
            ? U.texture.colorSpace
            : Yt,
        alphaToCoverage: !!s.alphaToCoverage,
        map: N,
        matcap: O,
        envMap: F,
        envMapMode: F && M.mapping,
        envMapCubeUVHeight: E,
        aoMap: B,
        lightMap: z,
        bumpMap: G,
        normalMap: k,
        displacementMap: d && V,
        emissiveMap: W,
        normalMapObjectSpace: k && 1 === s.normalMapType,
        normalMapTangentSpace: k && 0 === s.normalMapType,
        metalnessMap: X,
        roughnessMap: j,
        anisotropy: q,
        anisotropyMap: Q,
        clearcoat: Y,
        clearcoatMap: tt,
        clearcoatNormalMap: et,
        clearcoatRoughnessMap: nt,
        dispersion: K,
        iridescence: Z,
        iridescenceMap: it,
        iridescenceThicknessMap: rt,
        sheen: J,
        sheenColorMap: st,
        sheenRoughnessMap: at,
        specularMap: ot,
        specularColorMap: lt,
        specularIntensityMap: ct,
        transmission: $,
        transmissionMap: ht,
        thicknessMap: ut,
        gradientMap: dt,
        opaque:
          !1 === s.transparent && 1 === s.blending && !1 === s.alphaToCoverage,
        alphaMap: pt,
        alphaTest: ft,
        alphaHash: mt,
        combine: s.combine,
        mapUv: N && m(s.map.channel),
        aoMapUv: B && m(s.aoMap.channel),
        lightMapUv: z && m(s.lightMap.channel),
        bumpMapUv: G && m(s.bumpMap.channel),
        normalMapUv: k && m(s.normalMap.channel),
        displacementMapUv: V && m(s.displacementMap.channel),
        emissiveMapUv: W && m(s.emissiveMap.channel),
        metalnessMapUv: X && m(s.metalnessMap.channel),
        roughnessMapUv: j && m(s.roughnessMap.channel),
        anisotropyMapUv: Q && m(s.anisotropyMap.channel),
        clearcoatMapUv: tt && m(s.clearcoatMap.channel),
        clearcoatNormalMapUv: et && m(s.clearcoatNormalMap.channel),
        clearcoatRoughnessMapUv: nt && m(s.clearcoatRoughnessMap.channel),
        iridescenceMapUv: it && m(s.iridescenceMap.channel),
        iridescenceThicknessMapUv: rt && m(s.iridescenceThicknessMap.channel),
        sheenColorMapUv: st && m(s.sheenColorMap.channel),
        sheenRoughnessMapUv: at && m(s.sheenRoughnessMap.channel),
        specularMapUv: ot && m(s.specularMap.channel),
        specularColorMapUv: lt && m(s.specularColorMap.channel),
        specularIntensityMapUv: ct && m(s.specularIntensityMap.channel),
        transmissionMapUv: ht && m(s.transmissionMap.channel),
        thicknessMapUv: ut && m(s.thicknessMap.channel),
        alphaMapUv: pt && m(s.alphaMap.channel),
        vertexTangents: !!x.attributes.tangent && (k || q),
        vertexColors: s.vertexColors,
        vertexAlphas:
          !0 === s.vertexColors &&
          !!x.attributes.color &&
          4 === x.attributes.color.itemSize,
        pointsUvs: !0 === _.isPoints && !!x.attributes.uv && (N || pt),
        fog: !!v,
        useFog: !0 === s.fog,
        fogExp2: !!v && v.isFogExp2,
        flatShading: !0 === s.flatShading,
        sizeAttenuation: !0 === s.sizeAttenuation,
        logarithmicDepthBuffer: u,
        reverseDepthBuffer: I,
        skinning: !0 === _.isSkinnedMesh,
        morphTargets: void 0 !== x.morphAttributes.position,
        morphNormals: void 0 !== x.morphAttributes.normal,
        morphColors: void 0 !== x.morphAttributes.color,
        morphTargetsCount: b,
        morphTextureStride: P,
        numDirLights: o.directional.length,
        numPointLights: o.point.length,
        numSpotLights: o.spot.length,
        numSpotLightMaps: o.spotLightMap.length,
        numRectAreaLights: o.rectArea.length,
        numHemiLights: o.hemi.length,
        numDirLightShadows: o.directionalShadowMap.length,
        numPointLightShadows: o.pointShadowMap.length,
        numSpotLightShadows: o.spotShadowMap.length,
        numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
        numLightProbes: o.numLightProbes,
        numClippingPlanes: a.numPlanes,
        numClipIntersection: a.numIntersection,
        dithering: s.dithering,
        shadowMapEnabled: t.shadowMap.enabled && h.length > 0,
        shadowMapType: t.shadowMap.type,
        toneMapping: _t,
        decodeVideoTexture:
          N &&
          !0 === s.map.isVideoTexture &&
          Re.getTransfer(s.map.colorSpace) === Zt,
        decodeVideoTextureEmissive:
          W &&
          !0 === s.emissiveMap.isVideoTexture &&
          Re.getTransfer(s.emissiveMap.colorSpace) === Zt,
        premultipliedAlpha: s.premultipliedAlpha,
        doubleSided: 2 === s.side,
        flipSided: 1 === s.side,
        useDepthPacking: s.depthPacking >= 0,
        depthPacking: s.depthPacking || 0,
        index0AttributeName: s.index0AttributeName,
        extensionClipCullDistance:
          gt &&
          !0 === s.extensions.clipCullDistance &&
          i.has("WEBGL_clip_cull_distance"),
        extensionMultiDraw:
          ((gt && !0 === s.extensions.multiDraw) || D) &&
          i.has("WEBGL_multi_draw"),
        rendererExtensionParallelShaderCompile: i.has(
          "KHR_parallel_shader_compile"
        ),
        customProgramCacheKey: s.customProgramCacheKey(),
      };
      return (
        (vt.vertexUv1s = c.has(1)),
        (vt.vertexUv2s = c.has(2)),
        (vt.vertexUv3s = c.has(3)),
        c.clear(),
        vt
      );
    },
    getProgramCacheKey: function (e) {
      const n = [];
      if (
        (e.shaderID
          ? n.push(e.shaderID)
          : (n.push(e.customVertexShaderID), n.push(e.customFragmentShaderID)),
        void 0 !== e.defines)
      )
        for (const t in e.defines) n.push(t), n.push(e.defines[t]);
      return (
        !1 === e.isRawShaderMaterial &&
          (!(function (t, e) {
            t.push(e.precision),
              t.push(e.outputColorSpace),
              t.push(e.envMapMode),
              t.push(e.envMapCubeUVHeight),
              t.push(e.mapUv),
              t.push(e.alphaMapUv),
              t.push(e.lightMapUv),
              t.push(e.aoMapUv),
              t.push(e.bumpMapUv),
              t.push(e.normalMapUv),
              t.push(e.displacementMapUv),
              t.push(e.emissiveMapUv),
              t.push(e.metalnessMapUv),
              t.push(e.roughnessMapUv),
              t.push(e.anisotropyMapUv),
              t.push(e.clearcoatMapUv),
              t.push(e.clearcoatNormalMapUv),
              t.push(e.clearcoatRoughnessMapUv),
              t.push(e.iridescenceMapUv),
              t.push(e.iridescenceThicknessMapUv),
              t.push(e.sheenColorMapUv),
              t.push(e.sheenRoughnessMapUv),
              t.push(e.specularMapUv),
              t.push(e.specularColorMapUv),
              t.push(e.specularIntensityMapUv),
              t.push(e.transmissionMapUv),
              t.push(e.thicknessMapUv),
              t.push(e.combine),
              t.push(e.fogExp2),
              t.push(e.sizeAttenuation),
              t.push(e.morphTargetsCount),
              t.push(e.morphAttributeCount),
              t.push(e.numDirLights),
              t.push(e.numPointLights),
              t.push(e.numSpotLights),
              t.push(e.numSpotLightMaps),
              t.push(e.numHemiLights),
              t.push(e.numRectAreaLights),
              t.push(e.numDirLightShadows),
              t.push(e.numPointLightShadows),
              t.push(e.numSpotLightShadows),
              t.push(e.numSpotLightShadowsWithMaps),
              t.push(e.numLightProbes),
              t.push(e.shadowMapType),
              t.push(e.toneMapping),
              t.push(e.numClippingPlanes),
              t.push(e.numClipIntersection),
              t.push(e.depthPacking);
          })(n, e),
          (function (t, e) {
            o.disableAll(), e.supportsVertexTextures && o.enable(0);
            e.instancing && o.enable(1);
            e.instancingColor && o.enable(2);
            e.instancingMorph && o.enable(3);
            e.matcap && o.enable(4);
            e.envMap && o.enable(5);
            e.normalMapObjectSpace && o.enable(6);
            e.normalMapTangentSpace && o.enable(7);
            e.clearcoat && o.enable(8);
            e.iridescence && o.enable(9);
            e.alphaTest && o.enable(10);
            e.vertexColors && o.enable(11);
            e.vertexAlphas && o.enable(12);
            e.vertexUv1s && o.enable(13);
            e.vertexUv2s && o.enable(14);
            e.vertexUv3s && o.enable(15);
            e.vertexTangents && o.enable(16);
            e.anisotropy && o.enable(17);
            e.alphaHash && o.enable(18);
            e.batching && o.enable(19);
            e.dispersion && o.enable(20);
            e.batchingColor && o.enable(21);
            t.push(o.mask), o.disableAll(), e.fog && o.enable(0);
            e.useFog && o.enable(1);
            e.flatShading && o.enable(2);
            e.logarithmicDepthBuffer && o.enable(3);
            e.reverseDepthBuffer && o.enable(4);
            e.skinning && o.enable(5);
            e.morphTargets && o.enable(6);
            e.morphNormals && o.enable(7);
            e.morphColors && o.enable(8);
            e.premultipliedAlpha && o.enable(9);
            e.shadowMapEnabled && o.enable(10);
            e.doubleSided && o.enable(11);
            e.flipSided && o.enable(12);
            e.useDepthPacking && o.enable(13);
            e.dithering && o.enable(14);
            e.transmission && o.enable(15);
            e.sheen && o.enable(16);
            e.opaque && o.enable(17);
            e.pointsUvs && o.enable(18);
            e.decodeVideoTexture && o.enable(19);
            e.decodeVideoTextureEmissive && o.enable(20);
            e.alphaToCoverage && o.enable(21);
            t.push(o.mask);
          })(n, e),
          n.push(t.outputColorSpace)),
        n.push(e.customProgramCacheKey),
        n.join()
      );
    },
    getUniforms: function (t) {
      const e = f[t.type];
      let n;
      if (e) {
        const t = Or[e];
        n = Ji.clone(t.uniforms);
      } else n = t.uniforms;
      return n;
    },
    acquireProgram: function (e, n) {
      let i;
      for (let t = 0, r = h.length; t < r; t++) {
        const e = h[t];
        if (e.cacheKey === n) {
          (i = e), ++i.usedTimes;
          break;
        }
      }
      return void 0 === i && ((i = new Ha(t, n, e, s)), h.push(i)), i;
    },
    releaseProgram: function (t) {
      if (0 == --t.usedTimes) {
        const e = h.indexOf(t);
        (h[e] = h[h.length - 1]), h.pop(), t.destroy();
      }
    },
    releaseShaderCache: function (t) {
      l.remove(t);
    },
    programs: h,
    dispose: function () {
      l.dispose();
    },
  };
}
function ja() {
  let t = new WeakMap();
  return {
    has: function (e) {
      return t.has(e);
    },
    get: function (e) {
      let n = t.get(e);
      return void 0 === n && ((n = {}), t.set(e, n)), n;
    },
    remove: function (e) {
      t.delete(e);
    },
    update: function (e, n, i) {
      t.get(e)[n] = i;
    },
    dispose: function () {
      t = new WeakMap();
    },
  };
}
function qa(t, e) {
  return t.groupOrder !== e.groupOrder
    ? t.groupOrder - e.groupOrder
    : t.renderOrder !== e.renderOrder
    ? t.renderOrder - e.renderOrder
    : t.material.id !== e.material.id
    ? t.material.id - e.material.id
    : t.z !== e.z
    ? t.z - e.z
    : t.id - e.id;
}
function Ya(t, e) {
  return t.groupOrder !== e.groupOrder
    ? t.groupOrder - e.groupOrder
    : t.renderOrder !== e.renderOrder
    ? t.renderOrder - e.renderOrder
    : t.z !== e.z
    ? e.z - t.z
    : t.id - e.id;
}
function Ka() {
  const t = [];
  let e = 0;
  const n = [],
    i = [],
    r = [];
  function s(n, i, r, s, a, o) {
    let l = t[e];
    return (
      void 0 === l
        ? ((l = {
            id: n.id,
            object: n,
            geometry: i,
            material: r,
            groupOrder: s,
            renderOrder: n.renderOrder,
            z: a,
            group: o,
          }),
          (t[e] = l))
        : ((l.id = n.id),
          (l.object = n),
          (l.geometry = i),
          (l.material = r),
          (l.groupOrder = s),
          (l.renderOrder = n.renderOrder),
          (l.z = a),
          (l.group = o)),
      e++,
      l
    );
  }
  return {
    opaque: n,
    transmissive: i,
    transparent: r,
    init: function () {
      (e = 0), (n.length = 0), (i.length = 0), (r.length = 0);
    },
    push: function (t, e, a, o, l, c) {
      const h = s(t, e, a, o, l, c);
      a.transmission > 0
        ? i.push(h)
        : !0 === a.transparent
        ? r.push(h)
        : n.push(h);
    },
    unshift: function (t, e, a, o, l, c) {
      const h = s(t, e, a, o, l, c);
      a.transmission > 0
        ? i.unshift(h)
        : !0 === a.transparent
        ? r.unshift(h)
        : n.unshift(h);
    },
    finish: function () {
      for (let n = e, i = t.length; n < i; n++) {
        const e = t[n];
        if (null === e.id) break;
        (e.id = null),
          (e.object = null),
          (e.geometry = null),
          (e.material = null),
          (e.group = null);
      }
    },
    sort: function (t, e) {
      n.length > 1 && n.sort(t || qa),
        i.length > 1 && i.sort(e || Ya),
        r.length > 1 && r.sort(e || Ya);
    },
  };
}
function Za() {
  let t = new WeakMap();
  return {
    get: function (e, n) {
      const i = t.get(e);
      let r;
      return (
        void 0 === i
          ? ((r = new Ka()), t.set(e, [r]))
          : n >= i.length
          ? ((r = new Ka()), i.push(r))
          : (r = i[n]),
        r
      );
    },
    dispose: function () {
      t = new WeakMap();
    },
  };
}
function Ja() {
  const t = {};
  return {
    get: function (e) {
      if (void 0 !== t[e.id]) return t[e.id];
      let n;
      switch (e.type) {
        case "DirectionalLight":
          n = {
            direction: new Xe(),
            color: new fi(),
          };
          break;
        case "SpotLight":
          n = {
            position: new Xe(),
            direction: new Xe(),
            color: new fi(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0,
          };
          break;
        case "PointLight":
          n = {
            position: new Xe(),
            color: new fi(),
            distance: 0,
            decay: 0,
          };
          break;
        case "HemisphereLight":
          n = {
            direction: new Xe(),
            skyColor: new fi(),
            groundColor: new fi(),
          };
          break;
        case "RectAreaLight":
          n = {
            color: new fi(),
            position: new Xe(),
            halfWidth: new Xe(),
            halfHeight: new Xe(),
          };
      }
      return (t[e.id] = n), n;
    },
  };
}
let $a = 0;
function Qa(t, e) {
  return (
    (e.castShadow ? 2 : 0) -
    (t.castShadow ? 2 : 0) +
    (e.map ? 1 : 0) -
    (t.map ? 1 : 0)
  );
}
function to(t) {
  const e = new Ja(),
    n = (function () {
      const t = {};
      return {
        get: function (e) {
          if (void 0 !== t[e.id]) return t[e.id];
          let n;
          switch (e.type) {
            case "DirectionalLight":
            case "SpotLight":
              n = {
                shadowIntensity: 1,
                shadowBias: 0,
                shadowNormalBias: 0,
                shadowRadius: 1,
                shadowMapSize: new ve(),
              };
              break;
            case "PointLight":
              n = {
                shadowIntensity: 1,
                shadowBias: 0,
                shadowNormalBias: 0,
                shadowRadius: 1,
                shadowMapSize: new ve(),
                shadowCameraNear: 1,
                shadowCameraFar: 1e3,
              };
          }
          return (t[e.id] = n), n;
        },
      };
    })(),
    i = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1,
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0,
    };
  for (let o = 0; o < 9; o++) i.probe.push(new Xe());
  const r = new Xe(),
    s = new En(),
    a = new En();
  return {
    setup: function (r) {
      let s = 0,
        a = 0,
        o = 0;
      for (let t = 0; t < 9; t++) i.probe[t].set(0, 0, 0);
      let l = 0,
        c = 0,
        h = 0,
        u = 0,
        d = 0,
        p = 0,
        f = 0,
        m = 0,
        g = 0,
        _ = 0,
        v = 0;
      r.sort(Qa);
      for (let t = 0, S = r.length; t < S; t++) {
        const x = r[t],
          S = x.color,
          M = x.intensity,
          E = x.distance,
          T = x.shadow && x.shadow.map ? x.shadow.map.texture : null;
        if (x.isAmbientLight) (s += S.r * M), (a += S.g * M), (o += S.b * M);
        else if (x.isLightProbe) {
          for (let t = 0; t < 9; t++)
            i.probe[t].addScaledVector(x.sh.coefficients[t], M);
          v++;
        } else if (x.isDirectionalLight) {
          const t = e.get(x);
          if (
            (t.color.copy(x.color).multiplyScalar(x.intensity), x.castShadow)
          ) {
            const t = x.shadow,
              e = n.get(x);
            (e.shadowIntensity = t.intensity),
              (e.shadowBias = t.bias),
              (e.shadowNormalBias = t.normalBias),
              (e.shadowRadius = t.radius),
              (e.shadowMapSize = t.mapSize),
              (i.directionalShadow[l] = e),
              (i.directionalShadowMap[l] = T),
              (i.directionalShadowMatrix[l] = x.shadow.matrix),
              p++;
          }
          (i.directional[l] = t), l++;
        } else if (x.isSpotLight) {
          const t = e.get(x);
          t.position.setFromMatrixPosition(x.matrixWorld),
            t.color.copy(S).multiplyScalar(M),
            (t.distance = E),
            (t.coneCos = Math.cos(x.angle)),
            (t.penumbraCos = Math.cos(x.angle * (1 - x.penumbra))),
            (t.decay = x.decay),
            (i.spot[h] = t);
          const r = x.shadow;
          if (
            (x.map &&
              ((i.spotLightMap[g] = x.map),
              g++,
              r.updateMatrices(x),
              x.castShadow && _++),
            (i.spotLightMatrix[h] = r.matrix),
            x.castShadow)
          ) {
            const t = n.get(x);
            (t.shadowIntensity = r.intensity),
              (t.shadowBias = r.bias),
              (t.shadowNormalBias = r.normalBias),
              (t.shadowRadius = r.radius),
              (t.shadowMapSize = r.mapSize),
              (i.spotShadow[h] = t),
              (i.spotShadowMap[h] = T),
              m++;
          }
          h++;
        } else if (x.isRectAreaLight) {
          const t = e.get(x);
          t.color.copy(S).multiplyScalar(M),
            t.halfWidth.set(0.5 * x.width, 0, 0),
            t.halfHeight.set(0, 0.5 * x.height, 0),
            (i.rectArea[u] = t),
            u++;
        } else if (x.isPointLight) {
          const t = e.get(x);
          if (
            (t.color.copy(x.color).multiplyScalar(x.intensity),
            (t.distance = x.distance),
            (t.decay = x.decay),
            x.castShadow)
          ) {
            const t = x.shadow,
              e = n.get(x);
            (e.shadowIntensity = t.intensity),
              (e.shadowBias = t.bias),
              (e.shadowNormalBias = t.normalBias),
              (e.shadowRadius = t.radius),
              (e.shadowMapSize = t.mapSize),
              (e.shadowCameraNear = t.camera.near),
              (e.shadowCameraFar = t.camera.far),
              (i.pointShadow[c] = e),
              (i.pointShadowMap[c] = T),
              (i.pointShadowMatrix[c] = x.shadow.matrix),
              f++;
          }
          (i.point[c] = t), c++;
        } else if (x.isHemisphereLight) {
          const t = e.get(x);
          t.skyColor.copy(x.color).multiplyScalar(M),
            t.groundColor.copy(x.groundColor).multiplyScalar(M),
            (i.hemi[d] = t),
            d++;
        }
      }
      u > 0 &&
        (!0 === t.has("OES_texture_float_linear")
          ? ((i.rectAreaLTC1 = Nr.LTC_FLOAT_1),
            (i.rectAreaLTC2 = Nr.LTC_FLOAT_2))
          : ((i.rectAreaLTC1 = Nr.LTC_HALF_1),
            (i.rectAreaLTC2 = Nr.LTC_HALF_2))),
        (i.ambient[0] = s),
        (i.ambient[1] = a),
        (i.ambient[2] = o);
      const x = i.hash;
      (x.directionalLength === l &&
        x.pointLength === c &&
        x.spotLength === h &&
        x.rectAreaLength === u &&
        x.hemiLength === d &&
        x.numDirectionalShadows === p &&
        x.numPointShadows === f &&
        x.numSpotShadows === m &&
        x.numSpotMaps === g &&
        x.numLightProbes === v) ||
        ((i.directional.length = l),
        (i.spot.length = h),
        (i.rectArea.length = u),
        (i.point.length = c),
        (i.hemi.length = d),
        (i.directionalShadow.length = p),
        (i.directionalShadowMap.length = p),
        (i.pointShadow.length = f),
        (i.pointShadowMap.length = f),
        (i.spotShadow.length = m),
        (i.spotShadowMap.length = m),
        (i.directionalShadowMatrix.length = p),
        (i.pointShadowMatrix.length = f),
        (i.spotLightMatrix.length = m + g - _),
        (i.spotLightMap.length = g),
        (i.numSpotLightShadowsWithMaps = _),
        (i.numLightProbes = v),
        (x.directionalLength = l),
        (x.pointLength = c),
        (x.spotLength = h),
        (x.rectAreaLength = u),
        (x.hemiLength = d),
        (x.numDirectionalShadows = p),
        (x.numPointShadows = f),
        (x.numSpotShadows = m),
        (x.numSpotMaps = g),
        (x.numLightProbes = v),
        (i.version = $a++));
    },
    setupView: function (t, e) {
      let n = 0,
        o = 0,
        l = 0,
        c = 0,
        h = 0;
      const u = e.matrixWorldInverse;
      for (let d = 0, p = t.length; d < p; d++) {
        const e = t[d];
        if (e.isDirectionalLight) {
          const t = i.directional[n];
          t.direction.setFromMatrixPosition(e.matrixWorld),
            r.setFromMatrixPosition(e.target.matrixWorld),
            t.direction.sub(r),
            t.direction.transformDirection(u),
            n++;
        } else if (e.isSpotLight) {
          const t = i.spot[l];
          t.position.setFromMatrixPosition(e.matrixWorld),
            t.position.applyMatrix4(u),
            t.direction.setFromMatrixPosition(e.matrixWorld),
            r.setFromMatrixPosition(e.target.matrixWorld),
            t.direction.sub(r),
            t.direction.transformDirection(u),
            l++;
        } else if (e.isRectAreaLight) {
          const t = i.rectArea[c];
          t.position.setFromMatrixPosition(e.matrixWorld),
            t.position.applyMatrix4(u),
            a.identity(),
            s.copy(e.matrixWorld),
            s.premultiply(u),
            a.extractRotation(s),
            t.halfWidth.set(0.5 * e.width, 0, 0),
            t.halfHeight.set(0, 0.5 * e.height, 0),
            t.halfWidth.applyMatrix4(a),
            t.halfHeight.applyMatrix4(a),
            c++;
        } else if (e.isPointLight) {
          const t = i.point[o];
          t.position.setFromMatrixPosition(e.matrixWorld),
            t.position.applyMatrix4(u),
            o++;
        } else if (e.isHemisphereLight) {
          const t = i.hemi[h];
          t.direction.setFromMatrixPosition(e.matrixWorld),
            t.direction.transformDirection(u),
            h++;
        }
      }
    },
    state: i,
  };
}
function eo(t) {
  const e = new to(t),
    n = [],
    i = [];
  const r = {
    lightsArray: n,
    shadowsArray: i,
    camera: null,
    lights: e,
    transmissionRenderTarget: {},
  };
  return {
    init: function (t) {
      (r.camera = t), (n.length = 0), (i.length = 0);
    },
    state: r,
    setupLights: function () {
      e.setup(n);
    },
    setupLightsView: function (t) {
      e.setupView(n, t);
    },
    pushLight: function (t) {
      n.push(t);
    },
    pushShadow: function (t) {
      i.push(t);
    },
  };
}
function no(t) {
  let e = new WeakMap();
  return {
    get: function (n, i = 0) {
      const r = e.get(n);
      let s;
      return (
        void 0 === r
          ? ((s = new eo(t)), e.set(n, [s]))
          : i >= r.length
          ? ((s = new eo(t)), r.push(s))
          : (s = r[i]),
        s
      );
    },
    dispose: function () {
      e = new WeakMap();
    },
  };
}
function io(t, e, n) {
  let i = new vr();
  const r = new ve(),
    s = new ve(),
    a = new ze(),
    o = new Mr({
      depthPacking: 3201,
    }),
    l = new Er(),
    c = {},
    p = n.maxTextureSize,
    f = {
      [h]: 1,
      [u]: 0,
      [d]: 2,
    },
    m = new $i({
      defines: {
        VSM_SAMPLES: 8,
      },
      uniforms: {
        shadow_pass: {
          value: null,
        },
        resolution: {
          value: new ve(),
        },
        radius: {
          value: 4,
        },
      },
      vertexShader: "void main() {\n\tgl_Position = vec4( position, 1.0 );\n}",
      fragmentShader:
        "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\n#include <packing>\nvoid main() {\n\tconst float samples = float( VSM_SAMPLES );\n\tfloat mean = 0.0;\n\tfloat squared_mean = 0.0;\n\tfloat uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n\tfloat uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n\tfor ( float i = 0.0; i < samples; i ++ ) {\n\t\tfloat uvOffset = uvStart + i * uvStride;\n\t\t#ifdef HORIZONTAL_PASS\n\t\t\tvec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );\n\t\t\tmean += distribution.x;\n\t\t\tsquared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n\t\t#else\n\t\t\tfloat depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );\n\t\t\tmean += depth;\n\t\t\tsquared_mean += depth * depth;\n\t\t#endif\n\t}\n\tmean = mean / samples;\n\tsquared_mean = squared_mean / samples;\n\tfloat std_dev = sqrt( squared_mean - mean * mean );\n\tgl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );\n}",
    }),
    g = m.clone();
  g.defines.HORIZONTAL_PASS = 1;
  const _ = new Li();
  _.setAttribute(
    "position",
    new Ei(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3)
  );
  const v = new Xi(_, m),
    x = this;
  (this.enabled = !1),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this.type = 1);
  let S = this.type;
  function M(n, i) {
    const s = e.update(v);
    m.defines.VSM_SAMPLES !== n.blurSamples &&
      ((m.defines.VSM_SAMPLES = n.blurSamples),
      (g.defines.VSM_SAMPLES = n.blurSamples),
      (m.needsUpdate = !0),
      (g.needsUpdate = !0)),
      null === n.mapPass && (n.mapPass = new He(r.x, r.y)),
      (m.uniforms.shadow_pass.value = n.map.texture),
      (m.uniforms.resolution.value = n.mapSize),
      (m.uniforms.radius.value = n.radius),
      t.setRenderTarget(n.mapPass),
      t.clear(),
      t.renderBufferDirect(i, null, s, m, v, null),
      (g.uniforms.shadow_pass.value = n.mapPass.texture),
      (g.uniforms.resolution.value = n.mapSize),
      (g.uniforms.radius.value = n.radius),
      t.setRenderTarget(n.map),
      t.clear(),
      t.renderBufferDirect(i, null, s, g, v, null);
  }
  function E(e, n, i, r) {
    let s = null;
    const a =
      !0 === i.isPointLight ? e.customDistanceMaterial : e.customDepthMaterial;
    if (void 0 !== a) s = a;
    else if (
      ((s = !0 === i.isPointLight ? l : o),
      (t.localClippingEnabled &&
        !0 === n.clipShadows &&
        Array.isArray(n.clippingPlanes) &&
        0 !== n.clippingPlanes.length) ||
        (n.displacementMap && 0 !== n.displacementScale) ||
        (n.alphaMap && n.alphaTest > 0) ||
        (n.map && n.alphaTest > 0))
    ) {
      const t = s.uuid,
        e = n.uuid;
      let i = c[t];
      void 0 === i && ((i = {}), (c[t] = i));
      let r = i[e];
      void 0 === r &&
        ((r = s.clone()), (i[e] = r), n.addEventListener("dispose", y)),
        (s = r);
    }
    if (
      ((s.visible = n.visible),
      (s.wireframe = n.wireframe),
      (s.side =
        3 === r
          ? null !== n.shadowSide
            ? n.shadowSide
            : n.side
          : null !== n.shadowSide
          ? n.shadowSide
          : f[n.side]),
      (s.alphaMap = n.alphaMap),
      (s.alphaTest = n.alphaTest),
      (s.map = n.map),
      (s.clipShadows = n.clipShadows),
      (s.clippingPlanes = n.clippingPlanes),
      (s.clipIntersection = n.clipIntersection),
      (s.displacementMap = n.displacementMap),
      (s.displacementScale = n.displacementScale),
      (s.displacementBias = n.displacementBias),
      (s.wireframeLinewidth = n.wireframeLinewidth),
      (s.linewidth = n.linewidth),
      !0 === i.isPointLight && !0 === s.isMeshDistanceMaterial)
    ) {
      t.properties.get(s).light = i;
    }
    return s;
  }
  function T(n, r, s, a, o) {
    if (!1 === n.visible) return;
    if (
      n.layers.test(r.layers) &&
      (n.isMesh || n.isLine || n.isPoints) &&
      (n.castShadow || (n.receiveShadow && 3 === o)) &&
      (!n.frustumCulled || i.intersectsObject(n))
    ) {
      n.modelViewMatrix.multiplyMatrices(s.matrixWorldInverse, n.matrixWorld);
      const i = e.update(n),
        l = n.material;
      if (Array.isArray(l)) {
        const e = i.groups;
        for (let c = 0, h = e.length; c < h; c++) {
          const h = e[c],
            u = l[h.materialIndex];
          if (u && u.visible) {
            const e = E(n, u, a, o);
            n.onBeforeShadow(t, n, r, s, i, e, h),
              t.renderBufferDirect(s, null, i, e, n, h),
              n.onAfterShadow(t, n, r, s, i, e, h);
          }
        }
      } else if (l.visible) {
        const e = E(n, l, a, o);
        n.onBeforeShadow(t, n, r, s, i, e, null),
          t.renderBufferDirect(s, null, i, e, n, null),
          n.onAfterShadow(t, n, r, s, i, e, null);
      }
    }
    const l = n.children;
    for (let t = 0, e = l.length; t < e; t++) T(l[t], r, s, a, o);
  }
  function y(t) {
    t.target.removeEventListener("dispose", y);
    for (const e in c) {
      const n = c[e],
        i = t.target.uuid;
      if (i in n) {
        n[i].dispose(), delete n[i];
      }
    }
  }
  this.render = function (e, n, o) {
    if (!1 === x.enabled) return;
    if (!1 === x.autoUpdate && !1 === x.needsUpdate) return;
    if (0 === e.length) return;
    const l = t.getRenderTarget(),
      c = t.getActiveCubeFace(),
      h = t.getActiveMipmapLevel(),
      u = t.state;
    u.setBlending(0),
      u.buffers.color.setClear(1, 1, 1, 1),
      u.buffers.depth.setTest(!0),
      u.setScissorTest(!1);
    const d = 3 !== S && 3 === this.type,
      f = 3 === S && 3 !== this.type;
    for (let m = 0, g = e.length; m < g; m++) {
      const l = e[m],
        c = l.shadow;
      if (void 0 === c) {
        console.warn("THREE.WebGLShadowMap:", l, "has no shadow.");
        continue;
      }
      if (!1 === c.autoUpdate && !1 === c.needsUpdate) continue;
      r.copy(c.mapSize);
      const h = c.getFrameExtents();
      if (
        (r.multiply(h),
        s.copy(c.mapSize),
        (r.x > p || r.y > p) &&
          (r.x > p &&
            ((s.x = Math.floor(p / h.x)),
            (r.x = s.x * h.x),
            (c.mapSize.x = s.x)),
          r.y > p &&
            ((s.y = Math.floor(p / h.y)),
            (r.y = s.y * h.y),
            (c.mapSize.y = s.y))),
        null === c.map || !0 === d || !0 === f)
      ) {
        const t =
          3 !== this.type
            ? {
                minFilter: X,
                magFilter: X,
              }
            : {};
        null !== c.map && c.map.dispose(),
          (c.map = new He(r.x, r.y, t)),
          (c.map.texture.name = l.name + ".shadowMap"),
          c.camera.updateProjectionMatrix();
      }
      t.setRenderTarget(c.map), t.clear();
      const g = c.getViewportCount();
      for (let t = 0; t < g; t++) {
        const e = c.getViewport(t);
        a.set(s.x * e.x, s.y * e.y, s.x * e.z, s.y * e.w),
          u.viewport(a),
          c.updateMatrices(l, t),
          (i = c.getFrustum()),
          T(n, o, c.camera, l, this.type);
      }
      !0 !== c.isPointLightShadow && 3 === this.type && M(c, o),
        (c.needsUpdate = !1);
    }
    (S = this.type), (x.needsUpdate = !1), t.setRenderTarget(l, c, h);
  };
}
const ro = {
  [U]: 1,
  [L]: 6,
  [N]: 7,
  [D]: 5,
  [I]: 0,
  [F]: 2,
  [B]: 4,
  [O]: 3,
};
function so(t, e) {
  const n = new (function () {
      let e = !1;
      const n = new ze();
      let i = null;
      const r = new ze(0, 0, 0, 0);
      return {
        setMask: function (n) {
          i === n || e || (t.colorMask(n, n, n, n), (i = n));
        },
        setLocked: function (t) {
          e = t;
        },
        setClear: function (e, i, s, a, o) {
          !0 === o && ((e *= a), (i *= a), (s *= a)),
            n.set(e, i, s, a),
            !1 === r.equals(n) && (t.clearColor(e, i, s, a), r.copy(n));
        },
        reset: function () {
          (e = !1), (i = null), r.set(-1, 0, 0, 0);
        },
      };
    })(),
    i = new (function () {
      let n = !1,
        i = !1,
        r = null,
        s = null,
        a = null;
      return {
        setReversed: function (t) {
          if (i !== t) {
            const n = e.get("EXT_clip_control");
            t
              ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT)
              : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT),
              (i = t);
            const r = a;
            (a = null), this.setClear(r);
          }
        },
        getReversed: function () {
          return i;
        },
        setTest: function (e) {
          e ? rt(t.DEPTH_TEST) : st(t.DEPTH_TEST);
        },
        setMask: function (e) {
          r === e || n || (t.depthMask(e), (r = e));
        },
        setFunc: function (e) {
          if ((i && (e = ro[e]), s !== e)) {
            switch (e) {
              case 0:
                t.depthFunc(t.NEVER);
                break;
              case 1:
                t.depthFunc(t.ALWAYS);
                break;
              case 2:
                t.depthFunc(t.LESS);
                break;
              case 3:
              default:
                t.depthFunc(t.LEQUAL);
                break;
              case 4:
                t.depthFunc(t.EQUAL);
                break;
              case 5:
                t.depthFunc(t.GEQUAL);
                break;
              case 6:
                t.depthFunc(t.GREATER);
                break;
              case 7:
                t.depthFunc(t.NOTEQUAL);
            }
            s = e;
          }
        },
        setLocked: function (t) {
          n = t;
        },
        setClear: function (e) {
          a !== e && (i && (e = 1 - e), t.clearDepth(e), (a = e));
        },
        reset: function () {
          (n = !1), (r = null), (s = null), (a = null), (i = !1);
        },
      };
    })(),
    r = new (function () {
      let e = !1,
        n = null,
        i = null,
        r = null,
        s = null,
        a = null,
        o = null,
        l = null,
        c = null;
      return {
        setTest: function (n) {
          e || (n ? rt(t.STENCIL_TEST) : st(t.STENCIL_TEST));
        },
        setMask: function (i) {
          n === i || e || (t.stencilMask(i), (n = i));
        },
        setFunc: function (e, n, a) {
          (i === e && r === n && s === a) ||
            (t.stencilFunc(e, n, a), (i = e), (r = n), (s = a));
        },
        setOp: function (e, n, i) {
          (a === e && o === n && l === i) ||
            (t.stencilOp(e, n, i), (a = e), (o = n), (l = i));
        },
        setLocked: function (t) {
          e = t;
        },
        setClear: function (e) {
          c !== e && (t.clearStencil(e), (c = e));
        },
        reset: function () {
          (e = !1),
            (n = null),
            (i = null),
            (r = null),
            (s = null),
            (a = null),
            (o = null),
            (l = null),
            (c = null);
        },
      };
    })(),
    s = new WeakMap(),
    a = new WeakMap();
  let o = {},
    l = {},
    c = new WeakMap(),
    h = [],
    u = null,
    d = !1,
    U = null,
    I = null,
    L = null,
    D = null,
    N = null,
    O = null,
    F = null,
    B = new fi(0, 0, 0),
    z = 0,
    G = !1,
    H = null,
    k = null,
    V = null,
    W = null,
    X = null;
  const j = t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let q = !1,
    Y = 0;
  const K = t.getParameter(t.VERSION);
  -1 !== K.indexOf("WebGL")
    ? ((Y = parseFloat(/^WebGL (\d)/.exec(K)[1])), (q = Y >= 1))
    : -1 !== K.indexOf("OpenGL ES") &&
      ((Y = parseFloat(/^OpenGL ES (\d)/.exec(K)[1])), (q = Y >= 2));
  let Z = null,
    J = {};
  const $ = t.getParameter(t.SCISSOR_BOX),
    Q = t.getParameter(t.VIEWPORT),
    tt = new ze().fromArray($),
    et = new ze().fromArray(Q);
  function nt(e, n, i, r) {
    const s = new Uint8Array(4),
      a = t.createTexture();
    t.bindTexture(e, a),
      t.texParameteri(e, t.TEXTURE_MIN_FILTER, t.NEAREST),
      t.texParameteri(e, t.TEXTURE_MAG_FILTER, t.NEAREST);
    for (let o = 0; o < i; o++)
      e === t.TEXTURE_3D || e === t.TEXTURE_2D_ARRAY
        ? t.texImage3D(n, 0, t.RGBA, 1, 1, r, 0, t.RGBA, t.UNSIGNED_BYTE, s)
        : t.texImage2D(n + o, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, s);
    return a;
  }
  const it = {};
  function rt(e) {
    !0 !== o[e] && (t.enable(e), (o[e] = !0));
  }
  function st(e) {
    !1 !== o[e] && (t.disable(e), (o[e] = !1));
  }
  (it[t.TEXTURE_2D] = nt(t.TEXTURE_2D, t.TEXTURE_2D, 1)),
    (it[t.TEXTURE_CUBE_MAP] = nt(
      t.TEXTURE_CUBE_MAP,
      t.TEXTURE_CUBE_MAP_POSITIVE_X,
      6
    )),
    (it[t.TEXTURE_2D_ARRAY] = nt(t.TEXTURE_2D_ARRAY, t.TEXTURE_2D_ARRAY, 1, 1)),
    (it[t.TEXTURE_3D] = nt(t.TEXTURE_3D, t.TEXTURE_3D, 1, 1)),
    n.setClear(0, 0, 0, 1),
    i.setClear(1),
    r.setClear(0),
    rt(t.DEPTH_TEST),
    i.setFunc(3),
    ct(!1),
    ht(1),
    rt(t.CULL_FACE),
    lt(0);
  const at = {
    [p]: t.FUNC_ADD,
    [f]: t.FUNC_SUBTRACT,
    [m]: t.FUNC_REVERSE_SUBTRACT,
  };
  (at[103] = t.MIN), (at[104] = t.MAX);
  const ot = {
    [g]: t.ZERO,
    [_]: t.ONE,
    [v]: t.SRC_COLOR,
    [S]: t.SRC_ALPHA,
    [w]: t.SRC_ALPHA_SATURATE,
    [y]: t.DST_COLOR,
    [E]: t.DST_ALPHA,
    [x]: t.ONE_MINUS_SRC_COLOR,
    [M]: t.ONE_MINUS_SRC_ALPHA,
    [b]: t.ONE_MINUS_DST_COLOR,
    [T]: t.ONE_MINUS_DST_ALPHA,
    [A]: t.CONSTANT_COLOR,
    [C]: t.ONE_MINUS_CONSTANT_COLOR,
    [R]: t.CONSTANT_ALPHA,
    [P]: t.ONE_MINUS_CONSTANT_ALPHA,
  };
  function lt(e, n, i, r, s, a, o, l, c, h) {
    if (0 !== e) {
      if ((!1 === d && (rt(t.BLEND), (d = !0)), 5 === e))
        (s = s || n),
          (a = a || i),
          (o = o || r),
          (n === I && s === N) ||
            (t.blendEquationSeparate(at[n], at[s]), (I = n), (N = s)),
          (i === L && r === D && a === O && o === F) ||
            (t.blendFuncSeparate(ot[i], ot[r], ot[a], ot[o]),
            (L = i),
            (D = r),
            (O = a),
            (F = o)),
          (!1 !== l.equals(B) && c === z) ||
            (t.blendColor(l.r, l.g, l.b, c), B.copy(l), (z = c)),
          (U = e),
          (G = !1);
      else if (e !== U || h !== G) {
        if (
          ((I === p && N === p) ||
            (t.blendEquation(t.FUNC_ADD), (I = p), (N = p)),
          h)
        )
          switch (e) {
            case 1:
              t.blendFuncSeparate(
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
              );
              break;
            case 2:
              t.blendFunc(t.ONE, t.ONE);
              break;
            case 3:
              t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
              break;
            case 4:
              t.blendFuncSeparate(t.ZERO, t.SRC_COLOR, t.ZERO, t.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", e);
          }
        else
          switch (e) {
            case 1:
              t.blendFuncSeparate(
                t.SRC_ALPHA,
                t.ONE_MINUS_SRC_ALPHA,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
              );
              break;
            case 2:
              t.blendFunc(t.SRC_ALPHA, t.ONE);
              break;
            case 3:
              t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
              break;
            case 4:
              t.blendFunc(t.ZERO, t.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", e);
          }
        (L = null),
          (D = null),
          (O = null),
          (F = null),
          B.set(0, 0, 0),
          (z = 0),
          (U = e),
          (G = h);
      }
    } else !0 === d && (st(t.BLEND), (d = !1));
  }
  function ct(e) {
    H !== e && (e ? t.frontFace(t.CW) : t.frontFace(t.CCW), (H = e));
  }
  function ht(e) {
    0 !== e
      ? (rt(t.CULL_FACE),
        e !== k &&
          (1 === e
            ? t.cullFace(t.BACK)
            : 2 === e
            ? t.cullFace(t.FRONT)
            : t.cullFace(t.FRONT_AND_BACK)))
      : st(t.CULL_FACE),
      (k = e);
  }
  function ut(e, n, i) {
    e
      ? (rt(t.POLYGON_OFFSET_FILL),
        (W === n && X === i) || (t.polygonOffset(n, i), (W = n), (X = i)))
      : st(t.POLYGON_OFFSET_FILL);
  }
  return {
    buffers: {
      color: n,
      depth: i,
      stencil: r,
    },
    enable: rt,
    disable: st,
    bindFramebuffer: function (e, n) {
      return (
        l[e] !== n &&
        (t.bindFramebuffer(e, n),
        (l[e] = n),
        e === t.DRAW_FRAMEBUFFER && (l[t.FRAMEBUFFER] = n),
        e === t.FRAMEBUFFER && (l[t.DRAW_FRAMEBUFFER] = n),
        !0)
      );
    },
    drawBuffers: function (e, n) {
      let i = h,
        r = !1;
      if (e) {
        (i = c.get(n)), void 0 === i && ((i = []), c.set(n, i));
        const s = e.textures;
        if (i.length !== s.length || i[0] !== t.COLOR_ATTACHMENT0) {
          for (let e = 0, n = s.length; e < n; e++)
            i[e] = t.COLOR_ATTACHMENT0 + e;
          (i.length = s.length), (r = !0);
        }
      } else i[0] !== t.BACK && ((i[0] = t.BACK), (r = !0));
      r && t.drawBuffers(i);
    },
    useProgram: function (e) {
      return u !== e && (t.useProgram(e), (u = e), !0);
    },
    setBlending: lt,
    setMaterial: function (e, s) {
      2 === e.side ? st(t.CULL_FACE) : rt(t.CULL_FACE);
      let a = 1 === e.side;
      s && (a = !a),
        ct(a),
        1 === e.blending && !1 === e.transparent
          ? lt(0)
          : lt(
              e.blending,
              e.blendEquation,
              e.blendSrc,
              e.blendDst,
              e.blendEquationAlpha,
              e.blendSrcAlpha,
              e.blendDstAlpha,
              e.blendColor,
              e.blendAlpha,
              e.premultipliedAlpha
            ),
        i.setFunc(e.depthFunc),
        i.setTest(e.depthTest),
        i.setMask(e.depthWrite),
        n.setMask(e.colorWrite);
      const o = e.stencilWrite;
      r.setTest(o),
        o &&
          (r.setMask(e.stencilWriteMask),
          r.setFunc(e.stencilFunc, e.stencilRef, e.stencilFuncMask),
          r.setOp(e.stencilFail, e.stencilZFail, e.stencilZPass)),
        ut(e.polygonOffset, e.polygonOffsetFactor, e.polygonOffsetUnits),
        !0 === e.alphaToCoverage
          ? rt(t.SAMPLE_ALPHA_TO_COVERAGE)
          : st(t.SAMPLE_ALPHA_TO_COVERAGE);
    },
    setFlipSided: ct,
    setCullFace: ht,
    setLineWidth: function (e) {
      e !== V && (q && t.lineWidth(e), (V = e));
    },
    setPolygonOffset: ut,
    setScissorTest: function (e) {
      e ? rt(t.SCISSOR_TEST) : st(t.SCISSOR_TEST);
    },
    activeTexture: function (e) {
      void 0 === e && (e = t.TEXTURE0 + j - 1),
        Z !== e && (t.activeTexture(e), (Z = e));
    },
    bindTexture: function (e, n, i) {
      void 0 === i && (i = null === Z ? t.TEXTURE0 + j - 1 : Z);
      let r = J[i];
      void 0 === r &&
        ((r = {
          type: void 0,
          texture: void 0,
        }),
        (J[i] = r)),
        (r.type === e && r.texture === n) ||
          (Z !== i && (t.activeTexture(i), (Z = i)),
          t.bindTexture(e, n || it[e]),
          (r.type = e),
          (r.texture = n));
    },
    unbindTexture: function () {
      const e = J[Z];
      void 0 !== e &&
        void 0 !== e.type &&
        (t.bindTexture(e.type, null), (e.type = void 0), (e.texture = void 0));
    },
    compressedTexImage2D: function () {
      try {
        t.compressedTexImage2D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    compressedTexImage3D: function () {
      try {
        t.compressedTexImage3D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texImage2D: function () {
      try {
        t.texImage2D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texImage3D: function () {
      try {
        t.texImage3D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    updateUBOMapping: function (e, n) {
      let i = a.get(n);
      void 0 === i && ((i = new WeakMap()), a.set(n, i));
      let r = i.get(e);
      void 0 === r && ((r = t.getUniformBlockIndex(n, e.name)), i.set(e, r));
    },
    uniformBlockBinding: function (e, n) {
      const i = a.get(n).get(e);
      s.get(n) !== i &&
        (t.uniformBlockBinding(n, i, e.__bindingPointIndex), s.set(n, i));
    },
    texStorage2D: function () {
      try {
        t.texStorage2D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texStorage3D: function () {
      try {
        t.texStorage3D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texSubImage2D: function () {
      try {
        t.texSubImage2D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    texSubImage3D: function () {
      try {
        t.texSubImage3D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    compressedTexSubImage2D: function () {
      try {
        t.compressedTexSubImage2D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    compressedTexSubImage3D: function () {
      try {
        t.compressedTexSubImage3D(...arguments);
      } catch (e) {
        console.error("THREE.WebGLState:", e);
      }
    },
    scissor: function (e) {
      !1 === tt.equals(e) && (t.scissor(e.x, e.y, e.z, e.w), tt.copy(e));
    },
    viewport: function (e) {
      !1 === et.equals(e) && (t.viewport(e.x, e.y, e.z, e.w), et.copy(e));
    },
    reset: function () {
      t.disable(t.BLEND),
        t.disable(t.CULL_FACE),
        t.disable(t.DEPTH_TEST),
        t.disable(t.POLYGON_OFFSET_FILL),
        t.disable(t.SCISSOR_TEST),
        t.disable(t.STENCIL_TEST),
        t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),
        t.blendEquation(t.FUNC_ADD),
        t.blendFunc(t.ONE, t.ZERO),
        t.blendFuncSeparate(t.ONE, t.ZERO, t.ONE, t.ZERO),
        t.blendColor(0, 0, 0, 0),
        t.colorMask(!0, !0, !0, !0),
        t.clearColor(0, 0, 0, 0),
        t.depthMask(!0),
        t.depthFunc(t.LESS),
        i.setReversed(!1),
        t.clearDepth(1),
        t.stencilMask(4294967295),
        t.stencilFunc(t.ALWAYS, 0, 4294967295),
        t.stencilOp(t.KEEP, t.KEEP, t.KEEP),
        t.clearStencil(0),
        t.cullFace(t.BACK),
        t.frontFace(t.CCW),
        t.polygonOffset(0, 0),
        t.activeTexture(t.TEXTURE0),
        t.bindFramebuffer(t.FRAMEBUFFER, null),
        t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null),
        t.bindFramebuffer(t.READ_FRAMEBUFFER, null),
        t.useProgram(null),
        t.lineWidth(1),
        t.scissor(0, 0, t.canvas.width, t.canvas.height),
        t.viewport(0, 0, t.canvas.width, t.canvas.height),
        (o = {}),
        (Z = null),
        (J = {}),
        (l = {}),
        (c = new WeakMap()),
        (h = []),
        (u = null),
        (d = !1),
        (U = null),
        (I = null),
        (L = null),
        (D = null),
        (N = null),
        (O = null),
        (F = null),
        (B = new fi(0, 0, 0)),
        (z = 0),
        (G = !1),
        (H = null),
        (k = null),
        (V = null),
        (W = null),
        (X = null),
        tt.set(0, 0, t.canvas.width, t.canvas.height),
        et.set(0, 0, t.canvas.width, t.canvas.height),
        n.reset(),
        i.reset(),
        r.reset();
    },
  };
}
function ao(t, e, n, i, r, s, a) {
  const o = e.has("WEBGL_multisampled_render_to_texture")
      ? e.get("WEBGL_multisampled_render_to_texture")
      : null,
    l =
      "undefined" != typeof navigator &&
      /OculusBrowser/g.test(navigator.userAgent),
    c = new ve(),
    h = new WeakMap();
  let u;
  const d = new WeakMap();
  let p = !1;
  try {
    p =
      "undefined" != typeof OffscreenCanvas &&
      null !== new OffscreenCanvas(1, 1).getContext("2d");
  } catch ($) {}
  function f(t, e) {
    return p ? new OffscreenCanvas(t, e) : Ee("canvas");
  }
  function m(t, e, n) {
    let i = 1;
    const r = H(t);
    if (
      ((r.width > n || r.height > n) && (i = n / Math.max(r.width, r.height)),
      i < 1)
    ) {
      if (
        ("undefined" != typeof HTMLImageElement &&
          t instanceof HTMLImageElement) ||
        ("undefined" != typeof HTMLCanvasElement &&
          t instanceof HTMLCanvasElement) ||
        ("undefined" != typeof ImageBitmap && t instanceof ImageBitmap) ||
        ("undefined" != typeof VideoFrame && t instanceof VideoFrame)
      ) {
        const n = Math.floor(i * r.width),
          s = Math.floor(i * r.height);
        void 0 === u && (u = f(n, s));
        const a = e ? f(n, s) : u;
        (a.width = n), (a.height = s);
        return (
          a.getContext("2d").drawImage(t, 0, 0, n, s),
          console.warn(
            "THREE.WebGLRenderer: Texture has been resized from (" +
              r.width +
              "x" +
              r.height +
              ") to (" +
              n +
              "x" +
              s +
              ")."
          ),
          a
        );
      }
      return (
        "data" in t &&
          console.warn(
            "THREE.WebGLRenderer: Image in DataTexture is too big (" +
              r.width +
              "x" +
              r.height +
              ")."
          ),
        t
      );
    }
    return t;
  }
  function g(t) {
    return t.generateMipmaps;
  }
  function _(e) {
    t.generateMipmap(e);
  }
  function v(e) {
    return e.isWebGLCubeRenderTarget
      ? t.TEXTURE_CUBE_MAP
      : e.isWebGL3DRenderTarget
      ? t.TEXTURE_3D
      : e.isWebGLArrayRenderTarget || e.isCompressedArrayTexture
      ? t.TEXTURE_2D_ARRAY
      : t.TEXTURE_2D;
  }
  function x(n, i, r, s, a = !1) {
    if (null !== n) {
      if (void 0 !== t[n]) return t[n];
      console.warn(
        "THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          n +
          "'"
      );
    }
    let o = i;
    if (
      (i === t.RED &&
        (r === t.FLOAT && (o = t.R32F),
        r === t.HALF_FLOAT && (o = t.R16F),
        r === t.UNSIGNED_BYTE && (o = t.R8)),
      i === t.RED_INTEGER &&
        (r === t.UNSIGNED_BYTE && (o = t.R8UI),
        r === t.UNSIGNED_SHORT && (o = t.R16UI),
        r === t.UNSIGNED_INT && (o = t.R32UI),
        r === t.BYTE && (o = t.R8I),
        r === t.SHORT && (o = t.R16I),
        r === t.INT && (o = t.R32I)),
      i === t.RG &&
        (r === t.FLOAT && (o = t.RG32F),
        r === t.HALF_FLOAT && (o = t.RG16F),
        r === t.UNSIGNED_BYTE && (o = t.RG8)),
      i === t.RG_INTEGER &&
        (r === t.UNSIGNED_BYTE && (o = t.RG8UI),
        r === t.UNSIGNED_SHORT && (o = t.RG16UI),
        r === t.UNSIGNED_INT && (o = t.RG32UI),
        r === t.BYTE && (o = t.RG8I),
        r === t.SHORT && (o = t.RG16I),
        r === t.INT && (o = t.RG32I)),
      i === t.RGB_INTEGER &&
        (r === t.UNSIGNED_BYTE && (o = t.RGB8UI),
        r === t.UNSIGNED_SHORT && (o = t.RGB16UI),
        r === t.UNSIGNED_INT && (o = t.RGB32UI),
        r === t.BYTE && (o = t.RGB8I),
        r === t.SHORT && (o = t.RGB16I),
        r === t.INT && (o = t.RGB32I)),
      i === t.RGBA_INTEGER &&
        (r === t.UNSIGNED_BYTE && (o = t.RGBA8UI),
        r === t.UNSIGNED_SHORT && (o = t.RGBA16UI),
        r === t.UNSIGNED_INT && (o = t.RGBA32UI),
        r === t.BYTE && (o = t.RGBA8I),
        r === t.SHORT && (o = t.RGBA16I),
        r === t.INT && (o = t.RGBA32I)),
      i === t.RGB && r === t.UNSIGNED_INT_5_9_9_9_REV && (o = t.RGB9_E5),
      i === t.RGBA)
    ) {
      const e = a ? Kt : Re.getTransfer(s);
      r === t.FLOAT && (o = t.RGBA32F),
        r === t.HALF_FLOAT && (o = t.RGBA16F),
        r === t.UNSIGNED_BYTE && (o = e === Zt ? t.SRGB8_ALPHA8 : t.RGBA8),
        r === t.UNSIGNED_SHORT_4_4_4_4 && (o = t.RGBA4),
        r === t.UNSIGNED_SHORT_5_5_5_1 && (o = t.RGB5_A1);
    }
    return (
      (o !== t.R16F &&
        o !== t.R32F &&
        o !== t.RG16F &&
        o !== t.RG32F &&
        o !== t.RGBA16F &&
        o !== t.RGBA32F) ||
        e.get("EXT_color_buffer_float"),
      o
    );
  }
  function S(e, n) {
    let i;
    return (
      e
        ? null === n || n === nt || n === ot
          ? (i = t.DEPTH24_STENCIL8)
          : n === it
          ? (i = t.DEPTH32F_STENCIL8)
          : n === tt &&
            ((i = t.DEPTH24_STENCIL8),
            console.warn(
              "DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment."
            ))
        : null === n || n === nt || n === ot
        ? (i = t.DEPTH_COMPONENT24)
        : n === it
        ? (i = t.DEPTH_COMPONENT32F)
        : n === tt && (i = t.DEPTH_COMPONENT16),
      i
    );
  }
  function M(t, e) {
    return !0 === g(t) ||
      (t.isFramebufferTexture && t.minFilter !== X && t.minFilter !== Y)
      ? Math.log2(Math.max(e.width, e.height)) + 1
      : void 0 !== t.mipmaps && t.mipmaps.length > 0
      ? t.mipmaps.length
      : t.isCompressedTexture && Array.isArray(t.image)
      ? e.mipmaps.length
      : 1;
  }
  function E(t) {
    const e = t.target;
    e.removeEventListener("dispose", E),
      (function (t) {
        const e = i.get(t);
        if (void 0 === e.__webglInit) return;
        const n = t.source,
          r = d.get(n);
        if (r) {
          const i = r[e.__cacheKey];
          i.usedTimes--,
            0 === i.usedTimes && y(t),
            0 === Object.keys(r).length && d.delete(n);
        }
        i.remove(t);
      })(e),
      e.isVideoTexture && h.delete(e);
  }
  function T(e) {
    const n = e.target;
    n.removeEventListener("dispose", T),
      (function (e) {
        const n = i.get(e);
        e.depthTexture && (e.depthTexture.dispose(), i.remove(e.depthTexture));
        if (e.isWebGLCubeRenderTarget)
          for (let i = 0; i < 6; i++) {
            if (Array.isArray(n.__webglFramebuffer[i]))
              for (let e = 0; e < n.__webglFramebuffer[i].length; e++)
                t.deleteFramebuffer(n.__webglFramebuffer[i][e]);
            else t.deleteFramebuffer(n.__webglFramebuffer[i]);
            n.__webglDepthbuffer &&
              t.deleteRenderbuffer(n.__webglDepthbuffer[i]);
          }
        else {
          if (Array.isArray(n.__webglFramebuffer))
            for (let e = 0; e < n.__webglFramebuffer.length; e++)
              t.deleteFramebuffer(n.__webglFramebuffer[e]);
          else t.deleteFramebuffer(n.__webglFramebuffer);
          if (
            (n.__webglDepthbuffer && t.deleteRenderbuffer(n.__webglDepthbuffer),
            n.__webglMultisampledFramebuffer &&
              t.deleteFramebuffer(n.__webglMultisampledFramebuffer),
            n.__webglColorRenderbuffer)
          )
            for (let e = 0; e < n.__webglColorRenderbuffer.length; e++)
              n.__webglColorRenderbuffer[e] &&
                t.deleteRenderbuffer(n.__webglColorRenderbuffer[e]);
          n.__webglDepthRenderbuffer &&
            t.deleteRenderbuffer(n.__webglDepthRenderbuffer);
        }
        const r = e.textures;
        for (let s = 0, o = r.length; s < o; s++) {
          const e = i.get(r[s]);
          e.__webglTexture &&
            (t.deleteTexture(e.__webglTexture), a.memory.textures--),
            i.remove(r[s]);
        }
        i.remove(e);
      })(n);
  }
  function y(e) {
    const n = i.get(e);
    t.deleteTexture(n.__webglTexture);
    const r = e.source;
    delete d.get(r)[n.__cacheKey], a.memory.textures--;
  }
  let b = 0;
  function w(e, r) {
    const s = i.get(e);
    if (
      (e.isVideoTexture &&
        (function (t) {
          const e = a.render.frame;
          h.get(t) !== e && (h.set(t, e), t.update());
        })(e),
      !1 === e.isRenderTargetTexture &&
        e.version > 0 &&
        s.__version !== e.version)
    ) {
      const t = e.image;
      if (null === t)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but no image data found."
        );
      else {
        if (!1 !== t.complete) return void I(s, e, r);
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but image is incomplete"
        );
      }
    }
    n.bindTexture(t.TEXTURE_2D, s.__webglTexture, t.TEXTURE0 + r);
  }
  const A = {
      [k]: t.REPEAT,
      [V]: t.CLAMP_TO_EDGE,
      [W]: t.MIRRORED_REPEAT,
    },
    C = {
      [X]: t.NEAREST,
      [j]: t.NEAREST_MIPMAP_NEAREST,
      [q]: t.NEAREST_MIPMAP_LINEAR,
      [Y]: t.LINEAR,
      [K]: t.LINEAR_MIPMAP_NEAREST,
      [Z]: t.LINEAR_MIPMAP_LINEAR,
    },
    R = {
      [$t]: t.NEVER,
      [se]: t.ALWAYS,
      [Qt]: t.LESS,
      [ee]: t.LEQUAL,
      [te]: t.EQUAL,
      [re]: t.GEQUAL,
      [ne]: t.GREATER,
      [ie]: t.NOTEQUAL,
    };
  function P(n, s) {
    if (
      (s.type !== it ||
        !1 !== e.has("OES_texture_float_linear") ||
        (s.magFilter !== Y &&
          s.magFilter !== K &&
          s.magFilter !== q &&
          s.magFilter !== Z &&
          s.minFilter !== Y &&
          s.minFilter !== K &&
          s.minFilter !== q &&
          s.minFilter !== Z) ||
        console.warn(
          "THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."
        ),
      t.texParameteri(n, t.TEXTURE_WRAP_S, A[s.wrapS]),
      t.texParameteri(n, t.TEXTURE_WRAP_T, A[s.wrapT]),
      (n !== t.TEXTURE_3D && n !== t.TEXTURE_2D_ARRAY) ||
        t.texParameteri(n, t.TEXTURE_WRAP_R, A[s.wrapR]),
      t.texParameteri(n, t.TEXTURE_MAG_FILTER, C[s.magFilter]),
      t.texParameteri(n, t.TEXTURE_MIN_FILTER, C[s.minFilter]),
      s.compareFunction &&
        (t.texParameteri(n, t.TEXTURE_COMPARE_MODE, t.COMPARE_REF_TO_TEXTURE),
        t.texParameteri(n, t.TEXTURE_COMPARE_FUNC, R[s.compareFunction])),
      !0 === e.has("EXT_texture_filter_anisotropic"))
    ) {
      if (s.magFilter === X) return;
      if (s.minFilter !== q && s.minFilter !== Z) return;
      if (s.type === it && !1 === e.has("OES_texture_float_linear")) return;
      if (s.anisotropy > 1 || i.get(s).__currentAnisotropy) {
        const a = e.get("EXT_texture_filter_anisotropic");
        t.texParameterf(
          n,
          a.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(s.anisotropy, r.getMaxAnisotropy())
        ),
          (i.get(s).__currentAnisotropy = s.anisotropy);
      }
    }
  }
  function U(e, n) {
    let i = !1;
    void 0 === e.__webglInit &&
      ((e.__webglInit = !0), n.addEventListener("dispose", E));
    const r = n.source;
    let s = d.get(r);
    void 0 === s && ((s = {}), d.set(r, s));
    const o = (function (t) {
      const e = [];
      return (
        e.push(t.wrapS),
        e.push(t.wrapT),
        e.push(t.wrapR || 0),
        e.push(t.magFilter),
        e.push(t.minFilter),
        e.push(t.anisotropy),
        e.push(t.internalFormat),
        e.push(t.format),
        e.push(t.type),
        e.push(t.generateMipmaps),
        e.push(t.premultiplyAlpha),
        e.push(t.flipY),
        e.push(t.unpackAlignment),
        e.push(t.colorSpace),
        e.join()
      );
    })(n);
    if (o !== e.__cacheKey) {
      void 0 === s[o] &&
        ((s[o] = {
          texture: t.createTexture(),
          usedTimes: 0,
        }),
        a.memory.textures++,
        (i = !0)),
        s[o].usedTimes++;
      const r = s[e.__cacheKey];
      void 0 !== r && (s[e.__cacheKey].usedTimes--, 0 === r.usedTimes && y(n)),
        (e.__cacheKey = o),
        (e.__webglTexture = s[o].texture);
    }
    return i;
  }
  function I(e, a, o) {
    let l = t.TEXTURE_2D;
    (a.isDataArrayTexture || a.isCompressedArrayTexture) &&
      (l = t.TEXTURE_2D_ARRAY),
      a.isData3DTexture && (l = t.TEXTURE_3D);
    const c = U(e, a),
      h = a.source;
    n.bindTexture(l, e.__webglTexture, t.TEXTURE0 + o);
    const u = i.get(h);
    if (h.version !== u.__version || !0 === c) {
      n.activeTexture(t.TEXTURE0 + o);
      const e = Re.getPrimaries(Re.workingColorSpace),
        i = a.colorSpace === jt ? null : Re.getPrimaries(a.colorSpace),
        d = a.colorSpace === jt || e === i ? t.NONE : t.BROWSER_DEFAULT_WEBGL;
      t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, a.flipY),
        t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, a.premultiplyAlpha),
        t.pixelStorei(t.UNPACK_ALIGNMENT, a.unpackAlignment),
        t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, d);
      let p = m(a.image, !1, r.maxTextureSize);
      p = G(a, p);
      const f = s.convert(a.format, a.colorSpace),
        v = s.convert(a.type);
      let E,
        T = x(a.internalFormat, f, v, a.colorSpace, a.isVideoTexture);
      P(l, a);
      const y = a.mipmaps,
        b = !0 !== a.isVideoTexture,
        w = void 0 === u.__version || !0 === c,
        A = h.dataReady,
        C = M(a, p);
      if (a.isDepthTexture)
        (T = S(a.format === ut, a.type)),
          w &&
            (b
              ? n.texStorage2D(t.TEXTURE_2D, 1, T, p.width, p.height)
              : n.texImage2D(
                  t.TEXTURE_2D,
                  0,
                  T,
                  p.width,
                  p.height,
                  0,
                  f,
                  v,
                  null
                ));
      else if (a.isDataTexture)
        if (y.length > 0) {
          b && w && n.texStorage2D(t.TEXTURE_2D, C, T, y[0].width, y[0].height);
          for (let e = 0, i = y.length; e < i; e++)
            (E = y[e]),
              b
                ? A &&
                  n.texSubImage2D(
                    t.TEXTURE_2D,
                    e,
                    0,
                    0,
                    E.width,
                    E.height,
                    f,
                    v,
                    E.data
                  )
                : n.texImage2D(
                    t.TEXTURE_2D,
                    e,
                    T,
                    E.width,
                    E.height,
                    0,
                    f,
                    v,
                    E.data
                  );
          a.generateMipmaps = !1;
        } else
          b
            ? (w && n.texStorage2D(t.TEXTURE_2D, C, T, p.width, p.height),
              A &&
                n.texSubImage2D(
                  t.TEXTURE_2D,
                  0,
                  0,
                  0,
                  p.width,
                  p.height,
                  f,
                  v,
                  p.data
                ))
            : n.texImage2D(
                t.TEXTURE_2D,
                0,
                T,
                p.width,
                p.height,
                0,
                f,
                v,
                p.data
              );
      else if (a.isCompressedTexture)
        if (a.isCompressedArrayTexture) {
          b &&
            w &&
            n.texStorage3D(
              t.TEXTURE_2D_ARRAY,
              C,
              T,
              y[0].width,
              y[0].height,
              p.depth
            );
          for (let e = 0, i = y.length; e < i; e++)
            if (((E = y[e]), a.format !== ct))
              if (null !== f)
                if (b) {
                  if (A)
                    if (a.layerUpdates.size > 0) {
                      const i = Ur(E.width, E.height, a.format, a.type);
                      for (const r of a.layerUpdates) {
                        const s = E.data.subarray(
                          (r * i) / E.data.BYTES_PER_ELEMENT,
                          ((r + 1) * i) / E.data.BYTES_PER_ELEMENT
                        );
                        n.compressedTexSubImage3D(
                          t.TEXTURE_2D_ARRAY,
                          e,
                          0,
                          0,
                          r,
                          E.width,
                          E.height,
                          1,
                          f,
                          s
                        );
                      }
                      a.clearLayerUpdates();
                    } else
                      n.compressedTexSubImage3D(
                        t.TEXTURE_2D_ARRAY,
                        e,
                        0,
                        0,
                        0,
                        E.width,
                        E.height,
                        p.depth,
                        f,
                        E.data
                      );
                } else
                  n.compressedTexImage3D(
                    t.TEXTURE_2D_ARRAY,
                    e,
                    T,
                    E.width,
                    E.height,
                    p.depth,
                    0,
                    E.data,
                    0,
                    0
                  );
              else
                console.warn(
                  "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
                );
            else
              b
                ? A &&
                  n.texSubImage3D(
                    t.TEXTURE_2D_ARRAY,
                    e,
                    0,
                    0,
                    0,
                    E.width,
                    E.height,
                    p.depth,
                    f,
                    v,
                    E.data
                  )
                : n.texImage3D(
                    t.TEXTURE_2D_ARRAY,
                    e,
                    T,
                    E.width,
                    E.height,
                    p.depth,
                    0,
                    f,
                    v,
                    E.data
                  );
        } else {
          b && w && n.texStorage2D(t.TEXTURE_2D, C, T, y[0].width, y[0].height);
          for (let e = 0, i = y.length; e < i; e++)
            (E = y[e]),
              a.format !== ct
                ? null !== f
                  ? b
                    ? A &&
                      n.compressedTexSubImage2D(
                        t.TEXTURE_2D,
                        e,
                        0,
                        0,
                        E.width,
                        E.height,
                        f,
                        E.data
                      )
                    : n.compressedTexImage2D(
                        t.TEXTURE_2D,
                        e,
                        T,
                        E.width,
                        E.height,
                        0,
                        E.data
                      )
                  : console.warn(
                      "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"
                    )
                : b
                ? A &&
                  n.texSubImage2D(
                    t.TEXTURE_2D,
                    e,
                    0,
                    0,
                    E.width,
                    E.height,
                    f,
                    v,
                    E.data
                  )
                : n.texImage2D(
                    t.TEXTURE_2D,
                    e,
                    T,
                    E.width,
                    E.height,
                    0,
                    f,
                    v,
                    E.data
                  );
        }
      else if (a.isDataArrayTexture)
        if (b) {
          if (
            (w &&
              n.texStorage3D(
                t.TEXTURE_2D_ARRAY,
                C,
                T,
                p.width,
                p.height,
                p.depth
              ),
            A)
          )
            if (a.layerUpdates.size > 0) {
              const e = Ur(p.width, p.height, a.format, a.type);
              for (const i of a.layerUpdates) {
                const r = p.data.subarray(
                  (i * e) / p.data.BYTES_PER_ELEMENT,
                  ((i + 1) * e) / p.data.BYTES_PER_ELEMENT
                );
                n.texSubImage3D(
                  t.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  i,
                  p.width,
                  p.height,
                  1,
                  f,
                  v,
                  r
                );
              }
              a.clearLayerUpdates();
            } else
              n.texSubImage3D(
                t.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                0,
                p.width,
                p.height,
                p.depth,
                f,
                v,
                p.data
              );
        } else
          n.texImage3D(
            t.TEXTURE_2D_ARRAY,
            0,
            T,
            p.width,
            p.height,
            p.depth,
            0,
            f,
            v,
            p.data
          );
      else if (a.isData3DTexture)
        b
          ? (w &&
              n.texStorage3D(t.TEXTURE_3D, C, T, p.width, p.height, p.depth),
            A &&
              n.texSubImage3D(
                t.TEXTURE_3D,
                0,
                0,
                0,
                0,
                p.width,
                p.height,
                p.depth,
                f,
                v,
                p.data
              ))
          : n.texImage3D(
              t.TEXTURE_3D,
              0,
              T,
              p.width,
              p.height,
              p.depth,
              0,
              f,
              v,
              p.data
            );
      else if (a.isFramebufferTexture) {
        if (w)
          if (b) n.texStorage2D(t.TEXTURE_2D, C, T, p.width, p.height);
          else {
            let e = p.width,
              i = p.height;
            for (let r = 0; r < C; r++)
              n.texImage2D(t.TEXTURE_2D, r, T, e, i, 0, f, v, null),
                (e >>= 1),
                (i >>= 1);
          }
      } else if (y.length > 0) {
        if (b && w) {
          const e = H(y[0]);
          n.texStorage2D(t.TEXTURE_2D, C, T, e.width, e.height);
        }
        for (let e = 0, i = y.length; e < i; e++)
          (E = y[e]),
            b
              ? A && n.texSubImage2D(t.TEXTURE_2D, e, 0, 0, f, v, E)
              : n.texImage2D(t.TEXTURE_2D, e, T, f, v, E);
        a.generateMipmaps = !1;
      } else if (b) {
        if (w) {
          const e = H(p);
          n.texStorage2D(t.TEXTURE_2D, C, T, e.width, e.height);
        }
        A && n.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, f, v, p);
      } else n.texImage2D(t.TEXTURE_2D, 0, T, f, v, p);
      g(a) && _(l), (u.__version = h.version), a.onUpdate && a.onUpdate(a);
    }
    e.__version = a.version;
  }
  function L(e, r, a, l, c, h) {
    const u = s.convert(a.format, a.colorSpace),
      d = s.convert(a.type),
      p = x(a.internalFormat, u, d, a.colorSpace),
      f = i.get(r),
      m = i.get(a);
    if (((m.__renderTarget = r), !f.__hasExternalTextures)) {
      const e = Math.max(1, r.width >> h),
        i = Math.max(1, r.height >> h);
      c === t.TEXTURE_3D || c === t.TEXTURE_2D_ARRAY
        ? n.texImage3D(c, h, p, e, i, r.depth, 0, u, d, null)
        : n.texImage2D(c, h, p, e, i, 0, u, d, null);
    }
    n.bindFramebuffer(t.FRAMEBUFFER, e),
      z(r)
        ? o.framebufferTexture2DMultisampleEXT(
            t.FRAMEBUFFER,
            l,
            c,
            m.__webglTexture,
            0,
            B(r)
          )
        : (c === t.TEXTURE_2D ||
            (c >= t.TEXTURE_CUBE_MAP_POSITIVE_X &&
              c <= t.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
          t.framebufferTexture2D(t.FRAMEBUFFER, l, c, m.__webglTexture, h),
      n.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  function D(e, n, i) {
    if ((t.bindRenderbuffer(t.RENDERBUFFER, e), n.depthBuffer)) {
      const r = n.depthTexture,
        s = r && r.isDepthTexture ? r.type : null,
        a = S(n.stencilBuffer, s),
        l = n.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT,
        c = B(n);
      z(n)
        ? o.renderbufferStorageMultisampleEXT(
            t.RENDERBUFFER,
            c,
            a,
            n.width,
            n.height
          )
        : i
        ? t.renderbufferStorageMultisample(
            t.RENDERBUFFER,
            c,
            a,
            n.width,
            n.height
          )
        : t.renderbufferStorage(t.RENDERBUFFER, a, n.width, n.height),
        t.framebufferRenderbuffer(t.FRAMEBUFFER, l, t.RENDERBUFFER, e);
    } else {
      const e = n.textures;
      for (let r = 0; r < e.length; r++) {
        const a = e[r],
          l = s.convert(a.format, a.colorSpace),
          c = s.convert(a.type),
          h = x(a.internalFormat, l, c, a.colorSpace),
          u = B(n);
        i && !1 === z(n)
          ? t.renderbufferStorageMultisample(
              t.RENDERBUFFER,
              u,
              h,
              n.width,
              n.height
            )
          : z(n)
          ? o.renderbufferStorageMultisampleEXT(
              t.RENDERBUFFER,
              u,
              h,
              n.width,
              n.height
            )
          : t.renderbufferStorage(t.RENDERBUFFER, h, n.width, n.height);
      }
    }
    t.bindRenderbuffer(t.RENDERBUFFER, null);
  }
  function N(e) {
    const r = i.get(e),
      s = !0 === e.isWebGLCubeRenderTarget;
    if (r.__boundDepthTexture !== e.depthTexture) {
      const t = e.depthTexture;
      if ((r.__depthDisposeCallback && r.__depthDisposeCallback(), t)) {
        const e = () => {
          delete r.__boundDepthTexture,
            delete r.__depthDisposeCallback,
            t.removeEventListener("dispose", e);
        };
        t.addEventListener("dispose", e), (r.__depthDisposeCallback = e);
      }
      r.__boundDepthTexture = t;
    }
    if (e.depthTexture && !r.__autoAllocateDepthBuffer) {
      if (s)
        throw new Error(
          "target.depthTexture not supported in Cube render targets"
        );
      !(function (e, r) {
        if (r && r.isWebGLCubeRenderTarget)
          throw new Error(
            "Depth Texture with cube render targets is not supported"
          );
        if (
          (n.bindFramebuffer(t.FRAMEBUFFER, e),
          !r.depthTexture || !r.depthTexture.isDepthTexture)
        )
          throw new Error(
            "renderTarget.depthTexture must be an instance of THREE.DepthTexture"
          );
        const s = i.get(r.depthTexture);
        (s.__renderTarget = r),
          (s.__webglTexture &&
            r.depthTexture.image.width === r.width &&
            r.depthTexture.image.height === r.height) ||
            ((r.depthTexture.image.width = r.width),
            (r.depthTexture.image.height = r.height),
            (r.depthTexture.needsUpdate = !0)),
          w(r.depthTexture, 0);
        const a = s.__webglTexture,
          l = B(r);
        if (r.depthTexture.format === ht)
          z(r)
            ? o.framebufferTexture2DMultisampleEXT(
                t.FRAMEBUFFER,
                t.DEPTH_ATTACHMENT,
                t.TEXTURE_2D,
                a,
                0,
                l
              )
            : t.framebufferTexture2D(
                t.FRAMEBUFFER,
                t.DEPTH_ATTACHMENT,
                t.TEXTURE_2D,
                a,
                0
              );
        else {
          if (r.depthTexture.format !== ut)
            throw new Error("Unknown depthTexture format");
          z(r)
            ? o.framebufferTexture2DMultisampleEXT(
                t.FRAMEBUFFER,
                t.DEPTH_STENCIL_ATTACHMENT,
                t.TEXTURE_2D,
                a,
                0,
                l
              )
            : t.framebufferTexture2D(
                t.FRAMEBUFFER,
                t.DEPTH_STENCIL_ATTACHMENT,
                t.TEXTURE_2D,
                a,
                0
              );
        }
      })(r.__webglFramebuffer, e);
    } else if (s) {
      r.__webglDepthbuffer = [];
      for (let i = 0; i < 6; i++)
        if (
          (n.bindFramebuffer(t.FRAMEBUFFER, r.__webglFramebuffer[i]),
          void 0 === r.__webglDepthbuffer[i])
        )
          (r.__webglDepthbuffer[i] = t.createRenderbuffer()),
            D(r.__webglDepthbuffer[i], e, !1);
        else {
          const n = e.stencilBuffer
              ? t.DEPTH_STENCIL_ATTACHMENT
              : t.DEPTH_ATTACHMENT,
            s = r.__webglDepthbuffer[i];
          t.bindRenderbuffer(t.RENDERBUFFER, s),
            t.framebufferRenderbuffer(t.FRAMEBUFFER, n, t.RENDERBUFFER, s);
        }
    } else if (
      (n.bindFramebuffer(t.FRAMEBUFFER, r.__webglFramebuffer),
      void 0 === r.__webglDepthbuffer)
    )
      (r.__webglDepthbuffer = t.createRenderbuffer()),
        D(r.__webglDepthbuffer, e, !1);
    else {
      const n = e.stencilBuffer
          ? t.DEPTH_STENCIL_ATTACHMENT
          : t.DEPTH_ATTACHMENT,
        i = r.__webglDepthbuffer;
      t.bindRenderbuffer(t.RENDERBUFFER, i),
        t.framebufferRenderbuffer(t.FRAMEBUFFER, n, t.RENDERBUFFER, i);
    }
    n.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  const O = [],
    F = [];
  function B(t) {
    return Math.min(r.maxSamples, t.samples);
  }
  function z(t) {
    const n = i.get(t);
    return (
      t.samples > 0 &&
      !0 === e.has("WEBGL_multisampled_render_to_texture") &&
      !1 !== n.__useRenderToTexture
    );
  }
  function G(t, e) {
    const n = t.colorSpace,
      i = t.format,
      r = t.type;
    return (
      !0 === t.isCompressedTexture ||
        !0 === t.isVideoTexture ||
        (n !== Yt &&
          n !== jt &&
          (Re.getTransfer(n) === Zt
            ? (i === ct && r === J) ||
              console.warn(
                "THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."
              )
            : console.error(
                "THREE.WebGLTextures: Unsupported texture color space:",
                n
              ))),
      e
    );
  }
  function H(t) {
    return (
      "undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement
        ? ((c.width = t.naturalWidth || t.width),
          (c.height = t.naturalHeight || t.height))
        : "undefined" != typeof VideoFrame && t instanceof VideoFrame
        ? ((c.width = t.displayWidth), (c.height = t.displayHeight))
        : ((c.width = t.width), (c.height = t.height)),
      c
    );
  }
  (this.allocateTextureUnit = function () {
    const t = b;
    return (
      t >= r.maxTextures &&
        console.warn(
          "THREE.WebGLTextures: Trying to use " +
            t +
            " texture units while this GPU supports only " +
            r.maxTextures
        ),
      (b += 1),
      t
    );
  }),
    (this.resetTextureUnits = function () {
      b = 0;
    }),
    (this.setTexture2D = w),
    (this.setTexture2DArray = function (e, r) {
      const s = i.get(e);
      e.version > 0 && s.__version !== e.version
        ? I(s, e, r)
        : n.bindTexture(t.TEXTURE_2D_ARRAY, s.__webglTexture, t.TEXTURE0 + r);
    }),
    (this.setTexture3D = function (e, r) {
      const s = i.get(e);
      e.version > 0 && s.__version !== e.version
        ? I(s, e, r)
        : n.bindTexture(t.TEXTURE_3D, s.__webglTexture, t.TEXTURE0 + r);
    }),
    (this.setTextureCube = function (e, a) {
      const o = i.get(e);
      e.version > 0 && o.__version !== e.version
        ? (function (e, a, o) {
            if (6 !== a.image.length) return;
            const l = U(e, a),
              c = a.source;
            n.bindTexture(t.TEXTURE_CUBE_MAP, e.__webglTexture, t.TEXTURE0 + o);
            const h = i.get(c);
            if (c.version !== h.__version || !0 === l) {
              n.activeTexture(t.TEXTURE0 + o);
              const e = Re.getPrimaries(Re.workingColorSpace),
                i = a.colorSpace === jt ? null : Re.getPrimaries(a.colorSpace),
                u =
                  a.colorSpace === jt || e === i
                    ? t.NONE
                    : t.BROWSER_DEFAULT_WEBGL;
              t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, a.flipY),
                t.pixelStorei(
                  t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                  a.premultiplyAlpha
                ),
                t.pixelStorei(t.UNPACK_ALIGNMENT, a.unpackAlignment),
                t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, u);
              const d = a.isCompressedTexture || a.image[0].isCompressedTexture,
                p = a.image[0] && a.image[0].isDataTexture,
                f = [];
              for (let t = 0; t < 6; t++)
                (f[t] =
                  d || p
                    ? p
                      ? a.image[t].image
                      : a.image[t]
                    : m(a.image[t], !0, r.maxCubemapSize)),
                  (f[t] = G(a, f[t]));
              const v = f[0],
                S = s.convert(a.format, a.colorSpace),
                E = s.convert(a.type),
                T = x(a.internalFormat, S, E, a.colorSpace),
                y = !0 !== a.isVideoTexture,
                b = void 0 === h.__version || !0 === l,
                w = c.dataReady;
              let A,
                C = M(a, v);
              if ((P(t.TEXTURE_CUBE_MAP, a), d)) {
                y &&
                  b &&
                  n.texStorage2D(t.TEXTURE_CUBE_MAP, C, T, v.width, v.height);
                for (let e = 0; e < 6; e++) {
                  A = f[e].mipmaps;
                  for (let i = 0; i < A.length; i++) {
                    const r = A[i];
                    a.format !== ct
                      ? null !== S
                        ? y
                          ? w &&
                            n.compressedTexSubImage2D(
                              t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                              i,
                              0,
                              0,
                              r.width,
                              r.height,
                              S,
                              r.data
                            )
                          : n.compressedTexImage2D(
                              t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                              i,
                              T,
                              r.width,
                              r.height,
                              0,
                              r.data
                            )
                        : console.warn(
                            "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"
                          )
                      : y
                      ? w &&
                        n.texSubImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          i,
                          0,
                          0,
                          r.width,
                          r.height,
                          S,
                          E,
                          r.data
                        )
                      : n.texImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          i,
                          T,
                          r.width,
                          r.height,
                          0,
                          S,
                          E,
                          r.data
                        );
                  }
                }
              } else {
                if (((A = a.mipmaps), y && b)) {
                  A.length > 0 && C++;
                  const e = H(f[0]);
                  n.texStorage2D(t.TEXTURE_CUBE_MAP, C, T, e.width, e.height);
                }
                for (let e = 0; e < 6; e++)
                  if (p) {
                    y
                      ? w &&
                        n.texSubImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          0,
                          0,
                          0,
                          f[e].width,
                          f[e].height,
                          S,
                          E,
                          f[e].data
                        )
                      : n.texImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          0,
                          T,
                          f[e].width,
                          f[e].height,
                          0,
                          S,
                          E,
                          f[e].data
                        );
                    for (let i = 0; i < A.length; i++) {
                      const r = A[i].image[e].image;
                      y
                        ? w &&
                          n.texSubImage2D(
                            t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                            i + 1,
                            0,
                            0,
                            r.width,
                            r.height,
                            S,
                            E,
                            r.data
                          )
                        : n.texImage2D(
                            t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                            i + 1,
                            T,
                            r.width,
                            r.height,
                            0,
                            S,
                            E,
                            r.data
                          );
                    }
                  } else {
                    y
                      ? w &&
                        n.texSubImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          0,
                          0,
                          0,
                          S,
                          E,
                          f[e]
                        )
                      : n.texImage2D(
                          t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                          0,
                          T,
                          S,
                          E,
                          f[e]
                        );
                    for (let i = 0; i < A.length; i++) {
                      const r = A[i];
                      y
                        ? w &&
                          n.texSubImage2D(
                            t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                            i + 1,
                            0,
                            0,
                            S,
                            E,
                            r.image[e]
                          )
                        : n.texImage2D(
                            t.TEXTURE_CUBE_MAP_POSITIVE_X + e,
                            i + 1,
                            T,
                            S,
                            E,
                            r.image[e]
                          );
                    }
                  }
              }
              g(a) && _(t.TEXTURE_CUBE_MAP),
                (h.__version = c.version),
                a.onUpdate && a.onUpdate(a);
            }
            e.__version = a.version;
          })(o, e, a)
        : n.bindTexture(t.TEXTURE_CUBE_MAP, o.__webglTexture, t.TEXTURE0 + a);
    }),
    (this.rebindTextures = function (e, n, r) {
      const s = i.get(e);
      void 0 !== n &&
        L(
          s.__webglFramebuffer,
          e,
          e.texture,
          t.COLOR_ATTACHMENT0,
          t.TEXTURE_2D,
          0
        ),
        void 0 !== r && N(e);
    }),
    (this.setupRenderTarget = function (e) {
      const r = e.texture,
        o = i.get(e),
        l = i.get(r);
      e.addEventListener("dispose", T);
      const c = e.textures,
        h = !0 === e.isWebGLCubeRenderTarget,
        u = c.length > 1;
      if (
        (u ||
          (void 0 === l.__webglTexture &&
            (l.__webglTexture = t.createTexture()),
          (l.__version = r.version),
          a.memory.textures++),
        h)
      ) {
        o.__webglFramebuffer = [];
        for (let e = 0; e < 6; e++)
          if (r.mipmaps && r.mipmaps.length > 0) {
            o.__webglFramebuffer[e] = [];
            for (let n = 0; n < r.mipmaps.length; n++)
              o.__webglFramebuffer[e][n] = t.createFramebuffer();
          } else o.__webglFramebuffer[e] = t.createFramebuffer();
      } else {
        if (r.mipmaps && r.mipmaps.length > 0) {
          o.__webglFramebuffer = [];
          for (let e = 0; e < r.mipmaps.length; e++)
            o.__webglFramebuffer[e] = t.createFramebuffer();
        } else o.__webglFramebuffer = t.createFramebuffer();
        if (u)
          for (let e = 0, n = c.length; e < n; e++) {
            const n = i.get(c[e]);
            void 0 === n.__webglTexture &&
              ((n.__webglTexture = t.createTexture()), a.memory.textures++);
          }
        if (e.samples > 0 && !1 === z(e)) {
          (o.__webglMultisampledFramebuffer = t.createFramebuffer()),
            (o.__webglColorRenderbuffer = []),
            n.bindFramebuffer(t.FRAMEBUFFER, o.__webglMultisampledFramebuffer);
          for (let n = 0; n < c.length; n++) {
            const i = c[n];
            (o.__webglColorRenderbuffer[n] = t.createRenderbuffer()),
              t.bindRenderbuffer(t.RENDERBUFFER, o.__webglColorRenderbuffer[n]);
            const r = s.convert(i.format, i.colorSpace),
              a = s.convert(i.type),
              l = x(
                i.internalFormat,
                r,
                a,
                i.colorSpace,
                !0 === e.isXRRenderTarget
              ),
              h = B(e);
            t.renderbufferStorageMultisample(
              t.RENDERBUFFER,
              h,
              l,
              e.width,
              e.height
            ),
              t.framebufferRenderbuffer(
                t.FRAMEBUFFER,
                t.COLOR_ATTACHMENT0 + n,
                t.RENDERBUFFER,
                o.__webglColorRenderbuffer[n]
              );
          }
          t.bindRenderbuffer(t.RENDERBUFFER, null),
            e.depthBuffer &&
              ((o.__webglDepthRenderbuffer = t.createRenderbuffer()),
              D(o.__webglDepthRenderbuffer, e, !0)),
            n.bindFramebuffer(t.FRAMEBUFFER, null);
        }
      }
      if (h) {
        n.bindTexture(t.TEXTURE_CUBE_MAP, l.__webglTexture),
          P(t.TEXTURE_CUBE_MAP, r);
        for (let n = 0; n < 6; n++)
          if (r.mipmaps && r.mipmaps.length > 0)
            for (let i = 0; i < r.mipmaps.length; i++)
              L(
                o.__webglFramebuffer[n][i],
                e,
                r,
                t.COLOR_ATTACHMENT0,
                t.TEXTURE_CUBE_MAP_POSITIVE_X + n,
                i
              );
          else
            L(
              o.__webglFramebuffer[n],
              e,
              r,
              t.COLOR_ATTACHMENT0,
              t.TEXTURE_CUBE_MAP_POSITIVE_X + n,
              0
            );
        g(r) && _(t.TEXTURE_CUBE_MAP), n.unbindTexture();
      } else if (u) {
        for (let r = 0, s = c.length; r < s; r++) {
          const s = c[r],
            a = i.get(s);
          n.bindTexture(t.TEXTURE_2D, a.__webglTexture),
            P(t.TEXTURE_2D, s),
            L(
              o.__webglFramebuffer,
              e,
              s,
              t.COLOR_ATTACHMENT0 + r,
              t.TEXTURE_2D,
              0
            ),
            g(s) && _(t.TEXTURE_2D);
        }
        n.unbindTexture();
      } else {
        let i = t.TEXTURE_2D;
        if (
          ((e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) &&
            (i = e.isWebGL3DRenderTarget ? t.TEXTURE_3D : t.TEXTURE_2D_ARRAY),
          n.bindTexture(i, l.__webglTexture),
          P(i, r),
          r.mipmaps && r.mipmaps.length > 0)
        )
          for (let n = 0; n < r.mipmaps.length; n++)
            L(o.__webglFramebuffer[n], e, r, t.COLOR_ATTACHMENT0, i, n);
        else L(o.__webglFramebuffer, e, r, t.COLOR_ATTACHMENT0, i, 0);
        g(r) && _(i), n.unbindTexture();
      }
      e.depthBuffer && N(e);
    }),
    (this.updateRenderTargetMipmap = function (t) {
      const e = t.textures;
      for (let r = 0, s = e.length; r < s; r++) {
        const s = e[r];
        if (g(s)) {
          const e = v(t),
            r = i.get(s).__webglTexture;
          n.bindTexture(e, r), _(e), n.unbindTexture();
        }
      }
    }),
    (this.updateMultisampleRenderTarget = function (e) {
      if (e.samples > 0)
        if (!1 === z(e)) {
          const r = e.textures,
            s = e.width,
            a = e.height;
          let o = t.COLOR_BUFFER_BIT;
          const c = e.stencilBuffer
              ? t.DEPTH_STENCIL_ATTACHMENT
              : t.DEPTH_ATTACHMENT,
            h = i.get(e),
            u = r.length > 1;
          if (u)
            for (let e = 0; e < r.length; e++)
              n.bindFramebuffer(
                t.FRAMEBUFFER,
                h.__webglMultisampledFramebuffer
              ),
                t.framebufferRenderbuffer(
                  t.FRAMEBUFFER,
                  t.COLOR_ATTACHMENT0 + e,
                  t.RENDERBUFFER,
                  null
                ),
                n.bindFramebuffer(t.FRAMEBUFFER, h.__webglFramebuffer),
                t.framebufferTexture2D(
                  t.DRAW_FRAMEBUFFER,
                  t.COLOR_ATTACHMENT0 + e,
                  t.TEXTURE_2D,
                  null,
                  0
                );
          n.bindFramebuffer(
            t.READ_FRAMEBUFFER,
            h.__webglMultisampledFramebuffer
          ),
            n.bindFramebuffer(t.DRAW_FRAMEBUFFER, h.__webglFramebuffer);
          for (let n = 0; n < r.length; n++) {
            if (
              (e.resolveDepthBuffer &&
                (e.depthBuffer && (o |= t.DEPTH_BUFFER_BIT),
                e.stencilBuffer &&
                  e.resolveStencilBuffer &&
                  (o |= t.STENCIL_BUFFER_BIT)),
              u)
            ) {
              t.framebufferRenderbuffer(
                t.READ_FRAMEBUFFER,
                t.COLOR_ATTACHMENT0,
                t.RENDERBUFFER,
                h.__webglColorRenderbuffer[n]
              );
              const e = i.get(r[n]).__webglTexture;
              t.framebufferTexture2D(
                t.DRAW_FRAMEBUFFER,
                t.COLOR_ATTACHMENT0,
                t.TEXTURE_2D,
                e,
                0
              );
            }
            t.blitFramebuffer(0, 0, s, a, 0, 0, s, a, o, t.NEAREST),
              !0 === l &&
                ((O.length = 0),
                (F.length = 0),
                O.push(t.COLOR_ATTACHMENT0 + n),
                e.depthBuffer &&
                  !1 === e.resolveDepthBuffer &&
                  (O.push(c),
                  F.push(c),
                  t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, F)),
                t.invalidateFramebuffer(t.READ_FRAMEBUFFER, O));
          }
          if (
            (n.bindFramebuffer(t.READ_FRAMEBUFFER, null),
            n.bindFramebuffer(t.DRAW_FRAMEBUFFER, null),
            u)
          )
            for (let e = 0; e < r.length; e++) {
              n.bindFramebuffer(
                t.FRAMEBUFFER,
                h.__webglMultisampledFramebuffer
              ),
                t.framebufferRenderbuffer(
                  t.FRAMEBUFFER,
                  t.COLOR_ATTACHMENT0 + e,
                  t.RENDERBUFFER,
                  h.__webglColorRenderbuffer[e]
                );
              const s = i.get(r[e]).__webglTexture;
              n.bindFramebuffer(t.FRAMEBUFFER, h.__webglFramebuffer),
                t.framebufferTexture2D(
                  t.DRAW_FRAMEBUFFER,
                  t.COLOR_ATTACHMENT0 + e,
                  t.TEXTURE_2D,
                  s,
                  0
                );
            }
          n.bindFramebuffer(
            t.DRAW_FRAMEBUFFER,
            h.__webglMultisampledFramebuffer
          );
        } else if (e.depthBuffer && !1 === e.resolveDepthBuffer && l) {
          const n = e.stencilBuffer
            ? t.DEPTH_STENCIL_ATTACHMENT
            : t.DEPTH_ATTACHMENT;
          t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, [n]);
        }
    }),
    (this.setupDepthRenderbuffer = N),
    (this.setupFrameBufferTexture = L),
    (this.useMultisampledRTT = z);
}
function oo(t, e) {
  return {
    convert: function (n, i = "") {
      let r;
      const s = Re.getTransfer(i);
      if (n === J) return t.UNSIGNED_BYTE;
      if (n === st) return t.UNSIGNED_SHORT_4_4_4_4;
      if (n === at) return t.UNSIGNED_SHORT_5_5_5_1;
      if (n === lt) return t.UNSIGNED_INT_5_9_9_9_REV;
      if (n === $) return t.BYTE;
      if (n === Q) return t.SHORT;
      if (n === tt) return t.UNSIGNED_SHORT;
      if (n === et) return t.INT;
      if (n === nt) return t.UNSIGNED_INT;
      if (n === it) return t.FLOAT;
      if (n === rt) return t.HALF_FLOAT;
      if (1021 === n) return t.ALPHA;
      if (1022 === n) return t.RGB;
      if (n === ct) return t.RGBA;
      if (1024 === n) return t.LUMINANCE;
      if (1025 === n) return t.LUMINANCE_ALPHA;
      if (n === ht) return t.DEPTH_COMPONENT;
      if (n === ut) return t.DEPTH_STENCIL;
      if (1028 === n) return t.RED;
      if (n === dt) return t.RED_INTEGER;
      if (1030 === n) return t.RG;
      if (n === pt) return t.RG_INTEGER;
      if (n === ft) return t.RGBA_INTEGER;
      if (n === mt || n === gt || n === _t || n === vt)
        if (s === Zt) {
          if (((r = e.get("WEBGL_compressed_texture_s3tc_srgb")), null === r))
            return null;
          if (n === mt) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === gt) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === _t) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === vt) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else {
          if (((r = e.get("WEBGL_compressed_texture_s3tc")), null === r))
            return null;
          if (n === mt) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
          if (n === gt) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
          if (n === _t) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
          if (n === vt) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        }
      if (n === xt || n === St || n === Mt || n === Et) {
        if (((r = e.get("WEBGL_compressed_texture_pvrtc")), null === r))
          return null;
        if (n === xt) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === St) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Mt) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Et) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      }
      if (n === Tt || n === yt || n === bt) {
        if (((r = e.get("WEBGL_compressed_texture_etc")), null === r))
          return null;
        if (n === Tt || n === yt)
          return s === Zt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === bt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
            : r.COMPRESSED_RGBA8_ETC2_EAC;
      }
      if (
        n === wt ||
        n === At ||
        n === Ct ||
        n === Rt ||
        n === Pt ||
        n === Ut ||
        n === It ||
        n === Lt ||
        n === Dt ||
        n === Nt ||
        n === Ot ||
        n === Ft ||
        n === Bt ||
        n === zt
      ) {
        if (((r = e.get("WEBGL_compressed_texture_astc")), null === r))
          return null;
        if (n === wt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
            : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === At)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
            : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Ct)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
            : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === Rt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
            : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === Pt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
            : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === Ut)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
            : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === It)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
            : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === Lt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
            : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === Dt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
            : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === Nt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
            : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === Ot)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
            : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === Ft)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
            : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Bt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
            : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === zt)
          return s === Zt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
            : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      }
      if (n === Gt || n === Ht || n === kt) {
        if (((r = e.get("EXT_texture_compression_bptc")), null === r))
          return null;
        if (n === Gt)
          return s === Zt
            ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
            : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Ht) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === kt) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      }
      if (36283 === n || n === Vt || n === Wt || n === Xt) {
        if (((r = e.get("EXT_texture_compression_rgtc")), null === r))
          return null;
        if (n === Gt) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === Vt) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === Wt) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Xt) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      }
      return n === ot ? t.UNSIGNED_INT_24_8 : void 0 !== t[n] ? t[n] : null;
    },
  };
}
class lo {
  constructor() {
    (this.texture = null),
      (this.mesh = null),
      (this.depthNear = 0),
      (this.depthFar = 0);
  }
  init(t, e, n) {
    if (null === this.texture) {
      const i = new Be();
      (t.properties.get(i).__webglTexture = e.texture),
        (e.depthNear === n.depthNear && e.depthFar === n.depthFar) ||
          ((this.depthNear = e.depthNear), (this.depthFar = e.depthFar)),
        (this.texture = i);
    }
  }
  getMesh(t) {
    if (null !== this.texture && null === this.mesh) {
      const e = t.cameras[0].viewport,
        n = new $i({
          vertexShader:
            "\nvoid main() {\n\n\tgl_Position = vec4( position, 1.0 );\n\n}",
          fragmentShader:
            "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n\tvec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n\tif ( coord.x >= 1.0 ) {\n\n\t\tgl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n\t} else {\n\n\t\tgl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n\t}\n\n}",
          uniforms: {
            depthColor: {
              value: this.texture,
            },
            depthWidth: {
              value: e.z,
            },
            depthHeight: {
              value: e.w,
            },
          },
        });
      this.mesh = new Xi(new Sr(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    (this.texture = null), (this.mesh = null);
  }
  getDepthTexture() {
    return this.texture;
  }
}
class co extends ce {
  constructor(t, e) {
    super();
    const n = this;
    let i = null,
      r = 1,
      s = null,
      a = "local-floor",
      o = 1,
      l = null,
      c = null,
      h = null,
      u = null,
      d = null,
      p = null;
    const f = new lo(),
      m = e.getContextAttributes();
    let g = null,
      _ = null;
    const v = [],
      x = [],
      S = new ve();
    let M = null;
    const E = new ir();
    E.viewport = new ze();
    const T = new ir();
    T.viewport = new ze();
    const y = [E, T],
      b = new Pr();
    let w = null,
      A = null;
    function C(t) {
      const e = x.indexOf(t.inputSource);
      if (-1 === e) return;
      const n = v[e];
      void 0 !== n &&
        (n.update(t.inputSource, t.frame, l || s),
        n.dispatchEvent({
          type: t.type,
          data: t.inputSource,
        }));
    }
    function R() {
      i.removeEventListener("select", C),
        i.removeEventListener("selectstart", C),
        i.removeEventListener("selectend", C),
        i.removeEventListener("squeeze", C),
        i.removeEventListener("squeezestart", C),
        i.removeEventListener("squeezeend", C),
        i.removeEventListener("end", R),
        i.removeEventListener("inputsourceschange", P);
      for (let t = 0; t < v.length; t++) {
        const e = x[t];
        null !== e && ((x[t] = null), v[t].disconnect(e));
      }
      (w = null),
        (A = null),
        f.reset(),
        t.setRenderTarget(g),
        (d = null),
        (u = null),
        (h = null),
        (i = null),
        (_ = null),
        N.stop(),
        (n.isPresenting = !1),
        t.setPixelRatio(M),
        t.setSize(S.width, S.height, !1),
        n.dispatchEvent({
          type: "sessionend",
        });
    }
    function P(t) {
      for (let e = 0; e < t.removed.length; e++) {
        const n = t.removed[e],
          i = x.indexOf(n);
        i >= 0 && ((x[i] = null), v[i].disconnect(n));
      }
      for (let e = 0; e < t.added.length; e++) {
        const n = t.added[e];
        let i = x.indexOf(n);
        if (-1 === i) {
          for (let t = 0; t < v.length; t++) {
            if (t >= x.length) {
              x.push(n), (i = t);
              break;
            }
            if (null === x[t]) {
              (x[t] = n), (i = t);
              break;
            }
          }
          if (-1 === i) break;
        }
        const r = v[i];
        r && r.connect(n);
      }
    }
    (this.cameraAutoUpdate = !0),
      (this.enabled = !1),
      (this.isPresenting = !1),
      (this.getController = function (t) {
        let e = v[t];
        return (
          void 0 === e && ((e = new hr()), (v[t] = e)), e.getTargetRaySpace()
        );
      }),
      (this.getControllerGrip = function (t) {
        let e = v[t];
        return void 0 === e && ((e = new hr()), (v[t] = e)), e.getGripSpace();
      }),
      (this.getHand = function (t) {
        let e = v[t];
        return void 0 === e && ((e = new hr()), (v[t] = e)), e.getHandSpace();
      }),
      (this.setFramebufferScaleFactor = function (t) {
        (r = t),
          !0 === n.isPresenting &&
            console.warn(
              "THREE.WebXRManager: Cannot change framebuffer scale while presenting."
            );
      }),
      (this.setReferenceSpaceType = function (t) {
        (a = t),
          !0 === n.isPresenting &&
            console.warn(
              "THREE.WebXRManager: Cannot change reference space type while presenting."
            );
      }),
      (this.getReferenceSpace = function () {
        return l || s;
      }),
      (this.setReferenceSpace = function (t) {
        l = t;
      }),
      (this.getBaseLayer = function () {
        return null !== u ? u : d;
      }),
      (this.getBinding = function () {
        return h;
      }),
      (this.getFrame = function () {
        return p;
      }),
      (this.getSession = function () {
        return i;
      }),
      (this.setSession = async function (c) {
        if (((i = c), null !== i)) {
          (g = t.getRenderTarget()),
            i.addEventListener("select", C),
            i.addEventListener("selectstart", C),
            i.addEventListener("selectend", C),
            i.addEventListener("squeeze", C),
            i.addEventListener("squeezestart", C),
            i.addEventListener("squeezeend", C),
            i.addEventListener("end", R),
            i.addEventListener("inputsourceschange", P),
            !0 !== m.xrCompatible && (await e.makeXRCompatible()),
            (M = t.getPixelRatio()),
            t.getSize(S);
          if (
            "undefined" != typeof XRWebGLBinding &&
            "createProjectionLayer" in XRWebGLBinding.prototype
          ) {
            let n = null,
              s = null,
              a = null;
            m.depth &&
              ((a = m.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24),
              (n = m.stencil ? ut : ht),
              (s = m.stencil ? ot : nt));
            const o = {
              colorFormat: e.RGBA8,
              depthFormat: a,
              scaleFactor: r,
            };
            (h = new XRWebGLBinding(i, e)),
              (u = h.createProjectionLayer(o)),
              i.updateRenderState({
                layers: [u],
              }),
              t.setPixelRatio(1),
              t.setSize(u.textureWidth, u.textureHeight, !1),
              (_ = new He(u.textureWidth, u.textureHeight, {
                format: ct,
                type: J,
                depthTexture: new xr(
                  u.textureWidth,
                  u.textureHeight,
                  s,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  n
                ),
                stencilBuffer: m.stencil,
                colorSpace: t.outputColorSpace,
                samples: m.antialias ? 4 : 0,
                resolveDepthBuffer: !1 === u.ignoreDepthValues,
                resolveStencilBuffer: !1 === u.ignoreDepthValues,
              }));
          } else {
            const n = {
              antialias: m.antialias,
              alpha: !0,
              depth: m.depth,
              stencil: m.stencil,
              framebufferScaleFactor: r,
            };
            (d = new XRWebGLLayer(i, e, n)),
              i.updateRenderState({
                baseLayer: d,
              }),
              t.setPixelRatio(1),
              t.setSize(d.framebufferWidth, d.framebufferHeight, !1),
              (_ = new He(d.framebufferWidth, d.framebufferHeight, {
                format: ct,
                type: J,
                colorSpace: t.outputColorSpace,
                stencilBuffer: m.stencil,
                resolveDepthBuffer: !1 === d.ignoreDepthValues,
                resolveStencilBuffer: !1 === d.ignoreDepthValues,
              }));
          }
          (_.isXRRenderTarget = !0),
            this.setFoveation(o),
            (l = null),
            (s = await i.requestReferenceSpace(a)),
            N.setContext(i),
            N.start(),
            (n.isPresenting = !0),
            n.dispatchEvent({
              type: "sessionstart",
            });
        }
      }),
      (this.getEnvironmentBlendMode = function () {
        if (null !== i) return i.environmentBlendMode;
      }),
      (this.getDepthTexture = function () {
        return f.getDepthTexture();
      });
    const U = new Xe(),
      I = new Xe();
    function L(t, e) {
      null === e
        ? t.matrixWorld.copy(t.matrix)
        : t.matrixWorld.multiplyMatrices(e.matrixWorld, t.matrix),
        t.matrixWorldInverse.copy(t.matrixWorld).invert();
    }
    (this.updateCamera = function (t) {
      if (null === i) return;
      let e = t.near,
        n = t.far;
      null !== f.texture &&
        (f.depthNear > 0 && (e = f.depthNear),
        f.depthFar > 0 && (n = f.depthFar)),
        (b.near = T.near = E.near = e),
        (b.far = T.far = E.far = n),
        (w === b.near && A === b.far) ||
          (i.updateRenderState({
            depthNear: b.near,
            depthFar: b.far,
          }),
          (w = b.near),
          (A = b.far)),
        (E.layers.mask = 2 | t.layers.mask),
        (T.layers.mask = 4 | t.layers.mask),
        (b.layers.mask = E.layers.mask | T.layers.mask);
      const r = t.parent,
        s = b.cameras;
      L(b, r);
      for (let i = 0; i < s.length; i++) L(s[i], r);
      2 === s.length
        ? (function (t, e, n) {
            U.setFromMatrixPosition(e.matrixWorld),
              I.setFromMatrixPosition(n.matrixWorld);
            const i = U.distanceTo(I),
              r = e.projectionMatrix.elements,
              s = n.projectionMatrix.elements,
              a = r[14] / (r[10] - 1),
              o = r[14] / (r[10] + 1),
              l = (r[9] + 1) / r[5],
              c = (r[9] - 1) / r[5],
              h = (r[8] - 1) / r[0],
              u = (s[8] + 1) / s[0],
              d = a * h,
              p = a * u,
              f = i / (-h + u),
              m = f * -h;
            if (
              (e.matrixWorld.decompose(t.position, t.quaternion, t.scale),
              t.translateX(m),
              t.translateZ(f),
              t.matrixWorld.compose(t.position, t.quaternion, t.scale),
              t.matrixWorldInverse.copy(t.matrixWorld).invert(),
              -1 === r[10])
            )
              t.projectionMatrix.copy(e.projectionMatrix),
                t.projectionMatrixInverse.copy(e.projectionMatrixInverse);
            else {
              const e = a + f,
                n = o + f,
                r = d - m,
                s = p + (i - m),
                h = ((l * o) / n) * e,
                u = ((c * o) / n) * e;
              t.projectionMatrix.makePerspective(r, s, h, u, e, n),
                t.projectionMatrixInverse.copy(t.projectionMatrix).invert();
            }
          })(b, E, T)
        : b.projectionMatrix.copy(E.projectionMatrix),
        (function (t, e, n) {
          null === n
            ? t.matrix.copy(e.matrixWorld)
            : (t.matrix.copy(n.matrixWorld),
              t.matrix.invert(),
              t.matrix.multiply(e.matrixWorld));
          t.matrix.decompose(t.position, t.quaternion, t.scale),
            t.updateMatrixWorld(!0),
            t.projectionMatrix.copy(e.projectionMatrix),
            t.projectionMatrixInverse.copy(e.projectionMatrixInverse),
            t.isPerspectiveCamera &&
              ((t.fov = 2 * de * Math.atan(1 / t.projectionMatrix.elements[5])),
              (t.zoom = 1));
        })(t, b, r);
    }),
      (this.getCamera = function () {
        return b;
      }),
      (this.getFoveation = function () {
        if (null !== u || null !== d) return o;
      }),
      (this.setFoveation = function (t) {
        (o = t),
          null !== u && (u.fixedFoveation = t),
          null !== d && void 0 !== d.fixedFoveation && (d.fixedFoveation = t);
      }),
      (this.hasDepthSensing = function () {
        return null !== f.texture;
      }),
      (this.getDepthSensingMesh = function () {
        return f.getMesh(b);
      });
    let D = null;
    const N = new Ir();
    N.setAnimationLoop(function (e, r) {
      if (((c = r.getViewerPose(l || s)), (p = r), null !== c)) {
        const e = c.views;
        null !== d &&
          (t.setRenderTargetFramebuffer(_, d.framebuffer),
          t.setRenderTarget(_));
        let n = !1;
        e.length !== b.cameras.length && ((b.cameras.length = 0), (n = !0));
        for (let i = 0; i < e.length; i++) {
          const r = e[i];
          let s = null;
          if (null !== d) s = d.getViewport(r);
          else {
            const e = h.getViewSubImage(u, r);
            (s = e.viewport),
              0 === i &&
                (t.setRenderTargetTextures(
                  _,
                  e.colorTexture,
                  e.depthStencilTexture
                ),
                t.setRenderTarget(_));
          }
          let a = y[i];
          void 0 === a &&
            ((a = new ir()),
            a.layers.enable(i),
            (a.viewport = new ze()),
            (y[i] = a)),
            a.matrix.fromArray(r.transform.matrix),
            a.matrix.decompose(a.position, a.quaternion, a.scale),
            a.projectionMatrix.fromArray(r.projectionMatrix),
            a.projectionMatrixInverse.copy(a.projectionMatrix).invert(),
            a.viewport.set(s.x, s.y, s.width, s.height),
            0 === i &&
              (b.matrix.copy(a.matrix),
              b.matrix.decompose(b.position, b.quaternion, b.scale)),
            !0 === n && b.cameras.push(a);
        }
        const r = i.enabledFeatures;
        if (
          r &&
          r.includes("depth-sensing") &&
          "gpu-optimized" == i.depthUsage &&
          h
        ) {
          const n = h.getDepthInformation(e[0]);
          n && n.isValid && n.texture && f.init(t, n, i.renderState);
        }
      }
      for (let t = 0; t < v.length; t++) {
        const e = x[t],
          n = v[t];
        null !== e && void 0 !== n && n.update(e, r, l || s);
      }
      D && D(e, r),
        r.detectedPlanes &&
          n.dispatchEvent({
            type: "planesdetected",
            data: r,
          }),
        (p = null);
    }),
      (this.setAnimationLoop = function (t) {
        D = t;
      }),
      (this.dispose = function () {});
  }
}
const ho = new In(),
  uo = new En();
function po(t, e) {
  function n(t, e) {
    !0 === t.matrixAutoUpdate && t.updateMatrix(), e.value.copy(t.matrix);
  }
  function i(t, i) {
    (t.opacity.value = i.opacity),
      i.color && t.diffuse.value.copy(i.color),
      i.emissive &&
        t.emissive.value.copy(i.emissive).multiplyScalar(i.emissiveIntensity),
      i.map && ((t.map.value = i.map), n(i.map, t.mapTransform)),
      i.alphaMap &&
        ((t.alphaMap.value = i.alphaMap), n(i.alphaMap, t.alphaMapTransform)),
      i.bumpMap &&
        ((t.bumpMap.value = i.bumpMap),
        n(i.bumpMap, t.bumpMapTransform),
        (t.bumpScale.value = i.bumpScale),
        1 === i.side && (t.bumpScale.value *= -1)),
      i.normalMap &&
        ((t.normalMap.value = i.normalMap),
        n(i.normalMap, t.normalMapTransform),
        t.normalScale.value.copy(i.normalScale),
        1 === i.side && t.normalScale.value.negate()),
      i.displacementMap &&
        ((t.displacementMap.value = i.displacementMap),
        n(i.displacementMap, t.displacementMapTransform),
        (t.displacementScale.value = i.displacementScale),
        (t.displacementBias.value = i.displacementBias)),
      i.emissiveMap &&
        ((t.emissiveMap.value = i.emissiveMap),
        n(i.emissiveMap, t.emissiveMapTransform)),
      i.specularMap &&
        ((t.specularMap.value = i.specularMap),
        n(i.specularMap, t.specularMapTransform)),
      i.alphaTest > 0 && (t.alphaTest.value = i.alphaTest);
    const r = e.get(i),
      s = r.envMap,
      a = r.envMapRotation;
    s &&
      ((t.envMap.value = s),
      ho.copy(a),
      (ho.x *= -1),
      (ho.y *= -1),
      (ho.z *= -1),
      s.isCubeTexture &&
        !1 === s.isRenderTargetTexture &&
        ((ho.y *= -1), (ho.z *= -1)),
      t.envMapRotation.value.setFromMatrix4(uo.makeRotationFromEuler(ho)),
      (t.flipEnvMap.value =
        s.isCubeTexture && !1 === s.isRenderTargetTexture ? -1 : 1),
      (t.reflectivity.value = i.reflectivity),
      (t.ior.value = i.ior),
      (t.refractionRatio.value = i.refractionRatio)),
      i.lightMap &&
        ((t.lightMap.value = i.lightMap),
        (t.lightMapIntensity.value = i.lightMapIntensity),
        n(i.lightMap, t.lightMapTransform)),
      i.aoMap &&
        ((t.aoMap.value = i.aoMap),
        (t.aoMapIntensity.value = i.aoMapIntensity),
        n(i.aoMap, t.aoMapTransform));
  }
  return {
    refreshFogUniforms: function (e, n) {
      n.color.getRGB(e.fogColor.value, Zi(t)),
        n.isFog
          ? ((e.fogNear.value = n.near), (e.fogFar.value = n.far))
          : n.isFogExp2 && (e.fogDensity.value = n.density);
    },
    refreshMaterialUniforms: function (t, r, s, a, o) {
      r.isMeshBasicMaterial || r.isMeshLambertMaterial
        ? i(t, r)
        : r.isMeshToonMaterial
        ? (i(t, r),
          (function (t, e) {
            e.gradientMap && (t.gradientMap.value = e.gradientMap);
          })(t, r))
        : r.isMeshPhongMaterial
        ? (i(t, r),
          (function (t, e) {
            t.specular.value.copy(e.specular),
              (t.shininess.value = Math.max(e.shininess, 1e-4));
          })(t, r))
        : r.isMeshStandardMaterial
        ? (i(t, r),
          (function (t, e) {
            (t.metalness.value = e.metalness),
              e.metalnessMap &&
                ((t.metalnessMap.value = e.metalnessMap),
                n(e.metalnessMap, t.metalnessMapTransform));
            (t.roughness.value = e.roughness),
              e.roughnessMap &&
                ((t.roughnessMap.value = e.roughnessMap),
                n(e.roughnessMap, t.roughnessMapTransform));
            e.envMap && (t.envMapIntensity.value = e.envMapIntensity);
          })(t, r),
          r.isMeshPhysicalMaterial &&
            (function (t, e, i) {
              (t.ior.value = e.ior),
                e.sheen > 0 &&
                  (t.sheenColor.value
                    .copy(e.sheenColor)
                    .multiplyScalar(e.sheen),
                  (t.sheenRoughness.value = e.sheenRoughness),
                  e.sheenColorMap &&
                    ((t.sheenColorMap.value = e.sheenColorMap),
                    n(e.sheenColorMap, t.sheenColorMapTransform)),
                  e.sheenRoughnessMap &&
                    ((t.sheenRoughnessMap.value = e.sheenRoughnessMap),
                    n(e.sheenRoughnessMap, t.sheenRoughnessMapTransform)));
              e.clearcoat > 0 &&
                ((t.clearcoat.value = e.clearcoat),
                (t.clearcoatRoughness.value = e.clearcoatRoughness),
                e.clearcoatMap &&
                  ((t.clearcoatMap.value = e.clearcoatMap),
                  n(e.clearcoatMap, t.clearcoatMapTransform)),
                e.clearcoatRoughnessMap &&
                  ((t.clearcoatRoughnessMap.value = e.clearcoatRoughnessMap),
                  n(e.clearcoatRoughnessMap, t.clearcoatRoughnessMapTransform)),
                e.clearcoatNormalMap &&
                  ((t.clearcoatNormalMap.value = e.clearcoatNormalMap),
                  n(e.clearcoatNormalMap, t.clearcoatNormalMapTransform),
                  t.clearcoatNormalScale.value.copy(e.clearcoatNormalScale),
                  1 === e.side && t.clearcoatNormalScale.value.negate()));
              e.dispersion > 0 && (t.dispersion.value = e.dispersion);
              e.iridescence > 0 &&
                ((t.iridescence.value = e.iridescence),
                (t.iridescenceIOR.value = e.iridescenceIOR),
                (t.iridescenceThicknessMinimum.value =
                  e.iridescenceThicknessRange[0]),
                (t.iridescenceThicknessMaximum.value =
                  e.iridescenceThicknessRange[1]),
                e.iridescenceMap &&
                  ((t.iridescenceMap.value = e.iridescenceMap),
                  n(e.iridescenceMap, t.iridescenceMapTransform)),
                e.iridescenceThicknessMap &&
                  ((t.iridescenceThicknessMap.value =
                    e.iridescenceThicknessMap),
                  n(
                    e.iridescenceThicknessMap,
                    t.iridescenceThicknessMapTransform
                  )));
              e.transmission > 0 &&
                ((t.transmission.value = e.transmission),
                (t.transmissionSamplerMap.value = i.texture),
                t.transmissionSamplerSize.value.set(i.width, i.height),
                e.transmissionMap &&
                  ((t.transmissionMap.value = e.transmissionMap),
                  n(e.transmissionMap, t.transmissionMapTransform)),
                (t.thickness.value = e.thickness),
                e.thicknessMap &&
                  ((t.thicknessMap.value = e.thicknessMap),
                  n(e.thicknessMap, t.thicknessMapTransform)),
                (t.attenuationDistance.value = e.attenuationDistance),
                t.attenuationColor.value.copy(e.attenuationColor));
              e.anisotropy > 0 &&
                (t.anisotropyVector.value.set(
                  e.anisotropy * Math.cos(e.anisotropyRotation),
                  e.anisotropy * Math.sin(e.anisotropyRotation)
                ),
                e.anisotropyMap &&
                  ((t.anisotropyMap.value = e.anisotropyMap),
                  n(e.anisotropyMap, t.anisotropyMapTransform)));
              (t.specularIntensity.value = e.specularIntensity),
                t.specularColor.value.copy(e.specularColor),
                e.specularColorMap &&
                  ((t.specularColorMap.value = e.specularColorMap),
                  n(e.specularColorMap, t.specularColorMapTransform));
              e.specularIntensityMap &&
                ((t.specularIntensityMap.value = e.specularIntensityMap),
                n(e.specularIntensityMap, t.specularIntensityMapTransform));
            })(t, r, o))
        : r.isMeshMatcapMaterial
        ? (i(t, r),
          (function (t, e) {
            e.matcap && (t.matcap.value = e.matcap);
          })(t, r))
        : r.isMeshDepthMaterial
        ? i(t, r)
        : r.isMeshDistanceMaterial
        ? (i(t, r),
          (function (t, n) {
            const i = e.get(n).light;
            t.referencePosition.value.setFromMatrixPosition(i.matrixWorld),
              (t.nearDistance.value = i.shadow.camera.near),
              (t.farDistance.value = i.shadow.camera.far);
          })(t, r))
        : r.isMeshNormalMaterial
        ? i(t, r)
        : r.isLineBasicMaterial
        ? ((function (t, e) {
            t.diffuse.value.copy(e.color),
              (t.opacity.value = e.opacity),
              e.map && ((t.map.value = e.map), n(e.map, t.mapTransform));
          })(t, r),
          r.isLineDashedMaterial &&
            (function (t, e) {
              (t.dashSize.value = e.dashSize),
                (t.totalSize.value = e.dashSize + e.gapSize),
                (t.scale.value = e.scale);
            })(t, r))
        : r.isPointsMaterial
        ? (function (t, e, i, r) {
            t.diffuse.value.copy(e.color),
              (t.opacity.value = e.opacity),
              (t.size.value = e.size * i),
              (t.scale.value = 0.5 * r),
              e.map && ((t.map.value = e.map), n(e.map, t.uvTransform));
            e.alphaMap &&
              ((t.alphaMap.value = e.alphaMap),
              n(e.alphaMap, t.alphaMapTransform));
            e.alphaTest > 0 && (t.alphaTest.value = e.alphaTest);
          })(t, r, s, a)
        : r.isSpriteMaterial
        ? (function (t, e) {
            t.diffuse.value.copy(e.color),
              (t.opacity.value = e.opacity),
              (t.rotation.value = e.rotation),
              e.map && ((t.map.value = e.map), n(e.map, t.mapTransform));
            e.alphaMap &&
              ((t.alphaMap.value = e.alphaMap),
              n(e.alphaMap, t.alphaMapTransform));
            e.alphaTest > 0 && (t.alphaTest.value = e.alphaTest);
          })(t, r)
        : r.isShadowMaterial
        ? (t.color.value.copy(r.color), (t.opacity.value = r.opacity))
        : r.isShaderMaterial && (r.uniformsNeedUpdate = !1);
    },
  };
}
function fo(t, e, n, i) {
  let r = {},
    s = {},
    a = [];
  const o = t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(t, e, n, i) {
    const r = t.value,
      s = e + "_" + n;
    if (void 0 === i[s])
      return (
        (i[s] = "number" == typeof r || "boolean" == typeof r ? r : r.clone()),
        !0
      );
    {
      const t = i[s];
      if ("number" == typeof r || "boolean" == typeof r) {
        if (t !== r) return (i[s] = r), !0;
      } else if (!1 === t.equals(r)) return t.copy(r), !0;
    }
    return !1;
  }
  function c(t) {
    const e = {
      boundary: 0,
      storage: 0,
    };
    return (
      "number" == typeof t || "boolean" == typeof t
        ? ((e.boundary = 4), (e.storage = 4))
        : t.isVector2
        ? ((e.boundary = 8), (e.storage = 8))
        : t.isVector3 || t.isColor
        ? ((e.boundary = 16), (e.storage = 12))
        : t.isVector4
        ? ((e.boundary = 16), (e.storage = 16))
        : t.isMatrix3
        ? ((e.boundary = 48), (e.storage = 48))
        : t.isMatrix4
        ? ((e.boundary = 64), (e.storage = 64))
        : t.isTexture
        ? console.warn(
            "THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."
          )
        : console.warn(
            "THREE.WebGLRenderer: Unsupported uniform value type.",
            t
          ),
      e
    );
  }
  function h(e) {
    const n = e.target;
    n.removeEventListener("dispose", h);
    const i = a.indexOf(n.__bindingPointIndex);
    a.splice(i, 1), t.deleteBuffer(r[n.id]), delete r[n.id], delete s[n.id];
  }
  return {
    bind: function (t, e) {
      const n = e.program;
      i.uniformBlockBinding(t, n);
    },
    update: function (n, u) {
      let d = r[n.id];
      void 0 === d &&
        (!(function (t) {
          const e = t.uniforms;
          let n = 0;
          const i = 16;
          for (let s = 0, a = e.length; s < a; s++) {
            const t = Array.isArray(e[s]) ? e[s] : [e[s]];
            for (let e = 0, r = t.length; e < r; e++) {
              const r = t[e],
                s = Array.isArray(r.value) ? r.value : [r.value];
              for (let t = 0, e = s.length; t < e; t++) {
                const e = c(s[t]),
                  a = n % i,
                  o = a % e.boundary,
                  l = a + o;
                (n += o),
                  0 !== l && i - l < e.storage && (n += i - l),
                  (r.__data = new Float32Array(
                    e.storage / Float32Array.BYTES_PER_ELEMENT
                  )),
                  (r.__offset = n),
                  (n += e.storage);
              }
            }
          }
          const r = n % i;
          r > 0 && (n += i - r);
          (t.__size = n), (t.__cache = {});
        })(n),
        (d = (function (e) {
          const n = (function () {
            for (let t = 0; t < o; t++)
              if (-1 === a.indexOf(t)) return a.push(t), t;
            return (
              console.error(
                "THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."
              ),
              0
            );
          })();
          e.__bindingPointIndex = n;
          const i = t.createBuffer(),
            r = e.__size,
            s = e.usage;
          return (
            t.bindBuffer(t.UNIFORM_BUFFER, i),
            t.bufferData(t.UNIFORM_BUFFER, r, s),
            t.bindBuffer(t.UNIFORM_BUFFER, null),
            t.bindBufferBase(t.UNIFORM_BUFFER, n, i),
            i
          );
        })(n)),
        (r[n.id] = d),
        n.addEventListener("dispose", h));
      const p = u.program;
      i.updateUBOMapping(n, p);
      const f = e.render.frame;
      s[n.id] !== f &&
        (!(function (e) {
          const n = r[e.id],
            i = e.uniforms,
            s = e.__cache;
          t.bindBuffer(t.UNIFORM_BUFFER, n);
          for (let r = 0, a = i.length; r < a; r++) {
            const e = Array.isArray(i[r]) ? i[r] : [i[r]];
            for (let n = 0, i = e.length; n < i; n++) {
              const i = e[n];
              if (!0 === l(i, r, n, s)) {
                const e = i.__offset,
                  n = Array.isArray(i.value) ? i.value : [i.value];
                let r = 0;
                for (let s = 0; s < n.length; s++) {
                  const a = n[s],
                    o = c(a);
                  "number" == typeof a || "boolean" == typeof a
                    ? ((i.__data[0] = a),
                      t.bufferSubData(t.UNIFORM_BUFFER, e + r, i.__data))
                    : a.isMatrix3
                    ? ((i.__data[0] = a.elements[0]),
                      (i.__data[1] = a.elements[1]),
                      (i.__data[2] = a.elements[2]),
                      (i.__data[3] = 0),
                      (i.__data[4] = a.elements[3]),
                      (i.__data[5] = a.elements[4]),
                      (i.__data[6] = a.elements[5]),
                      (i.__data[7] = 0),
                      (i.__data[8] = a.elements[6]),
                      (i.__data[9] = a.elements[7]),
                      (i.__data[10] = a.elements[8]),
                      (i.__data[11] = 0))
                    : (a.toArray(i.__data, r),
                      (r += o.storage / Float32Array.BYTES_PER_ELEMENT));
                }
                t.bufferSubData(t.UNIFORM_BUFFER, e, i.__data);
              }
            }
          }
          t.bindBuffer(t.UNIFORM_BUFFER, null);
        })(n),
        (s[n.id] = f));
    },
    dispose: function () {
      for (const e in r) t.deleteBuffer(r[e]);
      (a = []), (r = {}), (s = {});
    },
  };
}
class mo {
  constructor(t = {}) {
    const {
      canvas: e = Te(),
      context: n = null,
      depth: i = !0,
      stencil: r = !1,
      alpha: s = !1,
      antialias: a = !1,
      premultipliedAlpha: o = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: u = !1,
      reverseDepthBuffer: d = !1,
    } = t;
    let p;
    if (((this.isWebGLRenderer = !0), null !== n)) {
      if (
        "undefined" != typeof WebGLRenderingContext &&
        n instanceof WebGLRenderingContext
      )
        throw new Error(
          "THREE.WebGLRenderer: WebGL 1 is not supported since r163."
        );
      p = n.getContextAttributes().alpha;
    } else p = s;
    const f = new Uint32Array(4),
      m = new Int32Array(4);
    let g = null,
      _ = null;
    const v = [],
      x = [];
    (this.domElement = e),
      (this.debug = {
        checkShaderErrors: !0,
        onShaderError: null,
      }),
      (this.autoClear = !0),
      (this.autoClearColor = !0),
      (this.autoClearDepth = !0),
      (this.autoClearStencil = !0),
      (this.sortObjects = !0),
      (this.clippingPlanes = []),
      (this.localClippingEnabled = !1),
      (this.toneMapping = 0),
      (this.toneMappingExposure = 1),
      (this.transmissionResolutionScale = 1);
    const S = this;
    let M = !1;
    this._outputColorSpace = qt;
    let E = 0,
      T = 0,
      y = null,
      b = -1,
      w = null;
    const A = new ze(),
      C = new ze();
    let R = null;
    const P = new fi(0);
    let U = 0,
      I = e.width,
      L = e.height,
      D = 1,
      N = null,
      O = null;
    const F = new ze(0, 0, I, L),
      B = new ze(0, 0, I, L);
    let z = !1;
    const G = new vr();
    let H = !1,
      k = !1;
    const V = new En(),
      W = new En(),
      X = new Xe(),
      j = new ze(),
      q = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: !0,
      };
    let Y = !1;
    function K() {
      return null === y ? D : 1;
    }
    let $,
      Q,
      et,
      it,
      lt,
      ct,
      ht,
      ut,
      mt,
      gt,
      _t,
      vt,
      xt,
      St,
      Mt,
      Et,
      Tt,
      yt,
      bt,
      wt,
      At,
      Ct,
      Rt,
      Pt,
      Ut = n;
    function It(t, n) {
      return e.getContext(t, n);
    }
    try {
      const t = {
        alpha: !0,
        depth: i,
        stencil: r,
        antialias: a,
        premultipliedAlpha: o,
        preserveDrawingBuffer: l,
        powerPreference: h,
        failIfMajorPerformanceCaveat: u,
      };
      if (
        ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${c}`),
        e.addEventListener("webglcontextlost", Nt, !1),
        e.addEventListener("webglcontextrestored", Ot, !1),
        e.addEventListener("webglcontextcreationerror", Ft, !1),
        null === Ut)
      ) {
        const e = "webgl2";
        if (((Ut = It(e, t)), null === Ut))
          throw It(e)
            ? new Error(
                "Error creating WebGL context with your selected attributes."
              )
            : new Error("Error creating WebGL context.");
      }
    } catch (ie) {
      throw (console.error("THREE.WebGLRenderer: " + ie.message), ie);
    }
    function Lt() {
      ($ = new us(Ut)),
        $.init(),
        (Ct = new oo(Ut, $)),
        (Q = new Vr(Ut, $, t, Ct)),
        (et = new so(Ut, $)),
        Q.reverseDepthBuffer && d && et.buffers.depth.setReversed(!0),
        (it = new fs(Ut)),
        (lt = new ja()),
        (ct = new ao(Ut, $, et, lt, Q, Ct, it)),
        (ht = new Xr(S)),
        (ut = new hs(S)),
        (mt = new Lr(Ut)),
        (Rt = new Hr(Ut, mt)),
        (gt = new ds(Ut, mt, it, Rt)),
        (_t = new gs(Ut, gt, mt, it)),
        (bt = new ms(Ut, Q, ct)),
        (Et = new Wr(lt)),
        (vt = new Xa(S, ht, ut, $, Q, Rt, Et)),
        (xt = new po(S, lt)),
        (St = new Za()),
        (Mt = new no($)),
        (yt = new Gr(S, ht, ut, et, _t, p, o)),
        (Tt = new io(S, _t, Q)),
        (Pt = new fo(Ut, it, Q, et)),
        (wt = new kr(Ut, $, it)),
        (At = new ps(Ut, $, it)),
        (it.programs = vt.programs),
        (S.capabilities = Q),
        (S.extensions = $),
        (S.properties = lt),
        (S.renderLists = St),
        (S.shadowMap = Tt),
        (S.state = et),
        (S.info = it);
    }
    Lt();
    const Dt = new co(S, Ut);
    function Nt(t) {
      t.preventDefault(),
        console.log("THREE.WebGLRenderer: Context Lost."),
        (M = !0);
    }
    function Ot() {
      console.log("THREE.WebGLRenderer: Context Restored."), (M = !1);
      const t = it.autoReset,
        e = Tt.enabled,
        n = Tt.autoUpdate,
        i = Tt.needsUpdate,
        r = Tt.type;
      Lt(),
        (it.autoReset = t),
        (Tt.enabled = e),
        (Tt.autoUpdate = n),
        (Tt.needsUpdate = i),
        (Tt.type = r);
    }
    function Ft(t) {
      console.error(
        "THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",
        t.statusMessage
      );
    }
    function Bt(t) {
      const e = t.target;
      e.removeEventListener("dispose", Bt),
        (function (t) {
          (function (t) {
            const e = lt.get(t).programs;
            void 0 !== e &&
              (e.forEach(function (t) {
                vt.releaseProgram(t);
              }),
              t.isShaderMaterial && vt.releaseShaderCache(t));
          })(t),
            lt.remove(t);
        })(e);
    }
    function zt(t, e, n) {
      !0 === t.transparent && 2 === t.side && !1 === t.forceSinglePass
        ? ((t.side = 1),
          (t.needsUpdate = !0),
          Jt(t, e, n),
          (t.side = 0),
          (t.needsUpdate = !0),
          Jt(t, e, n),
          (t.side = 2))
        : Jt(t, e, n);
    }
    (this.xr = Dt),
      (this.getContext = function () {
        return Ut;
      }),
      (this.getContextAttributes = function () {
        return Ut.getContextAttributes();
      }),
      (this.forceContextLoss = function () {
        const t = $.get("WEBGL_lose_context");
        t && t.loseContext();
      }),
      (this.forceContextRestore = function () {
        const t = $.get("WEBGL_lose_context");
        t && t.restoreContext();
      }),
      (this.getPixelRatio = function () {
        return D;
      }),
      (this.setPixelRatio = function (t) {
        void 0 !== t && ((D = t), this.setSize(I, L, !1));
      }),
      (this.getSize = function (t) {
        return t.set(I, L);
      }),
      (this.setSize = function (t, n, i = !0) {
        Dt.isPresenting
          ? console.warn(
              "THREE.WebGLRenderer: Can't change size while VR device is presenting."
            )
          : ((I = t),
            (L = n),
            (e.width = Math.floor(t * D)),
            (e.height = Math.floor(n * D)),
            !0 === i &&
              ((e.style.width = t + "px"), (e.style.height = n + "px")),
            this.setViewport(0, 0, t, n));
      }),
      (this.getDrawingBufferSize = function (t) {
        return t.set(I * D, L * D).floor();
      }),
      (this.setDrawingBufferSize = function (t, n, i) {
        (I = t),
          (L = n),
          (D = i),
          (e.width = Math.floor(t * i)),
          (e.height = Math.floor(n * i)),
          this.setViewport(0, 0, t, n);
      }),
      (this.getCurrentViewport = function (t) {
        return t.copy(A);
      }),
      (this.getViewport = function (t) {
        return t.copy(F);
      }),
      (this.setViewport = function (t, e, n, i) {
        t.isVector4 ? F.set(t.x, t.y, t.z, t.w) : F.set(t, e, n, i),
          et.viewport(A.copy(F).multiplyScalar(D).round());
      }),
      (this.getScissor = function (t) {
        return t.copy(B);
      }),
      (this.setScissor = function (t, e, n, i) {
        t.isVector4 ? B.set(t.x, t.y, t.z, t.w) : B.set(t, e, n, i),
          et.scissor(C.copy(B).multiplyScalar(D).round());
      }),
      (this.getScissorTest = function () {
        return z;
      }),
      (this.setScissorTest = function (t) {
        et.setScissorTest((z = t));
      }),
      (this.setOpaqueSort = function (t) {
        N = t;
      }),
      (this.setTransparentSort = function (t) {
        O = t;
      }),
      (this.getClearColor = function (t) {
        return t.copy(yt.getClearColor());
      }),
      (this.setClearColor = function () {
        yt.setClearColor(...arguments);
      }),
      (this.getClearAlpha = function () {
        return yt.getClearAlpha();
      }),
      (this.setClearAlpha = function () {
        yt.setClearAlpha(...arguments);
      }),
      (this.clear = function (t = !0, e = !0, n = !0) {
        let i = 0;
        if (t) {
          let t = !1;
          if (null !== y) {
            const e = y.texture.format;
            t = e === ft || e === pt || e === dt;
          }
          if (t) {
            const t = y.texture.type,
              e =
                t === J ||
                t === nt ||
                t === tt ||
                t === ot ||
                t === st ||
                t === at,
              n = yt.getClearColor(),
              i = yt.getClearAlpha(),
              r = n.r,
              s = n.g,
              a = n.b;
            e
              ? ((f[0] = r),
                (f[1] = s),
                (f[2] = a),
                (f[3] = i),
                Ut.clearBufferuiv(Ut.COLOR, 0, f))
              : ((m[0] = r),
                (m[1] = s),
                (m[2] = a),
                (m[3] = i),
                Ut.clearBufferiv(Ut.COLOR, 0, m));
          } else i |= Ut.COLOR_BUFFER_BIT;
        }
        e && (i |= Ut.DEPTH_BUFFER_BIT),
          n &&
            ((i |= Ut.STENCIL_BUFFER_BIT),
            this.state.buffers.stencil.setMask(4294967295)),
          Ut.clear(i);
      }),
      (this.clearColor = function () {
        this.clear(!0, !1, !1);
      }),
      (this.clearDepth = function () {
        this.clear(!1, !0, !1);
      }),
      (this.clearStencil = function () {
        this.clear(!1, !1, !0);
      }),
      (this.dispose = function () {
        e.removeEventListener("webglcontextlost", Nt, !1),
          e.removeEventListener("webglcontextrestored", Ot, !1),
          e.removeEventListener("webglcontextcreationerror", Ft, !1),
          yt.dispose(),
          St.dispose(),
          Mt.dispose(),
          lt.dispose(),
          ht.dispose(),
          ut.dispose(),
          _t.dispose(),
          Rt.dispose(),
          Pt.dispose(),
          vt.dispose(),
          Dt.dispose(),
          Dt.removeEventListener("sessionstart", Ht),
          Dt.removeEventListener("sessionend", kt),
          Vt.stop();
      }),
      (this.renderBufferDirect = function (t, e, n, i, r, s) {
        null === e && (e = q);
        const a = r.isMesh && r.matrixWorld.determinant() < 0,
          o = (function (t, e, n, i, r) {
            !0 !== e.isScene && (e = q);
            ct.resetTextureUnits();
            const s = e.fog,
              a = i.isMeshStandardMaterial ? e.environment : null,
              o =
                null === y
                  ? S.outputColorSpace
                  : !0 === y.isXRRenderTarget
                  ? y.texture.colorSpace
                  : Yt,
              l = (i.isMeshStandardMaterial ? ut : ht).get(i.envMap || a),
              c =
                !0 === i.vertexColors &&
                !!n.attributes.color &&
                4 === n.attributes.color.itemSize,
              h = !!n.attributes.tangent && (!!i.normalMap || i.anisotropy > 0),
              u = !!n.morphAttributes.position,
              d = !!n.morphAttributes.normal,
              p = !!n.morphAttributes.color;
            let f = 0;
            i.toneMapped &&
              ((null !== y && !0 !== y.isXRRenderTarget) ||
                (f = S.toneMapping));
            const m =
                n.morphAttributes.position ||
                n.morphAttributes.normal ||
                n.morphAttributes.color,
              g = void 0 !== m ? m.length : 0,
              v = lt.get(i),
              x = _.state.lights;
            if (!0 === H && (!0 === k || t !== w)) {
              const e = t === w && i.id === b;
              Et.setState(i, t, e);
            }
            let M = !1;
            i.version === v.__version
              ? (v.needsLights && v.lightsStateVersion !== x.state.version) ||
                v.outputColorSpace !== o ||
                (r.isBatchedMesh && !1 === v.batching)
                ? (M = !0)
                : r.isBatchedMesh || !0 !== v.batching
                ? (r.isBatchedMesh &&
                    !0 === v.batchingColor &&
                    null === r.colorTexture) ||
                  (r.isBatchedMesh &&
                    !1 === v.batchingColor &&
                    null !== r.colorTexture) ||
                  (r.isInstancedMesh && !1 === v.instancing)
                  ? (M = !0)
                  : r.isInstancedMesh || !0 !== v.instancing
                  ? r.isSkinnedMesh && !1 === v.skinning
                    ? (M = !0)
                    : r.isSkinnedMesh || !0 !== v.skinning
                    ? (r.isInstancedMesh &&
                        !0 === v.instancingColor &&
                        null === r.instanceColor) ||
                      (r.isInstancedMesh &&
                        !1 === v.instancingColor &&
                        null !== r.instanceColor) ||
                      (r.isInstancedMesh &&
                        !0 === v.instancingMorph &&
                        null === r.morphTexture) ||
                      (r.isInstancedMesh &&
                        !1 === v.instancingMorph &&
                        null !== r.morphTexture) ||
                      v.envMap !== l ||
                      (!0 === i.fog && v.fog !== s)
                      ? (M = !0)
                      : void 0 === v.numClippingPlanes ||
                        (v.numClippingPlanes === Et.numPlanes &&
                          v.numIntersection === Et.numIntersection)
                      ? (v.vertexAlphas !== c ||
                          v.vertexTangents !== h ||
                          v.morphTargets !== u ||
                          v.morphNormals !== d ||
                          v.morphColors !== p ||
                          v.toneMapping !== f ||
                          v.morphTargetsCount !== g) &&
                        (M = !0)
                      : (M = !0)
                    : (M = !0)
                  : (M = !0)
                : (M = !0)
              : ((M = !0), (v.__version = i.version));
            let E = v.currentProgram;
            !0 === M && (E = Jt(i, e, r));
            let T = !1,
              A = !1,
              C = !1;
            const R = E.getUniforms(),
              P = v.uniforms;
            et.useProgram(E.program) && ((T = !0), (A = !0), (C = !0));
            i.id !== b && ((b = i.id), (A = !0));
            if (T || w !== t) {
              et.buffers.depth.getReversed()
                ? (V.copy(t.projectionMatrix),
                  (function (t) {
                    const e = t.elements;
                    (e[2] = 0.5 * e[2] + 0.5 * e[3]),
                      (e[6] = 0.5 * e[6] + 0.5 * e[7]),
                      (e[10] = 0.5 * e[10] + 0.5 * e[11]),
                      (e[14] = 0.5 * e[14] + 0.5 * e[15]);
                  })(V),
                  (function (t) {
                    const e = t.elements;
                    -1 === e[11]
                      ? ((e[10] = -e[10] - 1), (e[14] = -e[14]))
                      : ((e[10] = -e[10]), (e[14] = 1 - e[14]));
                  })(V),
                  R.setValue(Ut, "projectionMatrix", V))
                : R.setValue(Ut, "projectionMatrix", t.projectionMatrix),
                R.setValue(Ut, "viewMatrix", t.matrixWorldInverse);
              const e = R.map.cameraPosition;
              void 0 !== e &&
                e.setValue(Ut, X.setFromMatrixPosition(t.matrixWorld)),
                Q.logarithmicDepthBuffer &&
                  R.setValue(
                    Ut,
                    "logDepthBufFC",
                    2 / (Math.log(t.far + 1) / Math.LN2)
                  ),
                (i.isMeshPhongMaterial ||
                  i.isMeshToonMaterial ||
                  i.isMeshLambertMaterial ||
                  i.isMeshBasicMaterial ||
                  i.isMeshStandardMaterial ||
                  i.isShaderMaterial) &&
                  R.setValue(
                    Ut,
                    "isOrthographic",
                    !0 === t.isOrthographicCamera
                  ),
                w !== t && ((w = t), (A = !0), (C = !0));
            }
            if (r.isSkinnedMesh) {
              R.setOptional(Ut, r, "bindMatrix"),
                R.setOptional(Ut, r, "bindMatrixInverse");
              const t = r.skeleton;
              t &&
                (null === t.boneTexture && t.computeBoneTexture(),
                R.setValue(Ut, "boneTexture", t.boneTexture, ct));
            }
            r.isBatchedMesh &&
              (R.setOptional(Ut, r, "batchingTexture"),
              R.setValue(Ut, "batchingTexture", r._matricesTexture, ct),
              R.setOptional(Ut, r, "batchingIdTexture"),
              R.setValue(Ut, "batchingIdTexture", r._indirectTexture, ct),
              R.setOptional(Ut, r, "batchingColorTexture"),
              null !== r._colorsTexture &&
                R.setValue(Ut, "batchingColorTexture", r._colorsTexture, ct));
            const U = n.morphAttributes;
            (void 0 === U.position &&
              void 0 === U.normal &&
              void 0 === U.color) ||
              bt.update(r, n, E);
            (A || v.receiveShadow !== r.receiveShadow) &&
              ((v.receiveShadow = r.receiveShadow),
              R.setValue(Ut, "receiveShadow", r.receiveShadow));
            i.isMeshGouraudMaterial &&
              null !== i.envMap &&
              ((P.envMap.value = l),
              (P.flipEnvMap.value =
                l.isCubeTexture && !1 === l.isRenderTargetTexture ? -1 : 1));
            i.isMeshStandardMaterial &&
              null === i.envMap &&
              null !== e.environment &&
              (P.envMapIntensity.value = e.environmentIntensity);
            A &&
              (R.setValue(Ut, "toneMappingExposure", S.toneMappingExposure),
              v.needsLights &&
                ((N = C),
                ((I = P).ambientLightColor.needsUpdate = N),
                (I.lightProbe.needsUpdate = N),
                (I.directionalLights.needsUpdate = N),
                (I.directionalLightShadows.needsUpdate = N),
                (I.pointLights.needsUpdate = N),
                (I.pointLightShadows.needsUpdate = N),
                (I.spotLights.needsUpdate = N),
                (I.spotLightShadows.needsUpdate = N),
                (I.rectAreaLights.needsUpdate = N),
                (I.hemisphereLights.needsUpdate = N)),
              s && !0 === i.fog && xt.refreshFogUniforms(P, s),
              xt.refreshMaterialUniforms(
                P,
                i,
                D,
                L,
                _.state.transmissionRenderTarget[t.id]
              ),
              Ma.upload(Ut, $t(v), P, ct));
            var I, N;
            i.isShaderMaterial &&
              !0 === i.uniformsNeedUpdate &&
              (Ma.upload(Ut, $t(v), P, ct), (i.uniformsNeedUpdate = !1));
            i.isSpriteMaterial && R.setValue(Ut, "center", r.center);
            if (
              (R.setValue(Ut, "modelViewMatrix", r.modelViewMatrix),
              R.setValue(Ut, "normalMatrix", r.normalMatrix),
              R.setValue(Ut, "modelMatrix", r.matrixWorld),
              i.isShaderMaterial || i.isRawShaderMaterial)
            ) {
              const t = i.uniformsGroups;
              for (let e = 0, n = t.length; e < n; e++) {
                const n = t[e];
                Pt.update(n, E), Pt.bind(n, E);
              }
            }
            return E;
          })(t, e, n, i, r);
        et.setMaterial(i, a);
        let l = n.index,
          c = 1;
        if (!0 === i.wireframe) {
          if (((l = gt.getWireframeAttribute(n)), void 0 === l)) return;
          c = 2;
        }
        const h = n.drawRange,
          u = n.attributes.position;
        let d = h.start * c,
          p = (h.start + h.count) * c;
        null !== s &&
          ((d = Math.max(d, s.start * c)),
          (p = Math.min(p, (s.start + s.count) * c))),
          null !== l
            ? ((d = Math.max(d, 0)), (p = Math.min(p, l.count)))
            : null != u && ((d = Math.max(d, 0)), (p = Math.min(p, u.count)));
        const f = p - d;
        if (f < 0 || f === 1 / 0) return;
        let m;
        Rt.setup(r, i, o, n, l);
        let g = wt;
        if (
          (null !== l && ((m = mt.get(l)), (g = At), g.setIndex(m)), r.isMesh)
        )
          !0 === i.wireframe
            ? (et.setLineWidth(i.wireframeLinewidth * K()), g.setMode(Ut.LINES))
            : g.setMode(Ut.TRIANGLES);
        else if (r.isLine) {
          let t = i.linewidth;
          void 0 === t && (t = 1),
            et.setLineWidth(t * K()),
            r.isLineSegments
              ? g.setMode(Ut.LINES)
              : r.isLineLoop
              ? g.setMode(Ut.LINE_LOOP)
              : g.setMode(Ut.LINE_STRIP);
        } else
          r.isPoints
            ? g.setMode(Ut.POINTS)
            : r.isSprite && g.setMode(Ut.TRIANGLES);
        if (r.isBatchedMesh)
          if (null !== r._multiDrawInstances)
            be(
              "THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."
            ),
              g.renderMultiDrawInstances(
                r._multiDrawStarts,
                r._multiDrawCounts,
                r._multiDrawCount,
                r._multiDrawInstances
              );
          else if ($.get("WEBGL_multi_draw"))
            g.renderMultiDraw(
              r._multiDrawStarts,
              r._multiDrawCounts,
              r._multiDrawCount
            );
          else {
            const t = r._multiDrawStarts,
              e = r._multiDrawCounts,
              n = r._multiDrawCount,
              s = l ? mt.get(l).bytesPerElement : 1,
              a = lt.get(i).currentProgram.getUniforms();
            for (let i = 0; i < n; i++)
              a.setValue(Ut, "_gl_DrawID", i), g.render(t[i] / s, e[i]);
          }
        else if (r.isInstancedMesh) g.renderInstances(d, f, r.count);
        else if (n.isInstancedBufferGeometry) {
          const t =
              void 0 !== n._maxInstanceCount ? n._maxInstanceCount : 1 / 0,
            e = Math.min(n.instanceCount, t);
          g.renderInstances(d, f, e);
        } else g.render(d, f);
      }),
      (this.compile = function (t, e, n = null) {
        null === n && (n = t),
          (_ = Mt.get(n)),
          _.init(e),
          x.push(_),
          n.traverseVisible(function (t) {
            t.isLight &&
              t.layers.test(e.layers) &&
              (_.pushLight(t), t.castShadow && _.pushShadow(t));
          }),
          t !== n &&
            t.traverseVisible(function (t) {
              t.isLight &&
                t.layers.test(e.layers) &&
                (_.pushLight(t), t.castShadow && _.pushShadow(t));
            }),
          _.setupLights();
        const i = new Set();
        return (
          t.traverse(function (t) {
            if (!(t.isMesh || t.isPoints || t.isLine || t.isSprite)) return;
            const e = t.material;
            if (e)
              if (Array.isArray(e))
                for (let r = 0; r < e.length; r++) {
                  const s = e[r];
                  zt(s, n, t), i.add(s);
                }
              else zt(e, n, t), i.add(e);
          }),
          (_ = x.pop()),
          i
        );
      }),
      (this.compileAsync = function (t, e, n = null) {
        const i = this.compile(t, e, n);
        return new Promise((e) => {
          function n() {
            i.forEach(function (t) {
              lt.get(t).currentProgram.isReady() && i.delete(t);
            }),
              0 !== i.size ? setTimeout(n, 10) : e(t);
          }
          null !== $.get("KHR_parallel_shader_compile")
            ? n()
            : setTimeout(n, 10);
        });
      });
    let Gt = null;
    function Ht() {
      Vt.stop();
    }
    function kt() {
      Vt.start();
    }
    const Vt = new Ir();
    function Wt(t, e, n, i) {
      if (!1 === t.visible) return;
      if (t.layers.test(e.layers))
        if (t.isGroup) n = t.renderOrder;
        else if (t.isLOD) !0 === t.autoUpdate && t.update(e);
        else if (t.isLight) _.pushLight(t), t.castShadow && _.pushShadow(t);
        else if (t.isSprite) {
          if (!t.frustumCulled || G.intersectsSprite(t)) {
            i && j.setFromMatrixPosition(t.matrixWorld).applyMatrix4(W);
            const e = _t.update(t),
              r = t.material;
            r.visible && g.push(t, e, r, n, j.z, null);
          }
        } else if (
          (t.isMesh || t.isLine || t.isPoints) &&
          (!t.frustumCulled || G.intersectsObject(t))
        ) {
          const e = _t.update(t),
            r = t.material;
          if (
            (i &&
              (void 0 !== t.boundingSphere
                ? (null === t.boundingSphere && t.computeBoundingSphere(),
                  j.copy(t.boundingSphere.center))
                : (null === e.boundingSphere && e.computeBoundingSphere(),
                  j.copy(e.boundingSphere.center)),
              j.applyMatrix4(t.matrixWorld).applyMatrix4(W)),
            Array.isArray(r))
          ) {
            const i = e.groups;
            for (let s = 0, a = i.length; s < a; s++) {
              const a = i[s],
                o = r[a.materialIndex];
              o && o.visible && g.push(t, e, o, n, j.z, a);
            }
          } else r.visible && g.push(t, e, r, n, j.z, null);
        }
      const r = t.children;
      for (let s = 0, a = r.length; s < a; s++) Wt(r[s], e, n, i);
    }
    function Xt(t, e, n, i) {
      const r = t.opaque,
        s = t.transmissive,
        a = t.transparent;
      _.setupLightsView(n),
        !0 === H && Et.setGlobalState(S.clippingPlanes, n),
        i && et.viewport(A.copy(i)),
        r.length > 0 && Kt(r, e, n),
        s.length > 0 && Kt(s, e, n),
        a.length > 0 && Kt(a, e, n),
        et.buffers.depth.setTest(!0),
        et.buffers.depth.setMask(!0),
        et.buffers.color.setMask(!0),
        et.setPolygonOffset(!1);
    }
    function jt(t, e, n, i) {
      if (null !== (!0 === n.isScene ? n.overrideMaterial : null)) return;
      void 0 === _.state.transmissionRenderTarget[i.id] &&
        (_.state.transmissionRenderTarget[i.id] = new He(1, 1, {
          generateMipmaps: !0,
          type:
            $.has("EXT_color_buffer_half_float") ||
            $.has("EXT_color_buffer_float")
              ? rt
              : J,
          minFilter: Z,
          samples: 4,
          stencilBuffer: r,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: Re.workingColorSpace,
        }));
      const s = _.state.transmissionRenderTarget[i.id],
        a = i.viewport || A;
      s.setSize(
        a.z * S.transmissionResolutionScale,
        a.w * S.transmissionResolutionScale
      );
      const o = S.getRenderTarget();
      S.setRenderTarget(s),
        S.getClearColor(P),
        (U = S.getClearAlpha()),
        U < 1 && S.setClearColor(16777215, 0.5),
        S.clear(),
        Y && yt.render(n);
      const l = S.toneMapping;
      S.toneMapping = 0;
      const c = i.viewport;
      if (
        (void 0 !== i.viewport && (i.viewport = void 0),
        _.setupLightsView(i),
        !0 === H && Et.setGlobalState(S.clippingPlanes, i),
        Kt(t, n, i),
        ct.updateMultisampleRenderTarget(s),
        ct.updateRenderTargetMipmap(s),
        !1 === $.has("WEBGL_multisampled_render_to_texture"))
      ) {
        let t = !1;
        for (let r = 0, s = e.length; r < s; r++) {
          const s = e[r],
            a = s.object,
            o = s.geometry,
            l = s.material,
            c = s.group;
          if (2 === l.side && a.layers.test(i.layers)) {
            const e = l.side;
            (l.side = 1),
              (l.needsUpdate = !0),
              Zt(a, n, i, o, l, c),
              (l.side = e),
              (l.needsUpdate = !0),
              (t = !0);
          }
        }
        !0 === t &&
          (ct.updateMultisampleRenderTarget(s), ct.updateRenderTargetMipmap(s));
      }
      S.setRenderTarget(o),
        S.setClearColor(P, U),
        void 0 !== c && (i.viewport = c),
        (S.toneMapping = l);
    }
    function Kt(t, e, n) {
      const i = !0 === e.isScene ? e.overrideMaterial : null;
      for (let r = 0, s = t.length; r < s; r++) {
        const s = t[r],
          a = s.object,
          o = s.geometry,
          l = s.group;
        let c = s.material;
        !0 === c.allowOverride && null !== i && (c = i),
          a.layers.test(n.layers) && Zt(a, e, n, o, c, l);
      }
    }
    function Zt(t, e, n, i, r, s) {
      t.onBeforeRender(S, e, n, i, r, s),
        t.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, t.matrixWorld),
        t.normalMatrix.getNormalMatrix(t.modelViewMatrix),
        r.onBeforeRender(S, e, n, i, t, s),
        !0 === r.transparent && 2 === r.side && !1 === r.forceSinglePass
          ? ((r.side = 1),
            (r.needsUpdate = !0),
            S.renderBufferDirect(n, e, i, r, t, s),
            (r.side = 0),
            (r.needsUpdate = !0),
            S.renderBufferDirect(n, e, i, r, t, s),
            (r.side = 2))
          : S.renderBufferDirect(n, e, i, r, t, s),
        t.onAfterRender(S, e, n, i, r, s);
    }
    function Jt(t, e, n) {
      !0 !== e.isScene && (e = q);
      const i = lt.get(t),
        r = _.state.lights,
        s = _.state.shadowsArray,
        a = r.state.version,
        o = vt.getParameters(t, r.state, s, e, n),
        l = vt.getProgramCacheKey(o);
      let c = i.programs;
      (i.environment = t.isMeshStandardMaterial ? e.environment : null),
        (i.fog = e.fog),
        (i.envMap = (t.isMeshStandardMaterial ? ut : ht).get(
          t.envMap || i.environment
        )),
        (i.envMapRotation =
          null !== i.environment && null === t.envMap
            ? e.environmentRotation
            : t.envMapRotation),
        void 0 === c &&
          (t.addEventListener("dispose", Bt),
          (c = new Map()),
          (i.programs = c));
      let h = c.get(l);
      if (void 0 !== h) {
        if (i.currentProgram === h && i.lightsStateVersion === a)
          return Qt(t, o), h;
      } else
        (o.uniforms = vt.getUniforms(t)),
          t.onBeforeCompile(o, S),
          (h = vt.acquireProgram(o, l)),
          c.set(l, h),
          (i.uniforms = o.uniforms);
      const u = i.uniforms;
      return (
        ((t.isShaderMaterial || t.isRawShaderMaterial) && !0 !== t.clipping) ||
          (u.clippingPlanes = Et.uniform),
        Qt(t, o),
        (i.needsLights = (function (t) {
          return (
            t.isMeshLambertMaterial ||
            t.isMeshToonMaterial ||
            t.isMeshPhongMaterial ||
            t.isMeshStandardMaterial ||
            t.isShadowMaterial ||
            (t.isShaderMaterial && !0 === t.lights)
          );
        })(t)),
        (i.lightsStateVersion = a),
        i.needsLights &&
          ((u.ambientLightColor.value = r.state.ambient),
          (u.lightProbe.value = r.state.probe),
          (u.directionalLights.value = r.state.directional),
          (u.directionalLightShadows.value = r.state.directionalShadow),
          (u.spotLights.value = r.state.spot),
          (u.spotLightShadows.value = r.state.spotShadow),
          (u.rectAreaLights.value = r.state.rectArea),
          (u.ltc_1.value = r.state.rectAreaLTC1),
          (u.ltc_2.value = r.state.rectAreaLTC2),
          (u.pointLights.value = r.state.point),
          (u.pointLightShadows.value = r.state.pointShadow),
          (u.hemisphereLights.value = r.state.hemi),
          (u.directionalShadowMap.value = r.state.directionalShadowMap),
          (u.directionalShadowMatrix.value = r.state.directionalShadowMatrix),
          (u.spotShadowMap.value = r.state.spotShadowMap),
          (u.spotLightMatrix.value = r.state.spotLightMatrix),
          (u.spotLightMap.value = r.state.spotLightMap),
          (u.pointShadowMap.value = r.state.pointShadowMap),
          (u.pointShadowMatrix.value = r.state.pointShadowMatrix)),
        (i.currentProgram = h),
        (i.uniformsList = null),
        h
      );
    }
    function $t(t) {
      if (null === t.uniformsList) {
        const e = t.currentProgram.getUniforms();
        t.uniformsList = Ma.seqWithValue(e.seq, t.uniforms);
      }
      return t.uniformsList;
    }
    function Qt(t, e) {
      const n = lt.get(t);
      (n.outputColorSpace = e.outputColorSpace),
        (n.batching = e.batching),
        (n.batchingColor = e.batchingColor),
        (n.instancing = e.instancing),
        (n.instancingColor = e.instancingColor),
        (n.instancingMorph = e.instancingMorph),
        (n.skinning = e.skinning),
        (n.morphTargets = e.morphTargets),
        (n.morphNormals = e.morphNormals),
        (n.morphColors = e.morphColors),
        (n.morphTargetsCount = e.morphTargetsCount),
        (n.numClippingPlanes = e.numClippingPlanes),
        (n.numIntersection = e.numClipIntersection),
        (n.vertexAlphas = e.vertexAlphas),
        (n.vertexTangents = e.vertexTangents),
        (n.toneMapping = e.toneMapping);
    }
    Vt.setAnimationLoop(function (t) {
      Gt && Gt(t);
    }),
      "undefined" != typeof self && Vt.setContext(self),
      (this.setAnimationLoop = function (t) {
        (Gt = t), Dt.setAnimationLoop(t), null === t ? Vt.stop() : Vt.start();
      }),
      Dt.addEventListener("sessionstart", Ht),
      Dt.addEventListener("sessionend", kt),
      (this.render = function (t, e) {
        if (void 0 !== e && !0 !== e.isCamera)
          return void console.error(
            "THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera."
          );
        if (!0 === M) return;
        if (
          (!0 === t.matrixWorldAutoUpdate && t.updateMatrixWorld(),
          null === e.parent &&
            !0 === e.matrixWorldAutoUpdate &&
            e.updateMatrixWorld(),
          !0 === Dt.enabled &&
            !0 === Dt.isPresenting &&
            (!0 === Dt.cameraAutoUpdate && Dt.updateCamera(e),
            (e = Dt.getCamera())),
          !0 === t.isScene && t.onBeforeRender(S, t, e, y),
          (_ = Mt.get(t, x.length)),
          _.init(e),
          x.push(_),
          W.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
          G.setFromProjectionMatrix(W),
          (k = this.localClippingEnabled),
          (H = Et.init(this.clippingPlanes, k)),
          (g = St.get(t, v.length)),
          g.init(),
          v.push(g),
          !0 === Dt.enabled && !0 === Dt.isPresenting)
        ) {
          const t = S.xr.getDepthSensingMesh();
          null !== t && Wt(t, e, -1 / 0, S.sortObjects);
        }
        Wt(t, e, 0, S.sortObjects),
          g.finish(),
          !0 === S.sortObjects && g.sort(N, O),
          (Y =
            !1 === Dt.enabled ||
            !1 === Dt.isPresenting ||
            !1 === Dt.hasDepthSensing()),
          Y && yt.addToRenderList(g, t),
          this.info.render.frame++,
          !0 === H && Et.beginShadows();
        const n = _.state.shadowsArray;
        Tt.render(n, t, e),
          !0 === H && Et.endShadows(),
          !0 === this.info.autoReset && this.info.reset();
        const i = g.opaque,
          r = g.transmissive;
        if ((_.setupLights(), e.isArrayCamera)) {
          const n = e.cameras;
          if (r.length > 0)
            for (let e = 0, s = n.length; e < s; e++) {
              jt(i, r, t, n[e]);
            }
          Y && yt.render(t);
          for (let e = 0, i = n.length; e < i; e++) {
            const i = n[e];
            Xt(g, t, i, i.viewport);
          }
        } else r.length > 0 && jt(i, r, t, e), Y && yt.render(t), Xt(g, t, e);
        null !== y &&
          0 === T &&
          (ct.updateMultisampleRenderTarget(y), ct.updateRenderTargetMipmap(y)),
          !0 === t.isScene && t.onAfterRender(S, t, e),
          Rt.resetDefaultState(),
          (b = -1),
          (w = null),
          x.pop(),
          x.length > 0
            ? ((_ = x[x.length - 1]),
              !0 === H && Et.setGlobalState(S.clippingPlanes, _.state.camera))
            : (_ = null),
          v.pop(),
          (g = v.length > 0 ? v[v.length - 1] : null);
      }),
      (this.getActiveCubeFace = function () {
        return E;
      }),
      (this.getActiveMipmapLevel = function () {
        return T;
      }),
      (this.getRenderTarget = function () {
        return y;
      }),
      (this.setRenderTargetTextures = function (t, e, n) {
        const i = lt.get(t);
        (i.__autoAllocateDepthBuffer = !1 === t.resolveDepthBuffer),
          !1 === i.__autoAllocateDepthBuffer && (i.__useRenderToTexture = !1),
          (lt.get(t.texture).__webglTexture = e),
          (lt.get(t.depthTexture).__webglTexture = i.__autoAllocateDepthBuffer
            ? void 0
            : n),
          (i.__hasExternalTextures = !0);
      }),
      (this.setRenderTargetFramebuffer = function (t, e) {
        const n = lt.get(t);
        (n.__webglFramebuffer = e), (n.__useDefaultFramebuffer = void 0 === e);
      });
    const te = Ut.createFramebuffer();
    (this.setRenderTarget = function (t, e = 0, n = 0) {
      (y = t), (E = e), (T = n);
      let i = !0,
        r = null,
        s = !1,
        a = !1;
      if (t) {
        const o = lt.get(t);
        if (void 0 !== o.__useDefaultFramebuffer)
          et.bindFramebuffer(Ut.FRAMEBUFFER, null), (i = !1);
        else if (void 0 === o.__webglFramebuffer) ct.setupRenderTarget(t);
        else if (o.__hasExternalTextures)
          ct.rebindTextures(
            t,
            lt.get(t.texture).__webglTexture,
            lt.get(t.depthTexture).__webglTexture
          );
        else if (t.depthBuffer) {
          const e = t.depthTexture;
          if (o.__boundDepthTexture !== e) {
            if (
              null !== e &&
              lt.has(e) &&
              (t.width !== e.image.width || t.height !== e.image.height)
            )
              throw new Error(
                "WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size."
              );
            ct.setupDepthRenderbuffer(t);
          }
        }
        const l = t.texture;
        (l.isData3DTexture ||
          l.isDataArrayTexture ||
          l.isCompressedArrayTexture) &&
          (a = !0);
        const c = lt.get(t).__webglFramebuffer;
        t.isWebGLCubeRenderTarget
          ? ((r = Array.isArray(c[e]) ? c[e][n] : c[e]), (s = !0))
          : (r =
              t.samples > 0 && !1 === ct.useMultisampledRTT(t)
                ? lt.get(t).__webglMultisampledFramebuffer
                : Array.isArray(c)
                ? c[n]
                : c),
          A.copy(t.viewport),
          C.copy(t.scissor),
          (R = t.scissorTest);
      } else
        A.copy(F).multiplyScalar(D).floor(),
          C.copy(B).multiplyScalar(D).floor(),
          (R = z);
      0 !== n && (r = te);
      if (
        (et.bindFramebuffer(Ut.FRAMEBUFFER, r) && i && et.drawBuffers(t, r),
        et.viewport(A),
        et.scissor(C),
        et.setScissorTest(R),
        s)
      ) {
        const i = lt.get(t.texture);
        Ut.framebufferTexture2D(
          Ut.FRAMEBUFFER,
          Ut.COLOR_ATTACHMENT0,
          Ut.TEXTURE_CUBE_MAP_POSITIVE_X + e,
          i.__webglTexture,
          n
        );
      } else if (a) {
        const i = lt.get(t.texture),
          r = e;
        Ut.framebufferTextureLayer(
          Ut.FRAMEBUFFER,
          Ut.COLOR_ATTACHMENT0,
          i.__webglTexture,
          n,
          r
        );
      } else if (null !== t && 0 !== n) {
        const e = lt.get(t.texture);
        Ut.framebufferTexture2D(
          Ut.FRAMEBUFFER,
          Ut.COLOR_ATTACHMENT0,
          Ut.TEXTURE_2D,
          e.__webglTexture,
          n
        );
      }
      b = -1;
    }),
      (this.readRenderTargetPixels = function (t, e, n, i, r, s, a) {
        if (!t || !t.isWebGLRenderTarget)
          return void console.error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
          );
        let o = lt.get(t).__webglFramebuffer;
        if ((t.isWebGLCubeRenderTarget && void 0 !== a && (o = o[a]), o)) {
          et.bindFramebuffer(Ut.FRAMEBUFFER, o);
          try {
            const a = t.texture,
              o = a.format,
              l = a.type;
            if (!Q.textureFormatReadable(o))
              return void console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
              );
            if (!Q.textureTypeReadable(l))
              return void console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
              );
            e >= 0 &&
              e <= t.width - i &&
              n >= 0 &&
              n <= t.height - r &&
              Ut.readPixels(e, n, i, r, Ct.convert(o), Ct.convert(l), s);
          } finally {
            const t = null !== y ? lt.get(y).__webglFramebuffer : null;
            et.bindFramebuffer(Ut.FRAMEBUFFER, t);
          }
        }
      }),
      (this.readRenderTargetPixelsAsync = async function (t, e, n, i, r, s, a) {
        if (!t || !t.isWebGLRenderTarget)
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget."
          );
        let o = lt.get(t).__webglFramebuffer;
        if ((t.isWebGLCubeRenderTarget && void 0 !== a && (o = o[a]), o)) {
          if (e >= 0 && e <= t.width - i && n >= 0 && n <= t.height - r) {
            et.bindFramebuffer(Ut.FRAMEBUFFER, o);
            const a = t.texture,
              l = a.format,
              c = a.type;
            if (!Q.textureFormatReadable(l))
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format."
              );
            if (!Q.textureTypeReadable(c))
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type."
              );
            const h = Ut.createBuffer();
            Ut.bindBuffer(Ut.PIXEL_PACK_BUFFER, h),
              Ut.bufferData(Ut.PIXEL_PACK_BUFFER, s.byteLength, Ut.STREAM_READ),
              Ut.readPixels(e, n, i, r, Ct.convert(l), Ct.convert(c), 0);
            const u = null !== y ? lt.get(y).__webglFramebuffer : null;
            et.bindFramebuffer(Ut.FRAMEBUFFER, u);
            const d = Ut.fenceSync(Ut.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return (
              Ut.flush(),
              await (function (t, e, n) {
                return new Promise(function (i, r) {
                  setTimeout(function s() {
                    switch (t.clientWaitSync(e, t.SYNC_FLUSH_COMMANDS_BIT, 0)) {
                      case t.WAIT_FAILED:
                        r();
                        break;
                      case t.TIMEOUT_EXPIRED:
                        setTimeout(s, n);
                        break;
                      default:
                        i();
                    }
                  }, n);
                });
              })(Ut, d, 4),
              Ut.bindBuffer(Ut.PIXEL_PACK_BUFFER, h),
              Ut.getBufferSubData(Ut.PIXEL_PACK_BUFFER, 0, s),
              Ut.deleteBuffer(h),
              Ut.deleteSync(d),
              s
            );
          }
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range."
          );
        }
      }),
      (this.copyFramebufferToTexture = function (t, e = null, n = 0) {
        const i = Math.pow(2, -n),
          r = Math.floor(t.image.width * i),
          s = Math.floor(t.image.height * i),
          a = null !== e ? e.x : 0,
          o = null !== e ? e.y : 0;
        ct.setTexture2D(t, 0),
          Ut.copyTexSubImage2D(Ut.TEXTURE_2D, n, 0, 0, a, o, r, s),
          et.unbindTexture();
      });
    const ee = Ut.createFramebuffer(),
      ne = Ut.createFramebuffer();
    (this.copyTextureToTexture = function (
      t,
      e,
      n = null,
      i = null,
      r = 0,
      s = null
    ) {
      let a, o, l, c, h, u, d, p, f;
      null === s &&
        (0 !== r
          ? (be(
              "WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."
            ),
            (s = r),
            (r = 0))
          : (s = 0));
      const m = t.isCompressedTexture ? t.mipmaps[s] : t.image;
      if (null !== n)
        (a = n.max.x - n.min.x),
          (o = n.max.y - n.min.y),
          (l = n.isBox3 ? n.max.z - n.min.z : 1),
          (c = n.min.x),
          (h = n.min.y),
          (u = n.isBox3 ? n.min.z : 0);
      else {
        const e = Math.pow(2, -r);
        (a = Math.floor(m.width * e)),
          (o = Math.floor(m.height * e)),
          (l = t.isDataArrayTexture
            ? m.depth
            : t.isData3DTexture
            ? Math.floor(m.depth * e)
            : 1),
          (c = 0),
          (h = 0),
          (u = 0);
      }
      null !== i
        ? ((d = i.x), (p = i.y), (f = i.z))
        : ((d = 0), (p = 0), (f = 0));
      const g = Ct.convert(e.format),
        _ = Ct.convert(e.type);
      let v;
      e.isData3DTexture
        ? (ct.setTexture3D(e, 0), (v = Ut.TEXTURE_3D))
        : e.isDataArrayTexture || e.isCompressedArrayTexture
        ? (ct.setTexture2DArray(e, 0), (v = Ut.TEXTURE_2D_ARRAY))
        : (ct.setTexture2D(e, 0), (v = Ut.TEXTURE_2D)),
        Ut.pixelStorei(Ut.UNPACK_FLIP_Y_WEBGL, e.flipY),
        Ut.pixelStorei(Ut.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlpha),
        Ut.pixelStorei(Ut.UNPACK_ALIGNMENT, e.unpackAlignment);
      const x = Ut.getParameter(Ut.UNPACK_ROW_LENGTH),
        S = Ut.getParameter(Ut.UNPACK_IMAGE_HEIGHT),
        M = Ut.getParameter(Ut.UNPACK_SKIP_PIXELS),
        E = Ut.getParameter(Ut.UNPACK_SKIP_ROWS),
        T = Ut.getParameter(Ut.UNPACK_SKIP_IMAGES);
      Ut.pixelStorei(Ut.UNPACK_ROW_LENGTH, m.width),
        Ut.pixelStorei(Ut.UNPACK_IMAGE_HEIGHT, m.height),
        Ut.pixelStorei(Ut.UNPACK_SKIP_PIXELS, c),
        Ut.pixelStorei(Ut.UNPACK_SKIP_ROWS, h),
        Ut.pixelStorei(Ut.UNPACK_SKIP_IMAGES, u);
      const y = t.isDataArrayTexture || t.isData3DTexture,
        b = e.isDataArrayTexture || e.isData3DTexture;
      if (t.isDepthTexture) {
        const n = lt.get(t),
          i = lt.get(e),
          m = lt.get(n.__renderTarget),
          g = lt.get(i.__renderTarget);
        et.bindFramebuffer(Ut.READ_FRAMEBUFFER, m.__webglFramebuffer),
          et.bindFramebuffer(Ut.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
        for (let _ = 0; _ < l; _++)
          y &&
            (Ut.framebufferTextureLayer(
              Ut.READ_FRAMEBUFFER,
              Ut.COLOR_ATTACHMENT0,
              lt.get(t).__webglTexture,
              r,
              u + _
            ),
            Ut.framebufferTextureLayer(
              Ut.DRAW_FRAMEBUFFER,
              Ut.COLOR_ATTACHMENT0,
              lt.get(e).__webglTexture,
              s,
              f + _
            )),
            Ut.blitFramebuffer(
              c,
              h,
              a,
              o,
              d,
              p,
              a,
              o,
              Ut.DEPTH_BUFFER_BIT,
              Ut.NEAREST
            );
        et.bindFramebuffer(Ut.READ_FRAMEBUFFER, null),
          et.bindFramebuffer(Ut.DRAW_FRAMEBUFFER, null);
      } else if (0 !== r || t.isRenderTargetTexture || lt.has(t)) {
        const n = lt.get(t),
          i = lt.get(e);
        et.bindFramebuffer(Ut.READ_FRAMEBUFFER, ee),
          et.bindFramebuffer(Ut.DRAW_FRAMEBUFFER, ne);
        for (let t = 0; t < l; t++)
          y
            ? Ut.framebufferTextureLayer(
                Ut.READ_FRAMEBUFFER,
                Ut.COLOR_ATTACHMENT0,
                n.__webglTexture,
                r,
                u + t
              )
            : Ut.framebufferTexture2D(
                Ut.READ_FRAMEBUFFER,
                Ut.COLOR_ATTACHMENT0,
                Ut.TEXTURE_2D,
                n.__webglTexture,
                r
              ),
            b
              ? Ut.framebufferTextureLayer(
                  Ut.DRAW_FRAMEBUFFER,
                  Ut.COLOR_ATTACHMENT0,
                  i.__webglTexture,
                  s,
                  f + t
                )
              : Ut.framebufferTexture2D(
                  Ut.DRAW_FRAMEBUFFER,
                  Ut.COLOR_ATTACHMENT0,
                  Ut.TEXTURE_2D,
                  i.__webglTexture,
                  s
                ),
            0 !== r
              ? Ut.blitFramebuffer(
                  c,
                  h,
                  a,
                  o,
                  d,
                  p,
                  a,
                  o,
                  Ut.COLOR_BUFFER_BIT,
                  Ut.NEAREST
                )
              : b
              ? Ut.copyTexSubImage3D(v, s, d, p, f + t, c, h, a, o)
              : Ut.copyTexSubImage2D(v, s, d, p, c, h, a, o);
        et.bindFramebuffer(Ut.READ_FRAMEBUFFER, null),
          et.bindFramebuffer(Ut.DRAW_FRAMEBUFFER, null);
      } else
        b
          ? t.isDataTexture || t.isData3DTexture
            ? Ut.texSubImage3D(v, s, d, p, f, a, o, l, g, _, m.data)
            : e.isCompressedArrayTexture
            ? Ut.compressedTexSubImage3D(v, s, d, p, f, a, o, l, g, m.data)
            : Ut.texSubImage3D(v, s, d, p, f, a, o, l, g, _, m)
          : t.isDataTexture
          ? Ut.texSubImage2D(Ut.TEXTURE_2D, s, d, p, a, o, g, _, m.data)
          : t.isCompressedTexture
          ? Ut.compressedTexSubImage2D(
              Ut.TEXTURE_2D,
              s,
              d,
              p,
              m.width,
              m.height,
              g,
              m.data
            )
          : Ut.texSubImage2D(Ut.TEXTURE_2D, s, d, p, a, o, g, _, m);
      Ut.pixelStorei(Ut.UNPACK_ROW_LENGTH, x),
        Ut.pixelStorei(Ut.UNPACK_IMAGE_HEIGHT, S),
        Ut.pixelStorei(Ut.UNPACK_SKIP_PIXELS, M),
        Ut.pixelStorei(Ut.UNPACK_SKIP_ROWS, E),
        Ut.pixelStorei(Ut.UNPACK_SKIP_IMAGES, T),
        0 === s && e.generateMipmaps && Ut.generateMipmap(v),
        et.unbindTexture();
    }),
      (this.copyTextureToTexture3D = function (
        t,
        e,
        n = null,
        i = null,
        r = 0
      ) {
        return (
          be(
            'WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'
          ),
          this.copyTextureToTexture(t, e, n, i, r)
        );
      }),
      (this.initRenderTarget = function (t) {
        void 0 === lt.get(t).__webglFramebuffer && ct.setupRenderTarget(t);
      }),
      (this.initTexture = function (t) {
        t.isCubeTexture
          ? ct.setTextureCube(t, 0)
          : t.isData3DTexture
          ? ct.setTexture3D(t, 0)
          : t.isDataArrayTexture || t.isCompressedArrayTexture
          ? ct.setTexture2DArray(t, 0)
          : ct.setTexture2D(t, 0),
          et.unbindTexture();
      }),
      (this.resetState = function () {
        (E = 0), (T = 0), (y = null), et.reset(), Rt.reset();
      }),
      "undefined" != typeof __THREE_DEVTOOLS__ &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", {
            detail: this,
          })
        );
  }
  get coordinateSystem() {
    return oe;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    (e.drawingBufferColorSpace = Re._getDrawingBufferColorSpace(t)),
      (e.unpackColorSpace = Re._getUnpackColorSpace());
  }
}
const go = class t {
  constructor() {
    e(this, "_scene"),
      e(this, "_camera"),
      e(this, "_renderer"),
      e(this, "_width", 1080),
      e(this, "_height", 1920),
      e(this, "_aspect", 9 / 16),
      e(this, "_cameraPositionZ", 50),
      (this._scene = new ur()),
      (this._scene.background = new fi(0));
    const t = this._height,
      n = t * this._aspect;
    (this._camera = new Rr(-n / 2, n / 2, t / 2, -t / 2, 0.1, 1e3)),
      (this._camera.position.z = this._cameraPositionZ),
      (this._renderer = new mo({
        antialias: !0,
      })),
      (this._renderer.outputColorSpace = Yt),
      this._renderer.setPixelRatio(window.devicePixelRatio),
      this._renderer.setSize(window.innerWidth, window.innerHeight),
      document.body.appendChild(this._renderer.domElement),
      window.addEventListener("resize", this.onWindowResize.bind(this)),
      this.onWindowResize();
  }
  get scene() {
    return this._scene;
  }
  get renderer() {
    return this._renderer;
  }
  get camera() {
    return this._camera;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  static getInstance() {
    return this._instance || (this._instance = new t()), this._instance;
  }
  update() {
    this._renderer.render(this._scene, this._camera);
  }
  onWindowResize() {
    const t = window.innerWidth / window.innerHeight;
    let e = window.innerWidth,
      n = window.innerHeight;
    t > this._aspect ? (e = n * this._aspect) : (n = e / this._aspect),
      (this._width = e),
      (this._height = n),
      console.log(`width = ${this._width} - height = ${this._height}`),
      this._renderer.setSize(window.innerWidth, window.innerHeight),
      this._renderer.setViewport(
        (window.innerWidth - e) / 2,
        (window.innerHeight - n) / 2,
        e,
        n
      );
  }
  showBlackScene(t) {
    t
      ? (this._camera.position.z = -100)
      : setTimeout(() => {
          this._camera.position.z = this._cameraPositionZ;
        }, 200);
  }
};
e(go, "_instance");
let _o = go;
class vo {
  constructor() {
    e(this, "isActive"),
      e(this, "_meshObject"),
      e(this, "_maxAngle", 45),
      e(this, "_minAngle", -45),
      e(this, "_canShake", !1),
      e(this, "_shake_speed", 50),
      e(this, "_direction", 1),
      e(this, "_angle", 0),
      (this.isActive = !0);
  }
  setActive(t) {
    this.isActive = t;
  }
  getMeshObject() {
    return this._meshObject;
  }
  setPosition(t, e, n) {
    this._meshObject.position.set(t, e, n);
  }
  setScale(t) {
    "number" == typeof t
      ? this._meshObject.scale.setScalar(t)
      : this._meshObject.scale.set(t.x, t.y, 1);
  }
  setRotation(t, e, n) {
    const i = Math.PI / 180;
    this._meshObject.rotation.set(t * i, e * i, n * i);
  }
  createSprite(t, e = !1) {
    const n = new vi({
        map: t,
        transparent: !0,
        side: 0,
      }),
      i = new Sr(t.image.width, t.image.height),
      r = new Xi(i, n);
    return (
      e ||
        ((this._meshObject = r), this.setPosition(0, 0, 0), this.setScale(1)),
      _o.getInstance().scene.add(r),
      r
    );
  }
  updateTexture(t) {
    const e = this._meshObject.material;
    (e.map = t), (e.needsUpdate = !0);
  }
  shake(t) {
    this._canShake &&
      (this._angle >= this._maxAngle
        ? (this._direction = -1)
        : this._angle <= this._minAngle && (this._direction = 1),
      (this._angle += t * this._direction * this._shake_speed),
      this.setRotation(0, 0, this._angle));
  }
}
class xo extends vo {
  constructor(t) {
    super(), this.createSprite(t), this.setPosition(0, 0, -20);
  }
}
class So {
  constructor(t) {
    e(this, "_pool", []),
      e(this, "_createFunction"),
      (this._createFunction = t);
  }
  get() {
    for (const e of this._pool)
      if (!1 === e.isActive) return (e.isActive = !0), e;
    const t = this._createFunction();
    return this._pool.push(t), t;
  }
  getAll() {
    return this._pool;
  }
}
function Mo(t, e) {
  return Math.floor(Math.random() * (e - t + 1)) + t;
}
function Eo(t, e) {
  return Math.random() * (e - t) + t;
}
class To {
  constructor(t, e) {
    (this.x = t), (this.y = e);
  }
  clone() {
    return new To(this.x, this.y);
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), this;
  }
  normalize() {
    const t = Math.sqrt(this.x * this.x + this.y * this.y);
    return 0 === t ? new To(0, 0) : new To(this.x / t, this.y / t);
  }
  isEqual(t) {
    return this.x === t.x && this.y === t.y;
  }
  isNearEqual(t, e = 10) {
    return Math.abs(this.x - t.x) < e && Math.abs(this.y - t.y) < e;
  }
}
var yo = ((t) => (
  (t[(t.ENEMY_WIDTH = 240)] = "ENEMY_WIDTH"),
  (t[(t.ENEMY_HEIGHT = 200)] = "ENEMY_HEIGHT"),
  (t[(t.BULLET_WIDTH = 64)] = "BULLET_WIDTH"),
  (t[(t.BULLET_HIGHT = 128)] = "BULLET_HIGHT"),
  (t[(t.SCORING_ITEM_WIDTH = 100)] = "SCORING_ITEM_WIDTH"),
  (t[(t.SCORING_ITEM_HEIGHT = 100)] = "SCORING_ITEM_HEIGHT"),
  (t[(t.MAIN_CHARACTER_WIDTH = 150)] = "MAIN_CHARACTER_WIDTH"),
  (t[(t.MAIN_CHARACTER_HEIGHT = 150)] = "MAIN_CHARACTER_HEIGHT"),
  t
))(yo || {});
class bo {
  constructor(t, e, n) {
    (this.x = t), (this.y = e), (this.z = n);
  }
  clone() {
    return new bo(this.x, this.y, this.z);
  }
  add(t) {
    return (this.x += t.x), (this.y += t.y), (this.z += t.z), this;
  }
  normalize() {
    const t = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return 0 === t
      ? new bo(0, 0, 0)
      : new bo(this.x / t, this.y / t, this.z / t);
  }
  isEqual(t) {
    return this.x === t.x && this.y === t.y && this.z === t.z;
  }
  isNearEqual(t, e = 10) {
    return (
      Math.abs(this.x - t.x) < e &&
      Math.abs(this.y - t.y) < e &&
      Math.abs(this.z - t.z) < e
    );
  }
}
class wo {
  constructor() {
    e(this, "isActive"),
      e(this, "position"),
      e(this, "rotation"),
      e(this, "scale3"),
      e(this, "scale", 1),
      e(this, "_rawWidth", 0),
      e(this, "_rawHeight", 0),
      (this.isActive = !0),
      (this.position = new To(0, 0)),
      (this.rotation = new bo(0, 0, 0)),
      (this.scale3 = new bo(0, 0, 0));
  }
  setActive(t) {
    this.isActive = t;
  }
  get width() {
    return 0 != this.scale3.x
      ? this._rawWidth * this.scale3.x
      : this._rawWidth * this.scale;
  }
  set width(t) {
    this._rawWidth = t;
  }
  get height() {
    return 0 != this.scale3.x
      ? this._rawHeight * this.scale3.x
      : this._rawHeight * this.scale;
  }
  set height(t) {
    this._rawHeight = t;
  }
}
const Ao = class t {
  constructor() {
    e(this, "configs"), e(this, "_scoreConfigs", []);
  }
  static getInstance() {
    return t.instance || (t.instance = new t()), t.instance;
  }
  setConfigs(t) {
    this.configs = t;
    for (const e of this.configs.configLines) this._scoreConfigs.push(e.score);
  }
  getConfigs() {
    return this.configs;
  }
  getScoreConfigs() {
    return this._scoreConfigs;
  }
};
e(Ao, "instance");
let Co = Ao;
const Ro = class t {
  constructor() {
    e(this, "_configs"),
      e(this, "_scores", []),
      e(this, "_mainCharacter", {
        speed: 1,
      }),
      e(this, "_scoringItem", {
        spawn_rate: 0,
        spawn_rate_items: [0],
        size_scale: 1,
        shake_animation: !1,
      }),
      e(this, "_specialItem", {
        spawn_max_score: 0,
        size_scale: 1,
        shake_animation: !1,
      }),
      e(this, "_scoreEffect", {
        duration: 1,
        speed: 1,
        size_scale: 1,
      }),
      e(this, "_particle", {
        spawn_rate: 1,
        duration: 1,
        speed: 1,
        size_scale: 1,
      }),
      e(this, "_bullet", {
        spawn_rate: 1,
        speed: 1,
        size_scale: 1,
      }),
      e(this, "_booster", {
        spawn_rate: 0,
        size_scale: 1,
        shake_animation: !1,
      }),
      e(this, "_booster_shield", {
        spawn_rate: 0,
        duration: 0,
      }),
      e(this, "_booster_score", {
        spawn_rate: 0,
        duration: 0,
      }),
      e(this, "_destination", {
        score_show: 0,
        size_scale: 1,
        shake_animation: !1,
      }),
      (this._configs = Co.getInstance().getConfigs());
    for (const t of this._configs.configLines) this._scores.push(t.score);
  }
  static getInstance() {
    return this._instance || (this._instance = new t()), this._instance;
  }
  get mainCharacter() {
    return {
      ...this._mainCharacter,
    };
  }
  get scoringItem() {
    return {
      ...this._scoringItem,
    };
  }
  get specialItem() {
    return {
      ...this._specialItem,
    };
  }
  get scoreEffect() {
    return {
      ...this._scoreEffect,
    };
  }
  get particle() {
    return {
      ...this._particle,
    };
  }
  get bullet() {
    return {
      ...this._bullet,
    };
  }
  get booster() {
    return {
      ...this._booster,
    };
  }
  get booster_shield() {
    return {
      ...this._booster_shield,
    };
  }
  get booster_score() {
    return {
      ...this._booster_score,
    };
  }
  get destination() {
    return {
      ...this._destination,
    };
  }
  updateConfigValues(t) {
    let e = 0;
    for (const a of this._scores) {
      if (a > t) break;
      e = a;
    }
    const n = this._configs.findConfigLineByScore(e);
    if (!n) return;
    const i = n.configLineData.update_objects;
    i &&
      (this.updateMainCharacterConfig(i),
      this.updateScoringItemConfig(i),
      this.updateScoreEffectConfig(i),
      this.updateParticleConfig(i),
      this.updateBulletConfig(i),
      this.updateBoosterConfig(i),
      this.updateBoosterShieldConfig(i),
      this.updateBoosterScoreConfig(i));
    const r = n.configLineData.prepare_objects;
    r && this.updateSpecialItemConfig(r);
    const s = n.configLineData.create_objects;
    s && this.updateDestinationConfig(s, e);
  }
  updateSpecialItemConfig(t) {
    var e, n, i;
    (null == (e = t.special_item) ? void 0 : e.spawn_max_score) &&
      (this._specialItem.spawn_max_score = t.special_item.spawn_max_score),
      (null == (n = t.special_item) ? void 0 : n.size_scale) &&
        (this._specialItem.size_scale = t.special_item.size_scale),
      (null == (i = t.special_item) ? void 0 : i.shake_animation) &&
        (this._specialItem.shake_animation = t.special_item.shake_animation);
  }
  updateDestinationConfig(t, e) {
    var n, i;
    t.destination && (this._destination.score_show = e),
      (null == (n = t.destination) ? void 0 : n.size_scale) &&
        (this._destination.size_scale = t.destination.size_scale),
      (null == (i = t.destination) ? void 0 : i.shake_animation) &&
        (this._destination.shake_animation = t.destination.shake_animation);
  }
  updateMainCharacterConfig(t) {
    var e;
    (null == (e = t.character) ? void 0 : e.speed) &&
      (this._mainCharacter.speed = t.character.speed);
  }
  updateScoringItemConfig(t) {
    var e, n, i, r;
    (null == (e = t.scoring_item) ? void 0 : e.spawn_rate) &&
      (this._scoringItem.spawn_rate = t.scoring_item.spawn_rate),
      (null == (n = t.scoring_item) ? void 0 : n.spawn_rate_items) &&
        (this._scoringItem.spawn_rate_items = [
          ...t.scoring_item.spawn_rate_items,
        ]),
      (null == (i = t.scoring_item) ? void 0 : i.size_scale) &&
        (this._scoringItem.size_scale = t.scoring_item.size_scale),
      (null == (r = t.scoring_item) ? void 0 : r.shake_animation) &&
        (this._scoringItem.shake_animation = t.scoring_item.shake_animation);
  }
  updateScoreEffectConfig(t) {
    var e, n, i;
    (null == (e = t.score_effect) ? void 0 : e.duration) &&
      (this._scoreEffect.duration = t.score_effect.duration),
      (null == (n = t.score_effect) ? void 0 : n.speed) &&
        (this._scoreEffect.speed = t.score_effect.speed),
      (null == (i = t.score_effect) ? void 0 : i.size_scale) &&
        (this._scoreEffect.size_scale = t.score_effect.size_scale);
  }
  updateParticleConfig(t) {
    var e, n, i, r;
    (null == (e = t.particle) ? void 0 : e.spawn_rate) &&
      (this._particle.spawn_rate = t.particle.spawn_rate),
      (null == (n = t.particle) ? void 0 : n.duration) &&
        (this._particle.duration = t.particle.duration),
      (null == (i = t.particle) ? void 0 : i.speed) &&
        (this._particle.speed = t.particle.speed),
      (null == (r = t.particle) ? void 0 : r.size_scale) &&
        (this._particle.size_scale = t.particle.size_scale);
  }
  updateBulletConfig(t) {
    var e, n, i;
    (null == (e = t.bullet) ? void 0 : e.spawn_rate) &&
      (this._bullet.spawn_rate = t.bullet.spawn_rate),
      (null == (n = t.bullet) ? void 0 : n.speed) &&
        (this._bullet.speed = t.bullet.speed),
      (null == (i = t.bullet) ? void 0 : i.size_scale) &&
        (this._bullet.size_scale = t.bullet.size_scale);
  }
  updateBoosterConfig(t) {
    var e, n, i;
    (null == (e = t.booster) ? void 0 : e.spawn_rate) &&
      (this._booster.spawn_rate = t.booster.spawn_rate),
      (null == (n = t.scoring_item) ? void 0 : n.size_scale) &&
        (this._scoringItem.size_scale = t.scoring_item.size_scale),
      (null == (i = t.scoring_item) ? void 0 : i.shake_animation) &&
        (this._scoringItem.shake_animation = t.scoring_item.shake_animation);
  }
  updateBoosterShieldConfig(t) {
    var e, n;
    (null == (e = t.booster_shield) ? void 0 : e.spawn_rate) &&
      (this._booster_shield.spawn_rate = t.booster_shield.spawn_rate),
      (null == (n = t.booster_shield) ? void 0 : n.duration) &&
        (this._booster_shield.duration = t.booster_shield.duration);
  }
  updateBoosterScoreConfig(t) {
    var e, n;
    (null == (e = t.booster_score) ? void 0 : e.spawn_rate) &&
      (this._booster_score.spawn_rate = t.booster_score.spawn_rate),
      (null == (n = t.booster_score) ? void 0 : n.duration) &&
        (this._booster_score.duration = t.booster_score.duration);
  }
};
e(Ro, "_instance");
let Po = Ro;
var Uo = ((t) => (
  (t[(t.SCORING_ITEM = 1)] = "SCORING_ITEM"),
  (t[(t.SPECIAL_ITEM = 2)] = "SPECIAL_ITEM"),
  (t[(t.BOOSTER_SHIELD = 3)] = "BOOSTER_SHIELD"),
  (t[(t.BOOSTER_SCORE = 4)] = "BOOSTER_SCORE"),
  t
))(Uo || {});
class Io extends wo {
  constructor() {
    super(),
      e(this, "_id"),
      e(this, "_isSpecialItem"),
      e(this, "_existTime", 0),
      e(this, "_type"),
      e(this, "_direction", new To(0, 0)),
      e(this, "_moveSpeed", 1500),
      (this._id = 0),
      (this._isSpecialItem = !1),
      (this.width = yo.SCORING_ITEM_WIDTH),
      (this.height = yo.SCORING_ITEM_HEIGHT);
  }
  getId() {
    return this._id;
  }
  get type() {
    return this._type;
  }
  isSpecialItem() {
    return this._isSpecialItem;
  }
  setUp(t, e, n) {
    (this.position.x = t.x),
      (this.position.y = t.y),
      (this.scale =
        1 == n
          ? 0.75 * Po.getInstance().scoringItem.size_scale
          : 2 == n
          ? 0.8 * Po.getInstance().specialItem.size_scale
          : 0.65 * Po.getInstance().booster.size_scale),
      (this._existTime = Eo(3, 6)),
      (this._id = e),
      (this._type = n),
      (this.isActive = !0);
  }
  update(t) {
    this.isActive &&
      ((this._existTime -= t), this._existTime <= 0 && (this.isActive = !1));
  }
  moveToCharacter(t, e) {
    const n = t.x - this.position.x,
      i = t.y - this.position.y,
      r = Math.sqrt(n * n + i * i);
    (this._direction.x = n / r),
      (this._direction.y = i / r),
      (this.position.x += this._direction.x * e * this._moveSpeed),
      (this.position.y += this._direction.y * e * this._moveSpeed);
  }
}
class Lo {
  constructor() {
    e(this, "_pool"),
      e(this, "_spawnTime", 0),
      e(this, "_spawnTimeMax", 1),
      e(this, "_canSpawn", !1),
      (this._pool = new So(() => new Io()));
  }
  get canSpawn() {
    return this._canSpawn;
  }
  spawn(t, e, n) {
    const i = this._pool.get(),
      r = new To(0, 0);
    return (
      (r.x = t.x + Mo(-540, 540)),
      (r.y = t.y + Mo(-990, 990)),
      i.setUp(r, e, n),
      (this._canSpawn = !1),
      i
    );
  }
  update(t) {
    (this._spawnTime += t),
      this._spawnTime >= this._spawnTimeMax &&
        ((this._spawnTime = 0),
        (this._spawnTimeMax = Eo(1, 2)),
        (this._canSpawn = !0));
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
    (this._canSpawn = !1), (this._spawnTime = 0), (this._spawnTimeMax = 1);
  }
}
class Do {
  static setTextureFromConfig(t, e) {
    var n, i, r, s, a, o, l, c, h, u, d, p, f, m;
    for (const g of t.configLines) {
      const t = g.score,
        _ = g.configLineData.update_objects,
        v = g.configLineData.prepare_objects,
        x = g.configLineData.create_objects;
      if (
        ((null == (n = null == _ ? void 0 : _.bg) ? void 0 : n.image) &&
          (console.log("ttttt1111111111"),
          this.bgTextureSets.set(
            t,
            _.bg.image.map((t) => e.get(t))
          )),
        (null == (i = null == _ ? void 0 : _.character) ? void 0 : i.image) &&
          this.characterTextureSets.set(
            t,
            _.character.image.map((t) => e.get(t))
          ),
        (null == (r = null == _ ? void 0 : _.scoring_item)
          ? void 0
          : r.image) &&
          this.scoringItemTextureSets.set(
            t,
            _.scoring_item.image.map((t) => e.get(t))
          ),
        (null == (s = null == _ ? void 0 : _.board) ? void 0 : s.image) &&
          this.boardTextureSets.set(
            t,
            _.board.image.map((t) => e.get(t))
          ),
        (null == (a = null == _ ? void 0 : _.bullet) ? void 0 : a.image) &&
          this.bulletTextureSets.set(
            t,
            _.bullet.image.map((t) => e.get(t))
          ),
        (null == (o = null == _ ? void 0 : _.enemy) ? void 0 : o.image) &&
          this.enemyTextureSets.set(
            t,
            _.enemy.image.map((t) => e.get(t))
          ),
        (null == (l = null == _ ? void 0 : _.particle) ? void 0 : l.image) &&
          this.particleTextureSets.set(
            t,
            _.particle.image.map((t) => e.get(t))
          ),
        null == (c = null == x ? void 0 : x.score_pop_up) ? void 0 : c.image)
      ) {
        const t =
          null == x ? void 0 : x.score_pop_up.image.map((t) => e.get(t));
        this.scorePopUpTextures.push(...t);
      }
      if (
        ((null == (h = null == x ? void 0 : x.destination)
          ? void 0
          : h.image) &&
          this.destinationTextureSets.set(
            t,
            x.destination.image.map((t) => e.get(t))
          ),
        null == (u = null == v ? void 0 : v.win_pop_up) ? void 0 : u.image)
      ) {
        const t = v.win_pop_up.image.map((t) => e.get(t));
        this.winPopUpTextures.push(...t);
      }
      if (null == (d = null == v ? void 0 : v.lose_pop_up) ? void 0 : d.image) {
        const t = v.lose_pop_up.image.map((t) => e.get(t));
        this.losePopUpTextures.push(...t);
      }
      if (
        null == (p = null == v ? void 0 : v.destination_pop_up)
          ? void 0
          : p.image
      ) {
        const t =
          null == v ? void 0 : v.destination_pop_up.image.map((t) => e.get(t));
        this.destinationPopUpTextures.push(...t);
      }
      if (
        null == (f = null == v ? void 0 : v.special_item_pop_up)
          ? void 0
          : f.image
      ) {
        const t =
          null == v ? void 0 : v.special_item_pop_up.image.map((t) => e.get(t));
        this.specialItemPopUpTextures.push(...t);
      }
      (null == (m = null == v ? void 0 : v.special_item) ? void 0 : m.image) &&
        this.specialItemTextureSets.set(
          t,
          v.special_item.image.map((t) => e.get(t))
        );
    }
  }
  static setDefaultTextures(t) {
    if (0 === t.configLines.length) return;
    const e = t.configLines.map((t) => t.score).sort((t, e) => t - e)[0];
    this.setCurrentTexturesByScore(e);
  }
  static updateTexturesForScore(t) {
    const e = Co.getInstance().getConfigs();
    if (!e) return;
    const n = e.configLines
      .map((t) => t.score)
      .filter((e) => e <= t)
      .sort((t, e) => e - t);
    n.length > 0 && this.setCurrentTexturesByScore(n[0]);
  }
  static setCurrentTexturesByScore(t) {
    this.characterTextureSets.has(t) &&
      (this.currentCharacterTextures = this.characterTextureSets.get(t)),
      this.scoringItemTextureSets.has(t) &&
        (this.currentScoringItemTextures = this.scoringItemTextureSets.get(t)),
      console.log("score === ", t),
      this.bgTextureSets.has(t) &&
        (this.currentBgTextures = this.bgTextureSets.get(t)),
      this.boardTextureSets.has(t) &&
        (this.currentBoardTextures = this.boardTextureSets.get(t)),
      this.bulletTextureSets.has(t) &&
        (this.currentBulletTextures = this.bulletTextureSets.get(t)),
      this.enemyTextureSets.has(t) &&
        (this.currentEnemyTextures = this.enemyTextureSets.get(t)),
      this.particleTextureSets.has(t) &&
        (this.currentParticleTextures = this.particleTextureSets.get(t)),
      this.specialItemTextureSets.has(t) &&
        (this.currentSpecialItemTextures = this.specialItemTextureSets.get(t)),
      this.destinationTextureSets.has(t) &&
        (this.currentDestinationTextures = this.destinationTextureSets.get(t));
  }
}
e(Do, "characterTextureSets", new Map()),
  e(Do, "scoringItemTextureSets", new Map()),
  e(Do, "bgTextureSets", new Map()),
  e(Do, "boardTextureSets", new Map()),
  e(Do, "bulletTextureSets", new Map()),
  e(Do, "enemyTextureSets", new Map()),
  e(Do, "particleTextureSets", new Map()),
  e(Do, "specialItemTextureSets", new Map()),
  e(Do, "destinationTextureSets", new Map()),
  e(Do, "currentCharacterTextures", []),
  e(Do, "currentScoringItemTextures", []),
  e(Do, "currentBgTextures", []),
  e(Do, "currentBoardTextures", []),
  e(Do, "currentBulletTextures", []),
  e(Do, "currentEnemyTextures", []),
  e(Do, "currentParticleTextures", []),
  e(Do, "scorePopUpTextures", []),
  e(Do, "winPopUpTextures", []),
  e(Do, "losePopUpTextures", []),
  e(Do, "destinationPopUpTextures", []),
  e(Do, "specialItemPopUpTextures", []),
  e(Do, "currentSpecialItemTextures", []),
  e(Do, "currentDestinationTextures", []);
var No = ((t) => (
    (t[(t.MAIN_CHARACTER = 4)] = "MAIN_CHARACTER"),
    (t[(t.SCORING_ITEM = 2)] = "SCORING_ITEM"),
    (t[(t.BULLET = 3)] = "BULLET"),
    (t[(t.ENEMY = 5)] = "ENEMY"),
    (t[(t.PARTICLE = 6)] = "PARTICLE"),
    (t[(t.SCORE_EFFECT = 7)] = "SCORE_EFFECT"),
    t
  ))(No || {}),
  Oo = ((t) => (
    (t.HeartIcon = "heartIcon"),
    (t.Plus10 = "plus10"),
    (t.Minus1 = "minus1"),
    (t.Firework1 = "firework1"),
    (t.Firework2 = "firework2"),
    (t.Firework3 = "firework3"),
    (t.Firework4 = "firework4"),
    (t.Firework5 = "firework5"),
    (t.DarkBackground = "darkBg"),
    (t.EffectStar = "star"),
    (t.Confetti1 = "confetti1"),
    (t.Confetti2 = "confetti2"),
    (t.Confetti3 = "confetti3"),
    (t.Confetti4 = "confetti4"),
    (t.Smoke = "smoke"),
    (t.BoosterShield = "boosterShield"),
    (t.BoosterScore = "boosterScore"),
    (t.ShieldEffect = "shieldEff"),
    (t.MagnetEffect = "magnetEff"),
    t
  ))(Oo || {});
class Fo {
  static setTexture(t, e) {
    this.textures.set(t, e);
  }
  static getTexture(t) {
    return this.textures.get(t);
  }
  static setArrayTextures() {
    this.fireworks.push(this.textures.get("firework1")),
      this.fireworks.push(this.textures.get("firework2")),
      this.fireworks.push(this.textures.get("firework3")),
      this.fireworks.push(this.textures.get("firework4")),
      this.fireworks.push(this.textures.get("firework5")),
      this.confetties.push(this.textures.get("confetti1")),
      this.confetties.push(this.textures.get("confetti2")),
      this.confetties.push(this.textures.get("confetti3")),
      this.confetties.push(this.textures.get("confetti4"));
  }
}
e(Fo, "textures", new Map()),
  e(Fo, "fireworks", []),
  e(Fo, "confetties", []),
  e(Fo, "texturePaths", {
    heartIcon: "StreamingAssets/Textures/heart_icon.png",
    plus10: "StreamingAssets/Textures/plus_10.png",
    minus1: "StreamingAssets/Textures/minus_1.png",
    firework1: "StreamingAssets/Textures/firework_1.png",
    firework2: "StreamingAssets/Textures/firework_2.png",
    firework3: "StreamingAssets/Textures/firework_3.png",
    firework4: "StreamingAssets/Textures/firework_4.png",
    firework5: "StreamingAssets/Textures/firework_5.png",
    darkBg: "StreamingAssets/Textures/bg_dark.png",
    star: "StreamingAssets/Textures/star.png",
    confetti1: "StreamingAssets/Textures/confetti_1.png",
    confetti2: "StreamingAssets/Textures/confetti_2.png",
    confetti3: "StreamingAssets/Textures/confetti_3.png",
    confetti4: "StreamingAssets/Textures/confetti_4.png",
    smoke: "StreamingAssets/Textures/smoke.png",
    boosterShield: "StreamingAssets/Textures/booster_shield.png",
    boosterScore: "StreamingAssets/Textures/booster_score.png",
    shieldEff: "StreamingAssets/Textures/shield_effect.png",
    magnetEff: "StreamingAssets/Textures/magnet_effect.png",
  });
class Bo extends vo {
  constructor() {
    super(), this.createSprite(Do.currentScoringItemTextures[0]);
  }
  setUp(t, e, n) {
    this._meshObject.position.set(t.x, t.y, No.SCORING_ITEM),
      this._meshObject.position.set(t.x, t.y, No.SCORING_ITEM),
      (this._canShake = Po.getInstance().booster.shake_animation);
    let i = Do.currentScoringItemTextures[0];
    n == Uo.SCORING_ITEM
      ? ((i = Do.currentScoringItemTextures[e]),
        (this._canShake = Po.getInstance().scoringItem.shake_animation))
      : n == Uo.SPECIAL_ITEM
      ? ((i = Do.currentSpecialItemTextures[0]),
        (this._canShake = Po.getInstance().scoringItem.shake_animation))
      : n == Uo.BOOSTER_SHIELD
      ? (i = Fo.getTexture(Oo.BoosterShield))
      : n == Uo.BOOSTER_SCORE && (i = Fo.getTexture(Oo.BoosterScore)),
      this.updateTexture(i),
      (this.isActive = !0),
      (this._meshObject.visible = !0);
  }
}
class zo {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_scoringItemManager"),
      (this._pool = new So(() => new Bo())),
      (this._scoringItemManager = t);
  }
  spawn(t, e, n) {
    const i = this._pool.get();
    return i.setUp(t, e, n), i;
  }
  update(t) {
    const e = this._scoringItemManager.getAll().length;
    if (0 != e) for (let n = 0; n < e; n++) this.updateScoringItemVisual(n, t);
  }
  updateScoringItemVisual(t, e) {
    const n = this._pool.getAll()[t],
      i = this._scoringItemManager.getAll()[t];
    n.setActive(i.isActive),
      (n.getMeshObject().visible = i.isActive),
      n.setPosition(i.position.x, i.position.y, No.SCORING_ITEM),
      n.setScale(i.scale),
      n.shake(e);
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
var Go = ((t) => (
  (t.KEY_DOWN = "keydown"),
  (t.POINTER_DOWN = "pointerdown"),
  (t.POINTER_UP = "pointerup"),
  (t.CUSTOM_SWIPE = "custom_swipe"),
  (t.CUSTOM_KEY_DOWN = "custom_keydown"),
  (t.HTML_CLICK = "click"),
  (t.RESUME_GAME = "resume_game"),
  (t.POINTER_MOVE = "pointermove"),
  t
))(Go || {});
class Ho {
  constructor() {
    e(this, "_touchStartX", 0),
      e(this, "_touchStartY", 0),
      e(this, "_touchThreshold", 50),
      e(this, "handlePointerDownEvent", (t) => {
        (this._touchStartX = t.clientX), (this._touchStartY = t.clientY);
      }),
      e(this, "dispatchPointerUpEvent", (t) => {
        const e = t.clientX - this._touchStartX,
          n = t.clientY - this._touchStartY;
        if (
          Math.abs(e) < this._touchThreshold &&
          Math.abs(n) < this._touchThreshold
        )
          return;
        let i;
        i =
          Math.abs(e) > Math.abs(n)
            ? e > 0
              ? "right"
              : "left"
            : n > 0
            ? "down"
            : "up";
        const r = new CustomEvent("custom_swipe", {
          detail: {
            direction: i,
          },
        });
        window.dispatchEvent(r);
      });
  }
  dispatchCustomKeyDownEvent(t) {
    const e = new CustomEvent("custom_keydown", {
      detail: {
        key: t.key,
      },
    });
    window.dispatchEvent(e);
  }
}
class ko {
  constructor(t) {
    e(this, "_customEventDispatcher"),
      e(this, "_window"),
      e(this, "_canvas"),
      e(this, "_replayBtn"),
      e(this, "_audioBtn"),
      e(this, "_shieldBoosterBtn"),
      e(this, "_scoreBoosterBtn"),
      e(this, "_inputManager"),
      e(this, "_gameController"),
      e(this, "_boosterController"),
      (this._customEventDispatcher = t);
  }
  bindDependencies(t, e) {
    (this._gameController = t), (this._boosterController = e);
  }
  addListeners(t, e, n, i) {
    (this._window = t),
      (this._canvas = e),
      (this._replayBtn = n.getReplayBtn()),
      (this._audioBtn = n.getAudioBtn()),
      (this._shieldBoosterBtn = n.getShieldBoosterBtn()),
      (this._scoreBoosterBtn = n.getScoreBoosterBtn()),
      (this._inputManager = i);
  }
  addEventListeners() {
    this._window.addEventListener(
      Go.KEY_DOWN,
      this._customEventDispatcher.dispatchCustomKeyDownEvent
    ),
      this._window.addEventListener(
        Go.POINTER_MOVE,
        this._inputManager.setPointerPosition
      ),
      this._canvas.addEventListener(Go.POINTER_DOWN, () => {
        this._inputManager.setPointerDownState(!0);
      }),
      this._canvas.addEventListener(Go.POINTER_UP, () => {
        this._inputManager.setPointerDownState(!1);
      }),
      this._window.addEventListener(Go.RESUME_GAME, (t) => {
        const e = t;
        Al.getInstance().resumeGame(e.detail);
      }),
      this._replayBtn.addEventListener(Go.HTML_CLICK, () => {
        _o.getInstance().showBlackScene(!0), this._gameController.replayGame();
      }),
      this._audioBtn.addEventListener(Go.HTML_CLICK, () => {
        (r.isMute = !r.isMute),
          r.muteAll(r.isMute),
          o.getInstance().setAudioBtnImage(r.isMute);
      }),
      this._shieldBoosterBtn.addEventListener(Go.HTML_CLICK, () => {
        this._boosterController.handleClickShieldBoosterButton();
      }),
      this._scoreBoosterBtn.addEventListener(Go.HTML_CLICK, () => {
        this._boosterController.handleClickAbilityBoosterButton();
      });
  }
}
class Vo {
  constructor() {
    e(this, "_live", 0), e(this, "_maxLive", 0);
  }
  reset() {
    (this._live = 0), (this._maxLive = 0);
  }
  plus(t) {
    this._live += t;
  }
  minus(t) {
    this._live >= t && (this._live -= t);
  }
  getLive() {
    return this._live;
  }
  setLive(t) {
    this._live = t;
  }
  getMaxLive() {
    return this._maxLive;
  }
  setMaxLive(t) {
    this._maxLive = t;
  }
}
const Wo = class t {
  constructor() {
    e(this, "_configs"),
      e(this, "_allScoreConfigs", []),
      e(this, "winPopUpIndex", 0),
      e(this, "winPopUpMaxIndex", 0),
      e(this, "losePopUpIndex", 0),
      e(this, "losePopUpMaxIndex", 0),
      e(this, "scorePopUpIndex", 0),
      e(this, "_scorePopUpLastScore", 0),
      e(this, "destinationPopUpIndex", 0),
      e(this, "_destinationPopUpLastScore", 0),
      e(this, "specialItemPopUpIndex", 0),
      e(this, "_specialItemPopUpLastScore", 0),
      e(this, "_scorePopUpConfig", {
        html_code: "",
        effect_enable: !1,
        effect_time: 0,
        effect_type: 0,
      }),
      e(this, "_winPopUpConfig", {
        html_code: "",
        amount: 0,
        effect_enable: !1,
        effect_time: 0,
        effect_type: 0,
      }),
      e(this, "_losePopUpConfig", {
        html_code: "",
        amount: 0,
        effect_enable: !1,
        effect_time: 0,
        effect_type: 0,
      }),
      e(this, "_destinationPopUpConfig", {
        html_code: "",
        effect_enable: !1,
        effect_time: 0,
        effect_type: 0,
      }),
      e(this, "_specialItemPopUpConfig", {
        html_code: "",
        effect_enable: !1,
        effect_time: 0,
        effect_type: 0,
      }),
      (this._configs = Co.getInstance().getConfigs());
    for (const t of this._configs.configLines)
      this._allScoreConfigs.push(t.score);
  }
  static getInstance() {
    return this._instance || (this._instance = new t()), this._instance;
  }
  get scorePopUpConfig() {
    return {
      ...this._scorePopUpConfig,
    };
  }
  get winPopUpConfig() {
    return {
      ...this._winPopUpConfig,
    };
  }
  get losePopUpConfig() {
    return {
      ...this._losePopUpConfig,
    };
  }
  get destinationPopUpConfig() {
    return {
      ...this._destinationPopUpConfig,
    };
  }
  get specialItemPopUpConfig() {
    return {
      ...this._specialItemPopUpConfig,
    };
  }
  setDefaultPopUps() {
    var t, e, n, i, r, s;
    (this.winPopUpIndex = 0),
      (this.winPopUpMaxIndex = 0),
      (this.losePopUpIndex = 0),
      (this.losePopUpMaxIndex = 0),
      (this._scorePopUpLastScore = 0),
      (this.scorePopUpIndex = 0),
      (this._destinationPopUpLastScore = 0),
      (this.destinationPopUpIndex = 0),
      (this._specialItemPopUpLastScore = 0),
      (this.specialItemPopUpIndex = 0);
    const a = this._configs.findConfigLineByScore(0);
    a &&
      ((null ==
      (e =
        null == (t = a.configLineData.prepare_objects) ? void 0 : t.win_pop_up)
        ? void 0
        : e.amount) &&
        ((this._winPopUpConfig.amount =
          null == (n = a.configLineData.prepare_objects)
            ? void 0
            : n.win_pop_up.amount),
        (this.winPopUpMaxIndex = this._winPopUpConfig.amount)),
      (null ==
      (r =
        null == (i = a.configLineData.prepare_objects) ? void 0 : i.lose_pop_up)
        ? void 0
        : r.amount) &&
        ((this._losePopUpConfig.amount =
          null == (s = a.configLineData.prepare_objects)
            ? void 0
            : s.lose_pop_up.amount),
        (this.losePopUpMaxIndex = this._losePopUpConfig.amount)));
  }
  canShowWinPopUp() {
    var t;
    if (this.winPopUpIndex < this.winPopUpMaxIndex) {
      const e = this._configs.findConfigLineByScore(0);
      if (!e) return !1;
      const n =
        null == (t = e.configLineData.prepare_objects) ? void 0 : t.win_pop_up;
      return !!n && (this.setWinPopUp(n), this.winPopUpIndex++, !0);
    }
    return !1;
  }
  setWinPopUp(t) {
    t.html_code &&
      (this._winPopUpConfig.html_code = t.html_code[this.winPopUpIndex]),
      t.effect_enable &&
        (this._winPopUpConfig.effect_enable =
          t.effect_enable[this.winPopUpIndex]),
      t.effect_time &&
        (this._winPopUpConfig.effect_time = t.effect_time[this.winPopUpIndex]),
      t.effect_type &&
        (this._winPopUpConfig.effect_type = t.effect_type[this.winPopUpIndex]);
  }
  canShowLosePopUp() {
    var t;
    if (this.losePopUpIndex < this.losePopUpMaxIndex) {
      const e = this._configs.findConfigLineByScore(0);
      if (!e) return !1;
      const n =
        null == (t = e.configLineData.prepare_objects) ? void 0 : t.lose_pop_up;
      return !!n && (this.setLosePopUp(n), this.losePopUpIndex++, !0);
    }
    return !1;
  }
  setLosePopUp(t) {
    t.html_code &&
      (this._losePopUpConfig.html_code = t.html_code[this.winPopUpIndex]),
      t.effect_enable &&
        (this._losePopUpConfig.effect_enable =
          t.effect_enable[this.winPopUpIndex]),
      t.effect_time &&
        (this._losePopUpConfig.effect_time = t.effect_time[this.winPopUpIndex]),
      t.effect_type &&
        (this._losePopUpConfig.effect_type = t.effect_type[this.winPopUpIndex]);
  }
  canShowScorePopUp(t) {
    var e;
    let n = 0;
    for (const s of this._allScoreConfigs) {
      if (s > t) break;
      n = s;
    }
    if (n == this._scorePopUpLastScore) return !1;
    const i = this._configs.findConfigLineByScore(n);
    if (
      !(null == (e = null == i ? void 0 : i.configLineData.create_objects)
        ? void 0
        : e.score_pop_up)
    )
      return !1;
    const r = i.configLineData.create_objects.score_pop_up;
    return (
      !!r &&
      (this.setScorePopUp(r),
      (this._scorePopUpLastScore = n),
      this.scorePopUpIndex++,
      !0)
    );
  }
  setScorePopUp(t) {
    void 0 !== t.html_code && (this._scorePopUpConfig.html_code = t.html_code),
      void 0 !== t.effect_enable &&
        (this._scorePopUpConfig.effect_enable = t.effect_enable),
      void 0 !== t.effect_time &&
        (this._scorePopUpConfig.effect_time = t.effect_time),
      void 0 !== t.effect_type &&
        (this._scorePopUpConfig.effect_type = t.effect_type);
  }
  canShowDestinationPopUp(t) {
    var e, n;
    let i = this._destinationPopUpLastScore;
    for (const s of this._allScoreConfigs) {
      const n = this._configs.findConfigLineByScore(s);
      if (
        (null == (e = null == n ? void 0 : n.configLineData.prepare_objects)
          ? void 0
          : e.destination_pop_up) &&
        s > this._destinationPopUpLastScore &&
        s <= t
      )
        return (
          (i = s),
          (this._destinationPopUpLastScore = i),
          this.setDestinationPopUp(
            n.configLineData.prepare_objects.destination_pop_up
          ),
          this.destinationPopUpIndex++,
          !0
        );
    }
    const r = this._configs.findConfigLineByScore(i);
    return !!(null ==
    (n = null == r ? void 0 : r.configLineData.prepare_objects)
      ? void 0
      : n.destination_pop_up);
  }
  setDestinationPopUp(t) {
    void 0 !== t.html_code &&
      (this._destinationPopUpConfig.html_code = t.html_code),
      void 0 !== t.effect_enable &&
        (this._destinationPopUpConfig.effect_enable = t.effect_enable),
      void 0 !== t.effect_time &&
        (this._destinationPopUpConfig.effect_time = t.effect_time),
      void 0 !== t.effect_type &&
        (this._destinationPopUpConfig.effect_type = t.effect_type);
  }
  canShowSpecialItemPopUp(t) {
    var e, n;
    let i = this._specialItemPopUpLastScore;
    for (const s of this._allScoreConfigs) {
      const n = this._configs.findConfigLineByScore(s);
      if (
        (null == (e = null == n ? void 0 : n.configLineData.prepare_objects)
          ? void 0
          : e.special_item_pop_up) &&
        s > this._specialItemPopUpLastScore &&
        s <= t
      )
        return (
          (i = s),
          (this._specialItemPopUpLastScore = i),
          this.setSpecialItemPopUp(
            n.configLineData.prepare_objects.special_item_pop_up
          ),
          this.specialItemPopUpIndex++,
          !0
        );
    }
    const r = this._configs.findConfigLineByScore(i);
    return !!(null ==
    (n = null == r ? void 0 : r.configLineData.prepare_objects)
      ? void 0
      : n.special_item_pop_up);
  }
  setSpecialItemPopUp(t) {
    void 0 !== t.html_code &&
      (this._specialItemPopUpConfig.html_code = t.html_code),
      void 0 !== t.effect_enable &&
        (this._specialItemPopUpConfig.effect_enable = t.effect_enable),
      void 0 !== t.effect_time &&
        (this._specialItemPopUpConfig.effect_time = t.effect_time),
      void 0 !== t.effect_type &&
        (this._specialItemPopUpConfig.effect_type = t.effect_type);
  }
};
e(Wo, "_instance");
let Xo = Wo;
class jo extends wo {
  constructor() {
    super(),
      e(this, "_maxScale", 0),
      e(this, "_delayTime", 0),
      e(this, "_speed", 0);
  }
  getPosition() {
    return this.position;
  }
  getScale() {
    return this.scale;
  }
  setUp(t) {
    (this.position.x = t.x),
      (this.position.y = t.y),
      (this._delayTime = Eo(0, 1.2)),
      (this._speed = Eo(0.5, 1.2)),
      (this.scale = 0),
      (this._maxScale = Eo(1, 2)),
      (this.isActive = !0);
  }
  update(t) {
    this.isActive &&
      (this._delayTime > 0 && (this._delayTime -= t),
      this._delayTime <= 0 &&
        (this.scale < this._maxScale
          ? (this.scale += this._speed * t)
          : (this.isActive = !1)));
  }
}
class qo {
  constructor() {
    e(this, "_pool"), (this._pool = new So(() => new jo()));
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update(t) {
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
  }
}
class Yo extends wo {
  constructor() {
    super(),
      e(this, "_direction", new To(0, 0)),
      e(this, "_time", 0),
      e(this, "_speed", 0),
      e(this, "_isSmokeParticle", !1);
  }
  setUp(t, e) {
    (this.position.x = t.x),
      (this.position.y = t.y),
      (this._direction.x = Eo(-1, 1)),
      (this._direction.y = Eo(-1, 1)),
      (this._direction = this._direction.normalize()),
      (this._isSmokeParticle = e),
      e
        ? ((this.scale = Eo(0.4, 0.7)),
          (this._time = Eo(0.5, 1)),
          (this._speed = Mo(100, 300)))
        : ((this.scale = Eo(0.2, 0.5) * Po.getInstance().particle.size_scale),
          (this._time = Eo(0.5, 1) * Po.getInstance().particle.duration),
          (this._speed = Mo(200, 500) * Po.getInstance().particle.speed)),
      (this.isActive = !0);
  }
  update(t) {
    if (this.isActive)
      if (this._time > 0) {
        this._time -= t;
        const e = this._direction,
          n = this._speed * t;
        (this.position.x += e.x * n), (this.position.y += e.y * n);
      } else this.isActive = !1;
  }
}
class Ko {
  constructor() {
    e(this, "_pool"), (this._pool = new So(() => new Yo()));
  }
  spawn(t, e) {
    const n = this._pool.get();
    return n.setUp(t, e), n;
  }
  update(t) {
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
  }
}
class Zo extends wo {
  constructor() {
    super(),
      e(this, "_time", 1),
      e(this, "_speed", 250),
      e(this, "_isLoseEffect", !1);
  }
  getPosition() {
    return this.position;
  }
  getScale() {
    return this.scale;
  }
  isLoseEffect() {
    return this._isLoseEffect;
  }
  setUp(t, e) {
    (this.position.x = t.x),
      (this.position.y = t.y),
      (this._time = 1 * Po.getInstance().scoreEffect.duration),
      (this._speed = 250 * Po.getInstance().scoreEffect.speed),
      (this.scale = 1 * Po.getInstance().scoreEffect.size_scale),
      (this._isLoseEffect = e),
      (this.isActive = !0);
  }
  update(t) {
    this.isActive &&
      (this._time > 0
        ? ((this._time -= t), (this.position.y += this._speed * t))
        : (this.isActive = !1));
  }
}
class Jo {
  constructor() {
    e(this, "_pool"), (this._pool = new So(() => new Zo()));
  }
  spawn(t, e) {
    const n = this._pool.get();
    return n.setUp(t, e), n;
  }
  update(t) {
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
  }
}
class $o extends vo {
  constructor() {
    super(), this.createSprite(Fo.getTexture(Oo.Firework1));
  }
  setUp(t) {
    this._meshObject.position.set(t.x, t.y, 15);
    const e = Fo.fireworks[Mo(0, Fo.fireworks.length - 1)];
    this.updateTexture(e);
  }
}
class Qo {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_fireworkManager"),
      (this._pool = new So(() => new $o())),
      (this._fireworkManager = t);
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update() {
    const t = this._fireworkManager.getAll().length;
    if (0 != t) for (let e = 0; e < t; e++) this.updateFireworkVisual(e);
  }
  updateFireworkVisual(t) {
    const e = this._pool.getAll()[t],
      n = this._fireworkManager.getAll()[t];
    this._pool.getAll()[t].setActive(n.isActive),
      (e.getMeshObject().visible = n.isActive),
      e.getMeshObject().position.set(n.getPosition().x, n.getPosition().y, 15),
      e.getMeshObject().scale.setScalar(n.getScale());
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class tl extends vo {
  constructor() {
    super(), this.createSprite(Do.currentParticleTextures[0]);
  }
  setUp(t, e) {
    this._meshObject.position.set(t.x, t.y, No.PARTICLE),
      e
        ? this.updateTexture(Fo.getTexture(Oo.Smoke))
        : this.updateTexture(Do.currentParticleTextures[0]);
  }
}
class el {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_particleManager"),
      (this._pool = new So(() => new tl())),
      (this._particleManager = t);
  }
  spawn(t, e) {
    const n = this._pool.get();
    return n.setUp(t, e), n;
  }
  update() {
    const t = this._particleManager.getAll().length;
    if (0 != t) for (let e = 0; e < t; e++) this.updateParticleVisual(e);
  }
  updateParticleVisual(t) {
    const e = this._pool.getAll()[t],
      n = this._particleManager.getAll()[t];
    this._pool.getAll()[t].setActive(n.isActive),
      (e.getMeshObject().visible = n.isActive),
      e.setPosition(n.position.x, n.position.y, No.PARTICLE),
      e.setScale(n.scale);
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class nl extends vo {
  constructor() {
    super(), this.createSprite(Fo.getTexture(Oo.Plus10));
  }
  setUp(t, e) {
    this._meshObject.position.set(t.x, t.y, No.SCORE_EFFECT);
    const n = e ? Fo.getTexture(Oo.Minus1) : Fo.getTexture(Oo.Plus10);
    this.updateTexture(n);
    const i = 0.7 * Po.getInstance().scoreEffect.size_scale;
    this.setScale(i), (this.isActive = !0), (this._meshObject.visible = !0);
  }
}
class il {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_scoreEffectManager"),
      (this._pool = new So(() => new nl())),
      (this._scoreEffectManager = t);
  }
  spawn(t, e) {
    const n = this._pool.get();
    return n.setUp(t, e), n;
  }
  update() {
    const t = this._scoreEffectManager.getAll().length;
    if (0 != t) for (let e = 0; e < t; e++) this.updateScoringEffectVisual(e);
  }
  updateScoringEffectVisual(t) {
    const e = this._pool.getAll()[t],
      n = this._scoreEffectManager.getAll()[t];
    this._pool.getAll()[t].setActive(n.isActive),
      (e.getMeshObject().visible = n.isActive),
      e
        .getMeshObject()
        .position.set(n.getPosition().x, n.getPosition().y, No.SCORE_EFFECT);
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class rl extends wo {
  constructor() {
    super(),
      e(this, "_maxScale", 0),
      e(this, "_delayTime", 0),
      e(this, "_speed", 0),
      e(this, "_rotationSpeed", 0),
      e(this, "_type", 0);
  }
  getPosition() {
    return this.position;
  }
  getScale() {
    return this.scale;
  }
  setUp(t) {
    (this._type = t),
      0 == t
        ? ((this.position.x = Mo(-500, 500)),
          (this.position.y = Mo(-900, 900)),
          (this._delayTime = Eo(0, 1.2)),
          (this._speed = Eo(0.5, 1.2)),
          (this._maxScale = Eo(1, 2)),
          (this.scale = 0))
        : 1 == t
        ? ((this.position.x = Mo(-500, 500)),
          (this.position.y = Mo(-900, 900)),
          (this._delayTime = Eo(0, 1.5)),
          (this._speed = Eo(0.3, 0.6)),
          (this._maxScale = Eo(0.3, 0.6)),
          (this.scale = 0))
        : 2 == t &&
          ((this.position.x = Mo(-500, 500)),
          (this.position.y = 1e3),
          (this._delayTime = Eo(0, 0.7)),
          (this._speed = Eo(200, 500)),
          (this._maxScale = Eo(0.2, 0.6)),
          (this._rotationSpeed = Eo(30, 50)),
          (this.scale = this._maxScale)),
      (this.isActive = !0);
  }
  update(t) {
    this.isActive &&
      (0 == this._type || 1 == this._type
        ? (this._delayTime > 0 && (this._delayTime -= t),
          this._delayTime <= 0 &&
            (this.scale < this._maxScale
              ? (this.scale += this._speed * t)
              : (this.isActive = !1)))
        : 2 == this._type &&
          (this.position.y > -700
            ? ((this.position.y -= this._speed * t),
              (this.rotation.z += this._rotationSpeed * t))
            : (this.isActive = !1)));
  }
}
class sl {
  constructor() {
    e(this, "_pool"), (this._pool = new So(() => new rl()));
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update(t) {
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
  }
}
class al extends vo {
  constructor() {
    super(), this.createSprite(Fo.getTexture(Oo.Firework1));
  }
  setUp(t) {
    let e = Fo.getTexture(Oo.EffectStar);
    0 == t
      ? (e = Fo.fireworks[Mo(0, Fo.fireworks.length - 1)])
      : 1 == t
      ? (e = Fo.getTexture(Oo.EffectStar))
      : 2 == t && (e = Fo.confetties[Mo(0, Fo.confetties.length - 1)]),
      this.updateTexture(e);
  }
}
class ol {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_effectPopUpManager"),
      (this._pool = new So(() => new al())),
      (this._effectPopUpManager = t);
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update() {
    const t = this._effectPopUpManager.getAll().length;
    if (0 != t) for (let e = 0; e < t; e++) this.updateEffectPopUpVisual(e);
  }
  updateEffectPopUpVisual(t) {
    const e = this._pool.getAll()[t],
      n = this._effectPopUpManager.getAll()[t];
    this._pool.getAll()[t].setActive(n.isActive),
      (e.getMeshObject().visible = n.isActive),
      e.getMeshObject().position.set(n.getPosition().x, n.getPosition().y, 15),
      e.getMeshObject().scale.setScalar(n.getScale()),
      e.setRotation(0, 0, n.rotation.z);
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class ll {
  constructor() {
    e(this, "_particleManager"),
      e(this, "_particleVisualManager"),
      e(this, "_scoringEffectManager"),
      e(this, "_scoringEffectVisualManager"),
      e(this, "_fireworkManager"),
      e(this, "_fireworkVisualManager"),
      e(this, "_effectPopUpManager"),
      e(this, "_effectPopUpVisualManager"),
      (this._particleManager = new Ko()),
      (this._particleVisualManager = new el(this._particleManager)),
      (this._scoringEffectManager = new Jo()),
      (this._scoringEffectVisualManager = new il(this._scoringEffectManager)),
      (this._fireworkManager = new qo()),
      (this._fireworkVisualManager = new Qo(this._fireworkManager)),
      (this._effectPopUpManager = new sl()),
      (this._effectPopUpVisualManager = new ol(this._effectPopUpManager));
  }
  createParticle(t) {
    for (let e = 0; e < 10 * Po.getInstance().particle.spawn_rate; e++)
      this._particleManager.spawn(t, !1),
        this._particleVisualManager.spawn(t, !1);
  }
  createSmokeParticle(t) {
    for (let e = 0; e < 15; e++)
      this._particleManager.spawn(t, !0),
        this._particleVisualManager.spawn(t, !0);
  }
  updateParticles(t) {
    this._particleManager.update(t), this._particleVisualManager.update();
  }
  createScoringEffect(t, e) {
    this._scoringEffectManager.spawn(t, e),
      this._scoringEffectVisualManager.spawn(t, e);
  }
  updateScoringEffects(t) {
    this._scoringEffectManager.update(t),
      this._scoringEffectVisualManager.update();
  }
  createFirework(t) {
    let e = new To(0, 0);
    for (let n = 0; n < 10; n++)
      (e.x = t.x + Mo(-540, 540)),
        (e.y = t.y + Mo(-800, 800)),
        this._fireworkManager.spawn(e.clone()),
        this._fireworkVisualManager.spawn(e.clone());
  }
  updateFireworks(t) {
    this._fireworkManager.update(t), this._fireworkVisualManager.update();
  }
  createEffectPopUp(t) {
    if ((t > 2 && (t = 2), 0 == t))
      for (let e = 0; e < 10; e++)
        this._effectPopUpManager.spawn(t),
          this._effectPopUpVisualManager.spawn(t);
    if (1 == t)
      for (let e = 0; e < 20; e++)
        this._effectPopUpManager.spawn(t),
          this._effectPopUpVisualManager.spawn(t);
    if (2 == t)
      for (let e = 0; e < 20; e++)
        this._effectPopUpManager.spawn(t),
          this._effectPopUpVisualManager.spawn(t);
  }
  updateEffectPopUp(t) {
    this._effectPopUpManager.update(t), this._effectPopUpVisualManager.update();
  }
  updateEffects(t) {
    this.updateParticles(t),
      this.updateScoringEffects(t),
      this.updateFireworks(t);
  }
  resetEffects() {
    this._particleManager.reset(),
      this._particleVisualManager.reset(),
      this._scoringEffectManager.reset(),
      this._scoringEffectVisualManager.reset(),
      this._fireworkManager.reset(),
      this._fireworkVisualManager.reset();
  }
}
var cl = ((t) => (
  (t.Bgm = "bgm"),
  (t.CollectItem = "ci"),
  (t.Wrong = "w"),
  (t.Congrat = "c"),
  (t.GameOver = "go"),
  (t.Shoot = "sh"),
  (t.Hit = "h"),
  t
))(cl || {});
const hl = {
  bgm: "StreamingAssets/Audios/bg_sound.mp3",
  ci: "StreamingAssets/Audios/collect_item_sound.mp3",
  w: "StreamingAssets/Audios/wrong_sound.mp3",
  c: "StreamingAssets/Audios/congrat_sound.mp3",
  go: "StreamingAssets/Audios/game_over_sound.mp3",
  sh: "StreamingAssets/Audios/shooting_sound.mp3",
  h: "StreamingAssets/Audios/hit_sound.mp3",
};
function ul(t, e) {
  const n = t.position.x - t.width / 2 <= e.position.x + e.width / 2,
    i = t.position.x + t.width / 2 >= e.position.x - e.width / 2,
    r = t.position.y - t.height / 2 <= e.position.y + e.height / 2,
    s = t.position.y + t.height / 2 >= e.position.y - e.height / 2;
  return n && i && r && s;
}
class dl extends wo {
  constructor() {
    super(),
      e(this, "_direction"),
      e(this, "_speed", 600),
      e(this, "_isMoving", !1),
      e(this, "_widthLimit", 1620),
      e(this, "_heightLimit", 2880),
      (this._direction = new To(0, 0)),
      (this.width = yo.MAIN_CHARACTER_WIDTH),
      (this.height = yo.MAIN_CHARACTER_HEIGHT);
  }
  getDirection() {
    return this._direction;
  }
  setDirection(t) {
    this._direction = t;
  }
  get isMoving() {
    return this._isMoving;
  }
  move(t, e) {
    const n = t.x - this.position.x,
      i = t.y - this.position.y,
      r = Math.sqrt(n * n + i * i);
    (this.rotation.z = Math.atan2(i, n) * (180 / Math.PI) + 90),
      r < 10
        ? (this._isMoving = !1)
        : ((this._direction.x = n / r),
          (this._direction.y = i / r),
          (this.position.x += this._direction.x * e * this._speed),
          (this.position.y += this._direction.y * e * this._speed),
          this.position.x <= -this._widthLimit &&
            (this.position.x = -this._widthLimit),
          this.position.x >= this._widthLimit &&
            (this.position.x = this._widthLimit),
          this.position.y <= -this._heightLimit &&
            (this.position.y = -this._heightLimit),
          this.position.y >= this._heightLimit &&
            (this.position.y = this._heightLimit),
          (this._isMoving = !0));
  }
  reset() {
    (this.position = new To(0, 0)),
      (this._direction = new To(0, 0)),
      (this._isMoving = !1);
  }
}
class pl extends vo {
  constructor(t) {
    super(),
      e(this, "_mainCharacter"),
      e(this, "_animationTime", 0),
      e(this, "_animationTimeStep", 0.15),
      e(this, "_animationIndex", 0),
      (this._mainCharacter = t),
      this.createSprite(Do.currentCharacterTextures[0]),
      this.setPosition(0, 0, 5),
      this.setScale(0.75);
  }
  update(t) {
    this.setPosition(
      this._mainCharacter.position.x,
      this._mainCharacter.position.y,
      No.MAIN_CHARACTER
    ),
      this.setRotation(0, 0, this._mainCharacter.rotation.z),
      this._mainCharacter.isMoving && this.updateAnimation(t);
  }
  updateAnimation(t) {
    (this._animationTime += t),
      this._animationTime >= this._animationTimeStep &&
        ((this._animationTime = 0),
        this._animationIndex++,
        this._animationIndex >= Do.currentCharacterTextures.length &&
          (this._animationIndex = 0)),
      this.updateTexture(Do.currentCharacterTextures[this._animationIndex]);
  }
  reset() {
    this.setPosition(
      this._mainCharacter.position.x,
      this._mainCharacter.position.y,
      No.MAIN_CHARACTER
    );
  }
}
class fl {
  constructor() {
    e(this, "_sceneManager"),
      e(this, "_pointerPosition", new To(0, 0)),
      e(this, "_isPointerDown", !1),
      e(this, "_pointerEvent"),
      e(this, "setPointerPosition", (t) => {
        this._pointerEvent = t;
      }),
      (this._sceneManager = _o.getInstance());
  }
  updatePointerPosition() {
    if (!this._pointerEvent) return;
    const t = this._sceneManager.renderer.domElement.getBoundingClientRect(),
      e = this._sceneManager.width,
      n = this._sceneManager.height,
      i = (t.width - e) / 2,
      r = (t.height - n) / 2,
      s = ((this._pointerEvent.clientX - t.left - i) / e) * 2 - 1,
      a = (-(this._pointerEvent.clientY - t.top - r) / n) * 2 + 1,
      o = new Xe(s, a, 0);
    o.unproject(this._sceneManager.camera),
      (this._pointerPosition.x = o.x),
      (this._pointerPosition.y = o.y);
  }
  setPointerDownState(t) {
    (this._isPointerDown = t),
      console.log("Scene Pointer X =", this._pointerPosition),
      console.log("Scene Pointer Y =", this._pointerPosition);
  }
  get isPointerDown() {
    return this._isPointerDown;
  }
  resetIsPointerDown() {
    this._isPointerDown = !1;
  }
  get pointerPosition() {
    return this._pointerPosition;
  }
}
class ml extends wo {
  constructor() {
    super(),
      e(this, "_direction", new To(0, 0)),
      e(this, "_speed", 1e3),
      e(this, "_widthLimit", 1620),
      e(this, "_heightLimit", 2880),
      (this.width = yo.BULLET_HIGHT),
      (this.height = yo.BULLET_HIGHT);
  }
  getPosition() {
    return this.position;
  }
  getScale() {
    return this.scale;
  }
  setUp(t, e, n) {
    (this.position.x = t.x),
      (this.position.y = t.y),
      (this._direction = e),
      (this.scale = 0.4),
      (this.rotation.z = n),
      (this.isActive = !0);
  }
  update(t) {
    this.isActive &&
      (this.position.x > this._widthLimit ||
      this.position.x < -this._widthLimit ||
      this.position.y > this._heightLimit ||
      this.position.y < -this._heightLimit
        ? (this.isActive = !1)
        : ((this.position.x += this._direction.x * this._speed * t),
          (this.position.y += this._direction.y * this._speed * t)));
  }
}
class gl {
  constructor() {
    e(this, "_pool"),
      e(this, "_spawnTime", 0),
      e(this, "_spawnTimeMax", 0.3),
      e(this, "_canSpawn", !1),
      (this._pool = new So(() => new ml()));
  }
  get canSpawn() {
    return this._canSpawn;
  }
  spawn(t, e, n) {
    const i = this._pool.get();
    return i.setUp(t, e, n), (this._canSpawn = !1), i;
  }
  update(t) {
    (this._spawnTime += t),
      this._spawnTime >= this._spawnTimeMax &&
        ((this._spawnTime = 0), (this._canSpawn = !0));
    for (let e of this._pool.getAll()) e.update(t);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
    (this._spawnTime = 0), (this._spawnTimeMax = 0.3), (this._canSpawn = !1);
  }
}
class _l extends vo {
  constructor() {
    super(), this.createSprite(Do.currentBulletTextures[0]);
  }
  setUp(t) {
    this._meshObject.position.set(t.x, t.y, No.BULLET),
      this._meshObject.position.set(t.x, t.y, No.BULLET),
      (this.isActive = !0),
      (this._meshObject.visible = !0);
  }
}
class vl {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_bulletManager"),
      (this._pool = new So(() => new _l())),
      (this._bulletManager = t);
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update() {
    const t = this._bulletManager.getAll().length;
    if (0 != t) for (let e = 0; e < t; e++) this.updateBulletVisual(e);
  }
  updateBulletVisual(t) {
    const e = this._pool.getAll()[t],
      n = this._bulletManager.getAll()[t];
    e.setActive(n.isActive),
      (e.getMeshObject().visible = n.isActive),
      e.setPosition(n.getPosition().x, n.getPosition().y, No.BULLET),
      e.setRotation(0, 0, n.rotation.z),
      e.setScale(n.getScale());
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class xl extends wo {
  constructor() {
    super(),
      e(this, "_direction"),
      e(this, "_speed", 300),
      e(this, "canCollide", !1),
      e(this, "_canDelayDeactive", !1),
      e(this, "_delayDeactiveTime", 0),
      e(this, "_widthLimit", 1820),
      e(this, "_heightLimit", 3080),
      (this._direction = new To(0, 0)),
      (this.width = yo.ENEMY_WIDTH),
      (this.height = yo.ENEMY_HEIGHT);
  }
  getDirection() {
    return this._direction;
  }
  setDirection(t) {
    this._direction = t;
  }
  setUp() {
    Mo(0, 1) > 0
      ? (this.position.y = this._heightLimit)
      : (this.position.y = -this._heightLimit),
      (this.position.x = Mo(-this._widthLimit, this._widthLimit)),
      (this.scale = 0.75),
      (this._speed = Mo(300, 350)),
      (this._delayDeactiveTime = 0),
      (this._canDelayDeactive = !1),
      (this.canCollide = !0);
  }
  move(t, e) {
    this._canDelayDeactive &&
      ((this._delayDeactiveTime -= e),
      this._delayDeactiveTime < 0 &&
        ((this.isActive = !1), (this._canDelayDeactive = !1)));
    const n = t.x - this.position.x,
      i = t.y - this.position.y,
      r = Math.sqrt(n * n + i * i);
    r < 40 ||
      ((this._direction.x = n / r),
      (this._direction.y = i / r),
      (this.position.x += this._direction.x * e * this._speed),
      (this.position.y += this._direction.y * e * this._speed),
      (this.rotation.z = Math.atan2(i, n) * (180 / Math.PI) + 90));
  }
  delayDeactive() {
    (this._canDelayDeactive = !0), (this._delayDeactiveTime = 0.5);
  }
  reset() {
    (this.position = new To(0, 0)), (this._direction = new To(0, 0));
  }
}
class Sl {
  constructor() {
    e(this, "_pool"),
      e(this, "_spawnTime", 0),
      e(this, "_spawnTimeMax", 1),
      e(this, "_canSpawn", !1),
      (this._pool = new So(() => new xl()));
  }
  get canSpawn() {
    return this._canSpawn;
  }
  spawn() {
    const t = this._pool.get();
    return t.setUp(), (this._canSpawn = !1), t;
  }
  update(t, e) {
    (this._spawnTime += e),
      this._spawnTime >= this._spawnTimeMax &&
        ((this._spawnTime = 0),
        (this._spawnTimeMax = Eo(1.5, 3)),
        (this._canSpawn = !0));
    for (let n of this._pool.getAll()) n.move(t, e);
  }
  getAll() {
    return this._pool.getAll();
  }
  reset() {
    for (let t of this._pool.getAll()) t.isActive = !1;
    (this._spawnTime = 0), (this._spawnTimeMax = 1), (this._canSpawn = !1);
  }
}
class Ml extends vo {
  constructor() {
    super(),
      e(this, "_animationTime", 0),
      e(this, "_animationTimeStep", 0.15),
      e(this, "_animationIndex", 0),
      this.createSprite(Do.currentEnemyTextures[0]);
  }
  setUp(t) {
    this._meshObject.position.set(t.x, t.y, No.ENEMY),
      this._meshObject.position.set(t.x, t.y, No.ENEMY),
      (this._animationTime = 0),
      (this._animationIndex = 0),
      (this.isActive = !0),
      (this._meshObject.visible = !0);
  }
  updateAnimation(t) {
    this.isActive &&
      ((this._animationTime += t),
      this._animationTime >= this._animationTimeStep &&
        ((this._animationTime = 0),
        this._animationIndex++,
        this._animationIndex >= Do.currentEnemyTextures.length &&
          (this._animationIndex = 0)),
      this.updateTexture(Do.currentEnemyTextures[this._animationIndex]));
  }
}
class El {
  constructor(t) {
    e(this, "_pool"),
      e(this, "_enemyManager"),
      (this._pool = new So(() => new Ml())),
      (this._enemyManager = t);
  }
  spawn(t) {
    const e = this._pool.get();
    return e.setUp(t), e;
  }
  update(t) {
    const e = this._enemyManager.getAll().length;
    if (0 != e) for (let n = 0; n < e; n++) this.updateEnemyVisual(n, t);
  }
  updateEnemyVisual(t, e) {
    const n = this._pool.getAll()[t],
      i = this._enemyManager.getAll()[t];
    n.setActive(i.isActive),
      (n.getMeshObject().visible = i.isActive),
      n.setPosition(i.position.x, i.position.y, No.ENEMY),
      n.setRotation(0, 0, i.rotation.z),
      n.setScale(i.scale),
      n.updateAnimation(e);
  }
  reset() {
    for (let t of this._pool.getAll())
      (t.isActive = !1), (t.getMeshObject().visible = !1);
  }
}
class Tl {
  constructor() {
    e(this, "_gameBackgrounds", []);
  }
  create() {
    let t = -1080,
      e = 1920;
    for (let n = 0; n < 9; n++) {
      const i = new xo(Do.currentBgTextures[0]);
      i.setPosition(t, e, -20),
        this._gameBackgrounds.push(i),
        (t += 1080),
        (n + 1) % 3 == 0 && ((t = -1080), (e -= 1920));
    }
  }
  updateTexture() {
    for (const t of this._gameBackgrounds)
      t.updateTexture(Do.currentBgTextures[0]);
  }
}
class yl {
  constructor() {
    e(this, "_camera"), (this._camera = _o.getInstance().camera);
  }
  get position() {
    return new To(this._camera.position.x, this._camera.position.y);
  }
  updatePosition(t) {
    (this._camera.position.x = t.x),
      (this._camera.position.y = t.y),
      this._camera.position.x <= -1080 && (this._camera.position.x = -1080),
      this._camera.position.x >= 1080 && (this._camera.position.x = 1080),
      this._camera.position.y <= -1920 && (this._camera.position.y = -1920),
      this._camera.position.y >= 1920 && (this._camera.position.y = 1920);
  }
  reset() {
    (this._camera.position.x = 0), (this._camera.position.y = 0);
  }
}
class bl {
  constructor(t) {
    e(this, "_gameUI"),
      e(this, "_isUsingShieldBooster", !1),
      e(this, "_isUsingAbilityBooster", !1),
      e(this, "_shiedEffectTime", 0),
      e(this, "_abilityEffectTime", 0),
      e(this, "_shiedBoosterAmount", 0),
      e(this, "_abilityBoosterAmount", 0),
      e(this, "_shieldEffect"),
      e(this, "_abilityEffect"),
      (this._gameUI = t),
      (this._shieldEffect = new vo()),
      this._shieldEffect.createSprite(Fo.getTexture(Oo.ShieldEffect)),
      (this._shieldEffect.getMeshObject().visible = !1),
      (this._abilityEffect = new vo()),
      this._abilityEffect.createSprite(Fo.getTexture(Oo.MagnetEffect)),
      (this._abilityEffect.getMeshObject().visible = !1);
  }
  get isUsingShieldBooster() {
    return this._isUsingShieldBooster;
  }
  get isUsingAbilityBooster() {
    return this._isUsingAbilityBooster;
  }
  handleCollectShieldBooster() {
    this._isUsingShieldBooster
      ? (this._shiedBoosterAmount++,
        this._gameUI.setShieldBoosterText(this._shiedBoosterAmount))
      : this.useShieldBooster();
  }
  handleCollectAbilityBooster() {
    this._isUsingAbilityBooster
      ? (this._abilityBoosterAmount++,
        this._gameUI.setScoreBoosterText(this._abilityBoosterAmount))
      : this.useAbilityBooster();
  }
  handleClickShieldBoosterButton() {
    !this._isUsingShieldBooster &&
      this._shiedBoosterAmount > 0 &&
      (this.useShieldBooster(),
      this._shiedBoosterAmount--,
      this._gameUI.setShieldBoosterText(this._shiedBoosterAmount));
  }
  handleClickAbilityBoosterButton() {
    !this._isUsingShieldBooster &&
      this._abilityBoosterAmount > 0 &&
      (this.useAbilityBooster(),
      this._abilityBoosterAmount--,
      this._gameUI.setScoreBoosterText(this._abilityBoosterAmount));
  }
  useShieldBooster() {
    (this._isUsingShieldBooster = !0),
      (this._shieldEffect.getMeshObject().visible = !0),
      (this._shiedEffectTime = Po.getInstance().booster_shield.duration);
  }
  updateShieldEffectTime(t) {
    this._shiedEffectTime > 0 &&
      ((this._shiedEffectTime -= t),
      this._shiedEffectTime <= 0 &&
        ((this._isUsingShieldBooster = !1),
        (this._shieldEffect.getMeshObject().visible = !1)));
  }
  useAbilityBooster() {
    (this._isUsingAbilityBooster = !0),
      (this._abilityEffect.getMeshObject().visible = !0),
      (this._abilityEffectTime = Po.getInstance().booster_score.duration);
  }
  updateAbilityEffectTime(t) {
    this._abilityEffectTime > 0 &&
      ((this._abilityEffectTime -= t),
      this._abilityEffectTime <= 0 &&
        ((this._isUsingAbilityBooster = !1),
        (this._abilityEffect.getMeshObject().visible = !1)));
  }
  updateBoosterEffectTime(t) {
    this._isUsingShieldBooster && this.updateShieldEffectTime(t),
      this._isUsingAbilityBooster && this.updateAbilityEffectTime(t);
  }
  updateBoosterEffectOnCharacter(t) {
    this._shieldEffect.setPosition(t.x, t.y, No.MAIN_CHARACTER + 1),
      this._abilityEffect.setPosition(t.x, t.y, No.MAIN_CHARACTER + 2);
  }
}
const wl = class t {
  constructor() {
    e(this, "_gameUI"),
      e(this, "_camera"),
      e(this, "_inputManager"),
      e(this, "_gameBackground"),
      e(this, "_effectBackgroundPopUp"),
      e(this, "_darkBackground"),
      e(this, "_mainCharacter"),
      e(this, "_mainCharacterVisual"),
      e(this, "_bulletManager"),
      e(this, "_bulletVisualManager"),
      e(this, "_enemyManager"),
      e(this, "_enemyVisualManager"),
      e(this, "_scoringItemManager"),
      e(this, "_scoringItemVisualManager"),
      e(this, "_boosterController"),
      e(this, "_effectObjectManager"),
      e(this, "_scoreGame"),
      e(this, "_liveGame"),
      e(this, "_plusScoreValue", 10),
      e(this, "_isPlaying", !1),
      e(this, "_gameSS", ""),
      e(this, "_isProduction", !1),
      e(this, "_canPlayPopUpEffect", !1),
      e(this, "_isPassedTargetScore", !1),
      e(this, "_spawnSpecialItemScore", 0),
      e(this, "_spawnSpecialItemScoreMax", 0),
      e(this, "_canSpawnSpecialItem", !1),
      e(this, "_stopCharacter", !1);
  }
  static getInstance() {
    return this._instance || (this._instance = new t()), this._instance;
  }
  initializeGameplay() {
    _o.getInstance().showBlackScene(!0),
      (this._isProduction = window.GetIsProduction()),
      (this._scoreGame = new l()),
      (this._liveGame = new Vo()),
      (this._gameUI = o.getInstance()),
      this._gameUI.changeGameUI(s.IDLE),
      (this._camera = new yl()),
      (this._inputManager = new fl()),
      (this._gameBackground = new Tl()),
      this._gameBackground.create(),
      (this._effectBackgroundPopUp = new xo(Fo.getTexture(Oo.DarkBackground))),
      (this._effectBackgroundPopUp.getMeshObject().visible = !1),
      this._effectBackgroundPopUp.setPosition(0, 0, 15),
      (this._darkBackground = new xo(Fo.getTexture(Oo.DarkBackground))),
      (this._darkBackground.getMeshObject().visible = !1),
      this._darkBackground.setPosition(0, 0, 14),
      (this._mainCharacter = new dl()),
      (this._mainCharacterVisual = new pl(this._mainCharacter)),
      (this._bulletManager = new gl()),
      (this._bulletVisualManager = new vl(this._bulletManager)),
      (this._enemyManager = new Sl()),
      (this._enemyVisualManager = new El(this._enemyManager)),
      (this._scoringItemManager = new Lo()),
      (this._scoringItemVisualManager = new zo(this._scoringItemManager)),
      (this._boosterController = new bl(this._gameUI)),
      (this._effectObjectManager = new ll());
    const t = new Ho(),
      e = new ko(t);
    e.bindDependencies(this, this._boosterController),
      e.addListeners(
        window,
        _o.getInstance().renderer.domElement,
        this._gameUI,
        this._inputManager
      ),
      e.addEventListeners(),
      this._isProduction ||
        setTimeout(() => {
          this.startGame();
        }, 1e3);
  }
  pauseGame() {
    this._isPlaying = !1;
  }
  resumeGame(t) {
    (this._darkBackground.getMeshObject().visible = !1),
      console.log("data === ", t),
      (null == t ? void 0 : t.reward_score) &&
        (this._scoreGame.plus(t.reward_score),
        this._gameUI.setScoreText(
          this._scoreGame.getScore(),
          this._scoreGame.getTargetScore()
        ),
        this.updateByConfig()),
      (null == t ? void 0 : t.reward_live) &&
        (this._liveGame.plus(t.reward_live),
        this._gameUI.setLiveText(this._liveGame.getLive())),
      this._liveGame.getLive() > 0 ? (this._isPlaying = !0) : this.finishGame();
  }
  setGameSetting(t, e) {
    this._scoreGame.setTargetScore(t);
  }
  openGame() {
    window.GameSendStartGameSignal();
  }
  setGameSS(t) {
    this._gameSS = t;
  }
  getScoreGame() {
    return this._scoreGame.getScore();
  }
  startGame() {
    this.setUpGame(),
      (this._isPlaying = !0),
      (this._canPlayPopUpEffect = !0),
      _o.getInstance().showBlackScene(!1),
      this._gameUI.changeGameUI(s.PLAYING);
  }
  setUpGame() {
    Po.getInstance().updateConfigValues(0),
      Do.updateTexturesForScore(0),
      Xo.getInstance().setDefaultPopUps(),
      this._isProduction || this._scoreGame.setTargetScore(50),
      this._scoreGame.setScore(0),
      this._liveGame.setMaxLive(3),
      this._liveGame.setLive(this._liveGame.getMaxLive()),
      this._gameUI.setScoreText(
        this._scoreGame.getScore(),
        this._scoreGame.getTargetScore()
      ),
      this._gameUI.setLiveText(this._liveGame.getLive()),
      this._camera.reset(),
      this._mainCharacter.reset(),
      this._mainCharacterVisual.reset(),
      this._scoringItemManager.reset(),
      this._scoringItemVisualManager.reset(),
      this._enemyManager.reset(),
      this._enemyVisualManager.reset(),
      this._bulletManager.reset(),
      this._bulletVisualManager.reset(),
      this._effectObjectManager.resetEffects(),
      (this._isPassedTargetScore = !1),
      (this._stopCharacter = !1),
      this._inputManager.resetIsPointerDown(),
      r.play(cl.Bgm, !0);
  }
  replayGame() {
    this.startGame();
  }
  finishGame() {
    (this._isPlaying = !1),
      (this._canPlayPopUpEffect = !1),
      this._isProduction
        ? (this._gameUI.changeGameUI(s.IDLE),
          window
            .createSignature(this._gameSS, this._scoreGame.getScore())
            .then((t) => {
              window.GameSendSignature(t);
            }))
        : this._gameUI.changeGameUI(s.RESULT),
      r.pause(cl.Bgm),
      r.play(cl.GameOver);
  }
  update(t) {
    if (
      (this._canPlayPopUpEffect &&
        (this._effectObjectManager.updateFireworks(t),
        this._effectObjectManager.updateEffectPopUp(t)),
      this._isPlaying)
    ) {
      if (
        (this._inputManager.updatePointerPosition(),
        this._inputManager.isPointerDown &&
          !this._stopCharacter &&
          (this._mainCharacter.move(this._inputManager.pointerPosition, t),
          this._mainCharacterVisual.update(t),
          this._gameUI.showInstruction(!1),
          this._camera.updatePosition(this._mainCharacter.position),
          this._bulletManager.canSpawn &&
            (this._bulletManager.spawn(
              this._mainCharacter.position.clone(),
              this._mainCharacter.getDirection().clone(),
              this._mainCharacter.rotation.z
            ),
            this._bulletVisualManager.spawn(
              this._mainCharacter.position.clone()
            ),
            r.play(cl.Shoot, !1, 0.5))),
        this.handleBulletCollision(),
        this.handleCharacterCollision(),
        this._scoringItemManager.canSpawn && this.createScoringItem(),
        this._enemyManager.canSpawn &&
          (this._enemyManager.spawn(),
          this._enemyVisualManager.spawn(new To(0, 0))),
        this._enemyManager.update(this._mainCharacter.position.clone(), t),
        this._enemyVisualManager.update(t),
        this._bulletManager.update(t),
        this._bulletVisualManager.update(),
        this._boosterController.updateBoosterEffectTime(t),
        this._boosterController.updateBoosterEffectOnCharacter(
          this._mainCharacter.position
        ),
        this._boosterController.isUsingAbilityBooster)
      )
        for (let e = 0; e < this._scoringItemManager.getAll().length; e++) {
          const n = this._scoringItemManager.getAll()[e];
          n.isActive &&
            n.moveToCharacter(this._mainCharacter.position.clone(), t);
        }
      this._scoringItemManager.update(t),
        this._scoringItemVisualManager.update(t),
        this._effectObjectManager.updateEffects(t),
        this._darkBackground.setPosition(
          this._camera.position.x,
          this._camera.position.y,
          14
        ),
        this._effectBackgroundPopUp.setPosition(
          this._camera.position.x,
          this._camera.position.y,
          15
        );
    }
  }
  createScoringItem() {
    let t = Po.getInstance().scoringItem.spawn_rate,
      e = (t / (t + Po.getInstance().booster.spawn_rate)) * 100;
    if (Mo(0, 100) <= e) {
      let t = Uo.SCORING_ITEM;
      this._scoreGame.getScore() >= this._spawnSpecialItemScore &&
        this._canSpawnSpecialItem &&
        ((this._canSpawnSpecialItem = !1), (t = Uo.SPECIAL_ITEM));
      const e = this.findScoringItemTextureId(),
        n = this._scoringItemManager.spawn(this._mainCharacter.position, e, t);
      this._scoringItemVisualManager.spawn(n.position, 0, t);
    } else {
      let t = Po.getInstance().booster_shield.spawn_rate,
        e = (t / (t + Po.getInstance().booster_score.spawn_rate)) * 100;
      if (Mo(0, 100) <= e) {
        const t = this._scoringItemManager.spawn(
          this._mainCharacter.position,
          0,
          Uo.BOOSTER_SHIELD
        );
        this._scoringItemVisualManager.spawn(t.position, 0, Uo.BOOSTER_SHIELD);
      } else {
        const t = this._scoringItemManager.spawn(
          this._mainCharacter.position,
          0,
          Uo.BOOSTER_SCORE
        );
        this._scoringItemVisualManager.spawn(t.position, 0, Uo.BOOSTER_SCORE);
      }
    }
  }
  findScoringItemTextureId() {
    const t = Mo(0, 100),
      e = Po.getInstance().scoringItem.spawn_rate_items;
    let n = 0;
    for (let i = 0; i < e.length; i++) if (((n += e[i]), t < n)) return i;
    return 0;
  }
  handleBulletCollision() {
    let t = null,
      e = null;
    for (let n = 0; n < this._bulletManager.getAll().length; n++)
      if (((t = this._bulletManager.getAll()[n]), t.isActive))
        for (let i = 0; i < this._enemyManager.getAll().length; i++)
          (e = this._enemyManager.getAll()[i]),
            e.isActive &&
              ul(t, e) &&
              ((t.isActive = !1),
              (e.isActive = !1),
              r.play(cl.Hit),
              this.handleScore(e.position),
              this._effectObjectManager.createSmokeParticle(
                e.position.clone()
              ));
  }
  handleCharacterCollision() {
    let t = null,
      e = null;
    for (let n = 0; n < this._scoringItemManager.getAll().length; n++)
      (t = this._scoringItemManager.getAll()[n]),
        t.isActive &&
          ul(this._mainCharacter, t) &&
          ((t.isActive = !1), this.handleCollectItem(t));
    for (let n = 0; n < this._enemyManager.getAll().length; n++)
      (e = this._enemyManager.getAll()[n]),
        e.isActive &&
          e.canCollide &&
          ul(this._mainCharacter, e) &&
          (this._boosterController.isUsingShieldBooster
            ? ((e.isActive = !1),
              r.play(cl.Hit),
              this.handleScore(e.position),
              this._effectObjectManager.createSmokeParticle(e.position.clone()))
            : (this.handleOnLoseLive(),
              this._effectObjectManager.createSmokeParticle(
                this._mainCharacter.position.clone()
              ),
              (e.canCollide = !1),
              e.delayDeactive(),
              (this._stopCharacter = !0),
              setTimeout(() => {
                this._stopCharacter = !1;
              }, 500)));
  }
  handleCollectItem(t) {
    r.play(cl.CollectItem),
      t.type == Uo.SCORING_ITEM || t.type == Uo.SPECIAL_ITEM
        ? (this.handleScore(this._mainCharacter.position),
          this._effectObjectManager.createParticle(t.position),
          t.type == Uo.SPECIAL_ITEM && this.showSpecialItemPopUp())
        : t.type == Uo.BOOSTER_SHIELD
        ? (this._effectObjectManager.createParticle(t.position),
          this._boosterController.handleCollectShieldBooster())
        : t.type == Uo.BOOSTER_SCORE &&
          (this._effectObjectManager.createParticle(t.position),
          this._boosterController.handleCollectAbilityBooster()),
      this.updateByConfig();
  }
  handleScore(t) {
    this._effectObjectManager.createScoringEffect(t, !1),
      this._scoreGame.plus(this._plusScoreValue),
      this._gameUI.setScoreText(
        this._scoreGame.getScore(),
        this._scoreGame.getTargetScore()
      ),
      this.showScorePopUp(),
      this.showPassTargetScoreEffect();
  }
  updateByConfig() {
    Po.getInstance().updateConfigValues(this._scoreGame.getScore()),
      Do.updateTexturesForScore(this._scoreGame.getScore()),
      this._gameBackground.updateTexture();
    const t = Po.getInstance().specialItem.spawn_max_score;
    this._spawnSpecialItemScoreMax != t &&
      ((this._spawnSpecialItemScoreMax = t),
      (this._spawnSpecialItemScore = Mo(
        this._scoreGame.getScore(),
        this._spawnSpecialItemScoreMax
      )),
      (this._canSpawnSpecialItem = !0));
  }
  showPassTargetScoreEffect() {
    !this._isPassedTargetScore &&
      this._scoreGame.getScore() >= this._scoreGame.getTargetScore() &&
      ((this._isPassedTargetScore = !0),
      this._effectObjectManager.createFirework(this._camera.position),
      r.play(cl.Congrat));
  }
  handleOnLoseLive() {
    r.play(cl.Wrong),
      this._liveGame.minus(1),
      this._gameUI.setLiveText(this._liveGame.getLive()),
      this._effectObjectManager.createScoringEffect(
        this._mainCharacter.position.clone(),
        !0
      ),
      this._liveGame.getLive() <= 0 &&
        ((this._isPlaying = !1),
        this.finishGame(),
        this._scoreGame.getScore(),
        this._scoreGame.getTargetScore());
  }
  showScorePopUp() {
    if (Xo.getInstance().canShowScorePopUp(this._scoreGame.getScore()))
      if ((this.pauseGame(), Xo.getInstance().scorePopUpConfig.effect_enable)) {
        r.play(cl.Congrat);
        const t = Xo.getInstance().scorePopUpIndex - 1;
        (this._darkBackground.getMeshObject().visible = !0),
          this._effectBackgroundPopUp.updateTexture(Do.scorePopUpTextures[t]),
          (this._effectBackgroundPopUp.getMeshObject().visible = !0);
        const e = Xo.getInstance().scorePopUpConfig.effect_type,
          n = 1e3 * Xo.getInstance().scorePopUpConfig.effect_time;
        this._effectObjectManager.createEffectPopUp(e),
          setTimeout(() => {
            window.ShowPopUp(Xo.getInstance().scorePopUpConfig.html_code),
              (this._effectBackgroundPopUp.getMeshObject().visible = !1);
          }, n);
      } else window.ShowPopUp(Xo.getInstance().scorePopUpConfig.html_code);
  }
  showSpecialItemPopUp() {
    this._effectObjectManager.createFirework(this._camera.position),
      r.play(cl.Congrat);
  }
  showWinPopUp() {
    if (Xo.getInstance().canShowWinPopUp())
      if ((this.pauseGame(), Xo.getInstance().winPopUpConfig.effect_enable)) {
        r.play(cl.Congrat);
        const t = Xo.getInstance().winPopUpIndex - 1;
        (this._darkBackground.getMeshObject().visible = !0),
          this._effectBackgroundPopUp.updateTexture(Do.winPopUpTextures[t]),
          (this._effectBackgroundPopUp.getMeshObject().visible = !0);
        const e = Xo.getInstance().winPopUpConfig.effect_type,
          n = 1e3 * Xo.getInstance().winPopUpConfig.effect_time;
        this._effectObjectManager.createEffectPopUp(e),
          setTimeout(() => {
            window.ShowPopUp(Xo.getInstance().winPopUpConfig.html_code),
              (this._effectBackgroundPopUp.getMeshObject().visible = !1);
          }, n);
      } else window.ShowPopUp(Xo.getInstance().winPopUpConfig.html_code);
    else this.finishGame();
  }
  showLosePopUp() {
    if (Xo.getInstance().canShowLosePopUp())
      if ((this.pauseGame(), Xo.getInstance().losePopUpConfig.effect_enable)) {
        r.play(cl.GameOver);
        const t = Xo.getInstance().losePopUpIndex - 1;
        (this._darkBackground.getMeshObject().visible = !0),
          this._effectBackgroundPopUp.updateTexture(Do.losePopUpTextures[t]),
          (this._effectBackgroundPopUp.getMeshObject().visible = !0);
        const e = Xo.getInstance().losePopUpConfig.effect_type,
          n = 1e3 * Xo.getInstance().losePopUpConfig.effect_time;
        this._effectObjectManager.createEffectPopUp(e),
          setTimeout(() => {
            window.ShowPopUp(Xo.getInstance().losePopUpConfig.html_code),
              (this._effectBackgroundPopUp.getMeshObject().visible = !1);
          }, n);
      } else window.ShowPopUp(Xo.getInstance().losePopUpConfig.html_code);
    else this.finishGame();
  }
};
e(wl, "_instance");
let Al = wl;
(window.SendGameSettingDataToGame = function (t) {
  const e = JSON.parse(t),
    n = e.GameMinimumScore,
    i = e.MaxTime;
  Al.getInstance().setGameSetting(n, i);
}),
  (window.OpenGame = function () {
    _o.getInstance().showBlackScene(!0),
      Al.getInstance().openGame(),
      o.getInstance().changeGameUI(s.PLAYING);
  }),
  (window.GetPlayGameResponse = function (t) {
    Al.getInstance().setGameSS(t.ss), Al.getInstance().startGame();
  }),
  (window.createSignature = async function (t, e) {
    return await window.encryptScoreAndWait(t, e);
  }),
  (window.GetFinishGameResponse = function (t) {
    window.NativeSendScore(Al.getInstance().getScoreGame()),
      window.ShowFinishScene();
  }),
  (window.PlayGameAudio = function (t) {
    r.muteAll(!t), o.getInstance().setAudioBtnImage(r.isMute);
  });
class Cl {
  constructor() {
    e(this, "score", 0),
      e(this, "configLineData", {
        score: 0,
      }),
      e(this, "updateObjectData"),
      e(this, "prepareObjectData"),
      e(this, "createObjectData");
  }
  loadFromJson(t) {
    return (
      (this.configLineData = t),
      (this.score = this.configLineData.score),
      (this.updateObjectData = this.configLineData.update_objects),
      (this.prepareObjectData = this.configLineData.prepare_objects),
      (this.createObjectData = this.configLineData.create_objects),
      this
    );
  }
}
class Rl {
  constructor(t) {
    this.configLines = t;
  }
  findConfigLineByScore(t) {
    return this.configLines.find((e) => e.score === t);
  }
}
const Pl = class {
  static async loadConfigTextures(t, e) {
    var n, i, r, s, a, o, l;
    const c = e,
      h = [];
    for (const p of t.configLines) {
      const t = p.configLineData.update_objects,
        e = p.configLineData.prepare_objects,
        c = p.configLineData.create_objects;
      t &&
        Object.values(t).forEach((t) => {
          (null == t ? void 0 : t.image) && h.push(...t.image);
        }),
        c &&
          ((null == (n = c.score_pop_up) ? void 0 : n.image) &&
            h.push(...c.score_pop_up.image),
          (null == (i = c.destination) ? void 0 : i.image) &&
            h.push(...c.destination.image)),
        e &&
          ((null == (r = e.win_pop_up) ? void 0 : r.image) &&
            h.push(...e.win_pop_up.image),
          (null == (s = e.lose_pop_up) ? void 0 : s.image) &&
            h.push(...e.lose_pop_up.image),
          (null == (a = e.destination_pop_up) ? void 0 : a.image) &&
            h.push(...e.destination_pop_up.image),
          (null == (o = e.special_item_pop_up) ? void 0 : o.image) &&
            h.push(...e.special_item_pop_up.image),
          (null == (l = e.special_item) ? void 0 : l.image) &&
            h.push(...e.special_item.image));
    }
    const u = [...new Set(h)],
      d = [];
    for (const p of u) {
      const t = c + p,
        e = new Promise((e) => {
          this.textureLoader.load(
            t,
            (t) => {
              this.textures.set(p, t), e();
            },
            void 0,
            () => {
              console.warn(`Failed to load texture: ${t}`), e();
            }
          );
        });
      d.push(e);
    }
    return Promise.all(d).then(() => {
      console.log("=> Config textures loaded"),
        Do.setTextureFromConfig(t, this.textures);
    });
  }
};
e(Pl, "textures", new Map()),
  e(Pl, "loadingManager", new yr()),
  e(Pl, "textureLoader", new Cr(Pl.loadingManager));
let Ul = Pl;
const Il = class {
  static async loadNormalTextures(t) {
    const e = [];
    for (const n of Object.values(Oo)) {
      const i = t + Fo.texturePaths[n],
        r = new Promise((t, e) => {
          this.textureLoader.load(
            i,
            (e) => {
              Fo.setTexture(n, e), t();
            },
            void 0,
            () => e(`Failed to load texture: ${i}`)
          );
        });
      e.push(r);
    }
    return Promise.all(e).then(() => {
      console.log("=> Normal textures loaded"), Fo.setArrayTextures();
    });
  }
};
e(Il, "loadingManager", new yr()),
  e(Il, "textureLoader", new Cr(Il.loadingManager));
let Ll = Il;
class Dl {
  static async loadAll() {
    const t = Co.getInstance().getConfigs();
    t || console.log("configs not set in GameConfigs");
    const e = window.storageHostVar,
      n = Object.fromEntries(Object.entries(hl).map(([t, n]) => [t, e + n])),
      r = e + "StreamingAssets/Textures/";
    await Promise.all([
      Ll.loadNormalTextures(e),
      Ul.loadConfigTextures(t, r),
      i.loadAudios(n),
    ]),
      Do.setCurrentTexturesByScore(0),
      Po.getInstance().updateConfigValues(0),
      Xo.getInstance().setDefaultPopUps(),
      console.log("===> All assets loaded");
  }
}
class Nl {
  constructor() {
    e(this, "_deltaTime", 0), e(this, "_lastTime", performance.now());
  }
  update() {
    const t = performance.now();
    (this._deltaTime = (t - this._lastTime) / 1e3), (this._lastTime = t);
  }
  getDeltaTime() {
    return this._deltaTime;
  }
  reset() {
    (this._lastTime = performance.now()), (this._deltaTime = 0);
  }
}
class Ol {
  constructor() {
    e(this, "_sceneManager"),
      e(this, "_timeManager"),
      e(this, "_gameController"),
      e(this, "_isRunning", !1),
      (this._sceneManager = _o.getInstance()),
      (this._timeManager = new Nl()),
      (this._gameController = Al.getInstance()),
      this._gameController.initializeGameplay(),
      window.addEventListener("focus", () => {
        this._timeManager.reset();
      });
  }
  start() {
    (this._isRunning = !0), this.gameLoop();
  }
  gameLoop() {
    if (!this._isRunning) return;
    this._timeManager.update();
    let t = this._timeManager.getDeltaTime();
    (t = Math.min(t, 0.1)),
      this._sceneManager.update(),
      this._gameController.update(t),
      requestAnimationFrame(this.gameLoop.bind(this));
  }
}
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const t = (
        await fetch(
          window.storageHostVar + "StreamingAssets/game_setting.json"
        ).then((t) => t.json())
      ).map((t) => new Cl().loadFromJson(t)),
      e = new Rl(t);
    Co.getInstance().setConfigs(e),
      console.log("configLines == ", t),
      await Dl.loadAll(),
      console.log("====> Assets ready. Starting game...");
    new Ol().start(),
      window.GetIsProduction() &&
        (console.log("game loaded => open native"), window.GameOnReady()),
      setTimeout(() => {
        const t = document.getElementById("panel_loading");
        t && (t.style.display = "none");
      }, 500);
  } catch (t) {
    console.warn("====> Failed to load assets:", t);
  }
});
