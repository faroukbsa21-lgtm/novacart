<?php

namespace App\Config;

/**
 * Algeria 69 Wilayas Official Shipping Rates & Verification
 * Accurately models Algerian national express delivery hubs (Alger, Mitidja, North, High-Plateaux, Sahara, Deep South)
 * Supports Stop Desk (Livraison au Bureau) vs Home Delivery (Livraison à Domicile).
 */
class AlgeriaShipping
{
    public const TYPE_HOME = 'home';
    public const TYPE_DESK = 'desk';

    /**
     * Map of Wilaya Code (1-69) to Logistics Parameters
     * Rates are strictly in Algerian Dinars (DZD)
     */
    private static array $wilayas = [
        1 => ['name' => 'Adrar', 'ar' => 'أدرار', 'home_dzd' => 1200, 'desk_dzd' => 800],
        2 => ['name' => 'Chlef', 'ar' => 'الشلف', 'home_dzd' => 700, 'desk_dzd' => 450],
        3 => ['name' => 'Laghouat', 'ar' => 'الأغواط', 'home_dzd' => 950, 'desk_dzd' => 600],
        4 => ['name' => 'Oum El Bouaghi', 'ar' => 'أم البواقي', 'home_dzd' => 800, 'desk_dzd' => 500],
        5 => ['name' => 'Batna', 'ar' => 'باتنة', 'home_dzd' => 800, 'desk_dzd' => 500],
        6 => ['name' => 'Béjaïa', 'ar' => 'بجاية', 'home_dzd' => 700, 'desk_dzd' => 450],
        7 => ['name' => 'Biskra', 'ar' => 'بسكرة', 'home_dzd' => 800, 'desk_dzd' => 500],
        8 => ['name' => 'Béchar', 'ar' => 'بشار', 'home_dzd' => 1200, 'desk_dzd' => 800],
        9 => ['name' => 'Blida', 'ar' => 'البليدة', 'home_dzd' => 600, 'desk_dzd' => 350],
        10 => ['name' => 'Bouira', 'ar' => 'البويرة', 'home_dzd' => 700, 'desk_dzd' => 450],
        11 => ['name' => 'Tamanrasset', 'ar' => 'تمنراست', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        12 => ['name' => 'Tébessa', 'ar' => 'تبسة', 'home_dzd' => 800, 'desk_dzd' => 500],
        13 => ['name' => 'Tlemcen', 'ar' => 'تلمسان', 'home_dzd' => 800, 'desk_dzd' => 500],
        14 => ['name' => 'Tiaret', 'ar' => 'تيارت', 'home_dzd' => 800, 'desk_dzd' => 500],
        15 => ['name' => 'Tizi Ouzou', 'ar' => 'تيزي وزو', 'home_dzd' => 700, 'desk_dzd' => 450],
        16 => ['name' => 'Alger', 'ar' => 'الجزائر', 'home_dzd' => 500, 'desk_dzd' => 300],
        17 => ['name' => 'Djelfa', 'ar' => 'الجلفة', 'home_dzd' => 800, 'desk_dzd' => 500],
        18 => ['name' => 'Jijel', 'ar' => 'جيجل', 'home_dzd' => 700, 'desk_dzd' => 450],
        19 => ['name' => 'Sétif', 'ar' => 'سطيف', 'home_dzd' => 700, 'desk_dzd' => 450],
        20 => ['name' => 'Saïda', 'ar' => 'سعيدة', 'home_dzd' => 800, 'desk_dzd' => 500],
        21 => ['name' => 'Skikda', 'ar' => 'سكيكدة', 'home_dzd' => 700, 'desk_dzd' => 450],
        22 => ['name' => 'Sidi Bel Abbès', 'ar' => 'سيدي بلعباس', 'home_dzd' => 800, 'desk_dzd' => 500],
        23 => ['name' => 'Annaba', 'ar' => 'عنابة', 'home_dzd' => 700, 'desk_dzd' => 450],
        24 => ['name' => 'Guelma', 'ar' => 'قالمة', 'home_dzd' => 800, 'desk_dzd' => 500],
        25 => ['name' => 'Constantine', 'ar' => 'قسنطينة', 'home_dzd' => 700, 'desk_dzd' => 450],
        26 => ['name' => 'Médéa', 'ar' => 'المدية', 'home_dzd' => 700, 'desk_dzd' => 450],
        27 => ['name' => 'Mostaganem', 'ar' => 'مستغانم', 'home_dzd' => 700, 'desk_dzd' => 450],
        28 => ['name' => "M'Sila", 'ar' => 'المسيلة', 'home_dzd' => 800, 'desk_dzd' => 500],
        29 => ['name' => 'Mascara', 'ar' => 'معسكر', 'home_dzd' => 800, 'desk_dzd' => 500],
        30 => ['name' => 'Ouargla', 'ar' => 'ورقلة', 'home_dzd' => 950, 'desk_dzd' => 600],
        31 => ['name' => 'Oran', 'ar' => 'وهران', 'home_dzd' => 700, 'desk_dzd' => 450],
        32 => ['name' => 'El Bayadh', 'ar' => 'البيض', 'home_dzd' => 950, 'desk_dzd' => 600],
        33 => ['name' => 'Illizi', 'ar' => 'إليزي', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        34 => ['name' => 'Bordj Bou Arréridj', 'ar' => 'برج بوعريريج', 'home_dzd' => 700, 'desk_dzd' => 450],
        35 => ['name' => 'Boumerdès', 'ar' => 'بومرداس', 'home_dzd' => 600, 'desk_dzd' => 350],
        36 => ['name' => 'El Tarf', 'ar' => 'الطارف', 'home_dzd' => 800, 'desk_dzd' => 500],
        37 => ['name' => 'Tindouf', 'ar' => 'تندوف', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        38 => ['name' => 'Tissemsilt', 'ar' => 'تيسمسيلت', 'home_dzd' => 800, 'desk_dzd' => 500],
        39 => ['name' => 'El Oued', 'ar' => 'الوادي', 'home_dzd' => 950, 'desk_dzd' => 600],
        40 => ['name' => 'Khenchela', 'ar' => 'خنشلة', 'home_dzd' => 800, 'desk_dzd' => 500],
        41 => ['name' => 'Souk Ahras', 'ar' => 'سوق أهراس', 'home_dzd' => 800, 'desk_dzd' => 500],
        42 => ['name' => 'Tipaza', 'ar' => 'تيبازة', 'home_dzd' => 600, 'desk_dzd' => 350],
        43 => ['name' => 'Mila', 'ar' => 'ميلة', 'home_dzd' => 800, 'desk_dzd' => 500],
        44 => ['name' => 'Aïn Defla', 'ar' => 'عين الدفلى', 'home_dzd' => 700, 'desk_dzd' => 450],
        45 => ['name' => 'Naâma', 'ar' => 'النعامة', 'home_dzd' => 950, 'desk_dzd' => 600],
        46 => ['name' => 'Aïn Témouchent', 'ar' => 'عين تموشنت', 'home_dzd' => 800, 'desk_dzd' => 500],
        47 => ['name' => 'Ghardaïa', 'ar' => 'غرداية', 'home_dzd' => 950, 'desk_dzd' => 600],
        48 => ['name' => 'Relizane', 'ar' => 'غليزان', 'home_dzd' => 800, 'desk_dzd' => 500],
        49 => ['name' => 'Timimoun', 'ar' => 'تيميمون', 'home_dzd' => 1200, 'desk_dzd' => 800],
        50 => ['name' => 'Bordj Badji Mokhtar', 'ar' => 'برج باجي مختار', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        51 => ['name' => 'Ouled Djellal', 'ar' => 'أولاد جلال', 'home_dzd' => 950, 'desk_dzd' => 600],
        52 => ['name' => 'Béni Abbès', 'ar' => 'بني عباس', 'home_dzd' => 1200, 'desk_dzd' => 800],
        53 => ['name' => 'In Salah', 'ar' => 'عين صالح', 'home_dzd' => 1200, 'desk_dzd' => 800],
        54 => ['name' => 'In Guezzam', 'ar' => 'عين قزام', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        55 => ['name' => 'Touggourt', 'ar' => 'تقرت', 'home_dzd' => 950, 'desk_dzd' => 600],
        56 => ['name' => 'Djanet', 'ar' => 'جانت', 'home_dzd' => 1500, 'desk_dzd' => 1000],
        57 => ['name' => "El M'Ghair", 'ar' => 'المغير', 'home_dzd' => 950, 'desk_dzd' => 600],
        58 => ['name' => 'El Meniaa', 'ar' => 'المنيعة', 'home_dzd' => 950, 'desk_dzd' => 600],
        59 => ['name' => 'Aflou', 'ar' => 'آفلو', 'home_dzd' => 950, 'desk_dzd' => 600],
        60 => ['name' => 'Barika', 'ar' => 'بريكة', 'home_dzd' => 800, 'desk_dzd' => 500],
        61 => ['name' => 'El Kantara', 'ar' => 'القنطرة', 'home_dzd' => 800, 'desk_dzd' => 500],
        62 => ['name' => 'Bir El Ater', 'ar' => 'بئر العاتر', 'home_dzd' => 950, 'desk_dzd' => 600],
        63 => ['name' => 'El Aricha', 'ar' => 'العريشة', 'home_dzd' => 950, 'desk_dzd' => 600],
        64 => ['name' => 'Ksar Chellala', 'ar' => 'قصر الشلالة', 'home_dzd' => 800, 'desk_dzd' => 500],
        65 => ['name' => 'Aïn Oussara', 'ar' => 'عين وسارة', 'home_dzd' => 800, 'desk_dzd' => 500],
        66 => ['name' => 'Messaad', 'ar' => 'مسعد', 'home_dzd' => 800, 'desk_dzd' => 500],
        67 => ['name' => 'Ksar El Boukhari', 'ar' => 'قصر البخاري', 'home_dzd' => 700, 'desk_dzd' => 450],
        68 => ['name' => 'Bou Saâda', 'ar' => 'بوسعادة', 'home_dzd' => 800, 'desk_dzd' => 500],
        69 => ['name' => 'El Abiodh Sidi Cheikh', 'ar' => 'الأبيض سيدي الشيخ', 'home_dzd' => 950, 'desk_dzd' => 600],
    ];

    public static function isValidWilayaCode(int $code): bool
    {
        return isset(self::$wilayas[$code]);
    }

    public static function getWilaya(int $code): ?array
    {
        return self::$wilayas[$code] ?? null;
    }

    public static function calculateShippingFee(int $wilayaCode, string $deliveryType = self::TYPE_HOME): array
    {
        $wilaya = self::getWilaya($wilayaCode);
        if (!$wilaya) {
            // Default center fallback
            $isDesk = ($deliveryType === self::TYPE_DESK);
            return [
                'dzd' => $isDesk ? 450 : 700,
                'name' => 'Wilaya #' . $wilayaCode,
                'ar' => '',
                'type' => $deliveryType
            ];
        }

        $isDesk = ($deliveryType === self::TYPE_DESK);
        return [
            'dzd' => $isDesk ? $wilaya['desk_dzd'] : $wilaya['home_dzd'],
            'name' => $wilaya['name'],
            'ar' => $wilaya['ar'],
            'type' => $deliveryType
        ];
    }
}
