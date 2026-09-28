import type { LangCode } from "./i18n/translations";
import {
  TEMPLATES as TEMPLATES_FR,
  EXTRA_SECTIONS as EXTRA_SECTIONS_FR,
  SECTION_VARIANTS as SECTION_VARIANTS_FR,
  type ProposalTemplate,
} from "./templates";
import type { ProposalSection } from "@atelier/core";

// ─── Standard section titles [context, solution, deliverables, timeline, terms] ───
const S: Record<LangCode, [string, string, string, string, string]> = {
  fr: ["Contexte & problème", "Solution proposée", "Livrables", "Planning", "Conditions (CGV)"],
  en: ["Context & problem", "Proposed solution", "Deliverables", "Timeline", "Terms & conditions"],
  es: ["Contexto y problema", "Solución propuesta", "Entregables", "Cronograma", "Términos y condiciones"],
  ar: ["السياق والمشكلة", "الحل المقترح", "المخرجات", "الجدول الزمني", "الشروط والأحكام"],
  pt: ["Contexto e problema", "Solução proposta", "Entregáveis", "Cronograma", "Termos e condições"],
  de: ["Kontext & Problem", "Vorgeschlagene Lösung", "Leistungen", "Zeitplan", "AGB"],
  zh: ["背景与问题", "解决方案", "交付成果", "时间计划", "条款与条件"],
  ja: ["背景と課題", "提案内容", "成果物", "スケジュール", "契約条件"],
  it: ["Contesto e problema", "Soluzione proposta", "Deliverable", "Cronoprogramma", "Termini e condizioni"],
  ru: ["Контекст и проблема", "Предлагаемое решение", "Результаты", "График", "Условия"],
  tr: ["Bağlam ve sorun", "Önerilen çözüm", "Teslim edilecekler", "Zaman çizelgesi", "Şartlar ve koşullar"],
  hi: ["संदर्भ और समस्या", "प्रस्तावित समाधान", "डिलीवरेबल्स", "समयरेखा", "नियम और शर्तें"],
  nl: ["Context & probleem", "Voorgestelde oplossing", "Deliverables", "Planning", "Algemene voorwaarden"],
  pl: ["Kontekst i problem", "Proponowane rozwiązanie", "Rezultaty", "Harmonogram", "Warunki"],
  ko: ["상황 및 문제", "제안된 해결책", "산출물", "일정", "계약 조건"],
  id: ["Konteks & masalah", "Solusi yang diusulkan", "Hasil kerja", "Jadwal", "Syarat & ketentuan"],
};

