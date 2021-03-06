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
    '2022-02-13T17:01:17.194Z',
    '2022-02-14T12:36:17.929Z',
    '2022-02-15T10:51:36.790Z',
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



// 
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const displayDate =`${day}/${month}/${year}`;

    // const calcDayPassed = (date1, date2) => 
    // Math.abs((date1 - date2) /(1000 *60 * 60 * 24));

// function tu return day passed or regualar date
const formatMovementDate = function(date, locale){
  const calcDayPassed = (date1, date2) => 
    Math.round(Math.abs((date1 - date2) /(1000 *60 * 60 * 24)));

  const dayPassed = calcDayPassed(new Date(), date)
  
  if (dayPassed === 0 ) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7 ) return `${dayPassed} days ago`;
  if (dayPassed === 0) return 'Yesterday';
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // const displayDate =`${day}/${month}/${year}`;
    // return `${day}/${month}/${year}`
    return new Intl
      .DateTimeFormat(locale)
      .format(date);
  }
};

const formatCurrency = function(value, locale, currency){
  return new Intl.NumberFormat(locale,
    {
      style: 'currency',
      currency: currency
    }).format(value);
}

// function to display transaction in the list of transaction
const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort 
    ? acc.movements.slice().sort((a,b) =>a -b ) 
    : acc.movements;
  // loop througout the movement array
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    
    const formatedMovement = formatCurrency(mov, acc.locale, acc.currency)

    const html = `
      <div class="movements__row">
        <div class="movements__type
        movements__type--${type}">${i +1} ${type} </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMovement}</div>
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
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov ,0)
  labelSumOut.textContent = formatCurrency(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(dep => dep * acc.interestRate)
    .filter(int=> int >= 1)    
    .reduce((acc, int, i , arr) => acc + int);

  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
  
}


// function to calculate and disply balance
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  const formatedMovement = formatCurrency(acc.balance, acc.locale, acc.currency)
  labelBalance.textContent = `${formatedMovement}`  
}

// function that update ui interface balance, movements, summaty
const updateUI = function(acc){
  // display movements
  displayMovements(acc);
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

const startLogOutTimer = function(){
  const tick = function(){
    const min = String(Math.trunc(time /60)).padStart(2,0)
    const sec = String(time % 60).padStart(2,0)
    // in each call print time to user interface
    labelTimer.textContent = `You will be logged out in ${min}:${sec}`
    // when 0 stop timer and log out user
    if (time === 0){
      clearInterval(timer);
      // set welcome message to `log in to get started`
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;      
    } 
    // decreese of 1 sec 
    time--
  }
  // set time to 5 min
  let time = 120;
  // call the timer every seconds
  tick();
  const timer = setInterval(tick, 1000); 
  return timer  
};
// variable to store who is login now
let currentAccount, timer;


//////////////////////////////////


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
    // to display date and time on balance
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month:'long',
      year: 'numeric'
      // weekday: 'long'
    };
    // const locale = navigator.language;
    labelDate.textContent= new Intl
      .DateTimeFormat(currentAccount.locale, options)
      .format(now);

    // const now = new Date();
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // clear input field fields (remember assign operator work read right to left)
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur()
    if (timer) clearInterval(timer);
    timer = startLogOutTimer()
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
      // doing transfer
      currentAccount.movements.push(-transferAmount)
      reciverUsernameAcc.movements.push(transferAmount)
      // add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      reciverUsernameAcc.movementsDates.push(new Date().toISOString());
      // appdating UI
      updateUI(currentAccount)
      // reset timer
      clearInterval(timer);
      timer = startLogOutTimer()
  }
  
});


btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount =Math.floor(inputLoanAmount.value);

  if (amount > 0 &&
    currentAccount.movements.some(mov => mov > amount * 0.10 )) {
    setTimeout(function(){
      currentAccount.movements.push(amount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
       // reset timer
       clearInterval(timer);
       timer = startLogOutTimer()
    },2500)
      
    
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
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  
  // console.log(sorted);
});


///////////////////////////////////////////////
///////////////////////////////////////////////
// LECTURES
// // creating
// const now = new Date();
// console.log(now);


// console.log(new Date('26 december 1991'));

// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date('26 december 1991'));
// console.log(new Date(0));


// working with date

// const future = new Date(2037, 3,19,15,23);
// console.log(future.getFullYear());new Date(2037, 10,19,15,23)
// console.log(future.getMonth()+1);
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());// good when you want to store the date in a string
// console.log(future.getTime());
// console.log(new Date(1644849811692));
// console.log(Date.now());

// console.log(Number(future));

// const calcDayPassed = (date1, date2) => Math.abs((date1 - date2) /(1000 *60 * 60 * 24));

// const numDay = calcDayPassed(new Date(2037, 3,19,3,23),new Date(2037, 3,9,15,23))
// console.log(numDay);

// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month:'long',
//   year: 'numeric',
//   weekday: 'long'
// }

// const locale = navigator.language;
// console.log(locale);

// labelDate.textContent= new Intl
//   .DateTimeFormat(locale, options)
//   .format(now);

// const num = 3254534553453;

// const options = {
//   style: 'currency',
  
//   currency: 'EUR'
// }

// console.log( new Intl.NumberFormat('it-IT',options).format(num));


// SET TIMEOUT to call a function one time after an a certain amount of time

// const ingred =['olive', 'cacio']

// const pizzaPrep = setTimeout((ing1, ing2) =>
//  console.log(`here is your pizza with ${ing1} and ${ing2}`)
//  , 3000
//  ,...ingred);
// console.log('waiting...');

// if (ingred.includes('cacio')) clearTimeout(pizzaPrep);



// // TIME INTERVAL to call a function several time 

// setInterval(function(){
//   const now = new Date();
//     console.log(now);
// },3000)