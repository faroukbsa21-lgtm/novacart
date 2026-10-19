/**
 * Comprehensive Algerian Logistics & Shipping Configuration
 * Covering all 69 Wilayas (including 2026 administrative reform wilayas 59 to 69)
 * With tiered pricing for Stop Desk (Bureau) vs Home Delivery (À Domicile).
 */

import { formatDZD } from '../utils/formatters';

export const DELIVERY_TYPES = {
  HOME: 'home',
  DESK: 'desk'
};

export const ALGERIA_WILAYAS = [
  {
    code: 1,
    codeStr: '01',
    name: 'Adrar',
    arName: 'أدرار',
    zone: 'Sahara',
    homePriceDZD: 1200,
    deskPriceDZD: 800,
    estimatedDelivery: '3 - 5 business days'
  },
  {
    code: 2,
    codeStr: '02',
    name: 'Chlef',
    arName: 'الشلف',
    zone: 'Centre-Ouest',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 3,
    codeStr: '03',
    name: 'Laghouat',
    arName: 'الأغواط',
    zone: 'Portes du Sahara',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 4,
    codeStr: '04',
    name: 'Oum El Bouaghi',
    arName: 'أم البواقي',
    zone: 'Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 5,
    codeStr: '05',
    name: 'Batna',
    arName: 'باتنة',
    zone: 'Aurès / Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 6,
    codeStr: '06',
    name: 'Béjaïa',
    arName: 'بجاية',
    zone: 'Littoral Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 7,
    codeStr: '07',
    name: 'Biskra',
    arName: 'بسكرة',
    zone: 'Portes du Sahara',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 8,
    codeStr: '08',
    name: 'Béchar',
    arName: 'بشار',
    zone: 'Sud-Ouest',
    homePriceDZD: 1200,
    deskPriceDZD: 800,
    estimatedDelivery: '3 - 5 business days'
  },
  {
    code: 9,
    codeStr: '09',
    name: 'Blida',
    arName: 'البليدة',
    zone: 'Mitidja / Centre',
    homePriceDZD: 600,
    deskPriceDZD: 350,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 10,
    codeStr: '10',
    name: 'Bouira',
    arName: 'البويرة',
    zone: 'Centre',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 11,
    codeStr: '11',
    name: 'Tamanrasset',
    arName: 'تمنراست',
    zone: 'Grand Sud',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 12,
    codeStr: '12',
    name: 'Tébessa',
    arName: 'تبسة',
    zone: 'Est Frontière',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 13,
    codeStr: '13',
    name: 'Tlemcen',
    arName: 'تلمسان',
    zone: 'Ouest Frontière',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 14,
    codeStr: '14',
    name: 'Tiaret',
    arName: 'تيارت',
    zone: 'Hauts-Plateaux Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 15,
    codeStr: '15',
    name: 'Tizi Ouzou',
    arName: 'تيزي وزو',
    zone: 'Kabylie / Centre',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 16,
    codeStr: '16',
    name: 'Alger',
    arName: 'الجزائر (العاصمة)',
    zone: 'Capitale',
    homePriceDZD: 500,
    deskPriceDZD: 300,
    estimatedDelivery: '24h Express'
  },
  {
    code: 17,
    codeStr: '17',
    name: 'Djelfa',
    arName: 'الجلفة',
    zone: 'Hauts-Plateaux Centre',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 18,
    codeStr: '18',
    name: 'Jijel',
    arName: 'جيجل',
    zone: 'Littoral Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 19,
    codeStr: '19',
    name: 'Sétif',
    arName: 'سطيف',
    zone: 'Hauts-Plateaux Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 20,
    codeStr: '20',
    name: 'Saïda',
    arName: 'سعيدة',
    zone: 'Hauts-Plateaux Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 21,
    codeStr: '21',
    name: 'Skikda',
    arName: 'سكيكدة',
    zone: 'Littoral Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 22,
    codeStr: '22',
    name: 'Sidi Bel Abbès',
    arName: 'سيدي بلعباس',
    zone: 'Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 23,
    codeStr: '23',
    name: 'Annaba',
    arName: 'عنابة',
    zone: 'Littoral Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 24,
    codeStr: '24',
    name: 'Guelma',
    arName: 'قالمة',
    zone: 'Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 25,
    codeStr: '25',
    name: 'Constantine',
    arName: 'قسنطينة',
    zone: 'Métropole Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 26,
    codeStr: '26',
    name: 'Médéa',
    arName: 'المدية',
    zone: 'Centre',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 27,
    codeStr: '27',
    name: 'Mostaganem',
    arName: 'مستغانم',
    zone: 'Littoral Ouest',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 28,
    codeStr: '28',
    name: "M'Sila",
    arName: 'المسيلة',
    zone: 'Hauts-Plateaux Centre',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 29,
    codeStr: '29',
    name: 'Mascara',
    arName: 'معسكر',
    zone: 'Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 30,
    codeStr: '30',
    name: 'Ouargla',
    arName: 'ورقلة',
    zone: 'Sahara Nord',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 31,
    codeStr: '31',
    name: 'Oran',
    arName: 'وهران',
    zone: 'Métropole Ouest',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 32,
    codeStr: '32',
    name: 'El Bayadh',
    arName: 'البيض',
    zone: 'Hauts-Plateaux / Sud-Ouest',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 33,
    codeStr: '33',
    name: 'Illizi',
    arName: 'إليزي',
    zone: 'Grand Sud Est',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 34,
    codeStr: '34',
    name: 'Bordj Bou Arréridj',
    arName: 'برج بوعريريج',
    zone: 'Hauts-Plateaux Est',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 35,
    codeStr: '35',
    name: 'Boumerdès',
    arName: 'بومرداس',
    zone: 'Centre',
    homePriceDZD: 600,
    deskPriceDZD: 350,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 36,
    codeStr: '36',
    name: 'El Tarf',
    arName: 'الطارف',
    zone: 'Littoral Est Frontière',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 37,
    codeStr: '37',
    name: 'Tindouf',
    arName: 'تندوف',
    zone: 'Grand Sud Ouest',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 38,
    codeStr: '38',
    name: 'Tissemsilt',
    arName: 'تيسمسيلت',
    zone: 'Hauts-Plateaux Centre',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 39,
    codeStr: '39',
    name: 'El Oued',
    arName: 'الوادي',
    zone: 'Sahara Nord-Est',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 40,
    codeStr: '40',
    name: 'Khenchela',
    arName: 'خنشلة',
    zone: 'Aurès / Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 41,
    codeStr: '41',
    name: 'Souk Ahras',
    arName: 'سوق أهراس',
    zone: 'Est Frontière',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 42,
    codeStr: '42',
    name: 'Tipaza',
    arName: 'تيبازة',
    zone: 'Littoral Centre',
    homePriceDZD: 600,
    deskPriceDZD: 350,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 43,
    codeStr: '43',
    name: 'Mila',
    arName: 'ميلة',
    zone: 'Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 44,
    codeStr: '44',
    name: 'Aïn Defla',
    arName: 'عين الدفلى',
    zone: 'Centre-Ouest',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 45,
    codeStr: '45',
    name: 'Naâma',
    arName: 'النعامة',
    zone: 'Hauts-Plateaux / Sud-Ouest',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 46,
    codeStr: '46',
    name: 'Aïn Témouchent',
    arName: 'عين تموشنت',
    zone: 'Littoral Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 47,
    codeStr: '47',
    name: 'Ghardaïa',
    arName: 'غرداية',
    zone: 'Portes du Sahara',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 48,
    codeStr: '48',
    name: 'Relizane',
    arName: 'غليزان',
    zone: 'Ouest',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 49,
    codeStr: '49',
    name: 'Timimoun',
    arName: 'تيميمون',
    zone: 'Sahara',
    homePriceDZD: 1200,
    deskPriceDZD: 800,
    estimatedDelivery: '3 - 5 business days'
  },
  {
    code: 50,
    codeStr: '50',
    name: 'Bordj Badji Mokhtar',
    arName: 'برج باجي مختار',
    zone: 'Grand Sud Frontière',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 51,
    codeStr: '51',
    name: 'Ouled Djellal',
    arName: 'أولاد جلال',
    zone: 'Portes du Sahara',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 52,
    codeStr: '52',
    name: 'Béni Abbès',
    arName: 'بني عباس',
    zone: 'Sahara Ouest',
    homePriceDZD: 1200,
    deskPriceDZD: 800,
    estimatedDelivery: '3 - 5 business days'
  },
  {
    code: 53,
    codeStr: '53',
    name: 'In Salah',
    arName: 'عين صالح',
    zone: 'Sahara Central',
    homePriceDZD: 1200,
    deskPriceDZD: 800,
    estimatedDelivery: '3 - 5 business days'
  },
  {
    code: 54,
    codeStr: '54',
    name: 'In Guezzam',
    arName: 'عين قزام',
    zone: 'Grand Sud Frontière',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 55,
    codeStr: '55',
    name: 'Touggourt',
    arName: 'تقرت',
    zone: 'Sahara Nord-Est',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 56,
    codeStr: '56',
    name: 'Djanet',
    arName: 'جانت',
    zone: 'Grand Sud Est',
    homePriceDZD: 1500,
    deskPriceDZD: 1000,
    estimatedDelivery: '4 - 6 business days'
  },
  {
    code: 57,
    codeStr: '57',
    name: "El M'Ghair",
    arName: 'المغير',
    zone: 'Sahara Nord-Est',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 58,
    codeStr: '58',
    name: 'El Meniaa',
    arName: 'المنيعة',
    zone: 'Sahara Central',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 59,
    codeStr: '59',
    name: 'Aflou',
    arName: 'آفلو',
    zone: 'Hauts-Plateaux / Sud',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 60,
    codeStr: '60',
    name: 'Barika',
    arName: 'بريكة',
    zone: 'Hauts-Plateaux Est',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 61,
    codeStr: '61',
    name: 'El Kantara',
    arName: 'القنطرة',
    zone: 'Aurès / Portes du Sahara',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 62,
    codeStr: '62',
    name: 'Bir El Ater',
    arName: 'بئر العاتر',
    zone: 'Est Frontière',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 63,
    codeStr: '63',
    name: 'El Aricha',
    arName: 'العريشة',
    zone: 'Hauts-Plateaux Ouest',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 64,
    codeStr: '64',
    name: 'Ksar Chellala',
    arName: 'قصر الشلالة',
    zone: 'Hauts-Plateaux Centre',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 65,
    codeStr: '65',
    name: 'Aïn Oussara',
    arName: 'عين وسارة',
    zone: 'Hauts-Plateaux Centre',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 66,
    codeStr: '66',
    name: 'Messaad',
    arName: 'مسعد',
    zone: 'Hauts-Plateaux Sud',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 67,
    codeStr: '67',
    name: 'Ksar El Boukhari',
    arName: 'قصر البخاري',
    zone: 'Centre',
    homePriceDZD: 700,
    deskPriceDZD: 450,
    estimatedDelivery: '24h - 48h'
  },
  {
    code: 68,
    codeStr: '68',
    name: 'Bou Saâda',
    arName: 'بوسعادة',
    zone: 'Portes du Sahara',
    homePriceDZD: 800,
    deskPriceDZD: 500,
    estimatedDelivery: '48h - 72h'
  },
  {
    code: 69,
    codeStr: '69',
    name: 'El Abiodh Sidi Cheikh',
    arName: 'الأبيض سيدي الشيخ',
    zone: 'Sud-Ouest',
    homePriceDZD: 950,
    deskPriceDZD: 600,
    estimatedDelivery: '48h - 72h'
  }
];

