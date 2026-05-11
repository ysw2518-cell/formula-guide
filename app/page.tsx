"use client";
import { useState, useMemo, useRef } from "react";
import makersData from "@/data/makers.json";
import formulasData from "@/data/formulas.json";
import settingsData from "@/data/settings.json";

type Maker = typeof makersData.makers[0];
type Formula = typeof formulasData.formulas[0];

export default function Home() {
  const [selectedMaker, setSelectedMaker] = useState<Maker | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const formulaRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  const makers = makersData.makers;
  const formulas = formulasData.formulas;

  const settingValue = useMemo(() => {
    if (!selectedMaker || !selectedFormula) return null;
    const s = settingsData.settings.find(
      (s) => s.maker_id === selectedMaker.id && s.formula_id === selectedFormula.id
    );
    return s ? s.value : null;
  }, [selectedMaker, selectedFormula]);

  // 브랜드 목록 (순서 유지)
  const brands = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; type: string }[] = [];
    formulas.forEach((f) => {
      if (!seen.has(f.brand)) {
        seen.add(f.brand);
        list.push({ name: f.brand, type: (f as any).type });
      }
    });
    return list;
  }, [formulas]);

  // 선택된 브랜드의 분유 목록 (formula_line별 그룹)
  const formulasForBrand = useMemo(() => {
    if (!selectedBrand) return [];
    return formulas.filter((f) => f.brand === selectedBrand);
  }, [formulas, selectedBrand]);

  // 선택된 제조기에서 특정 분유의 세팅번호
  const getSettingNo = (formulaId: string) => {
    if (!selectedMaker) return null;
    const s = settingsData.settings.find(
      (s) => s.maker_id === selectedMaker.id && s.formula_id === formulaId
    );
    return s ? s.value : null;
  };

  const settingColor = (v: number) => {
    if (v <= 3) return "text-blue-500";
    if (v <= 6) return "text-green-500";
    if (v <= 8) return "text-orange-500";
    return "text-red-500";
  };

  const settingBgColor = (v: number) => {
    if (v <= 3) return "bg-blue-50 border-blue-200";
    if (v <= 6) return "bg-green-50 border-green-200";
    if (v <= 8) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🍼</span>
          <div>
            <h1 className="text-lg font-bold text-gray-800">분유 세팅 가이드</h1>
            <p className="text-xs text-gray-500">제조기 세팅번호를 빠르게 찾아보세요</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* STEP 1: 제조기 선택 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center font-bold">1</span>
            <h2 className="font-semibold text-gray-700">분유 제조기 선택</h2>
          </div>
          <div className="flex gap-3">
            {makers.map((maker) => (
              <button
                key={maker.id}
                onClick={() => {
                  setSelectedMaker(maker);
                  setSelectedBrand(null);
                  setSelectedFormula(null);
                  setTimeout(() => formulaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                }}
                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedMaker?.id === maker.id
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-pink-200"
                }`}
              >
                <div className="w-full h-20 bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {maker.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={maker.image_url} alt={maker.model} className="h-full w-full object-contain p-1" style={{ mixBlendMode: "multiply" }} />
                  ) : (
                    <span className="text-3xl">🍼</span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800">{maker.brand}</p>
                <p className="text-xs text-gray-500 mt-0.5">{maker.model_short}</p>
                {maker.setting_range && (
                  <p className="text-xs text-pink-500 mt-1">세팅 {maker.setting_range.min}~{maker.setting_range.max}</p>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* STEP 2: 브랜드 선택 */}
        {selectedMaker && (
          <section ref={formulaRef}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center font-bold">2</span>
              <h2 className="font-semibold text-gray-700">브랜드 선택</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {brands.map(({ name, type }) => (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedBrand(name);
                    setSelectedFormula(null);
                  }}
                  className={`px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                    selectedBrand === name
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-200 bg-white hover:border-pink-200"
                  }`}
                >
                  <span className="text-xs">{type === "domestic" ? "🇰🇷" : "🌍"}</span>
                  <p className="text-xs font-semibold text-gray-800 mt-1 leading-tight">{name}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: 분유 선택 */}
        {selectedMaker && selectedBrand && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center font-bold">3</span>
              <h2 className="font-semibold text-gray-700">분유 선택</h2>
              <span className="text-xs text-gray-400 ml-auto">{formulasForBrand.length}종</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {formulasForBrand.map((f) => {
                const settingNo = getSettingNo(f.id);
                const hasSetting = settingNo !== null;
                const isSelected = selectedFormula?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      if (!hasSetting) return;
                      setSelectedFormula(f);
                      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                    }}
                    disabled={!hasSetting}
                    className={`rounded-2xl border-2 text-left transition-all overflow-hidden ${
                      isSelected
                        ? "border-pink-400 bg-pink-50"
                        : hasSetting
                        ? "border-gray-200 bg-white hover:border-pink-200"
                        : "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                    }`}
                  >
                    {/* 이미지 영역 */}
                    <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                      {f.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.image_url}
                          alt={f.product}
                          className="w-full h-full object-contain p-3"
                          style={{ mixBlendMode: "multiply" }}
                        />
                      ) : (
                        <span className="text-4xl">🥛</span>
                      )}
                    </div>
                    {/* 텍스트 + 세팅번호 */}
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{f.product}</p>
                      {f.stage && <p className="text-xs text-gray-400 mt-1">{f.stage}</p>}
                      {hasSetting && settingNo !== null && (
                        <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${settingBgColor(settingNo)} ${settingColor(settingNo)}`}>
                          세팅 {settingNo}
                        </div>
                      )}
                      {!hasSetting && <p className="text-xs text-gray-300 mt-1">정보없음</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* RESULT: 세팅 번호 */}
        {selectedMaker && selectedFormula && (
          <section ref={resultRef} className="bg-white rounded-3xl shadow-lg p-6 border border-pink-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-pink-400 text-white text-xs flex items-center justify-center font-bold">4</span>
              <h2 className="font-semibold text-gray-700">세팅 번호</h2>
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-1">{selectedMaker.brand} {selectedMaker.model_short}</p>
              <p className="text-sm text-gray-500 mb-4">{selectedFormula.product}</p>

              {settingValue !== null ? (
                <>
                  <div className={`text-9xl font-black ${settingColor(settingValue)}`}>
                    {settingValue}
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    세팅번호 범위: {selectedMaker.setting_range?.min ?? "?"} ~ {selectedMaker.setting_range?.max ?? "?"}
                  </p>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                    <p className="text-xs text-yellow-700">
                      ⚠️ 분유 교체 또는 단계 변경 시 반드시 세팅번호를 다시 확인하세요
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-center py-6">
                  <p className="text-4xl mb-2">🔍</p>
                  <p className="text-sm">이 조합의 세팅 정보가 없어요</p>
                  <p className="text-xs text-gray-300 mt-1">제조사 공식 사이트에서 확인해주세요</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 안내 */}
        {!selectedMaker && (
          <div className="text-center text-gray-400 py-8">
            <p className="text-4xl mb-3">☝️</p>
            <p className="text-sm">먼저 분유 제조기를 선택해주세요</p>
          </div>
        )}

        <p className="text-xs text-center text-gray-300 pb-4">
          세팅 정보는 베이비브레짜 코리아 공식 데이터 기준입니다
        </p>
      </main>
    </div>
  );
}
