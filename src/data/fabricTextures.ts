export interface FabricWeave {
  id: string;
  label: string;
  sourceUrl: string;
  diffuse: string;
  normal: string;
  roughness: string;
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

