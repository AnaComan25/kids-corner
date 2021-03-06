const APP_NAME = "type-racer";
const DM = new DataManager(APP_NAME);

// the list of words that can show up for the user to type
const words = shuffle([
    "Adult", "Airplane", "Air", "Aircraft", "Airforce", "Airport", "Album", "Alphabet", "Apple", "Arm", "Army", "Baby", "Baby", "Backpack", "Balloon", "Banana", "Bank", "Barbecue", "Bathroom", "Bathtub", "Bed", "Bee", "Bible", "Bible", "Bird", "Bomb", "Book", "Boss", "Bottle", "Bowl", "Box", "Boy", "Brain", "Bridge", "Butterfly", "Button", "Cappuccino", "Car", "Card", "Carpet", "Carrot", "Cave", "Chair", "Chess", "Chief", "Child", "Chisel", "Chocolates", "Church", "Church", "Circle", "Circus", "Circus", "Clock", "Clown", "Coffee", "Comet", "Compact", "Compass", "Computer", "Crystal", "Cup", "Cycle", "Database", "Desk", "Diamond", "Dress", "Drill", "Drink", "Drum", "Dung", "Ears", "Earth", "Egg", "Electricity", "Elephant", "Eraser", "Explosive", "Eyes", "Family", "Fan", "Feather", "Festival", "Film", "Finger", "Fire", "Floodlight", "Flower", "Foot", "Fork", "Freeway", "Fruit", "Fungus", "Game", "Garden", "Gas", "Gate", "Gemstone", "Girl", "Gloves", "God", "Grapes", "Guitar", "Hammer", "Hat", "Hieroglyph", "Highway", "Horoscope", "Horse", "Hose", "Ice", "Icicle", "Insect", "Jet", "Junk", "Kaleidoscope", "Kitchen", "Knife", "Leather", "Leg", "Library", "Liquid", "Magnet", "Man", "Map", "Maze", "Meat", "Meteor", "Microscope", "Milk", "Milkshake", "Mist", "Money", "Monster", "Mosquito", "Mouth", "Nail", "Navy", "Necklace", "Needle", "Onion", "Paint", "Pants", "Parachute", "Passport", "Pebble", "Pendulum", "Pepper", "Perfume", "Pillow", "Plane", "Planet", "Pocket", "Poster", "Potato", "Printer", "Prison", "Pyramid", "Radar", "Rainbow", "Record", "Restaurant", "Rifle", "Ring", "Robot", "Rock", "Rocket", "Roof", "Room", "Rope", "Saddle", "Salt", "Sandpaper", "Sandwich", "Satellite", "School", "Ship", "Shoes", "Shop", "Shower", "Signature", "Skeleton", "Snail", "Software", "Solid", "Space", "Spectrum", "Sphere", "Spice", "Spiral", "Spoon", "Sports", "Spot", "Square", "Staircase", "Star", "Stomach", "Sun", "Sunglasses", "Surveyor", "Swimming", "Sword", "Table", "Tapestry", "Teeth", "Telescope", "Television", "Tennis", "Thermometer", "Tiger", "Toilet", "Tongue", "Torch", "Torpedo", "Train", "Treadmill", "Triangle", "Tunnel", "Typewriter", "Umbrella", "Vacuum", "Vampire", "Videotape", "Vulture", "Water", "Weapon", "Web", "Wheelchair", "Window", "Woman", "Worm"
]);

// variables to keep track of user typing statistics
let wordIndex;
let numWords;

// variables keep track of the timer
let timer;
let timerID;

// offset value needed to center player car
const CENTER_CAR = 127;
// stagger stop light times by 1000ms
const STOP_LIGHT_TIME = 1000;

(function initUI() {
    // show instructions modal
    $("#myModal").modal("show");

    // adjust road sprite
    adjustRoad();

})();

/**
 * 
 */
function adjustRoad() {
    let bodyRect = document.body.getBoundingClientRect();
    let car = document.querySelector("#player").getBoundingClientRect();
    let offset = car.top - bodyRect.top - CENTER_CAR;

    let road = document.querySelector("#road");

    road.style.width = document.body.width + "px";
    road.style.marginTop = offset + "px";
    road.style.height = 150 + "px";
}

/*
* Reset the stop light and input, then startTimer() after stopLight turns green
*/
function stopLightStart() {
    // reset timer and display the main game screen
    document.getElementById("timer").innerHTML = "2:00";
    document.getElementById("wordRace").style.display = "";
    document.getElementById("end").style.display = "none";

    // reset and keep input disabled until stopLight is over
    let input = document.querySelector("#input");
    input.disabled = true;
    input.value = "";

    // keep the player focused on the text box at all times
    input.onblur = () => setTimeout(() => input.focus());

    // get all lights to change light display with timer
    let redLight = document.getElementById("redLight");
    let yellowLight = document.getElementById("yellowLight");
    let greenLight = document.getElementById("greenLight");
    redLight.style.display = "block";
    yellowLight.style.display = "none";
    greenLight.style.display = "none";

    // starts on redLight, then yellowLight, then greenLight
    setTimeout(() => {
        redLight.style.display = "none";
        yellowLight.style.display = "block";
        setTimeout(() => {
            yellowLight.style.display = "none";
            greenLight.style.display = "block";
            setTimeout(() => {
                greenLight.style.display = "none";

                // enable input and then start the timer
                input.disabled = false;
                startTimer();

                // focus on input box after starting
                input.focus();
            }, STOP_LIGHT_TIME)
        }, STOP_LIGHT_TIME)
    }, STOP_LIGHT_TIME);
}

