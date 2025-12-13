// 游戏通用工具类
var GameUtil = {
    // 刷新商店需要的星点值
    SHOP_REFRESH_COST: 20,

    // 解锁职业需要的星点值
    CLASS_UNLOCK_COST: 100,

    // 根据稀有度获取星点值
    getStarValueForRarity: function(rarity) {
        switch(rarity) {
            case 1: // N
                return 1;
            case 2: // R
                return 2;
            case 3: // SR
                return 3;
            case 4: // SSR
                return 4;
            case 5: // UR
                return 5;
            default:
                return 0;
        }
    },

    // 获取稀有度的文本描述
    getRarityText: function(rarity) {
        switch(rarity) {
            case 1:
                return 'N';
            case 2:
                return 'R';
            case 3:
                return 'SR';
            case 4:
                return 'SSR';
            case 5:
                return 'UR';
            default:
                return rarity;
        }
    },

    // 统计卡片列表中各稀有度的卡片数量
    getRarityCounts: function(cardList) {
        var counts = {
            1: 0, // N
            2: 0, // R
            3: 0, // SR
            4: 0, // SSR
            5: 0  // UR
        };

        if (cardList && Array.isArray(cardList)) {
            for (var i = 0; i < cardList.length; i++) {
                var rarity = cardList[i].rarity;
                if (rarity >= 1 && rarity <= 5) {
                    counts[rarity]++;
                }
            }
        }

        return counts;
    },

    // 根据稀有度计算卡片价格
    calculateCardCost: function(rarity) {
        // 根据稀有度计算价格
        switch(rarity) {
            case 1: // N
                return 5;
            case 2: // R
                return 10;
            case 3: // SR
                return 15;
            case 4: // SSR
                return 20;
            case 5: // UR
                return 25;
            default:
                return 10;
        }
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
