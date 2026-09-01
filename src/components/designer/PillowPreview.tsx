// PillowPreview.tsx
import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, FONT_MONO } from "../../theme";
import { FABRICS, PIPING, findOption } from "../../data/designerOptions";
import { FABRIC_WEAVES } from "../../data/fabricTextures";
import type {
  MonogramFont,
  MonogramSpacing,
  MonogramTexture,
  PillowDesignState,
} from "../../types/designer";



// Public path to the GLTF pillow asset
const MODEL_URL = "/pillow__black/scene.gltf";

export interface PillowPreviewProps {
  pillows?: PillowDesignState[];
  design?: PillowDesignState;
  activePillowId?: string;
  onSelectPillow?: (id: string) => void;
}

export function PillowPreview({
  pillows,
  design,
  activePillowId,
  onSelectPillow,
}: PillowPreviewProps) {
  // Normalize pillows array from props
  const pillowList = useMemo(() => {
    if (pillows && pillows.length > 0) return pillows;
    if (design) return [design];
    return [];
  }, [pillows, design]);

  const activePillow = useMemo(() => {
    if (activePillowId) {
      const found = pillowList.find((p) => (p.id ? p.id === activePillowId : false));
      if (found) return found;
    }
    return pillowList[0] ?? design;
  }, [pillowList, activePillowId, design]);

  const [viewMode, setViewMode] = useState<"focus" | "set">("focus");

  // If there's only 1 pillow, always show focus mode
  const effectiveViewMode = pillowList.length > 1 ? viewMode : "focus";

  const fabric = findOption(FABRICS, activePillow?.fabricId ?? "linen-oat");
  const weave = FABRIC_WEAVES[fabric.weave ?? "linen"];

  return (
    <div
      style={{
        aspectRatio: "1 / 1",
        borderRadius: 16,
        background: COLORS.bgDeep2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Multi-Pillow View Toggle */}
      {pillowList.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 10,
            display: "flex",
            background: "rgba(18, 30, 25, 0.75)",
            backdropFilter: "blur(8px)",
            padding: 3,
            borderRadius: 999,
            border: `1px solid ${COLORS.lineOnDark}`,
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode("focus")}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: "0.04em",
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              background: effectiveViewMode === "focus" ? COLORS.gold : "transparent",
              color: effectiveViewMode === "focus" ? COLORS.ink : COLORS.cream,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Focus View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("set")}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: "0.04em",
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              background: effectiveViewMode === "set" ? COLORS.gold : "transparent",
              color: effectiveViewMode === "set" ? COLORS.ink : COLORS.cream,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Set View ({pillowList.length})
          </button>
        </div>
      )}

      {/* 3D Canvas */}
      <ModelErrorBoundary>
        <Canvas
          camera={{
            position: effectiveViewMode === "set" ? [0, 0.35, 3.4] : [0, 0.18, 2.65],
            fov: effectiveViewMode === "set" ? 42 : 36,
          }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.65} />
          {/* Key light for stitch specular highlights */}
          <directionalLight position={[3.5, 4.5, 3]} intensity={1.35} />
          {/* Fill light */}
          <directionalLight position={[-3, 1.5, -2]} intensity={0.45} />
          {/* Top rim light */}
          <directionalLight position={[0, 3, -3]} intensity={0.35} />

          <Suspense fallback={null}>
            <Center>
              {effectiveViewMode === "focus" && activePillow ? (
                <PillowItem
                  design={activePillow}
                  scaleFactor={1}
                  position={[0, 0, 0]}
                  rotation={[0, 0, 0]}
                />
              ) : (
                <PillowsArrangement
                  pillows={pillowList}
                  activePillowId={activePillowId ?? pillowList[0]?.id}
                  onSelectPillow={onSelectPillow}
                />
              )}
            </Center>
          </Suspense>

          <ContactShadows
            position={[0, -0.85, 0]}
            opacity={0.5}
            blur={2.4}
            far={2.5}
            scale={effectiveViewMode === "set" ? 6 : 4}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={1.2}
            maxDistance={5.0}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 1.75}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </ModelErrorBoundary>

      <a
        href={weave.sourceUrl}
        target="_blank"
        rel="noreferrer"
        style={{
          position: "absolute",
          bottom: 8,
          left: 12,
          fontFamily: FONT_MONO,
          fontSize: 10,
          color: "rgba(244,241,232,0.45)",
          textDecoration: "none",
        }}
      >
        Fabric: Poly Haven (CC0)
      </a>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Multi-Pillow Arrangement Component
