// Hoofdvariabelen
const canvas = document.getElementById("gameCanvas"); // Verkrijg het canvas element van de HTML
const ctx = canvas.getContext("2d"); // Verkrijg de 2D context voor tekenen op het canvas

// Animal model images (carnivores and herbivores)
const carnivoreImages = [
    "Images/Wild cat(C1).png",
    "Images/Jackal (C2).png",
    "Images/Serval (C3).png",
    "Images/Side Striped Jackal (C4).png",
    "Images/Caracal (C5).png",
    "Images/Striped  Hyena (C6).png",
    "Images/Spotted Hyena (C7).png",
    "Images/Cheetah (C8).png",
    "Images/Leopard (C9).png",
    "Images/Tiger (C10).png",
    "Images/Lion (C11).png"
];

const herbivoreImages = [
    "Images/Herbivores/Beetle (H0).png",
    "Images/Herbivores/African Hare (H1).png",
    "Images/Herbivores/Springbok (H2).png",
    "Images/Herbivores/SteenBok (H3).png",
    "Images/Herbivores/Warthog (H4).png",
    "Images/Herbivores/dik-dik (H5).png",
    "Images/Herbivores/BushBuck (H6).png",
    "Images/Herbivores/Zebra (H7).png",
    "Images/Herbivores/Wildebeest (H8).png",
    "Images/Herbivores/Giraffe (H9).png",
    "Images/Herbivores/Elephant (H10).png",
];

playerImage.onload = function () {
    drawPlayer();
};

// Load player image globally
let playerImage = new Image(); // Initialize playerImage

// Player image onload function should be set here
playerImage.onload = function () {
    drawPlayer(); // Redraw player when image is loaded
};

// Update the player's image based on their score
function updatePlayerImage() {
    let maxScore = 500;
    let level = Math.min(Math.floor(player.score / (maxScore / 11)), 10); // Max level is 10 (c11/h11)
    if (player.role === "carnivore") {
        playerImage.src = carnivoreImages[level]; // Set the image based on the score for carnivores
    } else if (player.role === "herbivore") {
        playerImage.src = herbivoreImages[level]; // Set the image based on the score for herbivores
    }
}

