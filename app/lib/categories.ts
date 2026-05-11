export type FormulaCategory = {
  label: string;
  icon: string;
  features: string[];
  forWho: string;
};

export const CATEGORIES: Record<string, FormulaCategory> = {
  premature: {
    label: "이른둥이용",
    icon: "🏥",
    features: ["고열량 특수 설계", "단백질·미네랄 강화", "미숙아 전용 조제"],
    forWho: "이른둥이(미숙아), 저체중 출생 아기",
  },
  diarrhea: {
    label: "설사 완화용",
    icon: "💊",
    features: ["삼투압 조절", "전해질 균형 보충", "장 회복 지원"],
    forWho: "설사 증상이 있는 아기, 장 회복이 필요한 아기",
  },
  lactose_free: {
    label: "유당 미함유",
    icon: "🚫",
    features: ["유당(락토오스) 미함유", "소화 불편 완화", "특수 의료용 조제"],
    forWho: "유당불내증이 있는 아기, 설사 후 회복기 아기",
  },
  soy: {
    label: "식물성(대두)",
    icon: "🌱",
    features: ["식물성 대두 단백질", "유당 미함유", "우유 단백질 대체"],
    forWho: "우유 단백질 알레르기, 유당불내증 아기",
  },
  ha: {
    label: "가수분해 단백질",
    icon: "🧬",
    features: ["고도 가수분해 단백질", "알레르기 위험 감소", "소화 부담 최소화"],
    forWho: "알레르기 고위험군, 아토피 우려 있는 아기",
  },
  ar: {
    label: "역류 방지",
    icon: "⬇️",
    features: ["점성 증가 설계", "역류·게움 억제", "전분 강화"],
    forWho: "역류나 게움이 잦은 아기",
  },
  comfort: {
    label: "소화 편안",
    icon: "😌",
    features: ["유당 저감화", "부분 가수분해 단백질", "가스·배앓이 완화"],
    forWho: "배앓이·가스·변비가 심한 아기",
  },
  sensitive: {
    label: "저자극",
    icon: "🌿",
    features: ["부분 가수분해 단백질", "소화 부담 감소", "장 트러블 감소"],
    forWho: "소화가 예민하거나 배앓이 있는 아기",
  },
  goat: {
    label: "산양분유",
    icon: "🐐",
    features: ["산양유 단백질", "α-카제인 함량 낮음", "부드러운 소화"],
    forWho: "일반 분유에 예민하거나 소화 불편을 겪는 아기",
  },
  organic: {
    label: "유기농",
    icon: "🌾",
    features: ["유기농 인증 원료", "무농약·무항생제", "자연 친화 성분"],
    forWho: "유기농 성분을 중시하는 부모",
  },
  hmo: {
    label: "HMO·2'FL 함유",
    icon: "🍼",
    features: ["모유 올리고당(HMO/2'-FL) 함유", "장내 유익균 증진", "면역력 강화"],
    forWho: "모유와 유사한 성분을 원하는 경우",
  },
  premium: {
    label: "프리미엄",
    icon: "⭐",
    features: ["프리미엄 원료", "DHA·ARA 강화", "종합 영양 설계"],
    forWho: "최고급 영양 성분을 원하는 부모",
  },
  standard: {
    label: "일반 조제분유",
    icon: "👶",
    features: ["균형 잡힌 영양", "DHA·철분 함유", "성장 발달 지원"],
    forWho: "건강한 일반 아기",
  },
};
