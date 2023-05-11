import { createRoot } from '@wordpress/element';

export function renderBlockTemplate( blockProps, ticker, ratioID ) {
	return (
		<div { ...blockProps }>
			{ /* IMPORTANT: don't remove this container div. we need to call createRoot() below not on the root element, that
      React uses as the root element of the block. At some point it will remove the root element, but can't because
      I don't know, perhaps the createRoot() already registered a removal callback or so.
      */ }
			<div>
				<div className="ticker">{ ticker }</div>
				<div className="ratio-id">{ ratioID }</div>
			</div>
		</div>
	);
}

export async function createBlock( element ) {
	const attributes = getAttributes( element );
	if ( ! attributes ) {
		// it's rendered already
		return {};
	}

	let root;
	let err;

	try {
		root = createRoot( element.childNodes[ 0 ] ); // IMPORTANT: we need to select the container div here, not the direct root
		const data = await fetchData( attributes.ticker, attributes.ratioID );
		root.render( renderBlock( data ) );
	} catch ( e ) {
		err = e;
	}

	return { root, err };
}

export function getAttributes( element ) {
	let ticker = element.querySelector( '.ticker' );
	if ( ! ticker ) {
		return undefined;
	}

	ticker = ticker.innerText;
	if ( ! ticker ) {
		return undefined;
	}

	let ratioID = element.querySelector( '.ratio-id' );
	if ( ! ratioID ) {
		return undefined;
	}

	ratioID = ratioID.innerText;
	if ( ! ratioID ) {
		return undefined;
	}

	return { ticker, ratioID };
}

export async function fetchData( ticker, ratioID ) {
	const response = await fetch(
		`http://localhost:8081/market-data/1.0.0/external/wordpress/financial-ratio-block?ticker=${ ticker }&ratio_id=${ ratioID }`
	);

	if ( ! response.ok ) {
		let details = '';
		const body = await response.text();
		if ( body ) {
			details = ` Details: ${ body }`;
		}

		const err = new Error(
			`${ response.status } ${ response.statusText }${ details }`
		);
		err.status = response.status;
		throw err;
	}

	const returnedData = await response.json();

	return {
		ticker,
		ratioID,
    data: returnedData,
	};
}

export function renderBlock( data ) {
	return (
		<div>
			<div>{ data.ticker }</div>
			<div>{ data.data.title }</div>
			<div>{ data.data.subtitle }</div>
			{ renderRatioValue( data.data.value, data.data.unit ) }
		</div>
	);
}

function renderRatioValue( value, unit ) {
	if ( ! value ) {
		return <div>n/a</div>;
	}

	let unitOutput = '';
	if ( unit ) {
		unitOutput = ' ' + unit.name;
	}

	return (
		<div>
			{ value.value }
			{ unitOutput }
		</div>
	);
}
