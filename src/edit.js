import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useRef, useLayoutEffect } from '@wordpress/element';
import { Placeholder, TextControl } from '@wordpress/components';
import { createBlock, renderBlockTemplate } from './common';
import MutationObserver from 'mutation-observer';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

function onDOMElementsChanged( mutationList ) {
	for ( const mutation of mutationList ) {
		switch ( mutation.type.toLowerCase().trim() ) {
			case 'childlist': {
				for ( const node of mutation.addedNodes ) {
					tryCreateBlock( node );
				}
				break;
			}
			case 'attributes': {
				tryCreateBlock( mutation.target );
				break;
			}
		}
	}
}

async function tryCreateBlock( node ) {
	if ( ! node.classList ) {
		return;
	}

	if (
		! node.classList.contains( 'wp-block-xelonic-financial-ratio-block' )
	) {
		return;
	}

	if ( node.classList.contains( 'is-selected' ) ) {
		return;
	}

	const { root, err } = await createBlock( node );
	if ( err ) {
		handleError( err, root );
	}
}

function handleError( err, root ) {
	let data = <div>error: { `${ err }` }</div>;

	if ( err.status === 404 ) {
		data = <div>error: ticker or ratio not found</div>;
	}

	root.render( data );
}

export default function Edit( { attributes, isSelected, setAttributes } ) {
	const ref = useRef( null );

	const blockProps = useBlockProps( { ref } );

	// the following idea is taken from https://wordpress.stackexchange.com/questions/391371/how-to-load-an-additional-script-for-a-block-in-the-block-editor/391399#391399?newreg=4fbf23f481494d328272395fc4c75bca
	//
	// initialize the mutation observer once the block is rendered.
	useLayoutEffect( () => {
		let observer = null;

		if ( ref.current ) {
			observer = new MutationObserver( onDOMElementsChanged );

			observer.observe( ref.current, {
				childList: true,
				subtree: true,
				attributes: true,
			} );

			tryCreateBlock( ref.current );
		}

		return () => {
			if ( observer ) {
				observer.disconnect();
			}
		};
	}, [] );

	const showEditor =
		isSelected || ! attributes.ticker || ! attributes.ratioID;

	if ( ! showEditor ) {
		return renderBlockTemplate(
			blockProps,
			attributes.ticker,
			attributes.ratioID
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
					value={ attributes.ratioID }
					onChange={ ( val ) => setAttributes( { ratioID: val } ) }
				/>
			</Placeholder>
		</div>
	);
}
