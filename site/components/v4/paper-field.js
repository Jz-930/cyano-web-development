// Paper field (v4): a single fixed WebGL2 canvas behind every paper (light)
// surface of the site. Dark sections are opaque and simply cover it.
//
// Motif: mathematical line families, drawn as real instanced geometry.
//   ribbons   cubic Bézier spines, each carrying a helix of hairline strands
//             (a twisted ruled surface seen flat), control points slowly drifting
//   accents   in the gutters, alternating: a phyllotaxis rosette of counter-rotating
//             logarithmic spirals (r = a·e^(bθ)) and a nested family of Bernoulli
//             lemniscates (∞)
//   pulses    a few strands carry a short bright head travelling along the curve
// Every strand is a triangle strip generated entirely in the vertex shader from
// gl_VertexID / gl_InstanceID (no vertex buffers), extruded to a sub-pixel,
// analytically anti-aliased line.
//
// Per frame: strands -> scene target; scene -> separable Gaussian at 1/4 (glow)
// and 1/8 (frost); composite. Behind live text the scene is swapped for the 1/8
// blur under a paper veil: a frosted-glass pane computed on the GPU, with no DOM
// boxes and no per-frame backdrop-filter cost. Text panes come from a
// document-space mask of measured text blocks; sticky containers are tracked per
// frame as analytic rounded-rect panes.