// ─── Template label + title per language ───────────────────────────────────────
// [label, title]  (title="" for blank)
const META: Record<string, Partial<Record<LangCode, [string, string]>>> = {
  blank: {
    fr: ["Vierge", ""],
    en: ["Blank", ""],
    es: ["En blanco", ""],
    ar: ["فارغ", ""],
    pt: ["Em branco", ""],
    de: ["Leer", ""],
    zh: ["空白", ""],
    ja: ["ブランク", ""],
    it: ["Vuoto", ""],
    ru: ["Пустой", ""],
    tr: ["Boş", ""],
    hi: ["रिक्त", ""],
    nl: ["Leeg", ""],
    pl: ["Pusty", ""],
    ko: ["빈 양식", ""],
    id: ["Kosong", ""],
  },
  web: {
    fr: ["Site web / dev", "Création de votre site web"],
    en: ["Website / dev", "Your new website"],
    es: ["Sitio web / dev", "Tu nuevo sitio web"],
    ar: ["موقع ويب / تطوير", "موقعك الجديد على الإنترنت"],
    pt: ["Site / dev", "O seu novo site"],
    de: ["Website / Entwicklung", "Ihre neue Website"],
    zh: ["网站 / 开发", "您的新网站"],
    ja: ["Webサイト / 開発", "新しいウェブサイト"],
    it: ["Sito web / dev", "Il tuo nuovo sito web"],
    ru: ["Сайт / разработка", "Ваш новый сайт"],
    tr: ["Web sitesi / geliştirme", "Yeni web siteniz"],
    hi: ["वेबसाइट / डेव", "आपकी नई वेबसाइट"],
    nl: ["Website / dev", "Uw nieuwe website"],
    pl: ["Strona / dev", "Twoja nowa strona"],
    ko: ["웹사이트 / 개발", "새 웹사이트"],
    id: ["Website / dev", "Website baru Anda"],
  },
  design: {
    fr: ["Design / branding", "Identité visuelle de votre marque"],
    en: ["Design / branding", "Your brand visual identity"],
    es: ["Diseño / branding", "La identidad visual de tu marca"],
    ar: ["تصميم / هوية بصرية", "هويتك البصرية"],
    pt: ["Design / branding", "A identidade visual da sua marca"],
    de: ["Design / Branding", "Ihre visuelle Markenidentität"],
    zh: ["设计 / 品牌", "您的品牌视觉形象"],
    ja: ["デザイン / ブランディング", "ブランドのビジュアルアイデンティティ"],
    it: ["Design / branding", "L'identità visiva del tuo brand"],
    ru: ["Дизайн / брендинг", "Визуальная идентичность бренда"],
    tr: ["Tasarım / marka", "Markanızın görsel kimliği"],
    hi: ["डिज़ाइन / ब्रांडिंग", "आपकी ब्रांड पहचान"],
    nl: ["Design / branding", "Uw visuele merkidentiteit"],
    pl: ["Design / branding", "Tożsamość wizualna Twojej marki"],
    ko: ["디자인 / 브랜딩", "브랜드 비주얼 아이덴티티"],
    id: ["Desain / branding", "Identitas visual merek Anda"],
  },
  marketing: {
    fr: ["Marketing / réseaux", "Gestion de vos réseaux sociaux"],
    en: ["Marketing / social media", "Social media management"],
    es: ["Marketing / redes", "Gestión de tus redes sociales"],
    ar: ["تسويق / شبكات", "إدارة وسائل التواصل الاجتماعي"],
    pt: ["Marketing / redes", "Gestão das suas redes sociais"],
    de: ["Marketing / Social Media", "Social-Media-Management"],
    zh: ["营销 / 社交媒体", "社交媒体管理"],
    ja: ["マーケティング / SNS", "SNS運用管理"],
    it: ["Marketing / social", "Gestione dei social media"],
    ru: ["Маркетинг / соцсети", "Ведение социальных сетей"],
    tr: ["Pazarlama / sosyal medya", "Sosyal medya yönetimi"],
    hi: ["मार्केटिंग / सोशल मीडिया", "सोशल मीडिया प्रबंधन"],
    nl: ["Marketing / social media", "Socialmediabeheer"],
    pl: ["Marketing / social media", "Zarządzanie mediami społecznościowymi"],
    ko: ["마케팅 / 소셜미디어", "소셜 미디어 관리"],
    id: ["Marketing / media sosial", "Manajemen media sosial"],
  },
  consulting: {
    fr: ["Conseil / formation", "Mission de conseil"],
    en: ["Consulting / training", "Consulting engagement"],
    es: ["Consultoría / formación", "Misión de consultoría"],
    ar: ["استشارات / تدريب", "مهمة استشارية"],
    pt: ["Consultoria / formação", "Missão de consultoria"],
    de: ["Beratung / Training", "Beratungsauftrag"],
    zh: ["咨询 / 培训", "咨询项目"],
    ja: ["コンサルティング / 研修", "コンサルティング業務"],
    it: ["Consulenza / formazione", "Missione di consulenza"],
    ru: ["Консалтинг / обучение", "Консалтинговый проект"],
    tr: ["Danışmanlık / eğitim", "Danışmanlık görevi"],
    hi: ["परामर्श / प्रशिक्षण", "परामर्श मिशन"],
    nl: ["Advies / training", "Adviesopdracht"],
    pl: ["Doradztwo / szkolenie", "Misja doradcza"],
    ko: ["컨설팅 / 교육", "컨설팅 계약"],
    id: ["Konsultasi / pelatihan", "Proyek konsultasi"],
  },
  photo: {
    fr: ["Photo / vidéo", "Prestation photo / vidéo"],
    en: ["Photo / video", "Photo / video production"],
    es: ["Foto / vídeo", "Prestación de foto / vídeo"],
    ar: ["تصوير / فيديو", "خدمة التصوير والفيديو"],
    pt: ["Foto / vídeo", "Prestação de foto / vídeo"],
    de: ["Foto / Video", "Foto- und Videoproduktion"],
    zh: ["摄影 / 视频", "摄影视频制作"],
    ja: ["写真 / 動画", "写真・動画制作"],
    it: ["Foto / video", "Produzione foto / video"],
    ru: ["Фото / видео", "Фото- и видеосъёмка"],
    tr: ["Fotoğraf / video", "Fotoğraf / video prodüksiyon"],
    hi: ["फोटो / वीडियो", "फोटो / वीडियो प्रोडक्शन"],
    nl: ["Foto / video", "Foto- en videoproductie"],
    pl: ["Foto / wideo", "Produkcja foto i wideo"],
    ko: ["사진 / 영상", "사진 / 영상 제작"],
    id: ["Foto / video", "Produksi foto / video"],
  },
  rh: {
    fr: ["RH / recrutement", "Accompagnement recrutement & RH"],
    en: ["HR / recruitment", "Recruitment & HR support"],
    es: ["RRHH / reclutamiento", "Apoyo en contratación y RRHH"],
    ar: ["موارد بشرية / توظيف", "دعم التوظيف والموارد البشرية"],
    pt: ["RH / recrutamento", "Apoio em recrutamento e RH"],
    de: ["HR / Recruiting", "Recruiting & HR-Unterstützung"],
    zh: ["人力资源 / 招聘", "招聘与人力资源支持"],
    ja: ["人事 / 採用", "採用・HR支援"],
    it: ["HR / selezione", "Supporto reclutamento e HR"],
    ru: ["HR / найм", "Подбор персонала и HR-поддержка"],
    tr: ["İK / işe alım", "İşe alım ve İK desteği"],
    hi: ["HR / भर्ती", "भर्ती एवं HR सहायता"],
    nl: ["HR / werving", "Werving & HR-ondersteuning"],
    pl: ["HR / rekrutacja", "Wsparcie rekrutacji i HR"],
    ko: ["HR / 채용", "채용 및 HR 지원"],
    id: ["HR / rekrutmen", "Dukungan rekrutmen & HR"],
  },
  immobilier: {
    fr: ["Immobilier", "Mandat de vente / mise en location de votre bien"],
    en: ["Real estate", "Sale / rental mandate for your property"],
    es: ["Inmobiliaria", "Mandato de venta / alquiler de tu inmueble"],
    ar: ["عقارات", "وكالة بيع / تأجير عقارك"],
    pt: ["Imobiliário", "Mandato de venda / arrendamento do seu imóvel"],
    de: ["Immobilien", "Verkaufs- / Mietmandat für Ihre Immobilie"],
    zh: ["房产", "您房产的出售/出租委托"],
    ja: ["不動産", "物件の売却・賃貸委任"],
    it: ["Immobiliare", "Mandato di vendita / locazione del tuo immobile"],
    ru: ["Недвижимость", "Мандат на продажу / аренду недвижимости"],
    tr: ["Gayrimenkul", "Mülkünüz için satış / kiralama yetkisi"],
    hi: ["रियल एस्टेट", "आपकी संपत्ति का बिक्री / किराया जनादेश"],
    nl: ["Vastgoed", "Verkoop- / verhuurmandaat voor uw pand"],
    pl: ["Nieruchomości", "Pełnomocnictwo sprzedaży / wynajmu"],
    ko: ["부동산", "부동산 매각/임대 위임"],
    id: ["Properti", "Mandat jual / sewa properti Anda"],
  },
  evenementiel: {
    fr: ["Événementiel", "Organisation de votre événement"],
    en: ["Events", "Event organisation"],
    es: ["Eventos", "Organización de tu evento"],
    ar: ["تنظيم فعاليات", "تنظيم فعاليتك"],
    pt: ["Eventos", "Organização do seu evento"],
    de: ["Veranstaltungen", "Organisation Ihrer Veranstaltung"],
    zh: ["活动策划", "您的活动策划"],
    ja: ["イベント", "イベント企画・運営"],
    it: ["Eventi", "Organizzazione del tuo evento"],
    ru: ["Мероприятия", "Организация вашего мероприятия"],
    tr: ["Etkinlik", "Etkinliğinizin organizasyonu"],
    hi: ["इवेंट", "आपके कार्यक्रम का आयोजन"],
    nl: ["Evenementen", "Organisatie van uw evenement"],
    pl: ["Eventy", "Organizacja Twojego wydarzenia"],
    ko: ["이벤트", "이벤트 기획 및 운영"],
    id: ["Event", "Penyelenggaraan acara Anda"],
  },
  btp: {
    fr: ["BTP / travaux", "Devis travaux"],
    en: ["Construction / works", "Works quote"],
    es: ["Construcción / obras", "Presupuesto de obras"],
    ar: ["بناء / أشغال", "عرض سعر للأشغال"],
    pt: ["Construção / obras", "Orçamento de obras"],
    de: ["Bau / Handwerk", "Kostenvoranschlag"],
    zh: ["建筑 / 工程", "工程报价"],
    ja: ["建設 / 工事", "工事見積"],
    it: ["Edilizia / lavori", "Preventivo lavori"],
    ru: ["Строительство / ремонт", "Смета на работы"],
    tr: ["İnşaat / tadilat", "Yapım teklifi"],
    hi: ["निर्माण / काम", "कार्य कोटेशन"],
    nl: ["Bouw / verbouwing", "Offerte werken"],
    pl: ["Budownictwo / roboty", "Oferta prac budowlanych"],
    ko: ["건설 / 공사", "공사 견적"],
    id: ["Konstruksi / pekerjaan", "Penawaran pekerjaan"],
  },
  traiteur: {
    fr: ["Traiteur / restauration", "Prestation traiteur"],
    en: ["Catering", "Catering service"],
    es: ["Catering", "Servicio de catering"],
    ar: ["تموين / مطعم", "خدمة الطعام"],
    pt: ["Catering", "Serviço de catering"],
    de: ["Catering", "Cateringservice"],
    zh: ["餐饮服务", "餐饮服务方案"],
    ja: ["ケータリング", "ケータリングサービス"],
    it: ["Catering", "Servizio catering"],
    ru: ["Кейтеринг", "Услуги кейтеринга"],
    tr: ["Catering", "Catering hizmeti"],
    hi: ["कैटरिंग", "कैटरिंग सेवा"],
    nl: ["Catering", "Cateringservice"],
    pl: ["Catering", "Usługa cateringowa"],
    ko: ["케이터링", "케이터링 서비스"],
    id: ["Katering", "Layanan katering"],
  },
  coaching: {
    fr: ["Coaching", "Programme d'accompagnement"],
    en: ["Coaching", "Coaching programme"],
    es: ["Coaching", "Programa de acompañamiento"],
    ar: ["تدريب شخصي", "برنامج مرافقة"],
    pt: ["Coaching", "Programa de acompanhamento"],
    de: ["Coaching", "Coaching-Programm"],
    zh: ["教练 / 辅导", "辅导计划"],
    ja: ["コーチング", "コーチングプログラム"],
    it: ["Coaching", "Programma di coaching"],
    ru: ["Коучинг", "Коучинговая программа"],
    tr: ["Koçluk", "Koçluk programı"],
    hi: ["कोचिंग", "कोचिंग कार्यक्रम"],
    nl: ["Coaching", "Coachingprogramma"],
    pl: ["Coaching", "Program coachingowy"],
    ko: ["코칭", "코칭 프로그램"],
    id: ["Coaching", "Program coaching"],
  },
  compta: {
    fr: ["Comptabilité / juridique", "Mission comptable & conseil"],
    en: ["Accounting / legal", "Accounting & advisory engagement"],
    es: ["Contabilidad / legal", "Misión contable y asesoría"],
    ar: ["محاسبة / قانوني", "مهمة محاسبية واستشارية"],
    pt: ["Contabilidade / jurídico", "Missão contabilística e de consultoria"],
    de: ["Buchhaltung / Recht", "Buchhaltungs- und Beratungsauftrag"],
    zh: ["财务 / 法律", "财务与顾问服务"],
    ja: ["会計 / 法務", "会計・アドバイザリー業務"],
    it: ["Contabilità / legale", "Incarico contabile e consulenza"],
    ru: ["Бухгалтерия / юридические услуги", "Бухгалтерский и консультационный проект"],
    tr: ["Muhasebe / hukuk", "Muhasebe ve danışmanlık görevi"],
    hi: ["लेखांकन / कानूनी", "लेखांकन और परामर्श"],
    nl: ["Boekhouding / juridisch", "Boekhoud- en adviesopdracht"],
    pl: ["Księgowość / prawo", "Zlecenie księgowo-doradcze"],
    ko: ["회계 / 법무", "회계 및 자문 계약"],
    id: ["Akuntansi / hukum", "Layanan akuntansi & konsultasi"],
  },
  it: {
    fr: ["Informatique / maintenance", "Contrat de maintenance informatique"],
    en: ["IT / maintenance", "IT maintenance contract"],
    es: ["Informática / soporte", "Contrato de mantenimiento informático"],
    ar: ["تكنولوجيا / صيانة", "عقد صيانة معلوماتية"],
    pt: ["Informática / manutenção", "Contrato de manutenção informática"],
    de: ["IT / Wartung", "IT-Wartungsvertrag"],
    zh: ["IT / 维护", "IT维护合同"],
    ja: ["IT / 保守", "ITメンテナンス契約"],
    it: ["IT / manutenzione", "Contratto di manutenzione IT"],
    ru: ["IT / обслуживание", "Договор на IT-обслуживание"],
    tr: ["BT / bakım", "BT bakım sözleşmesi"],
    hi: ["IT / रखरखाव", "IT रखरखाव अनुबंध"],
    nl: ["IT / onderhoud", "IT-onderhoudscontract"],
    pl: ["IT / serwis", "Umowa na serwis IT"],
    ko: ["IT / 유지보수", "IT 유지보수 계약"],
    id: ["IT / pemeliharaan", "Kontrak pemeliharaan IT"],
  },
  formation: {
    fr: ["Formation pro", "Programme de formation"],
    en: ["Professional training", "Training programme"],
    es: ["Formación profesional", "Programa de formación"],
    ar: ["تدريب مهني", "برنامج تدريبي"],
    pt: ["Formação profissional", "Programa de formação"],
    de: ["Berufliche Weiterbildung", "Schulungsprogramm"],
    zh: ["职业培训", "培训方案"],
    ja: ["プロ研修", "研修プログラム"],
    it: ["Formazione professionale", "Programma di formazione"],
    ru: ["Проф. обучение", "Программа обучения"],
    tr: ["Mesleki eğitim", "Eğitim programı"],
    hi: ["व्यावसायिक प्रशिक्षण", "प्रशिक्षण कार्यक्रम"],
    nl: ["Beroepsopleiding", "Opleidingsprogramma"],
    pl: ["Szkolenie zawodowe", "Program szkoleniowy"],
    ko: ["직업 교육", "교육 프로그램"],
    id: ["Pelatihan profesional", "Program pelatihan"],
  },
};

