var S = Object.defineProperty;
var M = (h, e, i) => e in h ? S(h, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : h[e] = i;
var c = (h, e, i) => (M(h, typeof e != "symbol" ? e + "" : e, i), i), N = (h, e, i) => {
  if (!e.has(h))
    throw TypeError("Cannot " + i);
};
var E = (h, e, i) => {
  if (e.has(h))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(h) : e.set(h, i);
};
var p = (h, e, i) => (N(h, e, "access private method"), i);
const $ = "marquee-component", g = "marquee-move", I = "marquee-slide", u = "marquee-mount", t = Object.freeze({
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical"
}), s = Object.freeze({
  LTR: "ltr",
  RTL: "rtl"
});
class a {
  static getElementOffset(e) {
    return {
      top: e.offsetTop,
      left: e.offsetLeft,
      right: innerWidth - e.offsetLeft - e.clientWidth,
      bottom: innerHeight - e.offsetTop - e.clientHeight
    };
  }
  static getChildren(e) {
    const i = e.children;
    return Array.from(i).filter((f) => f instanceof HTMLElement);
  }
  static getElementsSize(e, i, f) {
    let o = 0;
    return e.reduce((l, r) => {
      if (!l) {
        switch (i) {
          case t.HORIZONTAL:
            o = r.clientWidth;
            break;
          case t.VERTICAL:
            o = r.clientHeight;
            break;
        }
        return r;
      }
      const m = a.getElementOffset(l), n = a.getElementOffset(r);
      switch (`${i}-${f}`) {
        case `${t.HORIZONTAL}-${s.LTR}`:
          o = r.clientWidth + o + (n.left - m.left - l.clientWidth);
          break;
        case `${t.HORIZONTAL}-${s.RTL}`:
          o = r.clientWidth + o + (n.right - m.right - l.clientWidth);
          break;
        case `${t.VERTICAL}-${s.LTR}`:
          o = r.clientHeight + o + (n.top - m.top - l.clientHeight);
          break;
        case `${t.VERTICAL}-${s.RTL}`:
          o = r.clientHeight + o + (n.bottom - m.bottom - l.clientHeight);
          break;
      }
      return r;
    }, null), o;
  }
  static getScopeSize(e, i) {
    return i === t.HORIZONTAL ? e.offsetWidth : e.offsetHeight;
  }
  static getVisibleElements(e, i, f, o) {
    const l = [], r = [], m = (n, d) => {
      n ? r.push(d) : l.push(d);
    };
    return e.forEach((n) => {
      const d = a.getElementOffset(n);
      switch (`${i}-${f}`) {
        case `${t.HORIZONTAL}-${s.LTR}`:
          m(d.left + n.clientWidth <= o, n);
          break;
        case `${t.HORIZONTAL}-${s.RTL}`:
          m(d.right + n.clientWidth <= o, n);
          break;
        case `${t.VERTICAL}-${s.LTR}`:
          m(d.top + n.clientHeight <= o, n);
          break;
        case `${t.VERTICAL}-${s.RTL}`:
          m(d.bottom + n.clientHeight <= 0, n);
          break;
      }
    }), {
      visibleElements: l,
      inVisibleElements: r
    };
  }
}
var O, v, A, z, T, L, b, C, R, H, w;
customElements.get($) || customElements.define($, (w = class extends HTMLElement {
  constructor() {
    super(...arguments);
    E(this, O);
    E(this, A);
    E(this, T);
    E(this, b);
    E(this, R);
    c(this, "speed", 2);
    // speed per frame
    c(this, "mode", t.HORIZONTAL);
    c(this, "direction", s.LTR);
    c(this, "wrapper", document.createElement("div"));
    c(this, "scopeSize", 0);
    c(this, "wrapperSize", 0);
    c(this, "moveTo", 0);
    c(this, "point", 0);
    c(this, "frameInterval", 1e3 / 60);
    c(this, "previousTime", performance.now());
  }
  connectedCallback() {
    this.speed = Number(this.getAttribute("speed")) || 2, this.mode = this.getAttribute("mode") || t.HORIZONTAL, this.direction = this.getAttribute("dir") || s.LTR, this.addEventListener(u, () => {
      this.wrapper = this.querySelector(g), this.style.display = "block", this.style.overflow = "hidden", this.mode === "horizontal" ? (this.style.width = "100%", this.style.maxWidth = `${innerWidth}px`) : (this.style.height = this.style.height || "100vh", this.style.maxHeight = `${innerHeight}px`), this.scopeSize = a.getScopeSize(this, this.mode), this.wrapperSize = a.getElementsSize(a.getChildren(this.wrapper), this.mode, this.direction), p(this, O, v).call(this), p(this, A, z).call(this);
    });
  }
}, O = new WeakSet(), v = function() {
  const e = this.wrapper.innerHTML;
  for (; this.wrapperSize < this.scopeSize + this.scopeSize / 3; )
    this.wrapper.innerHTML = this.wrapper.innerHTML + e, this.wrapperSize = a.getElementsSize(a.getChildren(this.wrapper), this.mode, this.direction);
}, A = new WeakSet(), z = function() {
  this.moveTo = this.wrapperSize - this.scopeSize, this.mode === t.VERTICAL && this.direction === s.RTL && (this.moveTo = this.scopeSize - this.wrapperSize, p(this, T, L).call(this, this.moveTo)), requestAnimationFrame(p(this, R, H).bind(this));
}, T = new WeakSet(), L = function(e) {
  switch (`${this.mode}-${this.direction}`) {
    case `${t.HORIZONTAL}-${s.LTR}`:
      this.wrapper.style.transform = `translateX(-${Math.ceil(e)}px)`;
      break;
    case `${t.HORIZONTAL}-${s.RTL}`:
      this.wrapper.style.transform = `translateX(${Math.ceil(e)}px)`;
      break;
    case `${t.VERTICAL}-${s.LTR}`:
      this.wrapper.style.transform = `translateY(-${Math.ceil(e)}px)`;
      break;
    case `${t.VERTICAL}-${s.RTL}`:
      this.wrapper.style.transform = `translateY(${Math.ceil(e)}px)`;
      break;
  }
}, b = new WeakSet(), C = function() {
  return this.mode === t.VERTICAL && this.direction === s.RTL ? this.moveTo + this.point >= 0 : this.point >= this.moveTo;
}, R = new WeakSet(), H = function(e) {
  const f = (e - this.previousTime) / this.frameInterval, o = this.speed * f;
  if (this.previousTime = e, this.point = this.point + o, this.mode === t.VERTICAL && this.direction === s.RTL ? p(this, T, L).call(this, this.moveTo + this.point) : p(this, T, L).call(this, this.point), p(this, b, C).call(this)) {
    const { visibleElements: l, inVisibleElements: r } = a.getVisibleElements(a.getChildren(this.wrapper), this.mode, this.direction, this.point), m = a.getElementsSize(l, this.mode, this.direction);
    r.forEach((d) => {
      this.wrapper.appendChild(d);
    });
    const n = m - this.scopeSize;
    this.point = n > 0 ? n : 0, this.mode === t.VERTICAL && this.direction === s.RTL ? p(this, T, L).call(this, this.moveTo + this.point) : p(this, T, L).call(this, this.point);
  }
  requestAnimationFrame(p(this, R, H).bind(this));
}, w));
customElements.get(g) || customElements.define(g, class extends HTMLElement {
  constructor() {
    super();
    c(this, "mode", t.HORIZONTAL);
    c(this, "direction", s.LTR);
    const e = this.closest("marquee-component");
    e && (this.mode = e.getAttribute("mode") || t.HORIZONTAL, this.direction = e.getAttribute("dir") || s.LTR, this.style.display = "flex", this.mode === t.HORIZONTAL ? this.style.flexDirection = "row" : this.style.flexDirection = "column", this.mode === t.VERTICAL && this.direction === s.RTL && (this.style.flexDirection = "column-reverse"));
  }
  // on mount
  connectedCallback() {
    this.addEventListener(u, () => {
      const e = this.closest($);
      e && e.dispatchEvent(new Event(u));
    }, { once: !0 });
  }
});
customElements.get(I) || customElements.define(I, class extends HTMLElement {
  connectedCallback() {
    const h = this.closest(g);
    h && h.dispatchEvent(new Event(u));
  }
});
