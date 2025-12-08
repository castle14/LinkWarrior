// 数据管理模块 - 怪物数据
var MonsterData = {
    // 获取所有怪物
    getAllMonsters: function() {
        var monsters = [
            {
                id: 1,
                name: "外星人之王",
                description: "强大的外星领袖，拥有毁灭性的力量",
                hp: 200,
                maxHp: 200,
                shield: 80,
                maxShield: 80,
                level: 6,
                skills: [
                    {type: "spell", value: 25, attribute: "poison", attributeLevel: 2},
                    {type: "weapon", value: 30, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 40, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 30, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 20, attribute: "electric", attributeLevel: 1},
                    {type: "spell", value: 15, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星人之王.jpg"
            },
            {
                id: 2,
                name: "外星人士兵",
                description: "训练有素的外星战士",
                hp: 60,
                maxHp: 60,
                shield: 20,
                maxShield: 20,
                level: 3,
                skills: [
                    {type: "weapon", value: 15, attribute: "fire", attributeLevel: 1},
                    {type: "weapon", value: 10, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 15, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 10, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 12, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 8, attribute: "ice", attributeLevel: 1}
                ],
                image: "./img/alien/外星人士兵.jpg"
            },
            {
                id: 3,
                name: "外星人小孩",
                description: "弱小但敏捷的怪物",
                hp: 30,
                maxHp: 30,
                shield: 10,
                maxShield: 10,
                level: 1,
                skills: [
                    {type: "weapon", value: 8, attribute: "fire", attributeLevel: 1},
                    {type: "weapon", value: 6, attribute: "ice", attributeLevel: 1},
                    {type: "potion", value: 10, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 5, attribute: "electric", attributeLevel: 1},
                    {type: "spell", value: 4, attribute: "electric", attributeLevel: 1},
                    {type: "spell", value: 3, attribute: "poison", attributeLevel: 1}
                ],
                image: "./img/alien/外星人小孩.jpg"
            },
            {
                id: 4,
                name: "外星人母后",
                description: "繁殖和指挥其他外星生物的母体",
                hp: 150,
                maxHp: 150,
                shield: 50,
                maxShield: 50,
                level: 5,
                skills: [
                    {type: "spell", value: 5, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 20, attribute: "poison", attributeLevel: 1},
                    {type: "potion", value: 25, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 18, attribute: "poison", attributeLevel: 2},
                    {type: "shield", value: 30, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 15, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星人母后.jpg"
            },
            {
                id: 5,
                name: "外星人猎手",
                description: "擅长追踪和猎杀的外星生物",
                hp: 70,
                maxHp: 70,
                shield: 15,
                maxShield: 15,
                level: 3,
                skills: [
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 25, attribute: "poison", attributeLevel: 1},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 15, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 18, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 12, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星人猎手.jpg"
            },
            {
                id: 6,
                name: "外星人长老",
                description: "拥有丰富知识和强大能力的长者",
                hp: 100,
                maxHp: 100,
                shield: 40,
                maxShield: 40,
                level: 4,
                skills: [
                    {type: "spell", value: 22, attribute: "electric", attributeLevel: 2},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 35, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 30, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 16, attribute: "ice", attributeLevel: 1},
                    {type: "spell", value: 18, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星人长老.jpg"
            },
            {
                id: 7,
                name: "外星人飞船",
                description: "高科技飞行载具，火力强大",
                hp: 120,
                maxHp: 120,
                shield: 100,
                maxShield: 100,
                level: 4,
                skills: [
                    {type: "weapon", value: 25, attribute: "fire", attributeLevel: 2},
                    {type: "shield", value: 50, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 20, attribute: "electric", attributeLevel: 1},
                    {type: "potion", value: 40, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 22, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 15, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星人飞船.jpg"
            },
            {
                id: 8,
                name: "外星侵略者",
                description: "入侵地球的先锋部队成员",
                hp: 80,
                maxHp: 80,
                shield: 30,
                maxShield: 30,
                level: 3,
                skills: [
                    {type: "spell", value: 15, attribute: "poison", attributeLevel: 1},
                    {type: "weapon", value: 18, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 20, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 12, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 20, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星侵略者.jpg"
            },
            {
                id: 9,
                name: "外星催眠师",
                description: "潜伏在阴影中的杀手",
                hp: 60,
                maxHp: 60,
                shield: 15,
                maxShield: 15,
                level: 4,
                skills: [
                    {type: "weapon", value: 10, attribute: "poison", attributeLevel: 2},
                    {type: "spell", value: 20, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 20, attribute: "poison", attributeLevel: 1},
                    {type: "potion", value: 30, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星催眠师.jpg"
            },
            {
                id: 10,
                name: "外星利维坦",
                description: "坚硬的飞船怪物",
                hp: 180,
                maxHp: 180,
                shield: 150,
                maxShield: 150,
                level: 5,
                skills: [
                    {type: "weapon", value: 12, attribute: "ice", attributeLevel: 1},
                    {type: "weapon", value: 18, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 35, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 25, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 20, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 15, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星利维坦.jpg"
            },
            {
                id: 11,
                name: "外星复仇者",
                description: "来自地心的强大生物",
                hp: 150,
                maxHp: 150,
                shield: 50,
                maxShield: 80,
                level: 5,
                skills: [
                    {type: "weapon", value: 25, attribute: "fire", attributeLevel: 2},
                    {type: "spell", value: 22, attribute: "fire", attributeLevel: 2},
                    {type: "shield", value: 40, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 30, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 28, attribute: "fire", attributeLevel: 3},
                    {type: "spell", value: 30, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星复仇者.jpg"
            },
            {
                id: 12,
                name: "外星犬",
                description: "经过基因改造的太空猎犬",
                hp: 50,
                maxHp: 50,
                shield: 10,
                maxShield: 10,
                level: 2,
                skills: [
                    {type: "weapon", value: 12, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 15, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 5, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 12, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 8, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星犬.jpg"
            },
            {
                id: 13,
                name: "外星狂战士",
                description: "失去理智的疯狂战士",
                hp: 110,
                maxHp: 110,
                shield: 20,
                maxShield: 20,
                level: 4,
                skills: [
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 22, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 18, attribute: "poison", attributeLevel: 1},
                    {type: "potion", value: 20, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 25, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 30, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星狂战士.jpg"
            },
            {
                id: 14,
                name: "外星菊石",
                description: "古老而神秘的太空生物",
                hp: 90,
                maxHp: 90,
                shield: 60,
                maxShield: 60,
                level: 3,
                skills: [
                    {type: "spell", value: 15, attribute: "electric", attributeLevel: 1},
                    {type: "shield", value: 30, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 25, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 18, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 20, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 20, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/外星菊石.jpg"
            },
            {
                id: 15,
                name: "念力外星人",
                description: "能够操控物体和能量的超能力者",
                hp: 75,
                maxHp: 75,
                shield: 35,
                maxShield: 35,
                level: 4,
                skills: [
                    {type: "spell", value: 20, attribute: "electric", attributeLevel: 2},
                    {type: "spell", value: 22, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 15, attribute: "electric", attributeLevel: 1},
                    {type: "shield", value: 25, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 22, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 18, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/念力外星人.jpg"
            },
            {
                id: 16,
                name: "灰色外星人",
                description: "身材矮小但智力极高的外星种族",
                hp: 40,
                maxHp: 40,
                shield: 25,
                maxShield: 25,
                level: 2,
                skills: [
                    {type: "spell", value: 10, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 12, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 14, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 15, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 8, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 10, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/灰色外星人.jpg"
            },
            {
                id: 17,
                name: "熔岩外星人",
                description: "会喷火的蝙蝠",
                hp: 30,
                maxHp: 30,
                shield: 35,
                maxShield: 35,
                level: 2,
                skills: [
                    {type: "spell", value: 16, attribute: "fire", attributeLevel: 1},
                    {type: "spell", value: 10, attribute: "fire", attributeLevel: 1},
                    {type: "shield", value: 15, attribute: null, attributeLevel: 0},
                    {type: "potion", value: 12, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 14, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 12, attribute: "fire", attributeLevel: 1}
                ],
                image: "./img/alien/熔岩外星人.jpg"
            },
            {
                id: 18,
                name: "骷髅外星人",
                description: "亡灵族的普通士兵",
                hp: 50,
                maxHp: 50,
                shield: 10,
                maxShield: 10,
                level: 2,
                skills: [
                    {type: "weapon", value: 13, attribute: null, attributeLevel: 0},
                    {type: "shield", value: 18, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 10, attribute: "poison", attributeLevel: 1},
                    {type: "potion", value: 15, attribute: null, attributeLevel: 0},
                    {type: "spell", value: 8, attribute: null, attributeLevel: 0},
                    {type: "weapon", value: 11, attribute: null, attributeLevel: 0}
                ],
                image: "./img/alien/骷髅外星人.jpg"
            }
        ];

        return monsters;
    },

    // 根据ID获取怪物
    getMonsterById: function(id) {
        var monsters = this.getAllMonsters();
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i].id == id) {
                return monsters[i];
            }
        }
        return null;
    },

    // 根据等级获取怪物
    getMonstersByLevel: function(level) {
        var monsters = this.getAllMonsters();
        var result = [];
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i].level == level) {
                result.push(monsters[i]);
            }
        }
        return result;
    },

    // 随机获取指定数量的怪物
    getRandomMonsters: function(count, maxLevel) {
        var monsters = this.getAllMonsters();
        var eligibleMonsters = [];

        // 筛选出符合条件的怪物
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i].level <= maxLevel) {
                eligibleMonsters.push(monsters[i]);
            }
        }

        // 随机选取指定数量的怪物
        var result = [];
        for (var j = 0; j < count && eligibleMonsters.length > 0; j++) {
            var randomIndex = Math.floor(Math.random() * eligibleMonsters.length);
            result.push(eligibleMonsters[randomIndex]);
            eligibleMonsters.splice(randomIndex, 1);
        }

        return result;
    },

    // 新增函数：随机获取指定数量和指定等级的怪物
    getRandomMonstersByLevel: function(count, level) {
        // 获取指定等级的所有怪物
        var monstersOfLevel = this.getMonstersByLevel(level);

        // 如果该等级没有怪物，则返回空数组
        if (monstersOfLevel.length === 0) {
            return [];
        }

        // 随机选择指定数量的怪物
        var result = [];
        for (var i = 0; i < count; i++) {
            // 如果该等级的怪物数量少于所需数量，则允许重复
            var randomIndex = Math.floor(Math.random() * monstersOfLevel.length);
            // 创建副本以避免引用问题
            var monsterCopy = Object.assign({}, monstersOfLevel[randomIndex]);
            // 为每个怪物实例分配唯一ID
            monsterCopy.uniqueId = monsterCopy.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + i;
            result.push(monsterCopy);
        }

        return result;
    },

    // 新增函数：随机获取指定数量和指定等级范围的怪物
    getRandomMonstersByLevelRange: function(count, minLevel, maxLevel) {
        var monsters = this.getAllMonsters();
        var eligibleMonsters = [];

        // 筛选出符合等级范围条件的怪物
        for (var i = 0; i < monsters.length; i++) {
            if (monsters[i].level >= minLevel && monsters[i].level <= maxLevel) {
                eligibleMonsters.push(monsters[i]);
            }
        }

        // 如果没有符合条件的怪物，则返回空数组
        if (eligibleMonsters.length === 0) {
            return [];
        }

        // 随机选择指定数量的怪物
        var result = [];
        for (var j = 0; j < count; j++) {
            // 允许重复选择
            var randomIndex = Math.floor(Math.random() * eligibleMonsters.length);
            // 创建副本以避免引用问题
            var monsterCopy = Object.assign({}, eligibleMonsters[randomIndex]);
            // 为每个怪物实例分配唯一ID
            monsterCopy.uniqueId = monsterCopy.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + j;
            result.push(monsterCopy);
        }

        return result;
    }
};
