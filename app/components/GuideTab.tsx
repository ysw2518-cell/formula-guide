"use client";
import { CATEGORIES } from "@/app/lib/categories";

const PASTEL_BG = [
  "bg-pink-50 border-pink-100",
  "bg-violet-50 border-violet-100",
  "bg-blue-50 border-blue-100",
  "bg-green-50 border-green-100",
  "bg-amber-50 border-amber-100",
  "bg-rose-50 border-rose-100",
  "bg-indigo-50 border-indigo-100",
  "bg-teal-50 border-teal-100",
  "bg-orange-50 border-orange-100",
  "bg-emerald-50 border-emerald-100",
  "bg-sky-50 border-sky-100",
  "bg-purple-50 border-purple-100",
  "bg-lime-50 border-lime-100",
];

export default function GuideTab() {
  const entries = Object.entries(CATEGORIES);

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 pt-6 pb-10 space-y-4">
      <h2 className="text-sm font-bold text-gray-700">분유 타입 가이드</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {entries.map(([key, cat], i) => (
          <div
            key={key}
            className={`rounded-2xl border p-4 space-y-2 ${PASTEL_BG[i % PASTEL_BG.length]}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-sm font-bold text-gray-800">{cat.label}</p>
            </div>
            <ul className="space-y-1">
              {cat.features.map((feat) => (
                <li key={feat} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 pt-1 border-t border-current border-opacity-10">{cat.forWho}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