const CURVE_VS = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uView;
uniform float uScrollP;
uniform float uScale;
uniform vec2 uPtr;
uniform float uPtrAmt;
uniform int uKind;
uniform int uJ0;
uniform int uPer;
uniform float uSeg;
uniform float uWidth;
uniform float uAlpha;
uniform float uSeedOff;
uniform float uYOff;
out float vT;
out float vSide;
out float vHW;
out float vA;
out float vG;
out float vSeed;
const float PI=3.14159265;
const float SPAN=340.;
float hash(float n){return fract(sin(n*127.1+311.7)*43758.5453);}
vec2 bez(vec2 a,vec2 b,vec2 c,vec2 d,float t){float u=1.-t;return u*u*u*a+3.*u*u*t*b+3.*u*t*t*c+t*t*t*d;}
// Field-space position (CSS px; y scrolls at parallax rate) of strand idx of family j at t.
vec2 curve(float jj,float s,float idx,float t,out float depth,out bool skip){
  float j=jj+uSeedOff;
  float h1=hash(j*7.1),h2=hash(j*3.7+1.),h3=hash(j*5.3+2.),h4=hash(j*9.1+3.);
  float h5=hash(j*2.9+4.),h6=hash(j*4.3+5.),h7=hash(j*6.7+6.);
  float Y=jj*SPAN+uYOff,W=uView.x,T=uTime;
  skip=false;
  if(uKind==0){
    // Twisted Bézier ribbon.
    vec2 a=vec2(-.12*W,Y+(h1-.5)*380.);
    vec2 d=vec2(1.12*W,Y+(h2-.5)*380.);
    vec2 b=vec2((.26+.08*sin(T*.05+h3*6.28))*W,Y+(h4-.5)*760.+70.*sin(T*.07+h5*6.));
    vec2 c=vec2((.72+.08*cos(T*.045+h6*6.28))*W,Y-(h4-.5)*680.+70.*cos(T*.06+h7*6.));
    vec2 p=bez(a,b,c,d,t);
    vec2 tg=bez(a,b,c,d,t+.003)-p;
    vec2 n=normalize(vec2(-tg.y,tg.x)+1e-6);
    float w=(46.+96.*h5)*(.2+.8*sin(PI*clamp(t,0.,1.)))*(1.+.18*sin(T*.21+h1*6.));
    float th=h7*6.28+t*(2.+2.4*h3)*PI+T*.11+s*PI;
    depth=sin(th);
    return p+n*w*cos(th);
  }
  // Gutter accents: only on some families, alternating sides and kinds.
  if(hash(j*11.3)>.45){skip=true;depth=0.;return vec2(0.);}
  bool left=mod(jj,2.)<.5;
  vec2 ctr=vec2((left?.05:.95)*W,Y+SPAN*.5);
  if(mod(floor(jj/2.),2.)<.5){
    // Phyllotaxis rosette: counter-rotating logarithmic spirals.
    float dir=mod(idx,2.)<.5?1.:-1.;
    float th=t*4.2*PI;
    float r=22.*exp(.17*th);
    float ang=dir*th+6.2832*s+T*.025*dir;
    depth=cos(th*.35+s*12.57+T*.2);
    return ctr+r*vec2(cos(ang),sin(ang));
  }
  // Nested Bernoulli lemniscates.
  float a=110.+250.*s;
  float ph=t*2.*PI;
  float k=1.+sin(ph)*sin(ph);
  vec2 q=a*vec2(cos(ph),sin(ph)*cos(ph))/k;
  float rot=(h2-.5)*.7+s*.35+T*.012;
  depth=sin(ph*2.+s*6.28+T*.25);
  return ctr+mat2(cos(rot),sin(rot),-sin(rot),cos(rot))*q;
}
vec2 toScreen(vec2 f){
  vec2 p=vec2(f.x,f.y-uScrollP);
  vec2 d=p-uPtr;
  // Strands part softly around the pointer.
  return p+normalize(d+1e-4)*uPtrAmt*16.*exp(-dot(d,d)/(160.*160.));
}
void main(){
  float fam=float(uJ0+gl_InstanceID/uPer);
  float idx=float(gl_InstanceID-(gl_InstanceID/uPer)*uPer);
  float s=idx/float(uPer-1);
  float k=float(gl_VertexID>>1);
  float side=(gl_VertexID&1)==0?-1.:1.;
  float t=k/uSeg;
  float depth,dd;
  bool skip,sk2;
  vec2 p=toScreen(curve(fam,s,idx,t,depth,skip));
  vec2 p2=toScreen(curve(fam,s,idx,t+1./uSeg,dd,sk2));
  if(skip){gl_Position=vec4(2.,2.,2.,1.);vT=0.;vSide=0.;vHW=0.;vA=0.;vG=0.;vSeed=1.;return;}
  vec2 tg=p2-p;
  vec2 n=normalize(vec2(-tg.y,tg.x)+1e-6);
  float hw=uWidth*.5;
  float ext=hw+1./uScale;
  vec2 q=p+n*side*ext;
  gl_Position=vec4(q.x/uView.x*2.-1.,1.-q.y/uView.y*2.,0.,1.);
  vT=t;
  vSide=side*ext;
  vHW=hw;
  float ends=uKind==0?smoothstep(0.,.06,t)*smoothstep(1.,.94,t):1.;
  vA=uAlpha*mix(.22,1.,.5+.5*depth)*ends;
  vG=.5+.5*sin(p.x/uView.x*2.2+fam*1.3+s*1.6+uTime*.05);
  vSeed=hash(fam*31.7+idx*1.618+float(uKind)*5.);
}`;

const CURVE_FS = `#version 300 es
precision highp float;
in float vT;
in float vSide;
in float vHW;
in float vA;
in float vG;
in float vSeed;
uniform float uTime;
uniform float uScale;
out vec4 o;
const vec3 MIST=vec3(.48,.78,.84);
const vec3 CYAN=vec3(.22,.784,.878);
const vec3 BRAND=vec3(.22,.596,.659);
const vec3 AZURE=vec3(.33,.58,.84);
vec3 ramp(float g){
  if(g<.34)return mix(MIST,CYAN,g/.34);
  if(g<.68)return mix(CYAN,BRAND,(g-.34)/.34);
  return mix(BRAND,AZURE,(g-.68)/.32);
}
void main(){
  float cov=clamp((vHW+.5/uScale-abs(vSide))*uScale,0.,1.);
  vec3 col=ramp(vG);
  float a=vA*cov;
  if(vSeed<.16){
    // Data pulse: sharp head, exponential tail behind it.
    float p=fract(vT*.8-uTime*(.035+.4*vSeed)+vSeed*13.);
    float q=p-.5;
    float pl=q<0.?exp(q*30.):exp(-q*420.);
    a+=cov*pl*.5;
    col=mix(col,CYAN,pl);
  }
  o=vec4(col*a,a);
}`;

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

// 9-tap Gaussian via 5 linear-filtered fetches; uDir is in source UV units.
const BLUR_FS = `#version 300 es
precision mediump float;
uniform sampler2D uSrc;
uniform vec2 uRes;
uniform vec2 uDir;
out vec4 o;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec4 c=texture(uSrc,uv)*.227027;
  c+=(texture(uSrc,uv+uDir*1.384615)+texture(uSrc,uv-uDir*1.384615))*.316216;
  c+=(texture(uSrc,uv+uDir*3.230769)+texture(uSrc,uv-uDir*3.230769))*.070270;
  o=c;
}`;

const COMPOSITE_FS = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uScale;
uniform float uScrollY;
uniform sampler2D uScene;
uniform sampler2D uGlow;
uniform sampler2D uFrost;
uniform sampler2D uMask;
uniform vec2 uMaskDoc;
// Panes for sticky/fixed text containers, in viewport CSS px: (x, y, w, h).
uniform vec4 uPanes[8];
uniform int uPaneN;
out vec4 o;
vec4 overP(vec4 dst,vec4 src){return src+dst*(1.-src.a);}
float roundBox(vec2 p,vec4 r){
  vec2 c=r.xy+r.zw*.5;vec2 q=abs(p-c)-r.zw*.5+18.;
  return length(max(q,0.))+min(max(q.x,q.y),0.)-18.;
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uScale;
  vec4 acc=overP(texture(uGlow,uv)*.55,texture(uScene,uv));

  float mr=texture(uMask,vec2(px.x/uMaskDoc.x,(px.y+uScrollY)/uMaskDoc.y)).r;
  for(int i=0;i<8;i++){
    if(i>=uPaneN)break;
    mr=max(mr,1.-smoothstep(-2.5,2.5,roundBox(px,uPanes[i])));
  }
  // Glass only where there is line work behind the text: the veil scales with the
  // local density of the blurred scene, so empty paper never shows a box.
  vec4 fr=texture(uFrost,uv);
  float need=smoothstep(.004,.05,fr.a);
  float m=smoothstep(.2,.8,mr)*need;
  // The veil keeps every pane at least as light as bare paper, so text contrast never drops.
  vec4 pane=overP(fr*.9,vec4(vec3(.74),.74));
  vec4 res=mix(acc,pane,m);
  // Rim light where the pane meets the field, like the polished edge of glass.
  float rim=1.-abs(mr-.5)*2.;
  rim=rim*rim*rim*.45*need;
  o=overP(res,vec4(vec3(rim),rim));
}`;

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,th,td,summary,a,.eyebrow,.label,.tag,.figure,button,input,select,textarea,[class*='badge'],[class*='chip'],[class*='pill']";
const RANGE_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "DT", "DD", "BLOCKQUOTE", "FIGCAPTION", "LABEL", "TH", "TD",
]);
const PARALLAX = 0.45;
const SPAN = 340;
// Two ribbon depths: the far layer is finer, fainter and slower, offset half a span.
const RIBBON = { per: 72, seg: 180, width: 0.6, alpha: 0.27, parallax: PARALLAX, seed: 0, yOff: 0 };
const RIBBON_FAR = { per: 64, seg: 160, width: 0.45, alpha: 0.14, parallax: 0.25, seed: 97, yOff: 170 };
const ACCENT = { per: 30, seg: 240, width: 0.55, alpha: 0.14, parallax: PARALLAX, seed: 0, yOff: 0 };
let mounted = false;

