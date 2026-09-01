import { useMemo, useState } from "react";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../theme";
import { SectionHead } from "../components/ui/SectionHead";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Toast } from "../components/ui/Toast";
import { PillowDesignerPanel } from "../components/designer/PillowDesignerPanel";
import { PillowPreview } from "../components/designer/PillowPreview";
import {
  computePillowPrice,
  findOption,
  FABRICS,
  SIZES,
  PIPING,
  CLOSURES,
  MONOGRAM_FONTS,
  MONOGRAM_TEXTURES,
} from "../data/designerOptions";

import { useCart } from "../context/CartContext";
import {
  DEFAULT_PILLOW_DESIGN,
  createNewPillowDesign,
  type PillowDesignState,
} from "../types/designer";
import heroImage from "../assets/hero.png";

type DesignerTab = "pillow";

export function DesignerPage() {
  const [tab, setTab] = useState<DesignerTab>("pillow");
  const [pillows, setPillows] = useState<PillowDesignState[]>([DEFAULT_PILLOW_DESIGN]);
  const [activePillowId, setActivePillowId] = useState<string>(DEFAULT_PILLOW_DESIGN.id ?? "pillow-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addLine } = useCart();

  const activePillow = useMemo(() => {
    return pillows.find((p) => p.id === activePillowId) ?? pillows[0];
  }, [pillows, activePillowId]);

  function updateActivePillow(next: PillowDesignState) {
    setPillows((prev) =>
      prev.map((p) => (p.id === activePillow.id ? { ...next, id: p.id, name: p.name } : p))
    );
  }

  function handleAddPillow() {
    const nextIndex = pillows.length + 1;
    const nextFabric = FABRICS[(nextIndex - 1) % FABRICS.length]?.id ?? "linen-oat";
    const newPillow = createNewPillowDesign(nextIndex, nextFabric);
    setPillows((prev) => [...prev, newPillow]);
    if (newPillow.id) setActivePillowId(newPillow.id);
  }

  function handleDuplicatePillow() {
    const nextIndex = pillows.length + 1;
    const duplicated: PillowDesignState = {
      ...activePillow,
      id: `pillow-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: `${activePillow.name ?? `Pillow ${nextIndex}`} (Copy)`,
    };
    setPillows((prev) => [...prev, duplicated]);
    if (duplicated.id) setActivePillowId(duplicated.id);
    setToastMessage(`Duplicated ${activePillow.name ?? "pillow"}`);
  }

  function handleRemovePillow(idToRemove: string) {
    if (pillows.length <= 1) return;
    const remaining = pillows.filter((p) => p.id !== idToRemove);
    setPillows(remaining);
    if (activePillowId === idToRemove) {
      setActivePillowId(remaining[0]?.id ?? "pillow-1");
    }
    setToastMessage("Pillow removed from set");
  }

  function setQuantity(q: number) {
    updateActivePillow({ ...activePillow, quantity: q });
  }

  const activeUnitPrice = useMemo(() => computePillowPrice(activePillow), [activePillow]);

  const collectionTotal = useMemo(() => {
    return pillows.reduce((sum, p) => {
      const price = computePillowPrice(p);
      return sum + price * p.quantity;
    }, 0);
  }, [pillows]);

  const totalItemCount = useMemo(() => {
    return pillows.reduce((sum, p) => sum + p.quantity, 0);
  }, [pillows]);

  function handleAddSingleToBag() {
    const fabric = findOption(FABRICS, activePillow.fabricId);
    const size = findOption(SIZES, activePillow.sizeId);
    const piping = findOption(PIPING, activePillow.pipingId);
    const closure = findOption(CLOSURES, activePillow.closureId);

    const selections = [
      { groupId: "fabric", optionId: fabric.id, optionLabel: fabric.label },
      { groupId: "size", optionId: size.id, optionLabel: size.label },
      { groupId: "piping", optionId: piping.id, optionLabel: piping.label },
      { groupId: "closure", optionId: closure.id, optionLabel: closure.label },
    ];

    if (activePillow.monogram?.trim()) {
      const font = MONOGRAM_FONTS.find((f) => f.id === activePillow.monogramFont)?.label ?? "Classic Serif";
      const tex = MONOGRAM_TEXTURES.find((t) => t.id === activePillow.monogramTexture)?.label ?? "Satin Stitch";
      selections.push({
        groupId: "monogram",
        optionId: "custom",
        optionLabel: `Monogram "${activePillow.monogram.trim().toUpperCase()}" (${font}, ${tex})`,
      });
    }

    addLine({
      productId: "custom-pillow",
      productSlug: "designer/pillow",
      name: `Custom Pillow (${activePillow.name ?? fabric.label})`,
      image: heroImage,
      quantity: activePillow.quantity,
      unitPrice: activeUnitPrice,
      selections,
      designerConfig: {
        fabricId: activePillow.fabricId,
        sizeId: activePillow.sizeId,
        pipingId: activePillow.pipingId,
        closureId: activePillow.closureId,
        monogram: activePillow.monogram ?? "",
        monogramFont: activePillow.monogramFont ?? "serif",
        monogramTexture: activePillow.monogramTexture ?? "satin",
        monogramColor: activePillow.monogramColor ?? "auto",
        monogramSpacing: activePillow.monogramSpacing ?? "standard",
        monogramSize: activePillow.monogramSize ?? "md",
      },
    });
    setToastMessage(`Added ${activePillow.name ?? "custom pillow"} to your bag`);
  }

  function handleAddAllToBag() {
    pillows.forEach((p, idx) => {
      const fabric = findOption(FABRICS, p.fabricId);
      const size = findOption(SIZES, p.sizeId);
      const piping = findOption(PIPING, p.pipingId);
      const closure = findOption(CLOSURES, p.closureId);
      const unitPrice = computePillowPrice(p);

      const selections = [
        { groupId: "fabric", optionId: fabric.id, optionLabel: fabric.label },
        { groupId: "size", optionId: size.id, optionLabel: size.label },
        { groupId: "piping", optionId: piping.id, optionLabel: piping.label },
        { groupId: "closure", optionId: closure.id, optionLabel: closure.label },
      ];

      if (p.monogram?.trim()) {
        const font = MONOGRAM_FONTS.find((f) => f.id === p.monogramFont)?.label ?? "Classic Serif";
        const tex = MONOGRAM_TEXTURES.find((t) => t.id === p.monogramTexture)?.label ?? "Satin Stitch";
        selections.push({
          groupId: "monogram",
          optionId: "custom",
          optionLabel: `Monogram "${p.monogram.trim().toUpperCase()}" (${font}, ${tex})`,
        });
      }

      addLine({
        productId: "custom-pillow",
        productSlug: "designer/pillow",
        name: `Custom Pillow (${p.name ?? `Pillow ${idx + 1}`} - ${fabric.label})`,
        image: heroImage,
        quantity: p.quantity,
        unitPrice: unitPrice,
        selections,
        designerConfig: {
          fabricId: p.fabricId,
          sizeId: p.sizeId,
          pipingId: p.pipingId,
          closureId: p.closureId,
          monogram: p.monogram ?? "",
          monogramFont: p.monogramFont ?? "serif",
          monogramTexture: p.monogramTexture ?? "satin",
          monogramColor: p.monogramColor ?? "auto",
          monogramSpacing: p.monogramSpacing ?? "standard",
          monogramSize: p.monogramSize ?? "md",
        },
      });
    });
    setToastMessage(`Added all ${pillows.length} custom pillows to your bag!`);
  }



  return (
    <div style={{ background: COLORS.bgDeep, minHeight: "75vh", padding: "48px 24px 100px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_MONO, fontSize: 11, color: "rgba(247, 245, 238, 0.6)", marginBottom: 20 }}>
          <span>Home</span>
          <span>/</span>
          <span style={{ color: COLORS.goldLight }}>3D Custom Studio</span>
        </div>

        <SectionHead
          eyebrow="Interactive Atelier"
          title="Design your bespoke cushion set"
          description="Craft custom pieces from our bolt library, configure dimensions and edge piping, and preview raised satin-stitch embroidery in real-time."
          onDark
        />

        <div style={{ display: "flex", gap: 10, margin: "32px 0 32px" }}>
          <TabButton label="3D Pillow Studio" active={tab === "pillow"} onClick={() => setTab("pillow")} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40 }} className="designer-grid">
          <div style={{ position: "sticky", top: 100, alignSelf: "start" }} className="designer-preview">
            <PillowPreview
              pillows={pillows}
              activePillowId={activePillow.id}
              onSelectPillow={(id) => setActivePillowId(id)}
            />
          </div>

          <div
            style={{
              background: COLORS.cream,
              borderRadius: 20,
              padding: "32px 28px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              border: `1px solid ${COLORS.line}`,
            }}
          >
            <div
              style={{
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: `1px solid ${COLORS.line}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: COLORS.ink,
                      fontWeight: 600,
                    }}
                  >
                    Arrangement Set ({pillows.length})
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={handleAddPillow}
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: `1px solid ${COLORS.line}`,
                      background: COLORS.white,
                      color: COLORS.ink,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ color: COLORS.wine, fontWeight: 700 }}>+</span> Add Pillow
                  </button>

                  <button
                    type="button"
                    onClick={handleDuplicatePillow}
                    title="Duplicate active pillow"
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: `1px solid ${COLORS.line}`,
                      background: COLORS.white,
                      color: COLORS.ink,
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    Duplicate
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pillows.map((pillow, idx) => {
                  const isSelected = pillow.id === activePillow.id;
                  const pillowFabric = findOption(FABRICS, pillow.fabricId);
                  return (
                    <div
                      key={pillow.id ?? idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 999,
                        border: `1px solid ${isSelected ? COLORS.wine : COLORS.line}`,
                        background: isSelected ? COLORS.wine : COLORS.white,
                        padding: "5px 10px 5px 12px",
                        gap: 7,
                        cursor: "pointer",
                        boxShadow: isSelected ? "0 2px 8px rgba(110, 42, 59, 0.25)" : "0 1px 3px rgba(0,0,0,0.02)",
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => {
                        if (pillow.id) setActivePillowId(pillow.id);
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: pillowFabric.swatchHex ?? "#D8CCB4",
                          border: "1px solid rgba(0,0,0,0.2)",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 12,
                          color: isSelected ? COLORS.cream : COLORS.ink,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {pillow.name ?? `Pillow ${idx + 1}`}
                        {pillow.monogram?.trim() ? ` · ${pillow.monogram.trim().slice(0, 3)}` : ""}
                      </span>

                      {pillows.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (pillow.id) handleRemovePillow(pillow.id);
                          }}
                          aria-label={`Remove ${pillow.name ?? `Pillow ${idx + 1}`}`}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: isSelected ? COLORS.cream : COLORS.inkSoft,
                            fontSize: 14,
                            lineHeight: 1,
                            padding: "0 2px",
                            cursor: "pointer",
                            opacity: 0.75,
                          }}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <PillowDesignerPanel design={activePillow} onChange={updateActivePillow} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 24,
                marginBottom: 20,
                paddingTop: 18,
                borderTop: `1px solid ${COLORS.line}`,
              }}
            >
              <div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: COLORS.ink, fontWeight: 500 }}>
                  ${((activeUnitPrice * activePillow.quantity) / 100).toFixed(2)}
                </div>
                {pillows.length > 1 && (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: COLORS.wine, marginTop: 3, fontWeight: 600 }}>
                    Set Total ({totalItemCount} items): ${(collectionTotal / 100).toFixed(2)}
                  </div>
                )}
              </div>
              <QuantityStepper quantity={activePillow.quantity} onChange={setQuantity} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pillows.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={handleAddAllToBag}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "16px 0",
                      fontSize: 13,
                    }}
                  >
                    Add Entire Set to Bag ({pillows.length} Pillows &mdash; ${(collectionTotal / 100).toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSingleToBag}
                    className="btn-secondary"
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      fontSize: 12,
                      background: COLORS.white,
                    }}
                  >
                    Add Only This Pillow to Bag (${((activeUnitPrice * activePillow.quantity) / 100).toFixed(2)})
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAddSingleToBag}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    fontSize: 13,
                  }}
                >
                  Add to bag &mdash; ${((activeUnitPrice * activePillow.quantity) / 100).toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

      <style>{`
        @media (max-width: 860px) {
          .designer-grid { grid-template-columns: 1fr !important; }
          .designer-preview { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        fontFamily: FONT_MONO,
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "10px 22px",
        borderRadius: 999,
        border: `1px solid ${active ? COLORS.gold : COLORS.lineOnDark}`,
        background: active ? COLORS.gold : "rgba(247, 245, 238, 0.05)",
        color: active ? COLORS.ink : COLORS.cream,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}


