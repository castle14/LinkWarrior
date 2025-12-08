// UI组件 - 战斗界面
var BattleUI = {
  // 添加当前卡组属性
  currentDeck: [],
  // 添加当前手牌属性
  currentHand: [],
  // 添加当前怪物属性
  currentMonsters: [],
  // 添加当前玩家属性
  currentPlayer: null,
  // 添加当前回合数属性
  currentTurn: 1,

  // 初始化战斗界面
  init: function () {
    this.render();
    this.bindEvents();
  },

  // 渲染战斗界面
  render: function () {
    var html = `
            <div class="battle-screen">
                <!-- 回合信息 -->
                <div class="round-info">
                    <span>第<span id="round-number">1</span>关</span>
                    <span>第<span id="turn-number">1</span>回合</span>
                    <span id="event-info">无事件</span>
                </div>

                <!-- 怪物区域 -->
                <div class="monster-area">
                    <h3>敌人</h3>
                    <div id="monsters-container" class="monsters-container">
                        <!-- 怪物将在这里渲染 -->
                    </div>
                </div>



                <!-- 玩家信息区域整合 -->
                <div class="player-section">
                    <div class="player-info-header">
                        <span>玩家信息</span>
                        <span id="player-name">勇士</span>
                    </div>

                    <!-- 玩家状态容器 -->
                    <div class="player-status-container">
                        <!-- 玩家职业图片 -->
                        <div class="player-class-image-container">
                            <img id="player-class-image" class="player-class-image" src="" alt="职业图片">
                        </div>

                        <!-- 玩家进度条 -->
                        <div class="player-progress-bars">
                            <!-- 生命值进度条 -->
                            <div class="progress-container">
                                <div id="health-bar" class="progress-bar health-bar" style="width: 100%;"></div>
                                <div class="progress-text">
                                    生命值: <span id="player-hp">100</span>/<span id="player-max-hp">100</span>
                                </div>
                            </div>

                            <!-- 护盾值进度条 -->
                            <div class="progress-container">
                                <div id="shield-bar" class="progress-bar shield-bar" style="width: 0%;"></div>
                                <div class="progress-text">
                                    护盾值: <span id="player-shield">0</span>/<span id="player-max-shield">50</span>
                                </div>
                            </div>

                            <!-- 能量进度条 -->
                            <div class="progress-container">
                                <div id="energy-bar" class="progress-bar energy-bar" style="width: 50%;"></div>
                                <div class="progress-text">
                                    连接能量: <span id="energy-value">3</span>/<span id="energy-max">6</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 玩家状态 -->
                    <div class="player-status">
                        <!-- 玩家状态效果将在这里显示 -->
                    </div>
                </div>

                <!-- 卡片效果信息栏 -->
                <div class="card-effect-info-bar" id="card-effect-info-bar">
                        <!-- 卡片效果信息将在这里显示 -->
                </div>

                <!-- 手牌区域 -->
                <div class="hand-area">
                    <h3>手牌</h3>
                    <div id="hand-container" class="hand-container">
                        <!-- 手牌将在这里渲染 -->
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                    <div id="skills-container" class="skills-container">
                        <!-- 技能按钮将在这里渲染 -->
                    </div>
                    <button id="play-card-btn" class="play-card-button">出牌</button>
                    <button id="end-turn-btn" class="action-button">返回主页</button>
                </div>
            </div>
        `;

    $('body').html(html);
  },

  // 统一处理效果应用的方法
  applyEffect: function(effect, targets, sourceName, isSkill) {
    var self = this;
    var effectSource = isSkill ? '技能' : '卡牌';
    var effectName = isSkill ? sourceName : effect.name;

    // 获取玩家区域元素
    var playerSection = $('.player-section');

    // 处理不同类型的效果
    switch (effect.type) {
      case 'potion':
        // 治疗效果
        if (effect.value > 0) {
          // 触发玩家区域绿色闪烁效果
          playerSection.addClass('player-potion-effect');
          setTimeout(() => {
            playerSection.removeClass('player-potion-effect');
          }, 500);

          if (self.currentPlayer) {
            var currentHp = self.currentPlayer.hp;
            var maxHp = self.currentPlayer.maxHp;
            var newHp = Math.min(maxHp, currentHp + effect.value);
            self.currentPlayer.hp = newHp;

            // 更新UI显示
            $('#player-hp').text(self.currentPlayer.hp);
            var healthPercentage = (maxHp > 0) ? (newHp / maxHp) * 100 : 0;
            $('#health-bar').css('width', healthPercentage + '%');
          }

          self.showCenterMessage(`${effectName}${effectSource === '技能' ? '' : effectSource}恢复了 ${effect.value} 点生命值！`);
          AudioManager.play('heal');
        }
        break;

      case 'shield':
        // 护盾效果
        if (effect.value > 0) {
          // 触发玩家区域橙黄色闪烁效果
          playerSection.addClass('player-shield-effect');
          setTimeout(() => {
            playerSection.removeClass('player-shield-effect');
          }, 500);

          if (effect.targetType === 'single') {
            // 玩家自身护盾
            if (self.currentPlayer) {
              var currentShield = self.currentPlayer.shield;
              var maxShield = self.currentPlayer.maxShield;
              var newShield = Math.min(maxShield, currentShield + effect.value);
              self.currentPlayer.shield = newShield;

              // 更新UI显示
              $('#player-shield').text(self.currentPlayer.shield);
              var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
              $('#shield-bar').css('width', shieldPercentage + '%');
            }

            self.showCenterMessage(`${effectName}${effectSource === '技能' ? '' : effectSource}增加了 ${effect.value} 点护盾！`);
            AudioManager.play('shieldUp');
          } else if (effect.targetType === 'all') {
            // 全体护盾效果（如果存在）
            // 当前实现中主要针对玩家自身
            if (self.currentPlayer) {
              var currentShield = self.currentPlayer.shield;
              var maxShield = self.currentPlayer.maxShield;
              var newShield = Math.min(maxShield, currentShield + effect.value);
              self.currentPlayer.shield = newShield;

              // 更新UI显示
              $('#player-shield').text(self.currentPlayer.shield);
              var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
              $('#shield-bar').css('width', shieldPercentage + '%');
            }

            self.showCenterMessage(`${effectName}${effectSource === '技能' ? '' : effectSource}增加了 ${effect.value} 点护盾！`);
            AudioManager.play('shieldUp');
          }
        }
        break;

      case 'weapon':
      case 'spell':
        // 伤害效果
        if (effect.value > 0) {
          if (effect.targetType === 'single') {
            // 单体目标
            var target = targets[0]; // 单体目标
            if (target && target.type === 'monster') {
              var monsterIndex = target.index;
              if (monsterIndex >= 0) {
                if (effect.type === 'spell') {
                  // 魔法伤害直接扣除生命值
                  self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - effect.value);

                  // 如果有属性，则增加怪物的属性级别
                  if (effect.attribute && effect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[monsterIndex].attributes) {
                      self.currentMonsters[monsterIndex].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[monsterIndex].attributes[effect.attribute] || 0;
                    self.currentMonsters[monsterIndex].attributes[effect.attribute] = currentLevel + effect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                  }
                } else if (effect.type === 'weapon') {
                  // 物理伤害先扣除护盾
                  var originalShield = self.currentMonsters[monsterIndex].shield;
                  var originalHp = self.currentMonsters[monsterIndex].hp;

                  var remainingDamage = Math.max(0, effect.value - self.currentMonsters[monsterIndex].shield);
                  self.currentMonsters[monsterIndex].shield = Math.max(0, self.currentMonsters[monsterIndex].shield - effect.value);

                  if (remainingDamage > 0) {
                    self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - remainingDamage);
                  }

                  var hpReduced = originalHp > self.currentMonsters[monsterIndex].hp;
                  var shieldReduced = originalShield > self.currentMonsters[monsterIndex].shield;

                  // 如果有属性，则增加怪物的属性级别
                  if (effect.attribute && effect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[monsterIndex].attributes) {
                      self.currentMonsters[monsterIndex].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[monsterIndex].attributes[effect.attribute] || 0;
                    self.currentMonsters[monsterIndex].attributes[effect.attribute] = currentLevel + effect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                  }
                }

                // 更新UI显示
                var monsterData = self.currentMonsters[monsterIndex];
                var monsterElement = $('.monster[data-id="' + (monsterData.uniqueId || monsterData.id) + '"]');
                var monsterStatsElement = monsterElement.find('.monster-stats div:first');
                monsterStatsElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                // 更新护盾显示
                if (effect.type === 'weapon') {
                  var shieldElement = monsterElement.find('.monster-stats div:last');
                  shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                }

                // 添加受击效果
                if (effect.type === 'spell' || (effect.type === 'weapon' && hpReduced)) {
                  // 扣减了生命值，显示红色闪烁效果
                  monsterElement.addClass('monster-hit');
                  setTimeout(() => {
                    monsterElement.removeClass('monster-hit');
                  }, 500);
                  AudioManager.play('injuredMonster');
                } else if (effect.type === 'weapon' && shieldReduced) {
                  // 仅扣减了护盾值，显示灰色闪烁效果
                  monsterElement.addClass('monster-shield-hit');
                  setTimeout(() => {
                    monsterElement.removeClass('monster-shield-hit');
                  }, 500);
                  AudioManager.play('shieldDefend');
                }
              }

              var damageType = effect.type === "spell" ? "魔法" : "物理";
              self.showCenterMessage(`${effectName}${effectSource === '技能' ? '' : effectSource}对【${target.name}】造成了 ${effect.value} 点${damageType}伤害！`);
            }
          } else if (effect.targetType === 'all') {
            // 全体目标
            if (effect.type === 'spell') {
              // 更新所有怪物的数据 (法术伤害直接扣除生命值)
              for (var i = 0; i < self.currentMonsters.length; i++) {
                var monsterData = self.currentMonsters[i];
                monsterData.hp = Math.max(0, monsterData.hp - effect.value);

                // 如果有属性，则增加怪物的属性级别
                if (effect.attribute && effect.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[i].attributes) {
                    self.currentMonsters[i].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[i].attributes[effect.attribute] || 0;
                  self.currentMonsters[i].attributes[effect.attribute] = currentLevel + effect.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                }
              }

              // 更新所有怪物的UI显示
              $('.monster').each(function (index) {
                var monster = $(this);
                var monsterStats = monster.find('.monster-stats');
                var hpElement = monsterStats.find('div:first');

                if (index < self.currentMonsters.length) {
                  var monsterData = self.currentMonsters[index];
                  hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                  // 添加受击效果 (法术攻击总是直接减少生命值)
                  monster.addClass('monster-hit');
                  setTimeout(() => {
                    monster.removeClass('monster-hit');
                  }, 500);
                  AudioManager.play('injuredMonster');
                }
              });
            } else if (effect.type === 'weapon') {
              // 记录原始值以便判断扣减类型
              var originalValues = [];
              for (var i = 0; i < self.currentMonsters.length; i++) {
                originalValues.push({
                  shield: self.currentMonsters[i].shield,
                  hp: self.currentMonsters[i].hp
                });
              }

              // 执行伤害计算
              for (var i = 0; i < self.currentMonsters.length; i++) {
                var monsterData = self.currentMonsters[i];
                var remainingDamage = Math.max(0, effect.value - monsterData.shield);
                monsterData.shield = Math.max(0, monsterData.shield - effect.value);

                if (remainingDamage > 0) {
                  monsterData.hp = Math.max(0, monsterData.hp - remainingDamage);
                }

                // 如果有属性，则增加怪物的属性级别
                if (effect.attribute && effect.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[i].attributes) {
                    self.currentMonsters[i].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[i].attributes[effect.attribute] || 0;
                  self.currentMonsters[i].attributes[effect.attribute] = currentLevel + effect.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                }
              }

              // 更新所有怪物的UI显示
              $('.monster').each(function (index) {
                var monster = $(this);
                var monsterStats = monster.find('.monster-stats');
                var shieldElement = monsterStats.find('div:last');
                var hpElement = monsterStats.find('div:first');

                if (index < self.currentMonsters.length) {
                  var monsterData = self.currentMonsters[index];
                  shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                  hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                  // 判断是扣减了生命值还是护盾值
                  var hpReduced = originalValues[index].hp > monsterData.hp;
                  var shieldReduced = originalValues[index].shield > monsterData.shield;

                  // 根据扣减类型添加不同的受击效果
                  if (hpReduced) {
                    // 扣减了生命值，显示红色闪烁效果
                    monster.addClass('monster-hit');
                    setTimeout(() => {
                      monster.removeClass('monster-hit');
                    }, 500);
                    AudioManager.play('injuredMonster');
                  } else if (shieldReduced) {
                    // 仅扣减了护盾值，显示灰色闪烁效果
                    monster.addClass('monster-shield-hit');
                    setTimeout(() => {
                      monster.removeClass('monster-shield-hit');
                    }, 500);
                    AudioManager.play('shieldDefend');
                  }
                }
              });
            }

            var damageType = effect.type === "spell" ? "魔法" : "物理";
            self.showCenterMessage(`${effectName}${effectSource === '技能' ? '' : effectSource}对所有敌人造成了 ${effect.value} 点${damageType}伤害！`);
          }
        }
        break;
    }
  },

  // 绑定事件
  bindEvents: function () {
    var self = this;

    // 添加一个标志位来防止怪物行动被多次触发
    self.isMonsterTurnExecuting = false;

    // 存储当前执行的怪物行动序列ID
    self.currentMonsterSequenceId = 0;

    // 将怪物行动逻辑提取为独立函数，供自动调用
    self.executeMonsterTurn = function () {
      console.log('开始执行怪物行动');
      // 如果已经在执行怪物行动，则直接返回
      if (self.isMonsterTurnExecuting) {
        console.log('怪物行动已在执行中，跳过本次调用');
        return;
      }

      // 设置标志位
      self.isMonsterTurnExecuting = true;

      var sequenceId = self.currentMonsterSequenceId;

      console.log('开始执行怪物行动，序列ID:', sequenceId);

      // 播放结束回合音效
      AudioManager.play('swordSheath', () => {

        // 实现结束回合逻辑
        // hp值大于0的怪兽依次行动
        if (self.currentMonsters && self.currentMonsters.length > 0) {
          // 创建一个函数来顺序执行怪物行动
          function executeMonsterActions(index) {
            // 检查序列ID是否匹配，防止旧的行动序列干扰
            if (sequenceId !== self.currentMonsterSequenceId) {
              console.log('序列ID不匹配，终止旧的行动序列');
              return;
            }

            // 如果所有怪物都已行动完毕，继续后续逻辑
            if (index >= self.currentMonsters.length) {
              console.log('所有怪物行动完毕，序列ID:', sequenceId);
              // 回合数+1
              self.currentTurn = (self.currentTurn || 1) + 1;
              // 更新界面上的回合数显示
              $('#turn-number').text(self.currentTurn);

              // 重新启用出牌按钮
              $('#play-card-btn').prop('disabled', false);
              // 重新启用技能按钮
              $('.skill-button').prop('disabled', false);

              // 重新启用技能按钮
              $('.skill-button').prop('disabled', false);

              // 重置标志位
              self.isMonsterTurnExecuting = false;
              return;
            }

            var monster = self.currentMonsters[index];
            console.log(`处理怪物 ${index}: ${monster.name}，序列ID: ${sequenceId}`);

            // 只有存活的怪物才行动
            if (monster.hp > 0 && monster.skills && monster.skills.length > 0) {
              // 从六个技能中随机选择一个
              var randomSkillIndex = Math.floor(Math.random() * monster.skills.length);
              var skill = monster.skills[randomSkillIndex];

              // 获取怪物元素用于动画效果
              var monsterElement = $('.monster[data-id="' + (monster.uniqueId || monster.id) + '"]');

              // 根据技能类型触发不同效果
              switch (skill.type) {
                case 'weapon':
                case 'spell':
                  // 对玩家造成伤害
                  var damage = skill.value || 0;

                  // 触发动画效果
                  monsterElement.removeClass('monster-attack'); // 确保先移除，避免重复添加
                  monsterElement.addClass('monster-attack');

                  // 使用 animationend 事件确保动画完成后正确移除类
                  monsterElement.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                    $(this).removeClass('monster-attack');

                    // 检查序列ID是否匹配，防止旧的行动序列干扰
                    if (sequenceId !== self.currentMonsterSequenceId) {
                      console.log('序列ID不匹配，终止旧的行动序列回调');
                      return;
                    }

                    // 记录玩家当前的护盾和生命值
                    var originalPlayerShield = self.currentPlayer ? self.currentPlayer.shield : parseInt($('#player-shield').text());
                    var originalPlayerHp = self.currentPlayer ? self.currentPlayer.hp : parseInt($('#player-hp').text());

                    // 添加属性处理逻辑
                    // 如果技能有属性，则增加玩家的属性级别
                    if (skill.attribute && skill.attributeLevel > 0) {
                      // 初始化属性对象（如果不存在）
                      if (!self.currentPlayer.attributes) {
                        self.currentPlayer.attributes = {};
                      }

                      // 增加属性级别
                      var currentLevel = self.currentPlayer.attributes[skill.attribute] || 0;
                      self.currentPlayer.attributes[skill.attribute] = currentLevel + skill.attributeLevel;

                      // 更新玩家UI上的属性状态显示
                      self.updateEntityAttributesDisplay(self.currentPlayer, 'player');
                    }

                    // 计算实际伤害（先扣除护盾）
                    var actualDamage = damage;
                    var shieldDamage = 0;
                    if (self.currentPlayer) {
                      // 根据技能类型决定伤害计算方式
                      // 只有weapon类型（物理攻击）会先扣除护盾，spell类型（魔法攻击）直接扣除生命值
                      if (skill.type === 'weapon') {
                        // 物理攻击先扣除护盾
                        shieldDamage = Math.min(self.currentPlayer.shield, actualDamage);
                        self.currentPlayer.shield -= shieldDamage;
                        actualDamage -= shieldDamage;

                        // 扣除生命值
                        self.currentPlayer.hp = Math.max(0, self.currentPlayer.hp - actualDamage);
                      } else if (skill.type === 'spell') {
                        // 魔法攻击直接扣除生命值
                        self.currentPlayer.hp = Math.max(0, self.currentPlayer.hp - actualDamage);
                      }

                      // 更新UI
                      $('#player-shield').text(self.currentPlayer.shield);
                      $('#player-hp').text(self.currentPlayer.hp);

                      var shieldPercentage = (self.currentPlayer.maxShield > 0) ?
                        (self.currentPlayer.shield / self.currentPlayer.maxShield) * 100 : 0;
                      $('#shield-bar').css('width', shieldPercentage + '%');

                      var healthPercentage = (self.currentPlayer.maxHp > 0) ?
                        (self.currentPlayer.hp / self.currentPlayer.maxHp) * 100 : 0;
                      $('#health-bar').css('width', healthPercentage + '%');
                    } else {
                      console.log('需要从UI读取数据（向后兼容）');
                    }

                    // 玩家受击动画效果
                    var playerSection = $('.player-section');
                    // 判断是否扣减了生命值还是仅扣减了护盾值
                    var hpReduced = (self.currentPlayer ? self.currentPlayer.hp : parseInt($('#player-hp').text())) < originalPlayerHp;
                    var shieldReduced = (self.currentPlayer ? self.currentPlayer.shield : parseInt($('#player-shield').text())) < originalPlayerShield;

                    if (hpReduced) {
                      AudioManager.play('injuredFemale');
                      // 扣减了生命值，显示红色闪烁效果
                      playerSection.addClass('player-hit');
                      setTimeout(() => {
                        playerSection.removeClass('player-hit');
                      }, 500);
                    } else if (shieldReduced) {
                      AudioManager.play('shieldDefend');
                      // 仅扣减了护盾值，显示灰色闪烁效果
                      playerSection.addClass('player-shield-hit');
                      setTimeout(() => {
                        playerSection.removeClass('player-shield-hit');
                      }, 500);
                    }

                    self.showCenterMessage(`【${monster.name}】使用${skill.type === 'weapon' ? '武器' : '法术'}对你造成了${damage}点伤害！`);


                    // 检查玩家是否死亡
                    if (self.currentPlayer && self.currentPlayer.hp <= 0) {
                      // 玩家死亡，显示挑战失败
                      AudioManager.play('failure', () => {
                        alert('挑战失败！');

                        // 从localStorage中获取游戏数据
                        let gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));
                        if (gameData) {
                          // 将currentRound设为1
                          gameData.currentRound = 1;

                          // 保存回localStorage
                          localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));
                        }

                        // 返回首页
                        window.location.href = 'index.html';
                      });
                      return;
                    }

                    // 执行下一个怪物的行动
                    setTimeout(() => {
                      executeMonsterActions(index + 1);
                    }, 600);
                  });

                  break;

                case 'shield':
                  // 增加自身护盾
                  var shieldValue = skill.value || 0;

                  // 更新怪物数据
                  monster.shield = Math.min(monster.maxShield, monster.shield + shieldValue);

                  // 更新UI
                  if (monsterElement.length > 0) {
                    var shieldElement = monsterElement.find('.monster-stats div:last');
                    shieldElement.text(`护盾: ${monster.shield}/${monster.maxShield}`);

                    // 触发动画效果
                    monsterElement.removeClass('monster-shield-up'); // 确保先移除，避免重复添加
                    monsterElement.addClass('monster-shield-up');

                    // 使用 animationend 事件确保动画完成后正确移除类
                    monsterElement.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                      $(this).removeClass('monster-shield-up');

                      // 检查序列ID是否匹配，防止旧的行动序列干扰
                      if (sequenceId !== self.currentMonsterSequenceId) {
                        console.log('序列ID不匹配，终止旧的行动序列回调');
                        return;
                      }

                      self.showCenterMessage(`【${monster.name}】增加了${shieldValue}点护盾！`);
                      AudioManager.play('shieldUp');

                      // 执行下一个怪物的行动
                      setTimeout(() => {
                        executeMonsterActions(index + 1);
                      }, 600);
                    });
                  }
                  break;

                case 'potion':
                  // 增加自身生命值
                  var healValue = skill.value || 0;

                  // 更新怪物数据
                  monster.hp = Math.min(monster.maxHp, monster.hp + healValue);

                  // 更新UI
                  if (monsterElement.length > 0) {
                    var hpElement = monsterElement.find('.monster-stats div:first');
                    hpElement.text(`生命: ${monster.hp}/${monster.maxHp}`);

                    // 触发动画效果
                    monsterElement.removeClass('monster-heal'); // 确保先移除，避免重复添加
                    monsterElement.addClass('monster-heal');

                    // 使用 animationend 事件确保动画完成后正确移除类
                    monsterElement.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                      $(this).removeClass('monster-heal');

                      // 检查序列ID是否匹配，防止旧的行动序列干扰
                      if (sequenceId !== self.currentMonsterSequenceId) {
                        console.log('序列ID不匹配，终止旧的行动序列回调');
                        return;
                      }

                      self.showCenterMessage(`【${monster.name}】恢复了${healValue}点生命值！`);
                      AudioManager.play('heal');

                      // 执行下一个怪物的行动
                      setTimeout(() => {
                        executeMonsterActions(index + 1);
                      }, 600);
                    });
                  }
                  break;
              }
            } else {
              // 如果当前怪物不行动，直接执行下一个怪物的行动
              console.log(`怪物 ${index} 不行动，跳过`);
              executeMonsterActions(index + 1);
            }
          }

          // 开始执行怪物行动序列
          console.log('开始执行怪物行动序列，序列ID:', sequenceId);
          executeMonsterActions(0);
        } else {
          // 没有怪物时直接增加回合数
          self.currentTurn = (self.currentTurn || 1) + 1;
          $('#turn-number').text(self.currentTurn);

          // 重新启用出牌按钮
          $('#play-card-btn').prop('disabled', false);

          // 重置标志位
          self.isMonsterTurnExecuting = false;
        }
      });
    };

    $('#end-turn-btn').on('click', function () {
      // 弹出确认框，让用户确认是否返回主页
      if (confirm('确定要返回主页吗？当前游戏进度将不会保存。')) {
        // 用户点击确认，跳转回主页
        window.location.href = 'index.html';
      }
      // 用户点击取消，不执行任何操作
    });

    $('#play-card-btn').on('click', function () {
      // 获取选中的卡片
      var selectedCard = $('.card.card-selected');

      // 检查是否有选中的卡片
      if (selectedCard.length === 0) {
        // alert('请先选择一张卡片！');
        self.showCenterMessage('请先选择一张卡片！');
        return;
      }

      // 获取卡片数据
      var cardId = selectedCard.data('id');
      var cardUniqueId = selectedCard.data('unique-id');
      var cardName = selectedCard.find('.card-name').first().text();

      // 获取卡片类型、目标类型和数值
      var cardType = null;
      var targetType = null;
      var damage = 0;
      var shieldValue = 0;
      var healValue = 0;

      // 从卡片标签中提取信息
      selectedCard.find('.card-tag').each(function () {
        var tagText = $(this).text();
        if ($(this).hasClass('tag-type')) {
          // 获取类型英文名
          var typeMap = {
            "武器": "weapon",
            "法术": "spell",
            "护盾": "shield",
            "药水": "potion"
          };
          cardType = typeMap[tagText] || tagText;
        } else if ($(this).hasClass('tag-target')) {
          // 获取目标类型英文名
          var targetMap = {
            "单体": "single",
            "全体": "all"
          };
          targetType = targetMap[tagText] || tagText;
        } else if ($(this).hasClass('tag-damage')) {
          damage += parseInt(tagText) || 0;
        } else if ($(this).hasClass('tag-shield')) {
          shieldValue += parseInt(tagText) || 0;
        } else if ($(this).hasClass('tag-heal')) {
          healValue += parseInt(tagText) || 0;
        }
      });

      // 定义处理后续逻辑的函数
      var handlePostCardPlayLogic = function () {
        // 处理治疗效果
        if (cardType === "potion" && healValue > 0) {
          // 治疗效果，则随机清除玩家自身携带的一个异常状态，并对玩家自身的生命值进行增加，但不能超过生命值最大值
          // 触发玩家区域绿色闪烁效果
          var playerSection = $('.player-section');
          playerSection.addClass('player-potion-effect');
          setTimeout(() => {
            playerSection.removeClass('player-potion-effect');
          }, 500);

          if (self.currentPlayer) {
            var currentHp = self.currentPlayer.hp;
            var maxHp = self.currentPlayer.maxHp;
            var newHp = Math.min(maxHp, currentHp + healValue);
            self.currentPlayer.hp = newHp;

            // 更新UI显示 - 直接使用currentPlayer中的数据
            $('#player-hp').text(self.currentPlayer.hp);

            // 更新生命条
            var healthPercentage = (maxHp > 0) ? (newHp / maxHp) * 100 : 0;
            $('#health-bar').css('width', healthPercentage + '%');

            // 检查玩家是否因此恢复了生命值
            if (currentHp <= 0 && newHp > 0) {
              // 玩家从死亡状态恢复，什么都不做，继续游戏
            }
          } else {
            console.error("当前玩家对象不存在！没有currentPlayer对象，则从UI读取（向后兼容）");
          }

          self.showCenterMessage(`恢复了 ${healValue} 点生命值！`);
          // 播放治疗音效
          AudioManager.play('heal');
        }

        // 处理护盾效果（单体目标的护盾卡片）
        if (cardType === "shield" && shieldValue > 0 && targetType === "single") {
          // 增加护甲值效果，则对玩家自身的护甲值进行增加，但不能超过护甲值最大值
          // 触发玩家区域橙黄色闪烁效果
          var playerSection = $('.player-section');
          playerSection.addClass('player-shield-effect');
          setTimeout(() => {
            playerSection.removeClass('player-shield-effect');
          }, 500);

          if (self.currentPlayer) {
            var currentShield = self.currentPlayer.shield;
            var maxShield = self.currentPlayer.maxShield;
            var newShield = Math.min(maxShield, currentShield + shieldValue);
            self.currentPlayer.shield = newShield;

            // 更新UI显示 - 直接使用currentPlayer中的数据
            $('#player-shield').text(self.currentPlayer.shield);

            // 更新护盾条
            var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
            $('#shield-bar').css('width', shieldPercentage + '%');
          } else {
            console.error("没有currentPlayer对象，则从UI读取（向后兼容）");
          }

          self.showCenterMessage(`为自己增加了 ${shieldValue} 点护盾！`);
          // 播放防护音效
          AudioManager.play('shieldUp');
        }

        // 处理护盾效果（全体目标的护盾卡片）
        if (cardType === "shield" && shieldValue > 0 && targetType === "all") {
          console.log("处理全体目标护盾效果");
        }

        // 处理完出牌效果之后，被选中的手牌要从currentHand里删除，放到currentDeck里
        if (self.currentHand && self.currentDeck) {
          // 获取所有选中的卡片
          var selectedCards = $('.card.card-selected');
          var selectedCardUniqueIds = [];

          // 收集所有选中卡片的unique-id
          selectedCards.each(function () {
            var uniqueId = $(this).data('unique-id');
            if (uniqueId) {
              selectedCardUniqueIds.push(uniqueId);
            }
          });

          // 计算连击能量：打出的卡片数-1
          var comboEnergy = Math.max(0, selectedCardUniqueIds.length - 1);
          if (comboEnergy > 0) {
            // 增加连击能量的逻辑
            var currentEnergy = parseInt($('#energy-value').text());
            var maxEnergy = parseInt($('#energy-max').text());
            var newEnergy = Math.min(maxEnergy, currentEnergy + comboEnergy);

            // 更新能量显示
            $('#energy-value').text(newEnergy);
            var energyPercentage = (maxEnergy > 0) ? (newEnergy / maxEnergy) * 100 : 0;
            $('#energy-bar').css('width', energyPercentage + '%');
          }

          // 从currentHand中删除所有选中的卡片，并添加到currentDeck末尾
          // 使用逆序遍历，避免删除元素时索引变化的问题
          for (var i = self.currentHand.length - 1; i >= 0; i--) {
            var card = self.currentHand[i];
            if (selectedCardUniqueIds.indexOf(card.uniqueId) !== -1) {
              // 从currentHand中删除该卡片
              var removedCard = self.currentHand.splice(i, 1)[0];
              // 将卡片添加到currentDeck的末尾
              self.currentDeck.push(removedCard);
            }
          }

          // 从currentDeck中随机抽取牌来补充手牌至5张
          while (self.currentHand.length < 5 && self.currentDeck.length > 0) {
            // 随机选择一张卡牌
            var randomIndex = Math.floor(Math.random() * self.currentDeck.length);
            var drawnCard = self.currentDeck.splice(randomIndex, 1)[0];
            // 添加到手牌中
            self.currentHand.push(drawnCard);
          }
        }

        // 检查是否有怪物死亡（生命值小于等于0）
        self.checkAndHandleMonsterDeaths();

        // 出牌后回合数+1
        self.currentTurn = (self.currentTurn || 1) + 1;
        // 更新界面上的回合数显示
        $('#turn-number').text(self.currentTurn);
        // 清除选中状态
        selectedCard.removeClass('card-selected');
        $('.monster').removeClass('monster-selected');
        //更新手牌
        self.renderHand(self.currentHand, self.currentDeck);
        // 更新卡片效果信息栏
        self.updateCardEffectInfoBar();

        // 检查玩家是否死亡（如果玩家生命值小于等于0）
        if (self.currentPlayer && self.currentPlayer.hp <= 0) {
          // 玩家死亡，显示挑战失败
          AudioManager.play('defeat', () => {
            alert('挑战失败！');

            // 从localStorage中获取游戏数据
            let gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));
            if (gameData) {
              // 将currentRound设为1
              gameData.currentRound = 1;

              // 保存回localStorage
              localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));
            }

            // 返回首页
            window.location.href = 'index.html';
          });
          return;
        }

        // 禁用出牌按钮
        $('#play-card-btn').prop('disabled', true);
        // 禁用技能按钮
        $('.skill-button').prop('disabled', true);
        // 生成新的序列ID
        self.currentMonsterSequenceId = Date.now();
        // 800ms后自动进入怪物行动步骤
        setTimeout(function () {
          self.executeMonsterTurn();
          self.showCenterMessage('------回合结束------');
        }, 800);

      };

      // 根据工程要求处理卡片效果
      if (targetType === "single" && cardType !== "potion") {
        // 对于shield类型，强制targetType为single
        if (cardType === "shield") {
          targetType = "single";
        }

        if (cardType !== "shield") {
          // 获取选中的怪物
          var selectedMonster = $('.monster.monster-selected');

          if (selectedMonster.length === 0) {
            // alert('请选择一个目标怪物！');
            self.showCenterMessage('请选择一个目标怪物！');
            return;
          }
        }

        // 播放出牌音效
        AudioManager.play('attack', () => {
          if (cardType !== "shield") {
            var monsterId = selectedMonster.data('id');
            var monsterName = selectedMonster.find('.monster-name').text();

            // 查找对应的怪物数据
            var monsterIndex = -1;
            for (var i = 0; i < self.currentMonsters.length; i++) {
              if (self.currentMonsters[i].uniqueId == monsterId || self.currentMonsters[i].id == monsterId) {
                monsterIndex = i;
                break;
              }
            }

            // 处理单体目标效果
            if (cardType === "spell" && damage > 0) {
              // 魔法伤害效果，且目标时单体，则对选中的怪兽的生命值进行扣除
              if (monsterIndex >= 0) {
                self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - damage);

                // 如果卡片有属性，则增加怪物的属性级别
                var cardData = CardData.getCardById(cardId);
                if (cardData && cardData.attribute && cardData.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[monsterIndex].attributes) {
                    self.currentMonsters[monsterIndex].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[monsterIndex].attributes[cardData.attribute] || 0;
                  self.currentMonsters[monsterIndex].attributes[cardData.attribute] = currentLevel + cardData.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                }
              }

              // 更新UI显示 - 直接使用currentMonsters中的数据
              if (monsterIndex >= 0) {
                var monsterData = self.currentMonsters[monsterIndex];
                var monsterElement = selectedMonster.find('.monster-stats div:first');
                monsterElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                // 添加受击效果 (魔法攻击总是直接减少生命值)
                selectedMonster.addClass('monster-hit');
                setTimeout(() => {
                  selectedMonster.removeClass('monster-hit');
                }, 500);
              }

              self.showCenterMessage(`对【${monsterName}】造成了 ${damage} 点魔法伤害！`);
              // 播放怪物受伤音效
              AudioManager.play('injuredMonster');
            } else if (cardType === "weapon" && damage > 0) {
              // 物理伤害效果，且目标为单体，则先从选中的怪兽的护甲值进行扣除，如果溢出，溢出部分再从生命值进行扣除
              if (monsterIndex >= 0) {
                // 记录原始护盾值和生命值
                var originalShield = self.currentMonsters[monsterIndex].shield;
                var originalHp = self.currentMonsters[monsterIndex].hp;

                // 先扣除护盾
                var remainingDamage = Math.max(0, damage - self.currentMonsters[monsterIndex].shield);
                self.currentMonsters[monsterIndex].shield = Math.max(0, self.currentMonsters[monsterIndex].shield - damage);

                // 如果还有剩余伤害，则扣除生命值
                if (remainingDamage > 0) {
                  self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - remainingDamage);
                }

                // 判断是扣减了生命值还是护盾值
                var hpReduced = originalHp > self.currentMonsters[monsterIndex].hp;
                var shieldReduced = originalShield > self.currentMonsters[monsterIndex].shield;

                // 如果卡片有属性，则增加怪物的属性级别
                var cardData = CardData.getCardById(cardId);
                if (cardData && cardData.attribute && cardData.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[monsterIndex].attributes) {
                    self.currentMonsters[monsterIndex].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[monsterIndex].attributes[cardData.attribute] || 0;
                  self.currentMonsters[monsterIndex].attributes[cardData.attribute] = currentLevel + cardData.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                }
              }

              // 更新UI显示 - 直接使用currentMonsters中的数据
              if (monsterIndex >= 0) {
                var monsterData = self.currentMonsters[monsterIndex];
                var monsterStats = selectedMonster.find('.monster-stats');
                var shieldElement = monsterStats.find('div:last');
                var hpElement = monsterStats.find('div:first');

                shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                // 根据扣减类型添加不同的受击效果
                if (hpReduced) {
                  // 扣减了生命值，显示红色闪烁效果
                  selectedMonster.addClass('monster-hit');
                  setTimeout(() => {
                    selectedMonster.removeClass('monster-hit');
                  }, 500);
                  // 播放怪物受伤音效
                  AudioManager.play('injuredMonster');
                } else if (shieldReduced) {
                  // 仅扣减了护盾值，显示灰色闪烁效果
                  selectedMonster.addClass('monster-shield-hit');
                  setTimeout(() => {
                    selectedMonster.removeClass('monster-shield-hit');
                  }, 500);
                  AudioManager.play('shieldDefend');
                }
              }

              self.showCenterMessage(`玩家对【${monsterName}】造成了 ${damage} 点物理伤害！`);

            }
          }

          // 处理后续逻辑
          handlePostCardPlayLogic();
        });

      } else if (targetType === "all") {
        // 播放出牌音效
        AudioManager.play('attack', () => {
          // 处理全体目标效果
          if ((cardType === "spell" || cardType === "weapon") && damage > 0) {
            if (cardType === "spell") {
              // 更新所有怪物的数据 (法术伤害直接扣除生命值)
              for (var i = 0; i < self.currentMonsters.length; i++) {
                var monsterData = self.currentMonsters[i];
                // 法术伤害直接扣除生命值
                monsterData.hp = Math.max(0, monsterData.hp - damage);

                // 如果卡片有属性，则增加怪物的属性级别
                var cardData = CardData.getCardById(cardId);
                if (cardData && cardData.attribute && cardData.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[i].attributes) {
                    self.currentMonsters[i].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[i].attributes[cardData.attribute] || 0;
                  self.currentMonsters[i].attributes[cardData.attribute] = currentLevel + cardData.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                }
              }

              // 更新所有怪物的UI显示 - 直接使用currentMonsters中的数据
              $('.monster').each(function (index) {
                var monster = $(this);
                var monsterStats = monster.find('.monster-stats');
                var shieldElement = monsterStats.find('div:last');
                var hpElement = monsterStats.find('div:first');

                if (index < self.currentMonsters.length) {
                  var monsterData = self.currentMonsters[index];
                  shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                  hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                  // 添加受击效果 (法术攻击总是直接减少生命值)
                  monster.addClass('monster-hit');
                  setTimeout(() => {
                    monster.removeClass('monster-hit');
                  }, 500);
                  AudioManager.play('injuredMonster');
                }
              });
            } else if (cardType === "weapon") {
              // 更新所有怪物的数据 (物理伤害先扣除护盾)
              // 记录原始值以便判断扣减类型
              var originalValues = [];
              for (var i = 0; i < self.currentMonsters.length; i++) {
                originalValues.push({
                  shield: self.currentMonsters[i].shield,
                  hp: self.currentMonsters[i].hp
                });
              }

              // 执行伤害计算
              for (var i = 0; i < self.currentMonsters.length; i++) {
                var monsterData = self.currentMonsters[i];
                // 物理伤害先扣除护盾
                var remainingDamage = Math.max(0, damage - monsterData.shield);
                monsterData.shield = Math.max(0, monsterData.shield - damage);

                // 如果还有剩余伤害，则扣除生命值
                if (remainingDamage > 0) {
                  monsterData.hp = Math.max(0, monsterData.hp - remainingDamage);
                }

                // 如果卡片有属性，则增加怪物的属性级别
                var cardData = CardData.getCardById(cardId);
                if (cardData && cardData.attribute && cardData.attributeLevel > 0) {
                  // 初始化属性对象（如果不存在）
                  if (!self.currentMonsters[i].attributes) {
                    self.currentMonsters[i].attributes = {};
                  }

                  // 增加属性级别
                  var currentLevel = self.currentMonsters[i].attributes[cardData.attribute] || 0;
                  self.currentMonsters[i].attributes[cardData.attribute] = currentLevel + cardData.attributeLevel;

                  // 更新怪物UI上的属性状态显示
                  self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                }
              }

              // 更新所有怪物的UI显示 - 直接使用currentMonsters中的数据
              $('.monster').each(function (index) {
                var monster = $(this);
                var monsterStats = monster.find('.monster-stats');
                var shieldElement = monsterStats.find('div:last');
                var hpElement = monsterStats.find('div:first');

                if (index < self.currentMonsters.length) {
                  var monsterData = self.currentMonsters[index];
                  shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                  hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                  // 判断是扣减了生命值还是护盾值
                  var hpReduced = originalValues[index].hp > monsterData.hp;
                  var shieldReduced = originalValues[index].shield > monsterData.shield;

                  // 根据扣减类型添加不同的受击效果
                  if (hpReduced) {
                    // 扣减了生命值，显示红色闪烁效果
                    monster.addClass('monster-hit');
                    setTimeout(() => {
                      monster.removeClass('monster-hit');
                    }, 500);
                    // 播放怪物受伤音效
                    AudioManager.play('injuredMonster');
                  } else if (shieldReduced) {
                    // 仅扣减了护盾值，显示灰色闪烁效果
                    monster.addClass('monster-shield-hit');
                    setTimeout(() => {
                      monster.removeClass('monster-shield-hit');
                    }, 500);
                    AudioManager.play('shieldDefend');
                  }
                }
              });
            }

            self.showCenterMessage(`玩家对所有敌人造成了 ${damage} 点${cardType === "spell" ? "魔法" : "物理"}伤害！`);

          } else if (cardType === "shield" && shieldValue > 0) {
            // 增加护甲值效果（全体护盾卡片）
            // 这里应该对玩家增加护盾，但全体护盾卡片较少见，按玩家自身处理
            // 触发玩家区域橙黄色闪烁效果
            var playerSection = $('.player-section');
            playerSection.addClass('player-shield-effect');
            setTimeout(() => {
              playerSection.removeClass('player-shield-effect');
            }, 500);

            if (self.currentPlayer) {
              var currentShield = self.currentPlayer.shield;
              var maxShield = self.currentPlayer.maxShield;
              var newShield = Math.min(maxShield, currentShield + shieldValue);
              self.currentPlayer.shield = newShield;

              // 更新UI显示 - 直接使用currentPlayer中的数据
              $('#player-shield').text(self.currentPlayer.shield);

              // 更新护盾条
              var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
              $('#shield-bar').css('width', shieldPercentage + '%');
            } else {
              console.error("没有currentPlayer对象，则从UI读取（向后兼容）");
              // // 如果没有currentPlayer对象，则从UI读取（向后兼容）
              // var shieldText = $('#player-shield').text();
              // var maxShieldText = $('#player-max-shield').text();
              // var currentShield = parseInt(shieldText);
              // var maxShield = parseInt(maxShieldText);
              // var newShield = Math.min(maxShield, currentShield + shieldValue);
              // $('#player-shield').text(newShield);
              //
              // // 更新护盾条
              // var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
              // $('#shield-bar').css('width', shieldPercentage + '%');
            }
            AudioManager.play('shieldUp');
            self.showCenterMessage(`玩家为自己增加了 ${shieldValue} 点护盾！`);
          }

          // 处理后续逻辑
          handlePostCardPlayLogic();
        });

      } else {
        // 对于不需要播放攻击音效的卡牌类型，直接处理后续逻辑
        console.log("不需要播放攻击音效的卡牌类型");
        handlePostCardPlayLogic();
      }
    });

    // 绑定手牌点击事件（委派）
    $('#hand-container').on('click', '.card', function () {
      // 获取点击卡片的名称
      var clickedCardName = $(this).find('.card-name').first().text();

      // 检查是否已有选中的卡片
      var alreadySelectedCards = $('.card.card-selected');

      if (alreadySelectedCards.length > 0) {
        // 获取已选中卡片的名称
        var selectedCardName = alreadySelectedCards.first().find('.card-name').first().text();

        // 如果点击的是同名卡片，则切换选中状态
        if (clickedCardName === selectedCardName) {
          $(this).toggleClass('card-selected');
        }
        // 如果点击的是不同名的卡片，则清空之前的选中状态，选中当前卡片
        else {
          $('.card').removeClass('card-selected');
          $(this).addClass('card-selected');
        }
      } else {
        // 如果没有已选中的卡片，直接选中当前卡片
        $(this).addClass('card-selected');
      }

      // 更新卡片效果信息栏
      self.updateCardEffectInfoBar();
    });

    // 绑定怪物点击事件（委派）
    $('#monsters-container').on('click', '.monster', function () {
      // 检查是否已有选中的怪物
      var alreadySelectedMonsters = $('.monster.monster-selected');

      if (alreadySelectedMonsters.length > 0) {
        // 如果点击的是已选中的怪物，则取消选中
        if ($(this).hasClass('monster-selected')) {
          $(this).removeClass('monster-selected');
        }
        // 如果点击的是不同的怪物，则取消之前选中的怪物，选中当前怪物
        else {
          $('.monster').removeClass('monster-selected');
          $(this).addClass('monster-selected');
        }
      } else {
        // 如果没有已选中的怪物，直接选中当前怪物
        $(this).addClass('monster-selected');
      }
    });

    // 绑定技能按钮点击事件（委派）
    $('#skills-container').on('click', '.skill-button', function () {
      var skillButton = $(this);
      var skillId = skillButton.data('id');
      var skillCost = skillButton.data('cost');

      // 获取当前能量值
      var currentEnergy = parseInt($('#energy-value').text());
      var maxEnergy = parseInt($('#energy-max').text());

      // 检查是否有足够的能量
      if (currentEnergy < skillCost) {
        self.showCenterMessage('能量不足，无法发动技能！');
        return;
      }

      // 禁用所有技能按钮
      $('.skill-button').prop('disabled', true);

      // 根据玩家职业和技能ID处理技能效果
      var playerClass = self.currentPlayer ? self.currentPlayer.class : null;
      if (!playerClass) {
        self.showCenterMessage('无法确定玩家职业！');
        // 恢复技能按钮状态
        $('.skill-button').prop('disabled', false);
        return;
      }
      playerClass = ClassData.getClassById(playerClass.id);
      // 检查职业是否有SPEffect函数
      if (playerClass.skill && typeof playerClass.skill.SPEffect === 'function') {
        // 调用SPEffect函数获取技能效果，将其视为卡片效果
        let skillEffect = playerClass.skill.SPEffect(self.currentPlayer,self.currentHand,self.currentRound,self.currentMonsters);

        // 扣除能量消耗
        var newEnergy = currentEnergy - skillCost;
        $('#energy-value').text(newEnergy);
        var energyPercentage = (maxEnergy > 0) ? (newEnergy / maxEnergy) * 100 : 0;
        $('#energy-bar').css('width', energyPercentage + '%');

        // 根据技能效果的targetType处理目标选择
        if (skillEffect.targetType === "single") {
          // 获取选中的怪物
          var selectedMonster = $('.monster.monster-selected');
          if (selectedMonster.length === 0) {
            self.showCenterMessage('请选择一个目标怪物！');
            // 恢复能量
            $('#energy-value').text(currentEnergy);
            $('#energy-bar').css('width', (currentEnergy / maxEnergy) * 100 + '%');
            // 恢复技能按钮状态
            $('.skill-button').prop('disabled', false);
            return;
          }
        }

        // 模拟播放技能音效
        AudioManager.play('activateSkill', () => {
          // 处理技能效果，类似于处理卡片效果
          if (skillEffect.targetType === "single") {
            // 处理单体目标技能
            var selectedMonster = $('.monster.monster-selected');
            var monsterId = selectedMonster.data('id');
            var monsterName = selectedMonster.find('.monster-name').text();

            // 查找对应的怪物数据
            var monsterIndex = -1;
            for (var i = 0; i < self.currentMonsters.length; i++) {
              if (self.currentMonsters[i].uniqueId == monsterId || self.currentMonsters[i].id == monsterId) {
                monsterIndex = i;
                break;
              }
            }

            // 根据技能效果类型处理
            if (skillEffect.type === "potion" && skillEffect.value > 0) {
              // 治疗效果
              // 触发玩家区域绿色闪烁效果
              var playerSection = $('.player-section');
              playerSection.addClass('player-potion-effect');
              setTimeout(() => {
                playerSection.removeClass('player-potion-effect');
              }, 500);

              if (self.currentPlayer) {
                var currentHp = self.currentPlayer.hp;
                var maxHp = self.currentPlayer.maxHp;
                var newHp = Math.min(maxHp, currentHp + skillEffect.value);
                self.currentPlayer.hp = newHp;

                // 更新UI显示
                $('#player-hp').text(self.currentPlayer.hp);
                var healthPercentage = (maxHp > 0) ? (newHp / maxHp) * 100 : 0;
                $('#health-bar').css('width', healthPercentage + '%');
              }

              self.showCenterMessage(`${playerClass.skill.name}恢复了 ${skillEffect.value} 点生命值！`);
              AudioManager.play('heal');
            } else if ((skillEffect.type === "spell" || skillEffect.type === "weapon") && skillEffect.value > 0) {
              // 伤害效果
              if (monsterIndex >= 0) {
                if (skillEffect.type === "spell") {
                  // 魔法伤害直接扣除生命值
                  self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - skillEffect.value);

                  // 如果技能有属性，则增加怪物的属性级别
                  if (skillEffect.attribute && skillEffect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[monsterIndex].attributes) {
                      self.currentMonsters[monsterIndex].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[monsterIndex].attributes[skillEffect.attribute] || 0;
                    self.currentMonsters[monsterIndex].attributes[skillEffect.attribute] = currentLevel + skillEffect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                  }
                } else if (skillEffect.type === "weapon") {
                  // 物理伤害先扣除护盾
                  var originalShield = self.currentMonsters[monsterIndex].shield;
                  var originalHp = self.currentMonsters[monsterIndex].hp;

                  var remainingDamage = Math.max(0, skillEffect.value - self.currentMonsters[monsterIndex].shield);
                  self.currentMonsters[monsterIndex].shield = Math.max(0, self.currentMonsters[monsterIndex].shield - skillEffect.value);

                  if (remainingDamage > 0) {
                    self.currentMonsters[monsterIndex].hp = Math.max(0, self.currentMonsters[monsterIndex].hp - remainingDamage);
                  }

                  var hpReduced = originalHp > self.currentMonsters[monsterIndex].hp;
                  var shieldReduced = originalShield > self.currentMonsters[monsterIndex].shield;

                  // 如果技能有属性，则增加怪物的属性级别
                  if (skillEffect.attribute && skillEffect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[monsterIndex].attributes) {
                      self.currentMonsters[monsterIndex].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[monsterIndex].attributes[skillEffect.attribute] || 0;
                    self.currentMonsters[monsterIndex].attributes[skillEffect.attribute] = currentLevel + skillEffect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[monsterIndex], 'monster');
                  }
                }

                // 更新UI显示
                if (monsterIndex >= 0) {
                  var monsterData = self.currentMonsters[monsterIndex];
                  var monsterElement = selectedMonster.find('.monster-stats div:first');
                  monsterElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                  // 添加受击效果
                  if (skillEffect.type === "spell" || (skillEffect.type === "weapon" && hpReduced)) {
                    // 扣减了生命值，显示红色闪烁效果
                    selectedMonster.addClass('monster-hit');
                    setTimeout(() => {
                      selectedMonster.removeClass('monster-hit');
                    }, 500);
                    AudioManager.play('injuredMonster');
                  } else if (skillEffect.type === "weapon" && shieldReduced) {
                    // 仅扣减了护盾值，显示灰色闪烁效果
                    selectedMonster.addClass('monster-shield-hit');
                    setTimeout(() => {
                      selectedMonster.removeClass('monster-shield-hit');
                    }, 500);
                    AudioManager.play('shieldDefend');
                  }
                }
              }

              var damageType = skillEffect.type === "spell" ? "魔法" : "物理";
              self.showCenterMessage(`${playerClass.skill.name}对【${monsterName}】造成了 ${skillEffect.value} 点${damageType}伤害！`);
            }
          } else if (skillEffect.targetType === "all") {
            // 处理全体目标技能
            if ((skillEffect.type === "spell" || skillEffect.type === "weapon") && skillEffect.value > 0) {
              if (skillEffect.type === "spell") {
                // 更新所有怪物的数据 (法术伤害直接扣除生命值)
                for (var i = 0; i < self.currentMonsters.length; i++) {
                  var monsterData = self.currentMonsters[i];
                  monsterData.hp = Math.max(0, monsterData.hp - skillEffect.value);

                  // 如果技能有属性，则增加怪物的属性级别
                  if (skillEffect.attribute && skillEffect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[i].attributes) {
                      self.currentMonsters[i].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[i].attributes[skillEffect.attribute] || 0;
                    self.currentMonsters[i].attributes[skillEffect.attribute] = currentLevel + skillEffect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                  }
                }

                // 更新所有怪物的UI显示
                $('.monster').each(function (index) {
                  var monster = $(this);
                  var monsterStats = monster.find('.monster-stats');
                  var hpElement = monsterStats.find('div:first');

                  if (index < self.currentMonsters.length) {
                    var monsterData = self.currentMonsters[index];
                    hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                    // 添加受击效果 (法术攻击总是直接减少生命值)
                    monster.addClass('monster-hit');
                    setTimeout(() => {
                      monster.removeClass('monster-hit');
                    }, 500);
                  }
                });
                AudioManager.play('injuredMonster');
              } else if (skillEffect.type === "weapon") {
                // 记录原始值以便判断扣减类型
                var originalValues = [];
                for (var i = 0; i < self.currentMonsters.length; i++) {
                  originalValues.push({
                    shield: self.currentMonsters[i].shield,
                    hp: self.currentMonsters[i].hp
                  });
                }

                // 执行伤害计算
                for (var i = 0; i < self.currentMonsters.length; i++) {
                  var monsterData = self.currentMonsters[i];
                  var remainingDamage = Math.max(0, skillEffect.value - monsterData.shield);
                  monsterData.shield = Math.max(0, monsterData.shield - skillEffect.value);

                  if (remainingDamage > 0) {
                    monsterData.hp = Math.max(0, monsterData.hp - remainingDamage);
                  }

                  // 如果技能有属性，则增加怪物的属性级别
                  if (skillEffect.attribute && skillEffect.attributeLevel > 0) {
                    // 初始化属性对象（如果不存在）
                    if (!self.currentMonsters[i].attributes) {
                      self.currentMonsters[i].attributes = {};
                    }

                    // 增加属性级别
                    var currentLevel = self.currentMonsters[i].attributes[skillEffect.attribute] || 0;
                    self.currentMonsters[i].attributes[skillEffect.attribute] = currentLevel + skillEffect.attributeLevel;

                    // 更新怪物UI上的属性状态显示
                    self.updateEntityAttributesDisplay(self.currentMonsters[i], 'monster');
                  }
                }

                // 更新所有怪物的UI显示
                $('.monster').each(function (index) {
                  var monster = $(this);
                  var monsterStats = monster.find('.monster-stats');
                  var shieldElement = monsterStats.find('div:last');
                  var hpElement = monsterStats.find('div:first');

                  if (index < self.currentMonsters.length) {
                    var monsterData = self.currentMonsters[index];
                    shieldElement.text(`护盾: ${monsterData.shield}/${monsterData.maxShield}`);
                    hpElement.text(`生命: ${monsterData.hp}/${monsterData.maxHp}`);

                    // 判断是扣减了生命值还是护盾值
                    var hpReduced = originalValues[index].hp > monsterData.hp;
                    var shieldReduced = originalValues[index].shield > monsterData.shield;

                    // 根据扣减类型添加不同的受击效果
                    if (hpReduced) {
                      monster.addClass('monster-hit');
                      setTimeout(() => {
                        monster.removeClass('monster-hit');
                      }, 500);
                      AudioManager.play('injuredMonster');
                    } else if (shieldReduced) {
                      monster.addClass('monster-shield-hit');
                      setTimeout(() => {
                        monster.removeClass('monster-shield-hit');
                      }, 500);
                      AudioManager.play('shieldDefend');
                    }
                  }
                });
              }

              var damageType = skillEffect.type === "spell" ? "魔法" : "物理";
              self.showCenterMessage(`${playerClass.skill.name}对所有敌人造成了 ${skillEffect.value} 点${damageType}伤害！`);
            } else if (skillEffect.type === "potion" && skillEffect.value > 0) {
              // 全体治疗效果
              // 触发玩家区域绿色闪烁效果
              var playerSection = $('.player-section');
              playerSection.addClass('player-potion-effect');
              setTimeout(() => {
                playerSection.removeClass('player-potion-effect');
              }, 500);

              if (self.currentPlayer) {
                var currentHp = self.currentPlayer.hp;
                var maxHp = self.currentPlayer.maxHp;
                var newHp = Math.min(maxHp, currentHp + skillEffect.value);
                self.currentPlayer.hp = newHp;

                // 更新UI显示
                $('#player-hp').text(self.currentPlayer.hp);
                var healthPercentage = (maxHp > 0) ? (newHp / maxHp) * 100 : 0;
                $('#health-bar').css('width', healthPercentage + '%');
              }

              self.showCenterMessage(`${playerClass.skill.name}恢复了 ${skillEffect.value} 点生命值！`);
              AudioManager.play('heal');
            } else if (skillEffect.type === "shield" && skillEffect.value > 0) {
              // 全体护盾效果
              // 触发玩家区域橙黄色闪烁效果
              var playerSection = $('.player-section');
              playerSection.addClass('player-shield-effect');
              setTimeout(() => {
                playerSection.removeClass('player-shield-effect');
              }, 500);

              if (self.currentPlayer) {
                var currentShield = self.currentPlayer.shield;
                var maxShield = self.currentPlayer.maxShield;
                var newShield = Math.min(maxShield, currentShield + skillEffect.value);
                self.currentPlayer.shield = newShield;

                // 更新UI显示
                $('#player-shield').text(self.currentPlayer.shield);
                var shieldPercentage = (maxShield > 0) ? (newShield / maxShield) * 100 : 0;
                $('#shield-bar').css('width', shieldPercentage + '%');
              }

              self.showCenterMessage(`${playerClass.skill.name}增加了 ${skillEffect.value} 点护盾！`);
              AudioManager.play('shieldUp');
            }
          }

          // 禁用出牌按钮
          $('#play-card-btn').prop('disabled', true);
          // 禁用技能按钮
          $('.skill-button').prop('disabled', true);

          // 生成新的序列ID
          self.currentMonsterSequenceId = Date.now();

          // 技能使用后延迟进入怪物行动步骤
          setTimeout(function () {
            self.executeMonsterTurn();
            self.showCenterMessage('------回合结束------');
          }, 800);
        });
      } else {
        self.showCenterMessage(`${playerClass.displayName}的技能尚未实现`);
        // 恢复技能按钮状态
        $('.skill-button').prop('disabled', false);
      }
    });
  },

  // 检查是否胜利
  checkVictory: function () {
    // 检查是否所有怪物都已死亡，如果是则本轮胜利
    var allMonstersDead = true;
    for (var i = 0; i < this.currentMonsters.length; i++) {
      if (this.currentMonsters[i].hp > 0) {
        allMonstersDead = false;
        break;
      }
    }

    return allMonstersDead;
  },

  // 处理胜利逻辑
  handleVictory: function () {
    let totalLevel = 0;
    // 计算本轮击败的怪兽的level之和
    for (let i = 0; i < this.currentMonsters.length; i++) {
      totalLevel += this.currentMonsters[i].level || 0;
    }

    // 从localStorage中获取游戏数据
    let gameData = JSON.parse(localStorage.getItem('LinkWarriorGameData'));
    if (gameData) {
      // 记录当前进展的最大轮回合数
      if (!gameData.maxRound || gameData.currentRound > gameData.maxRound) {
        gameData.maxRound = gameData.currentRound;
      }
      // 将currentRound加1
      gameData.currentRound = (gameData.currentRound || 0) + 1;

      // 增加stars值
      if (!gameData.stars) {
        gameData.stars = 0;
      }
      gameData.stars += totalLevel;



      // 保存回localStorage
      localStorage.setItem('LinkWarriorGameData', JSON.stringify(gameData));
    }

    AudioManager.play('victory', () => {
      alert('本轮胜利！获得' + totalLevel + '星点！');
      //让玩家选择是跳转至菜单页，还是刷新页面继续挑战
      let choice = confirm('是否挑战下一关？点击【取消】回到菜单页。');
      if (choice) {
        window.location.reload();
      } else {
        window.location.href = 'index.html';
      }
    });
  },

  // 检查并处理怪物死亡
  checkAndHandleMonsterDeaths: function () {
    let deadMonsters = [];

    // 收集所有已死亡的怪物
    for (var i = this.currentMonsters.length - 1; i >= 0; i--) {
      var monster = this.currentMonsters[i];
      if (monster.hp <= 0) {
        deadMonsters.push({
          index: i,
          monster: monster
        });
      }
    }

    // 如果没有死亡的怪物，直接返回
    if (deadMonsters.length === 0) {
      // 检查是否胜利（可能之前已经死亡但UI未更新）
      if (this.checkVictory()) {
        this.handleVictory();
      }
      return;
    }

    // 处理死亡怪物的隐藏动画
    let hiddenCount = 0;
    let self = this;

    deadMonsters.forEach(function (deadMonster) {
      $('.monster[data-id="' + (deadMonster.monster.uniqueId || deadMonster.monster.id) + '"]')
        .fadeOut(500, function () {
          $(this).hide();
          hiddenCount++;

          // 当所有死亡怪物都隐藏完毕后，检查是否胜利
          if (hiddenCount === deadMonsters.length) {
            if (self.checkVictory()) {
              self.handleVictory();
            }
          }
        });
    });
  },

  // 更新卡片效果信息栏
  updateCardEffectInfoBar: function () {
    var selectedCard = $('.card.card-selected');
    var infoBar = $('#card-effect-info-bar');

    // 如果没有选中的卡片，清空信息栏
    if (selectedCard.length === 0) {
      infoBar.empty();
      return;
    }

    // 获取选中卡片的数据
    var cardId = selectedCard.data('id');
    var cardUniqueId = selectedCard.data('unique-id');
    var cardName = selectedCard.find('.card-name').first().text();

    // 在这里应该从游戏数据中获取完整的卡片信息
    // 由于当前上下文中无法直接访问游戏数据，我们从DOM中提取信息
    var damage = 0;
    var shieldValue = 0;
    var healValue = 0;
    var attribute = null;
    var targetType = null;

    // 从卡片标签中提取数值信息和目标类型
    selectedCard.find('.card-tag').each(function () {
      var tagText = $(this).text();
      if ($(this).hasClass('tag-damage')) {
        damage += parseInt(tagText) || 0;
      } else if ($(this).hasClass('tag-shield')) {
        shieldValue += parseInt(tagText) || 0;
      } else if ($(this).hasClass('tag-heal')) {
        healValue += parseInt(tagText) || 0;
      } else if ($(this).hasClass('tag-attribute')) {
        attribute = tagText;
      } else if ($(this).hasClass('tag-target')) {
        targetType = tagText;
      }
    });

    // 构建效果信息
    var effectInfo = [];

    // 添加目标类型信息
    if (targetType) {
      effectInfo.push('目标:' + targetType);
    }

    if (damage > 0) {
      effectInfo.push('伤害:' + damage);
    }

    if (shieldValue > 0) {
      effectInfo.push('护盾:' + shieldValue);
    }

    if (healValue > 0) {
      effectInfo.push('治疗:' + healValue);
    }

    if (attribute) {
      effectInfo.push('属性:' + attribute);
    }

    // 显示效果信息
    if (effectInfo.length > 0) {
      infoBar.text(cardName + ' - ' + effectInfo.join(', '));
    } else {
      infoBar.text(cardName + ' - 无效果');
    }
  },

  // 更新回合信息
  updateRoundInfo: function (round, turn, event) {
    $('#round-number').text(round);
    $('#turn-number').text(turn);
    $('#event-info').text(event || "无事件");
  },

  // 更新玩家信息
  updatePlayerInfo: function (player) {
    // 存储当前玩家数据
    if (player) {
      this.currentPlayer = player;
    }

    // 更新生命值
    $('#player-hp').text(player.hp);
    $('#player-max-hp').text(player.maxHp);
    var healthPercentage = (player.maxHp > 0) ? (player.hp / player.maxHp) * 100 : 0;
    $('#health-bar').css('width', healthPercentage + '%');

    // 更新护盾值
    $('#player-shield').text(player.shield);
    $('#player-max-shield').text(player.maxShield);
    var shieldPercentage = (player.maxShield > 0) ? (player.shield / player.maxShield) * 100 : 0;
    $('#shield-bar').css('width', shieldPercentage + '%');

    // 更新玩家属性状态显示
    this.updateEntityAttributesDisplay(player, 'player');
  },

  // 更新能量槽
  updateEnergyBar: function (current, max) {
    $('#energy-value').text(current);
    $('#energy-max').text(max);
    var energyPercentage = (max > 0) ? (current / max) * 100 : 0;
    $('#energy-bar').css('width', energyPercentage + '%');
  },

  // 更新玩家名称
  updatePlayerName: function (name, className) {
    $('#player-name').text(name + '<' + className + '>');
  },

  // 更新玩家职业图片
  updatePlayerClassImage: function (imagePath) {
    $('#player-class-image').attr('src', imagePath);
  },

  // 在页面中央显示提示信息，1秒后自动消失
  showCenterMessage: function (message) {
    console.log('showCenterMessage:', message);
    // 创建提示信息元素
    var messageElement = $(`
            <div id="center-message" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                font-size: 12px;
                z-index: 1000;
                text-align: center;
                display: none;
            ">
                ${message}
            </div>
        `);

    // 添加到页面中
    $('body').append(messageElement);

    // 使用jQuery的fadeIn效果渐显
    messageElement.fadeIn(500);

    // 1.5秒后开始渐隐效果
    setTimeout(function () {
      messageElement.fadeOut(500, function () {
        // 淡出完成后移除元素
        messageElement.remove();
      });
    }, 500);
  },

  // 渲染怪物
  renderMonsters: function (monsters) {
    // 存储当前怪物数据
    if (monsters && Array.isArray(monsters)) {
      this.currentMonsters = monsters;
    }

    var container = $('#monsters-container');
    container.empty();

    for (var i = 0; i < monsters.length; i++) {
      var monster = monsters[i];
      // 获取怪物图片路径，如果怪物数据中有图片则使用，否则使用默认图片
      var imagePath = monster.image || './img/alien/外星人之王.jpg';

      // 使用唯一ID（如果存在）或者原始ID
      var monsterId = monster.uniqueId || monster.id;

      var monsterHtml = `
                <div class="monster" data-id="${monsterId}">
                    <div class="monster-image">
                        <img src="${imagePath}" alt="${monster.name}">
                    </div>
                    <div class="monster-name">${monster.name}</div>
                    <div class="monster-stats">
                        <div>生命: ${monster.hp}/${monster.maxHp}</div>
                        <div>护盾: ${monster.shield}/${monster.maxShield}</div>
                    </div>
                    <div class="monster-status">
                        <!-- 怪物状态效果将在这里显示 -->
                    </div>
                </div>
            `;
      container.append(monsterHtml);

      // 更新怪物属性状态显示
      this.updateEntityAttributesDisplay(monster, 'monster');
    }
  },

  // 渲染手牌
  renderHand: function (hand, currentDeck) {
    // 存储当前手牌数据
    if (hand && Array.isArray(hand)) {
      this.currentHand = hand;
    }

    // 存储当前卡组
    if (currentDeck && Array.isArray(currentDeck)) {
      this.currentDeck = currentDeck;
    }

    var container = $('#hand-container');
    container.empty();

    for (var i = 0; i < hand.length; i++) {
      var card = hand[i];

      // 确保每张卡片都有唯一ID
      if (!card.uniqueId) {
        card.uniqueId = card.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + '_' + i;
      }

      // 获取卡片图片路径，如果卡片数据中有图片则使用，否则使用默认图片
      var imagePath = card.image || './img/card/铁斧.jpg';

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

      // 添加属性标签（如果有的话）
      if (card.attribute && CardUtils.getAttributeName(card.attribute)) {
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

      var cardHtml = `
                <div class="card" data-id="${card.id}" data-unique-id="${card.uniqueId}">
                    <div class="card-name">${card.name}</div>
                    <div class="card-image">
                        <img src="${imagePath}" alt="${card.name}">
                    </div>


                    <div class="card-tags">
                        ${tags.join('')}
                        ${values.join('')}
                    </div>
                </div>
            `;
      container.append(cardHtml);
    }
  },

  // 渲染技能
  renderSkills: function (skills) {
    var container = $('#skills-container');
    container.empty();

    for (var i = 0; i < skills.length; i++) {
      var skill = skills[i];
      var skillHtml = `
                <button class="skill-button" data-id="${skill.id}" data-cost="${skill.cost}">
                    发动：${skill.name} (${skill.cost}能量)
                </button>
            `;
      container.append(skillHtml);
    }
  },

  // 更新实体属性状态显示
  updateEntityAttributesDisplay: function(entity, entityType) {
    // 如果实体没有属性，则不显示任何内容
    if (!entity.attributes) {
      return;
    }

    var entityId = entity.uniqueId || entity.id;
    var selector = '';

    // 根据实体类型确定选择器
    if (entityType === 'player') {
      selector = '.player-section';
    } else if (entityType === 'monster') {
      selector = `.monster[data-id="${entityId}"]`;
    }

    var entityElement = $(selector);
    if (!entityElement.length) {
      return;
    }

    // 查找或创建属性状态容器
    var statusContainer = entityElement.find(entityType === 'player' ? '.player-status' : '.monster-status');
    if (!statusContainer.length) {
      return;
    }

    // 清空现有的属性状态显示
    statusContainer.empty();

    // 遍历所有属性并显示
    for (var attr in entity.attributes) {
      if (entity.attributes.hasOwnProperty(attr) && entity.attributes[attr] > 0) {
        // 根据属性类型设置背景颜色
        var backgroundColor = '';
        switch (attr) {
          case 'fire':
            backgroundColor = 'red';
            break;
          case 'ice':
            backgroundColor = 'blue';
            break;
          case 'poison':
            backgroundColor = 'purple';
            break;
          case 'electric':
            backgroundColor = 'yellow';
            break;
          default:
            backgroundColor = 'gray';
        }

        // 创建属性状态span元素
        var attrSpan = $(`<span class="entity-attribute-display ${attr}">${entity.attributes[attr]}</span>`);
        statusContainer.append(attrSpan);
      }
    }
  }
};
