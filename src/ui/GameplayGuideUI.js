// UI组件 - 玩法说明
var GameplayGuideUI = {
    init: function() {
        this.render();
        this.bindEvents();
    },

    render: function() {
        var html = `
            <div class="guide-container">
                <h1>玩法说明</h1>

                <div class="guide-section">
                    <h2>游戏目标</h2>
                    <p>选择职业进入战斗，击败关卡内的全部怪物即可通关，并逐步解锁更多职业与卡牌。</p>
                </div>

                <div class="guide-section">
                    <h2>回合与手牌</h2>
                    <ul>
                        <li>每个回合会从卡组中补牌，使手牌保持最多 <span class="guide-highlight">5 张</span>。</li>
                        <li>打出卡牌需要消耗能量，能量上限由所选职业决定。</li>
                        <li>卡牌分为武器（weapon）与法术（spell），部分卡牌附带火焰、冰霜等属性。</li>
                        <li>部分卡牌攻击单个目标，部分卡牌为全体攻击。</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h2>角色属性</h2>
                    <ul>
                        <li><span class="guide-highlight">生命值</span>：降为 0 即挑战失败。</li>
                        <li><span class="guide-highlight">护盾值</span>：用于抵挡伤害。</li>
                        <li><span class="guide-highlight">能量</span>：打出卡牌与发动职业技能的消耗资源。</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h2>职业技能</h2>
                    <p>每个职业拥有专属技能，消耗能量发动，效果各不相同，可在「玩家信息」页查看当前职业的技能详情。</p>
                </div>

                <div class="guide-section">
                    <h2>星点与商店</h2>
                    <ul>
                        <li>击败本关全部怪物后获胜，获得的星点等于本关怪物等级之和。</li>
                        <li>刷新卡片商店消耗 <span class="guide-highlight">20</span> 星点。</li>
                        <li>购买卡牌按稀有度花费：N 5 / R 10 / SR 15 / SSR 20 / UR 25 星点。</li>
                        <li>解锁新职业需要 <span class="guide-highlight">100</span> 星点。</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h2>卡组与背包</h2>
                    <ul>
                        <li>初始卡组 30 张，同名卡牌最多 5 张。</li>
                        <li>背包中会额外获得 3 张卡牌。</li>
                        <li>可在「卡组编辑」中调整出战卡组，在「卡片商店」购买新卡。</li>
                    </ul>
                </div>

                <div class="guide-section">
                    <h2>存档</h2>
                    <ul>
                        <li>游戏进度保存在浏览器本地。</li>
                        <li>可在主菜单「存档管理」中查看、导出、导入本地存档。</li>
                        <li>支持将存档备份到远程，随时下载恢复。</li>
                    </ul>
                </div>

                <div class="guide-back-row">
                    <button id="guide-back-btn" class="guide-btn">返回主菜单</button>
                </div>
            </div>
        `;

        $('body').html(html);
    },

    bindEvents: function() {
        $('#guide-back-btn').on('click', function() {
            window.location.href = 'index.html';
        });
    }
};
