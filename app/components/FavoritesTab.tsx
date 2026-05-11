"use client";
import { Star, Trash2, ArrowRight } from "lucide-react";

export type Favorite = {
  makerId: string;
  makerBrand: string;
  makerModel: string;
  formulaId: string;
  formulaProduct: string;
  formulaBrand: string;
  settingValue: number | null;
};

type Props = {
  favorites: Favorite[];
  onLoad: (makerId: string, formulaId: string) => void;
  onRemove: (formulaId: string, makerId: string) => void;
};

export default function FavoritesTab({ favorites, onLoad, onRemove }: Props) {
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mb-4 shadow-inner">
          <Star size={36} className="text-pink-300" />
        </div>
        <p className="text-gray-500 font-semibold">즐겨찾기가 없어요</p>
        <p className="text-sm text-gray-400 mt-1">세팅 찾기에서 ⭐ 버튼으로 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-10 space-y-3">
      <h2 className="text-sm font-bold text-gray-700 mb-4">즐겨찾기 {favorites.length}개</h2>
      {favorites.map((fav) => (
        <div
          key={`${fav.makerId}-${fav.formulaId}`}
          className="bg-white rounded-2xl shadow border border-pink-100 p-4 flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">{fav.makerBrand} {fav.makerModel}</p>
            <p className="text-sm font-semibold text-gray-800 leading-snug">{fav.formulaProduct}</p>
            <p className="text-xs text-gray-400 mt-0.5">{fav.formulaBrand}</p>
            {fav.settingValue !== null && (
              <span className="mt-1.5 inline-block text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-0.5 rounded-full">
                세팅 {fav.settingValue}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onLoad(fav.makerId, fav.formulaId)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold shadow hover:shadow-md transition-all"
            >
              세팅 보기 <ArrowRight size={12} />
            </button>
            <button
              onClick={() => onRemove(fav.formulaId, fav.makerId)}
              className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
