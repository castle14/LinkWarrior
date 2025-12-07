// 游戏通用工具类
var GameUtil = {
    // 根据稀有度获取星点值
    getStarValueForRarity: function(rarity) {
        switch(rarity) {
            case 1: // N
                return 1;
            case 2: // R
                return 3;
            case 3: // SR
                return 6;
            case 4: // SSR
                return 12;
            case 5: // UR
                return 25;
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
    }
};