<?php
/**
 * Template: Affichage des cartes cadeaux (style premium)
 *
 * Shortcode: [mpgc_gift_cards]
 *
 * @package MonPilates_GiftCards
 */

defined( 'ABSPATH' ) || exit;

// Récupérer les produits cartes cadeaux
$args = array(
    'post_type'      => 'product',
    'posts_per_page' => -1,
    'meta_query'     => array(
        array(
            'key'   => '_mpgc_is_gift_card',
            'value' => 'yes',
        ),
    ),
    'orderby'        => 'meta_value_num',
    'meta_key'       => '_mpgc_sessions',
    'order'          => 'ASC',
);

$products = get_posts( $args );

if ( empty( $products ) ) {
    echo '<p>Aucune carte cadeau disponible pour le moment.</p>';
    return;
}

// Données pour chaque carte
$cards_config = array(
    1 => array(
        'label'       => 'Pour commencer',
        'name'        => 'Carte Découverte',
        'tagline'     => 'Pour éveiller la curiosité',
        'description' => 'Idéale pour quelqu\'un qui n\'a jamais essayé le Pilates, ou qui hésite à se lancer. Une première séance en petit groupe, sans engagement, pour découvrir les bienfaits en douceur.',
        'features'    => array(
            '1 séance collective en petit groupe',
            'Tous niveaux bienvenus',
            'Matériel fourni',
        ),
        'validity'    => 'Valable 3 mois après activation',
        'featured'    => false,
    ),
    5 => array(
        'label'       => 'Le plus offert',
        'name'        => 'Carte Bien-Être',
        'tagline'     => 'Pour prendre une vraie pause',
        'description' => 'Cinq séances, c\'est le temps de ressentir les premiers changements : moins de tensions, plus de fluidité. Un cadeau qui accompagne sur plusieurs semaines.',
        'features'    => array(
            '5 séances collectives en petit groupe',
            'Progression à son rythme',
            'Suivi personnalisé',
        ),
        'validity'    => 'Valable 4 mois après activation',
        'featured'    => true,
        'badge'       => 'Coup de cœur',
    ),
    10 => array(
        'label'       => 'Pour durer',
        'name'        => 'Carte Équilibre',
        'tagline'     => 'Pour ancrer une nouvelle habitude',
        'description' => 'Le cadeau idéal pour quelqu\'un qui veut vraiment prendre soin de son corps sur la durée. Dix séances pour installer une pratique régulière et en récolter tous les bienfaits.',
        'features'    => array(
            '10 séances collectives en petit groupe',
            'Transformation durable',
            'Liberté totale sur le planning',
        ),
        'validity'    => 'Valable 6 mois après activation',
        'featured'    => false,
    ),
);

// Construire les données avec les produits WooCommerce
$cards_data = array();
foreach ( $products as $post ) {
    $product  = wc_get_product( $post->ID );
    $sessions = (int) get_post_meta( $post->ID, '_mpgc_sessions', true );

    if ( ! isset( $cards_config[ $sessions ] ) ) {
        continue;
    }

    $config = $cards_config[ $sessions ];
    // URL directe vers le wizard checkout
    $cart_url = add_query_arg( 'add-to-cart', $product->get_id(), wc_get_checkout_url() );
    $cards_data[] = array(
        'product'     => $product,
        'sessions'    => $sessions,
        'price'       => $product->get_price(),
        'url'         => $cart_url,
        'label'       => $config['label'],
        'name'        => $config['name'],
        'tagline'     => $config['tagline'],
        'description' => $config['description'],
        'features'    => $config['features'],
        'validity'    => $config['validity'],
        'featured'    => $config['featured'],
        'badge'       => isset( $config['badge'] ) ? $config['badge'] : '',
    );
}
?>

<div class="mp-gift-cards__grid">

    <?php foreach ( $cards_data as $card ) : ?>
    <div class="mp-gift-card <?php echo $card['featured'] ? 'mp-gift-card--featured' : ''; ?>">
        <?php if ( $card['badge'] ) : ?>
        <div class="mp-gift-card__badge"><?php echo esc_html( $card['badge'] ); ?></div>
        <?php endif; ?>

        <div class="mp-gift-card__header">
            <span class="mp-gift-card__label"><?php echo esc_html( $card['label'] ); ?></span>
            <h3 class="mp-gift-card__name"><?php echo esc_html( $card['name'] ); ?></h3>
            <p class="mp-gift-card__tagline"><?php echo esc_html( $card['tagline'] ); ?></p>
        </div>

        <div class="mp-gift-card__body">
            <p class="mp-gift-card__description">
                <?php echo esc_html( $card['description'] ); ?>
            </p>
            <ul class="mp-gift-card__features">
                <?php foreach ( $card['features'] as $feature ) : ?>
                <li><?php echo esc_html( $feature ); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="mp-gift-card__footer">
            <div class="mp-gift-card__price">
                <span class="mp-gift-card__amount"><?php echo esc_html( number_format( $card['price'], 0, ',', ' ' ) ); ?></span>
                <span class="mp-gift-card__currency">€</span>
            </div>
            <a href="<?php echo esc_url( $card['url'] ); ?>" class="mp-gift-card__cta">
                Offrir cette carte
            </a>
            <span class="mp-gift-card__validity"><?php echo esc_html( $card['validity'] ); ?></span>
        </div>
    </div>
    <?php endforeach; ?>

</div>
