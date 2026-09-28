import { computeTotals, downloadProposalPdf, formatMoney, whatsappLink, type ProposalPdfLabels, type Totals } from "@atelier/core";
import { db } from "./db";
import type { LangCode } from "./i18n/translations";
import type { CompanyProfile, ProposalStatus, SavedProposal } from "./types";

export async function nextNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const key = `Proposition-${year}`;
  let value = 1;
  await db.transaction("rw", db.counters, async () => {
    const row = await db.counters.get(key);
    value = (row?.value ?? 0) + 1;
    await db.counters.put({ key, value });
  });
  return `PROP-${year}-${String(value).padStart(4, "0")}`;
}

export function totalsOf(
  p: Pick<SavedProposal, "services" | "taxRate" | "discountRate">,
): Totals {
  return computeTotals(p.services, { taxRate: p.taxRate, discountRate: p.discountRate });
}

// ─── PDF labels per language ────────────────────────────────────────────────────
const PDF_LABELS: Record<LangCode, ProposalPdfLabels> = {
  fr: {
    document: "PROPOSITION",
    validFor: "Valable {n} jours",
    preparedFor: "Préparé pour",
    tiers: "FORMULES",
    investment: "INVESTISSEMENT",
    colDesc: "Prestation",
    colQty: "Qté",
    colUnit: "Prix unit.",
    colTotal: "Total",
    subtotal: "Sous-total",
    discount: "Remise",
    tax: "Taxe",
    shipping: "Frais",
    total: "TOTAL",
    deposit: "Acompte de {rate}% à la signature : {amount}",
    provider: "Le prestataire",
    clientApproval: "Le client (bon pour accord)",
    acceptedOn: "Accepté le {date}",
    signHere: "Nom, date et signature",
  },
  en: {
    document: "PROPOSAL",
    validFor: "Valid for {n} days",
    preparedFor: "Prepared for",
    tiers: "PACKAGES",
    investment: "INVESTMENT",
    colDesc: "Service",
    colQty: "Qty",
    colUnit: "Unit price",
    colTotal: "Total",
    subtotal: "Subtotal",
    discount: "Discount",
    tax: "Tax",
    shipping: "Shipping",
    total: "TOTAL",
    deposit: "Deposit of {rate}% on signing: {amount}",
    provider: "The provider",
    clientApproval: "The client (signature)",
    acceptedOn: "Accepted on {date}",
    signHere: "Name, date and signature",
  },
  es: {
    document: "PROPUESTA",
    validFor: "Válida por {n} días",
    preparedFor: "Preparado para",
    tiers: "PAQUETES",
    investment: "INVERSIÓN",
    colDesc: "Servicio",
    colQty: "Cant.",
    colUnit: "Precio unit.",
    colTotal: "Total",
    subtotal: "Subtotal",
    discount: "Descuento",
    tax: "Impuesto",
    shipping: "Envío",
    total: "TOTAL",
    deposit: "Anticipo del {rate}% a la firma: {amount}",
    provider: "El proveedor",
    clientApproval: "El cliente (firma)",
    acceptedOn: "Aceptado el {date}",
    signHere: "Nombre, fecha y firma",
  },
  ar: {
    document: "عرض تجاري",
    validFor: "صالح لمدة {n} يوم",
    preparedFor: "مُعدّ لـ",
    tiers: "الباقات",
    investment: "الاستثمار",
    colDesc: "الخدمة",
    colQty: "الكمية",
    colUnit: "سعر الوحدة",
    colTotal: "المجموع",
    subtotal: "المجموع الجزئي",
    discount: "الخصم",
    tax: "الضريبة",
    shipping: "الشحن",
    total: "المجموع الكلي",
    deposit: "دفعة مقدمة {rate}٪ عند التوقيع: {amount}",
    provider: "مقدم الخدمة",
    clientApproval: "العميل (توقيع)",
    acceptedOn: "تم القبول في {date}",
    signHere: "الاسم والتاريخ والتوقيع",
  },
  pt: {
    document: "PROPOSTA",
    validFor: "Válida por {n} dias",
    preparedFor: "Preparado para",
    tiers: "PACOTES",
    investment: "INVESTIMENTO",
    colDesc: "Serviço",
    colQty: "Qtd.",
    colUnit: "Preço unit.",
    colTotal: "Total",
    subtotal: "Subtotal",
    discount: "Desconto",
    tax: "Imposto",
    shipping: "Envio",
    total: "TOTAL",
    deposit: "Sinal de {rate}% na assinatura: {amount}",
    provider: "O prestador",
    clientApproval: "O cliente (assinatura)",
    acceptedOn: "Aceite em {date}",
    signHere: "Nome, data e assinatura",
  },
  de: {
    document: "ANGEBOT",
    validFor: "Gültig für {n} Tage",
    preparedFor: "Erstellt für",
    tiers: "PAKETE",
    investment: "INVESTITION",
    colDesc: "Leistung",
    colQty: "Menge",
    colUnit: "Einzelpreis",
    colTotal: "Gesamt",
    subtotal: "Zwischensumme",
    discount: "Rabatt",
    tax: "MwSt.",
    shipping: "Versand",
    total: "GESAMT",
    deposit: "Anzahlung {rate}% bei Unterzeichnung: {amount}",
    provider: "Der Anbieter",
    clientApproval: "Der Kunde (Unterschrift)",
    acceptedOn: "Akzeptiert am {date}",
    signHere: "Name, Datum und Unterschrift",
  },
  zh: {
    document: "商业提案",
    validFor: "有效期 {n} 天",
    preparedFor: "致",
    tiers: "套餐",
    investment: "投资明细",
    colDesc: "服务",
    colQty: "数量",
    colUnit: "单价",
    colTotal: "合计",
    subtotal: "小计",
    discount: "折扣",
    tax: "税费",
    shipping: "运费",
    total: "总计",
    deposit: "签署时支付 {rate}% 定金：{amount}",
    provider: "服务提供方",
    clientApproval: "客户（签字）",
    acceptedOn: "接受日期：{date}",
    signHere: "姓名、日期及签字",
  },
  ja: {
    document: "提案書",
    validFor: "有効期間：{n}日間",
    preparedFor: "宛先",
    tiers: "プラン",
    investment: "お見積り",
    colDesc: "サービス",
    colQty: "数量",
    colUnit: "単価",
    colTotal: "合計",
    subtotal: "小計",
    discount: "割引",
    tax: "消費税",
    shipping: "送料",
    total: "合計金額",
    deposit: "契約時 {rate}% 手付金：{amount}",
    provider: "サービス提供者",
    clientApproval: "クライアント（署名）",
    acceptedOn: "{date} に承認済み",
    signHere: "氏名・日付・署名",
  },
  it: {
    document: "PROPOSTA",
    validFor: "Valida per {n} giorni",
    preparedFor: "Preparato per",
    tiers: "PACCHETTI",
    investment: "INVESTIMENTO",
    colDesc: "Servizio",
    colQty: "Qtà",
    colUnit: "Prezzo unit.",
    colTotal: "Totale",
    subtotal: "Subtotale",
    discount: "Sconto",
    tax: "IVA",
    shipping: "Spedizione",
    total: "TOTALE",
    deposit: "Acconto del {rate}% alla firma: {amount}",
    provider: "Il fornitore",
    clientApproval: "Il cliente (firma)",
    acceptedOn: "Accettato il {date}",
    signHere: "Nome, data e firma",
  },
  ru: {
    document: "КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ",
    validFor: "Действительно {n} дней",
    preparedFor: "Подготовлено для",
    tiers: "ПАКЕТЫ",
    investment: "ИНВЕСТИЦИИ",
    colDesc: "Услуга",
    colQty: "Кол-во",
    colUnit: "Цена за ед.",
    colTotal: "Итого",
    subtotal: "Промежуточный итог",
    discount: "Скидка",
    tax: "Налог",
    shipping: "Доставка",
    total: "ИТОГО",
    deposit: "Предоплата {rate}% при подписании: {amount}",
    provider: "Поставщик",
    clientApproval: "Клиент (подпись)",
    acceptedOn: "Принято {date}",
    signHere: "Имя, дата и подпись",
  },
  tr: {
    document: "TEKLİF",
    validFor: "{n} gün geçerli",
    preparedFor: "Hazırlanan kişi",
    tiers: "PAKETLER",
    investment: "YATIRIM",
    colDesc: "Hizmet",
    colQty: "Adet",
    colUnit: "Birim fiyat",
    colTotal: "Toplam",
    subtotal: "Ara toplam",
    discount: "İndirim",
    tax: "Vergi",
    shipping: "Kargo",
    total: "TOPLAM",
    deposit: "İmzada {rate}% peşinat: {amount}",
    provider: "Hizmet sağlayıcı",
    clientApproval: "Müşteri (imza)",
    acceptedOn: "{date} tarihinde kabul edildi",
    signHere: "Ad, tarih ve imza",
  },
  hi: {
    document: "प्रस्ताव",
    validFor: "{n} दिनों के लिए वैध",
    preparedFor: "के लिए तैयार",
    tiers: "पैकेज",
    investment: "निवेश विवरण",
    colDesc: "सेवा",
    colQty: "मात्रा",
    colUnit: "इकाई मूल्य",
    colTotal: "कुल",
    subtotal: "उप-योग",
    discount: "छूट",
    tax: "कर",
    shipping: "शिपिंग",
    total: "कुल योग",
    deposit: "हस्ताक्षर पर {rate}% अग्रिम भुगतान: {amount}",
    provider: "सेवा प्रदाता",
    clientApproval: "ग्राहक (हस्ताक्षर)",
    acceptedOn: "{date} को स्वीकृत",
    signHere: "नाम, तारीख और हस्ताक्षर",
  },
  nl: {
    document: "OFFERTE",
    validFor: "Geldig voor {n} dagen",
    preparedFor: "Opgesteld voor",
    tiers: "PAKKETTEN",
    investment: "INVESTERING",
    colDesc: "Dienst",
    colQty: "Aantal",
    colUnit: "Stukprijs",
    colTotal: "Totaal",
    subtotal: "Subtotaal",
    discount: "Korting",
    tax: "BTW",
    shipping: "Verzending",
    total: "TOTAAL",
    deposit: "Aanbetaling {rate}% bij ondertekening: {amount}",
    provider: "De dienstverlener",
    clientApproval: "De klant (handtekening)",
    acceptedOn: "Geaccepteerd op {date}",
    signHere: "Naam, datum en handtekening",
  },
  pl: {
    document: "OFERTA",
    validFor: "Ważna przez {n} dni",
    preparedFor: "Przygotowano dla",
    tiers: "PAKIETY",
    investment: "INWESTYCJA",
    colDesc: "Usługa",
    colQty: "Ilość",
    colUnit: "Cena jedn.",
    colTotal: "Łącznie",
    subtotal: "Suma częściowa",
    discount: "Rabat",
    tax: "Podatek",
    shipping: "Dostawa",
    total: "ŁĄCZNIE",
    deposit: "Zaliczka {rate}% przy podpisaniu: {amount}",
    provider: "Usługodawca",
    clientApproval: "Klient (podpis)",
    acceptedOn: "Zaakceptowano {date}",
    signHere: "Imię, data i podpis",
  },
  ko: {
    document: "제안서",
    validFor: "{n}일 유효",
    preparedFor: "수신",
    tiers: "패키지",
    investment: "투자 내역",
    colDesc: "서비스",
    colQty: "수량",
    colUnit: "단가",
    colTotal: "합계",
    subtotal: "소계",
    discount: "할인",
    tax: "세금",
    shipping: "배송",
    total: "총계",
    deposit: "서명 시 {rate}% 계약금: {amount}",
    provider: "서비스 제공자",
    clientApproval: "고객 (서명)",
    acceptedOn: "{date}에 수락됨",
    signHere: "이름, 날짜 및 서명",
  },
  id: {
    document: "PROPOSAL",
    validFor: "Berlaku {n} hari",
    preparedFor: "Disiapkan untuk",
    tiers: "PAKET",
    investment: "INVESTASI",
    colDesc: "Layanan",
    colQty: "Jml.",
    colUnit: "Harga satuan",
    colTotal: "Total",
    subtotal: "Subtotal",
    discount: "Diskon",
    tax: "Pajak",
    shipping: "Pengiriman",
    total: "TOTAL",
    deposit: "Uang muka {rate}% saat penandatanganan: {amount}",
    provider: "Penyedia layanan",
    clientApproval: "Klien (tanda tangan)",
    acceptedOn: "Diterima pada {date}",
    signHere: "Nama, tanggal dan tanda tangan",
  },
};

