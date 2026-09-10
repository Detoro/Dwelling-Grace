import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, ContactShadows, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { COLORS, FONT_MONO } from "../../theme";
import { useDesignerOptions } from "../../context/DesignerOptionsContext";
import { FABRIC_WEAVES, getFabricWeave } from "../../data/fabricTextures";
import type {
  MonogramFont,
  MonogramPlacement,
  MonogramSpacing,
  MonogramTexture,
  MonogramWrapMode,
  PillowDesignState,
} from "../../types/designer";

const MODEL_URL = `${import.meta.env.BASE_URL}pillow__black/scene.gltf`;

type DecalDirectionKey = "front" | "back";

const DECAL_DIRECTIONS: Record<DecalDirectionKey, THREE.Vector3> = {
  front: new THREE.Vector3(0, 0, 1),
  back: new THREE.Vector3(0, 0, -1),
};

interface DecalAnchor {
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

function computeDecalAnchor(
  meshes: THREE.Mesh[],
  direction: THREE.Vector3,
  probeDistance: number,
  surfaceOffset: number,
  fallbackPosition: [number, number, number],
  fallbackRotation: [number, number, number]
): DecalAnchor {
  const raycaster = new THREE.Raycaster();
  const origin = direction.clone().multiplyScalar(probeDistance);
  const rayDirection = direction.clone().negate();
  raycaster.set(origin, rayDirection);
  raycaster.far = probeDistance * 2;

  const hits = raycaster.intersectObjects(meshes, false);
  const hit = hits.find((h) => !!h.face);

  if (!hit || !hit.face) {
    console.warn(
      `[PillowPreview] Decal probe toward (${direction.x}, ${direction.y}, ${direction.z}) found no surface — using fallback placement. The mesh may have a gap in that direction.`
    );
    const fallbackQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(...fallbackRotation));
    return {
      position: fallbackPosition,
      quaternion: [fallbackQuat.x, fallbackQuat.y, fallbackQuat.z, fallbackQuat.w],
    };
  }

  const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
  const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
  const point = hit.point.clone().addScaledVector(worldNormal, surfaceOffset);

  const forward = new THREE.Vector3(0, 0, 1);
  const alignQuat = new THREE.Quaternion().setFromUnitVectors(forward, worldNormal);

  const worldUp = new THREE.Vector3(0, 1, 0);
  let tangentUp = worldUp.clone().addScaledVector(worldNormal, -worldUp.dot(worldNormal));
  if (tangentUp.lengthSq() < 1e-6) {
    const worldZ = new THREE.Vector3(0, 0, 1);
    tangentUp = worldZ.clone().addScaledVector(worldNormal, -worldZ.dot(worldNormal));
  }
  tangentUp.normalize();

  const rotatedUp = new THREE.Vector3(0, 1, 0).applyQuaternion(alignQuat);
  const twistQuat = new THREE.Quaternion().setFromUnitVectors(rotatedUp, tangentUp);
  const finalQuat = twistQuat.multiply(alignQuat);

