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
			{ /* noreferrer: https://mathiasbynens.github.io/rel-noopener/#recommendations */ }
			<a href="https://xelonic.com" target="_blank" rel="noreferrer">
				<div className="title">
					<div className="ticker">{ data.ticker.toUpperCase() }</div>
					<div className="ratio">{ data.data.title }</div>
				</div>
			</a>
			<div className="subtitle">{ data.data.subtitle }</div>
			<div className="value">
				{ renderRatioValue( data.data.value, data.data.unit ) }
			</div>
		</div>
	);
}

function renderRatioValue( value, unit ) {
	if ( ! value ) {
		return <div>n/a</div>;
	}

	return <div>{ formatValue( value, unit ) }</div>;
}

function formatValue( value, unit ) {
	const options = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		notation: 'compact',
	};

	if ( value.is_percentage ) {
		options.style = 'percentage';
		options.notation = 'standard';
	}

	const currency = getCurrency( unit );
	if ( currency ) {
		options.style = 'currency';
		options.currency = currency;
	}

	return new Intl.NumberFormat( getLocale(), options ).format( value.value );
}

function getLocale() {
	if ( typeof Intl !== 'undefined' ) {
		try {
			return Intl.NumberFormat().resolvedOptions().locale;
		} catch ( err ) {
			// continue below
		}
	}

	if ( window.navigator.languages ) {
		return window.navigator.languages[ 0 ];
	}

	if ( window.navigator.userLanguage ) {
		return window.navigator.userLanguage;
	}

	return window.navigator.language;
}

function getCurrency( unit ) {
	if ( ! unit ) {
		return '';
	}

	if ( ! unit.name ) {
		return '';
	}

	const name = unit.name.toUpperCase().trim();

	if ( ! name.includes( 'ISO4217:' ) ) {
		return '';
	}

	return name.substring( name.indexOf( ':' ) + 1 );
}