// ─── WhatsApp message templates per language ────────────────────────────────────
function buildWhatsAppMsg(
  p: SavedProposal,
  acceptUrl: string | null | undefined,
  lang: LangCode,
): string {
  const money = formatMoney(p.total, p.currency);
  const name = p.clientName || "";
  const title = p.title || "";
  const ref = p.number;
  const days = p.validityDays;

  const msgs: Record<LangCode, string> = {
    fr:
      `Bonjour ${name},\n\nVoici ma proposition « ${title} » (réf. ${ref}).\n` +
      `Montant : ${money}.` +
      (days ? ` Offre valable ${days} jours.` : "") +
      (acceptUrl ? `\n\nPour accepter en 1 clic : ${acceptUrl}` : "") +
      `\n\nJe reste disponible pour en discuter. Merci !`,
    en:
      `Hello ${name},\n\nPlease find my proposal « ${title} » (ref. ${ref}).\n` +
      `Amount: ${money}.` +
      (days ? ` Offer valid for ${days} days.` : "") +
      (acceptUrl ? `\n\nTo accept in 1 click: ${acceptUrl}` : "") +
      `\n\nFeel free to reach out if you have any questions. Thank you!`,
    es:
      `Hola ${name},\n\nAquí tienes mi propuesta « ${title} » (ref. ${ref}).\n` +
      `Importe: ${money}.` +
      (days ? ` Oferta válida por ${days} días.` : "") +
      (acceptUrl ? `\n\nPara aceptar en 1 clic: ${acceptUrl}` : "") +
      `\n\nQuedo a tu disposición para cualquier consulta. ¡Gracias!`,
    ar:
      `مرحباً ${name}،\n\nإليك عرضي التجاري « ${title} » (رقم ${ref}).\n` +
      `المبلغ: ${money}.` +
      (days ? ` العرض صالح لمدة ${days} يوم.` : "") +
      (acceptUrl ? `\n\nللقبول بنقرة واحدة: ${acceptUrl}` : "") +
      `\n\nأنا متاح لأي استفسار. شكراً!`,
    pt:
      `Olá ${name},\n\nSegue a minha proposta « ${title} » (ref. ${ref}).\n` +
      `Valor: ${money}.` +
      (days ? ` Oferta válida por ${days} dias.` : "") +
      (acceptUrl ? `\n\nPara aceitar num clique: ${acceptUrl}` : "") +
      `\n\nEstou disponível para qualquer questão. Obrigado!`,
    de:
      `Hallo ${name},\n\nhier ist mein Angebot « ${title} » (Ref. ${ref}).\n` +
      `Betrag: ${money}.` +
      (days ? ` Angebot gültig für ${days} Tage.` : "") +
      (acceptUrl ? `\n\nZum Akzeptieren mit 1 Klick: ${acceptUrl}` : "") +
      `\n\nIch stehe Ihnen für Rückfragen gerne zur Verfügung. Vielen Dank!`,
    zh:
      `你好 ${name}，\n\n请查收我的商业提案《${title}》（编号：${ref}）。\n` +
      `金额：${money}。` +
      (days ? `报价有效期${days}天。` : "") +
      (acceptUrl ? `\n\n一键接受：${acceptUrl}` : "") +
      `\n\n如有任何问题请随时联系我。谢谢！`,
    ja:
      `こんにちは ${name}、\n\n提案書「${title}」（参照番号：${ref}）をお送りします。\n` +
      `金額：${money}。` +
      (days ? `有効期間：${days}日間。` : "") +
      (acceptUrl ? `\n\n1クリックで承認：${acceptUrl}` : "") +
      `\n\nご不明な点がございましたらお気軽にご連絡ください。よろしくお願いします。`,
    it:
      `Ciao ${name},\n\nEcco la mia proposta « ${title} » (rif. ${ref}).\n` +
      `Importo: ${money}.` +
      (days ? ` Offerta valida per ${days} giorni.` : "") +
      (acceptUrl ? `\n\nPer accettare in 1 clic: ${acceptUrl}` : "") +
      `\n\nResto a disposizione per qualsiasi domanda. Grazie!`,
    ru:
      `Здравствуйте, ${name}!\n\nВысылаю коммерческое предложение « ${title} » (№ ${ref}).\n` +
      `Сумма: ${money}.` +
      (days ? ` Предложение действительно ${days} дней.` : "") +
      (acceptUrl ? `\n\nПринять одним кликом: ${acceptUrl}` : "") +
      `\n\nГотов ответить на любые вопросы. Спасибо!`,
    tr:
      `Merhaba ${name},\n\n« ${title} » teklifimi (ref. ${ref}) iletiyorum.\n` +
      `Tutar: ${money}.` +
      (days ? ` Teklif ${days} gün geçerlidir.` : "") +
      (acceptUrl ? `\n\n1 tıkla kabul etmek için: ${acceptUrl}` : "") +
      `\n\nHerhangi bir sorunuz için buradayım. Teşekkürler!`,
    hi:
      `नमस्ते ${name},\n\nमेरा प्रस्ताव « ${title} » (संदर्भ ${ref}) यहाँ है।\n` +
      `राशि: ${money}.` +
      (days ? ` प्रस्ताव ${days} दिनों के लिए वैध है।` : "") +
      (acceptUrl ? `\n\n1 क्लिक में स्वीकार करें: ${acceptUrl}` : "") +
      `\n\nकिसी भी प्रश्न के लिए मैं उपलब्ध हूँ। धन्यवाद!`,
    nl:
      `Hallo ${name},\n\nHier is mijn offerte « ${title} » (ref. ${ref}).\n` +
      `Bedrag: ${money}.` +
      (days ? ` Aanbieding geldig voor ${days} dagen.` : "") +
      (acceptUrl ? `\n\nIn 1 klik accepteren: ${acceptUrl}` : "") +
      `\n\nIk sta u graag te woord bij eventuele vragen. Dank u!`,
    pl:
      `Cześć ${name},\n\nOto moja oferta « ${title} » (ref. ${ref}).\n` +
      `Kwota: ${money}.` +
      (days ? ` Oferta ważna przez ${days} dni.` : "") +
      (acceptUrl ? `\n\nZaakceptuj jednym kliknięciem: ${acceptUrl}` : "") +
      `\n\nJestem do dyspozycji w razie pytań. Dziękuję!`,
    ko:
      `안녕하세요 ${name},\n\n제안서 「${title}」(참조: ${ref})를 보내드립니다.\n` +
      `금액: ${money}.` +
      (days ? ` 제안 유효기간: ${days}일.` : "") +
      (acceptUrl ? `\n\n1클릭으로 수락하기: ${acceptUrl}` : "") +
      `\n\n질문이 있으시면 언제든지 연락주세요. 감사합니다!`,
    id:
      `Halo ${name},\n\nBerikut proposal saya « ${title} » (ref. ${ref}).\n` +
      `Jumlah: ${money}.` +
      (days ? ` Penawaran berlaku ${days} hari.` : "") +
      (acceptUrl ? `\n\nTerima dalam 1 klik: ${acceptUrl}` : "") +
      `\n\nSaya siap menjawab pertanyaan Anda. Terima kasih!`,
  };

  return msgs[lang] ?? msgs["en"];
}

