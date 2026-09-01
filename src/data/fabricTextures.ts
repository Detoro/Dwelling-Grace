/**
 * Real, photographed fabric weaves from Poly Haven (https://polyhaven.com) —
 * CC0, so no attribution is legally required.
 *
 * Each entry is a *weave family*, not a color — the designer's fabric
 * swatches (see designerOptions.ts) point at one of these and tint it with
 * `material.color`, the same way real fabric configurators (Article, West
 * Elm) apply a dye color on top of a neutral, photographed weave instead of
 * commissioning a separate photo shoot per colorway.
 *
 * To swap in a different weave: browse https://polyhaven.com/textures/fabric,
 * grab the asset's slug from its URL (e.g. polyhaven.com/a/SLUG), and change
 * the id below — the URL pattern is the same for every Poly Haven texture.
 */

export interface FabricWeave {
  id: string; // Poly Haven asset slug
  label: string;
  sourceUrl: string;
  diffuse: string;
  normal: string;
  roughness: string;
  /** how many times the texture tiles across the pillow face — higher = finer-looking weave */
  repeat: number;
}

const POLYHAVEN_CDN = "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k";

function polyhavenWeave(assetId: string, label: string, repeat: number): FabricWeave {
  return {
    id: assetId,
    label,
    sourceUrl: `https://polyhaven.com/a/${assetId}`,
    diffuse: `${POLYHAVEN_CDN}/${assetId}/${assetId}_diff_1k.jpg`,
    normal: `${POLYHAVEN_CDN}/${assetId}/${assetId}_nor_gl_1k.jpg`,
    roughness: `${POLYHAVEN_CDN}/${assetId}/${assetId}_rough_1k.jpg`,
    repeat,
  };
}

export const FABRIC_WEAVES: Record<"linen" | "velvet" | "silk" | "floral", FabricWeave> = {
  linen: polyhavenWeave("rough_linen", "Linen weave", 4),
  velvet: polyhavenWeave("velour_velvet", "Velvet pile", 3),
  silk: polyhavenWeave("crepe_satin", "Silk/satin crepe", 3),
  floral: polyhavenWeave("floral_jacquard", "Floral jacquard", 3)
};
