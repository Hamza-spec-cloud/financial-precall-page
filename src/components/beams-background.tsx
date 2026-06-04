"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── GLSL Fragment Shader ────────────────────────────────────────────────────
// Ported verbatim from Framer's warp.js (framerusercontent.com)
// Warp: domain distortion + swirl + underlying pattern shapes
const warpFragmentShader = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;

uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
    vec3 color1 = c1.rgb * c1.a;
    vec3 color2 = c2.rgb * c2.a;
    vec3 color3 = c3.rgb * c3.a;
    float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
    float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
    vec3 blended_color_2 = mix(color1, color2, r1);
    float blended_opacity_2 = mix(c1.a, c2.a, r1);
    vec3 c = mix(blended_color_2, color3, r2);
    float o = mix(blended_opacity_2, c3.a, r2);
    return vec4(c, o);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    float t = .5 * u_time;
    float noise_scale = .0005 + .006 * u_scale;

    uv -= .5;
    uv *= (noise_scale * u_resolution);
    uv = rotate(uv, u_rotation * .5 * PI);
    uv /= u_pixelRatio;
    uv += .5;

    float n1 = noise(uv * 1. + t);
    float n2 = noise(uv * 2. - t);
    float angle = n1 * TWO_PI;
    uv.x += 4. * u_distortion * n2 * cos(angle);
    uv.y += 4. * u_distortion * n2 * sin(angle);

    float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
    for (float i = 1.; i <= iterations_number; i++) {
        uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
        uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
    }

    float proportion = clamp(u_proportion, 0., 1.);
    float shape = 0.;
    float mixer = 0.;

    if (u_shape < .5) {
      vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
      shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else if (u_shape < 1.5) {
      vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
      float f = fract(stripes_shape_uv.y);
      shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else {
      float sh = 1. - uv.y;
      sh -= .5;
      sh /= (noise_scale * u_resolution.y);
      sh += .5;
      float shape_scaling = .2 * (1. - u_shapeScale);
      shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
      mixer = shape;
    }

    vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
    fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;

const vertexShaderSource = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

// ─── ShaderMount ─────────────────────────────────────────────────────────────
type UniformValue = number | number[];
type UniformMap = Record<string, UniformValue>;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return null;
  }
  gl.detachShader(program, vert);
  gl.detachShader(program, frag);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  return program;
}

