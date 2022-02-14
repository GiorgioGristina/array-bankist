'use strict';



const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];



// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// function to display transaction in the list of transaction
const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) =>
   a -b ) : movements;
  // loop througout the movement array
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type
        movements__type--${type}">${i +1} ${type} </div>
        <div class="movements__value">${mov.toFixed(2)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    
  });
}


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//  calcDispplaySummary for the bottom part of transaction
const calcDispplaySummary = function(acc){
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc,mov) => acc + mov ,0)
  labelSumIn.textContent = `${incomes.toFixed(2)}EUR`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov ,0)
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => dep * acc.interestRate)
    .filter(int=> int >= 1)    
    .reduce((acc, int, i , arr) => acc + int);
  
  labelSumInterest.textContent = `${interest.toFixed(2)}EUR`;
  
}


// function to calculate and disply balance
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  acc
  labelBalance.textContent = `${acc.balance.toFixed(2)}EUR`  
}

// function that update ui interface balance, movements, summaty
const updateUI = function(acc){
  // display movements
  displayMovements(acc.movements);
  // calculate balance
  calcDisplayBalance(acc);
  // display summary
  calcDispplaySummary(acc);
}


// method that create a username and add username property to the object account 
const createUsername = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join("");
  })
}

createUsername(accounts)
// console.log(accounts);

// EVENT HANDLER

// LOG IN
let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === 
  inputLoginUsername.value);
  // console.log(currentAccount);
  // check if the current account exist ?(with chaning) and if the pin is correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display welcome message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 1
    // clear input field fields (remember assign operator work read right to left)
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur()
    // call updateUI to update the balance, summary, movements
    updateUI(currentAccount)
  }
});

// TRANSFER MONEY
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  // gets input
  const reciverUsernameAcc = accounts.find(
    acc => acc.username === inputTransferTo.value);
  const transferAmount = Number(inputTransferAmount.value);
  console.log(reciverUsernameAcc, transferAmount);
  // clear input fields 
  inputTransferTo.value = inputTransferAmount.value = ''
  // check if user has enought money
  if (transferAmount > 0 &&
     reciverUsernameAcc &&
     currentAccount.balance >= transferAmount &&
     reciverUsernameAcc.username !== currentAccount.username
     ) {
       console.log('transfer valid');
      currentAccount.movements.push(-transferAmount)
      reciverUsernameAcc.movements.push(transferAmount)
      updateUI(currentAccount)
  }
  
});


btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount =Math.floor(inputLoanAmount.value);

  if (amount > 0 &&
    currentAccount.movements.some(mov => mov > amount * 0.10 )) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount)
      console.log('you allowed');
    
  }
  inputLoanAmount.value = ''
});

btnClose.addEventListener('click', function(e){
  e.preventDefault();
  const userName = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (currentAccount.username === userName &&
      currentAccount.pin === pin) {
      // find index of the account
      const index = accounts.findIndex(acc =>
      acc.username === currentAccount.username);
      // delete it
      accounts.splice(index, 1);
      // hide main section
      containerApp.style.opacity = 0;
      // set welcome message to `log in to get started`
      labelWelcome.textContent = 'Log in to get started';
  } 
  inputCloseUsername.value = inputClosePin.value = ''
});

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
  
  console.log(sorted);
});


///////////////////////////////////////////////
///////////////////////////////////////////////
// LECTURES


