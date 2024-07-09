// document.addEventListener('DOMContentLoaded', () => {
//     const startGameButton = document.getElementById('start-game');
//     const playCardOverBtn = document.getElementById('play-card-over');
//     const startScreen = document.getElementById('start-screen');
//     const gameScreen = document.getElementById('game-screen');
//     const redHpElem = document.getElementById('red-hp');
//     const blueHpElem = document.getElementById('blue-hp');
//     const redMpElem = document.getElementById('red-mp');
//     const blueMpElem = document.getElementById('blue-mp');
//     const redHandElem = document.getElementById('red-hand');
//     const blueHandElem = document.getElementById('blue-hand');
//     const roundElem = document.getElementById('round'); // 新增：显示当前回合数的元素
//
//     const playedCardsList = []; // 用于存放打出的牌
//     const showPlayedCardsButton = document.getElementById('show-played-cards');
//     const playedCardsListContainer = document.getElementById('played-cards-list');
//
//     let redHp = 100;
//     let blueHp = 100;
//     let redMp = 50;
//     let blueMp = 50;
//     let currentPlayer = 'red';
//     let redDeck = [];
//     let blueDeck = [];
//     let redHand = [];
//     let blueHand = [];
//     let round = 0; // 新增：回合数计数器
//     let redPlayedCards = [];
//     let bluePlayedCards = [];
//
//     const cardPool = [
//         {type: 'attack', subtype: 'a', name: '见斩I', damage: 3, quantity: 6, img: 'attack-a.png'},
//         {type: 'attack', subtype: 'b', name: '见斩II', damage: 5, quantity: 4, img: 'attack-b.png'},
//         {type: 'defense', subtype: 'a', name: '铁骨I', defense: 3, quantity: 6, img: 'defense-a.png'},
//         {type: 'defense', subtype: 'b', name: '铁骨II', defense: 6, quantity: 4, img: 'defense-b.png'},
//         {type: 'summon', name: '唤鸱', cost: 3, damage: 3, duration: 3, quantity: 3, img: 'summon-eagle.png'},
//         {type: 'summon', name: '唤罴', cost: 5, defense: 5, duration: 4, quantity: 2, img: 'summon-bear.png'},
//         {type: 'spell', name: '连箭', cost: 5, damage: 6, quantity: 1, img: 'spell.png'},
//         {type: 'luck', name: '运长', quantity: 5, img: 'luck.png'}
//     ];
//
//
//     function shuffleDeck(deck) {
//         for (let i = deck.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [deck[i], deck[j]] = [deck[j], deck[i]];
//         }
//     }
//
//     function createDeck() {
//         let deck = [];
//         cardPool.forEach(card => {
//             for (let i = 0; i < card.quantity; i++) {
//                 deck.push({...card});
//             }
//         });
//         shuffleDeck(deck);
//         return deck;
//     }
//
//     function drawCards(deck, hand, count) {
//         for (let i = 0; i < count; i++) {
//             hand.push(deck.pop());
//         }
//     }
//
//     function renderHand(hand, element) {
//         element.innerHTML = '';
//         hand.forEach((card, index) => {
//             if (card) {
//                 const cardElem = document.createElement('div');
//                 cardElem.classList.add('card');
//                 cardElem.cardData = card;
//                 const img = document.createElement('img');
//                 img.src = `images/${card.img}`;
//                 cardElem.appendChild(img);
//
//                 // 添加点击事件处理函数
//                 cardElem.addEventListener('click', () => {
//                     // 切换选中样式
//                     cardElem.classList.toggle('selected');
//
//                     // 取消其他卡牌的选中样式
//                     const allCardElems = element.querySelectorAll('.card');
//                     allCardElems.forEach(otherCardElem => {
//                         if (otherCardElem !== cardElem && otherCardElem.classList.contains('selected')) {
//                             otherCardElem.classList.remove('selected');
//                         }
//                     });
//                 });
//
//                 // 添加鼠标移入事件处理函数
//                 cardElem.addEventListener('mouseenter', () => {
//                     const tooltip = document.createElement('div');
//                     tooltip.classList.add('card-tooltip');
//                     tooltip.textContent = `${card.name}`;
//
//                     if (card.damage !== undefined) {
//                         tooltip.textContent += ` dmg:${card.damage}`;
//                     }
//                     if (card.defense !== undefined) {
//                         tooltip.textContent += ` def:${card.defense}`;
//                     }
//                     if (card.cost !== undefined) {
//                         const costElem = document.createElement('div');
//                         costElem.classList.add('card-cost');
//                         costElem.textContent = `cost:${card.cost}`;
//                         cardElem.appendChild(costElem);
//                     }
//
//                     cardElem.appendChild(tooltip);
//                 });
//
//                 // 添加鼠标移出事件处理函数
//                 cardElem.addEventListener('mouseleave', () => {
//                     const tooltip = cardElem.querySelector('.card-tooltip');
//                     if (tooltip) {
//                         tooltip.remove();
//                     }
//                     const costElem = cardElem.querySelector('.card-cost');
//                     if (costElem) {
//                         costElem.remove();
//                     }
//                 });
//
//                 element.appendChild(cardElem);
//             }
//         });
//     }
//
//     function addToBattleLog(message) {
//         const logElement = document.getElementById('battle-log');
//         const logMessage = document.createElement('p');
//         logMessage.textContent = message;
//         logElement.appendChild(logMessage);
//     }
//
//     function playCard(card) {
//         let player = currentPlayer === 'red' ? '红方' : '蓝方';
//         let effect = getCardEffectDescription(card);
//         round++;
//         addToBattleLog(`第${round}回合：${player}出了${card.name}，${effect}`);
//
//         if (currentPlayer === 'red') {
//             applyCardEffect(card, 'blue');
//             const cardElem = renderCard(card, 'red');
//             redPlayedCards.push(cardElem);
//         } else {
//             applyCardEffect(card, 'red');
//             const cardElem = renderCard(card, 'blue');
//             bluePlayedCards.push(cardElem);
//         }
//         playCardOver();
//     }
//
//     function getCardEffectDescription(card) {
//         if (card.type === 'attack') {
//             return `造成${card.damage}点伤害`;
//         } else if (card.type === 'defense') {
//             return `增加${card.defense}点生命`;
//         } else if (card.type === 'summon') {
//             return `召唤${card.name}`;
//         } else if (card.type === 'spell') {
//             return `施放${card.name}，造成${card.damage}点伤害`;
//         } else if (card.type === 'luck') {
//             return `发动了${card.name}`;
//         }
//         return '';
//     }
//
//     function renderCard(card, player) {
//         const cardElem = document.createElement('div');
//         cardElem.classList.add('card', `played-by-${player}`);
//         const img = document.createElement('img');
//         img.src = `images/${card.img}`;
//         cardElem.appendChild(img);
//         return cardElem;
//     }
//
//     function applyCardEffect(card, opponent) {
//         if (card.type === 'attack') {
//             if (opponent === 'blue') {
//                 blueHp -= card.damage;
//                 blueHpElem.textContent = blueHp;
//             } else {
//                 redHp -= card.damage;
//                 redHpElem.textContent = redHp;
//             }
//         } else if (card.type === 'defense') {
//             if (currentPlayer === 'red') {
//                 redHp += card.defense;
//                 redHpElem.textContent = redHp;
//             } else {
//                 blueHp += card.defense;
//                 blueHpElem.textContent = blueHp;
//             }
//         } else if (card.type === 'summon') {
//             if (currentPlayer === 'red') {
//                 redMp -= card.cost;
//                 redMpElem.textContent = redMp;
//             } else {
//                 blueMp -= card.cost;
//                 blueMpElem.textContent = blueMp;
//             }
//         } else if (card.type === 'spell') {
//             if (opponent === 'blue') {
//                 blueHp -= card.damage;
//                 blueHpElem.textContent = blueHp;
//             } else {
//                 redHp -= card.damage;
//                 redHpElem.textContent = redHp;
//             }
//         } else if (card.type === 'luck') {
//             // 幸运-连发逻辑
//         }
//
//         checkGameOver();
//     }
//
//     function checkGameOver() {
//         if (redHp <= 0) {
//             alert('蓝方获胜！');
//             resetGame();
//         } else if (blueHp <= 0) {
//             alert('红方获胜！');
//             resetGame();
//         }
//     }
//
//     function resetGame() {
//         startScreen.style.display = 'block';
//         gameScreen.style.display = 'none';
//     }
//
//     function playCardOver() {
//         // 确保每个玩家在自己的回合内只能出一张牌后结束回合
//         if (currentPlayer === 'red') {
//             currentPlayer = 'blue';
//             disableCardClick(); // 禁用玩家当前手牌的点击
//             showOpponentTurnMessage(true); // 显示“对手出牌中...”
//             setTimeout(() => {
//                 computerTurn();
//                 showOpponentTurnMessage(false); // 隐藏“对手出牌中...”
//             }, Math.random() * 2000 + 1000); // 模拟电脑出牌
//         } else {
//             currentPlayer = 'red';
//             drawCards(redDeck, redHand, 1);
//             enableCardClick(); // 启用玩家当前手牌的点击
//             addToBattleLog(`第${round}回合：红方结束回合。`);
//         }
//     }
//
//     function disableCardClick() {
//         const hand = currentPlayer === 'red' ? redHand : blueHand;
//         hand.forEach(cardElem => {
//             if (cardElem && cardElem.style) { // 确保 cardElem 存在且有 style 属性
//                 cardElem.onclick = null;
//                 cardElem.style.cursor = 'default';
//             }
//         });
//     }
//
//     function enableCardClick() {
//         const hand = currentPlayer === 'red' ? redHand : blueHand;
//         hand.forEach(cardElem => {
//             if (cardElem && cardElem.style) { // 确保 cardElem 存在
//                 cardElem.onclick = () => playCard(cardElem.cardData);
//                 cardElem.style.cursor = 'pointer';
//             }
//         });
//     }
//
//     function showOpponentTurnMessage(show) {
//         if (show) {
//             const messageElem = document.createElement('div');
//             messageElem.textContent = '对手出牌中...';
//             messageElem.id = 'opponent-turn-message';
//             gameScreen.appendChild(messageElem);
//         } else {
//             const messageElem = document.getElementById('opponent-turn-message');
//             if (messageElem) {
//                 messageElem.remove();
//             }
//         }
//     }
//
//     function computerTurn() {
//         const randomIndex = Math.floor(Math.random() * blueHand.length);
//         const cardToPlay = blueHand[randomIndex];
//         let effect = getCardEffectDescription(cardToPlay);
//         round++;
//         addToBattleLog(`第${round}回合：蓝方出了${cardToPlay.name}，${effect}`);
//         playCard(cardToPlay);
//     }
//
//     showPlayedCardsButton.addEventListener('click', () => {
//         renderPlayedCardsList();
//         playedCardsListContainer.classList.toggle('hidden');
//     });
//
//     function renderPlayedCardsList() {
//         playedCardsListContainer.innerHTML = ''; // 清空之前的内容
//         const ul = document.createElement('ul');
//         playedCardsList.forEach(card => {
//             const li = document.createElement('li');
//             li.textContent = card.name || card.subtype || card.type;
//             ul.appendChild(li);
//         });
//         playedCardsListContainer.appendChild(ul);
//     }
//
//     startGameButton.onclick = () => {
//         redDeck = createDeck();
//         blueDeck = createDeck();
//         redHand = [];
//         blueHand = [];
//         drawCards(redDeck, redHand, 6);
//         drawCards(blueDeck, blueHand, 6);
//         renderHand(redHand, redHandElem);
//         renderHand(blueHand, blueHandElem);
//
//         redHp = 100;
//         blueHp = 100;
//         redMp = 50;
//         blueMp = 50;
//         round = 0; // 初始化回合数为0
//         roundElem.textContent = `当前回合: ${round}`; // 显示初始回合数
//
//         redHpElem.textContent = redHp;
//         blueHpElem.textContent = blueHp;
//         redMpElem.textContent = redMp;
//         blueMpElem.textContent = blueMp;
//
//         startScreen.style.display = 'none';
//         gameScreen.style.display = 'block';
//     };
//
//     playCardOverBtn.onclick = () => {
//         playCardOver();
//     };
// });

