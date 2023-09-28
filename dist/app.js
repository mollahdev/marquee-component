var v = Object.defineProperty;
var N = (n, e, i) => e in n ? v(n, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : n[e] = i;
var l = (n, e, i) => (N(n, typeof e != "symbol" ? e + "" : e, i), i), M = (n, e, i) => {
  if (!e.has(n))
    throw TypeError("Cannot " + i);
};
var E = (n, e, i) => {
  if (e.has(n))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(n) : e.set(n, i);
};
var c = (n, e, i) => (M(n, e, "access private method"), i);
const H = "marquee-component", O = "marquee-move", I = "marquee-slide", A = "marquee-mount", t = Object.freeze({
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
    return Array.from(i).filter((T) => T instanceof HTMLElement);
  }
  static getElementsSize(e, i, T) {
    let h = 0;
    return e.reduce((p, r) => {
      if (!p) {
        switch (i) {
          case t.HORIZONTAL:
            h = r.clientWidth;
            break;
          case t.VERTICAL:
            h = r.clientHeight;
            break;
        }
        return r;
      }
      const m = a.getElementOffset(p), o = a.getElementOffset(r);
      switch (`${i}-${T}`) {
        case `${t.HORIZONTAL}-${s.LTR}`:
          h = r.clientWidth + h + (o.left - m.left - p.clientWidth);
          break;
        case `${t.HORIZONTAL}-${s.RTL}`:
          h = r.clientWidth + h + (o.right - m.right - p.clientWidth);
          break;
        case `${t.VERTICAL}-${s.LTR}`:
          h = r.clientHeight + h + (o.top - m.top - p.clientHeight);
          break;
        case `${t.VERTICAL}-${s.RTL}`:
          h = r.clientHeight + h + (o.bottom - m.bottom - p.clientHeight);
          break;
      }
      return r;
    }, null), h;
  }
  static getScopeSize(e, i) {
    return i === t.HORIZONTAL ? e.offsetWidth : e.offsetHeight;
  }
  static getVisibleElements(e, i, T, h) {
    const p = [], r = [], m = (o, f) => {
      o ? r.push(f) : p.push(f);
    };
    return e.forEach((o) => {
      const f = a.getElementOffset(o);
      switch (`${i}-${T}`) {
        case `${t.HORIZONTAL}-${s.LTR}`:
          m(f.left + o.clientWidth <= h, o);
          break;
        case `${t.HORIZONTAL}-${s.RTL}`:
          m(f.right + o.clientWidth <= h, o);
          break;
        case `${t.VERTICAL}-${s.LTR}`:
          m(f.top + o.clientHeight <= h, o);
          break;
        case `${t.VERTICAL}-${s.RTL}`:
          m(f.bottom + o.clientHeight <= 0, o);
          break;
      }
    }), {
      visibleElements: p,
      inVisibleElements: r
    };
  }
}
var b, z, u, C, d, L, $, S, R, g, w;
customElements.get(H) || customElements.define(H, (w = class extends HTMLElement {
  constructor() {
    super(...arguments);
    E(this, b);
    E(this, u);
    E(this, d);
    E(this, $);
    E(this, R);
    l(this, "speed", 5);
    l(this, "mode", t.HORIZONTAL);
    l(this, "direction", s.LTR);
    l(this, "wrapper", document.createElement("div"));
    l(this, "scopeSize", 0);
    l(this, "wrapperSize", 0);
    l(this, "moveTo", 0);
    l(this, "point", 0);
  }
  connectedCallback() {
    this.speed = Number(this.getAttribute("speed")) || 5, this.mode = this.getAttribute("mode") || t.HORIZONTAL, this.direction = this.getAttribute("dir") || s.LTR, this.addEventListener(A, () => {
      this.wrapper = this.querySelector(O), this.style.display = "block", this.style.overflow = "hidden", this.mode === "horizontal" ? (this.style.width = "100%", this.style.maxWidth = `${innerWidth}px`) : (this.style.height = this.style.height || "100vh", this.style.maxHeight = `${innerHeight}px`), this.scopeSize = a.getScopeSize(this, this.mode), this.wrapperSize = a.getElementsSize(a.getChildren(this.wrapper), this.mode, this.direction), c(this, b, z).call(this), c(this, u, C).call(this);
    });
  }
}, b = new WeakSet(), z = function() {
  const e = this.wrapper.innerHTML;
  for (; this.wrapperSize < this.scopeSize + this.scopeSize / 3; )
    this.wrapper.innerHTML = this.wrapper.innerHTML + e, this.wrapperSize = a.getElementsSize(a.getChildren(this.wrapper), this.mode, this.direction);
}, u = new WeakSet(), C = function() {
  this.moveTo = this.wrapperSize - this.scopeSize, this.mode === t.VERTICAL && this.direction === s.RTL && (this.moveTo = this.scopeSize - this.wrapperSize, c(this, d, L).call(this, this.moveTo)), c(this, R, g).call(this);
}, d = new WeakSet(), L = function(e) {
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
}, $ = new WeakSet(), S = function() {
  return this.mode === t.VERTICAL && this.direction === s.RTL ? this.moveTo + this.point >= 0 : this.point >= this.moveTo;
}, R = new WeakSet(), g = function() {
  if (this.point = this.point + Number(this.speed), this.mode === t.VERTICAL && this.direction === s.RTL ? c(this, d, L).call(this, this.moveTo + this.point) : c(this, d, L).call(this, this.point), c(this, $, S).call(this)) {
    const { visibleElements: e, inVisibleElements: i } = a.getVisibleElements(a.getChildren(this.wrapper), this.mode, this.direction, this.point), T = a.getElementsSize(e, this.mode, this.direction);
    i.forEach((h) => {
      this.wrapper.appendChild(h);
    }), this.point = T - this.scopeSize, this.mode === t.VERTICAL && this.direction === s.RTL ? c(this, d, L).call(this, this.moveTo + this.point) : c(this, d, L).call(this, this.point), requestAnimationFrame(() => c(this, R, g).call(this));
  } else
    requestAnimationFrame(() => c(this, R, g).call(this));
}, w));
customElements.get(O) || customElements.define(O, class extends HTMLElement {
  constructor() {
    super();
    l(this, "mode", t.HORIZONTAL);
    l(this, "direction", s.LTR);
    const e = this.closest("marquee-component");
    e && (this.mode = e.getAttribute("mode") || t.HORIZONTAL, this.direction = e.getAttribute("dir") || s.LTR, this.style.display = "flex", this.mode === t.HORIZONTAL ? this.style.flexDirection = "row" : this.style.flexDirection = "column", this.mode === t.VERTICAL && this.direction === s.RTL && (this.style.flexDirection = "column-reverse"));
  }
  // on mount
  connectedCallback() {
    this.addEventListener(A, () => {
      const e = this.closest(H);
      e && e.dispatchEvent(new Event(A));
    }, { once: !0 });
  }
});
customElements.get(I) || customElements.define(I, class extends HTMLElement {
  connectedCallback() {
    const n = this.closest(O);
    n && n.dispatchEvent(new Event(A));
  }
});