// ─── Extra section titles per language ─────────────────────────────────────────
const EXTRA_TITLES: Record<LangCode, string[]> = {
  fr: ["À propos de moi", "Références & réalisations", "Notre méthodologie", "Pourquoi nous choisir", "Modalités de paiement", "Garanties", "Prochaines étapes", "Questions fréquentes"],
  en: ["About me", "References & past work", "Our methodology", "Why choose us", "Payment terms", "Guarantees", "Next steps", "Frequently asked questions"],
  es: ["Sobre mí", "Referencias y trabajos", "Nuestra metodología", "Por qué elegirnos", "Modalidades de pago", "Garantías", "Próximos pasos", "Preguntas frecuentes"],
  ar: ["نبذة عني", "المراجع والأعمال", "منهجيتنا", "لماذا تختارنا", "شروط الدفع", "الضمانات", "الخطوات التالية", "الأسئلة الشائعة"],
  pt: ["Sobre mim", "Referências e trabalhos", "A nossa metodologia", "Porquê nos escolher", "Modalidades de pagamento", "Garantias", "Próximos passos", "Perguntas frequentes"],
  de: ["Über mich", "Referenzen & Projekte", "Unsere Methodik", "Warum uns wählen", "Zahlungsmodalitäten", "Garantien", "Nächste Schritte", "Häufige Fragen"],
  zh: ["关于我", "参考案例", "我们的方法", "为什么选择我们", "付款方式", "保证", "下一步", "常见问题"],
  ja: ["自己紹介", "実績・事例", "私たちのアプローチ", "なぜ私たちを選ぶか", "支払い条件", "保証", "次のステップ", "よくある質問"],
  it: ["Chi sono", "Riferimenti e lavori", "La nostra metodologia", "Perché sceglierci", "Modalità di pagamento", "Garanzie", "Prossimi passi", "Domande frequenti"],
  ru: ["О себе", "Портфолио и проекты", "Наша методология", "Почему выбрать нас", "Условия оплаты", "Гарантии", "Следующие шаги", "Часто задаваемые вопросы"],
  tr: ["Hakkımda", "Referanslar ve çalışmalar", "Metodolojimiz", "Neden bizi seçin", "Ödeme koşulları", "Garantiler", "Sonraki adımlar", "Sıkça sorulan sorular"],
  hi: ["मेरे बारे में", "संदर्भ और कार्य", "हमारी पद्धति", "हमें क्यों चुनें", "भुगतान की शर्तें", "गारंटी", "अगले कदम", "अक्सर पूछे जाने वाले प्रश्न"],
  nl: ["Over mij", "Referenties & werk", "Onze methodologie", "Waarom ons kiezen", "Betalingsmodaliteiten", "Garanties", "Volgende stappen", "Veelgestelde vragen"],
  pl: ["O mnie", "Referencje i prace", "Nasza metodologia", "Dlaczego nas wybrać", "Warunki płatności", "Gwarancje", "Następne kroki", "Często zadawane pytania"],
  ko: ["나에 대해", "레퍼런스 및 작업", "우리의 방법론", "왜 우리를 선택하나요", "결제 조건", "보증", "다음 단계", "자주 묻는 질문"],
  id: ["Tentang saya", "Referensi & portofolio", "Metodologi kami", "Mengapa memilih kami", "Ketentuan pembayaran", "Jaminan", "Langkah selanjutnya", "Pertanyaan yang sering diajukan"],
};

