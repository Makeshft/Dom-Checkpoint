/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  // your code here
  const coffeeCup = document.getElementById('coffee_counter');
  coffeeCup.innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  updateCoffeeView(++data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(producer => {
    if(coffeeCount >= Math.floor((producer.price / 2))) {
      producer.unlocked = true;
    }
  })
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter(producer => producer.unlocked)
}

function makeDisplayNameFromId(id) {
  // your code here
  const displayNameArr = id.replaceAll('_', ' ').split(' ');

  const displayName = displayNameArr.map(word => {
    let wordCapitalized = word.charAt(0).toUpperCase();
    if(parseInt(word[0]) === NaN || word[0] === wordCapitalized) {
      return word;
    }

    wordCapitalized += word.slice(1);
    return wordCapitalized;
  }).join(' ');

  return displayName;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  // your code here
  const producerContainer = document.getElementById('producer_container');

  unlockProducers(data.producers, data.coffee);

  deleteAllChildNodes(producerContainer);

  const unlockedProducers = getUnlockedProducers(data);

  for(let i = 0; i < unlockedProducers.length; i++) {
    producerContainer.appendChild(makeProducerDiv(unlockedProducers[i]));
  };
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  return data.producers.find(producer => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  // your code here
  return getProducerById(data, producerId)?.price <= data.coffee;
}

function updateCPSView(cps) {
  // your code here
  const coffeePerSecond = document.getElementById('cps');
  coffeePerSecond.innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  const foundProducer = getProducerById(data, producerId);
  const canAfford = canAffordProducer(data, producerId);

  if(canAfford) {
    foundProducer.qty++;
    data.coffee -= foundProducer.price;
    foundProducer.price = updatePrice(foundProducer.price);
    data.totalCPS += foundProducer.cps;
  }

  return canAfford;
}

function buyButtonClick(event, data) {
  // your code here
  if(event.target.tagName === 'BUTTON') {
    const producerId = event.target.id.replaceAll('buy_', '');

    if(!attemptToBuyProducer(data, producerId)) {
      window.alert('Not enough coffee!');
    }
  }
}

function tick(data) {
  // your code here
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