class ShaderMount {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null = null;
  uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  fragmentShader: string;
  rafId: number | null = null;
  lastFrameTime: number = 0;
  totalAnimationTime: number;
  speed: number;
  providedUniforms: UniformMap;
  hasBeenDisposed: boolean = false;
  resolutionChanged: boolean = true;
  resizeObserver: ResizeObserver | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    fragmentShader: string,
    uniforms: UniformMap = {},
    webGlContextAttributes?: WebGLContextAttributes,
    speed: number = 1,
    seed: number = 0
  ) {
    this.canvas = canvas;
    this.fragmentShader = fragmentShader;
    this.providedUniforms = uniforms;
    this.totalAnimationTime = seed;
    this.speed = speed;
    const gl = canvas.getContext("webgl2", webGlContextAttributes);
    if (!gl) throw new Error("WebGL2 not supported");
    this.gl = gl;
    this.initWebGL();
    this.setupResizeObserver();
    this.setSpeed(speed);
  }

  initWebGL() {
    const program = createProgram(this.gl, vertexShaderSource, this.fragmentShader);
    if (!program) return;
    this.program = program;
    this.setupPositionAttribute();
    this.setupUniforms();
  }

  setupPositionAttribute() {
    const loc = this.gl.getAttribLocation(this.program!, "a_position");
    const buf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(loc);
    this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0);
  }

  setupUniforms() {
    this.uniformLocations = {
      u_time: this.gl.getUniformLocation(this.program!, "u_time"),
      u_pixelRatio: this.gl.getUniformLocation(this.program!, "u_pixelRatio"),
      u_resolution: this.gl.getUniformLocation(this.program!, "u_resolution"),
      ...Object.fromEntries(Object.keys(this.providedUniforms).map(k => [k, this.gl.getUniformLocation(this.program!, k)])),
    };
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.canvas);
    this.handleResize();
  }

  handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth * dpr;
    const h = this.canvas.clientHeight * dpr;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.resolutionChanged = true;
      this.gl.viewport(0, 0, w, h);
      this.render(performance.now());
    }
  }

  render = (currentTime: number) => {
    if (this.hasBeenDisposed) return;
    const dt = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    if (this.speed !== 0) this.totalAnimationTime += dt * this.speed;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uniformLocations.u_time as WebGLUniformLocation, this.totalAnimationTime * 0.001);
    if (this.resolutionChanged) {
      this.gl.uniform2f(this.uniformLocations.u_resolution as WebGLUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
      this.gl.uniform1f(this.uniformLocations.u_pixelRatio as WebGLUniformLocation, window.devicePixelRatio || 1);
      this.resolutionChanged = false;
    }
    this.updateProvidedUniforms();
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    if (this.speed !== 0) this.requestRender();
    else this.rafId = null;
  };

  requestRender() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.render);
  }

  updateProvidedUniforms() {
    this.gl.useProgram(this.program);
    Object.entries(this.providedUniforms).forEach(([key, value]) => {
      const loc = this.uniformLocations[key];
      if (!loc) return;
      if (Array.isArray(value)) {
        switch (value.length) {
          case 2: this.gl.uniform2fv(loc, value); break;
          case 3: this.gl.uniform3fv(loc, value); break;
          case 4: this.gl.uniform4fv(loc, value); break;
        }
      } else if (typeof value === "number") {
        this.gl.uniform1f(loc, value);
      }
    });
  }

  setSpeed(newSpeed: number) {
    this.speed = newSpeed;
    if (this.rafId === null && newSpeed !== 0) {
      this.lastFrameTime = performance.now();
      this.rafId = requestAnimationFrame(this.render);
    }
    if (this.rafId !== null && newSpeed === 0) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  setUniforms(newUniforms: UniformMap) {
    this.providedUniforms = { ...this.providedUniforms, ...newUniforms };
    this.updateProvidedUniforms();
    this.render(performance.now());
  }

  setSeed(newSeed: number) {
    this.totalAnimationTime = newSeed * (1000 / 120);
    this.lastFrameTime = performance.now();
    this.render(performance.now());
  }

  dispose() {
    this.hasBeenDisposed = true;
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
    if (this.resizeObserver) { this.resizeObserver.disconnect(); this.resizeObserver = null; }
    this.uniformLocations = {};
  }
}

// ─── Color utility ────────────────────────────────────────────────────────────
function hexToShaderColor(hex: string): [number, number, number, number] {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (h.length === 6) h = h + "ff";
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = parseInt(h.slice(6, 8), 16) / 255;
  return [r, g, b, a];
}

// ─── Shader uniforms — Framer "Mist" preset ───────────────────────────────────
const SHADER_UNIFORMS: UniformMap = {
  u_scale: 0.48,
  u_rotation: 0,
  u_color1: hexToShaderColor("#161616"),
  u_color2: hexToShaderColor("#FF66B8"),
  u_color3: hexToShaderColor("#161616"),
  u_proportion: 0.33,
  u_softness: 1.0,
  u_distortion: 0.08,
  u_swirl: 0.65,
  u_swirlIterations: 5,
  u_shapeScale: 0.48,
  u_shape: 2,
};

const SPEED_MAP: Record<string, number> = { subtle: 0.07, medium: 0.1, strong: 0.16 };

// ─── Component ───────────────────────────────────────────────────────────────

interface BeamsBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

export function BeamsBackground({
  className,
  children,
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const speed = SPEED_MAP[intensity] ?? 1.0;

    try {
      mountRef.current = new ShaderMount(
        canvas,
        warpFragmentShader,
        SHADER_UNIFORMS,
        undefined,
        speed,
        -2350
      );
    } catch {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        mountRef.current?.setSpeed(entry.isIntersecting ? speed : 0);
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      mountRef.current?.setSpeed(document.hidden ? 0 : speed);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountRef.current?.dispose();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "relative w-full min-h-screen overflow-hidden bg-[#121212]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{
          width: "100%",
          height: "100%",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{ background: "#121212", opacity: 0.35 }}
      />
      <div className="relative z-20 w-full h-full">{children}</div>
    </div>
  );
}
