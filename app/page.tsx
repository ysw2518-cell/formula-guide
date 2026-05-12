"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Check, Sparkles, Heart, AlertTriangle, Baby, Tag, PackageSearch, Gauge, Star } from "lucide-react";
import AdFit from "@/app/components/AdFit";
import FavoritesTab, { type Favorite } from "@/app/components/FavoritesTab";
import CalculatorTab from "@/app/components/CalculatorTab";
import GuideTab from "@/app/components/GuideTab";
import { CATEGORIES, type FormulaCategory } from "@/app/lib/categories";
import makersData from "@/data/makers.json";
import formulasData from "@/data/formulas.json";
import settingsData from "@/data/settings.json";

type Maker = typeof makersData.makers[0];
type Formula = typeof formulasData.formulas[0];

function getFormulaCategory(product: string, formulaLine: string): FormulaCategory {
  const t = `${product} ${formulaLine}`.toLowerCase();
  if (t.includes("이른둥이") || t.includes("미숙아")) return CATEGORIES.premature;
  if (t.includes("설사")) return CATEGORIES.diarrhea;
  if (t.includes("유당불내증") || t.includes("유당 불내증")) return CATEGORIES.lactose_free;
  if (t.includes("soy") || t.includes("소이") || t.includes("콩")) return CATEGORIES.soy;
  if (t.includes(" ha") || t.includes("에이치에이") || t.includes("가수분해") && t.includes("고도")) return CATEGORIES.ha;
  if (t.includes(" ar") || t.includes("역류")) return CATEGORIES.ar;
  if (t.includes("컴포트") || t.includes("comfort") || t.includes(" ac") || t.includes("배앓이")) return CATEGORIES.comfort;
  if (t.includes("센서티브") || t.includes("sensitive") || t.includes("저자극")) return CATEGORIES.sensitive;
  if (t.includes("산양")) return CATEGORIES.goat;
  if (t.includes("유기농") || t.includes("organic") || t.includes("bio")) return CATEGORIES.organic;
  if (t.includes("2fl") || t.includes("2'-fl") || t.includes("hmo")) return CATEGORIES.hmo;
  if (t.includes("플래티넘") || t.includes("명작") || t.includes("골드") || t.includes("프리미엄") || t.includes("시그니처")) return CATEGORIES.premium;
  return CATEGORIES.standard;
}