// Update the drawing function to include the player image
function drawPlayer() {
    ctx.drawImage(playerImage, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

// In the game loop, instead of drawing the player with a circle, draw the image
function gameLoop() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Draw the background

    // Update positions of player and NPCs
    updatePlayerPosition();
    updateNPCs();

    // Update player image based on score
    updatePlayerImage();

    // Draw the player
    drawPlayer();

    // Draw food
    foodItems.forEach(food => {
        ctx.fillStyle = (food.type === 'plant') ? 'green' : 'red'; // Color food based on type
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Draw NPCs
    npcs.forEach(npc => {
        ctx.fillStyle = 'black'; // NPC color
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Check collisions
    checkCollisions();
    checkNPCCollisions();

    requestAnimationFrame(gameLoop); // Request the next frame
}

// Modify the role selection functions to load the initial image
document.getElementById('carnivoreButton').addEventListener('click', function() {
    player.role = 'carnivore';
    player.color = 'red';
    playerImage.src = carnivoreImages[0];
    chooseRole();
});

document.getElementById('herbivoreButton').addEventListener('click', function() {
    player.role = 'herbivore';
    player.color = 'green';
    playerImage.src = herbivoreImages[0];
    chooseRole();
});


// Function to start the game (this shows the role selection)
function startGame() {
    showRoleSelection();
}
// Speler
let player = {
    x: canvas.width / 2, // Beginpositie van de speler op de X-as (midden van het canvas)
    y: canvas.height / 2, // Beginpositie van de speler op de Y-as (midden van het canvas)
    size: 30, // Begin grootte van de speler
    speed: 1, // Snelheid van de speler
    score: 0, // Begin score van de speler
    role: null, // Rol van de speler (Carnivore of Herbivore)
    color: "blue" // Kleur van de speler
};

// Lijsten voor voedsel en NPC's
let foodItems = []; // Array voor voedsel items
let npcs = []; // Array voor NPC's

// Spelinstellingen
const foodCount = 100; // Aantal voedsel dat gespawnd moet worden
const npcCount = 10; // Aantal NPC's dat gespawnd moet worden
const foodSize = 10; // Grotte van food
const npcSpeed = 1; // Snelheid van NPC's (verlaagd voor betere gameplay)
const newNpcSize = 30; // Begin score van de NPC
const newFoodSize = 10; // Grotte van nieuw food

// Initialisatie van muispositie
let mouseX = player.x; // Beginpositie van de muis op de X-as
let mouseY = player.y; // Beginpositie van de muis op de Y-as
// Functie voor het afspelen van achtergrondmuziek.
function playBackgroundMusic() {
    const audio = document.getElementById('background-music');
    audio.play().catch(error => {
        console.error("Fout bij het afspelen van muziek:", error);; // Het afspelen van muziek.
});
}
// Function to prompt player to choose role
function chooseRole() {
    document.getElementById('roleSelection').style.display = 'none'; // Скрыть блок с кнопками после выбора
    playBackgroundMusic();
    spawnFood(); // Спавним еду
    spawnNPCs(); // Спавним NPC
    gameLoop(); // Запускаем игровой цикл
}

function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'block'; // Показываем блок с выбором роли
}
// Functie om voedsel te spawnen
function spawnFood() {
    for (let i = 0; i < foodCount; i++) { // Voor elke voedsel item
        foodItems.push({ // Voeg een nieuw voedsel item toe aan de array
            x: Math.random() * canvas.width, // Willekeurige X-positie
            y: Math.random() * canvas.height, // Willekeurige Y-positie
            size: foodSize, // Grootte van het voedsel
            type: Math.random() > 0.5 ? 'plant' : 'meat' // Willekeurig type voedsel: plant of vlees
        });
    }
}
// Functie om voedsel opnieuw te spawnen na een vertraging
function respawnFood(x = Math.random() * canvas.width, y = Math.random() * canvas.height, delay = 3000) {
    setTimeout(function() {
        foodItems.push({
            x: x, // Willekeurige X-positie binnen het canvas
            y: y, // Willekeurige Y-positie binnen het canvas
            size: newFoodSize, // Grootte van het nieuwe voedselitem
            type: Math.random() > 0.5 ? 'plant' : 'meat' // Willekeurig type voedsel: plant of vlees
        });
    }, delay); 
}
// Functie om NPC's te spawnen
function spawnNPCs() {
    for (let i = 0; i < npcCount; i++) { // Voor elke NPC
        npcs.push({ // Voeg een nieuwe NPC toe aan de array
            x: Math.random() * canvas.width, // Willekeurige X-positie
            y: Math.random() * canvas.height, // Willekeurige Y-positie
            size: player.size, // Grootte van de NPC gelijk aan de speler
            speed: npcSpeed, // Snelheid van de NPC
            directionX: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de X-as
            directionY: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de Y-as
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore' // Willekeurig type
        });
    }
}
function respawnNPC(x = Math.random() * canvas.width, y = Math.random() * canvas.height, delay = 3000) {
    setTimeout(function() {
        npcs.push({
            x: x, 
            y: y, 
            size: newNpcSize,
            speed: npcSpeed, 
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1, 
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore'
        });
    }, delay);
}

// Functie om de positie van de speler bij te werken op basis van de muis
function updatePlayerPosition() {
    let dx = mouseX - player.x; // Verschil op de X-as tussen muis en speler
    let dy = mouseY - player.y; // Verschil op de Y-as tussen muis en speler
    let distance = Math.sqrt(dx * dx + dy * dy); // Bereken de afstand tussen de speler en de muis

    // Update positie van de speler als de afstand groter is dan 1
    if (distance > 1) {
        player.x += (dx / distance) * player.speed; // Update de X-positie van de speler
        player.y += (dy / distance) * player.speed; // Update de Y-positie van de speler
    }
}

// Functie om NPC's bij te werken
function updateNPCs() {
    npcs.forEach(npc => { // Voor elke NPC
        // Willekeurig de richting veranderen op intervallen
        if (Math.random() < 0.02) { // 2% kans om van richting te veranderen
            npc.directionX = Math.random() > 0.5 ? 1 : -1; // Willekeurige nieuwe richting op de X-as
            npc.directionY = Math.random() > 0.5 ? 1 : -1; // Willekeurige nieuwe richting op de Y-as
        }
        
        // Update de positie van de NPC
        npc.x += npc.directionX * npc.speed; // Update de X-positie van de NPC
        npc.y += npc.directionY * npc.speed; // Update de Y-positie van de NPC

        // Laat NPC stuiteren als ze de muren raken
        if (npc.x <= 0 || npc.x >= canvas.width) {
            npc.directionX *= -1; // Verander richting op de X-as
        }
        if (npc.y <= 0 || npc.y >= canvas.height) {
            npc.directionY *= -1; // Verander richting op de Y-as
        }
    });
}

// Verwerk muisbeweging
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect(); // Verkrijg de afmetingen van het canvas
    mouseX = event.clientX - rect.left; // Update muispositie op de X-as
    mouseY = event.clientY - rect.top; // Update muispositie op de Y-as
});

function checkCollisions() {
    // Botsing met voedsel
    for (let i = foodItems.length - 1; i >= 0; i--) { // Loop achteruit om te kunnen verwijderen
        let food = foodItems[i]; // Huidig voedsel item
        let dx = player.x - food.x; // Verschil op de X-as
        let dy = player.y - food.y; // Verschil op de Y-as
        let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen speler en voedsel

        // Controleer of er een botsing is
        if (distance < player.size / 2 + food.size / 2) {
            // Absorbeer het voedsel
            player.score += (food.type === 'plant') ? 10 : 20; // Verhoog score op basis van voedseltype
            player.size += 1; // Vergroot de speler een beetje
            foodItems.splice(i, 1); // Verwijder voedsel uit de array
            //
            respawnFood();
        }
    }
    // Botsing met NPC
for (let i = npcs.length - 1; i >= 0; i--) { 
    let npc = npcs[i]; 
    let dx = player.x - npc.x; 
    let dy = player.y - npc.y; 
    let distance = Math.sqrt(dx * dx + dy * dy); 

        // Controleer of er een botsing is
    if (distance < player.size / 2 + npc.size / 2) {
        if (player.size > npc.size) { 
            player.score += 50; 
            player.size += 5; 
            let npcX = npc.x; 
            let npcY = npc.y;

                npcs.splice(i, 1); // NPC's verwijderen

                 // Respawn a new NPC at the old coordinates after a delay
            respawnNPC(npcX, npcY, 3000); 
            } 
            else if (player.size === npc.size) {
                console.log("De speler en NPC zijn gelijk in grootte.");
                // Deze regel verhelpt deze bug: NPC's kunnen aan het begin van het spel in de speler spawnen, waardoor je onmiddellijk verliest.
               }
            else { // Als de speler kleiner is
                alert("Game Over"); // Einde van het spel
                document.location.reload(); // Het spel opnieuw starten
            }
        }
    }
}
// Functie om botsingen van NPC's met voedsel te controleren
function checkNPCCollisions() {
    npcs.forEach(npc => { // Voor elke NPC
        for (let i = foodItems.length - 1; i >= 0; i--) { // Loop door alle voedsel items (achteruit om veilig te kunnen verwijderen)
            let food = foodItems[i]; // Huidig voedsel item
            let dx = npc.x - food.x; // Verschil op de X-as tussen NPC en voedsel
            let dy = npc.y - food.y; // Verschil op de Y-as tussen NPC en voedsel
            let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen NPC en voedsel


// Controleer of er een botsing is tussen NPC en voedsel
if (distance < npc.size / 2 + food.size / 2) {
    // Controleer of het voedseltype geschikt is voor de NPC (bijvoorbeeld planten voor herbivoren)
    npc.score += (food.type === 'plant') ? 20 : 20; // Verhoog de score van de NPC afhankelijk van het voedseltype
    npc.size += 1; // Vergroot de NPC een beetje
    foodItems.splice(i, 1); // Verwijder het voedsel uit de array
    respawnFood(); // Respawn het voedsel na een korte vertraging
            }
        }
    });
}


// Functie om voedsel automatisch opnieuw te spawnen als het aantal onder een bepaalde limiet komt
function spawnFoodAgain(intervalTime) {
    setInterval(function() {
        if (foodItems.length < foodCount) { // Controleer of er minder voedsel is dan de ingestelde limiet
            respawnFood(); // Respawn nieuw voedsel
        }
    }, intervalTime); // Interval tijd in milliseconden tussen elke controle
}
// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "Images/Savannah background.jpg"; // Ensure this path is correct

backgroundImage.onload = function() {
    requestAnimationFrame(gameLoop); // Start the game loop once the background image is loaded
};
// checking if both images have been loaded before starting the game
let imagesLoaded = 0;
const totalImages = 2; // playerImage and backgroundImage

function checkStartGame() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        requestAnimationFrame(gameLoop); // Start game loop once both images are loaded
    }
}

