// UI组件 - 玩家信息
var PlayerInfoUI = {
    gameData: null,

    // 初始化玩家信息页面
    init: function() {
        // 从localStorage加载游戏数据
        this.gameData = StorageUtil.get('LinkWarriorGameData', null);

        if (!this.gameData) {
            alert('未找到游戏数据，请先开始游戏！');
            window.location.href = 'index.html';
            return;
        }

        this.render();
        this.bindEvents();
    },

    // 渲染玩家信息页面
    render: function() {
        var gameData = this.gameData;
        // 职业对象：新存档存于 playerClass，老存档可能只在 player.class 中
        var playerClass = gameData.playerClass || (gameData.player && gameData.player.class);
        var player = gameData.player || {};

        if (!playerClass) {
            alert('存档中缺少职业信息，请重新开始游戏。');
            window.location.href = 'index.html';
            return;
        }

        // 背包卡片数（存档字段为 inventory）
        var inventoryCount = Array.isArray(gameData.inventory) ? gameData.inventory.length : 0;

        // 星点数、当前关卡、最大攻克关卡（存档字段：stars / currentRound / maxRound）
        var stars = gameData.stars || 0;
        var currentRound = gameData.currentRound || 1;
        var maxRound = gameData.maxRound || 0;

        var html = `
            <div class="player-info-container">
                <h1>玩家信息</h1>

                <div class="player-basic-info">
                    <div class="player-image">
                        <img src="${playerClass.image}" alt="${playerClass.displayName}">
                    </div>

                    <div class="player-details">
                        <h2>${player.name} <small>(职业：${playerClass.displayName})</small></h2>
                        <p class="player-description">描述：${playerClass.description}</p>

                        <div class="player-stats-summary">
                            <div class="stat-item">
                                <span class="stat-label">最大生命值:</span>
                                <span class="stat-value">${playerClass.maxHp}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">最大护盾值:</span>
                                <span class="stat-value">${playerClass.maxShield}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">最大能量:</span>
                                <span class="stat-value">${playerClass.energyMax}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="player-stats">
                    <div class="stat-item">
                        <span class="stat-label">技能名称:</span>
                        <span class="stat-value">${playerClass.skill.name} (${playerClass.skill.cost}能量)</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">技能描述:</span>
                        <span class="stat-value">${playerClass.skill.description}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">技能消耗:</span>
                        <span class="stat-value">${playerClass.skill.cost} 能量</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">星点数:</span>
                        <span class="stat-value">${stars}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">背包卡片数:</span>
                        <span class="stat-value">${inventoryCount} 张</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前关卡数:</span>
                        <span class="stat-value">${currentRound}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最大攻克关卡数:</span>
                        <span class="stat-value">${maxRound}</span>
                    </div>
                </div>

                <div class="back-button-container">
                    <button id="select-class-btn" class="back-button">选择职业</button>
                    <button id="back-btn" class="back-button">返回主菜单</button>
                </div>
            </div>
        `;

        $('body').html(html);
    },

    // 绑定事件
    bindEvents: function() {
        var self = this;

        // 返回主菜单按钮点击事件
        $('#back-btn').on('click', function() {
            window.location.href = 'index.html';
        });
        
        // 选择职业按钮点击事件
        $('#select-class-btn').on('click', function() {
            window.location.href = 'class-selector.html';
        });
    }
};
