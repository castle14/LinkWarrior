// UI组件 - 主菜单
var MainMenuUI = {
    // 初始化主菜单
    init: function() {
        this.render();
        this.bindEvents();
    },

    // 渲染主菜单
    render: function() {
        // 检查是否有游戏数据
        var hasGameData = !!localStorage.getItem('LinkWarriorGameData');

        var html = `
            <div class="main-menu">
                <h1>连接勇士</h1>
                <div class="menu-buttons">
                    <button id="start-game-btn" class="menu-button">${hasGameData ? '开始游戏' : '新建游戏数据'}</button>
                    ${hasGameData ? `
                        <button id="deck-edit-btn" class="menu-button">卡组编辑</button>
                        <button id="card-shop-btn" class="menu-button">卡片商店</button>
                        <button id="player-info-btn" class="menu-button">玩家信息</button>
                    ` : ''}
                </div>
            </div>
        `;

        $('body').html(html);
    },

    // 绑定事件
    bindEvents: function() {
        var self = this;

        $('#start-game-btn').on('click', function() {
            self.startGame();
        });

        $('#deck-edit-btn').on('click', function() {
            window.location.href = 'deck-editor.html';
        });

        $('#card-shop-btn').on('click', function() {
            window.location.href = 'card-shop.html';
        });

        $('#player-info-btn').on('click', function() {
            window.location.href = 'player-info.html';
        });
    },

    // 开始游戏
    startGame: function() {
        // 检查localStorage中是否已有游戏数据
        if (localStorage.getItem('LinkWarriorGameData')) {
            // 如果已有数据，直接跳转到战斗页面
            window.location.href = 'game.html';
            return;
        }

        // 初始化游戏数据
        var gameData = {};

        // 当前轮数为1
        gameData.currentRound = 1;

        // 星点值初始为0
        gameData.stars = 0;

        // 当前玩家的职业为英雄小子
        var heroKidClass = ClassData.getClassById(18); // 英雄小子的职业ID为18
        gameData.playerClass = heroKidClass;

        // 当前玩家的信息用英雄小子这个职业生成
        gameData.player = {
            name: "勇士",
            hp: gameData.playerClass.maxHp,
            maxHp: gameData.playerClass.maxHp,
            shield: Math.floor(gameData.playerClass.maxShield/2),
            maxShield: gameData.playerClass.maxShield,
            class: gameData.playerClass,
            statusEffects: []
        };

        // 当前卡组为从按照carddata里的卡片数据随机生成32张rarity为1的卡片（同名卡片不能超过5张）
        let gCardlist = this.generateDeck(32, [1], 5);
        //取gCardlist前30张赋值给gameData.deck
        gameData.deck = gCardlist.slice(0, 30);
        // 初始化背包为空
        gameData.inventory = gCardlist.slice(30, 32);

        // 存储到localStorage
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));

        // 提醒初始化信息完成
        alert('游戏初始化完成！');

        // 刷新页面
        location.reload();

    },

    // 生成卡组
    generateDeck: function(deckSize, rarities, maxSameCard) {
        // 获取所有符合稀有度要求的卡片
        var availableCards = [];
        var allCards = CardData.getAllCards();

        for (var i = 0; i < allCards.length; i++) {
            if (rarities.indexOf(allCards[i].rarity) !== -1) {
                availableCards.push(allCards[i]);
            }
        }

        // 随机生成卡组
        var deck = [];
        var cardCount = {}; // 记录每种卡片的数量

        while (deck.length < deckSize) {
            // 随机选择一张卡片
            var randomIndex = Math.floor(Math.random() * availableCards.length);
            var card = Object.assign({}, availableCards[randomIndex]); // 创建卡片副本

            // 检查同名卡片是否已超过限制
            if (!cardCount[card.name]) {
                cardCount[card.name] = 0;
            }

            if (cardCount[card.name] < maxSameCard) {
                // 为每张卡片添加唯一ID
                card.uniqueId = card.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + deck.length;

                // 添加卡片到卡组
                deck.push(card);
                cardCount[card.name]++;
            }
        }

        return deck;
    }
};
