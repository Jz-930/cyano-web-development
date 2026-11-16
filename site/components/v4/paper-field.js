// Paper field (v4): a single fixed WebGL2 canvas behind every paper (light)
// surface of the site. Dark sections are opaque and simply cover it.
//
// Per-frame render graph (live mode):
//   sim      particles advected along the curl of the terrain (transform feedback)
//   trails   screen-space trail buffer: scroll-shifted decay + instanced segments
//   emit     half-res emission: dense gradient isolines + trails
//   bloom    separable Gaussian at 1/4 res (glow) and again at 1/8 res (frost)
//   compose  sharp isolines + glow + trails + survey grid; behind live text the
//            sharp layer is swapped for the 1/8 blur under a white veil, i.e. a
//            frosted-glass pane computed on the GPU, with no DOM boxes and no
//            per-frame backdrop-filter cost.
// Text panes come from a document-space mask baked from measured text blocks.

const COMMON = `
vec3 perm(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
  vec3 p=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;
  vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
uniform float uTime;
uniform vec2 uPtr;
uniform float uPtrAmt;
// fp: field-space CSS px. Domain-warped two-octave simplex terrain.
float field(vec2 fp){
  vec2 p=fp/980.;
  float t=uTime;
  vec2 q=vec2(snoise(p*.55+vec2(1.7,t*.026)),snoise(p*.55+vec2(8.3,-t*.022)));
  float h=snoise(p+.55*q+vec2(t*.015,0.));
  h+=.18*snoise(p*2.1-.4*q+vec2(-t*.012,t*.016));
  return h;
}
// Pointer lens: a soft gaussian rise in screen space bends nearby isolines.
float bump(vec2 sp){vec2 d=sp-uPtr;return uPtrAmt*.16*exp(-dot(d,d)/(170.*170.));}
`;

// Shared by the emission and composite passes so the glow is exactly the blur
// of what is drawn sharp.
const CONTOURS = `
uniform float uScrollY;
uniform vec2 uView;
const float LEVELS=12.;
const vec3 DEEP=vec3(.043,.435,.502);
const vec3 BRAND=vec3(.22,.596,.659);
const vec3 CYAN=vec3(.22,.784,.878);
const vec3 AZURE=vec3(.2,.5,.82);
vec3 ramp(float g){
  g=clamp(g,0.,1.);
  if(g<.34)return mix(DEEP,BRAND,g/.34);
  if(g<.68)return mix(BRAND,CYAN,(g-.34)/.34);
  return mix(CYAN,AZURE,(g-.68)/.32);
}
// Premultiplied isoline layer. w: half line width of a major line, in target px.
vec4 contours(vec2 px,float w){
  vec2 fp=vec2(px.x,px.y+uScrollY*.45);
  float h=field(fp)+bump(px);
  float v=h*LEVELS;
  float fw=max(fwidth(v),1e-4);
  float d=abs(fract(v-.5)-.5)/fw;
  float lvl=floor(v+.5);
  float major=1.-step(.5,abs(mod(lvl,5.)));
  float hw=w*mix(.5,1.,major);
  float line=1.-smoothstep(hw,hw+1.,d);
  float crowd=1.-smoothstep(.28,.6,fw);
  float breathe=.6+.4*smoothstep(-.5,.6,snoise(fp/1500.+vec2(uTime*.012,-uTime*.009)));
  // Gradient: diagonal sweep across the viewport, bent by terrain height, drifting in time.
  float g=.5+.5*sin((px.x*.8+px.y*.55)/uView.x*2.6+h*1.7+uTime*.06);
  vec3 col=mix(ramp(g),CYAN,major*.3);
  float a=line*crowd*breathe*mix(.2,.42,major);
  return vec4(col*a,a);
}
`;

const QUAD_VS = `#version 300 es
layout(location=0) in vec2 aPos;
void main(){gl_Position=vec4(aPos,0.,1.);}`;