/**
 * Start the game.
 */
function startGame() {
    // reset stats
    numWords = 0;
    timer = 120;
    wordIndex = 2;

    // reset the player's car
    document.querySelector("#player").style.left = "0px";

    populateWordTray();

    // handles the stopLight, input resetting, and startTimer()
    stopLightStart();
}

/**
 * Start the main gameplay timer
 */
function startTimer() {
    // Timer function that counts down the seconds
    timerID = setInterval(() => {
        timer--;
            
        // If is over a minute
        if (timer - 60 > 0) {
            if (timer - 60 >= 10)
                document.getElementById("timer").innerHTML = 1 + ":" + (timer - 60);
            else 
                document.getElementById("timer").innerHTML = 1 + ":0" + (timer - 60);
        }
        // If timer is at exactly 1 minute
        else if (timer == 60)
            document.getElementById("timer").innerHTML = "1:00";
        // If time is up
        else if (timer == 0) 
            endWordRace();
        // If is less than a minute
        else {
            if (timer >= 10)
                document.getElementById("timer").innerHTML = 0 + ":" + timer;
            else
                document.getElementById("timer").innerHTML = 0 + ":0" + timer;
        }
        
        // Calculate words per minute
        let seconds = 120 - timer;
        document.getElementById("wpmBox").innerHTML = ((numWords * 60)/ seconds).toFixed() + " wpm";
    }, 1000);
}

/**
 * 
 */
document.getElementById("input").addEventListener('keyup', () => {
    let inputEl = document.querySelector("#input");

    let input = document.getElementById("input").value;
    input = input.trim();
    
    let currentWord = document.getElementById("wordTray").children[0].innerHTML;
        
    if (input == currentWord) {
        // get ref to wordTray element
        let wordTray = document.querySelector("#wordTray");
        
        // remove the word that was just typed
        wordTray.removeChild(wordTray.firstChild);

        // add a new word to the end
        let span = document.createElement("span");
        span.innerText = words[wordIndex++].toLowerCase();
        wordTray.appendChild(span);
        
        // clear input box
        inputEl.value = "";
        inputEl.style.color = "";
    
        // keep track of the word that was just typed
        numWords++;
            
        // calculate how much the player will move
        let left = document.getElementById("player").style.left;
        let width = document.getElementById("wordRace").offsetWidth;
            
        // if user is at end of screen. end the game
        if (parseInt(left.replace("px", ""), 10) >= width) {
            endWordRace();
        }
        
        // calcualte new position of the player
        let newLeft;
        if (!left.includes("px")) {
            newLeft = "30px";
        }
        else {
            left = left.replace("px", "");
            newLeft = (parseInt(left, 10) + 30) + "px";
        }
            
        // move the player div
        $("#player").animate({ "left": newLeft }, 200, "linear");
            
        // Calculate words per minute
        let seconds = 120 - timer;
        document.getElementById("wpmBox").innerHTML = ((numWords * 60) / seconds).toFixed() + " wpm";
    }
    // If the input is correct
    else if (input == currentWord.substring(0, input.length)) {
        inputEl.style.color = "green";
    }
    // If the input is incorrect
    else if (input != currentWord.substring(0, input.length)) {
        inputEl.style.color = "red";
    }
});

/**
 * 
 */
function populateWordTray() {
    let wordTray = document.querySelector("#wordTray");

    for (let i = 0; i < 5; i++) {
        let span = document.createElement("span");
        span.innerText = words[i].toLowerCase();

        wordTray.appendChild(span);
    }
}

/**
 * 
 */
function endWordRace() {
    // Stop timer
    clearInterval(timerID);
        
    // Show timer at 0:00
    document.getElementById("timer").innerHTML = "0:00";
        
    // Disable input
    document.getElementById("input").disabled = true;
    document.getElementById("input").value = "";
    
    // Hide game and show end screen
    document.getElementById("wordRace").style.display = "none";
    document.getElementById("end").style.display = "";
    
    // Show stats
    let seconds = 120 - timer;
    document.getElementById("wpmStat").innerHTML = ((numWords * 60) / seconds).toFixed() + " wpm";
    document.getElementById("wordCountStat").innerHTML = numWords;
}

/**
 * 
 * @param {any[]} array 
 */
function shuffle(array) {
  let m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}