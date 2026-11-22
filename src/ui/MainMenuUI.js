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
                    <button id="gameplay-guide-btn" class="menu-button">玩法说明</button>
                    <button id="storage-manage-btn" class="menu-button">存档管理</button>
                    ${hasGameData ? `
                        <button id="reset-game-btn" class="menu-button menu-button-danger">重新开始</button>
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

        $('#gameplay-guide-btn').on('click', function() {
            window.location.href = 'gameplay-guide.html';
        });

        $('#storage-manage-btn').on('click', function() {
            window.location.href = 'storage-manager.html';
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

        $('#reset-game-btn').on('click', function() {
            self.resetGame();
        });
    },

    // 删除所有数据，重新开始
    resetGame: function() {
        // 二次确认，避免误触
        var confirmed = confirm('确定要删除所有游戏数据并重新开始吗？\n\n此操作将清空：\n- 玩家进度（等级、生命、护甲、能量等）\n- 卡组与背包中的所有卡片\n- 卡片商店的刷新记录\n\n该操作不可撤销，请谨慎操作！');
        if (!confirmed) {
            return;
        }

        // 再次确认，防止误操作
        var secondConfirm = confirm('再次确认：\n所有游戏进度将被永久删除，确定继续吗？');
        if (!secondConfirm) {
            return;
        }

        // 清空所有 LinkWarrior 相关的 localStorage 数据
        localStorage.removeItem('LinkWarriorGameData');
        localStorage.removeItem('LinkWarriorShopCards');

        // 提醒用户
        alert('所有游戏数据已清空，将返回初始状态。');

        // 刷新页面，回到"新建游戏数据"状态
        location.reload();
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
            shield: gameData.playerClass.maxShield,
            maxShield: gameData.playerClass.maxShield,
            class: gameData.playerClass,
            statusEffects: []
        };

        // 当前卡组为从按照carddata里的卡片数据随机生成33张rarity为1的卡片（同名卡片不能超过5张）
        let gCardlist = GameUtil.generateDeck(33, [1], 5);
        //取gCardlist前30张赋值给gameData.deck
        gameData.deck = gCardlist.slice(0, 30);
        // 初始化背包为空
        gameData.inventory = gCardlist.slice(30, 33);

        // 存储到localStorage
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));

        // 提醒初始化信息完成
        alert('游戏初始化完成！');

        // 刷新页面
        location.reload();

    }
};
