<?php
/**
 * Plugin Name: Travel CMS — Programmes
 * Description: Enregistre le CPT "Programme" et les champs ACF/SCF exposés en REST pour alimenter le front headless de l'agence de voyage.
 * Version: 1.0.0
 * Author: Travel CMS
 *
 * Fonctionne comme mu-plugin (wp-content/mu-plugins/) ou comme plugin classique.
 * Nécessite le plugin gratuit "Secure Custom Fields" (ou ACF) pour la partie champs.
 */

if (!defined('ABSPATH')) {
    exit;
}

// ————————————————————————————————————————————————
// 1) Custom Post Type: programme
// ————————————————————————————————————————————————
add_action('init', function () {
    $labels = [
        'name'                  => 'Programmes',
        'singular_name'         => 'Programme',
        'menu_name'             => 'Programmes',
        'add_new'               => 'Ajouter',
        'add_new_item'          => 'Ajouter un programme',
        'edit_item'             => 'Modifier le programme',
        'new_item'              => 'Nouveau programme',
        'view_item'             => 'Voir le programme',
        'view_items'            => 'Voir les programmes',
        'search_items'          => 'Rechercher un programme',
        'not_found'             => 'Aucun programme trouvé',
        'not_found_in_trash'    => 'Aucun programme trouvé dans la corbeille',
        'all_items'             => 'Tous les programmes',
        'featured_image'        => 'Image mise en avant',
        'set_featured_image'    => 'Définir l\'image mise en avant',
        'remove_featured_image' => 'Retirer l\'image mise en avant',
        'use_featured_image'    => 'Utiliser comme image mise en avant',
    ];

    register_post_type('programme', [
        'labels'       => $labels,
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'programmes',
        'menu_icon'    => 'dashicons-palmtree',
        'supports'     => ['title', 'thumbnail'],
    ]);
});