export function downloadPdf(p: SavedProposal, profile: CompanyProfile, lang: LangCode = "fr"): void {
  downloadProposalPdf({
    number: p.number,
    title: p.title,
    date: p.date,
    validityDays: p.validityDays,
    currency: p.currency,
    logoDataUrl: profile.logoDataUrl,
    accentColor: profile.accentColor,
    from: {
      name: p.fromName || profile.name,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
    },
    to: { name: p.clientName },
    sections: p.sections,
    tiers: p.tiers,
    items: p.services,
    totals: totalsOf(p),
    depositRate: p.depositRate,
    notes: profile.notes,
    acceptedName: p.acceptedName,
    acceptedDate: p.acceptedAt ? new Date(p.acceptedAt).toLocaleDateString("fr-FR") : undefined,
    labels: PDF_LABELS[lang] ?? PDF_LABELS["en"],
  });
}

export function proposalWhatsappLink(
  p: SavedProposal,
  phone: string,
  acceptUrl?: string | null,
  lang: LangCode = "fr",
): string {
  return whatsappLink(phone, buildWhatsAppMsg(p, acceptUrl, lang));
}

export async function setStatus(p: SavedProposal, status: ProposalStatus): Promise<void> {
  if (p.id) await db.proposals.update(p.id, { status });
}

export async function accept(p: SavedProposal, name: string): Promise<SavedProposal> {
  const acceptedName = name.trim();
  const acceptedAt = Date.now();
  const updated: SavedProposal = { ...p, status: "Acceptée", acceptedName, acceptedAt };
  if (p.id) {
    await db.proposals.update(p.id, { status: "Acceptée", acceptedName, acceptedAt });
  }
  return updated;
}
