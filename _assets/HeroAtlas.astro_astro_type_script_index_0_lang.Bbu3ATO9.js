var e=new Float32Array([.78,.949,.302]),t=new Float32Array([.886,.906,.898]),n=1100,r=88,i=14;function a(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619)>>>0;return()=>(t^=t<<13,t>>>=0,t^=t>>>17,t^=t<<5,t>>>=0,t/4294967296)}var o=`
attribute vec3 a_pos;
attribute vec2 a_meta;
uniform mat3 u_rot;
uniform mat4 u_proj;
uniform float u_dist;
uniform float u_scale;
// Shared with the fragment stage, so the precision has to be declared or the link fails.
uniform mediump float u_reveal;
varying float v_depth;
varying float v_tone;
void main() {
  vec3 p = u_rot * a_pos;
  gl_Position = u_proj * vec4(p.x, p.y, p.z - u_dist, 1.0);
  v_depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  v_tone = a_meta.y;
  gl_PointSize = max(1.0, a_meta.x * u_scale * u_reveal / gl_Position.w);
}
`,s=`
precision mediump float;
uniform vec3 u_accent;
uniform vec3 u_pale;
uniform float u_reveal;
varying float v_depth;
varying float v_tone;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = clamp(dot(d, d) * 4.0, 0.0, 1.0);
  float core = 1.0 - r;
  float glow = core * core;
  vec3 tint = mix(u_pale, u_accent, v_tone);
  float a = glow * (0.2 + v_depth * 0.9) * u_reveal;
  gl_FragColor = vec4(tint * a, a);
}
`,c=`
attribute vec3 a_pos;
attribute vec2 a_meta;
uniform mat3 u_rot;
uniform mat4 u_proj;
uniform float u_dist;
varying float v_depth;
varying float v_tone;
varying float v_alpha;
void main() {
  vec3 p = u_rot * a_pos;
  gl_Position = u_proj * vec4(p.x, p.y, p.z - u_dist, 1.0);
  v_depth = clamp(p.z * 0.5 + 0.5, 0.0, 1.0);
  v_alpha = a_meta.x;
  v_tone = a_meta.y;
}
`,l=`
precision mediump float;
uniform vec3 u_accent;
uniform vec3 u_pale;
uniform float u_reveal;
varying float v_depth;
varying float v_tone;
varying float v_alpha;
void main() {
  vec3 tint = mix(u_pale, u_accent, v_tone);
  float a = v_alpha * (0.14 + v_depth * 1.25) * u_reveal;
  gl_FragColor = vec4(tint * a, a);
}
`;function u(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}function d(e,t,n){let r=u(e,e.VERTEX_SHADER,t),i=u(e,e.FRAGMENT_SHADER,n);if(!r||!i)return null;let a=e.createProgram();return a?(e.attachShader(a,r),e.attachShader(a,i),e.linkProgram(a),e.deleteShader(r),e.deleteShader(i),e.getProgramParameter(a,e.LINK_STATUS)?a:(e.deleteProgram(a),null)):null}function f(e){let t=Math.hypot(e.x,e.y,e.z)||1;return{x:e.x/t,y:e.y/t,z:e.z/t}}function p(e,t,n,r){let i=Math.min(1,Math.max(-1,e.x*t.x+e.y*t.y+e.z*t.z)),a=Math.acos(i),o=Math.sin(a),s,c;o<1e-4?(s=1-n,c=n):(s=Math.sin((1-n)*a)/o,c=Math.sin(n*a)/o);let l=f({x:e.x*s+t.x*c,y:e.y*s+t.y*c,z:e.z*s+t.z*c}),u=1+r*Math.sin(Math.PI*n);return{x:l.x*u,y:l.y*u,z:l.z*u}}function m(e){let t=a(`connectorzone-atlas-v2`),o=Math.max(3,e.length),s=.42,c=[];for(let e=0;e<o;e+=1){let t=e/o*Math.PI*2,n=Math.cos(t),r=Math.sin(t);c.push(f({x:n,y:Math.sin(t*2)*.16+r*s*.4,z:r*Math.cos(s)}))}let l=[],u=[],d=[],m=Math.PI*(3-Math.sqrt(5));for(let e=0;e<n;e+=1){let r=1-e/(n-1)*2,i=Math.sqrt(Math.max(0,1-r*r)),a=m*e,o=.82+t()*.2,s={x:Math.cos(a)*i*o,y:r*o,z:Math.sin(a)*i*o};l.push(s);let c=t()<.34;u.push(s.x,s.y,s.z),d.push(.85+t()*1.7+(c?.55:0),c?.95:.12)}let h=e.reduce((e,t)=>Math.max(e,t.weight),1);c.forEach((t,n)=>{let r=3.6+(e[n]?.weight??h*.6)/h*3.4;u.push(t.x,t.y,t.z),d.push(r,1),u.push(t.x*.995,t.y*.995,t.z*.995),d.push(r*2.6,.85)});let g=[],_=[],v=(e,t,n,r)=>{g.push(e.x,e.y,e.z,t.x,t.y,t.z),_.push(n,r,n,r)},y=Math.floor(n/r);for(let e=0;e<r;e+=1){let n=l[e*y],r=c[(e*3+1)%o];if(!n||!r)continue;let a=f(n),s=.12+t()*.26,u=t()<.45?1:.35,d=.1+t()*.26,m=p(a,r,0,s);for(let e=1;e<=i;e+=1){let t=e/i,n=p(a,r,t,s);v(m,n,d*(.35+t*.85),u),m=n}}for(let e of[-.52,0,.52]){let t=Math.sqrt(Math.max(0,1-e*e))*1.02,n=e===0?.13:.07;for(let r=0;r<120;r+=1){let i=r/120*Math.PI*2,a=(r+1)/120*Math.PI*2;v({x:Math.cos(i)*t,y:e*1.02,z:Math.sin(i)*t},{x:Math.cos(a)*t,y:e*1.02,z:Math.sin(a)*t},n,.8)}}return{points:new Float32Array(u),pointMeta:new Float32Array(d),pointCount:u.length/3,lines:new Float32Array(g),lineMeta:new Float32Array(_),lineCount:g.length/3}}function h(n,r,i){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||navigator.connection?.saveData||typeof navigator.hardwareConcurrency==`number`&&navigator.hardwareConcurrency<4)return null;let a=n.getContext(`webgl`,{alpha:!0,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!0,powerPreference:`low-power`,failIfMajorPerformanceCaveat:!0});if(!a)return null;let u=a,f=d(u,o,s),p=d(u,c,l);if(!f||!p)return null;let h=m(r),g=e=>{let t=u.createBuffer();return u.bindBuffer(u.ARRAY_BUFFER,t),u.bufferData(u.ARRAY_BUFFER,e,u.STATIC_DRAW),t},_={points:g(h.points),pointMeta:g(h.pointMeta),lines:g(h.lines),lineMeta:g(h.lineMeta)},v=e=>({rot:u.getUniformLocation(e,`u_rot`),proj:u.getUniformLocation(e,`u_proj`),dist:u.getUniformLocation(e,`u_dist`),scale:u.getUniformLocation(e,`u_scale`),reveal:u.getUniformLocation(e,`u_reveal`),accent:u.getUniformLocation(e,`u_accent`),pale:u.getUniformLocation(e,`u_pale`)}),y=v(f),b=v(p),x={pos:u.getAttribLocation(f,`a_pos`),meta:u.getAttribLocation(f,`a_meta`)},S={pos:u.getAttribLocation(p,`a_pos`),meta:u.getAttribLocation(p,`a_meta`)},C=new Float32Array(16),w=new Float32Array(9),T=3.35,E=-.3,D=0,O=0;function k(){let e=n.getBoundingClientRect();if(!e.width||!e.height)return!1;let t=Math.min(2,window.devicePixelRatio||1),r=Math.round(e.width*t),i=Math.round(e.height*t);if(r===D&&i===O)return!0;D=r,O=i,n.width=r,n.height=i,u.viewport(0,0,r,i);let a=1/Math.tan(.72/2),o=.1;return C.fill(0),C[0]=a/(r/i),C[5]=a,C[10]=20.1/(o-20),C[11]=-1,C[14]=40*o/(o-20),!0}function A(e,t,n){let r=Math.cos(e+n),i=Math.sin(e+n),a=Math.cos(t),o=Math.sin(t);w[0]=r,w[1]=o*i,w[2]=-a*i,w[3]=0,w[4]=a,w[5]=o,w[6]=i,w[7]=-o*r,w[8]=a*r}function j(e,t,n){t<0||(u.bindBuffer(u.ARRAY_BUFFER,e),u.enableVertexAttribArray(t),u.vertexAttribPointer(t,n,u.FLOAT,!1,0,0))}let M=.6,N=E,P=0,F=E,I=0,L=0,R=0,z=0,B=!0,V=!1;function H(n){z=requestAnimationFrame(H);let r=R?Math.min(.05,(n-R)/1e3):.016;R=n,k()&&(M+=r*.116,N+=(F-N)*Math.min(1,r*3.2),P+=(I-P)*Math.min(1,r*3.2),L=Math.min(1,L+r*.85),A(M,N,P),u.clearColor(0,0,0,0),u.clear(u.COLOR_BUFFER_BIT),u.enable(u.BLEND),u.blendFunc(u.ONE,u.ONE),u.useProgram(p),u.uniformMatrix3fv(b.rot,!1,w),u.uniformMatrix4fv(b.proj,!1,C),u.uniform1f(b.dist,T),u.uniform1f(b.reveal,L*L),u.uniform3fv(b.accent,e),u.uniform3fv(b.pale,t),j(_.lines,S.pos,3),j(_.lineMeta,S.meta,2),u.drawArrays(u.LINES,0,h.lineCount),u.useProgram(f),u.uniformMatrix3fv(y.rot,!1,w),u.uniformMatrix4fv(y.proj,!1,C),u.uniform1f(y.dist,T),u.uniform1f(y.scale,O*.0072),u.uniform1f(y.reveal,L),u.uniform3fv(y.accent,e),u.uniform3fv(y.pale,t),j(_.points,x.pos,3),j(_.pointMeta,x.meta,2),u.drawArrays(u.POINTS,0,h.pointCount),V||(V=!0,i()))}function U(){z||!B||document.hidden||Z.matches||(R=0,z=requestAnimationFrame(H))}function W(){z&&=(cancelAnimationFrame(z),0)}let G=n.parentElement??n,K=e=>{let t=G.getBoundingClientRect(),n=(e.clientX-t.left)/t.width-.5,r=(e.clientY-t.top)/t.height-.5;I=n*.5,F=E+r*.45},q=()=>{I=0,F=E},J=()=>{document.hidden?W():U()},Y=e=>{e.preventDefault(),W()},X=new IntersectionObserver(e=>{for(let t of e)B=t.isIntersecting;B?U():W()},{rootMargin:`96px`});X.observe(n);let Z=window.matchMedia(`(prefers-reduced-motion: reduce)`),Q=()=>{Z.matches?W():U()};return Z.addEventListener(`change`,Q),window.matchMedia(`(hover: hover) and (pointer: fine)`).matches&&(G.addEventListener(`pointermove`,K),G.addEventListener(`pointerleave`,q)),document.addEventListener(`visibilitychange`,J),n.addEventListener(`webglcontextlost`,Y),U(),()=>{W(),X.disconnect(),Z.removeEventListener(`change`,Q),G.removeEventListener(`pointermove`,K),G.removeEventListener(`pointerleave`,q),document.removeEventListener(`visibilitychange`,J),n.removeEventListener(`webglcontextlost`,Y)}}var g=document.querySelector(`[data-atlas]`),_=g?.querySelector(`[data-atlas-canvas]`);if(g&&_){let e=[];try{e=JSON.parse(g.dataset.anchors??`[]`)}catch{e=[]}let t=()=>h(_,e,()=>g.setAttribute(`data-live`,``)),n=window.requestIdleCallback;typeof n==`function`?n(t,{timeout:1200}):setTimeout(t,220)}