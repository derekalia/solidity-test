const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  //get a list of all accounts
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  //use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' });
  inbox.setProvider(provider);
});

describe('inbox', () => {
  it('deploys smart contract', () => {
    // console.log(inbox);
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    // console.log(inbox);
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi there!');
  });

  it('can set message', async () => {
    // console.log(inbox);
    await inbox.methods.setMessage('Testing').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Testing');
  });
});