export function getWilayaByCode(code) {
  const numCode = parseInt(code, 10);
  return ALGERIA_WILAYAS.find(w => w.code === numCode) || null;
}

export function calculateShippingFee(wilayaCode, deliveryType = DELIVERY_TYPES.HOME, lang = 'fr') {
  const wilaya = getWilayaByCode(wilayaCode);
  if (!wilaya) {
    const fee = deliveryType === DELIVERY_TYPES.DESK ? 450 : 700;
    return {
      dzd: fee,
      formattedDZD: formatDZD(fee, lang),
      label: deliveryType === DELIVERY_TYPES.DESK ? 'Livraison au Bureau (Stop Desk)' : 'Livraison à Domicile'
    };
  }

  if (deliveryType === DELIVERY_TYPES.DESK) {
    return {
      dzd: wilaya.deskPriceDZD,
      formattedDZD: formatDZD(wilaya.deskPriceDZD, lang),
      label: 'Livraison au Bureau (Stop Desk)'
    };
  }

  return {
    dzd: wilaya.homePriceDZD,
    formattedDZD: formatDZD(wilaya.homePriceDZD, lang),
    label: 'Livraison à Domicile'
  };
}

export { ALGERIA_COMMUNES, getCommunesForWilaya } from './algeriaCommunes';
