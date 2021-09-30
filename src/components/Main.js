import React, { Component } from 'react';
import BuyForm from './BuyForm'
import SellForm from './SellForm'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy',
      buy_btn_active: true,
      sell_btn_active: false
    }
  }

  render() {
    let content
    if (this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />

    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
      />


    }
    let buy_btn_class = this.state.buy_btn_active ? "btn btn-dark" : "btn btn-light";
    let sell_btn_class = this.state.sell_btn_active ? "btn btn-dark" : "btn btn-light";
    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
            className={buy_btn_class}
            onClick={(event) => {
              this.setState({
                currentForm: 'buy',
                buy_btn_active: true,
                sell_btn_active: false,
              })
            }}
          >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
            className={sell_btn_class}
            onClick={(event) => {
              this.setState({
                currentForm: 'sell',
                buy_btn_active: false,
                sell_btn_active: true,
              })
            }}
          >
            Sell
          </button>
        </div>

        <div className="card mb-4" >

          <div className="card-body">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