  return {
    position: [point.x, point.y, point.z],
    quaternion: [finalQuat.x, finalQuat.y, finalQuat.z, finalQuat.w],
  };
}

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

  const effectiveViewMode = pillowList.length > 1 ? viewMode : "focus";

  const { fabrics, findOption } = useDesignerOptions();
  const fabric = findOption(fabrics, activePillow?.fabricId ?? "linen-oat");
  const weave = getFabricWeave(fabric?.weave);

  return (
    <div
      style={{
        aspectRatio: "1 / 1",
        borderRadius: 16,
        background: COLORS.cream,
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      <ModelErrorBoundary>
        <Canvas
          camera={{
            position: effectiveViewMode === "set" ? [0, 0.35, 3.4] : [0, 0.18, 2.65],
            fov: effectiveViewMode === "set" ? 42 : 36,
          }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.65} />
          <directionalLight position={[3.5, 4.5, 3]} intensity={1.35} />
          <directionalLight position={[-3, 1.5, -2]} intensity={0.45} />
          <directionalLight position={[0, 3, -3]} intensity={0.35} />
          <directionalLight position={[-1.2, 2.5, 3.8]} intensity={0.85} />
          <pointLight position={[0, 0.6, 2.2]} intensity={0.5} distance={5} />

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
  const { fabrics, findOption } = useDesignerOptions();
  const fabric = findOption(fabrics, design.fabricId);
  const weave = getFabricWeave(fabric?.weave);
  const fabricHex = fabric.swatchHex ?? "#D8CCB4";

  const monogram = design.monogram?.trim() ? design.monogram.trim().toUpperCase() : null;
  const monogramBack = design.monogramBack?.trim() ? design.monogramBack.trim().toUpperCase() : null;
  const placement: MonogramPlacement = design.monogramPlacement ?? "front";
  const wrapMode: MonogramWrapMode = design.monogramWrapMode ?? "multiline";
  const monogramFont = design.monogramFont ?? "serif";
  const monogramTexture = design.monogramTexture ?? "linen";
  const monogramSpacing = design.monogramSpacing ?? "standard";
  const monogramSize = design.monogramSize ?? "md";
  const monogramScaleMultiplier = design.monogramScale ?? (
    monogramSize === "sm" ? 0.65 :
    monogramSize === "lg" ? 1.35 :
    monogramSize === "xl" ? 1.75 : 1.0
  );
  const threadColor = (design.monogramColor && design.monogramColor !== "auto")
    ? design.monogramColor
    : threadColorFor(fabricHex);

  const baseWorldSize = 0.38 * monogramScaleMultiplier;

  const { scene } = useGLTF(MODEL_URL);
  const [diffuseMap, normalMap, roughnessMap] = useTexture([weave.diffuse, weave.normal, weave.roughness]);

  const baseScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    return maxDim > 0 ? 1.6 / maxDim : 0.009228;
  }, [scene]);

  const finalScale = baseScale * scaleFactor;

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.rotation.set(Math.PI / 2, 0, 0);
    return c;
  }, [scene]);

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

  const modelExtent = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    return Math.max(size.x, size.y, size.z) || 200;
  }, [cloned]);

  const decalAnchors = useMemo(() => {
    if (meshes.length === 0) return null;
    cloned.updateMatrixWorld(true);
    const probeDistance = modelExtent * 1.5;
    const surfaceOffset = modelExtent * 0.004;
    return {
      front: computeDecalAnchor(meshes, DECAL_DIRECTIONS.front, probeDistance, surfaceOffset, [0, 0, 46.8], [0, 0, 0]),
      back: computeDecalAnchor(meshes, DECAL_DIRECTIONS.back, probeDistance, surfaceOffset, [0, 0, -46.8], [0, Math.PI, 0]),
    };
  }, [meshes, cloned, modelExtent]);

  useEffect(() => {
    meshes.forEach((mesh) => {
      const source = mesh.material as THREE.MeshStandardMaterial;
      if (source) {
        mesh.material = source.clone();
      }
    });
  }, [meshes]);

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

  useEffect(() => {
    const added: THREE.LineSegments[] = [];
    return () => {
      added.forEach((line) => {
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
        line.parent?.remove(line);
      });
    };
  }, [meshes]);

  const decalSize = baseWorldSize / baseScale;

  return (
    <group position={position} rotation={rotation}>
      <group scale={finalScale}>
        <primitive object={cloned} />
        {monogram && meshes.length > 0 && placement === "front" && decalAnchors && (
          <MonogramDecal
            text={monogram}
            font={monogramFont}
            texture={monogramTexture}
            threadColor={threadColor}
            spacing={monogramSpacing}
            position={decalAnchors.front.position}
            quaternion={decalAnchors.front.quaternion}
            size={decalSize}
            wrapMode={wrapMode}
          />
        )}

        {monogram && meshes.length > 0 && placement === "back" && decalAnchors && (
          <MonogramDecal
            text={monogramBack || monogram}
            font={monogramFont}
            texture={monogramTexture}
            threadColor={threadColor}
            spacing={monogramSpacing}
            position={decalAnchors.back.position}
            quaternion={decalAnchors.back.quaternion}
            size={decalSize}
            wrapMode={wrapMode}
          />
        )}

        {monogram && meshes.length > 0 && placement === "both" && decalAnchors && (
          <>
            <MonogramDecal
              text={monogram}
              font={monogramFont}
              texture={monogramTexture}
              threadColor={threadColor}
              spacing={monogramSpacing}
              position={decalAnchors.front.position}
              quaternion={decalAnchors.front.quaternion}
              size={decalSize}
              wrapMode={wrapMode}
            />
            <MonogramDecal
              text={monogramBack || monogram}
              font={monogramFont}
              texture={monogramTexture}
              threadColor={threadColor}
              spacing={monogramSpacing}
              position={decalAnchors.back.position}
              quaternion={decalAnchors.back.quaternion}
              size={decalSize}
              wrapMode={wrapMode}
            />
          </>
        )}
      </group>
    </group>
  );
}

