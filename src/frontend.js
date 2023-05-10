import { createRoot } from '@wordpress/element';
import { fetchData, renderBlock } from './common';

window.addEventListener( 'DOMContentLoaded', async () => {
	const elements = document.querySelectorAll(
		'.wp-block-xelonic-financial-ratio-block'
	);

	elements.forEach( createBlock );
} );

async function createBlock( element ) {
	const root = createRoot( element );

	try {
		const { ticker, ratioID } = getAttributes( element );
		const data = await fetchData( ticker, ratioID );
		root.render( renderBlock( data ) );
	} catch ( err ) {
		root.render( renderError() );
	}
}

function getAttributes( element ) {
	let ticker = element.querySelector( '.ticker' );
	if ( ! ticker ) {
		throw new Error( 'no ticker found on xelonic-financial-ratio-block' );
	}

	ticker = ticker.innerText;
	if ( ! ticker ) {
		throw new Error(
			'no ticker content found on xelonic-financial-ratio-block'
		);
	}

	let ratioID = element.querySelector( '.ratio-id' );
	if ( ! ratioID ) {
		throw new Error( 'no ratio-id found on xelonic-financial-ratio-block' );
	}

	ratioID = ratioID.innerText;
	if ( ! ratioID ) {
		throw new Error(
			'no ratio-id content found on xelonic-financial-ratio-block'
		);
	}

	return { ticker, ratioID };
}

function renderError() {
	return (
		<div>
			<span className="dashicons dashicons-warning"></span>
		</div>
	);
}
