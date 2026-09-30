import { useMemo, useState } from "react";
import { formatMoney, whatsappLink, type Currency } from "@atelier/core";

type LangCode = "fr" | "en" | "es" | "ar" | "pt" | "de" | "zh" | "ja" | "it" | "ru" | "tr" | "hi" | "nl" | "pl" | "ko" | "id";

// ── Inline translations (portal is standalone — no shared i18n) ──────────────

const T: Record<LangCode, {
  poweredBy: string;
  landingTitle: string;
  landingDesc: string;
  insTitle: (org: string) => string;
  insSubtitle: string;
  insName: string;
  insPhone: string;
  insEmail: string;
  insCity: string;
  insMemberType: string;
  insSubmit: string;
  errName: string;
  errBadLink: string;
  accFrom: (org: string) => string;
  accRef: string;
  accAmount: string;
  accValidity: (days: string) => string;
  accNameLabel: string;
  accSubmit: string;
  accFooter: string;
  accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) => string;
  errAccName: string;
  ficheCoords: string;
  ficheNamePhone: string;
  ficheInterests: string;
  ficheRecontact: string;
  ficheNotes: string;
  ficheNotesPlaceholder: string;
  ficheConsent: string;
  ficheSignature: string;
  ficheSubmit: string;
  ficheFooter: string;
  ficheStructure: string;
  ficheFonction: string;
  errFichePhone: string;
  errConsent: string;
}> = {
  fr: {
    poweredBy: "Propulsé par Atelier · aucune donnée n'est envoyée à un serveur",
    landingTitle: "Portail Atelier",
    landingDesc: "Ce lien est incomplet. Ouvrez le lien exact qu'on vous a partagé (inscription ou proposition à accepter).",
    insTitle: (org) => `Inscription — ${org}`,
    insSubtitle: "Remplissez ce formulaire, puis envoyez : votre inscription part par WhatsApp.",
    insName: "Nom / Prénom *",
    insPhone: "Téléphone",
    insEmail: "Email",
    insCity: "Ville",
    insMemberType: "Type d'adhésion",
    insSubmit: "Envoyer mon inscription",
    errName: "Votre nom est requis.",
    errBadLink: "Lien mal configuré (numéro manquant).",
    accFrom: (org) => `Proposition de ${org}`,
    accRef: "Référence",
    accAmount: "Montant",
    accValidity: (d) => `Offre valable ${d} jours`,
    accNameLabel: "Votre nom (bon pour accord)",
    accSubmit: "J'accepte cette proposition",
    accFooter: "Votre acceptation est envoyée au prestataire par WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Bonjour ${org},\n\nJ'accepte la proposition « ${title} »${num ? ` (réf. ${num})` : ""}${amount ? `, montant ${amount}` : ""}.\nBon pour accord — ${name}, le ${date}.`,
    errAccName: "Indiquez votre nom pour valider.",
    ficheCoords: "Vos coordonnées",
    ficheNamePhone: "Téléphone *",
    ficheInterests: "Ce qui vous intéresse",
    ficheRecontact: "Pour mieux vous recontacter",
    ficheNotes: "Notes / échange",
    ficheNotesPlaceholder: "Vos remarques, besoins, questions…",
    ficheConsent: "Autorisation de contact",
    ficheSignature: "Signature (nom pour validation)",
    ficheSubmit: "Envoyer ma fiche",
    ficheFooter: "Votre réponse est envoyée par WhatsApp. Vos données ne transitent par aucun serveur.",
    ficheStructure: "Structure / Organisation",
    ficheFonction: "Fonction",
    errFichePhone: "Votre téléphone est requis.",
    errConsent: "Merci de cocher l'autorisation de contact.",
  },
  en: {
    poweredBy: "Powered by Atelier · no data is sent to any server",
    landingTitle: "Atelier Portal",
    landingDesc: "This link is incomplete. Open the exact link that was shared with you.",
    insTitle: (org) => `Registration — ${org}`,
    insSubtitle: "Fill in this form and send: your registration will be sent via WhatsApp.",
    insName: "Full name *",
    insPhone: "Phone",
    insEmail: "Email",
    insCity: "City",
    insMemberType: "Membership type",
    insSubmit: "Send my registration",
    errName: "Your name is required.",
    errBadLink: "Misconfigured link (missing number).",
    accFrom: (org) => `Proposal from ${org}`,
    accRef: "Reference",
    accAmount: "Amount",
    accValidity: (d) => `Offer valid for ${d} days`,
    accNameLabel: "Your name (acceptance)",
    accSubmit: "I accept this proposal",
    accFooter: "Your acceptance is sent to the provider via WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Hello ${org},\n\nI accept the proposal "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, amount ${amount}` : ""}.\nAgreed — ${name}, ${date}.`,
    errAccName: "Please enter your name to confirm.",
    ficheCoords: "Your contact details",
    ficheNamePhone: "Phone *",
    ficheInterests: "What interests you",
    ficheRecontact: "Best way to reach you",
    ficheNotes: "Notes / questions",
    ficheNotesPlaceholder: "Your remarks, needs, questions…",
    ficheConsent: "Contact authorization",
    ficheSignature: "Signature (name for validation)",
    ficheSubmit: "Send my form",
    ficheFooter: "Your response is sent via WhatsApp. Your data does not transit through any server.",
    ficheStructure: "Organisation / Company",
    ficheFonction: "Role / Position",
    errFichePhone: "Your phone number is required.",
    errConsent: "Please check the contact authorization.",
  },
  es: {
    poweredBy: "Desarrollado por Atelier · ningún dato se envía a un servidor",
    landingTitle: "Portal Atelier",
    landingDesc: "Este enlace está incompleto. Abra el enlace exacto que le compartieron.",
    insTitle: (org) => `Inscripción — ${org}`,
    insSubtitle: "Rellene este formulario y envíe: su inscripción se enviará por WhatsApp.",
    insName: "Nombre completo *",
    insPhone: "Teléfono",
    insEmail: "Correo electrónico",
    insCity: "Ciudad",
    insMemberType: "Tipo de membresía",
    insSubmit: "Enviar mi inscripción",
    errName: "Su nombre es obligatorio.",
    errBadLink: "Enlace mal configurado (número faltante).",
    accFrom: (org) => `Propuesta de ${org}`,
    accRef: "Referencia",
    accAmount: "Importe",
    accValidity: (d) => `Oferta válida por ${d} días`,
    accNameLabel: "Su nombre (aceptación)",
    accSubmit: "Acepto esta propuesta",
    accFooter: "Su aceptación se envía al proveedor por WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Hola ${org},\n\nAcepto la propuesta "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, importe ${amount}` : ""}.\nConfirmado — ${name}, ${date}.`,
    errAccName: "Indique su nombre para confirmar.",
    ficheCoords: "Sus datos de contacto",
    ficheNamePhone: "Teléfono *",
    ficheInterests: "Lo que le interesa",
    ficheRecontact: "Mejor forma de contactarle",
    ficheNotes: "Notas / preguntas",
    ficheNotesPlaceholder: "Sus comentarios, necesidades, preguntas…",
    ficheConsent: "Autorización de contacto",
    ficheSignature: "Firma (nombre para validación)",
    ficheSubmit: "Enviar mi ficha",
    ficheFooter: "Su respuesta se envía por WhatsApp. Sus datos no pasan por ningún servidor.",
    ficheStructure: "Organización / Empresa",
    ficheFonction: "Cargo / Función",
    errFichePhone: "Su número de teléfono es obligatorio.",
    errConsent: "Por favor marque la autorización de contacto.",
  },
  ar: {
    poweredBy: "مدعوم بواسطة Atelier · لا يُرسَل أي بيانات إلى خادم",
    landingTitle: "بوابة Atelier",
    landingDesc: "هذا الرابط غير مكتمل. افتح الرابط الدقيق الذي تمت مشاركته معك.",
    insTitle: (org) => `التسجيل — ${org}`,
    insSubtitle: "أكمل هذا النموذج وأرسله: سيتم إرسال تسجيلك عبر واتساب.",
    insName: "الاسم الكامل *",
    insPhone: "الهاتف",
    insEmail: "البريد الإلكتروني",
    insCity: "المدينة",
    insMemberType: "نوع العضوية",
    insSubmit: "إرسال طلب التسجيل",
    errName: "الاسم مطلوب.",
    errBadLink: "رابط غير صحيح (رقم مفقود).",
    accFrom: (org) => `عرض من ${org}`,
    accRef: "المرجع",
    accAmount: "المبلغ",
    accValidity: (d) => `العرض صالح لـ ${d} أيام`,
    accNameLabel: "اسمك (للموافقة)",
    accSubmit: "أقبل هذا العرض",
    accFooter: "تُرسَل موافقتك إلى مقدم الخدمة عبر واتساب.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `مرحباً ${org},\n\nأقبل العرض "${title}"${num ? ` (مرجع: ${num})` : ""}${amount ? `، المبلغ ${amount}` : ""}.\nموافق — ${name}، ${date}.`,
    errAccName: "يُرجى إدخال اسمك للتأكيد.",
    ficheCoords: "بيانات الاتصال",
    ficheNamePhone: "الهاتف *",
    ficheInterests: "اهتماماتك",
    ficheRecontact: "أفضل طريقة للتواصل معك",
    ficheNotes: "ملاحظات / أسئلة",
    ficheNotesPlaceholder: "ملاحظاتك واحتياجاتك وأسئلتك…",
    ficheConsent: "إذن الاتصال",
    ficheSignature: "التوقيع (الاسم للتحقق)",
    ficheSubmit: "إرسال البيانات",
    ficheFooter: "يُرسَل ردك عبر واتساب. بياناتك لا تمر عبر أي خادم.",
    ficheStructure: "المنظمة / الشركة",
    ficheFonction: "المنصب / الوظيفة",
    errFichePhone: "رقم الهاتف مطلوب.",
    errConsent: "يُرجى تحديد خانة إذن الاتصال.",
  },
  pt: {
    poweredBy: "Desenvolvido por Atelier · nenhum dado é enviado a um servidor",
    landingTitle: "Portal Atelier",
    landingDesc: "Este link está incompleto. Abra o link exato que foi partilhado consigo.",
    insTitle: (org) => `Inscrição — ${org}`,
    insSubtitle: "Preencha este formulário e envie: a sua inscrição será enviada pelo WhatsApp.",
    insName: "Nome completo *",
    insPhone: "Telefone",
    insEmail: "E-mail",
    insCity: "Cidade",
    insMemberType: "Tipo de adesão",
    insSubmit: "Enviar a minha inscrição",
    errName: "O seu nome é obrigatório.",
    errBadLink: "Link mal configurado (número em falta).",
    accFrom: (org) => `Proposta de ${org}`,
    accRef: "Referência",
    accAmount: "Montante",
    accValidity: (d) => `Oferta válida por ${d} dias`,
    accNameLabel: "O seu nome (aceitação)",
    accSubmit: "Aceito esta proposta",
    accFooter: "A sua aceitação é enviada ao prestador pelo WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Olá ${org},\n\nAceito a proposta "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, montante ${amount}` : ""}.\nConfirmado — ${name}, ${date}.`,
    errAccName: "Indique o seu nome para confirmar.",
    ficheCoords: "Os seus dados de contacto",
    ficheNamePhone: "Telefone *",
    ficheInterests: "O que lhe interessa",
    ficheRecontact: "Melhor forma de o contactar",
    ficheNotes: "Notas / perguntas",
    ficheNotesPlaceholder: "Os seus comentários, necessidades, perguntas…",
    ficheConsent: "Autorização de contacto",
    ficheSignature: "Assinatura (nome para validação)",
    ficheSubmit: "Enviar o meu formulário",
    ficheFooter: "A sua resposta é enviada pelo WhatsApp. Os seus dados não passam por nenhum servidor.",
    ficheStructure: "Organização / Empresa",
    ficheFonction: "Cargo / Função",
    errFichePhone: "O seu número de telefone é obrigatório.",
    errConsent: "Por favor, marque a autorização de contacto.",
  },
  de: {
    poweredBy: "Unterstützt von Atelier · keine Daten werden an einen Server gesendet",
    landingTitle: "Atelier-Portal",
    landingDesc: "Dieser Link ist unvollständig. Öffnen Sie den genauen Link, der mit Ihnen geteilt wurde.",
    insTitle: (org) => `Registrierung — ${org}`,
    insSubtitle: "Füllen Sie dieses Formular aus und senden Sie es ab: Ihre Anmeldung wird per WhatsApp gesendet.",
    insName: "Vollständiger Name *",
    insPhone: "Telefon",
    insEmail: "E-Mail",
    insCity: "Stadt",
    insMemberType: "Mitgliedschaftstyp",
    insSubmit: "Meine Anmeldung senden",
    errName: "Ihr Name ist erforderlich.",
    errBadLink: "Link falsch konfiguriert (Nummer fehlt).",
    accFrom: (org) => `Angebot von ${org}`,
    accRef: "Referenz",
    accAmount: "Betrag",
    accValidity: (d) => `Angebot gültig für ${d} Tage`,
    accNameLabel: "Ihr Name (Annahme)",
    accSubmit: "Ich akzeptiere dieses Angebot",
    accFooter: "Ihre Annahme wird per WhatsApp an den Anbieter gesendet.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Hallo ${org},\n\nIch akzeptiere das Angebot „${title}"${num ? ` (Ref. ${num})` : ""}${amount ? `, Betrag ${amount}` : ""}.\nBestätigt — ${name}, ${date}.`,
    errAccName: "Bitte geben Sie Ihren Namen zur Bestätigung ein.",
    ficheCoords: "Ihre Kontaktdaten",
    ficheNamePhone: "Telefon *",
    ficheInterests: "Was Sie interessiert",
    ficheRecontact: "Beste Kontaktmöglichkeit",
    ficheNotes: "Notizen / Fragen",
    ficheNotesPlaceholder: "Ihre Anmerkungen, Bedürfnisse, Fragen…",
    ficheConsent: "Kontakterlaubnis",
    ficheSignature: "Unterschrift (Name zur Bestätigung)",
    ficheSubmit: "Mein Formular senden",
    ficheFooter: "Ihre Antwort wird per WhatsApp gesendet. Ihre Daten werden nicht über einen Server übertragen.",
    ficheStructure: "Organisation / Unternehmen",
    ficheFonction: "Position / Funktion",
    errFichePhone: "Ihre Telefonnummer ist erforderlich.",
    errConsent: "Bitte bestätigen Sie die Kontakterlaubnis.",
  },
  zh: {
    poweredBy: "由 Atelier 提供支持 · 不向任何服务器发送数据",
    landingTitle: "Atelier 门户",
    landingDesc: "此链接不完整。请打开与您共享的确切链接。",
    insTitle: (org) => `注册 — ${org}`,
    insSubtitle: "填写此表格并发送：您的注册信息将通过 WhatsApp 发送。",
    insName: "全名 *",
    insPhone: "电话",
    insEmail: "电子邮件",
    insCity: "城市",
    insMemberType: "会员类型",
    insSubmit: "发送我的注册",
    errName: "您的姓名是必填项。",
    errBadLink: "链接配置错误（缺少号码）。",
    accFrom: (org) => `来自 ${org} 的提案`,
    accRef: "参考编号",
    accAmount: "金额",
    accValidity: (d) => `优惠有效期 ${d} 天`,
    accNameLabel: "您的姓名（确认接受）",
    accSubmit: "我接受此提案",
    accFooter: "您的接受确认将通过 WhatsApp 发送给服务提供商。",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `您好 ${org}，\n\n我接受提案"${title}"${num ? `（参考编号：${num}）` : ""}${amount ? `，金额 ${amount}` : ""}。\n确认同意 — ${name}，${date}。`,
    errAccName: "请输入您的姓名以确认。",
    ficheCoords: "您的联系信息",
    ficheNamePhone: "电话 *",
    ficheInterests: "您感兴趣的内容",
    ficheRecontact: "最佳联系方式",
    ficheNotes: "备注 / 问题",
    ficheNotesPlaceholder: "您的备注、需求、问题…",
    ficheConsent: "联系授权",
    ficheSignature: "签名（验证用姓名）",
    ficheSubmit: "发送我的表格",
    ficheFooter: "您的回复通过 WhatsApp 发送。您的数据不经过任何服务器。",
    ficheStructure: "组织 / 公司",
    ficheFonction: "职位 / 职能",
    errFichePhone: "您的电话号码是必填项。",
    errConsent: "请勾选联系授权。",
  },
  ja: {
    poweredBy: "Atelier が提供 · データはいかなるサーバーにも送信されません",
    landingTitle: "Atelier ポータル",
    landingDesc: "このリンクは不完全です。共有された正確なリンクを開いてください。",
    insTitle: (org) => `登録 — ${org}`,
    insSubtitle: "このフォームに記入して送信してください。登録内容は WhatsApp で送信されます。",
    insName: "氏名 *",
    insPhone: "電話番号",
    insEmail: "メールアドレス",
    insCity: "都市",
    insMemberType: "会員種別",
    insSubmit: "登録を送信する",
    errName: "お名前は必須です。",
    errBadLink: "リンクの設定が正しくありません（番号が不足）。",
    accFrom: (org) => `${org} からの提案`,
    accRef: "参照番号",
    accAmount: "金額",
    accValidity: (d) => `オファーは ${d} 日間有効`,
    accNameLabel: "お名前（承認用）",
    accSubmit: "この提案に同意します",
    accFooter: "承認内容は WhatsApp でプロバイダーに送信されます。",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `${org} 様、\n\n提案「${title}」${num ? `（参照番号：${num}）` : ""}${amount ? `、金額 ${amount}` : ""}に同意します。\n承認 — ${name}、${date}`,
    errAccName: "確認のためお名前を入力してください。",
    ficheCoords: "連絡先情報",
    ficheNamePhone: "電話番号 *",
    ficheInterests: "ご興味のある内容",
    ficheRecontact: "ご連絡の希望方法",
    ficheNotes: "メモ / ご質問",
    ficheNotesPlaceholder: "ご意見、ご要望、ご質問…",
    ficheConsent: "連絡承認",
    ficheSignature: "署名（確認用氏名）",
    ficheSubmit: "フォームを送信する",
    ficheFooter: "回答は WhatsApp で送信されます。データはサーバーを経由しません。",
    ficheStructure: "組織 / 会社",
    ficheFonction: "役職 / 職務",
    errFichePhone: "電話番号は必須です。",
    errConsent: "連絡承認にチェックを入れてください。",
  },
  it: {
    poweredBy: "Sviluppato da Atelier · nessun dato viene inviato a un server",
    landingTitle: "Portale Atelier",
    landingDesc: "Questo link è incompleto. Apri il link esatto che ti è stato condiviso.",
    insTitle: (org) => `Iscrizione — ${org}`,
    insSubtitle: "Compila questo modulo e invia: la tua iscrizione verrà inviata tramite WhatsApp.",
    insName: "Nome completo *",
    insPhone: "Telefono",
    insEmail: "E-mail",
    insCity: "Città",
    insMemberType: "Tipo di iscrizione",
    insSubmit: "Invia la mia iscrizione",
    errName: "Il tuo nome è obbligatorio.",
    errBadLink: "Link mal configurato (numero mancante).",
    accFrom: (org) => `Proposta di ${org}`,
    accRef: "Riferimento",
    accAmount: "Importo",
    accValidity: (d) => `Offerta valida per ${d} giorni`,
    accNameLabel: "Il tuo nome (accettazione)",
    accSubmit: "Accetto questa proposta",
    accFooter: "La tua accettazione viene inviata al fornitore tramite WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Salve ${org},\n\nAccetto la proposta "${title}"${num ? ` (rif. ${num})` : ""}${amount ? `, importo ${amount}` : ""}.\nConfermato — ${name}, ${date}.`,
    errAccName: "Inserisci il tuo nome per confermare.",
    ficheCoords: "I tuoi dati di contatto",
    ficheNamePhone: "Telefono *",
    ficheInterests: "Cosa ti interessa",
    ficheRecontact: "Miglior modo per ricontattarti",
    ficheNotes: "Note / domande",
    ficheNotesPlaceholder: "Le tue osservazioni, esigenze, domande…",
    ficheConsent: "Autorizzazione al contatto",
    ficheSignature: "Firma (nome per la validazione)",
    ficheSubmit: "Invia il mio modulo",
    ficheFooter: "La tua risposta viene inviata tramite WhatsApp. I tuoi dati non transitano per alcun server.",
    ficheStructure: "Organizzazione / Azienda",
    ficheFonction: "Ruolo / Funzione",
    errFichePhone: "Il tuo numero di telefono è obbligatorio.",
    errConsent: "Si prega di spuntare l'autorizzazione al contatto.",
  },
  ru: {
    poweredBy: "Работает на Atelier · данные не отправляются на сервер",
    landingTitle: "Портал Atelier",
    landingDesc: "Эта ссылка неполная. Откройте точную ссылку, которой с вами поделились.",
    insTitle: (org) => `Регистрация — ${org}`,
    insSubtitle: "Заполните эту форму и отправьте: ваша заявка будет отправлена через WhatsApp.",
    insName: "Полное имя *",
    insPhone: "Телефон",
    insEmail: "Электронная почта",
    insCity: "Город",
    insMemberType: "Тип членства",
    insSubmit: "Отправить заявку",
    errName: "Ваше имя обязательно.",
    errBadLink: "Ссылка настроена неверно (номер отсутствует).",
    accFrom: (org) => `Предложение от ${org}`,
    accRef: "Номер",
    accAmount: "Сумма",
    accValidity: (d) => `Предложение действительно ${d} дней`,
    accNameLabel: "Ваше имя (подтверждение)",
    accSubmit: "Принимаю это предложение",
    accFooter: "Ваше согласие отправляется поставщику через WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Здравствуйте, ${org},\n\nПринимаю предложение «${title}»${num ? ` (реф. ${num})` : ""}${amount ? `, сумма ${amount}` : ""}.\nПодтверждено — ${name}, ${date}.`,
    errAccName: "Пожалуйста, введите ваше имя для подтверждения.",
    ficheCoords: "Ваши контактные данные",
    ficheNamePhone: "Телефон *",
    ficheInterests: "Что вас интересует",
    ficheRecontact: "Предпочтительный способ связи",
    ficheNotes: "Заметки / вопросы",
    ficheNotesPlaceholder: "Ваши замечания, потребности, вопросы…",
    ficheConsent: "Разрешение на контакт",
    ficheSignature: "Подпись (имя для подтверждения)",
    ficheSubmit: "Отправить форму",
    ficheFooter: "Ваш ответ отправляется через WhatsApp. Ваши данные не проходят через серверы.",
    ficheStructure: "Организация / Компания",
    ficheFonction: "Должность / Роль",
    errFichePhone: "Ваш номер телефона обязателен.",
    errConsent: "Пожалуйста, отметьте разрешение на контакт.",
  },
  tr: {
    poweredBy: "Atelier tarafından desteklenmektedir · hiçbir veri sunucuya gönderilmez",
    landingTitle: "Atelier Portalı",
    landingDesc: "Bu bağlantı eksik. Sizinle paylaşılan tam bağlantıyı açın.",
    insTitle: (org) => `Kayıt — ${org}`,
    insSubtitle: "Bu formu doldurun ve gönderin: kaydınız WhatsApp üzerinden gönderilecektir.",
    insName: "Ad Soyad *",
    insPhone: "Telefon",
    insEmail: "E-posta",
    insCity: "Şehir",
    insMemberType: "Üyelik türü",
    insSubmit: "Kaydımı gönder",
    errName: "Adınız zorunludur.",
    errBadLink: "Bağlantı yanlış yapılandırılmış (numara eksik).",
    accFrom: (org) => `${org} teklifiniz`,
    accRef: "Referans",
    accAmount: "Tutar",
    accValidity: (d) => `Teklif ${d} gün geçerlidir`,
    accNameLabel: "Adınız (onay için)",
    accSubmit: "Bu teklifi kabul ediyorum",
    accFooter: "Kabulünüz WhatsApp ile sağlayıcıya gönderilir.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Merhaba ${org},\n\n"${title}" teklifini${num ? ` (ref. ${num})` : ""} kabul ediyorum${amount ? `, tutar ${amount}` : ""}.\nOnaylandı — ${name}, ${date}.`,
    errAccName: "Onaylamak için adınızı girin.",
    ficheCoords: "İletişim bilgileriniz",
    ficheNamePhone: "Telefon *",
    ficheInterests: "İlginizi çeken konular",
    ficheRecontact: "En iyi iletişim yöntemi",
    ficheNotes: "Notlar / sorular",
    ficheNotesPlaceholder: "Yorumlarınız, ihtiyaçlarınız, sorularınız…",
    ficheConsent: "İletişim izni",
    ficheSignature: "İmza (doğrulama için ad)",
    ficheSubmit: "Formumu gönder",
    ficheFooter: "Yanıtınız WhatsApp ile gönderilir. Verileriniz hiçbir sunucudan geçmez.",
    ficheStructure: "Kuruluş / Şirket",
    ficheFonction: "Pozisyon / Görev",
    errFichePhone: "Telefon numaranız zorunludur.",
    errConsent: "Lütfen iletişim iznini işaretleyin.",
  },
  hi: {
    poweredBy: "Atelier द्वारा संचालित · कोई डेटा किसी सर्वर को नहीं भेजा जाता",
    landingTitle: "Atelier पोर्टल",
    landingDesc: "यह लिंक अधूरा है। आपके साथ साझा किया गया सटीक लिंक खोलें।",
    insTitle: (org) => `पंजीकरण — ${org}`,
    insSubtitle: "यह फ़ॉर्म भरें और भेजें: आपका पंजीकरण WhatsApp के माध्यम से भेजा जाएगा।",
    insName: "पूरा नाम *",
    insPhone: "फ़ोन",
    insEmail: "ईमेल",
    insCity: "शहर",
    insMemberType: "सदस्यता प्रकार",
    insSubmit: "मेरा पंजीकरण भेजें",
    errName: "आपका नाम आवश्यक है।",
    errBadLink: "लिंक गलत तरीके से कॉन्फ़िगर किया गया (नंबर गायब)।",
    accFrom: (org) => `${org} का प्रस्ताव`,
    accRef: "संदर्भ",
    accAmount: "राशि",
    accValidity: (d) => `${d} दिनों के लिए वैध ऑफ़र`,
    accNameLabel: "आपका नाम (स्वीकृति के लिए)",
    accSubmit: "मैं यह प्रस्ताव स्वीकार करता/करती हूँ",
    accFooter: "आपकी स्वीकृति WhatsApp के माध्यम से प्रदाता को भेजी जाती है।",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `नमस्ते ${org},\n\nमैं प्रस्ताव "${title}"${num ? ` (संदर्भ: ${num})` : ""}${amount ? `, राशि ${amount}` : ""} स्वीकार करता/करती हूँ।\nपुष्टि — ${name}, ${date}.`,
    errAccName: "पुष्टि करने के लिए अपना नाम दर्ज करें।",
    ficheCoords: "आपकी संपर्क जानकारी",
    ficheNamePhone: "फ़ोन *",
    ficheInterests: "आपकी रुचि",
    ficheRecontact: "संपर्क का सर्वोत्तम तरीका",
    ficheNotes: "नोट्स / प्रश्न",
    ficheNotesPlaceholder: "आपकी टिप्पणियाँ, जरूरतें, प्रश्न…",
    ficheConsent: "संपर्क अनुमति",
    ficheSignature: "हस्ताक्षर (सत्यापन के लिए नाम)",
    ficheSubmit: "मेरा फ़ॉर्म भेजें",
    ficheFooter: "आपका जवाब WhatsApp के माध्यम से भेजा जाता है। आपका डेटा किसी सर्वर से नहीं गुजरता।",
    ficheStructure: "संगठन / कंपनी",
    ficheFonction: "पद / कार्य",
    errFichePhone: "आपका फ़ोन नंबर आवश्यक है।",
    errConsent: "कृपया संपर्क अनुमति चेक करें।",
  },
  nl: {
    poweredBy: "Aangedreven door Atelier · geen gegevens worden naar een server verzonden",
    landingTitle: "Atelier Portaal",
    landingDesc: "Deze link is onvolledig. Open de exacte link die met u is gedeeld.",
    insTitle: (org) => `Inschrijving — ${org}`,
    insSubtitle: "Vul dit formulier in en verzend het: uw inschrijving wordt via WhatsApp verzonden.",
    insName: "Volledige naam *",
    insPhone: "Telefoon",
    insEmail: "E-mail",
    insCity: "Stad",
    insMemberType: "Lidmaatschapstype",
    insSubmit: "Mijn inschrijving verzenden",
    errName: "Uw naam is vereist.",
    errBadLink: "Link onjuist geconfigureerd (nummer ontbreekt).",
    accFrom: (org) => `Voorstel van ${org}`,
    accRef: "Referentie",
    accAmount: "Bedrag",
    accValidity: (d) => `Aanbieding geldig voor ${d} dagen`,
    accNameLabel: "Uw naam (acceptatie)",
    accSubmit: "Ik accepteer dit voorstel",
    accFooter: "Uw acceptatie wordt via WhatsApp naar de provider verzonden.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Hallo ${org},\n\nIk accepteer het voorstel "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, bedrag ${amount}` : ""}.\nAkkoord — ${name}, ${date}.`,
    errAccName: "Voer uw naam in ter bevestiging.",
    ficheCoords: "Uw contactgegevens",
    ficheNamePhone: "Telefoon *",
    ficheInterests: "Wat u interesseert",
    ficheRecontact: "Beste contactmogelijkheid",
    ficheNotes: "Notities / vragen",
    ficheNotesPlaceholder: "Uw opmerkingen, behoeften, vragen…",
    ficheConsent: "Contacttoestemming",
    ficheSignature: "Handtekening (naam voor validatie)",
    ficheSubmit: "Mijn formulier verzenden",
    ficheFooter: "Uw antwoord wordt via WhatsApp verzonden. Uw gegevens passeren geen server.",
    ficheStructure: "Organisatie / Bedrijf",
    ficheFonction: "Functie / Rol",
    errFichePhone: "Uw telefoonnummer is vereist.",
    errConsent: "Vink de contacttoestemming aan.",
  },
  pl: {
    poweredBy: "Obsługiwane przez Atelier · żadne dane nie są wysyłane na serwer",
    landingTitle: "Portal Atelier",
    landingDesc: "Ten link jest niekompletny. Otwórz dokładny link, który został Ci udostępniony.",
    insTitle: (org) => `Rejestracja — ${org}`,
    insSubtitle: "Wypełnij ten formularz i wyślij: Twoja rejestracja zostanie wysłana przez WhatsApp.",
    insName: "Pełne imię i nazwisko *",
    insPhone: "Telefon",
    insEmail: "E-mail",
    insCity: "Miasto",
    insMemberType: "Typ członkostwa",
    insSubmit: "Wyślij moją rejestrację",
    errName: "Twoje imię jest wymagane.",
    errBadLink: "Nieprawidłowy link (brakujący numer).",
    accFrom: (org) => `Oferta od ${org}`,
    accRef: "Numer referencyjny",
    accAmount: "Kwota",
    accValidity: (d) => `Oferta ważna przez ${d} dni`,
    accNameLabel: "Twoje imię (akceptacja)",
    accSubmit: "Akceptuję tę ofertę",
    accFooter: "Twoja akceptacja jest wysyłana do dostawcy przez WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Dzień dobry ${org},\n\nAkceptuję ofertę "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, kwota ${amount}` : ""}.\nZatwierdzone — ${name}, ${date}.`,
    errAccName: "Proszę wpisać swoje imię w celu potwierdzenia.",
    ficheCoords: "Twoje dane kontaktowe",
    ficheNamePhone: "Telefon *",
    ficheInterests: "Co Cię interesuje",
    ficheRecontact: "Najlepszy sposób kontaktu",
    ficheNotes: "Notatki / pytania",
    ficheNotesPlaceholder: "Twoje uwagi, potrzeby, pytania…",
    ficheConsent: "Zgoda na kontakt",
    ficheSignature: "Podpis (imię do weryfikacji)",
    ficheSubmit: "Wyślij mój formularz",
    ficheFooter: "Twoja odpowiedź jest wysyłana przez WhatsApp. Twoje dane nie przechodzą przez żaden serwer.",
    ficheStructure: "Organizacja / Firma",
    ficheFonction: "Stanowisko / Funkcja",
    errFichePhone: "Twój numer telefonu jest wymagany.",
    errConsent: "Proszę zaznaczyć zgodę na kontakt.",
  },
  ko: {
    poweredBy: "Atelier 제공 · 어떤 서버에도 데이터가 전송되지 않습니다",
    landingTitle: "Atelier 포털",
    landingDesc: "이 링크는 불완전합니다. 공유된 정확한 링크를 여세요.",
    insTitle: (org) => `등록 — ${org}`,
    insSubtitle: "이 양식을 작성하여 전송하세요: 등록 내용이 WhatsApp으로 전송됩니다.",
    insName: "성명 *",
    insPhone: "전화번호",
    insEmail: "이메일",
    insCity: "도시",
    insMemberType: "회원 유형",
    insSubmit: "등록 신청 전송",
    errName: "이름을 입력해 주세요.",
    errBadLink: "링크 설정 오류 (번호 누락).",
    accFrom: (org) => `${org}의 제안`,
    accRef: "참조 번호",
    accAmount: "금액",
    accValidity: (d) => `${d}일 유효한 제안`,
    accNameLabel: "성명 (수락 확인용)",
    accSubmit: "이 제안을 수락합니다",
    accFooter: "수락 내용이 WhatsApp으로 제공자에게 전송됩니다.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `안녕하세요 ${org},\n\n제안서 "${title}"${num ? ` (참조: ${num})` : ""}${amount ? `, 금액 ${amount}` : ""}을(를) 수락합니다.\n확인 — ${name}, ${date}.`,
    errAccName: "확인을 위해 성명을 입력해 주세요.",
    ficheCoords: "연락처 정보",
    ficheNamePhone: "전화번호 *",
    ficheInterests: "관심 분야",
    ficheRecontact: "최선의 연락 방법",
    ficheNotes: "메모 / 질문",
    ficheNotesPlaceholder: "의견, 필요 사항, 질문…",
    ficheConsent: "연락 동의",
    ficheSignature: "서명 (확인용 성명)",
    ficheSubmit: "양식 전송",
    ficheFooter: "답변이 WhatsApp으로 전송됩니다. 데이터는 서버를 거치지 않습니다.",
    ficheStructure: "조직 / 회사",
    ficheFonction: "직위 / 직무",
    errFichePhone: "전화번호를 입력해 주세요.",
    errConsent: "연락 동의에 체크해 주세요.",
  },
  id: {
    poweredBy: "Didukung oleh Atelier · tidak ada data yang dikirim ke server",
    landingTitle: "Portal Atelier",
    landingDesc: "Tautan ini tidak lengkap. Buka tautan yang tepat yang telah dibagikan kepada Anda.",
    insTitle: (org) => `Pendaftaran — ${org}`,
    insSubtitle: "Isi formulir ini dan kirim: pendaftaran Anda akan dikirim melalui WhatsApp.",
    insName: "Nama lengkap *",
    insPhone: "Telepon",
    insEmail: "Email",
    insCity: "Kota",
    insMemberType: "Jenis keanggotaan",
    insSubmit: "Kirim pendaftaran saya",
    errName: "Nama Anda wajib diisi.",
    errBadLink: "Tautan salah dikonfigurasi (nomor tidak ada).",
    accFrom: (org) => `Penawaran dari ${org}`,
    accRef: "Referensi",
    accAmount: "Jumlah",
    accValidity: (d) => `Penawaran berlaku ${d} hari`,
    accNameLabel: "Nama Anda (penerimaan)",
    accSubmit: "Saya menerima penawaran ini",
    accFooter: "Penerimaan Anda dikirim ke penyedia melalui WhatsApp.",
    accMsg: (org: string, title: string, num: string, amount: string, name: string, date: string) =>
      `Halo ${org},\n\nSaya menerima penawaran "${title}"${num ? ` (ref. ${num})` : ""}${amount ? `, jumlah ${amount}` : ""}.\nDisetujui — ${name}, ${date}.`,
    errAccName: "Masukkan nama Anda untuk mengonfirmasi.",
    ficheCoords: "Informasi kontak Anda",
    ficheNamePhone: "Telepon *",
    ficheInterests: "Yang menarik minat Anda",
    ficheRecontact: "Cara terbaik menghubungi Anda",
    ficheNotes: "Catatan / pertanyaan",
    ficheNotesPlaceholder: "Komentar, kebutuhan, pertanyaan Anda…",
    ficheConsent: "Izin kontak",
    ficheSignature: "Tanda tangan (nama untuk validasi)",
    ficheSubmit: "Kirim formulir saya",
    ficheFooter: "Jawaban Anda dikirim melalui WhatsApp. Data Anda tidak melewati server mana pun.",
    ficheStructure: "Organisasi / Perusahaan",
    ficheFonction: "Jabatan / Fungsi",
    errFichePhone: "Nomor telepon Anda wajib diisi.",
    errConsent: "Harap centang izin kontak.",
  },
};

