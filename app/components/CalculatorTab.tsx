"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const QUICK_ML = [60, 90, 120, 150, 180, 210, 240];
const SCOOP_OPTIONS = [30, 45, 60];

export default function CalculatorTab() {
  const [waterMl, setWaterMl] = useState<string>("");
  const [mlPerScoop, setMlPerScoop] = useState<number>(30);

  const numericWater = parseFloat(waterMl);
  const scoops = !isNaN(numericWater) && numericWater > 0
    ? numericWater / mlPerScoop
    : null;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 pt-6 pb-10 space-y-6">
      <h2 className="text-sm font-bold text-gray-700">물 용량 계산기</h2>

      {/* 스쿱 기준 선택 */}
      <div className="bg-white rounded-2xl shadow border border-pink-100 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600">스쿱 기준 (ml당 1스쿱)</p>
        <div className="flex gap-2">
          {SCOOP_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setMlPerScoop(opt)}
              className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                mlPerScoop === opt
                  ? "border-pink-400 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-pink-300"
              }`}
            >
              {opt}ml
            </button>
          ))}
        </div>
      </div>

      {/* 빠른 선택 */}
      <div className="bg-white rounded-2xl shadow border border-pink-100 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600">빠른 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ML.map((ml) => (
            <button
              key={ml}
              onClick={() => setWaterMl(String(ml))}
              className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                waterMl === String(ml)
                  ? "border-pink-400 bg-pink-50 text-pink-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-pink-300"
              }`}
            >
              {ml}ml
            </button>
          ))}
        </div>
      </div>

      {/* 직접 입력 */}
      <div className="bg-white rounded-2xl shadow border border-pink-100 p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-600">물 용량 직접 입력</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="예: 180"
            value={waterMl}
            onChange={(e) => setWaterMl(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-200"
          />
          <span className="text-sm text-gray-500">ml</span>
        </div>
      </div>

      {/* 결과 */}
      {scoops !== null && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-5 text-center space-y-2">
          <p className="text-xs text-gray-500">계산 결과</p>
          <p className="text-2xl font-black text-pink-600">
            물 {numericWater}ml → {Number.isInteger(scoops) ? scoops : scoops.toFixed(1)}스쿱
          </p>
          <p className="text-xs text-gray-400">스쿱 기준: {mlPerScoop}ml당 1스쿱</p>
        </div>
      )}

      {/* 주의사항 */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">분유마다 기준이 다를 수 있으니 제품 포장지를 확인하세요</p>
      </div>
    </div>
  );
}
