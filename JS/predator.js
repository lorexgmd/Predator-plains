// Глобальные переменные
const canvas = document.getElementById("gameCanvas"); // Получение элемента canvas
const ctx = canvas.getContext("2d"); // Получение 2D контекста

// Изображения животных (плотоядные и травоядные)
const carnivoreImages = [
    "Images/Wild cat(C1).png",
    "Images/Jackal (C2).png",
    "Images/Serval (C3).png",
    "Images/Side Striped Jackal (C4).png",
    "Images/Caracal (C5).png",
    "Images/Striped Hyena (C6).png",
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
    "Images/Herbivores/Elephant (H10).png"
];

// Игрок
let playerImage = new Image(); // Инициализация изображения игрока
let player = {
    x: canvas.width / 2, // Начальная позиция игрока по X
    y: canvas.height / 2, // Начальная позиция игрока по Y
    size: 30, // Начальный размер игрока
    speed: 1, // Скорость игрока
    score: 0, // Начальный счет игрока
    role: null, // Роль игрока (плотоядный или травоядный)
    color: "blue" // Цвет игрока
};

// Списки для еды и NPC
let foodItems = []; // Массив для еды
let npcs = []; // Массив для NPC

// Настройки игры
const foodCount = 100; // Количество еды
const npcCount = 10; // Количество NPC
const foodSize = 10; // Размер еды
const npcSpeed = 1; // Скорость NPC
const newNpcSize = 30; // Начальный размер NPC
const newFoodSize = 10; // Размер новой еды

// Инициализация позиции мыши
let mouseX = player.x; // Начальная позиция мыши по X
let mouseY = player.y; // Начальная позиция мыши по Y

// Загрузка фона
const backgroundImage = new Image();
backgroundImage.src = "Images/Savannah background.jpg"; // Путь к фону

// Функции загрузки изображений
playerImage.onload = function () {
    drawPlayer(); // Перерисовать игрока после загрузки
};

backgroundImage.onload = function() {
    requestAnimationFrame(gameLoop); // Запустить игровой цикл после загрузки фона
};

// Функция обновления изображения игрока
function updatePlayerImage() {
    let maxScore = 500;
    let level = Math.min(Math.floor(player.score / (maxScore / 11)), 10);
    if (player.role === "carnivore") {
        playerImage.src = carnivoreImages[level];
    } else if (player.role === "herbivore") {
        playerImage.src = herbivoreImages[level];
    }
}

// Функция рисования игрока
function drawPlayer() {
    ctx.drawImage(playerImage, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

// Функция выбора роли
function chooseRole() {
    document.getElementById('roleSelection').style.display = 'none'; // Скрыть блок выбора
    spawnFood(); // Спавн еды
    spawnNPCs(); // Спавн NPC
    gameLoop(); // Запуск игрового цикла
}

// Функция отображения выбора роли
function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'block'; // Показать выбор роли
}

// Функции спавна еды и NPC
function spawnFood() {
    for (let i = 0; i < foodCount; i++) {
        foodItems.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: foodSize,
            type: Math.random() > 0.5 ? 'plant' : 'meat'
        });
    }
}

function respawnFood(x = Math.random() * canvas.width, y = Math.random() * canvas.height, delay = 3000) {
    setTimeout(function() {
        foodItems.push({
            x: x,
            y: y,
            size: newFoodSize,
            type: Math.random() > 0.5 ? 'plant' : 'meat'
        });
    }, delay); 
}

function spawnNPCs() {
    for (let i = 0; i < npcCount; i++) {
        npcs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: player.size,
            speed: npcSpeed,
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore'
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

// Функция обновления позиции игрока
function updatePlayerPosition() {
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 1) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
}

// Функция обновления NPC
function updateNPCs() {
    npcs.forEach(npc => {
        if (Math.random() < 0.02) {
            npc.directionX = Math.random() > 0.5 ? 1 : -1;
            npc.directionY = Math.random() > 0.5 ? 1 : -1;
        }
        npc.x += npc.directionX * npc.speed;
        npc.y += npc.directionY * npc.speed;
        if (npc.x <= 0 || npc.x >= canvas.width) {
            npc.directionX *= -1;
        }
        if (npc.y <= 0 || npc.y >= canvas.height) {
            npc.directionY *= -1;
        }
    });
}

// Обработка движения мыши
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Проверка коллизий
function checkCollisions() {
    // Коллизия с едой
    for (let i = foodItems.length - 1; i >= 0; i--) {
        let food = foodItems[i];
        let dx = player.x - food.x;
        let dy = player.y - food.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size / 2 + food.size / 2) {
            player.score += (food.type === 'plant') ? 10 : 20;
            player.size += 1;
            foodItems.splice(i, 1);
            respawnFood();
        }
    }

    // Коллизия с NPC
    for (let i = npcs.length - 1; i >= 0; i--) {
        let npc = npcs[i];
        let dx = player.x - npc.x;
        let dy = player.y - npc.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size / 2 + npc.size / 2) {
            if (npc.type === 'herbivore' && player.role === 'carnivore') {
                player.score += 20; // За поедание NPC
                npcs.splice(i, 1);
                respawnNPC();
            } else if (npc.type === 'carnivore' && player.role === 'herbivore') {
                alert("Game Over! You were eaten!"); // Игра окончена
                document.location.reload(); // Перезагрузить игру
            }
        }
    }
}

// Основной игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канваса
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Отрисовка фона
    updatePlayerPosition(); // Обновление позиции игрока
    updateNPCs(); // Обновление NPC
    checkCollisions(); // Проверка коллизий
    drawPlayer(); // Отрисовка игрока

    // Отрисовка еды
    foodItems.forEach(food => {
        ctx.fillStyle = food.type === 'plant' ? 'green' : 'red';
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Отрисовка NPC
    npcs.forEach(npc => {
        ctx.fillStyle = npc.type === 'herbivore' ? 'yellow' : 'brown';
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(gameLoop); // Запрос следующего кадра
}
// Functie om het spel te starten
function startGame() {
    showRoleSelection();
}
// Start het spel
startGame();
