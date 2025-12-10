// 数据管理模块 - 玩家职业数据
var ClassData = {
  // 获取所有职业
  getAllClasses: function () {
    var classes = [
      {
        id: 1,
        name: "warrior",
        displayName: "黄金队长",
        description: "高护盾和物理伤害，技能偏向防御和爆发",
        maxHp: 150,
        maxShield: 100,
        energyMax: 6,
        image: "./img/player/黄金队长.jpg",
        skill: {
          id: 1,
          name: "盾击",
          description: "对特定敌人造成伤害当前护甲值*4的伤害。",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "weapon",
              value: player.shield * 4,
              attribute: null,
              attributeLevel: 0,
              targetType: "single",
            }
            return ret;
          }
        }
      },
      {
        id: 2,
        name: "mage",
        displayName: "光灵使",
        description: "高魔法伤害和属性叠加，技能偏向AOE",
        maxHp: 100,
        maxShield: 50,
        energyMax: 8,
        image: "./img/player/光灵使.jpg",
        skill: {
          id: 2,
          name: "光球术",
          description: "释放强力光球攻击所有敌人，伤害值为（当前能量值+1）*20",
          cost: 1,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: (player.energy+1) * 20,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 3,
        name: "ranger",
        displayName: "棱镜侠",
        description: "平衡型，技能侧重连击和敏捷",
        maxHp: 100,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/棱镜侠.jpg",
        skill: {
          id: 3,
          name: "连射",
          description: "对特定敌人造成手牌中魔法卡数量*50点魔法伤害。",
          cost: 1,
          SPEffect: function (player, hands ,turn, monsters) {
            let spellCardsCount = hands.filter(card => card.type === "spell").length;
            let ret = {
              type: "spell",
              value: spellCardsCount * 50,
              attribute: null,
              attributeLevel: 0,
              targetType: "single",
            }
            return ret;
          }
        }
      },
      {
        id: 4,
        name: "ice_master",
        displayName: "冰凌侠",
        description: "操控冰雪的高手，擅长控制和持续伤害",
        maxHp: 100,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/冰凌侠.jpg",
        skill: {
          id: 4,
          name: "冰霜新星",
          description: "释放寒冰冲击，对敌人造成手牌中魔法卡数量*15点冰属性魔法伤害。",
          cost: 1,
          SPEffect: function (player, hands ,turn, monsters) {
            let spellCardsCount = hands.filter(card => card.type === "spell").length;
            let ret = {
              type: "spell",
              value: spellCardsCount * 15,
              attribute: "ice",
              attributeLevel: spellCardsCount,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 5,
        name: "earth_master",
        displayName: "地灵使",
        description: "掌控大地之力，拥有强大的生存能力",
        maxHp: 130,
        maxShield: 60,
        energyMax: 6,
        image: "./img/player/地灵使.jpg",
        skill: {
          id: 5,
          name: "石肤",
          description: "大幅提升护盾值，护甲最大值增加20，并恢复所有护甲",
          cost: 1,
          SPEffect: function (player, hands ,turn, monsters) {
            player.maxShield += 20;
            let ret = {
              type: "shield",
              value: player.maxShield - player.shield,
              attribute: null,
              attributeLevel: 0,
              targetType: "single",
            }
            return ret;
          }
        }
      },
      {
        id: 6,
        name: "sky_hero",
        displayName: "天空侠",
        description: "翱翔天际的英雄，攻击速度极快",
        maxHp: 95,
        maxShield: 45,
        energyMax: 7,
        image: "./img/player/天空侠.jpg",
        skill: {
          id: 6,
          name: "疾风斩",
          description: "高速移动攻击敌人，必定暴击",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "weapon",
              value: 25,
              attribute: null,
              attributeLevel: 0,
              targetType: "enemy",
            }
            return ret;
          }
        }
      },
      {
        id: 7,
        name: "new_bubble_warrior",
        displayName: "新水泡侠",
        description: "新一代水泡战士，攻守兼备",
        maxHp: 110,
        maxShield: 55,
        energyMax: 7,
        image: "./img/player/新水泡侠.jpg",
        skill: {
          id: 7,
          name: "泡沫护盾",
          description: "制造大量泡沫保护自己并反弹部分伤害",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "shield",
              value: player.maxShield * 0.5,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 8,
        name: "dark_master",
        displayName: "暗灵使",
        description: "掌控黑暗力量的使者，擅长削弱敌人",
        maxHp: 100,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/暗灵使.jpg",
        skill: {
          id: 8,
          name: "暗影诅咒",
          description: "诅咒敌人，使其攻击力下降并持续受到伤害",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 10,
              attribute: "poison",
              attributeLevel: 1,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 9,
        name: "forest_hero",
        displayName: "森林侠",
        description: "森林的守护者，具有强大的恢复能力",
        maxHp: 105,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/森林侠.jpg",
        skill: {
          id: 9,
          name: "自然治愈",
          description: "借助自然力量恢复大量生命值",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "potion",
              value: player.maxHp * 0.3,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 10,
        name: "bubble_warrior",
        displayName: "水泡侠",
        description: "使用水泡战斗的战士，技能多样",
        maxHp: 100,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/水泡侠.jpg",
        skill: {
          id: 10,
          name: "水泡弹幕",
          description: "发射大量水泡攻击敌人",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 20,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 11,
        name: "water_master",
        displayName: "水灵使",
        description: "水元素的大师，技能以持续伤害为主",
        maxHp: 90,
        maxShield: 45,
        energyMax: 8,
        image: "./img/player/水灵使.jpg",
        skill: {
          id: 11,
          name: "潮汐冲击",
          description: "引导潮汐之力冲击敌人，造成持续伤害",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 12,
              attribute: "poison",
              attributeLevel: 1,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 12,
        name: "ocean_hero",
        displayName: "海洋侠",
        description: "海洋的化身，拥有强大的群体攻击能力",
        maxHp: 105,
        maxShield: 55,
        energyMax: 7,
        image: "./img/player/海洋侠.jpg",
        skill: {
          id: 12,
          name: "海啸",
          description: "召唤小型海啸攻击所有敌人",
          cost: 4,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 30,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 13,
        name: "fire_master",
        displayName: "火灵使",
        description: "火焰的操纵者，擅长爆发性伤害",
        maxHp: 95,
        maxShield: 40,
        energyMax: 8,
        image: "./img/player/火灵使.jpg",
        skill: {
          id: 13,
          name: "烈焰风暴",
          description: "释放烈焰风暴焚烧所有敌人",
          cost: 4,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 35,
              attribute: "fire",
              attributeLevel: 2,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 14,
        name: "flame_lady",
        displayName: "炽炎女郎",
        description: "炽热的女性战士，技能带有燃烧效果",
        maxHp: 90,
        maxShield: 35,
        energyMax: 8,
        image: "./img/player/炽炎女郎.jpg",
        skill: {
          id: 14,
          name: "燃烧印记",
          description: "给敌人施加燃烧印记，使其持续受到火焰伤害",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 8,
              attribute: "fire",
              attributeLevel: 1,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 15,
        name: "hot_hero",
        displayName: "炽热侠",
        description: "浑身散发高温的英雄，攻击附带灼烧效果",
        maxHp: 100,
        maxShield: 45,
        energyMax: 7,
        image: "./img/player/炽热侠.jpg",
        skill: {
          id: 15,
          name: "高温炙烤",
          description: "释放高温火焰炙烤敌人",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 22,
              attribute: "fire",
              attributeLevel: 1,
              targetType: "enemy",
            }
            return ret;
          }
        }
      },
      {
        id: 16,
        name: "explosion_lady1",
        displayName: "爆热女郎1",
        description: "爆炸专家，技能具有强大的范围伤害",
        maxHp: 95,
        maxShield: 40,
        energyMax: 7,
        image: "./img/player/爆热女郎1.jpg",
        skill: {
          id: 16,
          name: "爆裂冲击",
          description: "释放爆炸冲击波，对范围内敌人造成巨大伤害",
          cost: 4,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 40,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 17,
        name: "explosion_lady2",
        displayName: "爆热女郎2",
        description: "爆炸专家的另一个形态，技能更加多样化",
        maxHp: 95,
        maxShield: 40,
        energyMax: 7,
        image: "./img/player/爆热女郎2.jpg",
        skill: {
          id: 17,
          name: "连锁爆炸",
          description: "引发连锁爆炸，对多个敌人造成递增伤害",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 15 + (turn * 2),
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 18,
        name: "hero_kid",
        displayName: "英雄小子",
        description: "年轻的英雄，潜力无限，各项能力均衡",
        maxHp: 100,
        maxShield: 50,
        energyMax: 7,
        image: "./img/player/英雄小子.jpg",
        skill: {
          id: 18,
          name: "潜能爆发",
          description: "激发自身潜能，最大生命值增加10，恢复最大生命值。",
          cost: 1,
          SPEffect: function (player, hands ,turn, monsters) {
            player.maxHp = player.maxHp + 10;
            let ret = {
              type: "potion",
              value: player.maxHp-player.hp,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 19,
        name: "wild_man",
        displayName: "荒野人",
        description: "来自荒野的战士，拥有强大的近战能力",
        maxHp: 200,
        maxShield: 65,
        energyMax: 6,
        image: "./img/player/荒野人.jpg",
        skill: {
          id: 19,
          name: "野蛮冲撞",
          description: "用强壮的身体冲撞敌人，对所有敌人造成当前玩家护甲值*2的物理伤害。",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {

            let ret = {
              type: "weapon",
              value: player.shield * 2,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 20,
        name: "lightning_hero1",
        displayName: "闪电侠1",
        description: "操控雷电的英雄，攻击速度快如闪电",
        maxHp: 90,
        maxShield: 40,
        energyMax: 8,
        image: "./img/player/闪电侠1.jpg",
        skill: {
          id: 20,
          name: "雷霆万钧",
          description: "召唤雷电攻击敌人，有几率造成麻痹效果",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 25,
              attribute: "electric",
              attributeLevel: 1,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 21,
        name: "wind_master",
        displayName: "风灵使",
        description: "风的驾驭者，行动敏捷，闪避能力强",
        maxHp: 90,
        maxShield: 40,
        energyMax: 8,
        image: "./img/player/风灵使.jpg",
        skill: {
          id: 21,
          name: "风之庇护",
          description: "召唤风墙保护自己，大幅提升闪避率",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "shield",
              value: 20,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 22,
        name: "flower_lady",
        displayName: "鲜花女郎",
        description: "花之使者，兼具美丽与实力，擅长辅助和治疗",
        maxHp: 85,
        maxShield: 35,
        energyMax: 8,
        image: "./img/player/鲜花女郎.jpg",
        skill: {
          id: 22,
          name: "花之祝福",
          description: "释放花之能量，为自己和队友提供治疗和增益效果",
          cost: 3,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "potion",
              value: 25,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      },
      {
        id: 23,
        name: "clay_hero",
        displayName: "黏土侠",
        description: "由黏土构成的特殊战士，防御力极高",
        maxHp: 140,
        maxShield: 70,
        energyMax: 5,
        image: "./img/player/黏土侠.jpg",
        skill: {
          id: 23,
          name: "泥沼陷阱",
          description: "制造泥沼困住敌人，降低其速度和攻击力",
          cost: 2,
          SPEffect: function (player, hands ,turn, monsters) {
            let ret = {
              type: "spell",
              value: 5,
              attribute: null,
              attributeLevel: 0,
              targetType: "all",
            }
            return ret;
          }
        }
      }
    ];

    return classes;
  },

  // 根据ID获取职业
  getClassById: function (id) {
    var classes = this.getAllClasses();
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].id == id) {
        return classes[i];
      }
    }
    return null;
  },

  // 根据名称获取职业
  getClassByName: function (name) {
    var classes = this.getAllClasses();
    for (var i = 0; i < classes.length; i++) {
      if (classes[i].name == name) {
        return classes[i];
      }
    }
    return null;
  }
};
