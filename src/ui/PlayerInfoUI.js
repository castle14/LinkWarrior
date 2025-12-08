// UI组件 - 玩家信息
var PlayerInfoUI = {
    gameData: null,

    // 初始化玩家信息页面
    init: function() {
        // 从localStorage加载游戏数据
        this.gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));

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
        var playerClass = this.gameData.playerClass;
        var player = this.gameData.player;

        // 计算背包中的卡片数量
        var backpackCount = 0;
        if (this.gameData.backpack && Array.isArray(this.gameData.backpack)) {
            backpackCount = this.gameData.backpack.length;
        }

        // 获取星点数、当前关卡数、最大攻克关卡数
        var starPoint = this.gameData.starPoint || 0;
        var currentLevel = this.gameData.currentLevel || 1;
        var maxLevel = this.gameData.maxLevel || 1;

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
                        <span class="stat-value">${playerClass.skill.name}</span>
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
                        <span class="stat-value">${starPoint}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">背包卡片数:</span>
                        <span class="stat-value">${backpackCount} 张</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">当前关卡数:</span>
                        <span class="stat-value">${currentLevel}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">最大攻克关卡数:</span>
                        <span class="stat-value">${maxLevel}</span>
                    </div>
                </div>

                <div class="back-button-container">
                    <button id="back-btn" class="back-button">返回主菜单</button>
                    <button id="select-class-btn" class="back-button">选择职业</button>
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