/**
 * @param {HTMLElement} host
 * @returns {{ refresh: () => void; dispose: () => void }}
 */
export function mountPaperField(host) {
  const noop = { refresh() {}, dispose() {} };
  if (mounted) return noop;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) return noop;

  /** @param {number} type @param {string} src */
  const compile = (type, src) => {
    const s = /** @type {WebGLShader} */ (gl.createShader(type));
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw Error("paper-field shader: " + gl.getShaderInfoLog(s));
    }
    return s;
  };
  /** @param {string} vs @param {string} fs */
  const link = (vs, fs) => {
    const p = /** @type {WebGLProgram} */ (gl.createProgram());
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw Error("paper-field link: " + gl.getProgramInfoLog(p));
    }
    /** @type {Record<string, WebGLUniformLocation | null>} */
    const u = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      if (info) u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return { p, u };
  };

  const media = matchMedia("(prefers-reduced-motion: reduce)");
  const coarse = matchMedia("(max-width: 800px), (pointer: coarse)");
  // QA override (?paperfield=live|static) for environments that emulate reduced motion.
  const force = new URLSearchParams(location.search).get("paperfield");
  const live = () =>
    force === "live" || (force !== "static" && !media.matches && !coarse.matches);

  let curves, blur, composite;
  try {
    curves = link(CURVE_VS, CURVE_FS);
    blur = link(QUAD_VS, BLUR_FS);
    composite = link(QUAD_VS, COMPOSITE_FS);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn(err);
    return noop;
  }
  mounted = true;
  host.append(canvas);

  // Full-screen triangle; strands need no buffers at all.
  const quadVao = gl.createVertexArray();
  const quadBuf = gl.createBuffer();
  gl.bindVertexArray(quadVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const emptyVao = gl.createVertexArray();
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /** @param {number} w @param {number} h @param {TexImageSource | null} [src] */
  const texture = (w, h, src = null) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (src) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return t;
  };

  /** @typedef {{ tex: WebGLTexture | null; fb: WebGLFramebuffer | null; w: number; h: number }} Target */
  /** @param {number} w @param {number} h @returns {Target} */
  const target = (w, h) => {
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    const tex = texture(w, h);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb, w, h };
  };

  // scene (full), glow 1/4 (a,b), frost 1/8 (a,b); reallocated on resize.
  /** @type {Target[]} */
  let chain = [];
  const allocTargets = () => {
    for (const t of chain) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fb);
    }
    const W = canvas.width;
    const H = canvas.height;
    chain = [
      target(W, H),
      target(W / 4, H / 4),
      target(W / 4, H / 4),
      target(W / 8, H / 8),
      target(W / 8, H / 8),
    ];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  // ---------------------------------------------------------------- text mask
  const maskCanvas = document.createElement("canvas");
  const mctx = /** @type {CanvasRenderingContext2D} */ (maskCanvas.getContext("2d"));
  const blurOk = "filter" in mctx;
  let maskTex = texture(1, 1);
  let maskScale = 0.25;
  let maskDoc = [1, 1];
  let maskDirty = true;
  /** @type {Map<Element, { rects: number[][] | null; dark: boolean }>} */
  const sections = new Map();
  /** @type {number[][]} */
  let darkSpans = [];
  /** @type {Set<Element>} */
  const pinned = new Set();
  const panes = new Float32Array(32);

  /** @param {Element} el */
  const isDark = (el) => {
    if (el.matches(".dark, [data-surface='dark']")) return true;
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    if (!m || (m[3] !== undefined && +m[3] < 0.9)) return false;
    return 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2] < 60;
  };

  /**
   * Merge text boxes that sit within a reading gap of each other into one slab,
   * so a heading block, a list or a paragraph run gets a single glass pane
   * rather than ragged per-line shapes.
   * @param {number[][]} rects
   */
  const cluster = (rects) => {
    const G = 14;
    const out = rects.map((r) => [r[0], r[1], r[0] + r[2], r[1] + r[3]]);
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < out.length && !merged; i++) {
        for (let j = i + 1; j < out.length; j++) {
          const a = out[i];
          const b = out[j];
          if (a[0] - G < b[2] + G && b[0] - G < a[2] + G && a[1] - G < b[3] + G && b[1] - G < a[3] + G) {
            out[i] = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
            out.splice(j, 1);
            merged = true;
            break;
          }
        }
      }
    }
    return out.map((r) => [r[0], r[1], r[2] - r[0], r[3] - r[1]]);
  };

  /** @param {Element} sec */
  const measure = (sec) => {
    const entry = sections.get(sec);
    if (!entry || entry.dark) return;
    const base = sec.getBoundingClientRect();
    const range = document.createRange();
    /** @type {number[][]} */
    const rects = [];
    /** @type {Map<Element, boolean>} */
    const opaque = new Map();
    /** Text already sitting on a card, image or panel needs no pane. @param {Element} el */
    const onSurface = (el) => {
      for (let p = el.parentElement; p && p !== sec; p = p.parentElement) {
        let v = opaque.get(p);
        if (v === undefined) {
          const cs = getComputedStyle(p);
          const a = cs.backgroundColor.match(/[\d.]+/g);
          v = (!!a && (a[3] === undefined || +a[3] >= 0.85)) || cs.backgroundImage !== "none";
          opaque.set(p, v);
        }
        if (v) return true;
      }
      return false;
    };
    /** Nearest sticky/fixed ancestor inside the section, if any. @param {Element} el */
    const pinnedHost = (el) => {
      for (let p = el.parentElement; p && p !== sec; p = p.parentElement) {
        const pos = getComputedStyle(p).position;
        if (pos === "sticky" || pos === "fixed") return p;
      }
      return null;
    };
    const nodes = sec.querySelectorAll(TEXT_SELECTOR);
    for (let i = 0; i < nodes.length && rects.length < 1500; i++) {
      const el = nodes[i];
      const darkHost = el.closest(".dark, [data-surface='dark']");
      if ((darkHost && darkHost !== sec) || onSurface(el)) continue;
      const pin = pinnedHost(el);
      if (pin) {
        // Moves with the viewport: tracked per frame as an analytic pane instead.
        pinned.add(pin);
        continue;
      }
      let r = el.getBoundingClientRect();
      if (RANGE_TAGS.has(el.tagName)) {
        // Tight text extent; ignore ranges that overflow their element (markers, skipped content).
        range.selectNodeContents(el);
        const t = range.getBoundingClientRect();
        if (t.width && t.height <= r.height + 4) r = t;
      }
      // Skip empty boxes and whole-container wrappers (e.g. a link around a card).
      if (r.width < 2 || r.height < 2 || (r.height > 420 && !RANGE_TAGS.has(el.tagName))) continue;
      rects.push([r.left - base.left, r.top - base.top, r.width, r.height]);
    }
    entry.rects = cluster(rects);
    maskDirty = true;
    requestDraw();
  };

  const sectionIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) measure(e.target);
    },
    { rootMargin: "60% 0px" },
  );
  const sectionRO = new ResizeObserver((entries) => {
    for (const e of entries) {
      const entry = sections.get(e.target);
      if (entry) entry.rects = null;
    }
    // Re-measure the ones in range; the rest re-measure when they approach.
    sectionIO.disconnect();
    for (const sec of sections.keys()) sectionIO.observe(sec);
    maskDirty = true;
    requestDraw();
  });

  const collect = () => {
    sectionIO.disconnect();
    sectionRO.disconnect();
    sections.clear();
    pinned.clear();
    const main = document.querySelector("main");
    const list = [
      ...(main ? [...main.children] : []),
      ...document.querySelectorAll("body > footer, .footer"),
    ].filter((el) => el.tagName !== "SCRIPT");
    for (const sec of list) {
      sections.set(sec, { rects: null, dark: isDark(sec) });
      sectionIO.observe(sec);
      sectionRO.observe(sec);
    }
    maskDirty = true;
    requestDraw();
  };

  const rebuildMask = () => {
    maskDirty = false;
    const de = document.documentElement;
    const docW = de.clientWidth;
    const docH = Math.max(de.scrollHeight, innerHeight);
    maskScale = Math.min(0.25, 4096 / docH);
    const w = Math.max(1, Math.ceil(docW * maskScale));
    const h = Math.max(1, Math.ceil(docH * maskScale));
    if (maskCanvas.width !== w || maskCanvas.height !== h) {
      maskCanvas.width = w;
      maskCanvas.height = h;
    }
    maskDoc = [w / maskScale, h / maskScale];
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.filter = "none";
    mctx.fillStyle = "#000";
    mctx.fillRect(0, 0, w, h);
    // Feather: a ~5 CSS px soft edge, crisp enough to read as a pane.
    if (blurOk) mctx.filter = `blur(${Math.max(0.75, 5 * maskScale)}px)`;
    mctx.fillStyle = "#fff";
    mctx.setTransform(maskScale, 0, 0, maskScale, 0, 0);
    darkSpans = [];
    const sy = scrollY;
    for (const [sec, entry] of sections) {
      const b = sec.getBoundingClientRect();
      const top = b.top + sy;
      if (entry.dark) {
        darkSpans.push([top, top + b.height]);
        continue;
      }
      if (!entry.rects) continue;
      for (const [x, y, rw, rh] of entry.rects) {
        mctx.beginPath();
        mctx.roundRect(b.left + x - 24, top + y - 18, rw + 48, rh + 36, 18);
        mctx.fill();
      }
    }
    gl.deleteTexture(maskTex);
    maskTex = texture(w, h, maskCanvas);
  };

  // ---------------------------------------------------------------- loop
  let scale = 1;
  let quality = Math.min(devicePixelRatio || 1, 1.5);
  const resize = () => {
    scale = live() ? quality : Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(innerWidth * scale));
    const h = Math.max(1, Math.round(innerHeight * scale));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    allocTargets();
    maskDirty = true;
  };

  let frame = 0;
  let lastDraw = 0;
  let lastTick = 0;
  let lastInput = 0;
  let time = 30 + Math.random() * 60;
  let introStart = 0;
  let ptr = [-9999, -9999];
  let ptrTarget = [-9999, -9999];
  let ptrAmt = 0;
  let ptrOn = false;
  let slow = 0;
  let fast = 0;

  const covered = () => {
    const a = scrollY;
    const b = a + innerHeight;
    return darkSpans.some(([t, bt]) => t <= a + 1 && bt >= b - 1);
  };

  /** @param {Target | null} dst */
  const bind = (dst) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.fb : null);
    gl.viewport(0, 0, dst ? dst.w : canvas.width, dst ? dst.h : canvas.height);
  };

  /** @param {Target} src @param {Target} dst @param {number} dx @param {number} dy */
  const blurPass = (src, dst, dx, dy) => {
    bind(dst);
    gl.useProgram(blur.p);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, src.tex);
    gl.uniform1i(blur.u.uSrc, 0);
    gl.uniform2f(blur.u.uRes, dst.w, dst.h);
    gl.uniform2f(blur.u.uDir, dx / src.w, dy / src.h);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  /**
   * @param {number} kind
   * @param {typeof RIBBON} cfg
   * @param {number} alpha
   * @param {number} sy
   * @param {number} vh
   */
  const drawFamilies = (kind, cfg, alpha, sy, vh) => {
    const scrollP = sy * cfg.parallax;
    const j0 = Math.floor((scrollP - cfg.yOff - 520) / SPAN);
    const j1 = Math.ceil((scrollP - cfg.yOff + vh + 520) / SPAN);
    const families = j1 - j0 + 1;
    gl.uniform1f(curves.u.uScrollP, scrollP);
    gl.uniform1f(curves.u.uSeedOff, cfg.seed);
    gl.uniform1f(curves.u.uYOff, cfg.yOff);
    gl.uniform1i(curves.u.uKind, kind);
    gl.uniform1i(curves.u.uJ0, j0);
    gl.uniform1i(curves.u.uPer, cfg.per);
    gl.uniform1f(curves.u.uSeg, cfg.seg);
    gl.uniform1f(curves.u.uWidth, cfg.width);
    gl.uniform1f(curves.u.uAlpha, alpha);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 2 * (cfg.seg + 1), families * cfg.per);
  };

  /** @param {number} now */
  const draw = (now) => {
    if (maskDirty) rebuildMask();
    const sy = scrollY;
    const animate = live();
    const dt = lastDraw ? Math.min((now - lastDraw) / 1000, 0.066) : 1 / 60;
    lastDraw = now;
    if (covered()) return false;
    if (animate) time += dt;
    if (!introStart) introStart = now;
    const ease = animate ? 1 - Math.pow(1 - Math.min((now - introStart) / 1800, 1), 3) : 1;

    const k = 1 - Math.exp(-dt * 7);
    ptr[0] += (ptrTarget[0] - ptr[0]) * k;
    ptr[1] += (ptrTarget[1] - ptr[1]) * k;
    ptrAmt += ((ptrOn && animate ? 1 : 0) - ptrAmt) * (1 - Math.exp(-dt * 2.5));

    const view = [canvas.width / scale, canvas.height / scale];
    const [S, Ga, Gb, Fa, Fb] = chain;

    // 1. Strands into the scene target (premultiplied over).
    bind(S);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(curves.p);
    gl.bindVertexArray(emptyVao);
    gl.uniform1f(curves.u.uTime, time);
    gl.uniform2f(curves.u.uView, view[0], view[1]);
    gl.uniform1f(curves.u.uScale, scale);
    gl.uniform2f(curves.u.uPtr, ptr[0], ptr[1]);
    gl.uniform1f(curves.u.uPtrAmt, ptrAmt);
    drawFamilies(0, RIBBON_FAR, RIBBON_FAR.alpha * ease, sy, view[1]);
    drawFamilies(1, ACCENT, ACCENT.alpha * ease, sy, view[1]);
    drawFamilies(0, RIBBON, RIBBON.alpha * ease, sy, view[1]);
    gl.disable(gl.BLEND);

    // 2. Bloom: glow at 1/4, frost at 1/8 (downsample + separable Gaussian each).
    gl.bindVertexArray(quadVao);
    blurPass(S, Ga, 1.6, 0);
    blurPass(Ga, Gb, 0, 1.2);
    blurPass(Gb, Fa, 2.2, 0);
    blurPass(Fa, Fb, 0, 2.2);

    // 3. Composite to the canvas.
    bind(null);
    gl.useProgram(composite.p);
    gl.uniform2f(composite.u.uRes, canvas.width, canvas.height);
    gl.uniform1f(composite.u.uScale, scale);
    gl.uniform1f(composite.u.uScrollY, sy);
    gl.uniform2f(composite.u.uMaskDoc, maskDoc[0], maskDoc[1]);
    let paneN = 0;
    for (const el of pinned) {
      if (paneN >= 8) break;
      if (!el.isConnected) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > view[1] || r.width < 2) continue;
      panes.set([r.left - 20, r.top - 16, r.width + 40, r.height + 32], paneN * 4);
      paneN++;
    }
    gl.uniform4fv(composite.u["uPanes[0]"], panes);
    gl.uniform1i(composite.u.uPaneN, paneN);
    const units = /** @type {const} */ ([
      ["uScene", S.tex],
      ["uGlow", Gb.tex],
      ["uFrost", Fb.tex],
      ["uMask", maskTex],
    ]);
    units.forEach(([name, tex], i) => {
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(composite.u[name], i);
    });
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    canvas.classList.add("ready");
    canvas.dataset.quality = String(scale);
    canvas.dataset.mode = animate ? "live" : "static";
    return true;
  };

  /** Adaptive quality: sustained long frames at the 60 fps target step resolution down. */
  /** @param {number} gap */
  const adapt = (gap) => {
    if (gap > 26) slow++;
    else if (gap < 18) fast++;
    if (slow > 45 && quality > 0.75) {
      quality = Math.max(0.75, quality - 0.25);
      slow = fast = 0;
      resize();
    } else if (fast > 600) {
      slow = fast = 0;
    }
  };

  let pending = 0;
  let dead = false;

  /** @param {number} now */
  const tick = (now) => {
    frame = 0;
    if (dead || document.hidden || !live()) return;
    const busy = now - lastInput < 400 || (introStart > 0 && now - introStart < 2000);
    const interval = busy ? 1000 / 60 : 1000 / 30;
    if (lastTick && busy) adapt(now - lastTick);
    lastTick = now;
    if (!lastDraw || now - lastDraw >= interval - 2) {
      // Fully behind a dark section and nothing moving: sleep until the next scroll.
      if (!draw(now) && !busy) return;
    }
    frame = requestAnimationFrame(tick);
  };

  function requestDraw() {
    if (dead) return;
    if (live()) {
      if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
      return;
    }
    if (pending) return;
    pending = requestAnimationFrame((now) => {
      pending = 0;
      draw(now);
    });
  }

  const restart = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTick = 0;
    resize();
    requestDraw();
  };

  /** @param {PointerEvent} e */
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    ptrTarget = [e.clientX, e.clientY];
    if (!ptrOn) ptr = [e.clientX, e.clientY];
    ptrOn = true;
    lastInput = performance.now();
    requestDraw();
  };
  const onLeave = () => {
    ptrOn = false;
  };
  const onScroll = () => {
    lastInput = performance.now();
    requestDraw();
  };
  const onResize = () => {
    resize();
    maskDirty = true;
    requestDraw();
  };
  /** @param {Event} e */
  const onLost = (e) => {
    // A background flourish is not worth a reload: go dormant, the page keeps its plain paper.
    e.preventDefault();
    dead = true;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(pending);
    frame = pending = 0;
    canvas.classList.remove("ready");
  };

  addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", restart);
  media.addEventListener("change", restart);
  coarse.addEventListener("change", restart);
  canvas.addEventListener("webglcontextlost", onLost);
  document.fonts?.ready.then(() => collect());

  resize();
  collect();
  requestDraw();
  if (force) Object.assign(window, { __paperField: { sections, maskCanvas } });

  return {
    refresh: collect,
    dispose() {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      sectionIO.disconnect();
      sectionRO.disconnect();
      removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", restart);
      media.removeEventListener("change", restart);
      coarse.removeEventListener("change", restart);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
      mounted = false;
    },
  };
}
