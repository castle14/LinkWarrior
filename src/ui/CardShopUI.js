// UI组件 - 卡片商店
var CardShopUI = {
    gameData: null,
    selectedCard: null,
    shopCards: [], // 商店卡片列表

    // 初始化卡片商店
    init: function() {
        // 加载游戏数据
        this.gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));

        if (!this.gameData) {
            alert('请先创建游戏数据！');
            window.location.href = 'index.html';
            return;
        }

        // 加载商店卡片数据
        this.loadShopCards();

        this.render();
        this.bindEvents();
    },

    // 加载商店卡片数据
    loadShopCards: function() {
        // 尝试从localStorage获取商店卡片
        var storedShopCards = localStorage.getItem('LinkWarriorShopCards');
        if (storedShopCards) {
            this.shopCards = JSON.parse(storedShopCards);
        } else {
            // 如果没有存储的商店卡片，则生成10张卡片
            this.shopCards = this.generateShopCards(10);
            // 存储到localStorage
            localStorage.setItem('LinkWarriorShopCards', JSON.stringify(this.shopCards));
        }
    },

    // 生成商店卡片
    generateShopCards: function(count) {
        // 生成不同稀有度的卡片
        var rarities = [1, 2, 3, 4, 5]; // N, R, SR, SSR, UR
        var maxSameCard = 3; // 同名卡片最多3张

        // 使用GameUtil.generateDeck生成商店卡片
        return GameUtil.generateDeck(count, rarities, maxSameCard);
    },

    // 渲染卡片商店
    render: function() {
        var html = `
            <div class="deck-editor">
                <h1>卡片商店</h1>
                <!-- 卡片详情面板 -->
                <div class="card-details-panel" id="card-details-panel">
                    ${this.selectedCard ? this.renderCardDetails(this.selectedCard) : '<div class="no-selection">请选择一张卡片查看详情</div>'}
                </div>
                <div class="editor-container">
                    <div class="section">
                        <h2>可购买的卡片 (${this.shopCards.length} 张)</h2>
                        <div class="deck-list" id="shop-list">
                            ${this.renderShopCards()}
                        </div>
                    </div>
                    <div class="section">
                        <h2>背包 (星点值: ${this.gameData.stars !== undefined ? this.gameData.stars : 0})</h2>
                        <div class="inventory-list" id="inventory-list">
                            ${this.renderInventoryCards()}
                        </div>
                    </div>
                </div>
                <!-- 按钮区 -->
                <div class="actions">
                    <button id="buy-card-btn" class="menu-button">购买卡片</button>
                    <button id="refresh-shop-btn" class="menu-button">刷新商店</button>
                    <button id="back-to-menu-btn" class="menu-button">返回主菜单</button>
                </div>
            </div>
        `;

        $('body').html(html);
    },

    // 渲染商店卡片列表
    renderShopCards: function() {
        // 先对卡片列表进行排序，按稀有度降序，再按名称排序
        var sortedShopCards = this.shopCards.slice().sort(function(a, b) {
            // 首先按稀有度降序排序
            if (a.rarity !== b.rarity) {
                return b.rarity - a.rarity;
            }
            // 稀有度相同时按名称排序
            return a.name.localeCompare(b.name);
        });

        if (sortedShopCards.length === 0) {
            return '<div class="empty-list">暂无可购买的卡片</div>';
        }

        var cardsHtml = '';
        for (var i = 0; i < sortedShopCards.length; i++) {
            var card = sortedShopCards[i];
            var cost = GameUtil.calculateCardCost(card.rarity);

            // 获取卡片图片路径
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

            // 检查是否是选中的卡片
            var isSelected = this.selectedCard && this.selectedCard.uniqueId === card.uniqueId;
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
                    <div class="card-cost">
                        <span class="cost-label"> ${cost} 星点</span>
                    </div>
                </div>
            `;
        }
        return cardsHtml;
    },

    // 渲染背包卡片列表
    renderInventoryCards: function() {
        var inventory = this.gameData.inventory || [];

        // 先对卡片列表进行排序，按稀有度降序，再按名称排序
        var sortedCardList = inventory.slice().sort(function(a, b) {
            // 首先按稀有度降序排序
            if (a.rarity !== b.rarity) {
                return b.rarity - a.rarity;
            }
            // 稀有度相同时按名称排序
            return a.name.localeCompare(b.name);
        });

        if (sortedCardList.length === 0) {
            return '<div class="empty-list">背包为空</div>';
        }

        var cardsHtml = '';
        for (var i = 0; i < sortedCardList.length; i++) {
            var card = sortedCardList[i];
            // 获取卡片图片路径
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

            // 检查是否是选中的卡片
            var isSelected = this.selectedCard && this.selectedCard.uniqueId === card.uniqueId;
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

        // 如果是商店中的卡片，显示价格；如果是背包中的卡片，显示分解价值
        var valueInfo = '';
        if (card.uniqueId && !card.shopId) {
            // 背包中的卡片，显示分解价值
            valueInfo = `<p><strong>分解可获得星点:</strong> ${GameUtil.getStarValueForRarity(card.rarity)}</p>`;
        } else {
            // 商店中的卡片，显示购买价格
            var cost = GameUtil.calculateCardCost(card.rarity);
            valueInfo = `<p><strong>购买价格:</strong> ${cost} 星点</p>`;
        }

        // 计算该卡片在卡组和背包中的数量总和
        var cardCountInDeck = 0;
        var cardCountInInventory = 0;

        // 计算卡组中的数量
        if (this.gameData && this.gameData.deck) {
            for (var i = 0; i < this.gameData.deck.length; i++) {
                if (this.gameData.deck[i].name === card.name) {
                    cardCountInDeck++;
                }
            }
        }

        // 计算背包中的数量
        if (this.gameData && this.gameData.inventory) {
            for (var i = 0; i < this.gameData.inventory.length; i++) {
                if (this.gameData.inventory[i].name === card.name) {
                    cardCountInInventory++;
                }
            }
        }

        var totalCount = cardCountInDeck + cardCountInInventory;
        var deckInfo = `<p><strong>持有数量:</strong> ${totalCount} 张 (卡组:${cardCountInDeck} 背包:${cardCountInInventory})</p>`;

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
                            ${valueInfo}
                            ${deckInfo}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 绑定事件
    bindEvents: function() {
        var self = this;

        // 返回主菜单按钮
        $('#back-to-menu-btn').on('click', function() {
            window.location.href = 'index.html';
        });

        // 购买卡片按钮
        $('#buy-card-btn').on('click', function() {
            self.buySelectedCard();
        });

        // 刷新商店按钮
        $('#refresh-shop-btn').on('click', function() {
            // 检查星点是否足够
            if (!self.gameData.stars || self.gameData.stars < 100) {
                alert('星点不足！刷新商店需要100星点。');
                return;
            }

            if (confirm('确定要刷新商店吗？这将消耗100星点并替换所有可购买的卡片。')) {
                // 扣除100星点
                self.gameData.stars -= 100;

                // 更新localStorage中的游戏数据
                localStorage.setItem('LinkWarriorGameData', JSON.stringify(self.gameData));

                // 删除旧的商店卡片数据
                localStorage.removeItem('LinkWarriorShopCards');

                // 重新加载页面以刷新商店
                location.reload();
            }
        });

        // 商店卡片点击事件（委派）
        $('#shop-list').on('click', '.card', function() {
            var uniqueId = $(this).data('unique-id');

            // 在商店卡片中查找具有此ID的卡片
            var card = null;
            for (var i = 0; i < self.shopCards.length; i++) {
                if (self.shopCards[i].uniqueId == uniqueId) {
                    card = self.shopCards[i];
                    break;
                }
            }

            if (card) {
                self.selectCard(card);
            }
        });

        // 背包卡片点击事件（委派）
        $('#inventory-list').on('click', '.card', function() {
            var uniqueId = $(this).data('unique-id');

            // 在背包中查找具有此唯一ID的卡片
            var inventory = self.gameData.inventory || [];
            var card = null;
            for (var i = 0; i < inventory.length; i++) {
                if (inventory[i].uniqueId == uniqueId) {
                    card = inventory[i];
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
        // 只更新卡片详情面板和卡片选中状态，而不重新渲染整个界面
        $('#card-details-panel').html(this.renderCardDetails(card));

        // 移除所有卡片的选中状态
        $('.card').removeClass('card-selected');

        $('.card[data-unique-id="' + card.uniqueId + '"]').addClass('card-selected');
    },

    // 购买选中的卡片
    buySelectedCard: function() {
        // 检查是否有选中的卡片
        if (!this.selectedCard) {
            alert('请先选择一张卡片！');
            return;
        }

        // 检查这张卡片是否在商店中
        var cardIndex = -1;
        for (var i = 0; i < this.shopCards.length; i++) {
            if (this.shopCards[i].uniqueId === this.selectedCard.uniqueId) {
                cardIndex = i;
                break;
            }
        }

        if (cardIndex === -1) {
            alert('选中的卡片不在商店中！');
            return;
        }

        // 获取卡片价格
        var cardCost = GameUtil.calculateCardCost(this.selectedCard.rarity);

        // 检查星点是否足够
        if (!this.gameData.stars || this.gameData.stars < cardCost) {
            alert('星点不足！无法购买该卡片。');
            return;
        }

        // 扣除星点
        this.gameData.stars -= cardCost;

        // 将卡片从商店移除
        var purchasedCard = this.shopCards.splice(cardIndex, 1)[0];

        // 将卡片添加到背包
        if (!this.gameData.inventory) {
            this.gameData.inventory = [];
        }
        this.gameData.inventory.push(purchasedCard);

        // 更新localStorage中的数据
        localStorage.setItem('LinkWarriorGameData', JSON.stringify(this.gameData));
        localStorage.setItem('LinkWarriorShopCards', JSON.stringify(this.shopCards));

        // 重置选中的卡片
        this.selectedCard = null;

        // 重新渲染界面
        this.render();
        
        // 重新绑定事件
        this.bindEvents();
    },

};
