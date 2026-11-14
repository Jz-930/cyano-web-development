// One native WebGL field, shared by hero, embedded panel and closing.
const fragment=`precision mediump float;
uniform vec2 resolution;uniform float time;uniform vec2 pointer;uniform float phase;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .55*noise(p)+.28*noise(p*2.03)+.17*noise(p*4.01);}
void main(){vec2 uv=gl_FragCoord.xy/resolution;uv+=pointer*.02;
float t=time*.25+phase;vec2 warp=vec2(fbm(uv*3.+t*.15),fbm(uv*3.+vec2(4.3,t*.12)));
float n=fbm(uv*4.+warp*.8+vec2(t*.08,-t*.1));float mask=smoothstep(.38,.82,uv.x);
float center=.68+.12*sin(uv.x*4.2+t*.6)+.11*(n-.5);float band=0.;
for(int i=0;i<3;i++){float d=uv.y-center-float(i)*.064;band+=exp(-d*d/ (.0006+.0015*uv.x))*(.55+float(i)*.12);}
float glow=exp(-length((uv-vec2(.88,.68))*vec2(1.2,1.7))*3.4)*(.3+n*.35);
vec3 col=vec3(.027,.043,.059)+vec3(.015,.13,.16)*glow*mask;
col+=vec3(.07,.52,.62)*band*mask*.42;col+=vec3(.4,.72,.77)*pow(band*.48,3.)*mask*.16;
col+=(hash(gl_FragCoord.xy+fract(time)*.1)-.5)*.018;gl_FragColor=vec4(col,1.);}`;
const vertex='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
export function mountField(host,{paused=()=>false}={}){
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches)return ()=>{};
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.append(canvas);
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!gl){canvas.remove();return ()=>{};}
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Field shader could not compile');return s;};
  let program;
  try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Field link failed');}catch{canvas.remove();return ()=>{};}
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
  const uniforms=Object.fromEntries(['resolution','time','pointer','phase'].map(n=>[n,gl.getUniformLocation(program,n)]));
  let frame=0,visible=false,last=0,elapsed=0,activeUntil=0,rect,point=[0,0],scroll=0;
  const resize=()=>{rect=host.getBoundingClientRect();canvas.width=Math.max(1,Math.floor(rect.width*.5));canvas.height=Math.max(1,Math.floor(rect.height*.5));gl.viewport(0,0,canvas.width,canvas.height);};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
  const allowed=()=>visible&&!document.hidden&&!media.matches&&!paused();
  const tick=now=>{frame=0;if(!allowed())return;const interval=now<activeUntil?1000/60:1000/30;if(!last||now-last>=interval-1){elapsed+=last?Math.min((now-last)/1000,.1):0;last=now;gl.uniform2f(uniforms.resolution,canvas.width,canvas.height);gl.uniform1f(uniforms.time,elapsed);gl.uniform2f(uniforms.pointer,...point);gl.uniform1f(uniforms.phase,scroll*.00015);gl.drawArrays(gl.TRIANGLES,0,6);canvas.classList.add('ready');}frame=requestAnimationFrame(tick);};
  const resume=()=>{if(!allowed()){stop();return;}if(!frame)frame=requestAnimationFrame(tick);};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{threshold:0});observer.observe(host);
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  const move=e=>{if(!visible)return;point=[e.clientX/innerWidth-.5,.5-e.clientY/innerHeight];activeUntil=performance.now()+200;};
  const onScroll=()=>{if(!visible)return;scroll=window.scrollY;activeUntil=performance.now()+200;};
  const lost=e=>{e.preventDefault();stop();canvas.classList.remove('ready');};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});document.addEventListener('visibilitychange',resume);document.addEventListener('field-pause',resume);media.addEventListener('change',resume);canvas.addEventListener('webglcontextlost',lost);
  return ()=>{stop();observer.disconnect();ro.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',onScroll);document.removeEventListener('visibilitychange',resume);document.removeEventListener('field-pause',resume);media.removeEventListener('change',resume);gl.deleteProgram(program);gl.deleteBuffer(buffer);canvas.remove();};
}