// -----------------------------------------------------------------------------
interface PillowsArrangementProps {
  pillows: PillowDesignState[];
  activePillowId?: string;
  onSelectPillow?: (id: string) => void;
}

function PillowsArrangement({
  pillows,
  activePillowId,
  onSelectPillow,
}: PillowsArrangementProps) {
  const count = pillows.length;

  const transforms = useMemo(() => {
    if (count === 1) {
      return [{ position: [0, 0, 0] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1 }];
    }
    if (count === 2) {
      return [
        { position: [-0.62, 0, 0.12] as [number, number, number], rotation: [0, 0.18, 0.04] as [number, number, number], scale: 0.88 },
        { position: [0.62, 0, -0.12] as [number, number, number], rotation: [0, -0.18, -0.04] as [number, number, number], scale: 0.88 },
      ];
    }
    if (count === 3) {
      return [
        { position: [-0.92, -0.02, 0.0] as [number, number, number], rotation: [0, 0.28, 0.05] as [number, number, number], scale: 0.8 },
        { position: [0, 0.06, 0.24] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 0.86 },
        { position: [0.92, -0.02, 0.0] as [number, number, number], rotation: [0, -0.28, -0.05] as [number, number, number], scale: 0.8 },
      ];
    }
    // 4 or more pillows: arrange in staggered layout
    return pillows.map((_, idx) => {
      const offset = (idx - (count - 1) / 2) * 0.72;
      const zOffset = Math.sin((idx / (count - 1)) * Math.PI) * 0.28;
      const rotY = -(idx - (count - 1) / 2) * 0.14;
      return {
        position: [offset, 0, zOffset] as [number, number, number],
        rotation: [0, rotY, 0] as [number, number, number],
        scale: 0.75,
      };
    });
  }, [count, pillows]);

  return (
    <group>
      {pillows.map((pillow, idx) => {
        const t = transforms[idx] ?? { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 };
        const isSelected = pillow.id === activePillowId;
        return (
          <group
            key={pillow.id ?? idx}
            position={t.position}
            rotation={t.rotation}
            onClick={(e) => {
              e.stopPropagation();
              if (pillow.id && onSelectPillow) {
                onSelectPillow(pillow.id);
              }
            }}
          >
            <PillowItem
              design={pillow}
              isSelected={isSelected}
              scaleFactor={t.scale}
            />
          </group>
        );
      })}
    </group>
  );
}

// -----------------------------------------------------------------------------
// Single Pillow Item
// -----------------------------------------------------------------------------
interface PillowItemProps {
  design: PillowDesignState;
  isSelected?: boolean;
  scaleFactor?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function PillowItem({
  design,
  scaleFactor = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: PillowItemProps) {
  const fabric = findOption(FABRICS, design.fabricId);
  const piping = findOption(PIPING, design.pipingId);
  const weave = FABRIC_WEAVES[fabric.weave ?? "linen"];
  const fabricHex = fabric.swatchHex ?? "#D8CCB4";
  const pipingHex = piping.id !== "piping-none" ? piping.swatchHex ?? COLORS.cream : null;

  // Monogram customization options
  const monogram = design.monogram?.trim() ? design.monogram.trim().slice(0, 3).toUpperCase() : null;
  const monogramFont = design.monogramFont ?? "serif";
  const monogramTexture = design.monogramTexture ?? "satin";
  const monogramSpacing = design.monogramSpacing ?? "standard";
  const monogramSize = design.monogramSize ?? "md";
  const threadColor = (design.monogramColor && design.monogramColor !== "auto")
    ? design.monogramColor
    : threadColorFor(fabricHex);

  const baseWorldSize = monogramSize === "sm" ? 0.30 : monogramSize === "lg" ? 0.48 : 0.38;

  const { scene } = useGLTF(MODEL_URL);
  const [diffuseMap, normalMap, roughnessMap] = useTexture([weave.diffuse, weave.normal, weave.roughness]);

  // Compute immutable base scale once from the unscaled scene asset
  const baseScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 1.6 / maxDim : 0.009228;
  }, [scene]);