function threadColorFor(fabricHex: string): string {
  const upper = fabricHex.toUpperCase();
  if (upper.includes("182B49") || upper.includes("1A365D") || upper.includes("0C1826")) return "#F0DFB0";
  if (upper.includes("5C1F2E") || upper.includes("4E1D29")) return "#E5C158";
  if (upper.includes("3E4A34")) return "#DFBA63";
  if (upper.includes("C7A24C")) return "#0C1826";
  if (upper.includes("B97D5D")) return "#FBF9F4";
  if (upper.includes("D8CCB4")) return "#141E28";
  if (upper.includes("243324")) return "#E5C158";
  if (upper.includes("8B3E2F")) return "#F0DFB0";
  if (upper.includes("B87A4B")) return "#141E28";

  const hex = fabricHex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? "#121922" : "#F7F5EE";
}

interface MonogramDecalProps {
  text: string;
  font: MonogramFont;
  texture: MonogramTexture;
  threadColor: string;
  spacing: MonogramSpacing;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  size: number;
  heightRatio?: number;
  wrapMode?: MonogramWrapMode;
}

function getFontFamily(font: MonogramFont): string {
  if (font === "futura") {
    return `"Futura", "Trebuchet MS", sans-serif`;
  }
  if (font === "sans") {
    return `"Plus Jakarta Sans", -apple-system, sans-serif`;
  }
  if (font === "mono") {
    return `"Space Mono", monospace`;
  }
  return `"Playfair Display", Georgia, "Times New Roman", serif`;
}

function measureLineWidth(ctx: CanvasRenderingContext2D, line: string, spacingOffset: number): number {
  if (!line) return 0;
  if (line.length <= 1) return ctx.measureText(line).width;
  const chars = line.split("");
  const totalCharWidth = chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0);
  return totalCharWidth + (chars.length - 1) * spacingOffset;
}

function splitIntoWrappedLines(
  ctx: CanvasRenderingContext2D,
  rawText: string,
  maxWidth: number,
  spacingOffset: number
): string[] {
  const paragraphs = rawText.split("\n");
  const result: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      if (paragraphs.length > 1) result.push("");
      continue;
    }

    const words = trimmed.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (measureLineWidth(ctx, testLine, spacingOffset) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          result.push(currentLine);
          currentLine = "";
        }
        if (measureLineWidth(ctx, word, spacingOffset) <= maxWidth) {
          currentLine = word;
        } else {
          let broken = "";
          for (const char of word) {
            if (measureLineWidth(ctx, broken + char, spacingOffset) <= maxWidth) {
              broken += char;
            } else {
              if (broken) result.push(broken);
              broken = char;
            }
          }
          currentLine = broken;
        }
      }
    }

    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result.length > 0 ? result : [rawText];
}