type I18n = typeof T["fr"];

// ── URL helpers ───────────────────────────────────────────────────────────────

function useParams() {
  return useMemo(() => new URLSearchParams(location.search), []);
}

function useLang(params: URLSearchParams): I18n {
  const code = (params.get("lang") ?? "fr") as LangCode;
  return T[code] ?? T.fr;
}

function b64urlEncode(obj: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function b64urlDecode<T>(s: string): T {
  return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))))) as T;
}

interface FormConfig {
  title: string;
  subtitle?: string;
  interests: string[];
  recontact: string[];
  askStructure: boolean;
  consentText: string;
}

export default function App() {
  const p = useParams();
  const i18n = useLang(p);
  const v = p.get("v");
  const accent = "#" + (p.get("accent")?.replace("#", "") || "2563eb");
  const isRTL = (p.get("lang") ?? "fr") === "ar";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto w-full max-w-md">
        {v === "inscription" ? (
          <Inscription params={p} accent={accent} i18n={i18n} />
        ) : v === "accept" ? (
          <Accept params={p} accent={accent} i18n={i18n} />
        ) : v === "fiche" ? (
          <Fiche params={p} accent={accent} i18n={i18n} />
        ) : (
          <Landing i18n={i18n} accent={accent} />
        )}
        <p className="mt-6 text-center text-xs text-slate-400">{i18n.poweredBy}</p>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-white p-6 shadow-sm">{children}</div>;
}

