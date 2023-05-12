import { useBlockProps } from '@wordpress/block-editor';
import { renderBlockTemplate } from './common';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return renderBlockTemplate( blockProps, attributes );
}