function MonogramDecal({
  text,
  font = "serif",
  texture = "linen",
  threadColor,
  spacing = "standard",
  position,
  quaternion,
  size,
  heightRatio = 0.5,
  wrapMode = "multiline",
}: MonogramDecalProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { diffTex, bumpTex } = useMemo(() => {
    const width = 1024;
    const height = Math.round(1024 * heightRatio);

    const diffCanvas = document.createElement("canvas");
    diffCanvas.width = width;
    diffCanvas.height = height;
    const diffCtx = diffCanvas.getContext("2d");

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext("2d");

    if (diffCtx && bumpCtx) {
      diffCtx.clearRect(0, 0, width, height);
      bumpCtx.fillStyle = "#000000";
      bumpCtx.fillRect(0, 0, width, height);

      const cleanText = text.toUpperCase();
      const spacingOffset = spacing === "wide" ? 30 : 6;
      const maxTextWidth = width * 0.88;
      const maxTextHeight = height * 0.82;

      let fontSize = heightRatio <= 0.35 ? 120 : 165;
      if (font === "mono") fontSize = Math.round(fontSize * 0.88);

      let lines: string[] = [];
      let lineHeight = fontSize * 1.18;

      while (fontSize >= 18) {
        const fontStyle = `bold ${fontSize}px ${getFontFamily(font)}`;
        diffCtx.font = fontStyle;
        lineHeight = fontSize * 1.18;

        if (wrapMode === "single-line") {
          lines = [cleanText.replace(/\n+/g, " ")];
        } else {
          lines = splitIntoWrappedLines(diffCtx, cleanText, maxTextWidth, spacingOffset);
        }

        const fitsHeight = lines.length * lineHeight <= maxTextHeight;
        const fitsWidth = lines.every((line) => measureLineWidth(diffCtx, line, spacingOffset) <= maxTextWidth);

        if (fitsHeight && fitsWidth) {
          break;
        }
        fontSize -= 4;
      }

      const fontStyle = `bold ${fontSize}px ${getFontFamily(font)}`;
      diffCtx.font = fontStyle;
      diffCtx.textAlign = "center";
      diffCtx.textBaseline = "middle";

      bumpCtx.font = fontStyle;
      bumpCtx.textAlign = "center";
      bumpCtx.textBaseline = "middle";

      const cx = width / 2;
      const cy = height / 2;
      const totalBlockHeight = lines.length * lineHeight;
      const startY = cy - totalBlockHeight / 2 + lineHeight / 2;

      const drawText = (ctx: CanvasRenderingContext2D, fill: string) => {
        ctx.fillStyle = fill;
        lines.forEach((line, lineIdx) => {
          const y = startY + lineIdx * lineHeight;
          if (line.length <= 1) {
            ctx.fillText(line, cx, y);
          } else {
            const chars = line.split("");
            const widths = chars.map((c) => ctx.measureText(c).width);
            const totalLineWidth = widths.reduce((acc, w) => acc + w, 0) + (chars.length - 1) * spacingOffset;
            let currentX = cx - totalLineWidth / 2;
            chars.forEach((c, i) => {
              ctx.fillText(c, currentX + widths[i] / 2, y);
              currentX += widths[i] + spacingOffset;
            });
          }
        });
      };

      drawText(bumpCtx, "#D0D0D0");

      bumpCtx.save();
      bumpCtx.globalCompositeOperation = "source-atop";

      if (texture === "silk") {
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 1.8;
        const step = 3.2;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x + height * 0.55, height);
          bumpCtx.stroke();
        }
      } else if (texture === "cotton") {
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 3.0;
        const step = 6.0;
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
      } else if (texture === "linen") {
        const step = 5.2;
        bumpCtx.strokeStyle = "#FFFFFF";
        for (let x = 0; x < width; x += step) {
          bumpCtx.lineWidth = (Math.round(x / step) % 3 === 0) ? 3.4 : 2.0;
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x, height);
          bumpCtx.stroke();
        }
        bumpCtx.strokeStyle = "#E0E0E0";
        for (let y = 0; y < height; y += step) {
          bumpCtx.lineWidth = (Math.round(y / step) % 3 === 0) ? 3.2 : 1.8;
          bumpCtx.beginPath();
          bumpCtx.moveTo(0, y);
          bumpCtx.lineTo(width, y);
          bumpCtx.stroke();
        }
      } else {
        const step = 6.0;
        bumpCtx.strokeStyle = "#FFFFFF";
        bumpCtx.lineWidth = 2.6;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x, 0);
          bumpCtx.lineTo(x + height * 0.72, height);
          bumpCtx.stroke();
        }
        bumpCtx.strokeStyle = "#303030";
        bumpCtx.lineWidth = 2.0;
        for (let x = -height; x < width + height; x += step) {
          bumpCtx.beginPath();
          bumpCtx.moveTo(x + height * 0.72, 0);
          bumpCtx.lineTo(x, height);
          bumpCtx.stroke();
        }
      }
      bumpCtx.restore();

      drawText(diffCtx, threadColor);

      diffCtx.save();
      diffCtx.globalCompositeOperation = "source-atop";

      if (texture === "silk") {
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.52)";
        diffCtx.lineWidth = 1.6;
        const step = 3.2;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.55, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.18)";
        diffCtx.lineWidth = 1.0;
        for (let x = -height + 1.6; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.55, height);
          diffCtx.stroke();
        }
      } else if (texture === "cotton") {
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        diffCtx.lineWidth = 2.0;
        const step = 6.0;
        for (let x = 0; x < width; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.20)";
        for (let y = 0; y < height; y += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(0, y);
          diffCtx.lineTo(width, y);
          diffCtx.stroke();
        }
      } else if (texture === "linen") {
        const step = 5.2;
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        for (let x = 0; x < width; x += step) {
          diffCtx.lineWidth = (Math.round(x / step) % 3 === 0) ? 2.4 : 1.4;
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(20, 15, 10, 0.22)";
        for (let y = 0; y < height; y += step) {
          diffCtx.lineWidth = (Math.round(y / step) % 3 === 0) ? 2.2 : 1.2;
          diffCtx.beginPath();
          diffCtx.moveTo(0, y);
          diffCtx.lineTo(width, y);
          diffCtx.stroke();
        }
      } else {
        const step = 6.0;
        diffCtx.strokeStyle = "rgba(255, 255, 255, 0.42)";
        diffCtx.lineWidth = 2.2;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x, 0);
          diffCtx.lineTo(x + height * 0.72, height);
          diffCtx.stroke();
        }
        diffCtx.strokeStyle = "rgba(0, 0, 0, 0.28)";
        diffCtx.lineWidth = 1.8;
        for (let x = -height; x < width + height; x += step) {
          diffCtx.beginPath();
          diffCtx.moveTo(x + height * 0.72, 0);
          diffCtx.lineTo(x, height);
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
  }, [text, font, texture, threadColor, spacing, wrapMode, heightRatio]);

  useEffect(() => {
    return () => {
      diffTex.dispose();
      bumpTex.dispose();
    };
  }, [diffTex, bumpTex]);

  const materialProps = useMemo(() => {
    if (texture === "silk") {
      return {
        bumpScale: 0.05,
        roughness: 0.2,
        metalness: 0.06,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
        sheen: 1.0,
        sheenRoughness: 0.2,
      };
    }
    if (texture === "cotton") {
      return {
        bumpScale: 0.09,
        roughness: 0.95,
        metalness: 0.0,
        clearcoat: 0.0,
        clearcoatRoughness: 0.6,
        sheen: 0.0,
        sheenRoughness: 0.5,
      };
    }
    if (texture === "linen") {
      return {
        bumpScale: 0.11,
        roughness: 0.86,
        metalness: 0.01,
        clearcoat: 0.08,
        clearcoatRoughness: 0.65,
        sheen: 0.25,
        sheenRoughness: 0.55,
      };
    }
    return {
      bumpScale: 0.08,
      roughness: 0.32,
      metalness: 0.05,
      clearcoat: 0.55,
      clearcoatRoughness: 0.22,
      sheen: 0.9,
      sheenRoughness: 0.25,
    };
  }, [texture]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      quaternion={quaternion}
      scale={[size, size * heightRatio, 1]}
      renderOrder={2}
    >
      <planeGeometry args={[1, 1]} />
      <meshPhysicalMaterial
        map={diffTex}
        bumpMap={bumpTex}
        bumpScale={materialProps.bumpScale}
        roughness={materialProps.roughness}
        metalness={materialProps.metalness}
        clearcoat={materialProps.clearcoat}
        clearcoatRoughness={materialProps.clearcoatRoughness}
        sheen={materialProps.sheen}
        sheenRoughness={materialProps.sheenRoughness}
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

useGLTF.preload(MODEL_URL);
Object.values(FABRIC_WEAVES).forEach((weave) => {
  useTexture.preload(weave.diffuse);
  useTexture.preload(weave.normal);
  useTexture.preload(weave.roughness);
});

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