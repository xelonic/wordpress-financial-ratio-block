<!--
export function render_widget(ticker, block_props, is_editor) {
  let fetch_error = false;
  let title = "";
  let subtitle = "";
  let value = null;
  let unit = null;

  useEffect(() => {
    const options = {
      method: "GET",
    };

    fetch(`http://localhost:8081/market-data/1.0.0/external/wordpress/financial-ratio-block?ticker=${ticker}&ratioID=market_cap`, options)
      .then((response) => response.json())
      .then((response) => {
        title = response.title;
        subtitle = response.subtitle;
        value = response.value;
        unit = response.unit;
      })
      .catch((err) => {
        fetch_error = true;
        console.error(err);
      });
  }, []);

  if (fetch_error) {
    return (
      <div { ...block_props }>
        <div>{ ticker }</div>
        { is_editor ? (<div>{ __('Failed to update data, please try again.', 'xelonic-financial-ratio-block') }</div>) : (<div><span class="dashicons dashicons-warning"></span></div>) }
      </div>
    );
  }

  return (
    <div { ...block_props }>
      <div>{ ticker }</div>
      <div>{ __( title, 'xelonic-financial-ratio-block') }</div>
      <div>{ __( subtitle, 'xelonic-financial-ratio-block') }</div>
      { render_ratio_value(value, unit) }
    </div>
  );
}

function render_ratio_value(value, unit) {
  if (!value) {
    return (<div>n/a</div>);
  }

  let unit_output = "";
  if (unit) {
    unit_output = " " + unit.name;
  }

  return (
    <div>{ value.value }{ unit_output }</div>
  );
}

-->
<?php
	$ticker = $attributes['ticker'];
	$ratioID = $attributes['ratioID'];

	$error = "";
	$response = wp_remote_get( "http://host.docker.internal:8081/market-data/1.0.0/external/wordpress/financial-ratio-block?ticker=$ticker&ratioID=$ratioID" );
	if (is_wp_error($response)) {
		$error = $response->get_error_message();
	}

	$body     = wp_remote_retrieve_body( $response );
?>

<div <?php echo get_block_wrapper_attributes(); ?>>
	<!-- <?php esc_html_e( 'Financial Ratio Block – hello from a dynamic block!', 'financial-ratio-block' ); ?> -->

	<div>ticker: <?= $ticker ?></div>
	<div>ratio ID: <?= $ratioID ?></div>
	<div>error: <?= $error ?></div>
	<div>response: <?= $body ?></div>
</div>