function Landing({ i18n, accent }: { i18n: I18n; accent: string }) {
  return (
    <Card>
      <h1 className="text-lg font-bold" style={{ color: accent }}>{i18n.landingTitle}</h1>
      <p className="mt-2 text-sm text-slate-500">{i18n.landingDesc}</p>
    </Card>
  );
}

// ── Inscription ───────────────────────────────────────────────────────────────

function Inscription({ params, accent, i18n }: { params: URLSearchParams; accent: string; i18n: I18n }) {
  const org = params.get("org") || "l'organisation";
  const to = params.get("to") || "";
  const types = (params.get("types") || "Mensuel,Trimestriel,Annuel")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const [f, setF] = useState({ name: "", phone: "", email: "", city: "", type: types[0] || "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, val: string) => setF((s) => ({ ...s, [k]: val }));

  function submit() {
    if (!f.name.trim()) return setErr(i18n.errName);
    if (!to) return setErr(i18n.errBadLink);
    const msg =
      `Nouvelle inscription — ${org}\n\n` +
      `Nom : ${f.name}\n` +
      (f.phone ? `Téléphone : ${f.phone}\n` : "") +
      (f.email ? `Email : ${f.email}\n` : "") +
      (f.city ? `Ville : ${f.city}\n` : "") +
      (f.type ? `Type d'adhésion : ${f.type}\n` : "");
    window.location.href = whatsappLink(to, msg);
  }

  return (
    <Card>
      <h1 className="text-lg font-bold" style={{ color: accent }}>{i18n.insTitle(org)}</h1>
      <p className="mt-1 text-sm text-slate-500">{i18n.insSubtitle}</p>

      <div className="mt-4 grid gap-3">
        <Field label={i18n.insName} value={f.name} onChange={(v) => set("name", v)} />
        <Field label={i18n.insPhone} value={f.phone} onChange={(v) => set("phone", v)} type="tel" />
        <Field label={i18n.insEmail} value={f.email} onChange={(v) => set("email", v)} type="email" />
        <Field label={i18n.insCity} value={f.city} onChange={(v) => set("city", v)} />
        {types.length > 0 && (
          <label className="text-sm">
            {i18n.insMemberType}
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

      <button
        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={submit}
      >
        {i18n.insSubmit}
      </button>
    </Card>
  );
}

// ── Accept ────────────────────────────────────────────────────────────────────

function Accept({ params, accent, i18n }: { params: URLSearchParams; accent: string; i18n: I18n }) {
  const org = params.get("org") || "";
  const to = params.get("to") || "";
  const num = params.get("num") || "";
  const title = params.get("title") || "";
  const cur = (params.get("cur") as Currency) || "XOF";
  const amount = Number(params.get("amount") || "0");
  const days = params.get("days");
  const [name, setName] = useState(params.get("client") || "");
  const [err, setErr] = useState("");

  function accept() {
    if (!name.trim()) return setErr(i18n.errAccName);
    if (!to) return setErr(i18n.errBadLink);
    const langCode = params.get("lang") ?? "fr";
    const date = new Date().toLocaleDateString(langCode === "fr" ? "fr-FR" : langCode === "ar" ? "ar" : "en-GB");
    const msg = i18n.accMsg(org ?? "", title ?? "", num ?? "", amount ? formatMoney(amount, cur) : "", name, date);
    window.location.href = whatsappLink(to, msg);
  }

  return (
    <Card>
      {org && <p className="text-xs uppercase tracking-wide text-slate-400">{i18n.accFrom(org)}</p>}
      <h1 className="mt-1 text-lg font-bold" style={{ color: accent }}>{title}</h1>
      <div className="mt-3 grid gap-1 text-sm text-slate-600">
        {num && <div>{i18n.accRef} : {num}</div>}
        {amount > 0 && (
          <div>
            {i18n.accAmount} : <span className="font-semibold">{formatMoney(amount, cur)}</span>
          </div>
        )}
        {days && <div className="text-slate-400">{i18n.accValidity(days)}</div>}
      </div>

      <label className="mt-4 block text-sm">
        {i18n.accNameLabel}
        <input
          className="mt-1 w-full rounded-lg border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

      <button
        className="mt-5 w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={accept}
      >
        {i18n.accSubmit}
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">{i18n.accFooter}</p>
    </Card>
  );
}

// ── Fiche ─────────────────────────────────────────────────────────────────────

const DEFAULT_CFG: FormConfig = {
  title: "Fiche de renseignement & de contact",
  interests: [
    "Découvrir vos services / produits",
    "Demande de devis / projet",
    "Partenariat / collaboration",
    "Recevoir des informations",
  ],
  recontact: [
    "Je souhaite recevoir des informations sur vos offres.",
    "Je souhaite être recontacté(e) pour un projet.",
    "Je souhaite être informé(e) de vos événements.",
  ],
  askStructure: true,
  consentText:
    "J'accepte que mes coordonnées soient utilisées uniquement afin d'être recontacté(e) dans le cadre des informations et propositions présentées.",
};

function decodeCfg(raw: string | null): FormConfig {
  if (!raw) return DEFAULT_CFG;
  try {
    const d = b64urlDecode<Record<string, unknown>>(raw);
    if ("t" in d || "i" in d) {
      return {
        title: (d.t as string) || DEFAULT_CFG.title,
        subtitle: d.u as string | undefined,
        interests: (d.i as string[]) || [],
        recontact: (d.r as string[]) || [],
        askStructure: d.s !== 0,
        consentText: (d.c as string) || DEFAULT_CFG.consentText,
      };
    }
    return { ...DEFAULT_CFG, ...(d as Partial<FormConfig>) };
  } catch {
    return DEFAULT_CFG;
  }
}

function Fiche({ params, accent, i18n }: { params: URLSearchParams; accent: string; i18n: I18n }) {
  const org = params.get("org") || "";
  const to = params.get("to") || "";
  const app = params.get("app") || "";
  const cfg = useMemo<FormConfig>(() => decodeCfg(params.get("cfg")), [params]);

  const [f, setF] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    structure: "",
    fonction: "",
    notes: "",
    signature: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [recontact, setRecontact] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, val: string) => setF((s) => ({ ...s, [k]: val }));
  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  function submit() {
    if (!f.name.trim()) return setErr(i18n.errName);
    if (!f.phone.trim()) return setErr(i18n.errFichePhone);
    if (!consent) return setErr(i18n.errConsent);
    if (!to) return setErr(i18n.errBadLink);

    const sub = {
      createdAt: Date.now(),
      formTitle: cfg.title,
      name: f.name.trim(),
      phone: f.phone.trim() || undefined,
      email: f.email.trim() || undefined,
      city: f.city.trim() || undefined,
      structure: f.structure.trim() || undefined,
      fonction: f.fonction.trim() || undefined,
      interests,
      recontact,
      notes: f.notes.trim() || undefined,
      signature: f.signature.trim() || undefined,
    };

    const subCompact = {
      a: sub.createdAt,
      ft: sub.formTitle,
      n: sub.name,
      p: sub.phone,
      e: sub.email,
      ct: sub.city,
      st: sub.structure,
      fn: sub.fonction,
      i: sub.interests,
      r: sub.recontact,
      no: sub.notes,
      si: sub.signature,
    };
    const receptionLink = app ? `${app}#reception=${b64urlEncode(subCompact)}` : "";
    const msg =
      `Réponse — ${org || cfg.title}\n` +
      `${sub.name} · ${sub.phone}` +
      (sub.city ? ` · ${sub.city}` : "") +
      (receptionLink ? `\n${receptionLink}` : "");

    window.location.href = whatsappLink(to, msg);
  }

  return (
    <div className="grid gap-4">
      <div className="text-center">
        <h1 className="text-xl font-bold" style={{ color: accent }}>
          {cfg.title}
        </h1>
        {cfg.subtitle && <p className="mt-1 text-sm text-slate-500">{cfg.subtitle}</p>}
        {org && <p className="mt-1 text-xs text-slate-400">{org}</p>}
      </div>

      <Card>
        <SectionTitle n={1} accent={accent}>{i18n.ficheCoords}</SectionTitle>
        <div className="mt-3 grid gap-3">
          <Field label={i18n.insName} value={f.name} onChange={(v) => set("name", v)} />
          <Field label={i18n.ficheNamePhone} value={f.phone} onChange={(v) => set("phone", v)} type="tel" />
          <Field label={i18n.insEmail} value={f.email} onChange={(v) => set("email", v)} type="email" />
          <Field label={i18n.insCity} value={f.city} onChange={(v) => set("city", v)} />
          {cfg.askStructure && (
            <>
              <Field label={i18n.ficheStructure} value={f.structure} onChange={(v) => set("structure", v)} />
              <Field label={i18n.ficheFonction} value={f.fonction} onChange={(v) => set("fonction", v)} />
            </>
          )}
        </div>
      </Card>

      {cfg.interests.length > 0 && (
        <Card>
          <SectionTitle n={2} accent={accent}>{i18n.ficheInterests}</SectionTitle>
          <div className="mt-3 grid gap-2">
            {cfg.interests.map((it) => (
              <Check key={it} label={it} checked={interests.includes(it)} onChange={() => toggle(interests, setInterests, it)} />
            ))}
          </div>
        </Card>
      )}

      {cfg.recontact.length > 0 && (
        <Card>
          <SectionTitle n={3} accent={accent}>{i18n.ficheRecontact}</SectionTitle>
          <div className="mt-3 grid gap-2">
            {cfg.recontact.map((it) => (
              <Check key={it} label={it} checked={recontact.includes(it)} onChange={() => toggle(recontact, setRecontact, it)} />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle n={4} accent={accent}>{i18n.ficheNotes}</SectionTitle>
        <textarea
          className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
          rows={3}
          placeholder={i18n.ficheNotesPlaceholder}
          value={f.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </Card>

      <Card>
        <SectionTitle n={5} accent={accent}>{i18n.ficheConsent}</SectionTitle>
        <label className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>{cfg.consentText}</span>
        </label>
        <div className="mt-3">
          <Field label={i18n.ficheSignature} value={f.signature} onChange={(v) => set("signature", v)} />
        </div>
      </Card>

      {err && <p className="text-center text-sm text-red-500">{err}</p>}

      <button
        className="w-full rounded-xl px-4 py-3 font-semibold text-white"
        style={{ backgroundColor: accent }}
        onClick={submit}
      >
        {i18n.ficheSubmit}
      </button>
      <p className="text-center text-xs text-slate-400">{i18n.ficheFooter}</p>
    </div>
  );
}

function SectionTitle({ n, accent, children }: { n: number; accent: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: accent }}
      >
        {n}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{children}</h2>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        className="mt-1 w-full rounded-lg border px-3 py-2"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
