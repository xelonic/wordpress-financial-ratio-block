<?php
/**
 * Plugin Name:       Financial Ratio
 * Description:       A block that displays a financial ratio of a company.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       xelonic-financial-ratio-block
 *
 * @package           xelonic
 */

function create_block_financial_ratio_block_block_init() {
	register_block_type(
		__DIR__ . '/build',
	);
}

add_action( 'init', 'create_block_financial_ratio_block_block_init' );
