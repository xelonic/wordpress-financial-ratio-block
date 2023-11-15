<?php
/**
 * Plugin Name:       Financial Ratio
 * Description:       A block that displays a financial ratio of a company.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.1.0
 * Author:            xelonic capital GmbH
 * Author URI:        https://xelonic.com
 * License:           GPL-3.0
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       financial-ratio
 *
 * @package           xelonic
 */

function create_block_financial_ratio_block_block_init() {
	register_block_type(
		__DIR__ . '/build',
	);
}

add_action( 'init', 'create_block_financial_ratio_block_block_init' );
