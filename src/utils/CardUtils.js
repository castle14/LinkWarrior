// 卡片工具类 - 包含卡片相关的通用工具函数
var CardUtils = {
    // 获取类型的中文名称
    getTypeName: function(type) {
        var typeMap = {
            "weapon": "武器",
            "spell": "法术",
            "shield": "护盾",
            "potion": "药水"
        };
        return typeMap[type] || type;
    },

    // 获取目标类型的中文名称
    getTargetTypeName: function(targetType) {
        var targetTypeMap = {
            "single": "单体",
            "all": "全体"
        };
        return targetTypeMap[targetType] || targetType;
    },

    // 获取异常状态的中文名称
    getAttributeName: function(attribute) {
      if(attribute) {
       var attributeMap = {
            "fire": "火",
            "ice": "冰",
            "electric": "雷",
            "light": "光",
            "poison": "毒",
        };
        return attributeMap[attribute] || attribute;
      }else{
        return "无";
      }

    }
};
