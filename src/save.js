import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className="ticker">{ attributes.ticker }</div>
			<div className="ratio-id">{ attributes.ratio_id }</div>
		</div>
	);
}
