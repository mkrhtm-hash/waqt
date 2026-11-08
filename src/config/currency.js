// Prices are stored in AED in the database. The switcher converts on the frontend with these fixed rates.
// 1 AED = rate × currency
export const currencies = {
  AED: { rate: 1, symbol: 'AED', symbolAr: 'د.إ' },
  SAR: { rate: 1.021, symbol: 'SAR', symbolAr: 'ر.س' },
  QAR: { rate: 0.991, symbol: 'QAR', symbolAr: 'ر.ق' },
  KWD: { rate: 0.0837, symbol: 'KWD', symbolAr: 'د.ك' },
  BHD: { rate: 0.1026, symbol: 'BHD', symbolAr: 'د.ب' },
  OMR: { rate: 0.1048, symbol: 'OMR', symbolAr: 'ر.ع' },
  USD: { rate: 0.2723, symbol: 'USD', symbolAr: '$' },
}

export const PRICE_MIN = 20000
export const PRICE_MAX = 900000
