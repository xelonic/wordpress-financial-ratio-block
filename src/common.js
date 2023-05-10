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

		throw new Error(
			`${ response.status } ${ response.statusText }${ details }`
		);
	}

	return response.json();
}

export function renderBlock( data ) {
	return (
		<div>
			<div>{ data.ticker }</div>
			<div>{ data.title }</div>
			<div>{ data.subtitle }</div>
			{ renderRatioValue( data.value, data.unit ) }
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
