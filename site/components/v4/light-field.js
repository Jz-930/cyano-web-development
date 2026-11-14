// Brand WebGL light field (v4): hero, solution, converge, panel, and closing presets.
const fragment = `precision mediump float;
uniform vec2 resolution;uniform float time;uniform vec2 pointer;uniform float phase;
uniform float strength;uniform vec2 focus;uniform float mode;uniform float intro;uniform float textEdge;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .55*noise(p)+.28*noise(p*2.03)+.17*noise(p*4.01);}
float lineY(float i,float x,float t){
  float spread=(i-1.)*.075;
  if(mode<.5){
    float k=clamp((x-focus.x)/max(1.-focus.x,.001),0.,1.);
    float y=mix(focus.y+spread*.15,.92+spread,pow(k,1.4));
    return y+.012*sin(x*9.+t*.8+i*2.1);
  }
  float k=clamp(x/max(focus.x,.001),0.,1.);
  float y=mix(.5+(i-1.)*.28,focus.y,smoothstep(0.,1.,k));
  return y+.010*sin(x*8.+t*.7+i*1.7)*(1.-k);
}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;uv+=pointer*.07;
  float t=time*.25+phase;
  vec2 warp=vec2(fbm(uv*3.+t*.15),fbm(uv*3.+vec2(4.3,t*.12)));
  float n=fbm(uv*4.+warp*.8+vec2(t*.08,-t*.1));
  float dir=mode<.5?1.:-1.;
  float band=0.;
  for(int j=0;j<3;j++){
    float i=float(j);
    float d=uv.y-lineY(i,uv.x,t);
    float w=.0016+.0022*abs(uv.x-focus.x);
    float core=exp(-d*d/w);
    float seg=mode<.5?smoothstep(focus.x-.03,focus.x+.02,uv.x):1.-smoothstep(focus.x-.01,focus.x+.04,uv.x);
    float pulse=pow(.5+.5*sin((uv.x*6.+dir*t*.9+i*.37)*6.2831),12.);
    band+=core*seg*(.55+.9*pulse)*(.7+.15*i);
  }
  if(mode>.5){band+=exp(-pow(uv.y-focus.y,2.)/.0012)*smoothstep(focus.x,focus.x+.02,uv.x)*(1.-smoothstep(focus.x,1.,uv.x))*.6;}
  float dist=mode<.5?1.-uv.x:uv.x;
  float front=intro*1.25;
  float reveal=1.-smoothstep(front-.25,front,dist);
  float edge=exp(-pow((dist-front+.1)*14.,2.))*(1.-intro)*.5;
  float textMask=mix(.2,1.,smoothstep(textEdge,textEdge+.14,uv.x));
  vec2 ambC=mode<.5?vec2(.86,.78):focus;
  float amb=exp(-length((uv-ambC)*vec2(1.1,1.5))*3.)*(.3+n*.35);
  float fg=exp(-length((uv-focus)*vec2(1.,1.6))*9.);
  vec3 col=vec3(.027,.043,.059);
  col+=vec3(.015,.13,.16)*amb*strength*textMask*reveal;
  col+=vec3(.07,.52,.62)*band*.5*strength*textMask*reveal;
  col+=vec3(.4,.72,.77)*pow(band*.5,3.)*.2*strength*textMask*reveal;
  col+=vec3(.06,.45,.55)*fg*.6*strength*reveal;
  col+=vec3(.07,.52,.62)*edge*strength*textMask;
  col+=(hash(gl_FragCoord.xy+fract(time)*91.7)-.5)*.028;
  gl_FragColor=vec4(col,1.);
}`;

const vertex = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const activeInstances = new Set();

/**
 * @param {HTMLElement} host
 * @param {{
 *   mode?: number;
 *   strength?: number;
 *   focusEl?: HTMLElement | null;
 *   focus?: number[];
 *   textEdgeEl?: HTMLElement | null;
 *   textEdge?: number;
 *   intro?: boolean;
 *   paused?: () => boolean;
 * }} [options]
 */
