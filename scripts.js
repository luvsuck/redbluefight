document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game');
    const endTurnButton = document.getElementById('end-turn');
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const redHpElem = document.getElementById('red-hp');
    const blueHpElem = document.getElementById('blue-hp');
    const redMpElem = document.getElementById('red-mp');
    const blueMpElem = document.getElementById('blue-mp');
    const redHandElem = document.getElementById('red-hand');
    const blueHandElem = document.getElementById('blue-hand');
    const roundElem = document.getElementById('round'); // 新增：显示当前回合数的元素
    
    const playedCardsList = []; // 用于存放打出的牌
    const showPlayedCardsButton = document.getElementById('show-played-cards');
    const playedCardsListContainer = document.getElementById('played-cards-list');
    
    let redHp = 100;
    let blueHp = 100;
    let redMp = 50;
    let blueMp = 50;
    let currentPlayer = 'red';
    let redDeck = [];
    let blueDeck = [];
    let redHand = [];
    let blueHand = [];
    let round = 0; // 新增：回合数计数器
    let redPlayedCards=[];
    let bluePlayedCards=[];

    const cardPool = [
        { type: 'attack', subtype: 'a', damage: 3, quantity: 6, img: 'attack-a.png' },
        { type: 'attack', subtype: 'b', damage: 5, quantity: 4, img: 'attack-b.png' },
        { type: 'defense', subtype: 'a', defense: 3, quantity: 6, img: 'defense-a.png' },
        { type: 'defense', subtype: 'b', defense: 6, quantity: 4, img: 'defense-b.png' },
        { type: 'summon', name: '鹰', cost: 3, damage: 3, duration: 3, quantity: 3, img: 'summon-eagle.png' },
        { type: 'summon', name: '熊', cost: 5, defense: 5, duration: 4, quantity: 2, img: 'summon-bear.png' },
        { type: 'spell', name: '万箭齐发', cost: 5, damage: 6, quantity: 1, img: 'spell.png' },
        { type: 'luck', name: '连发', quantity: 5, img: 'luck.png' }
    ];

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function createDeck() {
        let deck = [];
        cardPool.forEach(card => {
            for (let i = 0; i < card.quantity; i++) {
                deck.push({ ...card });
            }
        });
        shuffleDeck(deck);
        return deck;
    }

    function drawCards(deck, hand, count) {
        for (let i = 0; i < count; i++) {
            hand.push(deck.pop());
        }
    }

    function renderHand(hand, element) {
        element.innerHTML = '';
        hand.forEach((card, index) => {
            if (card) { // 确保 card 存在
                const cardElem = document.createElement('div');
                cardElem.classList.add('card');
                cardElem.cardData = card; // 将卡牌数据附加到元素上
                const img = document.createElement('img');
                img.src = `images/${card.img}`;
                cardElem.appendChild(img);
                cardElem.onclick = () => playCard(card); // 传递卡牌数据给 playCard 函数
                element.appendChild(cardElem);
            }
        });
    }
    
    
    

    function playCard(card) {
        if (currentPlayer === 'red') {
            applyCardEffect(card, 'blue');
            const cardElem = renderCard(card, 'red');
            redPlayedCards.push(cardElem);
        } else {
            applyCardEffect(card, 'red');
            const cardElem = renderCard(card, 'blue');
            bluePlayedCards.push(cardElem);
        }
        endTurn();
    }

    function renderCard(card, player) {
        const cardElem = document.createElement('div');
        cardElem.classList.add('card', `played-by-${player}`);
        const img = document.createElement('img');
        img.src = `images/${card.img}`;
        cardElem.appendChild(img);
        return cardElem;
    }
    

    function applyCardEffect(card, opponent) {
        if (card.type === 'attack') {
            if (opponent === 'blue') {
                blueHp -= card.damage;
                blueHpElem.textContent = blueHp;
            } else {
                redHp -= card.damage;
                redHpElem.textContent = redHp;
            }
        } else if (card.type === 'defense') {
            if (currentPlayer === 'red') {
                redHp += card.defense;
                redHpElem.textContent = redHp;
            } else {
                blueHp += card.defense;
                blueHpElem.textContent = blueHp;
            }
        } else if (card.type === 'summon') {
            if (currentPlayer === 'red') {
                redMp -= card.cost;
                redMpElem.textContent = redMp;
            } else {
                blueMp -= card.cost;
                blueMpElem.textContent = blueMp;
            }
        } else if (card.type === 'spell') {
            if (opponent === 'blue') {
                blueHp -= card.damage;
                blueHpElem.textContent = blueHp;
            } else {
                redHp -= card.damage;
                redHpElem.textContent = redHp;
            }
        } else if (card.type === 'luck') {
            // 幸运-连发逻辑
        }

        checkGameOver();
    }

    function checkGameOver() {
        if (redHp <= 0) {
            alert('蓝方获胜！');
            resetGame();
        } else if (blueHp <= 0) {
            alert('红方获胜！');
            resetGame();
        }
    }

    function resetGame() {
        startScreen.style.display = 'block';
        gameScreen.style.display = 'none';
    }

    function endTurn() {
        // 确保每个玩家在自己的回合内只能出一张牌后结束回合
        if (currentPlayer === 'red') {
            currentPlayer = 'blue';
            disableCardClick(); // 禁用玩家当前手牌的点击
            setTimeout(computerTurn, Math.random() * 2000 + 1000); // 模拟电脑出牌
        } else {
            currentPlayer = 'red';
            drawCards(redDeck, redHand, 1);
            enableCardClick(); // 启用玩家当前手牌的点击
        }
    }

    function disableCardClick() {
        const hand = currentPlayer === 'red' ? redHand : blueHand;
        hand.forEach(cardElem => {
            if (cardElem && cardElem.style) { // 确保 cardElem 存在且有 style 属性
                cardElem.onclick = null;
                cardElem.style.cursor = 'default';
            }
        });
    }
    
    
    function enableCardClick() {
        const hand = currentPlayer === 'red' ? redHand : blueHand;
        hand.forEach(cardElem => {
            if (cardElem && cardElem.style) { // 确保 cardElem 存在
                cardElem.onclick = () => playCard(cardElem.cardData);
                cardElem.style.cursor = 'pointer';
            }
        });
    }
    
    
    
    function computerTurn() {
        const randomIndex = Math.floor(Math.random() * blueHand.length);
        const cardToPlay = blueHand[randomIndex];
        playCard(cardToPlay);
    }

    showPlayedCardsButton.addEventListener('click', () => {
        renderPlayedCardsList();
        playedCardsListContainer.classList.toggle('hidden');
    });
    
    function renderPlayedCardsList() {
        playedCardsListContainer.innerHTML = ''; // 清空之前的内容
        const ul = document.createElement('ul');
        playedCardsList.forEach(card => {
            const li = document.createElement('li');
            li.textContent = card.name || card.subtype || card.type;
            ul.appendChild(li);
        });
        playedCardsListContainer.appendChild(ul);
    }

    startGameButton.onclick = () => {
        redDeck = createDeck();
        blueDeck = createDeck();
        redHand = [];
        blueHand = [];
        drawCards(redDeck, redHand, 6);
        drawCards(blueDeck, blueHand, 6);
        renderHand(redHand, redHandElem);
        renderHand(blueHand, blueHandElem);

        redHp = 100;
        blueHp = 100;
        redMp = 50;
        blueMp = 50;
        round = 0; // 初始化回合数为0
        roundElem.textContent = `当前回合: ${round}`; // 显示初始回合数

        redHpElem.textContent = redHp;
        blueHpElem.textContent = blueHp;
        redMpElem.textContent = redMp;
        blueMpElem.textContent = blueMp;

        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    };

    endTurnButton.onclick = () => {
        endTurn();
    };
});
