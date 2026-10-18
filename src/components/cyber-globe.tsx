"use client";

import { useEffect, useRef } from "react";

type Vec3 = { x: number; y: number; z: number };
type GeoPoint = { lat: number; lon: number; weight: number; land: boolean };
type Polygon = readonly (readonly [number, number])[];

// An intentionally abstract atlas, built locally; no texture downloads or location data.
const LAND: readonly Polygon[] = [
  [
    [-168, 71],
    [-145, 70],
    [-130, 55],
    [-122, 49],
    [-124, 39],
    [-117, 30],
    [-109, 23],
    [-99, 17],
    [-89, 20],
    [-82, 9],
    [-78, 9],
    [-86, 22],
    [-81, 25],
    [-81, 30],
    [-75, 36],
    [-66, 44],
    [-61, 51],
    [-77, 58],
    [-82, 68],
    [-105, 73],
    [-125, 72],
    [-148, 64],
  ],
  [
    [-81, 12],
    [-69, 10],
    [-59, 6],
    [-51, 2],
    [-35, -7],
    [-40, -20],
    [-49, -29],
    [-54, -35],
    [-66, -55],
    [-72, -50],
    [-75, -31],
    [-70, -17],
    [-79, -3],
  ],
  [
    [-53, 83],
    [-25, 75],
    [-22, 68],
    [-43, 59],
    [-59, 65],
    [-64, 75],
  ],
  [
    [-11, 36],
    [-10, 44],
    [-4, 48],
    [6, 54],
    [5, 61],
    [17, 71],
    [30, 71],
    [29, 59],
    [43, 65],
    [63, 70],
    [98, 77],
    [129, 70],
    [145, 59],
    [173, 65],
    [179, 51],
    [158, 50],
    [143, 43],
    [137, 35],
    [124, 39],
    [121, 25],
    [111, 18],
    [104, 9],
    [99, 7],
    [99, 22],
    [89, 22],
    [79, 7],
    [72, 22],
    [60, 27],
    [52, 15],
    [44, 13],
    [36, 31],
    [26, 40],
    [20, 39],
    [10, 45],
    [4, 42],
    [-1, 36],
  ],
  [
    [-17, 34],
    [-1, 37],
    [10, 35],
    [22, 33],
    [33, 31],
    [41, 13],
    [51, 11],
    [43, -1],
    [39, -17],
    [30, -30],
    [19, -35],
    [11, -18],
    [8, 3],
    [-4, 5],
    [-15, 13],
  ],
  [
    [113, -22],
    [114, -34],
    [128, -35],
    [137, -32],
    [145, -39],
    [153, -27],
    [146, -17],
    [135, -12],
    [125, -14],
  ],
  [
    [47, -13],
    [51, -15],
    [49, -25],
    [44, -25],
  ],
  [
    [-10, 50],
    [-6, 59],
    [-2, 58],
    [1, 51],
  ],
  [
    [130, 32],
    [136, 35],
    [142, 43],
    [145, 44],
    [142, 36],
    [134, 32],
  ],
  [
    [96, 5],
    [106, -6],
    [117, -8],
    [130, -4],
    [141, -4],
    [149, -9],
    [139, -10],
    [127, -8],
    [117, -5],
    [109, 0],
  ],
  [
    [166, -34],
    [178, -38],
    [172, -44],
    [165, -47],
  ],
];

const STATIONS = [
  { lat: 51.5, lon: -0.1 },
  { lat: 1.3, lon: 103.8 },
  { lat: 40.7, lon: -74 },
  { lat: 35.7, lon: 139.7 },
  { lat: -33.9, lon: 151.2 },
  { lat: -23.5, lon: -46.6 },
  { lat: 25.2, lon: 55.3 },
];

function inside(lon: number, lat: number, polygon: Polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      result = !result;
  }
  return result;
}