// ─── English content (bodies) ──────────────────────────────────────────────────
const CGV_EN =
  "Quote valid for the duration indicated. Deposit due on order, balance on delivery. " +
  "Work starts upon receipt of deposit. Any out-of-scope work will be covered by a change order.";

const TEMPLATES_EN: ProposalTemplate[] = [
  {
    id: "blank",
    label: "Blank",
    title: "",
    sections: [
      { title: "Context & problem", body: "" },
      { title: "Proposed solution", body: "" },
      { title: "Deliverables", body: "" },
      { title: "Timeline", body: "" },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [{ description: "Service", quantity: 1, unitPrice: 250000 }],
  },
  {
    id: "web",
    label: "Website / dev",
    title: "Your new website",
    sections: [
      { title: "Context & problem", body: "Your current online presence is not converting visitors into clients and does not reflect the quality of your offer. You are losing prospects due to a slow, unclear, or untrustworthy website." },
      { title: "Proposed solution", body: "I design and develop a modern, fast, mobile-optimised website built to convert: clear structure, calls to action, basic SEO, and integrated WhatsApp contact." },
      { title: "Deliverables", body: "- Validated mockup before development\n- Responsive site (5 pages)\n- Contact form + WhatsApp\n- Basic on-page SEO\n- Handover training (30 min)" },
      { title: "Timeline", body: "Week 1: scoping + mockup. Weeks 2–3: development. Week 4: content, testing, and go-live. Estimated total: 4 weeks." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Design & mockup", quantity: 1, unitPrice: 150000 },
      { description: "Website development (5 pages)", quantity: 1, unitPrice: 450000 },
      { description: "Go-live + training", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      { name: "Essential", price: 400000, features: ["3-page site", "Mobile responsive", "WhatsApp contact"] },
      { name: "Pro", price: 700000, highlighted: true, features: ["5-page site", "Basic SEO", "Blog", "Training included"] },
      { name: "Premium", price: 1200000, features: ["Unlimited pages", "Advanced SEO", "3-month maintenance", "Priority support"] },
    ],
  },
  {
    id: "design",
    label: "Design / branding",
    title: "Your brand visual identity",
    sections: [
      { title: "Context & problem", body: "Your brand lacks visual consistency: logo, colours, and materials do not project a professional, memorable image, undermining your credibility." },
      { title: "Proposed solution", body: "I create a complete, cohesive visual identity: logo, colour palette, typography, and key collateral — delivered with a simple brand guide." },
      { title: "Deliverables", body: "- Logo (3 concepts, 2 revision rounds)\n- Brand guide (colours, typography, usage)\n- Source files + web/print exports\n- Social media templates" },
      { title: "Timeline", body: "Week 1: research + directions. Week 2: selection + revisions. Week 3: finalisation and file delivery. Estimated: 3 weeks." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Logo research & concepts", quantity: 1, unitPrice: 120000 },
      { description: "Brand guide", quantity: 1, unitPrice: 90000 },
      { description: "Collateral adaptations", quantity: 1, unitPrice: 60000 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing / social media",
    title: "Social media management",
    sections: [
      { title: "Context & problem", body: "Your social media presence is inconsistent and generates neither engagement nor sales. Lack of strategy and regularity is limiting your visibility." },
      { title: "Proposed solution", body: "I take charge of your strategy and presence: editorial calendar, content creation, regular publishing, and monthly performance reporting." },
      { title: "Deliverables", body: "- Strategy + monthly editorial calendar\n- 12 posts / month (visuals + copy)\n- Community management (replies)\n- Monthly performance report" },
      { title: "Timeline", body: "Monthly rolling engagement. Start within 5 business days of signing." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [{ description: "Social media management (monthly flat fee)", quantity: 1, unitPrice: 200000 }],
    tiers: [
      { name: "Starter", price: 150000, features: ["8 posts / month", "1 network", "Monthly report"] },
      { name: "Growth", price: 300000, highlighted: true, features: ["16 posts / month", "2 networks", "Stories", "Community management"] },
      { name: "Performance", price: 500000, features: ["Unlimited posts", "3 networks", "Ads included", "Advanced reporting"] },
    ],
  },
  {
    id: "consulting",
    label: "Consulting / training",
    title: "Consulting engagement",
    sections: [
      { title: "Context & problem", body: "You are facing a challenge your teams do not have the time or expertise to address, which is slowing your growth." },
      { title: "Proposed solution", body: "I support you with a structured engagement: diagnosis, actionable recommendations, and implementation support." },
      { title: "Deliverables", body: "- Written diagnosis\n- Prioritised action plan\n- Support sessions\n- Summary document" },
      { title: "Timeline", body: "Phase 1: diagnosis (1 week). Phase 2: recommendations (1 week). Phase 3: support (as per package)." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [{ description: "Consulting day", quantity: 3, unitPrice: 150000 }],
  },
  {
    id: "photo",
    label: "Photo / video",
    title: "Photo / video production",
    sections: [
      { title: "Context & problem", body: "Your current visuals do not showcase your products/services well and are hurting your online sales." },
      { title: "Proposed solution", body: "I deliver a professional shoot (prep, photography, retouching) for ready-to-use visuals on your website and social media." },
      { title: "Deliverables", body: "- Photo/video session (½ day)\n- Selection + retouching of 20 visuals\n- Web + social media formats\n- Delivery within 7 days" },
      { title: "Timeline", body: "Session scheduled within 10 days. Retouched files delivered within 7 days after the session." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Photo session (½ day)", quantity: 1, unitPrice: 120000 },
      { description: "Retouching (20 visuals)", quantity: 1, unitPrice: 80000 },
    ],
  },
  {
    id: "rh",
    label: "HR / recruitment",
    title: "Recruitment & HR support",
    sections: [
      { title: "Context & problem", body: "Finding the right profiles and managing staff takes time you do not have, with the risk of costly mis-hires and non-compliance." },
      { title: "Proposed solution", body: "I manage the end-to-end process: defining the role, targeted sourcing, pre-screening, interviews, and onboarding — securing the administrative side." },
      { title: "Deliverables", body: "- Validated job description\n- Short-list of qualified candidates\n- Interview reports\n- Contract templates and onboarding procedure" },
      { title: "Timeline", body: "Week 1: scoping + sourcing. Weeks 2–3: interviews + short-list. Week 4: final selection and onboarding." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Role definition & job description", quantity: 1, unitPrice: 100000 },
      { description: "Sourcing & pre-screening", quantity: 1, unitPrice: 250000 },
      { description: "Interviews & short-list", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Recruitment", price: 350000, features: ["1 role", "Short-list of 3 profiles", "Interview guide"] },
      { name: "Recruitment+", price: 600000, highlighted: true, features: ["1 role", "Short-list of 5 profiles", "Onboarding", "Replacement guarantee"] },
      { name: "Outsourced HR", price: 400000, features: ["Monthly flat fee", "Payroll & contracts", "Compliance", "Support"] },
    ],
  },
  {
    id: "immobilier",
    label: "Real estate",
    title: "Sale / rental mandate for your property",
    sections: [
      { title: "Context & problem", body: "Selling or renting your property at the right price and quickly requires expertise, visibility, and time to manage viewings and negotiation." },
      { title: "Proposed solution", body: "I handle everything: realistic valuation, property staging, multi-platform listing, viewing organisation, negotiation, and support through to signing." },
      { title: "Deliverables", body: "- Argued property valuation\n- Photo shoot + professional listing\n- Listing on key channels + networks\n- Viewing reports\n- Support through signing" },
      { title: "Timeline", body: "Week 1: valuation, photos, and listing. From week 2: distribution and viewings. Negotiation and signing once an offer is accepted." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Valuation & sale file", quantity: 1, unitPrice: 100000 },
      { description: "Photo shoot & professional listing", quantity: 1, unitPrice: 80000 },
      { description: "Distribution, viewings & negotiation", quantity: 1, unitPrice: 250000 },
    ],
    tiers: [
      { name: "Distribution", price: 150000, features: ["Professional listing", "Photos", "30-day distribution"] },
      { name: "Full mandate", price: 500000, highlighted: true, features: ["Valuation", "Photos + listing", "Viewings & negotiation", "Signing support"] },
      { name: "Property management", price: 60000, features: ["Monthly fee", "Rent collection", "Tenant follow-up", "Inventories"] },
    ],
  },
  {
    id: "evenementiel",
    label: "Events",
    title: "Event organisation",
    sections: [
      { title: "Context & problem", body: "Running a successful event means coordinating many suppliers and tight logistics, under high pressure on the day." },
      { title: "Proposed solution", body: "I design and coordinate your event from A to Z: concept, budget, supplier selection, logistics, and on-site coordination on the day." },
      { title: "Deliverables", body: "- Concept + detailed budget\n- Supplier selection and management\n- Logistics schedule\n- On-site coordination on the day" },
      { title: "Timeline", body: "Based on the event date: scoping, supplier booking, preparation, then on-site coordination on the day." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Concept & budget", quantity: 1, unitPrice: 150000 },
      { description: "Supplier coordination", quantity: 1, unitPrice: 200000 },
      { description: "On-site coordination", quantity: 1, unitPrice: 150000 },
    ],
    tiers: [
      { name: "Advisory", price: 150000, features: ["Concept", "Budget", "Supplier list"] },
      { name: "Coordination", price: 400000, highlighted: true, features: ["Concept + budget", "Supplier management", "Day-of coordination"] },
      { name: "Full service", price: 800000, features: ["Everything included", "Décor", "On-site team", "Issue management"] },
    ],
  },
  {
    id: "btp",
    label: "Construction / works",
    title: "Works quote",
    sections: [
      { title: "Context & problem", body: "You need works carried out to professional standards, on time and on budget, with no unpleasant surprises." },
      { title: "Proposed solution", body: "After an on-site survey, I propose a controlled execution: quality materials, skilled labour, site supervision, and handover on schedule." },
      { title: "Deliverables", body: "- Survey and technical study\n- Supplies and materials\n- Works execution\n- Site handover + warranty" },
      { title: "Timeline", body: "Start upon receipt of deposit. Site duration estimated by scope, with regular progress updates." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Survey & study", quantity: 1, unitPrice: 150000 },
      { description: "Supplies & materials", quantity: 1, unitPrice: 1200000 },
      { description: "Labour & execution", quantity: 1, unitPrice: 900000 },
    ],
  },
  {
    id: "traiteur",
    label: "Catering",
    title: "Catering service",
    sections: [
      { title: "Context & problem", body: "You want to delight your guests with impeccable service, without having to manage the cooking, service, and logistics on the day." },
      { title: "Proposed solution", body: "I offer a menu tailored to your event and budget, with preparation, dressing, service, and equipment — you just enjoy the moment." },
      { title: "Deliverables", body: "- Personalised menu (starter, main, dessert)\n- Service staff\n- Tableware and equipment\n- Post-service clean-up" },
      { title: "Timeline", body: "Menu confirmed and deposit paid at least 7 days before. Delivery and service on the event day." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Menu (per person)", quantity: 50, unitPrice: 7500 },
      { description: "Service & staff", quantity: 1, unitPrice: 100000 },
      { description: "Equipment & tableware rental", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "coaching",
    label: "Coaching",
    title: "Coaching programme",
    sections: [
      { title: "Context & problem", body: "You have a goal to reach but lack the method, perspective, or consistency to sustain it over time." },
      { title: "Proposed solution", body: "I support you with a structured programme: clear objectives, regular sessions, concrete exercises, and between-session follow-up." },
      { title: "Deliverables", body: "- Initial assessment + objectives\n- Individual sessions\n- Personalised action plan\n- Between-session support and materials" },
      { title: "Timeline", body: "Multi-week programme, one session per week, with a mid-programme check-in." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Individual session", quantity: 6, unitPrice: 25000 },
      { description: "Materials & follow-up", quantity: 1, unitPrice: 50000 },
    ],
    tiers: [
      { name: "Discovery", price: 75000, features: ["3 sessions", "Action plan"] },
      { name: "Programme", price: 200000, highlighted: true, features: ["8 sessions", "Materials", "WhatsApp follow-up"] },
      { name: "Intensive", price: 350000, features: ["12 sessions", "Unlimited follow-up", "Final assessment"] },
    ],
  },
  {
    id: "compta",
    label: "Accounting / legal",
    title: "Accounting & advisory engagement",
    sections: [
      { title: "Context & problem", body: "Managing accounts and filing obligations takes time and exposes you to errors and penalties." },
      { title: "Proposed solution", body: "I handle your bookkeeping and filings, with ongoing advice to run your business with peace of mind." },
      { title: "Deliverables", body: "- Up-to-date bookkeeping\n- Tax and social filings\n- Periodic financial statements\n- Advisory and regular reviews" },
      { title: "Timeline", body: "Monthly rolling engagement. First month: catch-up on existing records; then regular ongoing maintenance." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Bookkeeping (monthly flat fee)", quantity: 1, unitPrice: 150000 },
      { description: "Tax & social filings", quantity: 1, unitPrice: 100000 },
      { description: "Advisory & support", quantity: 1, unitPrice: 75000 },
    ],
  },
  {
    id: "it",
    label: "IT / maintenance",
    title: "IT maintenance contract",
    sections: [
      { title: "Context & problem", body: "IT failures and slowdowns block your operations, and the security of your data is not guaranteed." },
      { title: "Proposed solution", body: "I upgrade your systems then provide preventive maintenance and reactive support to keep your tools reliable and secure." },
      { title: "Deliverables", body: "- Audit & compliance\n- Backups and security\n- Monthly preventive maintenance\n- Support and troubleshooting" },
      { title: "Timeline", body: "Audit and upgrade in month 1, then monthly rolling maintenance contract." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Audit & compliance", quantity: 1, unitPrice: 150000 },
      { description: "Maintenance (monthly flat fee)", quantity: 1, unitPrice: 100000 },
    ],
    tiers: [
      { name: "Basic", price: 60000, features: ["Monthly maintenance", "Message support", "Backups"] },
      { name: "Pro", price: 120000, highlighted: true, features: ["Priority support", "On-site visit", "Enhanced security"] },
      { name: "Unlimited", price: 250000, features: ["Unlimited support", "On-call", "24/7 monitoring"] },
    ],
  },
  {
    id: "formation",
    label: "Professional training",
    title: "Training programme",
    sections: [
      { title: "Context & problem", body: "Your teams need to upskill quickly, but generic courses are poorly suited to your reality." },
      { title: "Proposed solution", body: "I design a bespoke training, alternating theory and practice, with materials and an assessment to anchor learning." },
      { title: "Deliverables", body: "- Bespoke training programme\n- Session facilitation\n- Training materials\n- Assessment + certificate" },
      { title: "Timeline", body: "Programme validated before start, then sessions run on agreed days with a final assessment." },
      { title: "Terms & conditions", body: CGV_EN },
    ],
    services: [
      { description: "Instructional design", quantity: 1, unitPrice: 150000 },
      { description: "Facilitation (day)", quantity: 2, unitPrice: 150000 },
      { description: "Materials & assessment", quantity: 1, unitPrice: 60000 },
    ],
  },
];

const EXTRA_SECTIONS_EN_BODIES = [
  "Introduce yourself in a few lines: your background, your speciality, and what sets you apart. Reassure the client they are in good hands.",
  "Mention 2 or 3 representative projects or clients, each with a concrete result (e.g. '+30% in sales', 'delivered in 3 weeks').",
  "Describe your working steps (scoping → execution → validation → delivery). A clear process reassures and justifies your price.",
  "List 3 to 5 reasons to trust you: expertise, responsiveness, proximity, result guarantee, post-delivery support.",
  "Specify the deposit on order, balance on delivery, and accepted payment methods (mobile money, bank transfer, cash).",
  "State what you guarantee: revisions included, on-time delivery, satisfaction, post-delivery support for a given period.",
  "Explain how to start: approve this proposal, pay the deposit, kick-off meeting. Make it easy to take action.",
  "Pre-answer the 2–3 most common objections (timelines, price, ownership of deliverables) to remove last-minute hesitation.",
];

const EN_SECTION_VARIANTS: Record<string, string[]> = {
  "Context & problem": [
    "You are losing time and opportunities due to the lack of a solution adapted to your current situation.",
    "Your organisation faces a challenge that is slowing your growth and consuming valuable resources.",
    "The absence of internal tools or expertise exposes you to errors and a loss of efficiency.",
    "Your clients expect a level of quality and responsiveness that your current setup cannot deliver.",
    "The problem is not a lack of will, but the absence of a structured approach to move things forward.",
  ],
  "Proposed solution": [
    "I offer a turnkey service, designed for your reality, with measurable results at every stage.",
    "My approach combines a proven method with adaptation to your context, for a concrete and lasting result.",
    "I take charge of the entire project: you save time and focus on your core business.",
    "We move forward in steps validated together, to stay in control of budget, timelines, and quality.",
    "A simple, professional, and scalable solution that meets your immediate need while preparing for what's next.",
  ],
  "Deliverables": [
    "- Main deliverable per agreed specification\n- Getting-started documentation\n- Revisions included\n- Post-delivery support",
    "- A completed and tested solution\n- Source files\n- User guide\n- A training session",
    "- Service delivered on time\n- Regular progress updates\n- Final delivery + warranty",
    "- Ready-to-use output\n- Formats adapted to your uses\n- Onboarding support",
    "- All agreed items\n- A clear summary\n- Transfer of rights to deliverables after full payment",
  ],
  "Timeline": [
    "Start upon receipt of deposit. Delivery estimated by scope, with regular check-ins.",
    "Project organised in phases: scoping, execution, validation, delivery. Timelines confirmed at kick-off.",
    "A quick first version, then adjustments until your final sign-off.",
    "Schedule adapted to your constraints, with a firm delivery date agreed together.",
    "Recurring rolling engagement, start within a few days of signing.",
  ],
  "Terms & conditions": [
    CGV_EN,
    "50% deposit on order, balance on delivery. Reasonable revisions included; beyond that, billed separately.",
    "Payment due within 15 days of invoice. Late payment may incur penalties as permitted by applicable law.",
    "Deliverables remain the property of the service provider until full payment; rights are transferred to the client after full settlement.",
    "Prices fixed for the validity period of the offer. Ancillary costs (travel, licences, printing) billed separately if applicable.",
  ],
};

// ─── Build helpers ──────────────────────────────────────────────────────────────

function buildTemplates(lang: LangCode): ProposalTemplate[] {
  if (lang === "fr") return TEMPLATES_FR;
  const [ctx, sol, del, tim, ter] = S[lang];
  return TEMPLATES_EN.map((tpl) => {
    const meta = META[tpl.id]?.[lang];
    return {
      ...tpl,
      label: meta?.[0] ?? tpl.label,
      title: meta?.[1] ?? tpl.title,
      sections: tpl.sections.map((sec) => {
        const enTitle = sec.title;
        const enTitles = S["en"];
        const idx = enTitles.indexOf(enTitle as never);
        const localTitle = idx >= 0 ? [ctx, sol, del, tim, ter][idx] : sec.title;
        return { ...sec, title: localTitle };
      }),
    };
  });
}

function buildExtraSections(lang: LangCode): ProposalSection[] {
  if (lang === "fr") return EXTRA_SECTIONS_FR;
  const titles = EXTRA_TITLES[lang] ?? EXTRA_TITLES["en"];
  return titles.map((title, i) => ({
    title,
    body: EXTRA_SECTIONS_EN_BODIES[i] ?? "",
  }));
}

function buildSectionVariants(lang: LangCode): Record<string, string[]> {
  if (lang === "fr") return SECTION_VARIANTS_FR;
  const [ctx, sol, del, tim, ter] = S[lang];
  const enVariants = EN_SECTION_VARIANTS;
  return {
    [ctx]: enVariants["Context & problem"],
    [sol]: enVariants["Proposed solution"],
    [del]: enVariants["Deliverables"],
    [tim]: enVariants["Timeline"],
    [ter]: enVariants["Terms & conditions"],
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────────

export function getTemplates(lang: LangCode): ProposalTemplate[] {
  return buildTemplates(lang);
}

export function getExtraSections(lang: LangCode): ProposalSection[] {
  return buildExtraSections(lang);
}

export function getSectionVariants(lang: LangCode): Record<string, string[]> {
  return buildSectionVariants(lang);
}
