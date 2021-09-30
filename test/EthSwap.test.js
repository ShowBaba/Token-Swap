const { assert } = require('chai');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
  .use(require('chai-as-promised'))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
  let token, ethSwap;

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    await token.transfer(ethSwap.address, tokens('1000000'));
  })

  describe('Token deployment', async () => {
    it('contract has a name', async () => {
      const name = await token.name()
      assert.equal(name, 'Monkey Token')
    })
  })

  describe('EthSwap deployment', async () => {
    it('contract has a name', async () => {
      const name = await ethSwap.name();
      assert.equal(name, 'EthSwap Instant Exchange')
    })

    it('Contract has token', async () => {
      const balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })
  })

  describe('buyTokens()', async () => {
    let result;
    before(async () => {
      // Purchase tokens befor each examples
      result = await ethSwap.buyTokens({ from: investor, value: tokens('1') });
    })
    it('Allows users to purchase token from eth-swap for a fixed price', async () => {
      // check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('10'))

      // check investor eth balance
      let ethSwapBalance;
      let ethSwapTokenBalance;
      ethSwapTokenBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapTokenBalance.toString(), tokens('999990'))
      // check that ether balance of the contract went up
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens('1'))

      // inspect the event from the buyToken function
      // console.log(result.logs[0].args)
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('10').toString());
      assert.equal(event.rate.toString(), '10');
    })
  })

  describe('sellTokens()', async () => {
    let result;

    before(async () => {
      // approve ethSwap address to spend token for the investor
      await token.approve(ethSwap.address, tokens('10'), { from: investor })
      result = await ethSwap.sellTokens(tokens('10'), { from: investor })
    })

    it('Allows users to set token to eth-swap for a fixed price', async () => {
      // check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('0'))

      // check ethSwap balance after purchase
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens('1000000'))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'Ether'))

      // check emitted event
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens('1').toString());
      assert.equal(event.rate.toString(), '10');

      // FAILURE: investors can't sell more tokens than they have
      await ethSwap.sellTokens(tokens('500'), { form: investor }).should.be.rejected;
    })
  })
})