const EMIT_FS = `#version 300 es
precision highp float;
${COMMON}
${CONTOURS}
uniform vec2 uRes;
uniform float uScale;
uniform sampler2D uTrail;
uniform float uTrailOn;
out vec4 o;
void main(){
  vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uScale;
  vec4 c=contours(px,.8)*1.5;
  if(uTrailOn>.5){
    float tr=clamp(texture(uTrail,gl_FragCoord.xy/uRes).r,0.,1.);
    float a=tr*.9;
    c=vec4(CYAN*a,a)+c*(1.-a);
  }
  o=c;
}`;

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
${COMMON}
${CONTOURS}
uniform vec2 uRes;
uniform float uScale;
uniform sampler2D uMask;
uniform vec2 uMaskDoc;
uniform sampler2D uTrail;
uniform sampler2D uGlow;
uniform sampler2D uFrost;
uniform float uTrailOn;
// Panes for sticky/fixed text containers, in viewport CSS px: (x, y, w, h).
uniform vec4 uPanes[8];
uniform int uPaneN;
out vec4 o;
const vec3 INK=vec3(.082,.169,.204);
float roundBox(vec2 p,vec4 r){
  vec2 c=r.xy+r.zw*.5;vec2 q=abs(p-c)-r.zw*.5+18.;
  return length(max(q,0.))+min(max(q.x,q.y),0.)-18.;
}
vec4 overP(vec4 dst,vec4 src){return src+dst*(1.-src.a);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 px=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uScale;
  vec2 dp=px-uPtr;
  float lens=uPtrAmt*exp(-dot(dp,dp)/(240.*240.));

  // Bloom halo first, the crisp layers on top of it.
  vec4 glow=texture(uGlow,uv);
  vec4 acc=glow*(.85+lens*.7);

  // Survey grid (parallax .8).
  vec2 gp=vec2(px.x-uView.x*.5,px.y+uScrollY*.8);
  vec2 cell=mod(gp,24.)-12.;
  float dotA=(1.-smoothstep(.7*uScale,.7*uScale+1.,length(cell)*uScale))*(.05+.1*lens);
  acc=overP(acc,vec4(mix(INK,CYAN,lens)*dotA,dotA));

  // Slow survey sweep lifts the isolines it crosses.
  float scanY=mod(uTime*46.,uView.y+900.)-450.;
  float scan=exp(-pow((px.y-scanY)/120.,2.));
  vec4 sharp=contours(px,.75*uScale)*(1.+lens*.8+scan*.7);
  acc=overP(acc,sharp);

  if(uTrailOn>.5){
    float tr=clamp(texture(uTrail,uv).r,0.,1.);
    float a=tr*.62;
    acc=overP(acc,vec4(CYAN*a,a));
  }

  // Frosted pane behind text: the scene seen through a diffuser, under a paper veil.
  float mr=texture(uMask,vec2(px.x/uMaskDoc.x,(px.y+uScrollY)/uMaskDoc.y)).r;
  for(int i=0;i<8;i++){
    if(i>=uPaneN)break;
    mr=max(mr,1.-smoothstep(-2.5,2.5,roundBox(px,uPanes[i])));
  }
  float m=smoothstep(.2,.8,mr);
  // The veil keeps every pane at least as light as bare paper, so text contrast never drops.
  vec4 frost=texture(uFrost,uv);
  vec4 pane=overP(frost,vec4(vec3(.72),.72));
  vec4 res=mix(acc,pane,m);
  // Rim light where the pane meets the field, like the polished edge of glass.
  float rim=(1.-abs(mr-.5)*2.);
  rim=rim*rim*rim;
  o=overP(res,vec4(vec3(.55*rim),.55*rim));
}`;

const SIM_VS = `#version 300 es
precision highp float;
${COMMON}
layout(location=0) in vec4 aState;
uniform float uDt;
uniform float uScrollP;
uniform vec2 uView;
uniform uint uFrame;
out vec4 vState;
uint pcg(uint v){uint s=v*747796405u+2891336453u;uint w=((s>>((s>>28u)+4u))^s)*277803737u;return (w>>22u)^w;}
float rnd(inout uint s){s=pcg(s);return float(s)/4294967295.;}
float H(vec2 fp){return field(fp)+bump(vec2(fp.x,fp.y-uScrollP));}
void main(){
  vec4 s=aState;
  const float e=2.;
  vec2 g=vec2(H(s.xy+vec2(e,0.))-H(s.xy-vec2(e,0.)),H(s.xy+vec2(0.,e))-H(s.xy-vec2(0.,e)))/(2.*e);
  vec2 vel=vec2(g.y,-g.x)*36000.;
  float sp=length(vel);
  if(sp>44.)vel*=44./sp;
  s.xy+=vel*uDt;
  s.z+=uDt;
  vec2 scr=vec2(s.x,s.y-uScrollP);
  bool outside=scr.x<-24.||scr.x>uView.x+24.||scr.y<-24.||scr.y>uView.y+24.;
  if(s.z>s.w||outside){
    uint seed=uint(gl_VertexID)*1973u+uFrame*9277u+1u;
    s.x=rnd(seed)*uView.x;
    s.y=rnd(seed)*uView.y+uScrollP;
    s.z=0.;
    s.w=7.+rnd(seed)*9.;
  }
  vState=s;
}`;

const SIM_FS = `#version 300 es
precision mediump float;
out vec4 o;
void main(){o=vec4(0.);}`;

// One instanced line per particle, from its previous to its next simulated position,
// so trails stay continuous whatever the frame rate.
const SEG_VS = `#version 300 es
precision highp float;
layout(location=0) in vec4 aPrev;
layout(location=1) in vec4 aNext;
uniform float uScrollP;
uniform vec2 uView;
out float vA;
void main(){
  vec4 st=gl_VertexID==1?aNext:aPrev;
  vec2 s=vec2(st.x,st.y-uScrollP);
  gl_Position=vec4(s.x/uView.x*2.-1.,1.-s.y/uView.y*2.,0.,1.);
  float respawned=step(aNext.z,aPrev.z);
  vA=(1.-respawned)*smoothstep(0.,1.6,aNext.z)*(1.-smoothstep(aNext.w-2.,aNext.w,aNext.z));
}`;

const SEG_FS = `#version 300 es
precision mediump float;
in float vA;
uniform float uDeposit;
out vec4 o;
void main(){o=vec4(vA*uDeposit,0.,0.,1.);}`;

const DECAY_FS = `#version 300 es
precision mediump float;
uniform sampler2D uPrev;
uniform vec2 uRes;
uniform vec2 uShift;
uniform float uDecay;
out vec4 o;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes-uShift;
  float v=0.;
  if(uv.x>=0.&&uv.y>=0.&&uv.x<=1.&&uv.y<=1.)v=texture(uPrev,uv).r;
  o=vec4(max(v*uDecay-.0018,0.),0.,0.,1.);
}`;

const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,dt,dd,blockquote,figcaption,label,th,td,summary,a,.eyebrow,.label,.tag,.figure,button,input,select,textarea,[class*='badge'],[class*='chip'],[class*='pill']";
const RANGE_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "DT", "DD", "BLOCKQUOTE", "FIGCAPTION", "LABEL", "TH", "TD",
]);
const PARALLAX_FIELD = 0.45;
const COUNT = 640;
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
  /** @param {string} vs @param {string} fs @param {string[]} [varyings] */
  const link = (vs, fs, varyings) => {
    const p = /** @type {WebGLProgram} */ (gl.createProgram());
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    if (varyings) gl.transformFeedbackVaryings(p, varyings, gl.SEPARATE_ATTRIBS);
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

  let composite, emit, blur, sim, segs, decay;
  try {
    composite = link(QUAD_VS, COMPOSITE_FS);
    emit = link(QUAD_VS, EMIT_FS);
    blur = link(QUAD_VS, BLUR_FS);
    sim = link(SIM_VS, SIM_FS, ["vState"]);
    segs = link(SEG_VS, SEG_FS);
    decay = link(QUAD_VS, DECAY_FS);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn(err);
    return noop;
  }
  mounted = true;
  host.append(canvas);

  // Full-screen triangle.
  const quadVao = gl.createVertexArray();
  const quadBuf = gl.createBuffer();
  gl.bindVertexArray(quadVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Particle state ping-pong: vec4(fieldX, fieldY, age, life).
  const init = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    init[i * 4] = Math.random() * innerWidth;
    init[i * 4 + 1] = Math.random() * innerHeight + scrollY * PARALLAX_FIELD;
    init[i * 4 + 3] = 7 + Math.random() * 9;
    init[i * 4 + 2] = Math.random() * init[i * 4 + 3];
  }
  const state = [0, 1].map(() => {
    const vao = gl.createVertexArray();
    const buf = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, init, gl.DYNAMIC_COPY);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    return { vao, buf };
  });
  // segVao[r]: previous state from buffer r, next state from buffer 1 - r.
  const segVao = [0, 1].map((r) => {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    for (const [loc, buf] of /** @type {[number, WebGLBuffer][]} */ ([[0, state[r].buf], [1, state[1 - r].buf]])) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(loc, 1);
    }
    return vao;
  });
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  let read = 0;

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
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h };
  };
  /** @param {Target[]} list */
  const free = (list) => {
    for (const t of list) {
      gl.deleteTexture(t.tex);
      gl.deleteFramebuffer(t.fb);
    }
  };

  // Screen-space targets, reallocated on resize.
  /** @type {Target[]} */ let trails = [];
  /** @type {Target[]} */ let chain = [];
  let trailRead = 0;
  const allocTargets = () => {
    free(trails);
    free(chain);
    const W = canvas.width;
    const H = canvas.height;
    trails = [target(W, H), target(W, H)];
    // emission 1/2, glow 1/4 (a,b), frost 1/8 (a,b)
    chain = [
      target(W / 2, H / 2),
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
  let frameNo = 0;
  let introStart = 0;
  let lastScroll = scrollY;
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

  /**
   * @param {{ p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }} prog
   * @param {number} sy
   * @param {number[]} view
   */
  const fieldUniforms = (prog, sy, view) => {
    gl.uniform1f(prog.u.uTime, time);
    gl.uniform2f(prog.u.uPtr, ptr[0], ptr[1]);
    gl.uniform1f(prog.u.uPtrAmt, ptrAmt);
    gl.uniform1f(prog.u.uScrollY, sy);
    gl.uniform2f(prog.u.uView, view[0], view[1]);
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

  /** @param {number} now */
  const draw = (now) => {
    if (maskDirty) rebuildMask();
    const sy = scrollY;
    const animate = live();
    const dt = lastDraw ? Math.min((now - lastDraw) / 1000, 0.066) : 1 / 60;
    lastDraw = now;
    if (covered()) {
      lastScroll = sy;
      return false;
    }
    if (animate) time += dt;
    if (!introStart) introStart = now;
    const ease = animate ? 1 - Math.pow(1 - Math.min((now - introStart) / 2200, 1), 3) : 1;

    const k = 1 - Math.exp(-dt * 7);
    ptr[0] += (ptrTarget[0] - ptr[0]) * k;
    ptr[1] += (ptrTarget[1] - ptr[1]) * k;
    ptrAmt += ((ptrOn && animate ? 1 : 0) - ptrAmt) * (1 - Math.exp(-dt * 2.5));

    const view = [canvas.width / scale, canvas.height / scale];
    const scrollP = sy * PARALLAX_FIELD;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    if (animate) {
      // 1. Advance particles with transform feedback.
      const write = 1 - read;
      gl.useProgram(sim.p);
      gl.uniform1f(sim.u.uTime, time);
      gl.uniform2f(sim.u.uPtr, ptr[0], ptr[1]);
      gl.uniform1f(sim.u.uPtrAmt, ptrAmt);
      gl.uniform1f(sim.u.uDt, dt);
      gl.uniform1f(sim.u.uScrollP, scrollP);
      gl.uniform2f(sim.u.uView, view[0], view[1]);
      gl.uniform1ui(sim.u.uFrame, frameNo++);
      gl.enable(gl.RASTERIZER_DISCARD);
      gl.bindVertexArray(state[read].vao);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, state[write].buf);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, COUNT);
      gl.endTransformFeedback();
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
      gl.disable(gl.RASTERIZER_DISCARD);
      const prevRead = read;
      read = write;

      // 2. Fade + scroll-shift the trail buffer, then draw this frame's segments.
      const tw = 1 - trailRead;
      bind(trails[tw]);
      gl.useProgram(decay.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, trails[trailRead].tex);
      gl.uniform1i(decay.u.uPrev, 0);
      gl.uniform2f(decay.u.uRes, trails[tw].w, trails[tw].h);
      gl.uniform2f(decay.u.uShift, 0, ((sy - lastScroll) * PARALLAX_FIELD) / view[1]);
      gl.uniform1f(decay.u.uDecay, Math.exp(-dt / 2.8));
      gl.bindVertexArray(quadVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(segs.p);
      gl.uniform1f(segs.u.uScrollP, scrollP);
      gl.uniform2f(segs.u.uView, view[0], view[1]);
      gl.uniform1f(segs.u.uDeposit, 0.8 * ease);
      gl.bindVertexArray(segVao[prevRead]);
      gl.drawArraysInstanced(gl.LINES, 0, 2, COUNT);
      gl.disable(gl.BLEND);
      trailRead = tw;
    }
    lastScroll = sy;
    gl.bindVertexArray(quadVao);

    // 3. Emission at half resolution.
    const [E, Ga, Gb, Fa, Fb] = chain;
    bind(E);
    gl.useProgram(emit.p);
    fieldUniforms(emit, sy, view);
    gl.uniform2f(emit.u.uRes, E.w, E.h);
    gl.uniform1f(emit.u.uScale, E.w / view[0]);
    gl.uniform1f(emit.u.uTrailOn, animate ? 1 : 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, trails[trailRead].tex);
    gl.uniform1i(emit.u.uTrail, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // 4. Bloom: glow at 1/4, frost at 1/8 (downsample + separable Gaussian each).
    blurPass(E, Ga, 0.9, 0);
    blurPass(Ga, Gb, 0, 0.9);
    blurPass(Gb, Fa, 2.2, 0);
    blurPass(Fa, Fb, 0, 2.2);

    // 5. Composite to the canvas.
    bind(null);
    gl.useProgram(composite.p);
    fieldUniforms(composite, sy, view);
    gl.uniform2f(composite.u.uRes, canvas.width, canvas.height);
    gl.uniform1f(composite.u.uScale, scale);
    gl.uniform2f(composite.u.uMaskDoc, maskDoc[0], maskDoc[1]);
    gl.uniform1f(composite.u.uTrailOn, animate ? 1 : 0);
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
      ["uMask", maskTex],
      ["uTrail", trails[trailRead].tex],
      ["uGlow", Gb.tex],
      ["uFrost", Fb.tex],
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
    const busy = now - lastInput < 400 || (introStart > 0 && now - introStart < 2400);
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