  const finalScale = baseScale * scaleFactor;

  // Clone scene hierarchy and orient upright with front face facing forward (+Z)
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    // Rotate model 90 degrees around X axis so square face stands upright facing +Z
    c.rotation.set(Math.PI / 2, 0, 0);
    return c;
  }, [scene]);

  // Extract all meshes in the cloned object
  const meshes = useMemo(() => {
    const found: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
        found.push(m);
      }
    });
    return found;
  }, [cloned]);

  // Assign individual cloned materials
  useEffect(() => {
    meshes.forEach((mesh) => {
      const source = mesh.material as THREE.MeshStandardMaterial;
      if (source) {
        mesh.material = source.clone();
      }
    });
  }, [meshes]);

  // Apply fabric color tinting and repeated PolyHaven weave textures
  useEffect(() => {
    const clonedTextures: THREE.Texture[] = [];

    meshes.forEach((mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (!material) return;

      const diffuse = diffuseMap.clone();
      const normal = normalMap.clone();
      const roughness = roughnessMap.clone();

      [diffuse, normal, roughness].forEach((tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(weave.repeat, weave.repeat);
        tex.needsUpdate = true;
        clonedTextures.push(tex);
      });
      diffuse.colorSpace = THREE.SRGBColorSpace;

      material.map = diffuse;
      material.normalMap = normal;
      material.roughnessMap = roughness;
      material.roughness = 0.95;
      material.color.set(fabricHex);
      material.side = THREE.DoubleSide;
      material.needsUpdate = true;
    });

    return () => {
      clonedTextures.forEach((tex) => tex.dispose());
    };
  }, [meshes, diffuseMap, normalMap, roughnessMap, weave.repeat, fabricHex]);

  // Piping outline
  useEffect(() => {
    const added: THREE.LineSegments[] = [];
    if (pipingHex) {
      meshes.forEach((mesh) => {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: pipingHex, linewidth: 2 })
        );
        line.name = "piping-outline";
        mesh.add(line);
        added.push(line);
      });
    }
    return () => {
      added.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
        line.parent?.remove(line);
      });
    };
  }, [meshes, pipingHex]);

  // ---------------------------------------------------------------------------
  // Front-Face Monogram Decal Placement
  // Directly anchors on the front face apex of the cushion geometry
  // ---------------------------------------------------------------------------
  const monogramPlacement = useMemo(() => {
    if (!monogram || meshes.length === 0) return null;

    // In local model coordinates: front cushion face apex is at Z = 46.32
    // Placing at Z = 46.8 ensures it sits right on the front face without clipping
    return {
      position: [0.0, 0.0, 46.8] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      size: baseWorldSize / baseScale,
    };
  }, [monogram, meshes, baseScale, baseWorldSize]);

  return (
    <group position={position} rotation={rotation}>
      <group scale={finalScale}>
        <primitive object={cloned} />
        {monogram && monogramPlacement && (
          <MonogramDecal
            text={monogram}
            font={monogramFont}
            texture={monogramTexture}
            threadColor={threadColor}
            spacing={monogramSpacing}
            position={monogramPlacement.position}
            rotation={monogramPlacement.rotation}
            size={monogramPlacement.size}
          />
        )}
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// High-Contrast Luxury Thread Color Palette
// -----------------------------------------------------------------------------
function threadColorFor(fabricHex: string): string {
  const upper = fabricHex.toUpperCase();
  // Midnight Velvet -> Brilliant Champagne Gold thread
  if (upper.includes("182B49") || upper.includes("1A365D") || upper.includes("0C1826")) return "#F0DFB0";
  // Velvet Wine -> Rich Champagne Gold thread
  if (upper.includes("5C1F2E") || upper.includes("4E1D29")) return "#E5C158";
  // Velvet Moss -> Warm Satin Gold thread
  if (upper.includes("3E4A34")) return "#DFBA63";
  // Silk Gold -> Deep Midnight Oxford Navy thread
  if (upper.includes("C7A24C")) return "#0C1826";
  // Clay Linen -> Pure Ivory Cream thread
  if (upper.includes("B97D5D")) return "#FBF9F4";
  // Oat Linen -> Deep Espresso thread
  if (upper.includes("D8CCB4")) return "#141E28";

  // Luminance calculation fallback
  const hex = fabricHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? "#121922" : "#F7F5EE";
}

// -----------------------------------------------------------------------------
// 3D Physical Embroidery Decal Component
// Generates raised physical thread normal/bump textures reacting realistically to light
// -----------------------------------------------------------------------------
interface MonogramDecalProps {
  text: string;
  font: MonogramFont;
  texture: MonogramTexture;
  threadColor: string;
  spacing: MonogramSpacing;
  position: [number, number, number];
  rotation: [number, number, number];
  size: number;
}

function MonogramDecal({
  text,
  font = "serif",
  texture = "satin",
  threadColor,
  spacing = "standard",
  position,
  rotation,
  size,
}: MonogramDecalProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate procedural embroidery diffuse & bump map textures
  const { diffTex, bumpTex } = useMemo(() => {
    const width = 1024;
    const height = 512;

    const diffCanvas = document.createElement("canvas");
    diffCanvas.width = width;
    diffCanvas.height = height;
    const diffCtx = diffCanvas.getContext("2d");

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext("2d");

    if (diffCtx && bumpCtx) {
      // 1. Clear backgrounds
      diffCtx.clearRect(0, 0, width, height);
      bumpCtx.fillStyle = "#000000";
      bumpCtx.fillRect(0, 0, width, height);

      // Select Typography font
      let fontStyle = `bold 165px "Playfair Display", Georgia, "Times New Roman", serif`;
      let textOffsetY = 10;
      if (font === "script") {
        fontStyle = `italic 195px "Great Vibes", "Brush Script MT", cursive`;
        textOffsetY = 5;
      } else if (font === "sans") {
        fontStyle = `bold 155px "Plus Jakarta Sans", -apple-system, sans-serif`;
        textOffsetY = 8;
      } else if (font === "mono") {
        fontStyle = `bold 140px "Space Mono", monospace`;
        textOffsetY = 8;
      }

      diffCtx.font = fontStyle;
      diffCtx.textAlign = "center";
      diffCtx.textBaseline = "middle";

      bumpCtx.font = fontStyle;
      bumpCtx.textAlign = "center";
      bumpCtx.textBaseline = "middle";

      const cleanText = text.slice(0, 3).toUpperCase();
      const cx = width / 2;
      const cy = height / 2 + textOffsetY;

      // Calculate letter spacing offset
      const spacingOffset = spacing === "tight" ? -14 : spacing === "wide" ? 30 : 6;

      const drawText = (ctx: CanvasRenderingContext2D, fill: string) => {
        ctx.fillStyle = fill;
        if (cleanText.length <= 1) {
          ctx.fillText(cleanText, cx, cy);
        } else {

          // Render characters with precise horizontal spacing
          const chars = cleanText.split("");
          const widths = chars.map((c) => ctx.measureText(c).width);
          const totalWidth = widths.reduce((acc, w) => acc + w, 0) + (chars.length - 1) * spacingOffset;
          let currentX = cx - totalWidth / 2;
          chars.forEach((c, i) => {
            ctx.fillText(c, currentX + widths[i] / 2, cy);
            currentX += widths[i] + spacingOffset;
          });
        }
      };

      // 2. Render base text geometry in bump canvas (raised baseline height)
      drawText(bumpCtx, "#D0D0D0");

      // 3. Procedural Thread Texture finish on Bump Map
      bumpCtx.save();
      bumpCtx.globalCompositeOperation = "source-atop";

      if (texture === "silk") {
        // Ultra-fine 30-degree micro-filaments
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 2.4;
        const step = 4.5;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x + height * 0.55, height);
          bumpCtx.stroke();
        }
      } else if (texture === "cotton") {
        // Natural cross-hatch organic matte weave
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 3.2;
        const step = 7;
        for (let x = 0; x < width; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x, height);
          bumpCtx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(0, y);
          bumpCtx.lineTo(width, y);
          bumpCtx.stroke();
        }
      } else if (texture === "metallic") {
        // Heavy bullion coiled wire grooves
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 4.5;
        const step = 6;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x + height * 0.9, height);
          bumpCtx.stroke();
        }
      } else {
        // Classic Satin Stitch (45-degree dense thread grooves)
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 4;
        const step = 7;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x + height * 0.75, height);
          bumpCtx.stroke();
        }
      }
      bumpCtx.restore();

      // 4. Render Thread Base on Diffuse Canvas
      drawText(diffCtx, threadColor);

      // 5. Texture Sheen / Highlight Ridges on Diffuse Canvas
      diffCtx.save();
      diffCtx.globalCompositeOperation = "source-atop";

      if (texture === "silk") {
        // High-specular silk shimmer
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.42)";
        diffCtx.lineWidth = 1.8;
        const step = 4.5;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.55, height);
          diffCtx.stroke();
        }
      } else if (texture === "cotton") {
        // Soft matte organic variations
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.14)";
        diffCtx.lineWidth = 2.0;
        const step = 7;
        for (let x = 0; x < width; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.22)";
        for (let y = 0; y < height; y += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(0, y);
          diffCtx.lineTo(width, y);
          diffCtx.stroke();
        }
      } else if (texture === "metallic") {
        // Brilliant metallic bullion gold/silver glint
        diffCtx.strokeStyle = "rgba(255, 248, 210, 0.65)";
        diffCtx.lineWidth = 2.4;
        const step = 6;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.9, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.40)";
        diffCtx.lineWidth = 2.0;
        for (let x = -height + 3.0; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.9, height);
          diffCtx.stroke();
        }
      } else {
        // Satin Stitch sheen
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        diffCtx.lineWidth = 2.0;
        const step = 7;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.75, height);
          diffCtx.stroke();
        }

        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        diffCtx.lineWidth = 1.6;
        for (let x = -height + 3.5; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.75, height);
          diffCtx.stroke();
        }
      }
      diffCtx.restore();
    }

    const dTex = new THREE.CanvasTexture(diffCanvas);
    dTex.colorSpace = THREE.SRGBColorSpace;
    dTex.needsUpdate = true;

    const bTex = new THREE.CanvasTexture(bumpCanvas);
    bTex.needsUpdate = true;

    return { diffTex: dTex, bumpTex: bTex };
  }, [text, font, texture, threadColor, spacing]);

  // Clean up textures on unmount or change
  useEffect(() => {
    return () => {
      diffTex.dispose();
      bumpTex.dispose();
    };
  }, [diffTex, bumpTex]);

  // Physical thread material properties customized per texture type
  const materialProps = useMemo(() => {
    if (texture === "silk") {
      return {
        bumpScale: 0.04,
        roughness: 0.16,
        metalness: 0.22,
      };
    }
    if (texture === "cotton") {
      return {
        bumpScale: 0.08,
        roughness: 0.88,
        metalness: 0.02,
      };
    }
    if (texture === "metallic") {
      return {
        bumpScale: 0.09,
        roughness: 0.14,
        metalness: 0.78,
      };
    }
    // Default Satin
    return {
      bumpScale: 0.06,
      roughness: 0.36,
      metalness: 0.08,
    };
  }, [texture]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[size, size / 2]} />
      <meshStandardMaterial
        map={diffTex}
        bumpMap={bumpTex}
        bumpScale={materialProps.bumpScale}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        transparent={true}
        alphaTest={0.01}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}


// -----------------------------------------------------------------------------
// Preload Assets
// -----------------------------------------------------------------------------
useGLTF.preload(MODEL_URL);
Object.values(FABRIC_WEAVES).forEach((weave) => {
  useTexture.preload(weave.diffuse);
  useTexture.preload(weave.normal);
  useTexture.preload(weave.roughness);
});

// -----------------------------------------------------------------------------
// Error Boundary
// -----------------------------------------------------------------------------
class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Pillow preview failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.cream,
            fontFamily: FONT_MONO,
            fontSize: 12,
            textAlign: "center",
            padding: 24,
            opacity: 0.7,
          }}
        >
          Couldn&rsquo;t load the 3D preview. Check that {MODEL_URL} exists and that fabric textures can reach polyhaven.org.
        </div>
      );
    }
    return this.props.children;
  }
}