// UI组件 - 职业选择器
var ClassSelectorUI = {
    gameData: null,

    // 初始化职业选择页面
    init: function() {
        // 从localStorage加载游戏数据
        this.gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));

        this.render();
        this.bindEvents();
    },

    // 渲染职业选择页面
    render: function() {
        var classes = ClassData.getAllClasses();

        var html = `
            <div class="player-info-container">
                <h1>选择职业</h1>

                <div class="classes-list">
        `;

        // 获取已解锁的职业列表，如果没有则默认只有当前职业已解锁
        var unlockedClasses = this.gameData.unlockedClasses || [this.gameData.playerClass.id];

        // 遍历所有职业并生成展示项
        for (var i = 0; i < classes.length; i++) {
            var cls = classes[i];
            var isUnlocked = unlockedClasses.includes(cls.id);
            var buttonText = cls.id === this.gameData.playerClass.id ? "当前职业" : (isUnlocked ? "已解锁，点击转职" : "点击解锁");

            html += `
                <div class="class-item" data-class-id="${cls.id}">
                <div class="class-basic-info">
                    <div class="class-display-name">${cls.displayName} <span class="class-info-button ${buttonText.includes('当前职业') ? 'class-info-button-checked' : (buttonText.includes('点击解锁') ? 'class-info-button-lock' : '')}" data-class-id="${cls.id}">（${buttonText}）</span></div>
                    <div class="player-description">描述：${cls.description}</div>
                </div>
                    <div class="player-basic-info">
                        <div class="player-image">
                            <img src="${cls.image}" alt="${cls.displayName}">
                        </div>

                        <div class="player-details">


                            <div class="player-stats-summary">
                                <div class="stat-item">
                                    <span class="stat-label">最大生命值:</span>
                                    <span class="stat-value">${cls.maxHp}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">最大护盾值:</span>
                                    <span class="stat-value">${cls.maxShield}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">最大能量:</span>
                                    <span class="stat-value">${cls.energyMax}</span>
                                </div>

                                <div class="stat-item">
                                    <span class="stat-label">技能名称:</span>
                                    <span class="stat-value">${cls.skill.name}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">技能描述:</span>
                                    <span class="stat-value">${cls.skill.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
                </div>

                <div class="back-button-container">
                    <button id="back-btn" class="back-button">返回玩家信息</button>
                </div>
            </div>
        `;

        $('body').html(html);
    },

    // 绑定事件
    bindEvents: function() {
        var self = this;

        // 先解绑之前的事件监听器，防止重复绑定
        $('#back-btn').off('click');
        $('body').off('click', '.class-info-button');

        // 返回按钮点击事件
        $('#back-btn').on('click', function() {
            window.location.href = 'player-info.html';
        });

        // 职业操作按钮点击事件（使用事件委托）
        $('body').on('click', '.class-info-button', function() {
            var classId = $(this).data('class-id');
            var buttonText = $(this).text();

            // 判断按钮文本内容来决定执行什么操作
            if (buttonText.indexOf('点击解锁') !== -1) {
                self.unlockClass(classId);
            } else if (buttonText.indexOf('转职') !== -1) {
                self.switchClass(classId);
            }
        });
    },

    // 解锁职业
    unlockClass: function(classId) {
        // 获取已解锁的职业列表
        var unlockedClasses = this.gameData.unlockedClasses || [this.gameData.playerClass.id];

        // 检查是否已解锁
        if (unlockedClasses.includes(classId)) {
            alert('该职业已解锁！');
            return;
        }

        // 检查星点是否足够
        var starPoint = this.gameData.starPoint || 0;
        if (starPoint < GameUtil.CLASS_UNLOCK_COST) {
            alert('星点不足！需要' + GameUtil.CLASS_UNLOCK_COST + '星点才能解锁职业。');
            return;
        }

        // 扣除星点
        this.gameData.starPoint = starPoint - GameUtil.CLASS_UNLOCK_COST;

        // 添加解锁职业的逻辑，比如消耗游戏币等
        // 简单起见，我们现在直接解锁
        unlockedClasses.push(classId);
        this.gameData.unlockedClasses = unlockedClasses;

        // 保存到localStorage
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(this.gameData));

        // 重新渲染页面
        this.render();
        this.bindEvents();

        alert('职业解锁成功！');
    },

    // 转职到指定职业
    switchClass: function(classId) {
        // 获取目标职业
        var targetClass = ClassData.getClassById(classId);

        // 检查是否已经是当前职业
        if (this.gameData.playerClass.id === classId) {
            alert('这已经是您的当前职业！');
            return;
        }

        // 确认转职
        if (!confirm(`确定要转职为${targetClass.displayName}吗？`)) {
            return;
        }

        // 更新玩家职业
        this.gameData.playerClass = targetClass;
        this.gameData.player.class = targetClass;
        this.gameData.player.maxHp = targetClass.maxHp;
        this.gameData.player.hp =  targetClass.maxHp;
        this.gameData.player.maxShield = targetClass.maxShield;
        this.gameData.player.shield = Math.floor(targetClass.maxShield/2);

        // 保存到localStorage
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(this.gameData));

        // 重新渲染页面
        this.render();
        this.bindEvents();

        alert(`成功转职为${targetClass.displayName}！`);
    }
};