function sphere(lat: number, lon: number, radius = 1): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180;
  return {
    x: Math.cos(phi) * Math.sin(theta) * radius,
    y: -Math.sin(phi) * radius,
    z: Math.cos(phi) * Math.cos(theta) * radius,
  };
}

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export default function CyberGlobe({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let elapsed = 0;
    let lastTime = 0;
    let visible = true;
    let disposed = false;
    let pointer = { x: 0, y: 0 };
    let easedPointer = { x: 0, y: 0 };
    let points: GeoPoint[] = [];
    let mobile = false;

    function buildPoints() {
      points = [];
      const step = mobile ? 3.15 : 2.15;
      let index = 0;
      for (let lat = -70; lat < 82; lat += step) {
        const longitudeStep =
          step / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
        for (let lon = -180; lon < 180; lon += longitudeStep) {
          index++;
          const land = LAND.some((polygon) => inside(lon, lat, polygon));
          if (land || index % 5 === 0)
            points.push({ lat, lon, weight: hash(index), land });
        }
      }
    }

    function draw(now: number) {
      if (!ctx || !canvas || disposed) return;
      frame = 0;
      if (lastTime && !motion.matches)
        elapsed += Math.min(now - lastTime, 40) / 1000;
      lastTime = now;
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.49;
      const radius = Math.min(width, height) * 0.335;
      const rotation = elapsed * 0.055 - 0.43;
      easedPointer.x += (pointer.x - easedPointer.x) * 0.035;
      easedPointer.y += (pointer.y - easedPointer.y) * 0.035;
      const yaw = rotation + easedPointer.x * 0.075;
      const pitch = -0.12 + easedPointer.y * 0.04;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      function transform(v: Vec3): Vec3 {
        const x = v.x * cosYaw + v.z * sinYaw;
        const z = v.z * cosYaw - v.x * sinYaw;
        return {
          x,
          y: v.y * cosPitch - z * sinPitch,
          z: z * cosPitch + v.y * sinPitch,
        };
      }

      function project(v: Vec3) {
        // Very slight perspective keeps the sphere architectural and legible.
        const p = 1 + v.z * 0.035;
        return { x: cx + v.x * radius * p, y: cy + v.y * radius * p, z: v.z };
      }

      function line(
        vertices: Vec3[],
        color: string,
        thickness = 0.6,
        frontOnly = false,
      ) {
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        let running = false;
        for (const vertex of vertices) {
          const v = transform(vertex);
          const p = project(v);
          if (frontOnly && v.z < -0.02) {
            running = false;
            continue;
          }
          if (running) ctx.lineTo(p.x, p.y);
          else {
            ctx.moveTo(p.x, p.y);
            running = true;
          }
        }
        ctx.stroke();
      }

      // Atmosphere, restrained to the edge so that the points retain definition.
      const atmosphere = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.65,
        cx,
        cy,
        radius * 1.5,
      );
      atmosphere.addColorStop(0, "rgba(0,255,156,0.012)");
      atmosphere.addColorStop(0.52, "rgba(0,255,156,0.042)");
      atmosphere.addColorStop(0.68, "rgba(0,217,255,0.014)");
      atmosphere.addColorStop(1, "rgba(0,217,255,0)");
      ctx.fillStyle = atmosphere;
      ctx.fillRect(
        cx - radius * 1.5,
        cy - radius * 1.5,
        radius * 3,
        radius * 3,
      );

      // Inclined orbital hardware surrounds the digital atlas.
      for (let ring = 0; ring < 2; ring++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ring ? -0.52 : -0.29);
        ctx.strokeStyle = ring
          ? "rgba(0,217,255,0.13)"
          : "rgba(0,255,156,0.23)";
        ctx.lineWidth = 0.65;
        ctx.setLineDash(ring ? [1, 8] : [32, 5, 2, 5]);
        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius * (ring ? 1.37 : 1.43),
          radius * (ring ? 0.75 : 0.37),
          0,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.setLineDash([]);
        const orbitAngle = elapsed * (ring ? -0.1 : 0.16) + (ring ? 1.5 : 0.8);
        const ox = Math.cos(orbitAngle) * radius * (ring ? 1.37 : 1.43);
        const oy = Math.sin(orbitAngle) * radius * (ring ? 0.75 : 0.37);
        ctx.fillStyle = ring ? "#00d9ff" : "#a4ffda";
        ctx.shadowColor = ring ? "#00d9ff" : "#00ff9c";
        ctx.shadowBlur = 12;
        ctx.fillRect(ox - 2, oy - 2, 4, 4);
        ctx.restore();
      }

      // Rear meridians show through faintly, like a holographic instrument.
      for (let lon = 0; lon < 180; lon += 20) {
        const vertices: Vec3[] = [];
        for (let angle = 0; angle <= 360; angle += 4) {
          const a = (angle * Math.PI) / 180;
          const b = (lon * Math.PI) / 180;
          vertices.push({
            x: Math.cos(a) * Math.sin(b),
            y: Math.sin(a),
            z: Math.cos(a) * Math.cos(b),
          });
        }
        line(vertices, "rgba(0,255,156,0.057)", 0.55);
        line(vertices, "rgba(0,255,156,0.085)", 0.6, true);
      }
      for (let lat = -60; lat <= 60; lat += 20) {
        const vertices: Vec3[] = [];
        for (let lon = -180; lon <= 180; lon += 4)
          vertices.push(sphere(lat, lon));
        line(vertices, "rgba(0,217,255,0.057)", 0.55);
        line(vertices, "rgba(0,217,255,0.09)", 0.6, true);
      }

      // Fine, evenly spaced terrestrial points; oceans remain almost empty.
      for (const point of points) {
        const v = transform(sphere(point.lat, point.lon));
        const p = project(v);
        const front = Math.max(0, v.z);
        const alpha = point.land
          ? v.z > 0
            ? 0.29 + front * 0.65
            : 0.055
          : 0.035 + front * 0.065;
        const size = point.land
          ? (mobile ? 0.8 : 0.72) + front * 0.43 + point.weight * 0.15
          : 0.5;
        ctx.fillStyle = point.land
          ? `rgba(${point.weight > 0.9 ? "67,236,225" : "0,255,156"},${alpha})`
          : `rgba(0,217,255,${alpha})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }

      // Great-circle mission paths have raised, softly luminous trajectories.
      for (let connection = 1; connection < STATIONS.length; connection++) {
        const start = sphere(STATIONS[0].lat, STATIONS[0].lon);
        const end = sphere(STATIONS[connection].lat, STATIONS[connection].lon);
        const angle = Math.acos(
          Math.max(
            -1,
            Math.min(1, start.x * end.x + start.y * end.y + start.z * end.z),
          ),
        );
        const arc: Vec3[] = [];
        const steps = mobile ? 32 : 48;
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          const a = Math.sin((1 - t) * angle) / Math.sin(angle);
          const b = Math.sin(t * angle) / Math.sin(angle);
          const lift = 1 + Math.sin(t * Math.PI) * 0.13;
          arc.push({
            x: (start.x * a + end.x * b) * lift,
            y: (start.y * a + end.y * b) * lift,
            z: (start.z * a + end.z * b) * lift,
          });
        }
        line(
          arc,
          connection % 2 ? "rgba(0,255,156,0.3)" : "rgba(0,217,255,0.25)",
          0.75,
          true,
        );
        const packet =
          arc[Math.floor(((elapsed * 0.1 + connection * 0.17) % 1) * steps)];
        const packetV = transform(packet);
        if (packetV.z > 0) {
          const p = project(packetV);
          ctx.fillStyle = "rgba(172,255,226,0.9)";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00ff9c";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      STATIONS.forEach((station, index) => {
        const v = transform(sphere(station.lat, station.lon, 1.006));
        if (v.z < 0.05) return;
        const p = project(v);
        const pulse = (elapsed * 0.35 + index * 0.24) % 1;
        ctx.strokeStyle = `rgba(0,255,156,${(1 - pulse) * 0.36})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + pulse * 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = index === 0 ? "#d2ffeb" : "#00ff9c";
        ctx.shadowBlur = 9;
        ctx.shadowColor = "#00ff9c";
        ctx.beginPath();
        ctx.arc(p.x, p.y, index === 0 ? 2.6 : 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Thin horizon and targeting ticks give the display a precise silhouette.
      ctx.strokeStyle = "rgba(0,255,156,0.19)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.018, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        const inner = radius * (i % 8 === 0 ? 1.075 : 1.09);
        const outer = radius * 1.105;
        ctx.strokeStyle =
          i % 8 === 0 ? "rgba(0,255,156,0.35)" : "rgba(0,217,255,0.14)";
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
        ctx.stroke();
      }
      if (visible && !document.hidden && !motion.matches)
        frame = requestAnimationFrame(draw);
    }

    function start() {
      if (disposed || !visible || document.hidden || frame) return;
      lastTime = 0;
      frame = requestAnimationFrame(draw);
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
    function resize() {
      if (!canvas || !container || !ctx) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const nextMobile = width < 500;
      if (!points.length || mobile !== nextMobile) {
        mobile = nextMobile;
        buildPoints();
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (motion.matches) draw(performance.now());
      else start();
    }
    function onPointer(event: PointerEvent) {
      if (motion.matches || event.pointerType === "touch") return;
      const rect = container!.getBoundingClientRect();
      pointer = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
    }
    function onLeave() {
      pointer = { x: 0, y: 0 };
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onMotion() {
      stop();
      if (motion.matches) draw(performance.now());
      else start();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    container.addEventListener("pointermove", onPointer, { passive: true });
    container.addEventListener("pointerleave", onLeave);
    motion.addEventListener("change", onMotion);
    resize();

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointermove", onPointer);
      container.removeEventListener("pointerleave", onLeave);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
