"use client";
import { useEffect, useRef } from "react";

export default function AdFit() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector("ins")) return;
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", "DAN-cWdtdZktCiqQGI9N");
    ins.setAttribute("data-ad-width", "300");
    ins.setAttribute("data-ad-height", "250");
    ref.current.appendChild(ins);
    // 스크립트 로드 후 광고 초기화
    if ((window as any).kakao_ad_ba) {
      (window as any).kakao_ad_ba();
    }
  }, []);

  return <div ref={ref} className="flex justify-center" />;
}
