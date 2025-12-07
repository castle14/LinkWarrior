// 工具类 - 数组工具
var ArrayUtil = {
    // 洗牌算法
    shuffle: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // 当还有剩余元素需要洗牌时
        while (0 !== currentIndex) {
            // 随机选择一个剩余元素
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // 并与当前元素交换
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    
    // 从数组中移除指定元素
    remove: function(array, element) {
        var index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    },
    
    // 检查数组是否包含指定元素
    contains: function(array, element) {
        return array.indexOf(element) > -1;
    },
    
    // 获取数组中元素的数量
    count: function(array, predicate) {
        if (!predicate) {
            return array.length;
        }
        
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                count++;
            }
        }
        return count;
    }
};