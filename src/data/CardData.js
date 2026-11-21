// 数据管理模块 - 卡牌数据
var CardData = {
    // 内部缓存（首次访问时构建，避免每次查询都重建整个数组）
    _cardsCache: null,
    _cardIndex: null,

    // 获取所有卡牌
    getAllCards: function() {
        if (CardData._cardsCache) {
            return CardData._cardsCache;
        }
        // 示例卡牌数据
        var cards = [
            {
                id: 1,
                name: "钢铁巨剑",
                type: "weapon",
                description: "基础物理攻击",
                value: 14,
                attribute: null, //attribute指的是该卡片会给目标带来的异常状态
                attributeLevel: 0,//attributeLevel指的是该卡片会给目标带来的异常状态的层数
                targetType: "single",
                rarity: 1,
                image: "./img/card/steel_giant_sword.jpg"
            },
            {
                id: 2,
                name: "恶魔之斧",
                type: "weapon",
                description: "附带火焰属性的物理攻击",
                value: 19,
                attribute: "fire",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/demon_axe.jpg"
            },
            {
                id: 3,
                name: "火球",
                type: "spell",
                description: "基础魔法攻击，附带火焰属性",
                value: 12,
                attribute: "fire",
                attributeLevel: 1,
                targetType: "single",
                rarity: 1,
                image: "./img/card/fire_ball.jpg"
            },
            {
                id: 4,
                name: "特殊飓风",
                type: "spell",
                description: "全体魔法攻击，附带冰霜属性",
                value: 8,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "all",
                rarity: 2,
                image: "./img/card/special_hurricane.jpg"
            },
            {
                id: 5,
                name: "钢甲壳",
                type: "shield",
                description: "增加护盾值",
                value: 20,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 1,
                image: "./img/card/steel_shell.jpg"
            },
            {
                id: 6,
                name: "混沌护盾",
                type: "shield",
                description: "增加护盾值",
                value: 30,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/chaos_shield.jpg"
            },
            {
                id: 7,
                name: "红宝石之光",
                type: "potion",
                description: "恢复生命值",
                value: 22,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 1,
                image: "./img/card/ruby_light.jpg"
            },
            {
                id: 8,
                name: "白净之水",
                type: "potion",
                description: "清除所有异常状态",
                value: 45,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 3,
                image: "./img/card/pure_water.jpg"
            },
            {
                id: 9,
                name: "凤凰刃",
                type: "weapon",
                description: "强力的火焰武器攻击",
                value: 26,
                attribute: "fire",
                attributeLevel: 2,
                targetType: "single",
                rarity: 4,
                image: "./img/card/phoenix_blade.jpg"
            },
            {
                id: 10,
                name: "圣光治疗",
                type: "potion",
                description: "恢复大量生命值并清除负面状态",
                value: 45,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/holy_healing.jpg"
            },
            {
                id: 11,
                name: "闪电风暴",
                type: "spell",
                description: "强大的全体电系魔法攻击",
                value: 12,
                attribute: "electric",
                attributeLevel: 1,
                targetType: "all",
                rarity: 2,
                image: "./img/card/lightning_storm.jpg"
            },
            {
                id: 12,
                name: "毁灭之焰",
                type: "spell",
                description: "毁灭性的全体火焰攻击",
                value: 18,
                attribute: "fire",
                attributeLevel: 2,
                targetType: "all",
                rarity: 4,
                image: "./img/card/destruction_flame.jpg"
            },
            {
                id: 13,
                name: "传说之剑",
                type: "weapon",
                description: "传说中的圣剑，拥有强大的力量",
                value: 29,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 4,
                image: "./img/card/legendary_sword.jpg"
            },
            {
                id: 14,
                name: "终极护甲",
                type: "shield",
                description: "提供强大防护的终极护甲",
                value: 40,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/ultimate_armor.jpg"
            },
            {
                id: 15,
                name: "无限雷击",
                type: "spell",
                description: "连续的强力雷电攻击",
                value: 28,
                attribute: "electric",
                attributeLevel: 3,
                targetType: "single",
                rarity: 5,
                image: "./img/card/infinite_thunder.jpg"
            },
            {
                id: 16,
                name: "铁斧",
                type: "weapon",
                description: "基础的铁制斧头",
                value: 11,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 1,
                image: "./img/card/iron_axe.jpg"
            },
            {
                id: 17,
                name: "灵魂之斧",
                type: "weapon",
                description: "附带灵魂力量的斧头",
                value: 20,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/soul_axe.jpg"
            },
            {
                id: 18,
                name: "灼热之枪",
                type: "weapon",
                description: "发射灼热火焰的长枪",
                value: 26,
                attribute: "fire",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/burning_spear.jpg"
            },
            {
                id: 19,
                name: "破神剑",
                type: "weapon",
                description: "能够破坏神力的剑",
                value: 30,
                attribute: "poison",
                attributeLevel: 2,
                targetType: "single",
                rarity: 5,
                image: "./img/card/god_breaker_sword.jpg"
            },
            {
                id: 20,
                name: "宝石治疗",
                type: "potion",
                description: "使用宝石力量进行治疗",
                value: 35,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 3,
                image: "./img/card/gem_healing.jpg"
            },
            // 新增的卡牌数据
            {
                id: 21,
                name: "DD炸弹",
                type: "spell",
                description: "爆炸性魔法攻击",
                value: 15,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/dd_bomb.jpg"
            },
            {
                id: 22,
                name: "二重旋风",
                type: "spell",
                description: "双重旋风魔法攻击",
                value: 12,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "all",
                rarity: 2,
                image: "./img/card/dual_cyclone.jpg"
            },
            {
                id: 23,
                name: "体力增强",
                type: "potion",
                description: "增强体力并恢复生命值",
                value: 35,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/stamina_boost.jpg"
            },
            {
                id: 24,
                name: "卡通锁链",
                type: "weapon",
                description: "束缚敌人的魔法锁链",
                value: 8,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 1,
                image: "./img/card/toon_chain.jpg"
            },
            {
                id: 25,
                name: "圣剑",
                type: "weapon",
                description: "神圣的剑，对黑暗生物有额外伤害",
                value: 28,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/holy_sword.jpg"
            },
            {
                id: 26,
                name: "地碎",
                type: "spell",
                description: "震撼大地的强力魔法攻击",
                value: 22,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/earth_crush.jpg"
            },
            {
                id: 27,
                name: "大火葬",
                type: "spell",
                description: "焚烧一切的烈焰攻击",
                value: 25,
                attribute: "fire",
                attributeLevel: 3,
                targetType: "all",
                rarity: 5,
                image: "./img/card/mass_cremation.jpg"
            },
            {
                id: 28,
                name: "天狗羽扇",
                type: "weapon",
                description: "天狗使用的神秘羽扇",
                value: 24,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/tengu_fan.jpg"
            },
            {
                id: 29,
                name: "女神的圣弓",
                type: "weapon",
                description: "女神赐予的神圣弓箭",
                value: 27,
                attribute: "poison",
                attributeLevel: 2,
                targetType: "single",
                rarity: 4,
                image: "./img/card/goddess_bow.jpg"
            },
            {
                id: 30,
                name: "宝石爆破",
                type: "spell",
                description: "引爆宝石产生爆炸攻击",
                value: 20,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 3,
                image: "./img/card/gem_blast.jpg"
            },
            {
                id: 31,
                name: "打火石",
                type: "weapon",
                description: "产生火花的初级火焰法术",
                value: 7,
                attribute: "fire",
                attributeLevel: 1,
                targetType: "all",
                rarity: 1,
                image: "./img/card/flint.jpg"
            },
            {
                id: 32,
                name: "扰乱三角波",
                type: "spell",
                description: "干扰敌人精神的声波攻击",
                value: 12,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 2,
                image: "./img/card/jam_wave.jpg"
            },
            {
                id: 33,
                name: "旋风剑",
                type: "weapon",
                description: "旋转斩击的剑技",
                value: 16,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/cyclone_sword.jpg"
            },
            {
                id: 34,
                name: "旋风回力镖",
                type: "weapon",
                description: "可返回的旋风回力镖",
                value: 14,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/cyclone_boomerang.jpg"
            },
            {
                id: 35,
                name: "暗之假面",
                type: "shield",
                description: "增加护盾值并提供暗影保护",
                value: 30,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/dark_mask.jpg"
            },
            {
                id: 36,
                name: "死灵咒",
                type: "spell",
                description: "操控死灵的禁忌法术",
                value: 23,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/necro_curse.jpg"
            },
            {
                id: 37,
                name: "活命水",
                type: "potion",
                description: "恢复生命值并解除中毒状态",
                value: 30,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/life_water.jpg"
            },
            {
                id: 38,
                name: "深海锁链",
                type: "spell",
                description: "来自深海的束缚锁链",
                value: 10,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 2,
                image: "./img/card/deep_sea_chain.jpg"
            },
            {
                id: 39,
                name: "火炎弹",
                type: "spell",
                description: "高速发射的火炎弹",
                value: 18,
                attribute: "fire",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/fire_bullet.jpg"
            },
            {
                id: 40,
                name: "炽焰飞腾",
                type: "spell",
                description: "升腾而起的炽热火焰",
                value: 16,
                attribute: "fire",
                attributeLevel: 2,
                targetType: "all",
                rarity: 3,
                image: "./img/card/soaring_flame.jpg"
            },
            {
                id: 41,
                name: "燃烧大地",
                type: "spell",
                description: "点燃大地的范围火焰攻击",
                value: 18,
                attribute: "fire",
                attributeLevel: 2,
                targetType: "all",
                rarity: 4,
                image: "./img/card/burning_land.jpg"
            },
            {
                id: 42,
                name: "电击鞭",
                type: "weapon",
                description: "带有电击效果的鞭子",
                value: 15,
                attribute: "electric",
                attributeLevel: 1,
                targetType: "all",
                rarity: 3,
                image: "./img/card/shock_whip.jpg"
            },
            {
                id: 43,
                name: "电子黑恶爪",
                type: "weapon",
                description: "充满黑暗电子能量的利爪",
                value: 21,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/cyber_dark_claw.jpg"
            },
            {
                id: 44,
                name: "竹光",
                type: "weapon",
                description: "轻盈而锋利的竹制刀",
                value: 12,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 1,
                image: "./img/card/bamboo_sword.jpg"
            },
            {
                id: 45,
                name: "蓝色宝石之光",
                type: "potion",
                description: "高品质的治疗药剂",
                value: 40,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/sapphire_light.jpg"
            },
            {
                id: 46,
                name: "终焉倒计",
                type: "spell",
                description: "倒数终结时刻的强大法术",
                value: 30,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 5,
                image: "./img/card/armageddon_countdown.jpg"
            },
            {
                id: 47,
                name: "草薙剑",
                type: "weapon",
                description: "传说中的三神器之一",
                value: 32,
                attribute: "fire",
                attributeLevel: 2,
                targetType: "single",
                rarity: 5,
                image: "./img/card/kusanagi_sword.jpg"
            },
            {
                id: 48,
                name: "红色药剂",
                type: "potion",
                description: "快速恢复生命值的红色药剂",
                value: 20,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 1,
                image: "./img/card/red_potion.jpg"
            },
            {
                id: 49,
                name: "转生爆炎",
                type: "spell",
                description: "焚尽一切的转生之火",
                value: 28,
                attribute: "fire",
                attributeLevel: 3,
                targetType: "all",
                rarity: 5,
                image: "./img/card/reincarnation_burst.jpg"
            },
            {
                id: 50,
                name: "辐射炮",
                type: "weapon",
                description: "发射高能辐射的科技武器",
                value: 27,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 4,
                image: "./img/card/radiation_cannon.jpg"
            },
            {
                id: 51,
                name: "连锁破坏",
                type: "spell",
                description: "连锁反应的破坏法术",
                value: 15,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 3,
                image: "./img/card/chain_destruction.jpg"
            },
            {
                id: 52,
                name: "银之弓矢",
                type: "weapon",
                description: "闪耀银光的弓箭",
                value: 16,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/silver_bow.jpg"
            },
            {
                id: 53,
                name: "闪电之剑",
                type: "weapon",
                description: "蕴含雷电之力的剑",
                value: 28,
                attribute: "electric",
                attributeLevel: 2,
                targetType: "single",
                rarity: 4,
                image: "./img/card/lightning_sword.jpg"
            },
            {
                id: 54,
                name: "闪电漩涡",
                type: "spell",
                description: "旋转的雷电攻击",
                value: 14,
                attribute: "electric",
                attributeLevel: 1,
                targetType: "all",
                rarity: 3,
                image: "./img/card/lightning_vortex.jpg"
            },
            {
                id: 55,
                name: "雷击",
                type: "spell",
                description: "精准的雷电打击",
                value: 18,
                attribute: "electric",
                attributeLevel: 1,
                targetType: "single",
                rarity: 2,
                image: "./img/card/thunder_bolt.jpg"
            },
            {
                id: 56,
                name: "魔剑",
                type: "weapon",
                description: "灌注魔力的邪恶之剑",
                value: 22,
                attribute: "poison",
                attributeLevel: 1,
                targetType: "single",
                rarity: 3,
                image: "./img/card/magic_sword.jpg"
            },
            {
                id: 57,
                name: "魔法泡泡",
                type: "spell",
                description: "魔法形成的防护泡泡",
                value: 5,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 1,
                image: "./img/card/magic_bubble.jpg"
            },
            {
                id: 58,
                name: "魔界之雷",
                type: "spell",
                description: "来自魔界的恐怖雷击",
                value: 29,
                attribute: "electric",
                attributeLevel: 3,
                targetType: "single",
                rarity: 5,
                image: "./img/card/demon_thunder.jpg"
            },
            {
                id: 59,
                name: "魔闪光",
                type: "spell",
                description: "炫目而强大的魔法闪光",
                value: 20,
                attribute: null,
                attributeLevel: 0,
                targetType: "all",
                rarity: 3,
                image: "./img/card/magic_flash.jpg"
            },
            {
                id: 60,
                name: "麻药",
                type: "potion",
                description: "恢复生命值并麻痹敌人",
                value: 30,
                attribute: null,
                attributeLevel: 0,
                targetType: "single",
                rarity: 2,
                image: "./img/card/drug.jpg"
            },
            {
                id: 61,
                name: "神鹰三角波",
                type: "spell",
                description: "神鹰发出的强力声波",
                value: 20,
                attribute: "ice",
                attributeLevel: 2,
                targetType: "all",
                rarity: 4,
                image: "./img/card/harpie_wave.jpg"
            },
            {
                id: 62,
                name: "神鹰护甲",
                type: "shield",
                description: "神鹰羽毛制成的轻盈护甲",
                value: 42,
                attribute: "ice",
                attributeLevel: 1,
                targetType: "single",
                rarity: 4,
                image: "./img/card/harpie_armor.jpg"
            }
        ];

        CardData._cardsCache = cards;
        return cards;
    },

    // 构建 id -> 卡牌 的索引（懒加载，查询 O(1)）
    _getCardIndex: function() {
        if (!CardData._cardIndex) {
            var index = {};
            var all = this.getAllCards();
            for (var i = 0; i < all.length; i++) {
                index[all[i].id] = all[i];
            }
            CardData._cardIndex = index;
        }
        return CardData._cardIndex;
    },

    // 根据ID获取卡牌
    getCardById: function(id) {
        var index = this._getCardIndex();
        var target = index[Number(id)];
        return target === undefined ? null : target;
    },

    // 根据稀有度获取卡牌
    getCardsByRarity: function(rarity) {
        var cards = this.getAllCards();
        var result = [];
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].rarity === rarity) {
                result.push(cards[i]);
            }
        }
        return result;
    }
};
