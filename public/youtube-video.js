/*!
  * @juji/youtube-video-js v4.0.6
  * https://github.com/markcellus/youtube-video-js
  *
  * Copyright (c) 2024 Mark
  * Licensed under the MIT license
 */

/*!
 * @juji/youtube-video-js v4.0.7
 * https://github.com/markcellus/youtube-video-js
 *
 * Copyright (c) 2024 Mark
 * Licensed under the MIT license
 */

const t = new Map;
class e extends HTMLElement {
    static scriptLoadPromise = null;
    static triggerYoutubeIframeAPIReady = null;
    ytPlayer;
    paused = !0;
    ytPlayerContainer = void 0;
    resolveBuildPlayerPromise = null;
    ytPlayerPromise = null;
    scriptPath = "https://www.youtube.com/iframe_api";
    mediaError = void 0;
    id;
    constructor() {
        super();
        const e = this.getAttribute("id") || `ytPlayer-${t.size}`;
        t.set(this, e), this.id = e
    }
    connectedCallback() {
        this.ytPlayerContainer = this.createYTPlayerElement(), this.appendChild(this.ytPlayerContainer), this.ytPlayerContainer.style.display = "block", this.load()
    }
    disconnectedCallback() {
        t.delete(this), this.resolveBuildPlayerPromise && this.resolveBuildPlayerPromise(), this.ytPlayer && this.ytPlayer.destroy(), t.size || (t.clear(), this.unloadYTScript())
    }
    get height() {
        return Number(this.getAttribute("height"))
    }
    get width() {
        return Number(this.getAttribute("width"))
    }
    get src() {
        return this.getAttribute("src")
    }
    get autoplay() {
        return this.hasAttribute("autoplay")
    }
    get playsinline() {
        return this.hasAttribute("playsinline")
    }
    get controls() {
        return this.hasAttribute("controls")
    }
    get ytPlayerVars() {
        const {
            srcQueryParams: t
        } = this;
        return t.autoplay = this.autoplay ? 1 : 0, t.controls = this.controls ? 1 : 0, t.playsinline = this.playsinline ? 1 : 0, t.origin = window.location.origin, t
    }
    get srcQueryParams() {
        const t = this.src.split("?")[1] || "";
        if (!t) return {};
        const e = t.split("&"),
            r = {};
        for (const t of e) {
            const e = t.split("=", 2);
            1 === e.length ? r[e[0]] = "" : r[e[0]] = decodeURIComponent(e[1].replace(/\+/g, " "))
        }
        return r
    }
    async load() {
        return await this.loadYTScript(), this.ytPlayer = await this.buildPlayer(), this.ytPlayer
    }
    get videoId() {
        const t = new RegExp("https?:\\/\\/(?:[0-9A-Z-]+\\.)?(?:youtu\\.be\\/|youtube(?:-nocookie)?\\.com\\S*[^\\w\\s-])([\\w-]{11})(?=[^\\w-]|$)(?![?=&+%\\w.-]*(?:['\"][^<>]*>|<\\/a>))[?=&+%\\w.-]*", "ig");
        return this.src.replace(t, "$1")
    }

    getPlayer(){
      return this.ytPlayer
    }

    play() {
        this.paused = !1, this.src ? this.ytPlayer && this.ytPlayer.playVideo() : this.error = new Error("you cannot call play() method on a video element that has no youtube source url")
    }
    pause() {
        this.ytPlayer && this.ytPlayer.pauseVideo()
    }
    getVolume(){
        return this.ytPlayer && this.ytPlayer.getVolume()
    }
    setVolume(t) {
        this.ytPlayer && this.ytPlayer.setVolume(t)
    }
    seekTo(seconds, allowSeekAhead){
      this.ytPlayer && this.ytPlayer.seekTo(seconds, allowSeekAhead)
    }
    getCurrentTime(){
      return this.ytPlayer && this.ytPlayer.getCurrentTime()
    }
    createYTPlayerElement() {
        return document.createElement("div")
    }
    onPlay() {
        this.paused = !1, t.forEach(((t, e) => {
            e === this || e.paused || e.pause()
        })), this.dispatchEvent(new CustomEvent("play"))
    }
    onPause() {
        this.paused = !0
    }
    onEnd() {
        this.paused = !0
    }
    set error(t) {
        const {
            message: e
        } = t;
        throw this.dispatchEvent(new ErrorEvent(e)), this.mediaError = t, t
    }
    get error() {
        return this.mediaError
    }
    _onYTApiStateChange(t) {
        const e = {
                "-1": "unstarted",
                0: "ended",
                1: "playing",
                2: "pause",
                3: "buffering",
                5: "cued"
            } [t.data.toString()],
            r = {
                ended: this.onEnd,
                pause: this.onPause,
                playing: this.onPlay
            };
        if (r[e]) {
            const t = r[e];
            t && (t.call(this), this.dispatchEvent(new CustomEvent(e)))
        }
    }
    get loadScriptId() {
        return `youtube-video-${this.id}`
    }
    loadYTScript() {
        return e.scriptLoadPromise || (e.scriptLoadPromise = new Promise((t => {
            const r = window.onYouTubeIframeAPIReady;
            e.triggerYoutubeIframeAPIReady = t, window.onYouTubeIframeAPIReady = (...i) => {
                window.onYouTubeIframeAPIReady = null, e.triggerYoutubeIframeAPIReady(), r && r(...i), t()
            };
            const i = document.createElement("script");
            i.id = this.loadScriptId, i.src = this.scriptPath;
            const s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(i, s)
        }))), e.scriptLoadPromise
    }
    unloadYTScript() {
        const t = document.querySelector(`#${this.loadScriptId}`);
        t && t.remove(), e.scriptLoadPromise = null
    }
    buildPlayer() {
        return this.ytPlayerPromise || (this.ytPlayerPromise = new Promise((t => {
            const e = {
                events: {
                    onError: () => {
                        this.error = new Error("player could not be built")
                    },
                    onReady: e => {
                        this.dispatchEvent(new CustomEvent("loadstart")), this.dispatchEvent(new CustomEvent("canplay")), this.resolveBuildPlayerPromise = t, t(e.target)
                    },
                    onStateChange: t => this._onYTApiStateChange(t)
                },
                height: this.height,
                playerVars: this.ytPlayerVars,
                videoId: this.videoId,
                width: this.width
            };
            this.ytPlayer = new YT.Player(this.ytPlayerContainer, e)
        }))), this.ytPlayerPromise
    }
}
customElements.define("youtube-video", e);
export {
    e as YoutubeVideoElement
};