// SVG 배경 패턴 (CSS background-image 방식 — z-index 이슈 없음)
const BG_PATTERN = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><g transform='translate(22,18) rotate(-15,15,20)' fill='%23f472b6' opacity='0.08'><ellipse cx='15' cy='2' rx='3.5' ry='2'/><rect x='11' y='3.5' width='8' height='6' rx='2'/><rect x='7' y='9' width='16' height='26' rx='8'/></g><g transform='translate(130,35) rotate(20,15,15)' opacity='0.08'><circle cx='15' cy='13' r='9' fill='none' stroke='%23a855f7' stroke-width='2.5'/><ellipse cx='15' cy='13' rx='5' ry='4' fill='%23a855f7'/><ellipse cx='15' cy='22' rx='2.5' ry='5.5' fill='%23a855f7'/></g><g transform='translate(50,120) rotate(6,16,18)' fill='%23fb7185' opacity='0.08'><circle cx='7' cy='8' r='6.5'/><circle cx='25' cy='8' r='6.5'/><circle cx='16' cy='19' r='12'/><circle cx='7' cy='8' r='4' fill='%23ffe4e6'/><circle cx='25' cy='8' r='4' fill='%23ffe4e6'/></g><g transform='translate(165,145) rotate(25,12,17)' fill='%23c084fc' opacity='0.07'><ellipse cx='12' cy='1.5' rx='2.8' ry='1.5'/><rect x='9' y='2.5' width='6' height='5' rx='1.5'/><rect x='5.5' y='7' width='13' height='20' rx='6.5'/></g><g transform='translate(15,165) rotate(-10,12,13)' opacity='0.07'><circle cx='12' cy='10' r='7.5' fill='none' stroke='%23f472b6' stroke-width='2'/><ellipse cx='12' cy='10' rx='4' ry='3.5' fill='%23f472b6'/><ellipse cx='12' cy='17' rx='2' ry='4.5' fill='%23f472b6'/></g><g transform='translate(152,80) rotate(-5,13,16)' fill='%23f472b6' opacity='0.065'><circle cx='6' cy='6.5' r='5.5'/><circle cx='20' cy='6.5' r='5.5'/><circle cx='13' cy='16' r='10'/><circle cx='6' cy='6.5' r='3.5' fill='%23ffe4e6'/><circle cx='20' cy='6.5' r='3.5' fill='%23ffe4e6'/></g></svg>`;

export default function Home() {
  const [selectedMaker, setSelectedMaker] = useState<Maker | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'calculator' | 'guide'>('home');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const formulaRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  const makers = makersData.makers;
  const formulas = formulasData.formulas;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('formula-favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('formula-favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = (makerId: string, formulaId: string) =>
    favorites.some((f) => f.makerId === makerId && f.formulaId === formulaId);

  const toggleFavorite = () => {
    if (!selectedMaker || !selectedFormula) return;
    if (isFavorite(selectedMaker.id, selectedFormula.id)) {
      setFavorites((prev) => prev.filter(
        (f) => !(f.makerId === selectedMaker.id && f.formulaId === selectedFormula.id)
      ));
    } else {
      const fav: Favorite = {
        makerId: selectedMaker.id,
        makerBrand: selectedMaker.brand,
        makerModel: selectedMaker.model_short,
        formulaId: selectedFormula.id,
        formulaProduct: selectedFormula.product,
        formulaBrand: selectedFormula.brand,
        settingValue: settingValue,
      };
      setFavorites((prev) => [...prev, fav]);
    }
  };

  const handleLoadFavorite = (makerId: string, formulaId: string) => {
    const maker = makers.find((m) => m.id === makerId);
    const formula = formulas.find((f) => f.id === formulaId);
    if (maker && formula) {
      setSelectedMaker(maker);
      setSelectedBrand(formula.brand);
      setSelectedFormula(formula);
      setActiveTab('home');
    }
  };

  const handleRemoveFavorite = (formulaId: string, makerId: string) => {
    setFavorites((prev) => prev.filter(
      (f) => !(f.makerId === makerId && f.formulaId === formulaId)
    ));
  };

  const settingValue = useMemo(() => {
    if (!selectedMaker || !selectedFormula) return null;
    const s = settingsData.settings.find(
      (s) => s.maker_id === selectedMaker.id && s.formula_id === selectedFormula.id
    );
    return s ? s.value : null;
  }, [selectedMaker, selectedFormula]);

  // origin → 국기 이모지
  const originFlag = (origin: string): string => {
    if (!origin) return "🌍";
    if (origin.includes("한국")) return "🇰🇷";
    if (origin.includes("독일") || origin.includes("오스트리아")) return "🇩🇪";
    if (origin.includes("네덜란드")) return "🇳🇱";
    if (origin.includes("스위스")) return "🇨🇭";
    if (origin.includes("뉴질랜드")) return "🇳🇿";
    if (origin.includes("호주")) return "🇦🇺";
    if (origin.includes("싱가포르")) return "🇸🇬";
    if (origin.includes("중국")) return "🇨🇳";
    return "🌍";
  };

  // 브랜드 목록 (순서 유지)
  const brands = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; origin: string }[] = [];
    formulas.forEach((f) => {
      if (!seen.has(f.brand)) {
        seen.add(f.brand);
        list.push({ name: f.brand, origin: (f as any).origin ?? "" });
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

  // 제조기별 범위 기준 상대적 색상 (0~1 비율)
  const settingRatio = (v: number) => {
    if (!selectedMaker?.setting_range) return 0.5;
    const { min, max } = selectedMaker.setting_range;
    return (v - min) / (max - min);
  };

  const settingColor = (v: number) => {
    const r = settingRatio(v);
    if (r <= 0.25) return "text-blue-500";
    if (r <= 0.5) return "text-green-500";
    if (r <= 0.75) return "text-orange-500";
    return "text-red-500";
  };

  const settingBgColor = (v: number) => {
    const r = settingRatio(v);
    if (r <= 0.25) return "bg-blue-50 border-blue-200";
    if (r <= 0.5) return "bg-green-50 border-green-200";
    if (r <= 0.75) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const STEP_ICON = [Baby, Tag, PackageSearch, Gauge];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,${BG_PATTERN}"), linear-gradient(135deg, #FFF0F5 0%, #FAF8FF 50%, #F0F4FF 100%)`,
        backgroundSize: "220px 220px, 100% 100%",
        backgroundRepeat: "repeat, no-repeat",
        backgroundAttachment: "fixed, fixed",
      }}
    >

      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
            <Baby size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">분유 세팅 가이드</h1>
            <p className="text-xs text-gray-400 hidden sm:block">제조기 세팅번호를 빠르게 찾아보세요</p>
          </div>
        </div>
        {/* 탭 바 */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
          {([
            { key: 'home', label: '🔍 세팅 찾기' },
            { key: 'favorites', label: '⭐ 즐겨찾기' },
            { key: 'guide', label: '📋 가이드' },
            { key: 'calculator', label: '💧 계산기' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-pink-500 hover:border-pink-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── 탭별 렌더링 ── */}
      {activeTab === 'favorites' && (
        <FavoritesTab
          favorites={favorites}
          onLoad={handleLoadFavorite}
          onRemove={handleRemoveFavorite}
        />
      )}
      {activeTab === 'calculator' && <CalculatorTab />}
      {activeTab === 'guide' && <GuideTab formulas={formulas} getCategory={getFormulaCategory} />}

      {/* ── 2단 레이아웃 (home 탭) ── */}
      {activeTab === 'home' && <div className="max-w-screen-xl mx-auto lg:flex lg:min-h-[calc(100vh-57px)]">

        {/* ════ 사이드바: STEP 1 + STEP 2 ════ */}
        <aside className="lg:w-72 xl:w-80 lg:flex-shrink-0 lg:sticky lg:top-[57px] lg:self-start lg:h-[calc(100vh-57px)] lg:overflow-y-auto lg:border-r lg:border-pink-100/80 px-4 sm:px-6 lg:px-5 pt-6 pb-4 space-y-7">

          {/* STEP 1 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-[11px] flex items-center justify-center font-bold shadow">1</div>
              <h2 className="text-sm font-bold text-gray-700">분유 제조기</h2>
            </div>
            <div className="space-y-2">
              {makers.map((maker) => (
                <button
                  key={maker.id}
                  onClick={() => {
                    setSelectedMaker(maker);
                    setSelectedBrand(null);
                    setSelectedFormula(null);
                    if (window.innerWidth < 1024)
                      setTimeout(() => formulaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all duration-200 ${
                    selectedMaker?.id === maker.id
                      ? "border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-sm"
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-50/80 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                    {maker.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={maker.image_url} alt={maker.model} className="w-full h-full object-contain p-1" style={{ mixBlendMode: "multiply" }} />
                    ) : (
                      <span className="text-2xl">🍼</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900">{maker.brand}</p>
                    <p className="text-xs text-gray-500">{maker.model_short}</p>
                    {maker.setting_range && (
                      <span className="mt-1 inline-block text-[11px] font-semibold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                        세팅 {maker.setting_range.min}~{maker.setting_range.max}
                      </span>
                    )}
                  </div>
                  {selectedMaker?.id === maker.id && (
                    <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* STEP 2 */}
          {selectedMaker && (
            <section ref={formulaRef}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white text-[11px] flex items-center justify-center font-bold shadow">2</div>
                <h2 className="text-sm font-bold text-gray-700">브랜드</h2>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {brands.map(({ name, origin }) => (
                  <button
                    key={name}
                    onClick={() => { setSelectedBrand(name); setSelectedFormula(null); }}
                    className={`px-2.5 py-2 rounded-xl border text-left transition-all duration-150 ${
                      selectedBrand === name
                        ? "border-violet-400 bg-gradient-to-br from-violet-50 to-purple-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-violet-300"
                    }`}
                  >
                    <span className="text-sm">{originFlag(origin)}</span>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-tight">{name}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* 빈 상태 안내 (사이드바 하단) */}
          {!selectedMaker && (
            <div className="hidden lg:flex flex-col items-center justify-center pt-6 text-center text-gray-300">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Baby size={28} className="text-gray-300" />
              </div>
              <p className="text-xs">제조기를 선택하면<br />브랜드가 나타납니다</p>
            </div>
          )}

          {/* 광고 */}
          <div className="pt-4 border-t border-pink-100/80">
            <p className="text-[10px] text-gray-300 text-center mb-1">광고</p>
            <AdFit />
          </div>
        </aside>

        {/* ════ 메인: STEP 3 + STEP 4 ════ */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-8">

          <div className="lg:flex lg:gap-6 lg:items-start">
          {/* ── STEP 3: 분유 선택 ── */}
          <div className="lg:w-1/2 lg:min-w-0">
          {selectedMaker && selectedBrand ? (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[11px] flex items-center justify-center font-bold shadow">3</div>
                <h2 className="text-sm font-bold text-gray-700">분유 선택</h2>
                <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{formulasForBrand.length}종</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                        if (window.innerWidth < 1024)
                          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                      }}
                      disabled={!hasSetting}
                      className={`rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden group ${
                        isSelected
                          ? "border-amber-400 bg-gradient-to-b from-amber-50 to-orange-50 shadow-lg ring-2 ring-amber-200"
                          : hasSetting
                          ? "border-gray-200 bg-white hover:border-amber-300 hover:shadow-md"
                          : "border-gray-100 bg-gray-50/60 opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div className="w-full aspect-square bg-gray-50/80 flex items-center justify-center overflow-hidden">
                        {f.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={f.image_url} alt={f.product} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-200" style={{ mixBlendMode: "multiply" }} />
                        ) : (
                          <span className="text-4xl">🥛</span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">{f.product}</p>
                        {f.stage && <p className="text-[11px] text-gray-400 mt-0.5">{f.stage}</p>}
                        {hasSetting && settingNo !== null && (
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-bold ${settingBgColor(settingNo)} ${settingColor(settingNo)}`}>
                              세팅 {settingNo}
                            </div>
                          </div>
                        )}
                        {!hasSetting && <p className="text-[11px] text-gray-300 mt-1">정보없음</p>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-4 shadow-inner">
                {!selectedMaker
                  ? <Baby size={36} className="text-pink-300" />
                  : <Tag size={36} className="text-violet-300" />}
              </div>
              <p className="text-gray-500 font-semibold">
                {!selectedMaker ? "제조기를 먼저 선택해주세요" : "브랜드를 선택해주세요"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {!selectedMaker ? "위에서 제조기를 선택해주세요" : "위에서 브랜드를 골라보세요"}
              </p>
            </div>
          )}

          </div>
          {/* ── STEP 4: 결과 ── */}
          <div className="lg:w-1/2 lg:min-w-0">
          {selectedMaker && selectedFormula && (() => {
            const cat = getFormulaCategory(selectedFormula.product, (selectedFormula as any).formula_line ?? "");
            return (
              <section ref={resultRef} className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
                {/* 헤더 그라디언트 바 */}
                <div className="h-1.5 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400" />

                <div className="px-6 pt-5 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[11px] flex items-center justify-center font-bold shadow">4</div>
                    <h2 className="text-sm font-bold text-gray-700">세팅 번호</h2>
                    <span className="ml-auto text-xs text-gray-400">{selectedMaker.brand} · {selectedMaker.model_short}</span>
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-5">
                  {/* 제품명 + 즐겨찾기 */}
                  <div className="flex items-center gap-2 pt-1">
                    <p className="text-sm font-semibold text-gray-700 flex-1 text-center">{selectedFormula.product}</p>
                    <button
                      onClick={toggleFavorite}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isFavorite(selectedMaker.id, selectedFormula.id)
                          ? 'border-yellow-300 bg-yellow-50 text-yellow-500'
                          : 'border-gray-200 bg-white text-gray-400 hover:border-yellow-300 hover:text-yellow-500'
                      }`}
                    >
                      <Star size={16} fill={isFavorite(selectedMaker.id, selectedFormula.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* 세팅 번호 */}
                  {settingValue !== null ? (
                    <div className="text-center space-y-3">
                      <div className={`text-[110px] font-black leading-none tracking-tighter ${settingColor(settingValue)}`} style={{ textShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
                        {settingValue}
                      </div>
                      <p className="text-xs text-gray-400">
                        범위 {selectedMaker.setting_range?.min ?? "?"} ~ {selectedMaker.setting_range?.max ?? "?"}
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">분유 교체 또는 단계 변경 시 반드시 세팅번호를 다시 확인하세요</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-3">🔍</div>
                      <p className="text-sm text-gray-500 font-medium">이 조합의 세팅 정보가 없어요</p>
                      <p className="text-xs text-gray-400 mt-1">제조사 공식 사이트에서 확인해주세요</p>
                    </div>
                  )}

                  {/* 구분선 */}
                  <div className="border-t border-gray-100" />

                  {/* 분유 특징 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full">{cat.label}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Sparkles size={13} className="text-pink-400" />
                        <p className="text-xs font-bold text-gray-600">분유 특징</p>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.features.map((feat: string) => (
                          <li key={feat} className="flex items-start gap-2 text-xs text-gray-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5 flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-start gap-2.5 p-3.5 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-100">
                      <Heart size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-blue-500 mb-1">추천 아기</p>
                        <p className="text-xs text-blue-700 leading-relaxed">{cat.forWho}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          </div>
          </div>

          <div className="text-xs text-center text-gray-400 space-y-1 pt-2 border-t border-gray-100">
            <p>세팅 정보는 베이비브레짜 코리아 및 브라비 코리아 공식 데이터 기준입니다.</p>
            <p>이 사이트는 각 제조사의 공식 데이터를 기반으로 제작된 비공식 참고 서비스로, 베이비브레짜·브라비와 운영상 무관합니다.</p>
            <p>실제 사용 전 제조사 공식 앱을 반드시 확인하세요.</p>
            <p className="pt-1 text-gray-300">v1.0.0 · made by 말딱 아빠 🍼</p>
          </div>
        </main>

      </div>}
    </div>
  );
}
