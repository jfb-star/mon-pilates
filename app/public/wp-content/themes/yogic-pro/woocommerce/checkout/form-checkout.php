<?php
/**
 * Checkout Form - Mon Pilates Gift Card Wizard
 *
 * Override de checkout/form-checkout.php
 * Wizard 4 étapes pour les cartes cadeaux Pilates.
 *
 * @package MonPilates
 */

defined( 'ABSPATH' ) || exit;

// ── Données carte cadeau ──
$gift_data = array();
if ( WC()->cart ) {
	foreach ( WC()->cart->get_cart() as $cart_item ) {
		$pid = $cart_item['product_id'];
		if ( 'yes' === get_post_meta( $pid, '_mpgc_is_gift_card', true ) ) {
			$product      = wc_get_product( $pid );
			$sessions     = (int) get_post_meta( $pid, '_mpgc_sessions', true );
			$validity_map = array( 1 => '3 mois', 5 => '4 mois', 10 => '6 mois' );
			$gift_data    = array(
				'name'     => $product->get_name(),
				'sessions' => $sessions,
				'price'    => number_format( $product->get_price(), 0, ',', ' ' ),
				'validity' => isset( $validity_map[ $sessions ] ) ? $validity_map[ $sessions ] : '6 mois',
			);
			break;
		}
	}
}

// ── Retirer les champs cadeau du billing (on les rend dans le panel 2) ──
if ( function_exists( 'MPGC' ) && isset( MPGC()->checkout ) && MPGC()->checkout ) {
	remove_action( 'woocommerce_after_order_notes', array( MPGC()->checkout, 'add_gift_card_fields' ) );
}

// ── Actions WooCommerce standard ──
do_action( 'woocommerce_before_checkout_form', $checkout );

if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
	echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
	return;
}
?>

<form name="checkout" method="post" class="checkout woocommerce-checkout mp-checkout-wizard"
      action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

	<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

	<?php if ( ! empty( $gift_data ) ) : ?>

	<!-- ════════════════════════════════════════════
	     PANEL 1 : LE CADEAU
	     ════════════════════════════════════════════ -->
	<div class="mp-checkout-panel is-visible" data-step="1">
		<div class="mp-panel-header">
			<div class="mp-panel-header__icon">🎁</div>
			<h2 class="mp-panel-header__title">Votre cadeau</h2>
			<p class="mp-panel-header__desc">Voici ce que vous allez offrir</p>
		</div>

		<div class="mp-gift-summary">
			<div class="mp-gift-summary__visual">🎁</div>
			<div class="mp-gift-summary__details">
				<span class="mp-gift-summary__badge">Carte cadeau Pilates</span>
				<h3 class="mp-gift-summary__name"><?php echo esc_html( $gift_data['name'] ); ?></h3>
				<p class="mp-gift-summary__meta">
					<?php echo esc_html( $gift_data['sessions'] ); ?> séance<?php echo $gift_data['sessions'] > 1 ? 's' : ''; ?>
					· Valable <?php echo esc_html( $gift_data['validity'] ); ?> après activation
				</p>
			</div>
			<div class="mp-gift-summary__price">
				<span class="mp-gift-summary__amount"><?php echo esc_html( $gift_data['price'] ); ?></span>
				<span class="mp-gift-summary__currency">€</span>
			</div>
		</div>

		<div class="mp-gift-emotion">
			✨ Offrir du Pilates, c'est offrir un moment de bien-être face à la mer à Larmor-Plage.
		</div>

		<div class="mp-step-nav mp-step-nav--center">
			<button type="button" class="mp-btn-next" data-next="2">
				Continuer
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</button>
		</div>
	</div>

	<!-- ════════════════════════════════════════════
	     PANEL 2 : LE BÉNÉFICIAIRE
	     ════════════════════════════════════════════ -->
	<div class="mp-checkout-panel" data-step="2">
		<div class="mp-panel-header">
			<div class="mp-panel-header__icon">💌</div>
			<h2 class="mp-panel-header__title">Le bénéficiaire</h2>
			<p class="mp-panel-header__desc">À qui souhaitez-vous offrir cette carte ?</p>
		</div>

		<?php
		if ( function_exists( 'MPGC' ) && isset( MPGC()->checkout ) && MPGC()->checkout ) {
			MPGC()->checkout->add_gift_card_fields( $checkout );
		}
		?>

		<div class="mp-step-nav">
			<button type="button" class="mp-btn-prev" data-prev="1">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Retour
			</button>
			<button type="button" class="mp-btn-next" data-next="3">
				Continuer
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</button>
		</div>
	</div>

	<!-- ════════════════════════════════════════════
	     PANEL 3 : VOS COORDONNÉES
	     ════════════════════════════════════════════ -->
	<div class="mp-checkout-panel" data-step="3">
		<div class="mp-panel-header">
			<div class="mp-panel-header__icon">👤</div>
			<h2 class="mp-panel-header__title">Vos coordonnées</h2>
			<p class="mp-panel-header__desc">Informations pour la facturation</p>
		</div>

		<?php do_action( 'woocommerce_checkout_billing' ); ?>

		<div class="mp-step-nav">
			<button type="button" class="mp-btn-prev" data-prev="2">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Retour
			</button>
			<button type="button" class="mp-btn-next" data-next="4">
				Passer au paiement
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
			</button>
		</div>
	</div>

	<?php else : ?>

		<!-- Fallback : checkout standard si pas de carte cadeau -->
		<?php if ( $checkout->get_checkout_fields() ) : ?>
			<div class="col2-set" id="customer_details">
				<div class="col-1">
					<?php do_action( 'woocommerce_checkout_billing' ); ?>
				</div>
				<div class="col-2">
					<?php do_action( 'woocommerce_checkout_shipping' ); ?>
				</div>
			</div>
		<?php endif; ?>

	<?php endif; ?>

	<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

	<!-- ════════════════════════════════════════════
	     PANEL 4 : PAIEMENT
	     ════════════════════════════════════════════ -->
	<?php if ( ! empty( $gift_data ) ) : ?>
	<div class="mp-checkout-panel" data-step="4">
		<div class="mp-panel-header">
			<div class="mp-panel-header__icon">🔒</div>
			<h2 class="mp-panel-header__title">Paiement sécurisé</h2>
			<p class="mp-panel-header__desc">Plus qu'une étape pour finaliser votre cadeau</p>
		</div>

		<div class="mp-mini-recap">
			<span class="mp-mini-recap__product">🎁 <?php echo esc_html( $gift_data['name'] ); ?></span>
			<span class="mp-mini-recap__total"><?php echo esc_html( $gift_data['price'] ); ?> €</span>
		</div>

		<div id="order_review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
		</div>

		<div class="mp-step-nav">
			<button type="button" class="mp-btn-prev" data-prev="3">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Retour
			</button>
		</div>
	</div>
	<?php else : ?>
		<h3 id="order_review_heading"><?php esc_html_e( 'Your order', 'woocommerce' ); ?></h3>
		<div id="order_review" class="woocommerce-checkout-review-order">
			<?php do_action( 'woocommerce_checkout_order_review' ); ?>
		</div>
	<?php endif; ?>

	<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

</form>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
