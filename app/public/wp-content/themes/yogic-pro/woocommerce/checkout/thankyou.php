<?php
/**
 * Thankyou page - Mon Pilates
 *
 * Override WooCommerce pour une page de confirmation premium
 * avec téléchargement carte cadeau.
 *
 * @package MonPilates
 * @version 8.1.0
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="woocommerce-order">

	<?php
	if ( $order ) :

		do_action( 'woocommerce_before_thankyou', $order->get_id() );

		// Détecter si c'est une commande carte cadeau
		$is_gift_card = 'yes' === $order->get_meta( '_mpgc_is_gift_card_order' );
		$pdf_url      = '';
		if ( $is_gift_card && function_exists( 'MPGC' ) && MPGC()->pdf ) {
			$pdf_url = MPGC()->pdf->get_pdf_download_url( $order );
		}

		// Données de la commande
		$recipient_name = $order->get_meta( '_mpgc_recipient_name' );
		$total_sessions = $order->get_meta( '_mpgc_total_sessions' );
		$sessions_text  = $total_sessions == 1 ? '1 séance' : $total_sessions . ' séances';
	?>

		<?php if ( $order->has_status( 'failed' ) ) : ?>

			<p class="woocommerce-notice woocommerce-notice--error woocommerce-thankyou-order-failed">
				Votre paiement n'a pas pu être traité. Veuillez réessayer.
			</p>

			<p class="woocommerce-notice woocommerce-notice--error woocommerce-thankyou-order-failed-actions">
				<a href="<?php echo esc_url( $order->get_checkout_payment_url() ); ?>" class="button pay">Réessayer le paiement</a>
			</p>

		<?php elseif ( $is_gift_card ) : ?>

			<!-- ════════════════════════════════════════════
			     CONFIRMATION CARTE CADEAU - Design premium
			     ════════════════════════════════════════════ -->
			<div class="mp-thankyou">
				<div class="mp-thankyou__header">
					<div class="mp-thankyou__checkmark">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</div>
					<h2 class="mp-thankyou__title">Votre cadeau est prêt !</h2>
					<p class="mp-thankyou__subtitle">
						La carte cadeau <strong><?php echo esc_html( $sessions_text ); ?> de Pilates</strong>
						<?php if ( $recipient_name ) : ?>
							pour <strong><?php echo esc_html( $recipient_name ); ?></strong>
						<?php endif; ?>
						a été créée avec succès.
					</p>
				</div>

				<?php if ( $pdf_url ) : ?>
				<div class="mp-thankyou__download">
					<a href="<?php echo esc_url( $pdf_url ); ?>" class="mp-thankyou__download-btn" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
							<polyline points="7 10 12 15 17 10"/>
							<line x1="12" y1="15" x2="12" y2="3"/>
						</svg>
						Télécharger la carte cadeau
					</a>
					<p class="mp-thankyou__download-hint">
						Vous pouvez l'imprimer ou la transférer par email au bénéficiaire.
					</p>
				</div>
				<?php endif; ?>

				<div class="mp-thankyou__steps">
					<h3 class="mp-thankyou__steps-title">Et maintenant ?</h3>
					<div class="mp-thankyou__steps-grid">
						<div class="mp-thankyou__step">
							<div class="mp-thankyou__step-number">1</div>
							<div class="mp-thankyou__step-text">
								<strong>Imprimez</strong> la carte cadeau ou envoyez-la par email
							</div>
						</div>
						<div class="mp-thankyou__step">
							<div class="mp-thankyou__step-number">2</div>
							<div class="mp-thankyou__step-text">
								<strong>Le bénéficiaire contacte</strong> le studio pour réserver
							</div>
						</div>
						<div class="mp-thankyou__step">
							<div class="mp-thankyou__step-number">3</div>
							<div class="mp-thankyou__step-text">
								<strong>Les séances sont activées</strong> lors de la première venue
							</div>
						</div>
					</div>
				</div>

				<div class="mp-thankyou__details">
					<h3 class="mp-thankyou__details-title">Récapitulatif</h3>
					<div class="mp-thankyou__details-grid">
						<div class="mp-thankyou__detail">
							<span class="mp-thankyou__detail-label">N° de commande</span>
							<span class="mp-thankyou__detail-value">#<?php echo esc_html( $order->get_order_number() ); ?></span>
						</div>
						<div class="mp-thankyou__detail">
							<span class="mp-thankyou__detail-label">Date</span>
							<span class="mp-thankyou__detail-value"><?php echo esc_html( wc_format_datetime( $order->get_date_created() ) ); ?></span>
						</div>
						<div class="mp-thankyou__detail">
							<span class="mp-thankyou__detail-label">Total</span>
							<span class="mp-thankyou__detail-value"><?php echo $order->get_formatted_order_total(); ?></span>
						</div>
						<div class="mp-thankyou__detail">
							<span class="mp-thankyou__detail-label">Paiement</span>
							<span class="mp-thankyou__detail-value"><?php echo esc_html( $order->get_payment_method_title() ); ?></span>
						</div>
					</div>
				</div>

				<div class="mp-thankyou__email-notice">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
						<polyline points="22,6 12,13 2,6"/>
					</svg>
					<span>Un email de confirmation avec le lien de téléchargement a été envoyé à <strong><?php echo esc_html( $order->get_billing_email() ); ?></strong></span>
				</div>
			</div>

		<?php else : ?>

			<!-- Commande standard (non carte cadeau) -->
			<p class="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received">
				<?php
				echo apply_filters(
					'woocommerce_thankyou_order_received_text',
					esc_html__( 'Thank you. Your order has been received.', 'woocommerce' ),
					$order
				);
				?>
			</p>

			<ul class="woocommerce-order-overview woocommerce-thankyou-order-details order_details">
				<li class="woocommerce-order-overview__order order">
					<?php esc_html_e( 'Order number:', 'woocommerce' ); ?>
					<strong><?php echo $order->get_order_number(); ?></strong>
				</li>
				<li class="woocommerce-order-overview__date date">
					<?php esc_html_e( 'Date:', 'woocommerce' ); ?>
					<strong><?php echo wc_format_datetime( $order->get_date_created() ); ?></strong>
				</li>
				<?php if ( is_user_logged_in() && $order->get_user_id() === get_current_user_id() && $order->get_billing_email() ) : ?>
					<li class="woocommerce-order-overview__email email">
						<?php esc_html_e( 'Email:', 'woocommerce' ); ?>
						<strong><?php echo $order->get_billing_email(); ?></strong>
					</li>
				<?php endif; ?>
				<li class="woocommerce-order-overview__total total">
					<?php esc_html_e( 'Total:', 'woocommerce' ); ?>
					<strong><?php echo $order->get_formatted_order_total(); ?></strong>
				</li>
				<?php if ( $order->get_payment_method_title() ) : ?>
					<li class="woocommerce-order-overview__payment-method method">
						<?php esc_html_e( 'Payment method:', 'woocommerce' ); ?>
						<strong><?php echo wp_kses_post( $order->get_payment_method_title() ); ?></strong>
					</li>
				<?php endif; ?>
			</ul>

		<?php endif; ?>

		<?php do_action( 'woocommerce_thankyou_' . $order->get_payment_method(), $order->get_id() ); ?>
		<?php do_action( 'woocommerce_thankyou', $order->get_id() ); ?>

	<?php else : ?>

		<p class="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received">
			Merci ! Votre commande a bien été reçue.
		</p>

	<?php endif; ?>

</div>