playerImage.onload = checkStartGame;
backgroundImage.onload = checkStartGame;
// Hoofdcodes voor de spelcyclus
function gameLoop() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Voeg achtergrond toe

    // Update posities van speler en NPC's
    updatePlayerPosition(); // Update de positie van de speler
    updateNPCs(); // Update de posities van de NPC's

    // Update spelerafbeelding op basis van score
    updatePlayerImage(); // Zorg dat de juiste afbeelding voor de speler wordt gekozen

    // Teken de speler
    drawPlayer(); // Gebruik de functie om de spelerafbeelding te tekenen

    // Teken voedsel
    foodItems.forEach(food => { // Voor elk voedsel item
        ctx.fillStyle = (food.type === 'plant') ? 'green' : 'red'; // Kleur van voedsel op basis van type
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size / 2, 0, Math.PI * 2); // Teken het voedsel
        ctx.fill(); // Vul het voedsel
        ctx.closePath(); // Sluit het pad
    });

    // Teken NPC's
    npcs.forEach(npc => { // Voor elke NPC
        ctx.fillStyle = 'black'; // Kleur van NPC's
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size / 2, 0, Math.PI * 2); // Teken de NPC
        ctx.fill(); // Vul de NPC
        ctx.closePath(); // Sluit het pad
    });

    // Controleer op botsingen
    checkCollisions(); // Controleer botsingen met voedsel en NPC's
    checkNPCCollisions(); // Controleer botsingen tussem NPC's en voedsel
    requestAnimationFrame(gameLoop); // Vraag de volgende frame aan
}
// Functie om het spel te starten
function startGame() {
    showRoleSelection();
}
// Start het spel
startGame();