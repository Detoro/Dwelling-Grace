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

export function polyhavenWeave(assetId: string, label: string, repeat: number = 4): FabricWeave {
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

export const FABRIC_WEAVES: Record<string, FabricWeave> = {
  corduroy: polyhavenWeave("ribbed_corduroy", "Corduroy", 4),
  ribbed_corduroy: polyhavenWeave("ribbed_corduroy", "Corduroy", 4),
  rough_linen: polyhavenWeave("rough_linen", "Rough linen", 4),
  linen: polyhavenWeave("rough_linen", "Rough linen", 4),
  velour_velvet: polyhavenWeave("velour_velvet", "Velour velvet", 3),
  velvet: polyhavenWeave("velour_velvet", "Velour velvet", 3),
  silk: polyhavenWeave("crepe_satin", "Silk/satin crepe", 3),
  floral: polyhavenWeave("floral_jacquard", "Floral jacquard", 3),
};

export function getFabricWeave(weaveName?: string): FabricWeave {
  if (!weaveName) return FABRIC_WEAVES.rough_linen;
  const key = weaveName.toLowerCase().trim();
  if (FABRIC_WEAVES[key]) return FABRIC_WEAVES[key];
  return polyhavenWeave(key, weaveName, 4);
}