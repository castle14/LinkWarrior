// UI组件 - 卡组编辑器
var DeckEditorUI = {
    gameData: null,
    selectedCard: null,
    selectedCardUniqueId: null, // 添加唯一ID跟踪

    // 初始化卡组编辑器
    init: function(gameData) {
        this.gameData = gameData;
        this.render();
        this.bindEvents();
    },

    // 为卡片列表添加唯一ID
    addUniqueIds: function(cardList) {
        for (var i = 0; i < cardList.length; i++) {
            if (!cardList[i].uniqueId) {
                cardList[i].uniqueId = cardList[i].id + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
            }
        }
    },

    // 渲染卡组编辑器
    render: function() {
        var html = `
            <div class="deck-editor">
                <h1>卡组编辑</h1>
                 <!-- 卡片详情面板 -->
                <div class="card-details-panel" id="card-details-panel">
                    ${this.selectedCard ? this.renderCardDetails(this.selectedCard) : this.renderDeckStatistics()}
                </div>
                <div class="editor-container">
                    <div class="section">
                        <h2>当前卡组 (卡片数：${this.gameData.deck ? this.gameData.deck.length : 0} 张)</h2>
                        <div class="deck-list" id="deck-list">
                            ${this.renderCardList(this.gameData.deck)}
                        </div>
                    </div>
                    <div class="section">
                        <h2>背包 (卡片数：${this.gameData.inventory ? this.gameData.inventory.length : 0} 张, 星点值: ${this.gameData.stars !== undefined ? this.gameData.stars : 0})</h2>
                        <div class="inventory-list" id="inventory-list">
                            ${this.renderCardList(this.gameData.inventory)}
                        </div>
                    </div>
                </div>
                <!-- 按钮区 -->
                <div class="actions">
                    <button id="move-card-btn" class="menu-button">移动卡片</button>
                    <button id="disassemble-card-btn" class="menu-button">分解卡片</button>
                    <button id="save-deck-btn" class="menu-button">保存数据</button>
                    <button id="back-to-menu-btn" class="menu-button">返回主菜单</button>
                </div>
            </div>
        `;

        $('body').html(html);
    },

    // 渲染卡片列表
    renderCardList: function(cardList) {
      if (!cardList || cardList.length === 0) {
        return '<div class="empty-list">空</div>';
      }

      // 先对卡片列表进行排序，按稀有度降序，再按名称排序
      var sortedCardList = cardList.slice().sort(function(a, b) {
        // 首先按稀有度降序排序
        if (a.rarity !== b.rarity) {
          return b.rarity - a.rarity;
        }
        // 稀有度相同时按名称排序
        return a.name.localeCompare(b.name);
      });

      var cardsHtml = '';
      for (var i = 0; i < sortedCardList.length; i++) {
        var card = sortedCardList[i];
        // 获取卡片图片路径，如果卡片数据中有图片则使用，否则使用默认图片
        var imagePath = card.image || './img/card/default.jpg';

        // 构建标签
        var tags = [];
        // 添加类型标签
        if (CardUtils.getTypeName(card.type)) {
          tags.push(`<span class="card-tag tag-type">${CardUtils.getTypeName(card.type)}</span>`);
        }

        // 添加目标类型标签
        if (CardUtils.getTargetTypeName(card.targetType)) {
          tags.push(`<span class="card-tag tag-target">${CardUtils.getTargetTypeName(card.targetType)}</span>`);
        }

        // 添加属性标签
        if (CardUtils.getAttributeName(card.attribute)) {
          tags.push(`<span class="card-tag tag-attribute">${CardUtils.getAttributeName(card.attribute)}</span>`);
        }

        // 构建数值标签
        var values = [];
        if (card.value > 0) {
          // 根据卡片类型确定显示标签
          if (card.type === "weapon" || card.type === "spell") {
            values.push(`<span class="card-tag tag-damage">${card.value}</span>`);
          } else if (card.type === "shield") {
            values.push(`<span class="card-tag tag-shield">${card.value}</span>`);
          } else if (card.type === "potion") {
            values.push(`<span class="card-tag tag-heal">${card.value}</span>`);
          }
        }

        // 添加稀有度标签
        //tags.push(`<span class="card-tag tag-rarity">${GameUtil.getRarityText(card.rarity)}</span>`);

        // 检查是否是选中的卡片
        var isSelected = this.selectedCardUniqueId && this.selectedCardUniqueId === card.uniqueId;
        var cardClass = isSelected ? 'card card-selected' : 'card';

        cardsHtml += `
                <div class="${cardClass}" data-unique-id="${card.uniqueId}">
                    <div class="card-name">${card.name}</div>
                    <div class="card-image">
                        <img src="${imagePath}" alt="${card.name}" onerror="this.src='./img/card/default.jpg'">
                    </div>
                    <div class="card-tags">
                        ${tags.join('')}
                        ${values.join('')}
                    </div>
                </div>
            `;
      }
      return cardsHtml;
    },

    // 渲染卡片详情
    renderCardDetails: function(card) {
      if (!card) return '';

      var imagePath = card.image || './img/card/default.jpg';

      // 稀有度文本
      var rarityText = GameUtil.getRarityText(card.rarity);

      // 类型文本
      var typeText = CardUtils.getTypeName(card.type) || card.type;

      // 目标类型文本
      var targetText = CardUtils.getTargetTypeName(card.targetType) || card.targetType;

      // 属性文本
      var attributeText = card.attribute ? (CardUtils.getAttributeName(card.attribute) || card.attribute) : '无';

      // 属性等级文本
      var attributeLevelText = card.attribute ? card.attributeLevel : 0;

      return `
            <div class="card-details">
                <div class="card-detail-content" style="flex-direction: row !important;">
                    <div class="card-detail-image">
                        <img src="${imagePath}" alt="${card.name}" onerror="this.src='./img/card/default.jpg'">
                        <div class="card-description">${card.description}</div>
                    </div>
                    <div class="card-detail-info">
                        <div class="card-properties-text">
                            <p><strong>名称:</strong> ${card.name}</p>
                            <p><strong>类型:</strong> ${typeText}</p>
                            <p><strong>目标:</strong> ${targetText}</p>
                            <p><strong>属性:</strong> ${attributeText}</p>
                            <p><strong>属性等级:</strong> ${attributeLevelText}</p>
                            <p><strong>稀有度:</strong> ${rarityText}</p>
                            <p><strong>数值:</strong> ${card.value}</p>
                            <p><strong>分解可获得星点:</strong> ${GameUtil.getStarValueForRarity(card.rarity)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 渲染卡组统计信息
    renderDeckStatistics: function() {
        if (!this.gameData.deck || this.gameData.deck.length === 0) {
            return '<div class="no-selection">卡组为空</div>';
        }

        // 统计卡片数量
        var cardStats = {};
        for (var i = 0; i < this.gameData.deck.length; i++) {
            var card = this.gameData.deck[i];
            var key = card.name + '|' + card.rarity; // 使用名称和稀有度组合作为键

            if (!cardStats[key]) {
                cardStats[key] = {
                    name: card.name,
                    rarity: card.rarity,
                    count: 0
                };
            }
            cardStats[key].count++;
        }

        // 将统计信息转换为数组并按稀有度从高到低排序
        var statsArray = [];
        for (var key in cardStats) {
            statsArray.push(cardStats[key]);
        }

        // 按稀有度降序排序，稀有度相同时按名称排序
        statsArray.sort(function(a, b) {
            if (a.rarity !== b.rarity) {
                return b.rarity - a.rarity; // 稀有度降序
            }
            return a.name.localeCompare(b.name); // 名称升序
        });

        // 构建统计信息HTML
        var statsHtml = '<div class="deck-statistics"><h3>卡组统计信息</h3><ul>';
        for (var i = 0; i < statsArray.length; i++) {
            var stat = statsArray[i];
            var rarityText = GameUtil.getRarityText(stat.rarity);
            statsHtml += `<li>【${stat.name}】（${rarityText}）× ${stat.count}</li>`;
        }
        statsHtml += '</ul></div>';

        return statsHtml;
    },

    // 绑定事件
    bindEvents: function() {
        var self = this;

        // 返回主菜单按钮
        $('#back-to-menu-btn').on('click', function() {
            window.location.href = 'index.html';
        });

        // 保存卡组按钮
        $('#save-deck-btn').on('click', function() {
            self.saveDeck();
        });

        // 移动卡片按钮
        $('#move-card-btn').on('click', function() {
            self.moveSelectedCard();
        });

        // 分解卡片按钮
        $('#disassemble-card-btn').on('click', function() {
            self.disassembleSelectedCard();
        });

        // 卡片点击事件（委派）
        $('#deck-list, #inventory-list').on('click', '.card', function() {
            var uniqueId = $(this).data('unique-id');

            // 在整个游戏数据中查找具有此唯一ID的卡片
            var allCards = self.gameData.deck.concat(self.gameData.inventory);
            var card = null;
            for (var i = 0; i < allCards.length; i++) {
                if (allCards[i].uniqueId == uniqueId) {
                    card = allCards[i];
                    break;
                }
            }

            if (card) {
                self.selectCard(card);
            }
        });
    },

    // 选择卡片
    selectCard: function(card) {
        this.selectedCard = card;
        this.selectedCardUniqueId = card.uniqueId;
        // 只更新卡片详情面板和卡片选中状态，而不重新渲染整个界面
        $('#card-details-panel').html(this.renderCardDetails(card));

        // 移除所有卡片的选中状态
        $('.card').removeClass('card-selected');

        // 为当前选中的卡片添加选中状态
        $('.card[data-unique-id="' + card.uniqueId + '"]').addClass('card-selected');
    },

    // 移动选中的卡片
    moveSelectedCard: function() {
        if (!this.selectedCard) {
            alert('请先选择一张卡片！');
            return;
        }

        // 查找卡片当前所在的位置
        var cardLocation = this.findCardLocation(this.selectedCard.uniqueId);

        if (cardLocation === 'deck') {
            // 卡片在卡组中，移动到背包
            this.moveCard(this.selectedCard.uniqueId, 'deck', 'inventory');
        } else if (cardLocation === 'inventory') {
            // 卡片在背包中，移动到卡组
            // 检查移动到卡组后是否会违反同名卡片不能超过5张的规则
            if (this.wouldExceedMaxSameCard(this.selectedCard.name, 'deck')) {
                alert('同名卡片【'+this.selectedCard.name+'】不能超过5张！');
                return;
            }
            this.moveCard(this.selectedCard.uniqueId, 'inventory', 'deck');
        } else {
            alert('找不到选中的卡片！');
            return;
        }

        // 重新渲染界面并重新绑定事件
        this.render();
        this.bindEvents();
    },

    // 分解选中的卡片
    disassembleSelectedCard: function() {
        if (!this.selectedCard) {
            alert('请先选择一张卡片！');
            return;
        }

        // 确认分解操作
        var starValue = GameUtil.getStarValueForRarity(this.selectedCard.rarity);
        if (!confirm(`确定要分解这张"${this.selectedCard.name}"卡片吗？分解后可获得${starValue}星点值。`)) {
            return;
        }

        // 查找卡片当前所在的位置
        var cardLocation = this.findCardLocation(this.selectedCard.uniqueId);

        if (cardLocation === 'deck' || cardLocation === 'inventory') {
            // 从对应的列表中移除卡片
            this.removeCard(this.selectedCard.uniqueId, cardLocation);

            // 增加星点值
            if (!this.gameData.stars) {
                this.gameData.stars = 0;
            }
            this.gameData.stars += starValue;

            // 清除选中状态
            this.selectedCard = null;
            this.selectedCardUniqueId = null;

            // 重新渲染界面并重新绑定事件
            this.render();
            this.bindEvents();

            alert(`卡片分解成功！获得${starValue}星点值。`);
        } else {
            alert('找不到选中的卡片！');
            return;
        }
    },

    // 查找卡片位置
    findCardLocation: function(uniqueId) {
        // 在卡组中查找
        for (var i = 0; i < this.gameData.deck.length; i++) {
            if (this.gameData.deck[i].uniqueId === uniqueId) {
                return 'deck';
            }
        }

        // 在背包中查找
        for (var i = 0; i < this.gameData.inventory.length; i++) {
            if (this.gameData.inventory[i].uniqueId === uniqueId) {
                return 'inventory';
            }
        }

        return null;
    },

    // 移动卡片
    moveCard: function(uniqueId, from, to) {
        var fromList = this.gameData[from];
        var toList = this.gameData[to];

        // 查找要移动的卡片
        var cardIndex = -1;
        var card = null;

        for (var i = 0; i < fromList.length; i++) {
            if (fromList[i].uniqueId === uniqueId) {
                cardIndex = i;
                card = fromList[i];
                break;
            }
        }

        if (cardIndex === -1) {
            alert('找不到要移动的卡片！');
            return;
        }

        // 从原列表中移除卡片
        fromList.splice(cardIndex, 1);

        // 将卡片添加到目标列表
        toList.push(card);

        // 清除选中状态
        this.selectedCard = null;
        this.selectedCardUniqueId = null;
    },

    // 移除卡片
    removeCard: function(uniqueId, from) {
        var fromList = this.gameData[from];

        // 查找要移除的卡片
        var cardIndex = -1;

        for (var i = 0; i < fromList.length; i++) {
            if (fromList[i].uniqueId === uniqueId) {
                cardIndex = i;
                break;
            }
        }

        if (cardIndex === -1) {
            alert('找不到要移除的卡片！');
            return;
        }

        // 从列表中移除卡片
        fromList.splice(cardIndex, 1);

        // 清除选中状态
        this.selectedCard = null;
        this.selectedCardUniqueId = null;
    },

    // 保存卡组
    saveDeck: function() {
        // 校验卡组数量是否为30张
        if (this.gameData.deck.length !== 30) {
            alert('卡组必须包含30张卡片，当前卡组有' + this.gameData.deck.length + '张卡片！');
            return;
        }

        // 检查卡组中是否有同名卡片超过5张的情况
        var cardNames = {};
        for (var i = 0; i < this.gameData.deck.length; i++) {
            var cardName = this.gameData.deck[i].name;
            if (!cardNames[cardName]) {
                cardNames[cardName] = 0;
            }
            cardNames[cardName]++;

            // 如果发现某张卡片超过5张，立即报错并返回
            if (cardNames[cardName] > 5) {
                alert('同名卡片【' + cardName + '"】不能超过5张！');
                return;
            }
        }

        // 将更新后的游戏数据保存到localStorage
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(this.gameData));

        // 弹窗提示保存成功
        alert('卡组保存成功！');
    },

    // 检查移动卡片后是否会违反同名卡片不能超过5张的规则
    wouldExceedMaxSameCard: function(cardName, targetListName) {
        var targetList = this.gameData[targetListName] || [];
        var count = 0;

        for (var i = 0; i < targetList.length; i++) {
            if (targetList[i].name === cardName) {
                count++;
            }
        }

        // 如果目标列表中已经有5张同名卡片，则不能再添加
        return count >= 5;
    }

};