document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game');
    const playCardOverBtn = document.getElementById('play-card-over');
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
    let redPlayedCards = [];
    let bluePlayedCards = [];

    const cardPool = [
        {type: 'attack', subtype: 'a', name: '见斩I', damage: 3, quantity: 6, img: 'attack-a.png'},
        {type: 'attack', subtype: 'b', name: '见斩II', damage: 5, quantity: 4, img: 'attack-b.png'},
        {type: 'defense', subtype: 'a', name: '铁骨I', defense: 3, quantity: 6, img: 'defense-a.png'},
        {type: 'defense', subtype: 'b', name: '铁骨II', defense: 6, quantity: 4, img: 'defense-b.png'},
        {type: 'summon', name: '唤鸱', cost: 3, damage: 3, duration: 3, quantity: 3, img: 'summon-eagle.png'},
        {type: 'summon', name: '唤罴', cost: 5, defense: 5, duration: 4, quantity: 2, img: 'summon-bear.png'},
        {type: 'spell', name: '连箭', cost: 5, damage: 6, quantity: 1, img: 'spell.png'},
        {type: 'luck', name: '运长', quantity: 5, img: 'luck.png'}
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
                deck.push({...card});
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
            if (card) {
                const cardElem = document.createElement('div');
                cardElem.classList.add('card');
                cardElem.cardData = card;
                const img = document.createElement('img');
                img.src = `images/${card.img}`;
                cardElem.appendChild(img);

                // 添加点击事件处理函数
                cardElem.addEventListener('click', () => {
                    // 切换选中样式
                    cardElem.classList.toggle('selected');

                    // 取消其他卡牌的选中样式
                    const allCardElems = element.querySelectorAll('.card');
                    allCardElems.forEach(otherCardElem => {
                        if (otherCardElem !== cardElem && otherCardElem.classList.contains('selected')) {
                            otherCardElem.classList.remove('selected');
                        }
                    });
                });

                // 添加鼠标移入事件处理函数
                cardElem.addEventListener('mouseenter', () => {
                    const tooltip = document.createElement('div');
                    tooltip.classList.add('card-tooltip');
                    tooltip.textContent = `${card.name}`;

                    if (card.damage !== undefined) {
                        tooltip.textContent += ` dmg:${card.damage}`;
                    }
                    if (card.defense !== undefined) {
                        tooltip.textContent += ` def:${card.defense}`;
                    }
                    if (card.cost !== undefined) {
                        const costElem = document.createElement('div');
                        costElem.classList.add('card-cost');
                        costElem.textContent = `cost:${card.cost}`;
                        cardElem.appendChild(costElem);
                    }

                    cardElem.appendChild(tooltip);
                });

                // 添加鼠标移出事件处理函数
                cardElem.addEventListener('mouseleave', () => {
                    const tooltip = cardElem.querySelector('.card-tooltip');
                    if (tooltip) {
                        tooltip.remove();
                    }
                    const costElem = cardElem.querySelector('.card-cost');
                    if (costElem) {
                        costElem.remove();
                    }
                });

                element.appendChild(cardElem);
            }
        });
    }

    function addToBattleLog(message) {
        const logElement = document.getElementById('battle-log');
        const logMessage = document.createElement('p');
        logMessage.textContent = message;
        logElement.appendChild(logMessage);
    }

    function playCard(card) {
        let player = currentPlayer === 'red' ? '红方' : '蓝方';
        let effect = getCardEffectDescription(card);
        round++;
        addToBattleLog(`第${round}回合：${player}出了${card.name}，${effect}`);

        if (currentPlayer === 'red') {
            applyCardEffect(card, 'blue');
            const cardElem = renderCard(card, 'red');
            redPlayedCards.push(cardElem);
        } else {
            applyCardEffect(card, 'red');
            const cardElem = renderCard(card, 'blue');
            bluePlayedCards.push(cardElem);
        }
        playCardOver();
    }

    function getCardEffectDescription(card) {
        if (card.type === 'attack') {
            return `造成${card.damage}点伤害`;
        } else if (card.type === 'defense') {
            return `增加${card.defense}点生命`;
        } else if (card.type === 'summon') {
            return `召唤${card.name}`;
        } else if (card.type === 'spell') {
            return `施放${card.name}，造成${card.damage}点伤害`;
        } else if (card.type === 'luck') {
            return `发动了${card.name}`;
        }
        return '';
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

    function playCardOver() {
        // 确保每个玩家都出了一次牌后才切换玩家
        if (currentPlayer === 'red') {
            currentPlayer = 'blue';
            // 电脑出牌逻辑
            setTimeout(() => {
                playComputerTurn();
            }, 1000); // 假设电脑出牌后等待1秒钟
        } else {
            currentPlayer = 'red';
        }
        roundElem.textContent = round;
    }

    function playComputerTurn() {
        // 假设电脑随机出一张手牌
        const randomIndex = Math.floor(Math.random() * blueHand.length);
        const cardToPlay = blueHand[randomIndex];
        blueHand.splice(randomIndex, 1);
        playCard(cardToPlay);
    }

    function showPlayedCards() {
        playedCardsListContainer.innerHTML = '';
        playedCardsList.forEach(card => {
            playedCardsListContainer.appendChild(card);
        });
    }

    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';

        // 初始化游戏状态
        redDeck = createDeck();
        blueDeck = createDeck();
        drawCards(redDeck, redHand, 5);
        drawCards(blueDeck, blueHand, 5);
        renderHand(redHand, redHandElem);
        renderHand(blueHand, blueHandElem);
        redHpElem.textContent = redHp;
        blueHpElem.textContent = blueHp;
        redMpElem.textContent = redMp;
        blueMpElem.textContent = blueMp;
        roundElem.textContent = round;

        // 告知玩家扮演的角色信息
        addToBattleLog('游戏开始！你是红方，对手是蓝方。');

        // 显示开始游戏后的界面
        startGameButton.style.display = 'none'; // 隐藏开始游戏按钮
        playCardOverBtn.style.display = 'block'; // 显示玩家出牌按钮
        showPlayedCardsButton.style.display = 'block'; // 显示显示已打出卡牌按钮

        // 绑定按钮点击事件处理函数
        playCardOverBtn.addEventListener('click', () => {
            const selectedCardElem = redHandElem.querySelector('.card.selected');
            if (selectedCardElem) {
                const selectedCard = selectedCardElem.cardData;
                const index = redHand.indexOf(selectedCard);
                redHand.splice(index, 1);
                playCard(selectedCard);
            } else {
                alert('请先选择一张卡牌！');
            }
        });

        showPlayedCardsButton.addEventListener('click', () => {
            showPlayedCards();
        });
    }
    startGame();

});
