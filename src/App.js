import React, { Component } from 'react';
import update from 'immutability-helper/index';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Alert } from 'reactstrap';
import './App.css';
import Pusher from 'pusher-js';

class App extends Component {

	constructor() {
		super()

		let that = this;

		// Bitstamp REST wrapper test - working
		let BitstampREST = require('bitstamp');
		let bitstamp = new BitstampREST();
		bitstamp.transactions('btcusd', function(err, trades) {
			console.log(trades);
		});

		// Bitstamp Websockets test - working
		let BITSTAMP_PUSHER_KEY = 'de504dc5763aeef9ff52';
		let pusher = new Pusher(BITSTAMP_PUSHER_KEY);
		let tradesChannel = pusher.subscribe('live_trades');

		this.state = {
			btc_usd_trades: [],
		}

		tradesChannel.bind('trade', function (data) {
			console.log(data)
			let newData = update(that.state.btc_usd_trades, {
				$push: [data]
			});

			that.setState({
				btc_usd_trades: newData
			});
		});
	}

  render() {
    return (
		 <Container>

			 <Row>
				 <Col><h3>Bitstamp USD/BTC</h3>
					 <div>
						 {this.state.btc_usd_trades.length > 0 ? this.state.btc_usd_trades.map((trade, i) => {
								 return <Alert key={`btc_usd_trade${trade.id}`} color={trade.type ? 'danger' : 'success'}>
										 {trade.price}
								 </Alert>;
							 })
							 : 'Waiting for trades..'}
					 </div>
				 </Col>
				 <Col><h3>Poloniex USD/BTC</h3><div>poloniex price stream</div></Col>
				 <Col>.col</Col>
				 <Col>.col</Col>
			 </Row>

		 </Container>
    );
  }
}

export default App;