export function mountField(
  host,
  {
    mode = 0,
    strength = 1,
    focusEl = null,
    focus = [0.7, 0.5],
    textEdgeEl = null,
    textEdge = 0,
    intro = false,
    paused = () => false,
  } = {},
) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches || activeInstances.size >= 3) return () => {};
  const token = {};
  activeInstances.add(token);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) {
    activeInstances.delete(token);
    canvas.remove();
    return () => {};
  }

  const shader = (type, source) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw Error("Field shader could not compile");
    }
    return s;
  };

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw Error("Field link failed");
    }
  } catch {
    activeInstances.delete(token);
    canvas.remove();
    return () => {};
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const attr = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

  const uniforms = Object.fromEntries(
    [
      "resolution",
      "time",
      "pointer",
      "phase",
      "strength",
      "focus",
      "mode",
      "intro",
      "textEdge",
    ].map((n) => [n, gl.getUniformLocation(program, n)]),
  );

  let frame = 0,
    visible = false,
    last = 0,
    elapsed = 0,
    activeUntil = 0,
    introStart = 0,
    rect,
    point = [0, 0],
    target = [0, 0],
    scroll = 0;
  let f = focus.slice(),
    te = textEdge;

  const measure = () => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (focusEl) {
      const e = focusEl.getBoundingClientRect();
      if (e.width || e.height) {
        f = [
          (e.left - r.left) / r.width,
          1 - (e.top + e.height / 2 - r.top) / r.height,
        ];
      }
    }
    if (textEdgeEl) {
      const e = textEdgeEl.getBoundingClientRect();
      if (e.width || e.height) {
        te = (e.right - r.left) / r.width;
      }
    }
  };

  const resize = () => {
    rect = host.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * 0.5));
    canvas.height = Math.max(1, Math.floor(rect.height * 0.5));
    gl.viewport(0, 0, canvas.width, canvas.height);
    measure();
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  };

  const allowed = () => visible && !document.hidden && !media.matches && !paused();

  const tick = (now) => {
    frame = 0;
    if (!allowed()) return;
    if (intro && !introStart) introStart = now;
    const k = intro ? Math.min((now - introStart) / 1200, 1) : 1;
    const introVal = intro ? 1 - Math.pow(1 - k, 3) : 1;
    const dx = target[0] - point[0];
    const dy = target[1] - point[1];
    if (Math.hypot(dx, dy) > 0.001) {
      activeUntil = Math.max(activeUntil, now + 200);
    }
    const interval = k < 1 || now < activeUntil ? 1000 / 60 : 1000 / 30;
    if (!last || now - last >= interval - 1) {
      elapsed += last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      point[0] += (target[0] - point[0]) * 0.08;
      point[1] += (target[1] - point[1]) * 0.08;
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform2f(uniforms.pointer, point[0], point[1]);
      gl.uniform1f(uniforms.phase, scroll * 0.00015);
      gl.uniform1f(uniforms.strength, strength);
      gl.uniform2f(uniforms.focus, f[0], f[1]);
      gl.uniform1f(uniforms.mode, mode);
      gl.uniform1f(uniforms.intro, introVal);
      gl.uniform1f(uniforms.textEdge, te);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.classList.add("ready");
    }
    frame = requestAnimationFrame(tick);
  };

  const resume = () => {
    if (!allowed()) {
      stop();
      return;
    }
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) measure();
      resume();
    },
    { threshold: 0 },
  );
  observer.observe(host);

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const move = (e) => {
    if (!visible) return;
    target = [e.clientX / innerWidth - 0.5, 0.5 - e.clientY / innerHeight];
    activeUntil = performance.now() + 200;
  };
  const onScroll = () => {
    if (!visible) return;
    scroll = window.scrollY;
    activeUntil = performance.now() + 200;
  };
  const lost = (e) => {
    e.preventDefault();
    stop();
    canvas.classList.remove("ready");
  };

  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", resume);
  document.addEventListener("field-pause", resume);
  media.addEventListener("change", resume);
  canvas.addEventListener("webglcontextlost", lost);

  return () => {
    stop();
    activeInstances.delete(token);
    observer.disconnect();
    ro.disconnect();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", resume);
    document.removeEventListener("field-pause", resume);
    media.removeEventListener("change", resume);
    gl.deleteProgram(program);
    gl.deleteBuffer(buffer);
    canvas.remove();
  };
}
