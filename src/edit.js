import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder, TextControl } from '@wordpress/components';
import { useState, useEffect } from 'react';
import { fetchData, renderBlock } from './common';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export default function Edit( { attributes, isSelected, setAttributes } ) {
	const blockProps = useBlockProps();

	const showEditor =
		isSelected || ! attributes.ticker || ! attributes.ratio_id;

	const [ ratio, setRatio ] = useState( [] );

	useEffect( () => {
		if ( showEditor ) {
			return;
		}

		async function fetchAndSave() {
			try {
				const data = await fetchData(
					attributes.ticker,
					attributes.ratio_id
				);
				setRatio( data );
			} catch ( err ) {
				setRatio( { error: err } );
			}
		}

		fetchAndSave();
	} );

	if ( ! showEditor ) {
		return (
			<div { ...blockProps }>
				{ ratio.error ? (
					<div>error: { `${ ratio.error }` }</div>
				) : (
					renderBlock( ratio )
				) }
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<Placeholder
				label={ __( 'Ticker', 'xelonic-financial-ratio-block' ) }
				instructions={ __(
					'Set your ticker',
					'xelonic-financial-ratio-block'
				) }
			>
				<TextControl
					value={ attributes.ticker }
					onChange={ ( val ) => setAttributes( { ticker: val } ) }
				/>
			</Placeholder>
			<Placeholder
				label={ __( 'Ratio ID', 'xelonic-financial-ratio-block' ) }
				instructions={ __(
					'Set the ratio ID',
					'xelonic-financial-ratio-block'
				) }
			>
				<TextControl
					value={ attributes.ratio_id }
					onChange={ ( val ) => setAttributes( { ratio_id: val } ) }
				/>
			</Placeholder>
		</div>
	);
}
