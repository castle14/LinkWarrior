# 为《连接勇士》增加 Roguelike 元素：单局制 + 失败重置

## Summary

把当前"失败只退回第 1 关、全部进度保留"的机制，改造为 **单局制（run）语义**：

- 挑战失败 → 本局结束
- **出战卡组（deck）重置**为初始的 30 张随机 N 卡
- **星点（stars）归零**
- 生命/护盾恢复满状态，当前关卡回到第 1 关
- **背包（inventory）中的卡牌保留**、已解锁职业保留、历史最高关卡（maxRound）保留

这样既具备 Roguelike 的"本局构筑清零、失败有代价"核心体验，又保留了玩家通过商店收集的卡牌收藏。

## Current State Analysis

### 存档结构（`LinkWarriorGameData`）
初始化见 [MainMenuUI.js:97-L135](file:///d:/my_code/LinkWarrior/src/ui/MainMenuUI.js#L97-L135)：

| 字段 | 含义 | 失败时处理 |
|---|---|---|
| `currentRound` | 当前关卡 | 重置为 1 |
| `maxRound` | 历史最高关卡 | 保留 |
| `stars` | 星点（商店/解锁职业通用货币） | **归零** |
| `playerClass` / `player` | 职业与角色属性（hp/shield/maxHp/maxShield） | 保留，hp/shield 回满 |
| `deck` | 出战卡组，固定 30 张 | **重置为初始 30 张** |
| `inventory` | 背包/卡牌收藏 | **保留** |
| `unlockedClasses` | 已解锁职业 | 保留 |

### 失败处理现状（三处重复）
- 怪物攻击结算 — [BattleUI.js:337-L355](file:///d:/my_code/LinkWarrior/src/ui/BattleUI.js#L337-L355)
- 出牌结算 — [BattleUI.js:684-L703](file:///d:/my_code/LinkWarrior/src/ui/BattleUI.js#L684-L703)
- 毒属性结算 — [BattleUI.js:2137-L2155](file:///d:/my_code/LinkWarrior/src/ui/BattleUI.js#L2137-L2155)

三处逻辑完全相同：`AudioManager.play('failure')` → `alert('挑战失败！')` → `currentRound = 1` + 重置 hp/shield → 保存 → 跳转 `index.html`。三处是复制粘贴，适合收敛为一个方法。

### 相关既有能力
- 卡组生成：[GameUtil.generateDeck(deckSize, rarities, maxSameCard)](file:///d:/my_code/LinkWarrior/src/utils/GameUtil.js#L87-L137)，开局正是用 `generateDeck(33, [1], 5)`（前 30 为 deck，后 3 为 inventory）
- 商店购买写入 `inventory`：[CardShopUI.js:453-L457](file:///d:/my_code/LinkWarrior/src/ui/CardShopUI.js#L453-L457) —— 因此"背包保留"= 玩家购买收藏不丢
- 卡组约束：必须 30 张、同名 ≤5 —— [DeckEditorUI.js:486-L513](file:///d:/my_code/LinkWarrior/src/ui/DeckEditorUI.js#L486-L513)
- 胜利推进：[BattleUI.js:1691-L1739](file:///d:/my_code/LinkWarrior/src/ui/BattleUI.js#L1691-L1739)（`currentRound + 1`、`stars += 怪物等级和`、更新 `maxRound`）

### 关键缺口
`game.html` 的脚本列表（[game.html:11-L19](file:///d:/my_code/LinkWarrior/game.html#L11-L19)）**没有加载 `GameUtil.js`**。若在 BattleUI 中调用 `GameUtil.generateDeck`，必须先在 game.html 引入该脚本。

## Proposed Changes

### 1. `src/ui/BattleUI.js` — 新增 `handleDefeat()` 并替换三处重复逻辑

在 `handleVictory`（约 1691 行）附近新增方法：

```js
// 处理失败逻辑：单局制 —— 重置卡组与星点，保留背包与解锁
handleDefeat: function () {
  AudioManager.play('failure', () => {
    alert('挑战失败！');

    let gameData = StorageUtil.get('LinkWarriorGameData', null);
    if (gameData) {
      // 回到第 1 关
      gameData.currentRound = 1;
      // 星点归零
      gameData.stars = 0;
      // 重新生成初始出战卡组（30 张 N 卡，同名≤5），背包 inventory 不动
      gameData.deck = GameUtil.generateDeck(30, [1], 5);
      // 恢复生命/护盾
      if (gameData.player) {
        gameData.player.hp = gameData.player.maxHp;
        gameData.player.shield = gameData.player.maxShield;
      }
      localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));
    }

    window.location.href = 'index.html';
  });
},
```

然后把三处内联逻辑替换为调用：

```js
if (self.currentPlayer && self.currentPlayer.hp <= 0) {
  self.handleDefeat();
  return;
}
```

说明：
- 三处所处上下文均有 `self` 指向 BattleUI 实例（`var self = this;`），直接 `self.handleDefeat()` 即可，无需改 `this` 绑定
- 保留原有的 `AudioManager.play('failure', ...)` 包装，音频行为不变

### 2. `game.html` — 引入 `GameUtil.js`

在 [game.html:16](file:///d:/my_code/LinkWarrior/game.html#L16) 的 `CardUtils.js` 之后加入：

```html
<script src="./src/utils/GameUtil.js?v=20261122"></script>
```

同时把 `BattleUI.js` 的引用加上版本号 `?v=20261123` 以破缓存。

### 3. 不在本次范围（后续可选）

用户本次只确认了"单局制 + 失败重置规则"，以下正向 Roguelike 元素暂不实现，待后续按需开启：

- 战斗胜利后卡牌三选一奖励
- 遗物 / 词条系统
- 随机事件与路线选择节点

## Assumptions & Decisions

| 决策点 | 结论 |
|---|---|
| "重新生成初始组" | 复用 `GameUtil.generateDeck(30, [1], 5)`，与开局相同的 N 卡随机逻辑 |
| "背包里的卡还保留" | `inventory` 完全不动（商店购买的收藏不丢） |
| "星点值归零" | `stars = 0`；因为 stars 同时是解锁职业的货币，意味着解锁职业需在单局内攒够 100 |
| 失败后是否自动开新局 | 否，仍跳回主菜单，由玩家点「开始游戏」进入第 1 关（保持现有交互） |
| 历史最高关卡 | `maxRound` 保留，玩家信息页"最大攻克关卡数"不倒退 |
| 商店货架 `LinkWarriorShopCards` | 保留，不清空 |
| 旧存档无 `inventory` 字段 | 不做处理（`DeckEditorUI`/`CardShopUI` 会在需要时初始化为空数组） |

## Verification

1. **语法检查**：`node --check src/ui/BattleUI.js`
2. **浏览器验证**（服务 `http://localhost:8000`）：
   - 打开 `game.html`，在页面上下文中执行 `BattleUI.handleDefeat()`
   - 确认弹出「挑战失败！」并跳回 `index.html`
3. **校验 localStorage**（读取 `LinkWarriorGameData`）：
   - `currentRound === 1`
   - `stars === 0`
   - `deck.length === 30`，且所有卡 `rarity === 1`
   - `inventory` 数量与内容与调用前一致
   - `player.hp === player.maxHp`、`player.shield === player.maxShield`
4. **页面回归**：
   - 玩家信息页正常显示（当前关卡 1、星点 0、最大攻克关卡不倒退）
   - 卡组编辑页显示 30 张且可正常保存
   - 从主菜单点「开始游戏」能正常进入第 1 关战斗
