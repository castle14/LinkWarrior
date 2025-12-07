// 工具类 - 随机数工具
var RandomUtil = {
    // 获取范围内的随机整数 [min, max]
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 从数组中随机选择一个元素
    getRandomElement: function(array) {
        if (!array || array.length === 0) return null;
        var index = this.getRandomInt(0, array.length - 1);
        return array[index];
    },
    
    // 从数组中随机选择多个元素（不重复）
    getRandomElements: function(array, count) {
        if (!array || array.length === 0) return [];
        if (count >= array.length) return array.slice(); // 返回数组副本
        
        var result = [];
        var tempArray = array.slice(); // 复制数组
        
        for (var i = 0; i < count; i++) {
            var index = this.getRandomInt(0, tempArray.length - 1);
            result.push(tempArray[index]);
            tempArray.splice(index, 1);
        }
        
        return result;
    },
    
    // 根据概率判断是否成功（probability为0-1之间的数）
    chance: function(probability) {
        return Math.random() < probability;
    }
};