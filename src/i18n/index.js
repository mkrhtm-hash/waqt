import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const en = {
  nav: { home: 'Home', shop: 'Collection', brands: 'Maisons', compare: 'Compare', appointments: 'Boutiques', account: 'Account', bag: 'Bag', wishlist: 'Wishlist', menu: 'Menu', search: 'Search timepieces…' },
  mega: { heritage: 'Heritage', title: 'The Five Maisons', subtitle: 'Curated from the most coveted houses in horology', viewAll: 'View all timepieces', since: 'Since', featured: 'Featured' },
  trust: { delivery: 'Free insured delivery across the GCC', authentic: '100% authenticity guaranteed', warranty: 'Up to 5-year international warranty', concierge: '24/7 private concierge' },
  hero: {
    eyebrow: 'The MENA Watch Maison',
    title: 'Time, Perfected.',
    subtitle: 'Discover, compare and acquire authentic masterpieces from the five most revered houses in watchmaking — delivered with white-glove care across the Gulf.',
    cta: 'Explore the Collection',
    cta2: 'Book a Private Viewing',
    scroll: 'Scroll',
  },
  stats: { timepieces: 'Timepieces available', clients: 'Distinguished clients', boutiques: 'Boutiques in the region', years: 'Years of expertise' },
  home: {
    maisons: 'The Maisons', maisonsTitle: 'Five houses. One standard.',
    featured: 'Most Wanted', featuredTitle: 'Coveted this season',
    whyEyebrow: 'The WAQT Promise', whyTitle: 'Beyond a purchase — a ceremony.',
    why1: 'Authenticated by Masters', why1d: 'Every piece is inspected by certified watchmakers and arrives with its authenticity certificate.',
    why2: 'Insured White-Glove Delivery', why2d: 'Fully insured, hand-delivered across the GCC within 24–72 hours.',
    why3: 'Private Concierge', why3d: 'A dedicated advisor on WhatsApp, from first enquiry to lifetime servicing.',
    why4: 'VIP Privileges', why4d: 'Silver, Gold and Black tiers unlock allocations, events and priority access.',
    apptEyebrow: 'By Appointment', apptTitle: 'Experience it on your wrist.', apptText: 'Our salons in Dubai, Abu Dhabi, Riyadh, Jeddah, Doha and Kuwait City await you for a private, unhurried viewing — Arabic coffee included.',
    discover: 'Discover the maison',
  },
  seasonal: {
    ramadanEyebrow: 'Ramadan & Eid Gifting', ramadanTitle: 'Gifts of timeless meaning', ramadanText: 'Hand-wrapped in our signature velvet box with a personalised calligraphy card.',
    nationalEyebrow: 'National Day Editions', nationalTitle: 'Celebrate the nation in gold & green', nationalText: 'Limited dials and complimentary engraving for UAE, Saudi, Qatar and Kuwait National Days.',
    cta: 'Shop the edit',
  },
  shop: {
    eyebrow: 'The Collection', title: 'Every timepiece, authenticated.', results: '{{count}} timepieces',
    filters: 'Filters', brand: 'Maison', price: 'Price range', size: 'Case size', material: 'Material', movement: 'Movement', gender: 'For',
    all: 'All', men: 'Men', women: 'Women', clear: 'Clear all', apply: 'Show results',
    sort: 'Sort by', sortWanted: 'Most wanted', sortNew: 'Newest', sortLow: 'Price: low to high', sortHigh: 'Price: high to low',
    emptyTitle: 'No timepieces match', emptyText: 'Try widening your filters — or ask our concierge to source it for you.',
    upTo: 'Up to',
  },
  materials: { steel: 'Steel', gold: 'Gold', platinum: 'Platinum' },
  movements: { automatic: 'Automatic', manual: 'Manual winding', chronograph: 'Chronograph', quartz: 'Quartz' },
  sizes: { small: 'Under 36 mm', medium: '36 – 40 mm', large: 'Over 40 mm' },
  card: { authentic: 'Authenticity Guaranteed', ref: 'Ref.', addBag: 'Add to Bag', compare: 'Compare', new: 'New' },
  product: {
    back: 'Back to collection', addBag: 'Add to Bag', addWish: 'Add to Wishlist', inWish: 'In your Wishlist', book: 'Book a Private Viewing',
    specs: 'Specifications', reference: 'Reference', caseSize: 'Case size', material: 'Material', movement: 'Movement', calibre: 'Calibre',
    water: 'Water resistance', power: 'Power reserve', dial: 'Dial', gender: 'Gender', hours: '{{n}} hours', na: 'N/A (quartz)',
    boxPapers: 'Full Box & Papers', boxPapersD: 'Original presentation box, manuals and warranty card dated at purchase.',
    warranty: '{{n}}-Year International Warranty', warrantyD: 'Honoured at authorised service centres worldwide, plus WAQT lifetime care.',
    certificate: 'Certificate of Authenticity', certificateD: 'Inspected by our master watchmakers and sealed with a serialised WAQT certificate.',
    delivery: 'Free insured express delivery', deliveryD: 'Hand-delivered across the GCC in 24–72 hours.',
    views: { front: 'Front', detail: 'Dial detail', profile: 'Profile', velvet: 'On velvet' },
    zoomHint: 'Hover to zoom · Click to enlarge', related: 'You may also admire', instalments: 'or 4 interest-free payments of {{amount}} with Tabby / Tamara',
    notFound: 'This timepiece has slipped through time', notFoundText: 'It may have been acquired by another collector. Explore similar masterpieces instead.',
    compare: 'Add to Compare', inCompare: 'In Compare',
  },
  compare: {
    eyebrow: 'Side by Side', title: 'Compare timepieces', subtitle: 'Weigh up to three masterpieces against one another.',
    empty: 'Nothing to compare yet', emptyText: 'Add up to three watches from the collection using the compare icon.',
    add: 'Add a watch', remove: 'Remove', price: 'Price', tray: 'Compare ({{n}}/3)', view: 'Compare now', clear: 'Clear',
  },
  bag: {
    title: 'Your Bag', empty: 'Your bag awaits', emptyText: 'A masterpiece is only a few clicks away.', subtotal: 'Subtotal', delivery: 'Insured express delivery',
    free: 'Complimentary', vat: 'VAT (included)', total: 'Total', checkout: 'Proceed to checkout', remove: 'Remove', qty: 'Qty', continue: 'Continue shopping',
    secure: 'Secure, encrypted checkout',
  },
  checkout: {
    title: 'Checkout', contact: 'Contact', name: 'Full name', email: 'Email', phone: 'Mobile number', address: 'Delivery address',
    city: 'City', country: 'Country', street: 'Street, building, apartment', payment: 'Payment method',
    card: 'Credit / Debit card', apple: 'Apple Pay', tabby: 'Tabby — 4 interest-free payments', tamara: 'Tamara — split in 3 or 4',
    cardNumber: 'Card number', expiry: 'MM / YY', cvc: 'CVC', place: 'Place order', placing: 'Securing your order…',
    summary: 'Order summary', insured: 'Fully insured, signature-on-delivery', required: 'Please complete all required fields.',
    gift: 'Gift wrap in WAQT velvet box with calligraphy card',
  },
  success: {
    title: 'Thank you.', subtitle: 'Your timepiece is being prepared.', order: 'Order number', text: 'Your personal concierge will contact you on WhatsApp within the hour to arrange insured delivery.',
    track: 'View my orders', continue: 'Continue exploring',
  },
  appt: {
    eyebrow: 'Private Viewings', title: 'Book a boutique appointment', subtitle: 'An unhurried hour with our horological advisors, in a private salon.',
    boutique: 'Choose a boutique', date: 'Select a date', time: 'Select a time', details: 'Your details', interest: 'Timepiece of interest (optional)',
    notes: 'Notes for your advisor', confirm: 'Confirm appointment', success: 'Your private viewing is confirmed', successText: '{{city}} · {{date}} at {{time}}',
    upcoming: 'Your upcoming appointments', missing: 'Please choose a boutique, date and time.', none: 'No preference',
  },
  account: {
    eyebrow: 'Private Client', greeting: 'Welcome back, {{name}}', tabs: { wishlist: 'Wishlist', orders: 'Orders', vip: 'VIP Tier', addresses: 'Addresses' },
    emptyWish: 'Your wishlist is empty', emptyWishText: 'Tap the heart on any timepiece to save it here.',
    emptyOrders: 'No orders yet', emptyOrdersText: 'When you acquire a timepiece, it will appear here.',
    status: { delivered: 'Delivered', transit: 'In insured transit', preparing: 'Preparing' },
    tier: 'Current tier', spent: 'Lifetime acquisitions', next: '{{amount}} to {{tier}}', maxTier: 'You hold our most exclusive tier.',
    tiers: { silver: 'Silver', gold: 'Gold', black: 'Black' },
    perks: {
      silver: ['Priority concierge on WhatsApp', 'Complimentary engraving', 'Birthday gift'],
      gold: ['Early access to new arrivals', 'Invitations to private events', 'Free annual servicing check'],
      black: ['Priority allocations on rare references', 'Dedicated personal advisor', 'Chauffeured boutique visits'],
    },
    addAddress: 'Add address', default: 'Default', save: 'Save address', label: 'Label (e.g. Home)', placed: 'Placed', items: '{{n}} item(s)',
  },
  footer: {
    about: 'The MENA region’s destination for authentic haute horlogerie. Discover, compare and acquire with confidence.',
    shop: 'Shop', service: 'Client Service', company: 'Maison', newsletter: 'The Private List', newsletterText: 'New arrivals, allocations and invitations — first.',
    subscribe: 'Subscribe', email: 'Your email', rights: 'All rights reserved.',
    disclaimer: 'Brand names are used for descriptive purposes only. WAQT is an independent retailer and is not affiliated with the brands shown.',
    links: { authenticity: 'Authenticity', shipping: 'Insured shipping', returns: 'Returns', care: 'Care & servicing', story: 'Our story', press: 'Press', careers: 'Careers', contact: 'Contact' },
    subscribed: 'Welcome to the Private List.',
  },
  toast: {
    addedBag: 'Added to your bag', addedWish: 'Saved to your wishlist', removedWish: 'Removed from wishlist',
    addedCompare: 'Added to compare', removedCompare: 'Removed from compare', compareFull: 'You can compare up to 3 watches',
    booked: 'Appointment confirmed', saved: 'Saved', invalidEmail: 'Please enter a valid email address.',
  },
  wa: { label: 'Concierge on WhatsApp', message: 'Hello WAQT, I would like assistance with a timepiece.' },
  common: { currency: 'Currency', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', viewAll: 'View all', close: 'Close', from: 'From', men: 'Men', women: 'Women', aed: 'AED' },
  notFound: { title: 'Lost in time', text: 'The page you are looking for does not exist — but your next masterpiece does.', cta: 'Return home' },
}

const ar = {
  nav: { home: 'الرئيسية', shop: 'المجموعة', brands: 'الدور', compare: 'مقارنة', appointments: 'البوتيكات', account: 'حسابي', bag: 'الحقيبة', wishlist: 'المفضلة', menu: 'القائمة', search: 'ابحث عن ساعة…' },
  mega: { heritage: 'الإرث', title: 'الدور الخمس', subtitle: 'مختارة من أعرق دور صناعة الساعات', viewAll: 'عرض جميع الساعات', since: 'منذ', featured: 'مميز' },
  trust: { delivery: 'توصيل مؤمَّن مجاني في جميع دول الخليج', authentic: 'أصالة مضمونة ١٠٠٪', warranty: 'ضمان دولي حتى ٥ سنوات', concierge: 'كونسيرج خاص على مدار الساعة' },
  hero: {
    eyebrow: 'دار الساعات في الشرق الأوسط',
    title: 'الوقت، بإتقان.',
    subtitle: 'اكتشف وقارن واقتنِ روائع أصلية من أعرق خمس دور في صناعة الساعات — مع توصيل راقٍ بعناية فائقة في أنحاء الخليج.',
    cta: 'استكشف المجموعة',
    cta2: 'احجز معاينة خاصة',
    scroll: 'مرّر',
  },
  stats: { timepieces: 'ساعة متوفرة', clients: 'عميل مميز', boutiques: 'بوتيكات في المنطقة', years: 'سنوات من الخبرة' },
  home: {
    maisons: 'الدور', maisonsTitle: 'خمس دور. معيار واحد.',
    featured: 'الأكثر طلباً', featuredTitle: 'الأكثر رغبة هذا الموسم',
    whyEyebrow: 'وعد وقت', whyTitle: 'أكثر من مجرد شراء — إنها مراسم.',
    why1: 'موثّقة من خبراء', why1d: 'تُفحص كل قطعة بواسطة صانعي ساعات معتمدين وتصل مع شهادة الأصالة.',
    why2: 'توصيل مؤمَّن راقٍ', why2d: 'مؤمَّن بالكامل ويُسلَّم يداً بيد في دول الخليج خلال ٢٤–٧٢ ساعة.',
    why3: 'كونسيرج خاص', why3d: 'مستشار مخصص عبر واتساب، من أول استفسار حتى الصيانة مدى الحياة.',
    why4: 'امتيازات كبار العملاء', why4d: 'مستويات فضية وذهبية وسوداء تتيح الحصص والفعاليات والأولوية.',
    apptEyebrow: 'بموعد مسبق', apptTitle: 'جرّبها على معصمك.', apptText: 'صالوناتنا في دبي وأبوظبي والرياض وجدة والدوحة ومدينة الكويت بانتظارك لمعاينة خاصة وهادئة — مع القهوة العربية.',
    discover: 'اكتشف الدار',
  },
  seasonal: {
    ramadanEyebrow: 'هدايا رمضان والعيد', ramadanTitle: 'هدايا ذات معنى خالد', ramadanText: 'مغلّفة يدوياً في علبتنا المخملية المميزة مع بطاقة خط عربي مخصصة.',
    nationalEyebrow: 'إصدارات اليوم الوطني', nationalTitle: 'احتفل بالوطن بالذهب والأخضر', nationalText: 'موانئ محدودة ونقش مجاني لليوم الوطني في الإمارات والسعودية وقطر والكويت.',
    cta: 'تسوّق المختارات',
  },
  shop: {
    eyebrow: 'المجموعة', title: 'كل ساعة، موثّقة.', results: '{{count}} ساعة',
    filters: 'التصفية', brand: 'الدار', price: 'نطاق السعر', size: 'حجم العلبة', material: 'المادة', movement: 'الحركة', gender: 'لـ',
    all: 'الكل', men: 'رجالي', women: 'نسائي', clear: 'مسح الكل', apply: 'عرض النتائج',
    sort: 'ترتيب حسب', sortWanted: 'الأكثر طلباً', sortNew: 'الأحدث', sortLow: 'السعر: من الأقل', sortHigh: 'السعر: من الأعلى',
    emptyTitle: 'لا توجد ساعات مطابقة', emptyText: 'جرّب توسيع خيارات التصفية — أو اطلب من الكونسيرج توفيرها لك.',
    upTo: 'حتى',
  },
  materials: { steel: 'فولاذ', gold: 'ذهب', platinum: 'بلاتين' },
  movements: { automatic: 'أوتوماتيكية', manual: 'تعبئة يدوية', chronograph: 'كرونوغراف', quartz: 'كوارتز' },
  sizes: { small: 'أقل من ٣٦ مم', medium: '٣٦ – ٤٠ مم', large: 'أكبر من ٤٠ مم' },
  card: { authentic: 'أصالة مضمونة', ref: 'المرجع', addBag: 'أضف للحقيبة', compare: 'مقارنة', new: 'جديد' },
  product: {
    back: 'العودة إلى المجموعة', addBag: 'أضف إلى الحقيبة', addWish: 'أضف إلى المفضلة', inWish: 'في المفضلة', book: 'احجز معاينة خاصة',
    specs: 'المواصفات', reference: 'المرجع', caseSize: 'حجم العلبة', material: 'المادة', movement: 'الحركة', calibre: 'العيار',
    water: 'مقاومة الماء', power: 'احتياطي الطاقة', dial: 'الميناء', gender: 'الفئة', hours: '{{n}} ساعة', na: 'لا ينطبق (كوارتز)',
    boxPapers: 'العلبة والأوراق كاملة', boxPapersD: 'علبة العرض الأصلية والكتيبات وبطاقة الضمان مؤرخة بتاريخ الشراء.',
    warranty: 'ضمان دولي لمدة {{n}} سنوات', warrantyD: 'معتمد لدى مراكز الخدمة الرسمية حول العالم، مع رعاية وقت مدى الحياة.',
    certificate: 'شهادة الأصالة', certificateD: 'مفحوصة من قِبل صانعي الساعات لدينا ومختومة بشهادة وقت مرقّمة.',
    delivery: 'توصيل سريع مؤمَّن مجاناً', deliveryD: 'يُسلَّم يداً بيد في الخليج خلال ٢٤–٧٢ ساعة.',
    views: { front: 'أمامي', detail: 'تفاصيل الميناء', profile: 'جانبي', velvet: 'على المخمل' },
    zoomHint: 'مرّر للتكبير · انقر للعرض الكامل', related: 'قد يعجبك أيضاً', instalments: 'أو ٤ دفعات بدون فوائد بقيمة {{amount}} مع تابي / تمارا',
    notFound: 'هذه الساعة انسلّت عبر الزمن', notFoundText: 'ربما اقتناها جامع آخر. استكشف روائع مشابهة.',
    compare: 'أضف للمقارنة', inCompare: 'في المقارنة',
  },
  compare: {
    eyebrow: 'جنباً إلى جنب', title: 'قارن الساعات', subtitle: 'وازن بين ثلاث روائع كحد أقصى.',
    empty: 'لا شيء للمقارنة بعد', emptyText: 'أضف حتى ثلاث ساعات من المجموعة باستخدام أيقونة المقارنة.',
    add: 'أضف ساعة', remove: 'إزالة', price: 'السعر', tray: 'مقارنة ({{n}}/٣)', view: 'قارن الآن', clear: 'مسح',
  },
  bag: {
    title: 'حقيبتك', empty: 'حقيبتك بانتظارك', emptyText: 'تحفتك على بُعد نقرات قليلة.', subtotal: 'المجموع الفرعي', delivery: 'توصيل سريع مؤمَّن',
    free: 'مجاني', vat: 'ضريبة القيمة المضافة (مشمولة)', total: 'الإجمالي', checkout: 'المتابعة للدفع', remove: 'إزالة', qty: 'الكمية', continue: 'متابعة التسوق',
    secure: 'دفع آمن ومشفّر',
  },
  checkout: {
    title: 'إتمام الطلب', contact: 'معلومات التواصل', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'رقم الجوال', address: 'عنوان التوصيل',
    city: 'المدينة', country: 'الدولة', street: 'الشارع، المبنى، الشقة', payment: 'طريقة الدفع',
    card: 'بطاقة ائتمان / خصم', apple: 'Apple Pay', tabby: 'تابي — ٤ دفعات بدون فوائد', tamara: 'تمارا — قسّمها على ٣ أو ٤',
    cardNumber: 'رقم البطاقة', expiry: 'شهر / سنة', cvc: 'CVC', place: 'تأكيد الطلب', placing: 'جارٍ تأمين طلبك…',
    summary: 'ملخص الطلب', insured: 'مؤمَّن بالكامل، التوقيع عند الاستلام', required: 'يرجى إكمال جميع الحقول المطلوبة.',
    gift: 'تغليف هدية في علبة وقت المخملية مع بطاقة خط عربي',
  },
  success: {
    title: 'شكراً لك.', subtitle: 'يتم الآن تجهيز ساعتك.', order: 'رقم الطلب', text: 'سيتواصل معك الكونسيرج الخاص بك عبر واتساب خلال ساعة لترتيب التوصيل المؤمَّن.',
    track: 'عرض طلباتي', continue: 'متابعة الاستكشاف',
  },
  appt: {
    eyebrow: 'معاينات خاصة', title: 'احجز موعداً في البوتيك', subtitle: 'ساعة هادئة مع مستشارينا في صالون خاص.',
    boutique: 'اختر البوتيك', date: 'اختر التاريخ', time: 'اختر الوقت', details: 'بياناتك', interest: 'الساعة المهتم بها (اختياري)',
    notes: 'ملاحظات لمستشارك', confirm: 'تأكيد الموعد', success: 'تم تأكيد معاينتك الخاصة', successText: '{{city}} · {{date}} الساعة {{time}}',
    upcoming: 'مواعيدك القادمة', missing: 'يرجى اختيار البوتيك والتاريخ والوقت.', none: 'لا تفضيل',
  },
  account: {
    eyebrow: 'عميل خاص', greeting: 'أهلاً بعودتك، {{name}}', tabs: { wishlist: 'المفضلة', orders: 'الطلبات', vip: 'مستوى VIP', addresses: 'العناوين' },
    emptyWish: 'قائمة المفضلة فارغة', emptyWishText: 'انقر على القلب في أي ساعة لحفظها هنا.',
    emptyOrders: 'لا توجد طلبات بعد', emptyOrdersText: 'عند اقتنائك ساعة، ستظهر هنا.',
    status: { delivered: 'تم التسليم', transit: 'قيد الشحن المؤمَّن', preparing: 'قيد التجهيز' },
    tier: 'المستوى الحالي', spent: 'إجمالي المقتنيات', next: '{{amount}} للوصول إلى {{tier}}', maxTier: 'أنت في أرقى مستوياتنا.',
    tiers: { silver: 'فضي', gold: 'ذهبي', black: 'أسود' },
    perks: {
      silver: ['أولوية الكونسيرج عبر واتساب', 'نقش مجاني', 'هدية عيد الميلاد'],
      gold: ['وصول مبكر للإصدارات الجديدة', 'دعوات لفعاليات خاصة', 'فحص صيانة سنوي مجاني'],
      black: ['أولوية الحصص للمراجع النادرة', 'مستشار شخصي مخصص', 'زيارات للبوتيك مع سائق خاص'],
    },
    addAddress: 'إضافة عنوان', default: 'افتراضي', save: 'حفظ العنوان', label: 'التسمية (مثل: المنزل)', placed: 'تاريخ الطلب', items: '{{n}} قطعة',
  },
  footer: {
    about: 'وجهة الشرق الأوسط للساعات الراقية الأصلية. اكتشف وقارن واقتنِ بثقة.',
    shop: 'تسوّق', service: 'خدمة العملاء', company: 'الدار', newsletter: 'القائمة الخاصة', newsletterText: 'الإصدارات الجديدة والحصص والدعوات — أولاً.',
    subscribe: 'اشترك', email: 'بريدك الإلكتروني', rights: 'جميع الحقوق محفوظة.',
    disclaimer: 'تُستخدم أسماء العلامات لأغراض وصفية فقط. وقت متجر مستقل وغير تابع للعلامات المعروضة.',
    links: { authenticity: 'الأصالة', shipping: 'الشحن المؤمَّن', returns: 'الإرجاع', care: 'العناية والصيانة', story: 'قصتنا', press: 'الصحافة', careers: 'الوظائف', contact: 'تواصل معنا' },
    subscribed: 'مرحباً بك في القائمة الخاصة.',
  },
  toast: {
    addedBag: 'أُضيفت إلى حقيبتك', addedWish: 'حُفظت في المفضلة', removedWish: 'أُزيلت من المفضلة',
    addedCompare: 'أُضيفت للمقارنة', removedCompare: 'أُزيلت من المقارنة', compareFull: 'يمكنك مقارنة ٣ ساعات كحد أقصى',
    booked: 'تم تأكيد الموعد', saved: 'تم الحفظ', invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
  },
  wa: { label: 'الكونسيرج عبر واتساب', message: 'مرحباً وقت، أرغب بالمساعدة بخصوص ساعة.' },
  common: { currency: 'العملة', language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', viewAll: 'عرض الكل', close: 'إغلاق', from: 'من', men: 'رجالي', women: 'نسائي', aed: 'د.إ' },
  notFound: { title: 'ضائع في الزمن', text: 'الصفحة التي تبحث عنها غير موجودة — لكن تحفتك القادمة موجودة.', cta: 'العودة للرئيسية' },
}

// ─── Additions for the database-backed version (merged over the base copy above) ───
const enExtra = {
  nav: { signIn: 'Sign in', signOut: 'Sign out', join: 'Join' },
  materials: { Steel: 'Steel', Gold: 'Gold', 'Rose Gold': 'Rose Gold', Platinum: 'Platinum', 'Two-Tone': 'Two-Tone' },
  movements: { Automatic: 'Automatic', Manual: 'Manual winding', Quartz: 'Quartz' },
  genders: { Men: 'Men', Women: 'Women', Unisex: 'Unisex' },
  countries: { UAE: 'United Arab Emirates', KSA: 'Saudi Arabia', Qatar: 'Qatar', Kuwait: 'Kuwait', Bahrain: 'Bahrain', Oman: 'Oman', Switzerland: 'Switzerland', France: 'France' },
  shop: { sortFeatured: 'Featured', sortNew: 'Newest', sortLow: 'Price: low to high', sortHigh: 'Price: high to low' },
  stock: { only: 'Only {{n}} left', out: 'Out of stock', in: 'In stock' },
  product: { story: 'The story' },
  auth: {
    loginEyebrow: 'Private Client Access', loginTitle: 'Welcome back.', loginSubtitle: 'Sign in to your wishlist, bag, orders and private viewings.',
    signupEyebrow: 'Become a Private Client', signupTitle: 'Join WAQT.', signupSubtitle: 'Create your account to save timepieces, check out and book private viewings.',
    email: 'Email', password: 'Password', passwordHint: 'At least 8 characters', fullName: 'Full name', phone: 'Mobile number',
    country: 'Country of residence', currency: 'Preferred currency',
    submitLogin: 'Sign in', submitSignup: 'Create my account', working: 'One moment…',
    noAccount: 'New to WAQT?', createOne: 'Create an account', haveAccount: 'Already a client?', signInHere: 'Sign in',
    gate: 'Please sign in or create an account to continue.',
    errors: {
      invalid_credentials: 'That email and password don’t match our records.',
      email_taken: 'An account with this email already exists — please sign in.',
      invalid_email: 'Please enter a valid email address.',
      weak_password: 'Your password needs at least 8 characters.',
      invalid_name: 'Please enter your full name.',
      invalid_phone: 'Please enter your mobile number.',
      invalid_country: 'Please choose your country.',
    },
  },
  errors: {
    db_unreachable: 'We can’t reach our vault right now. Please try again in a moment.',
    db_not_configured: 'The database isn’t connected yet. Add DATABASE_URL to .env and restart.',
    db_not_setup: 'The database is connected but empty. Run “npm run db:setup”.',
    network: 'You appear to be offline. Please check your connection.',
    server_error: 'Something went wrong on our side. Please try again.',
    out_of_stock: 'Sorry — this timepiece is out of stock.',
    not_enough_stock: 'We don’t have that many in stock.',
    checkout_stock: 'Some pieces in your bag are no longer available: {{items}}. Please update your bag.',
    slot_taken: 'That time has just been booked. Please choose another.',
    past_slot: 'Please choose a time in the future.',
    cart_empty: 'Your bag is empty.',
    not_found: 'We couldn’t find that.',
    generic: 'Something went wrong. Please try again.',
  },
  dbBanner: { title: 'Connection to the vault lost', retry: 'Try again' },
  bag: { empty: 'Your bag is empty.', emptyText: 'Explore the Collection.' },
  account: {
    emptyWish: 'Your wishlist is waiting for its first timepiece.',
    tabs: { appointments: 'Appointments', profile: 'Profile' },
    status: { pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
    apptStatus: { requested: 'Requested', confirmed: 'Confirmed', cancelled: 'Cancelled' },
    noAppointments: 'No upcoming appointments', noAppointmentsText: 'Book a private viewing at one of our six salons.',
    profile: 'Your details', preferences: 'Preferences', memberSince: 'Client since', save: 'Save changes', paidWith: 'Paid with',
  },
  appt: { booked: 'Booked', signedInAs: 'Booking as {{name}}' },
  toast: { welcome: 'Welcome, {{name}}', signedOut: 'You have been signed out.', prefsSaved: 'Preferences saved', orderPlaced: 'Order confirmed' },
}

const arExtra = {
  nav: { signIn: 'تسجيل الدخول', signOut: 'تسجيل الخروج', join: 'انضم' },
  materials: { Steel: 'فولاذ', Gold: 'ذهب', 'Rose Gold': 'ذهب وردي', Platinum: 'بلاتين', 'Two-Tone': 'ثنائي اللون' },
  movements: { Automatic: 'أوتوماتيكية', Manual: 'تعبئة يدوية', Quartz: 'كوارتز' },
  genders: { Men: 'رجالي', Women: 'نسائي', Unisex: 'للجنسين' },
  countries: { UAE: 'الإمارات العربية المتحدة', KSA: 'المملكة العربية السعودية', Qatar: 'قطر', Kuwait: 'الكويت', Bahrain: 'البحرين', Oman: 'عُمان', Switzerland: 'سويسرا', France: 'فرنسا' },
  shop: { sortFeatured: 'المميزة', sortNew: 'الأحدث', sortLow: 'السعر: من الأقل', sortHigh: 'السعر: من الأعلى' },
  stock: { only: 'متبقٍ {{n}} فقط', out: 'نفدت الكمية', in: 'متوفرة' },
  product: { story: 'الحكاية' },
  auth: {
    loginEyebrow: 'دخول العملاء الخاصين', loginTitle: 'أهلاً بعودتك.', loginSubtitle: 'سجّل الدخول إلى مفضلتك وحقيبتك وطلباتك ومعايناتك الخاصة.',
    signupEyebrow: 'كن عميلاً خاصاً', signupTitle: 'انضم إلى وقت.', signupSubtitle: 'أنشئ حسابك لحفظ الساعات وإتمام الشراء وحجز المعاينات الخاصة.',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', passwordHint: '٨ أحرف على الأقل', fullName: 'الاسم الكامل', phone: 'رقم الجوال',
    country: 'دولة الإقامة', currency: 'العملة المفضلة',
    submitLogin: 'تسجيل الدخول', submitSignup: 'إنشاء حسابي', working: 'لحظة من فضلك…',
    noAccount: 'جديد في وقت؟', createOne: 'أنشئ حساباً', haveAccount: 'عميل لدينا؟', signInHere: 'سجّل الدخول',
    gate: 'يرجى تسجيل الدخول أو إنشاء حساب للمتابعة.',
    errors: {
      invalid_credentials: 'البريد الإلكتروني وكلمة المرور غير متطابقين.',
      email_taken: 'يوجد حساب بهذا البريد بالفعل — يرجى تسجيل الدخول.',
      invalid_email: 'يرجى إدخال بريد إلكتروني صحيح.',
      weak_password: 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل.',
      invalid_name: 'يرجى إدخال اسمك الكامل.',
      invalid_phone: 'يرجى إدخال رقم جوالك.',
      invalid_country: 'يرجى اختيار دولتك.',
    },
  },
  errors: {
    db_unreachable: 'تعذّر الوصول إلى خزنتنا حالياً. يرجى المحاولة بعد قليل.',
    db_not_configured: 'قاعدة البيانات غير متصلة بعد. أضف DATABASE_URL إلى ملف ‎.env ثم أعد التشغيل.',
    db_not_setup: 'قاعدة البيانات متصلة لكنها فارغة. شغّل «npm run db:setup».',
    network: 'يبدو أنك غير متصل. يرجى التحقق من الاتصال.',
    server_error: 'حدث خطأ من جهتنا. يرجى المحاولة مرة أخرى.',
    out_of_stock: 'عذراً — نفدت كمية هذه الساعة.',
    not_enough_stock: 'لا تتوفر لدينا هذه الكمية.',
    checkout_stock: 'بعض القطع في حقيبتك لم تعد متوفرة: {{items}}. يرجى تحديث حقيبتك.',
    slot_taken: 'تم حجز هذا الوقت للتو. يرجى اختيار وقت آخر.',
    past_slot: 'يرجى اختيار وقت في المستقبل.',
    cart_empty: 'حقيبتك فارغة.',
    not_found: 'لم نتمكن من العثور على ذلك.',
    generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  },
  dbBanner: { title: 'انقطع الاتصال بالخزنة', retry: 'حاول مجدداً' },
  bag: { empty: 'حقيبتك فارغة.', emptyText: 'استكشف المجموعة.' },
  account: {
    emptyWish: 'مفضلتك بانتظار أول ساعة.',
    tabs: { appointments: 'المواعيد', profile: 'الملف الشخصي' },
    status: { pending: 'قيد الانتظار', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغى' },
    apptStatus: { requested: 'مطلوب', confirmed: 'مؤكد', cancelled: 'ملغى' },
    noAppointments: 'لا توجد مواعيد قادمة', noAppointmentsText: 'احجز معاينة خاصة في أحد صالوناتنا الستة.',
    profile: 'بياناتك', preferences: 'التفضيلات', memberSince: 'عميل منذ', save: 'حفظ التغييرات', paidWith: 'طريقة الدفع',
  },
  appt: { booked: 'محجوز', signedInAs: 'الحجز باسم {{name}}' },
  toast: { welcome: 'أهلاً بك، {{name}}', signedOut: 'تم تسجيل خروجك.', prefsSaved: 'تم حفظ التفضيلات', orderPlaced: 'تم تأكيد الطلب' },
}

const deepMerge = (base, extra) => {
  for (const [k, v] of Object.entries(extra)) {
    base[k] = v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' ? deepMerge({ ...base[k] }, v) : v
  }
  return base
}
deepMerge(en, enExtra)
deepMerge(ar, arExtra)

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('waqt-lang') : null

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: saved || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnObjects: true,
})

const applyDir = (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
}
applyDir(i18n.language)
i18n.on('languageChanged', (lng) => {
  applyDir(lng)
  localStorage.setItem('waqt-lang', lng)
})

export default i18n