// ————————————————————————————————————————————————
// 2) Champs ACF / Secure Custom Fields
// ————————————————————————————————————————————————
// NB: this file may run as a mu-plugin, which loads BEFORE normal plugins —
// so the function_exists check must happen inside the hook, not at file scope.
add_action('acf/init', function () {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group([
            'key'           => 'group_programme',
            'title'         => 'Détails du programme',
            'show_in_rest'  => true,
            'location'      => [
                [
                    [
                        'param'    => 'post_type',
                        'operator' => '==',
                        'value'    => 'programme',
                    ],
                ],
            ],
            'fields' => [
                [
                    'key'           => 'field_prog_type',
                    'name'          => 'type',
                    'label'         => 'Type de programme',
                    'type'          => 'select',
                    'instructions'  => 'Voyage organisé (départ groupé) ou Circuit (itinéraire sur mesure).',
                    'choices'       => [
                        'voyage'  => 'Voyage organisé',
                        'circuit' => 'Circuit',
                    ],
                    'default_value' => 'voyage',
                    'return_format' => 'value',
                    'required'      => 1,
                ],
                [
                    'key'           => 'field_prog_featured_hero',
                    'name'          => 'featured_hero',
                    'label'         => 'À la une (hero)',
                    'type'          => 'true_false',
                    'instructions'  => "Afficher ce programme dans le grand carrousel en haut de la page d'accueil.",
                    'ui'            => 1,
                    'default_value' => 0,
                ],
                [
                    'key'           => 'field_prog_featured_home',
                    'name'          => 'featured_home',
                    'label'         => 'Programme vedette',
                    'type'          => 'true_false',
                    'instructions'  => "Mettre ce programme en avant dans la section « Voyages organisés » de la page d'accueil.",
                    'ui'            => 1,
                    'default_value' => 0,
                ],
                [
                    'key'           => 'field_prog_deal',
                    'name'          => 'deal',
                    'label'         => 'Bon plan',
                    'type'          => 'true_false',
                    'instructions'  => "Afficher ce programme dans « Bons plans » avec un badge Promo.",
                    'ui'            => 1,
                    'default_value' => 0,
                ],
                [
                    'key'          => 'field_prog_old_price',
                    'name'         => 'old_price',
                    'label'        => 'Ancien prix',
                    'type'         => 'text',
                    'instructions' => 'Facultatif — barré à côté du nouveau prix. Ex : "13 900 dh".',
                    'conditional_logic' => [[[
                        'field'    => 'field_prog_deal',
                        'operator' => '==',
                        'value'    => '1',
                    ]]],
                ],
                [
                    'key'          => 'field_prog_subtitle',
                    'name'         => 'subtitle',
                    'label'        => 'Sous-titre',
                    'type'         => 'text',
                    'instructions' => "Une phrase d'accroche, ex : Istanbul, la mer Noire et les paysages de Marmara",
                ],
                [
                    'key'          => 'field_prog_duration',
                    'name'         => 'duration',
                    'label'        => 'Durée',
                    'type'         => 'text',
                    'instructions' => 'ex "8 jours / 7 nuits"',
                ],
                [
                    'key'          => 'field_prog_dates_label',
                    'name'         => 'dates_label',
                    'label'        => 'Période',
                    'type'         => 'text',
                    'instructions' => 'ex "Août 2026"',
                ],
                [
                    'key'          => 'field_prog_price',
                    'name'         => 'price',
                    'label'        => 'Prix à partir de',
                    'type'         => 'text',
                    'instructions' => 'ex "9 200 dh"',
                ],
                [
                    'key'   => 'field_prog_price_note',
                    'name'  => 'price_note',
                    'label' => 'Note sous le prix',
                    'type'  => 'text',
                ],
                [
                    'key'          => 'field_prog_region',
                    'name'         => 'region',
                    'label'        => 'Région',
                    'type'         => 'text',
                    'instructions' => 'ex "Turquie"',
                ],
                [
                    'key'   => 'field_prog_airline',
                    'name'  => 'airline',
                    'label' => 'Compagnie aérienne',
                    'type'  => 'text',
                ],
                [
                    'key'          => 'field_prog_overview',
                    'name'         => 'overview',
                    'label'        => 'Présentation du voyage',
                    'type'         => 'textarea',
                    'rows'         => 4,
                ],
                [
                    'key'          => 'field_prog_route',
                    'name'         => 'route',
                    'label'        => 'Itinéraire (villes)',
                    'type'         => 'repeater',
                    'button_label' => 'Ajouter une ville',
                    'sub_fields'   => [
                        [
                            'key'   => 'field_prog_route_city',
                            'name'  => 'city',
                            'label' => 'Ville',
                            'type'  => 'text',
                        ],
                    ],
                ],
                [
                    'key'          => 'field_prog_highlights',
                    'name'         => 'highlights',
                    'label'        => 'Points forts',
                    'type'         => 'repeater',
                    'sub_fields'   => [
                        [
                            'key'  => 'field_prog_highlights_text',
                            'name' => 'text',
                            'type' => 'text',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_included',
                    'name'       => 'included',
                    'label'      => 'Le prix comprend',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'  => 'field_prog_included_text',
                            'name' => 'text',
                            'type' => 'text',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_not_included',
                    'name'       => 'not_included',
                    'label'      => 'Le prix ne comprend pas',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'  => 'field_prog_not_included_text',
                            'name' => 'text',
                            'type' => 'text',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_options',
                    'name'       => 'options',
                    'label'      => 'En option (excursions...)',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'  => 'field_prog_options_text',
                            'name' => 'text',
                            'type' => 'text',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_notes',
                    'name'       => 'notes',
                    'label'      => 'Bon à savoir (bagages, paiement, annulation...)',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'  => 'field_prog_notes_text',
                            'name' => 'text',
                            'type' => 'text',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_departures',
                    'name'       => 'departures',
                    'label'      => 'Dates de départ',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'          => 'field_prog_departures_label',
                            'name'         => 'label',
                            'label'        => 'Dates',
                            'type'         => 'text',
                            'instructions' => 'ex "05/08 → 14/08/2026"',
                        ],
                    ],
                ],
                [
                    'key'        => 'field_prog_hebergement',
                    'name'       => 'hebergement',
                    'label'      => 'Hébergement',
                    'type'       => 'repeater',
                    'sub_fields' => [
                        [
                            'key'   => 'field_prog_hebergement_city',
                            'name'  => 'city',
                            'label' => 'Ville',
                            'type'  => 'text',
                        ],
                        [
                            'key'   => 'field_prog_hebergement_nights',
                            'name'  => 'nights',
                            'label' => 'Nuits',
                            'type'  => 'text',
                        ],
                        [
                            'key'   => 'field_prog_hebergement_hotels',
                            'name'  => 'hotels',
                            'label' => 'Hôtels',
                            'type'  => 'text',
                        ],
                    ],
                ],
                [
                    'key'          => 'field_prog_itinerary',
                    'name'         => 'itinerary',
                    'label'        => 'Programme jour par jour',
                    'type'         => 'repeater',
                    'button_label' => 'Ajouter un jour',
                    'sub_fields'   => [
                        [
                            'key'          => 'field_prog_itinerary_day',
                            'name'         => 'day',
                            'label'        => 'Jour',
                            'type'         => 'text',
                            'instructions' => 'ex "Jour 1"',
                        ],
                        [
                            'key'   => 'field_prog_itinerary_title',
                            'name'  => 'title',
                            'label' => 'Titre',
                            'type'  => 'text',
                        ],
                        [
                            'key'   => 'field_prog_itinerary_description',
                            'name'  => 'description',
                            'label' => 'Description',
                            'type'  => 'textarea',
                            'rows'  => 3,
                        ],
                        [
                            'key'           => 'field_prog_itinerary_meals',
                            'name'          => 'meals',
                            'label'         => 'Repas inclus',
                            'type'          => 'checkbox',
                            'choices'       => [
                                'pdj'   => 'Petit déjeuner',
                                'dej'   => 'Déjeuner',
                                'diner' => 'Dîner',
                            ],
                            'return_format' => 'value',
                        ],
                    ],
                ],
                [
                    'key'          => 'field_prog_price_tables',
                    'name'         => 'price_tables',
                    'label'        => 'Tableaux de prix',
                    'type'         => 'repeater',
                    'button_label' => 'Ajouter un tableau',
                    'sub_fields'   => [
                        [
                            'key'          => 'field_prog_price_tables_title',
                            'name'         => 'title',
                            'label'        => 'Titre',
                            'type'         => 'text',
                            'instructions' => 'ex "Prix par personne (dh)"',
                        ],
                        [
                            'key'   => 'field_prog_price_tables_dates',
                            'name'  => 'dates',
                            'label' => 'Dates du tableau',
                            'type'  => 'text',
                        ],
                        [
                            'key'          => 'field_prog_price_tables_first_column_label',
                            'name'         => 'first_column_label',
                            'label'        => 'Libellé 1ère colonne',
                            'type'         => 'text',
                            'instructions' => 'Hôtel / Formule',
                        ],
                        [
                            'key'          => 'field_prog_price_tables_columns',
                            'name'         => 'columns',
                            'label'        => 'Colonnes de prix',
                            'type'         => 'repeater',
                            'sub_fields'   => [
                                [
                                    'key'          => 'field_prog_price_tables_columns_label',
                                    'name'         => 'label',
                                    'label'        => 'Titre colonne',
                                    'type'         => 'text',
                                    'instructions' => 'ex "Chambre double"',
                                ],
                                [
                                    'key'           => 'field_prog_price_tables_columns_role',
                                    'name'          => 'role',
                                    'label'         => "Rôle (pour l'estimateur de prix)",
                                    'type'          => 'select',
                                    'choices'       => [
                                        'adultDouble' => 'Adulte ch. double',
                                        'adultTriple' => 'Adulte ch. triple',
                                        'suppSingle'  => 'Supplément single',
                                        'totalSingle' => 'Prix single (total)',
                                        'child'       => 'Enfant',
                                    ],
                                    'return_format' => 'value',
                                ],
                                [
                                    'key'          => 'field_prog_price_tables_columns_child_max_age',
                                    'name'         => 'child_max_age',
                                    'label'        => 'Âge max enfant',
                                    'type'         => 'number',
                                    'instructions' => 'Seulement si Rôle = Enfant',
                                ],
                                [
                                    'key'          => 'field_prog_price_tables_columns_child_ordinal',
                                    'name'         => 'child_ordinal',
                                    'label'        => "N° d'enfant (1er, 2e...)",
                                    'type'         => 'number',
                                    'instructions' => 'Seulement si plusieurs colonnes Enfant du même âge',
                                ],
                            ],
                        ],
                        [
                            'key'          => 'field_prog_price_tables_rows',
                            'name'         => 'rows',
                            'label'        => 'Lignes (hôtels/formules)',
                            'type'         => 'repeater',
                            'sub_fields'   => [
                                [
                                    'key'   => 'field_prog_price_tables_rows_label',
                                    'name'  => 'label',
                                    'label' => 'Nom hôtel / formule',
                                    'type'  => 'text',
                                ],
                                [
                                    'key'   => 'field_prog_price_tables_rows_sub_label',
                                    'name'  => 'sub_label',
                                    'label' => 'Sous-titre (ex: petit déjeuner inclus)',
                                    'type'  => 'text',
                                ],
                                [
                                    'key'          => 'field_prog_price_tables_rows_cells',
                                    'name'         => 'cells',
                                    'label'        => 'Prix (une case par colonne, dans le même ordre)',
                                    'type'         => 'repeater',
                                    'sub_fields'   => [
                                        [
                                            'key'          => 'field_prog_price_tables_rows_cells_value',
                                            'name'         => 'value',
                                            'label'        => 'Prix',
                                            'type'         => 'text',
                                            'instructions' => 'ex 15 900 — laisser vide ou — si non disponible',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                [
                    'key'          => 'field_prog_flights',
                    'name'         => 'flights',
                    'label'        => 'Détails des vols',
                    'type'         => 'repeater',
                    'button_label' => 'Ajouter un départ',
                    'sub_fields'   => [
                        [
                            'key'          => 'field_prog_flights_title',
                            'name'         => 'title',
                            'label'        => 'Titre',
                            'type'         => 'text',
                            'instructions' => 'ex "1er départ — du 05 au 14 août 2026"',
                        ],
                        [
                            'key'        => 'field_prog_flights_legs',
                            'name'       => 'legs',
                            'label'      => 'Vols',
                            'type'       => 'repeater',
                            'sub_fields' => [
                                [
                                    'key'          => 'field_prog_flights_legs_route',
                                    'name'         => 'route',
                                    'label'        => 'Trajet',
                                    'type'         => 'text',
                                    'instructions' => 'ex "Casablanca / Le Caire"',
                                ],
                                [
                                    'key'   => 'field_prog_flights_legs_date',
                                    'name'  => 'date',
                                    'label' => 'Date',
                                    'type'  => 'text',
                                ],
                                [
                                    'key'   => 'field_prog_flights_legs_flight_no',
                                    'name'  => 'flight_no',
                                    'label' => 'N° de vol',
                                    'type'  => 'text',
                                ],
                                [
                                    'key'   => 'field_prog_flights_legs_departure',
                                    'name'  => 'departure',
                                    'label' => 'Heure départ',
                                    'type'  => 'text',
                                ],
                                [
                                    'key'   => 'field_prog_flights_legs_arrival',
                                    'name'  => 'arrival',
                                    'label' => 'Heure arrivée',
                                    'type'  => 'text',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
});

/* ————————————————————————————————————————————————————————————————
 * Réglages « Page d'accueil » — le client choisit les sections visibles
 * sur la page d'accueil du site (le frontend lit /travel-cms/v1/home).
 * ———————————————————————————————————————————————————————————————— */

function travel_cms_home_section_labels() {
    return [
        'omra'     => 'Section OMRA & Hajj',
        'voyages'  => 'Section Voyages organisés',
        'circuits' => 'Section Circuit au Maroc',
        'cruises'  => 'Section Croisières',
        'languageStays' => 'Section Séjours linguistiques',
        'greatDeals'    => 'Section Bons plans',
        'mice'     => 'Section MICE (entreprises)',
        'partners' => 'Section Nos partenaires',
    ];
}

add_action('admin_menu', function () {
    add_menu_page(
        "Page d'accueil",
        "Page d'accueil",
        'manage_options',
        'travel-home',
        'travel_cms_render_home_settings',
        'dashicons-admin-home',
        21
    );
});

add_action('admin_init', function () {
    register_setting('travel_home', 'travel_home_sections', [
        'type'              => 'array',
        'sanitize_callback' => function ($value) {
            $out = [];
            foreach (array_keys(travel_cms_home_section_labels()) as $key) {
                $out[$key] = !empty($value[$key]);
            }
            return $out;
        },
    ]);
});

function travel_cms_render_home_settings() {
    $labels = travel_cms_home_section_labels();
    // Jamais enregistré → tout coché par défaut (comportement automatique du site)
    $saved  = get_option('travel_home_sections', null);
    ?>
    <div class="wrap">
        <h1>Page d'accueil</h1>
        <p>Cochez les sections à afficher sur la page d'accueil du site. Les sections décochées restent accessibles depuis le menu — seule la page d'accueil change.</p>
        <form method="post" action="options.php">
            <?php settings_fields('travel_home'); ?>
            <table class="form-table" role="presentation">
                <?php foreach ($labels as $key => $label) :
                    $checked = is_array($saved) ? !empty($saved[$key]) : true; ?>
                    <tr>
                        <th scope="row"><?php echo esc_html($label); ?></th>
                        <td>
                            <label>
                                <input type="checkbox"
                                       name="travel_home_sections[<?php echo esc_attr($key); ?>]"
                                       value="1" <?php checked($checked); ?> />
                                Afficher sur la page d'accueil
                            </label>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </table>
            <?php submit_button('Enregistrer'); ?>
        </form>
    </div>
    <?php
}

add_action('rest_api_init', function () {
    register_rest_route('travel-cms/v1', '/home', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $saved = get_option('travel_home_sections', null);
            if (!is_array($saved)) {
                // Client jamais passé par les réglages → le frontend garde
                // son comportement automatique.
                return ['configured' => false, 'sections' => null];
            }
            $sections = [];
            foreach (array_keys(travel_cms_home_section_labels()) as $key) {
                $sections[$key] = !empty($saved[$key]);
            }
            return ['configured' => true, 'sections' => $sections];
        },
    ]);
});

/* ————————————————————————————————————————————————————————————————
 * CPT « omra » — برامج العمرة والحج (contenu arabe, affiché en RTL)
 * ———————————————————————————————————————————————————————————————— */

add_action('init', function () {
    register_post_type('omra', [
        'labels' => [
            'name'          => 'العمرة والحج',
            'singular_name' => 'برنامج عمرة/حج',
            'menu_name'     => 'العمرة والحج',
            'add_new'       => 'إضافة برنامج',
            'add_new_item'  => 'إضافة برنامج جديد',
            'edit_item'     => 'تعديل البرنامج',
            'all_items'     => 'كل البرامج',
            'featured_image'        => 'صورة البرنامج',
            'set_featured_image'    => 'تحديد صورة البرنامج',
            'remove_featured_image' => 'إزالة صورة البرنامج',
        ],
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'omra-programmes',
        'menu_icon'    => 'dashicons-star-filled',
        'supports'     => ['title', 'thumbnail'],
    ]);
});

add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }
    acf_add_local_field_group([
        'key'          => 'group_omra',
        'title'        => 'تفاصيل البرنامج',
        'show_in_rest' => true,
        'location'     => [[[
            'param'    => 'post_type',
            'operator' => '==',
            'value'    => 'omra',
        ]]],
        'fields' => [
            [
                'key'           => 'field_omra_category',
                'name'          => 'category',
                'label'         => 'نوع البرنامج',
                'type'          => 'select',
                'instructions'  => 'عمرة أو حج — يحدد تحت أي اختيار يظهر البرنامج في الموقع',
                'choices'       => [
                    'omra' => 'عمرة',
                    'hajj' => 'حج',
                ],
                'default_value' => 'omra',
                'return_format' => 'value',
                'required'      => 1,
            ],
            [
                'key'          => 'field_omra_short_title',
                'name'         => 'short_title',
                'label'        => 'العنوان المختصر',
                'type'         => 'text',
                'instructions' => 'مثال: عمرة صفر 1448',
                'required'     => 1,
            ],
            [
                'key'          => 'field_omra_price_from',
                'name'         => 'price_from',
                'label'        => 'السعر ابتداءً من',
                'type'         => 'text',
                'instructions' => 'مثال: 20 900 درهم',
                'required'     => 1,
            ],
            [
                'key'          => 'field_omra_flight_route',
                'name'         => 'flight_route',
                'label'        => 'وصف الرحلة (سطر قصير)',
                'type'         => 'text',
                'instructions' => 'مثال: رحلة على متن الخطوط الملكية المغربية مباشرة إلى مطار المدينة المنورة',
            ],
            [
                'key'          => 'field_omra_duration',
                'name'         => 'duration',
                'label'        => 'المدة',
                'type'         => 'text',
                'instructions' => 'مثال: 13 ليلة — 05 ليالٍ بالمدينة المنورة و 08 ليالٍ بمكة المكرمة',
            ],
            [
                'key'          => 'field_omra_flight',
                'name'         => 'flight',
                'label'        => 'الطيران',
                'type'         => 'text',
                'instructions' => 'مثال: الخطوط الملكية المغربية — رحلة مباشرة إلى المدينة المنورة',
            ],
            [
                'key'          => 'field_omra_dates',
                'name'         => 'dates',
                'label'        => 'التواريخ',
                'type'         => 'repeater',
                'button_label' => 'إضافة تاريخ',
                'sub_fields'   => [[
                    'key'   => 'field_omra_dates_label',
                    'name'  => 'label',
                    'label' => 'التاريخ',
                    'type'  => 'text',
                ]],
            ],
            [
                'key'          => 'field_omra_description',
                'name'         => 'description',
                'label'        => 'وصف البرنامج',
                'type'         => 'textarea',
                'rows'         => 6,
                'instructions' => 'كل فقرة في سطر مستقل',
            ],
            [
                'key'          => 'field_omra_tables',
                'name'         => 'tables',
                'label'        => 'جداول الأسعار',
                'type'         => 'repeater',
                'button_label' => 'إضافة جدول',
                'sub_fields'   => [
                    [
                        'key'          => 'field_omra_tables_name',
                        'name'         => 'name',
                        'label'        => 'عنوان الجدول',
                        'type'         => 'text',
                        'instructions' => 'مثال: سعر الفرد في الغرفة',
                    ],
                    [
                        'key'          => 'field_omra_tables_tag',
                        'name'         => 'tag',
                        'label'        => 'الشارة',
                        'type'         => 'text',
                        'instructions' => 'مثال: عمرة / سياحي / ممتاز',
                    ],
                    [
                        'key'          => 'field_omra_tables_rows',
                        'name'         => 'rows',
                        'label'        => 'الأسطر (الفنادق)',
                        'type'         => 'repeater',
                        'button_label' => 'إضافة سطر',
                        'sub_fields'   => [
                            [
                                'key'   => 'field_omra_tables_rows_label',
                                'name'  => 'label',
                                'label' => 'الفندق / الصيغة',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_omra_tables_rows_sub',
                                'name'  => 'sub_label',
                                'label' => 'ملاحظة صغيرة',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_omra_tables_rows_quint',
                                'name'  => 'quint',
                                'label' => 'الخماسية',
                                'type'  => 'text',
                                'instructions' => 'اختياري — اتركه فارغًا إذا لم تكن متوفرة.',
                            ],
                            [
                                'key'   => 'field_omra_tables_rows_quad',
                                'name'  => 'quad',
                                'label' => 'الرباعية',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_omra_tables_rows_triple',
                                'name'  => 'triple',
                                'label' => 'الثلاثية',
                                'type'  => 'text',
                            ],
                            [
                                'key'   => 'field_omra_tables_rows_double',
                                'name'  => 'double',
                                'label' => 'الثنائية',
                                'type'  => 'text',
                            ],
                        ],
                    ],
                ],
            ],
            [
                'key'          => 'field_omra_includes',
                'name'         => 'includes',
                'label'        => 'يشمل البرنامج',
                'type'         => 'repeater',
                'button_label' => 'إضافة عنصر',
                'sub_fields'   => [[
                    'key'   => 'field_omra_includes_text',
                    'name'  => 'text',
                    'label' => 'العنصر',
                    'type'  => 'text',
                ]],
            ],
            [
                'key'          => 'field_omra_gallery',
                'name'         => 'gallery',
                'label'        => 'صور البرنامج',
                'instructions' => 'اختياري — صور خاصة بهذا البرنامج. إذا تُركت فارغة سيعرض الموقع صور المعرض المشترك.',
                'type'         => 'repeater',
                'layout'       => 'table',
                'button_label' => 'إضافة صورة',
                'sub_fields'   => [[
                    'key'           => 'field_omra_gallery_image',
                    'name'          => 'image',
                    'label'         => 'الصورة',
                    'type'          => 'image',
                    'return_format' => 'url',
                    'preview_size'  => 'thumbnail',
                    'library'       => 'all',
                ]],
            ],
            [
                'key'          => 'field_omra_notes',
                'name'         => 'notes',
                'label'        => 'ملاحظات هامة',
                'type'         => 'repeater',
                'button_label' => 'إضافة ملاحظة',
                'sub_fields'   => [[
                    'key'   => 'field_omra_notes_text',
                    'name'  => 'text',
                    'label' => 'الملاحظة',
                    'type'  => 'text',
                ]],
            ],
        ],
    ]);
});

// ————————————————————————————————————————————————
// 6) Galerie photos de la section OMRA & Hajj — CPT « photo »
// ————————————————————————————————————————————————
// Une photo = un article : l'image mise en avant EST la photo, le titre sert
// de légende. « page-attributes » donne le champ Ordre, qui permet au client
// Libellés en arabe, comme le CPT omra : cette galerie vit dans la section
// العمرة والحج du site, pas dans le menu principal.
// de ranger ses photos (le front trie par menu_order croissant).
add_action('init', function () {
    $labels = [
        'name'                  => 'معرض الصور',
        'singular_name'         => 'صورة',
        'menu_name'             => 'معرض الصور',
        'add_new'               => 'إضافة',
        'add_new_item'          => 'إضافة صورة',
        'edit_item'             => 'تعديل الصورة',
        'new_item'              => 'صورة جديدة',
        'view_item'             => 'عرض الصورة',
        'view_items'            => 'عرض الصور',
        'search_items'          => 'البحث عن صورة',
        'not_found'             => 'لا توجد صور',
        'not_found_in_trash'    => 'لا توجد صور في سلة المهملات',
        'all_items'             => 'كل الصور',
        'featured_image'        => 'الصورة',
        'set_featured_image'    => 'اختيار الصورة',
        'remove_featured_image' => 'إزالة الصورة',
        'use_featured_image'    => 'استعمال كصورة',
    ];

    register_post_type('photo', [
        'labels'       => $labels,
        'public'       => true,
        'has_archive'  => false,
        'show_in_rest' => true,
        'rest_base'    => 'galerie-photos',
        'menu_icon'    => 'dashicons-format-gallery',
        'supports'     => ['title', 'thumbnail', 'page-attributes'],
    ]);
});

// Champ « Lieu » (facultatif) affiché sous la légende.
add_action('acf/init', function () {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key'           => 'group_photo',
        'title'         => 'تفاصيل الصورة',
        'location'      => [[['param' => 'post_type', 'operator' => '==', 'value' => 'photo']]],
        'show_in_rest'  => true,
        'menu_order'    => 0,
        'position'      => 'normal',
        'style'         => 'default',
        'fields'        => [
            [
                'key'           => 'field_photo_lieu',
                'name'          => 'lieu',
                'label'         => 'المكان',
                'type'          => 'text',
                'instructions'  => 'اختياري — يظهر بخط صغير تحت التعليق. مثال: مكة المكرمة.',
                'show_in_rest'  => true,
            ],
        ],
    ]);
});

// Colonne « Photo » dans la liste d'admin : le client voit ses vignettes
// au lieu d'une liste de titres.
add_filter('manage_photo_posts_columns', function ($cols) {
    return ['cb' => $cols['cb'], 'travel_thumb' => 'الصورة'] + $cols;
});

add_action('manage_photo_posts_custom_column', function ($col, $post_id) {
    if ($col === 'travel_thumb') {
        echo has_post_thumbnail($post_id)
            ? get_the_post_thumbnail($post_id, [80, 80], ['style' => 'border-radius:6px;object-fit:cover;'])
            : '—';
    }
}, 10, 2);
