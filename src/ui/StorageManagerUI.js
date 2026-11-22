// UI组件 - 存档管理（本地存档 + 远程备份）
var StorageManagerUI = {
    // 打包/扫描本地存档时排除的配置类 key
    getExcludeKeys: function() {
        return [RemoteStorage.API_KEY_STORAGE, 'LinkWarriorRemoteBinIndex'];
    },

    init: function() {
        this.render();
        this.bindEvents();
        this.refreshLocalList();
        this.refreshRemoteList();
    },

    // 渲染整体框架
    render: function() {
        var apiKey = RemoteStorage.getApiKey();
        var isDefaultKey = RemoteStorage.isUsingDefaultKey();
        var html = `
            <div class="sm-container">
                <h1>存档管理</h1>
                <div id="sm-status" class="sm-status"></div>

                <div class="sm-section">
                    <div class="sm-section-header">
                        <h2>本地存档</h2>
                        <div class="sm-actions">
                            <button id="sm-export-all" class="sm-btn sm-btn-primary">全部导出</button>
                            <button id="sm-import-btn" class="sm-btn">导入存档</button>
                            <input type="file" id="sm-import-file" accept=".json,application/json" style="display:none">
                            <button id="sm-clear-all" class="sm-btn sm-btn-danger">清空全部</button>
                        </div>
                    </div>
                    <div id="sm-local-list" class="sm-list"></div>
                </div>

                <div class="sm-section">
                    <div class="sm-section-header">
                        <h2>远程备份</h2>
                    </div>
                    <div class="sm-api-key-row">
                        <input type="password" id="sm-api-key-input" class="sm-input" placeholder="已内置默认 key，如需覆盖请输入新 key" autocomplete="off" value="">
                        <button id="sm-save-key" class="sm-btn sm-btn-primary">保存 key</button>
                        <button id="sm-clear-key" class="sm-btn sm-btn-danger">清除</button>
                        <span id="sm-key-state" class="sm-key-state">${apiKey ? (isDefaultKey ? '已配置（默认）' : '已配置') : '未配置'}</span>
                    </div>
                    <p class="sm-hint">已内置默认 API key，开箱即用；如需更换，在上方输入新 key 并点「保存 key」即可覆盖（仅保存在本地浏览器，不会上传）。页面需通过 http(s) 打开（file:// 无法请求远程）。</p>
                    <div class="sm-actions">
                        <input type="text" id="sm-backup-name" class="sm-input" placeholder="备份名称（可选，默认「LinkWarrior 存档备份」）" maxlength="40">
                        <button id="sm-upload" class="sm-btn sm-btn-primary">上传本地存档到远程</button>
                        <button id="sm-refresh-remote" class="sm-btn">刷新列表</button>
                    </div>
                    <div id="sm-remote-list" class="sm-list"></div>
                </div>

                <div class="sm-back-row">
                    <button id="sm-back" class="sm-btn">返回主菜单</button>
                </div>

                <div id="sm-modal" class="sm-modal" style="display:none">
                    <div class="sm-modal-box">
                        <div class="sm-modal-header">
                            <span id="sm-modal-title">详情</span>
                            <button id="sm-modal-close" class="sm-btn sm-btn-small">关闭</button>
                        </div>
                        <pre id="sm-modal-body" class="sm-modal-body"></pre>
                    </div>
                </div>
            </div>
        `;
        $('body').html(html);
    },

    // HTML 转义
    escape: function(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    // 字节数格式化
    formatBytes: function(n) {
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
        return (n / 1024 / 1024).toFixed(2) + ' MB';
    },

    // 计算字符串 UTF-8 字节数
    byteLength: function(s) {
        try { return new Blob([s]).size; } catch (e) { return String(s).length; }
    },

    // 显示状态消息
    showStatus: function(msg, type) {
        var $el = $('#sm-status');
        $el.removeClass('sm-status-ok sm-status-err').text(msg);
        if (type === 'ok') { $el.addClass('sm-status-ok'); }
        else if (type === 'err') { $el.addClass('sm-status-err'); }
        if (msg) {
            setTimeout(function() { $el.text('').removeClass('sm-status-ok sm-status-err'); }, 4000);
        }
    },

    // 模态框
    showModal: function(title, text) {
        $('#sm-modal-title').text(title);
        $('#sm-modal-body').text(text);
        $('#sm-modal').show();
    },

    // 获取受管理的本地 key 列表
    getLocalKeys: function() {
        var exclude = this.getExcludeKeys();
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf('LinkWarrior') === 0 && exclude.indexOf(k) < 0) {
                keys.push(k);
            }
        }
        keys.sort();
        return keys;
    },

    // 读取本地索引（远程 bin 的元信息缓存）
    getBinIndex: function() {
        return StorageUtil.get('LinkWarriorRemoteBinIndex', {}) || {};
    },
    setBinIndex: function(idx) {
        StorageUtil.set('LinkWarriorRemoteBinIndex', idx);
    },

    // 刷新本地存档列表
    refreshLocalList: function() {
        var self = this;
        var keys = this.getLocalKeys();
        var $list = $('#sm-local-list');
        if (keys.length === 0) {
            $list.html('<div class="sm-empty">暂无本地存档数据</div>');
            return;
        }
        var html = '';
        keys.forEach(function(k) {
            var raw = localStorage.getItem(k) || '';
            var size = self.byteLength(raw);
            html += `
                <div class="sm-row">
                    <div class="sm-row-info">
                        <div class="sm-row-title">${self.escape(k)}</div>
                        <div class="sm-row-meta">${self.formatBytes(size)}</div>
                    </div>
                    <div class="sm-row-actions">
                        <button class="sm-btn sm-btn-small" data-action="view-local" data-key="${self.escape(k)}">查看</button>
                        <button class="sm-btn sm-btn-small" data-action="export-local" data-key="${self.escape(k)}">导出</button>
                        <button class="sm-btn sm-btn-small sm-btn-danger" data-action="delete-local" data-key="${self.escape(k)}">删除</button>
                    </div>
                </div>
            `;
        });
        $list.html(html);
    },

    // 刷新远程 bin 列表
    refreshRemoteList: function() {
        var self = this;
        var $list = $('#sm-remote-list');
        $list.html('<div class="sm-empty">加载中...</div>');

        RemoteStorage.listBins().then(function(ids) {
            var index = self.getBinIndex();
            // 清理索引中已不存在的 bin
            var changed = false;
            Object.keys(index).forEach(function(id) {
                if (ids.indexOf(id) < 0) { delete index[id]; changed = true; }
            });
            if (changed) { self.setBinIndex(index); }

            if (ids.length === 0) {
                $list.html('<div class="sm-empty">远程暂无备份</div>');
                return;
            }
            var html = '';
            ids.forEach(function(id) {
                var meta = index[id] || {};
                var timeStr = meta.createdAt ? new Date(meta.createdAt).toLocaleString() : '未知';
                var nameStr = meta.name || '未命名备份';
                var sizeStr = meta.size ? self.formatBytes(meta.size) : '';
                html += `
                    <div class="sm-row">
                        <div class="sm-row-info">
                            <div class="sm-row-title">${self.escape(nameStr)}</div>
                            <div class="sm-row-meta">${self.escape(timeStr)}${sizeStr ? ' · ' + sizeStr : ''}</div>
                        </div>
                        <div class="sm-row-actions">
                            <button class="sm-btn sm-btn-small" data-action="view-remote" data-id="${self.escape(id)}">查看</button>
                            <button class="sm-btn sm-btn-small sm-btn-primary" data-action="download-remote" data-id="${self.escape(id)}">下载恢复</button>
                            <button class="sm-btn sm-btn-small sm-btn-danger" data-action="delete-remote" data-id="${self.escape(id)}">删除</button>
                        </div>
                    </div>
                `;
            });
            $list.html(html);

            // 本地索引缺失元信息的 bin（如换浏览器/清缓存后），从远程回读补齐
            var missing = ids.filter(function(id) {
                return !index[id] || !index[id].name;
            });
            if (missing.length > 0) {
                self.fillMissingMeta(missing, index);
            }
        }).catch(function(err) {
            $list.html('<div class="sm-empty">加载失败：' + self.escape(err.message) + '</div>');
        });
    },

    // 从远程回读 bin 的 meta 补写本地索引（最多补 20 条，避免请求过多）
    fillMissingMeta: function(ids, index) {
        var self = this;
        var targets = ids.slice(0, 20);
        var tasks = targets.map(function(id) {
            return RemoteStorage.getBin(id).then(function(bin) {
                var meta = (bin && bin.meta) ? bin.meta : {};
                index[id] = {
                    name: meta.name || '未命名备份',
                    createdAt: meta.createdAt || null,
                    size: self.byteLength(JSON.stringify(bin))
                };
                return true;
            }).catch(function() { return false; });
        });
        Promise.all(tasks).then(function(results) {
            if (results.indexOf(true) >= 0) {
                self.setBinIndex(index);
                self.refreshRemoteList();
            }
        });
    },

    // 触发下载
    downloadText: function(filename, text) {
        var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    },

    // 打包所有本地存档为一个对象（name 为自定义备份名称，可空）
    packLocalData: function(name) {
        var self = this;
        var keys = this.getLocalKeys();
        var data = {};
        keys.forEach(function(k) {
            data[k] = StorageUtil.get(k, null);
        });
        return {
            meta: {
                name: (name && String(name).trim()) || 'LinkWarrior 存档备份',
                createdAt: new Date().toISOString(),
                app: 'LinkWarrior',
                keys: keys
            },
            data: data
        };
    },

    // 绑定事件（委托，适配动态列表）
    bindEvents: function() {
        var self = this;

        $('#sm-back').on('click', function() {
            window.location.href = 'index.html';
        });

        // 模态关闭
        $('#sm-modal-close, #sm-modal').on('click', function(e) {
            if (e.target.id === 'sm-modal' || e.target.id === 'sm-modal-close') {
                $('#sm-modal').hide();
            }
        });

        // API key 保存/清除
        $('#sm-save-key').on('click', function() {
            var key = $('#sm-api-key-input').val().trim();
            if (!key) { self.showStatus('key 不能为空', 'err'); return; }
            RemoteStorage.setApiKey(key);
            $('#sm-api-key-input').val('');
            $('#sm-key-state').text('已配置').removeClass('sm-key-state-err').addClass('sm-key-state-ok');
            self.showStatus('API key 已保存到本地', 'ok');
        });
        $('#sm-clear-key').on('click', function() {
            RemoteStorage.clearApiKey();
            var fallback = RemoteStorage.getApiKey();
            $('#sm-api-key-input').val('');
            if (fallback) {
                $('#sm-key-state').text('已配置（默认）').removeClass('sm-key-state-err').addClass('sm-key-state-ok');
                self.showStatus('已恢复为内置默认 API key', 'ok');
            } else {
                $('#sm-key-state').text('未配置').removeClass('sm-key-state-ok').addClass('sm-key-state-err');
                self.showStatus('API key 已清除', 'ok');
            }
        });

        // 本地：全部导出
        $('#sm-export-all').on('click', function() {
            var packed = self.packLocalData();
            var name = 'linkwarrior-save-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
            self.downloadText(name, JSON.stringify(packed, null, 2));
            self.showStatus('已导出全部存档', 'ok');
        });

        // 本地：导入
        $('#sm-import-btn').on('click', function() {
            $('#sm-import-file').val('').trigger('click');
        });
        $('#sm-import-file').on('change', function(e) {
            var file = e.target.files[0];
            if (!file) { return; }
            var reader = new FileReader();
            reader.onload = function(ev) {
                try {
                    var obj = JSON.parse(ev.target.result);
                    // 支持两种格式：打包格式 {data:{...}} 或 单 key 原始对象
                    var toWrite = {};
                    if (obj && obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data)) {
                        toWrite = obj.data;
                    } else if (obj && typeof obj === 'object') {
                        // 单文件导入：让用户选择写入哪个 key
                        var targetKey = prompt('请输入要写入的本地存档 key：', 'LinkWarriorGameData');
                        if (!targetKey) { return; }
                        toWrite[targetKey] = obj;
                    } else {
                        throw new Error('文件内容不是有效的 JSON 对象');
                    }
                    var names = Object.keys(toWrite);
                    if (names.length === 0) { self.showStatus('文件中没有可导入的数据', 'err'); return; }
                    if (!confirm('将导入以下 key 并覆盖本地现有数据：\n' + names.join('\n') + '\n\n确定继续？')) { return; }
                    names.forEach(function(k) {
                        StorageUtil.set(k, toWrite[k]);
                    });
                    self.refreshLocalList();
                    self.showStatus('成功导入 ' + names.length + ' 个存档', 'ok');
                } catch (err) {
                    self.showStatus('导入失败：' + err.message, 'err');
                }
            };
            reader.readAsText(file, 'utf-8');
        });

        // 本地：清空全部
        $('#sm-clear-all').on('click', function() {
            var keys = self.getLocalKeys();
            if (keys.length === 0) { self.showStatus('没有可清空的数据', 'err'); return; }
            if (!confirm('确定清空全部本地存档吗？\n将删除：\n' + keys.join('\n') + '\n\n此操作不可撤销！')) { return; }
            keys.forEach(function(k) { StorageUtil.remove(k); });
            self.refreshLocalList();
            self.showStatus('已清空全部本地存档', 'ok');
        });

        // 远程：上传
        $('#sm-upload').on('click', function() {
            var backupName = ($('#sm-backup-name').val() || '').trim();
            var packed = self.packLocalData(backupName);
            if (Object.keys(packed.data).length === 0) {
                self.showStatus('本地没有可上传的存档数据', 'err');
                return;
            }
            var size = self.byteLength(JSON.stringify(packed));
            if (size > RemoteStorage.MAX_BIN_BYTES) {
                self.showStatus('存档过大（' + self.formatBytes(size) + '），超过单 bin 上限', 'err');
                return;
            }
            self.showStatus('正在上传...', '');
            RemoteStorage.createBin(packed).then(function(res) {
                // 写入本地索引
                var index = self.getBinIndex();
                index[res.id] = {
                    name: packed.meta.name,
                    createdAt: packed.meta.createdAt,
                    size: size
                };
                self.setBinIndex(index);
                $('#sm-backup-name').val('');
                self.refreshRemoteList();
                self.showStatus('上传成功：' + packed.meta.name, 'ok');
            }).catch(function(err) {
                self.showStatus('上传失败：' + err.message, 'err');
            });
        });

        // 远程：刷新
        $('#sm-refresh-remote').on('click', function() {
            self.refreshRemoteList();
        });

        // 列表委托事件
        $('#sm-local-list').on('click', 'button[data-action]', function() {
            var action = $(this).data('action');
            var key = $(this).data('key');
            if (action === 'view-local') {
                var raw = localStorage.getItem(key) || '';
                var pretty = raw;
                try { pretty = JSON.stringify(JSON.parse(raw), null, 2); } catch (e) {}
                self.showModal('本地存档：' + key, pretty);
            } else if (action === 'export-local') {
                var raw = localStorage.getItem(key) || '';
                var pretty = raw;
                try { pretty = JSON.stringify(JSON.parse(raw), null, 2); } catch (e) {}
                self.downloadText(key + '.json', pretty);
                self.showStatus('已导出：' + key, 'ok');
            } else if (action === 'delete-local') {
                if (!confirm('确定删除本地存档 "' + key + '" 吗？此操作不可撤销！')) { return; }
                StorageUtil.remove(key);
                self.refreshLocalList();
                self.showStatus('已删除：' + key, 'ok');
            }
        });

        $('#sm-remote-list').on('click', 'button[data-action]', function() {
            var action = $(this).data('action');
            var id = $(this).data('id');
            if (action === 'view-remote') {
                self.showStatus('正在读取远程 bin...', '');
                RemoteStorage.getBin(id).then(function(data) {
                    self.showModal('远程备份：' + id, JSON.stringify(data, null, 2));
                    self.showStatus('', '');
                }).catch(function(err) {
                    self.showStatus('读取失败：' + err.message, 'err');
                });
            } else if (action === 'download-remote') {
                if (!confirm('确定将远程备份 "' + id + '" 恢复到本地吗？\n将覆盖本地同名 key 的现有数据！')) { return; }
                self.showStatus('正在下载恢复...', '');
                RemoteStorage.getBin(id).then(function(bin) {
                    // 兼容：打包格式 {meta, data} 或直接是数据
                    var toWrite = {};
                    if (bin && bin.data && typeof bin.data === 'object' && !Array.isArray(bin.data)) {
                        toWrite = bin.data;
                    } else {
                        toWrite['LinkWarriorGameData'] = bin;
                    }
                    var names = Object.keys(toWrite);
                    names.forEach(function(k) {
                        StorageUtil.set(k, toWrite[k]);
                    });
                    self.refreshLocalList();
                    self.showStatus('成功恢复 ' + names.length + ' 个存档到本地', 'ok');
                }).catch(function(err) {
                    self.showStatus('恢复失败：' + err.message, 'err');
                });
            } else if (action === 'delete-remote') {
                if (!confirm('确定删除远程备份 "' + id + '" 吗？此操作不可撤销！')) { return; }
                self.showStatus('正在删除...', '');
                RemoteStorage.deleteBin(id).then(function() {
                    var index = self.getBinIndex();
                    delete index[id];
                    self.setBinIndex(index);
                    self.refreshRemoteList();
                    self.showStatus('已删除远程备份：' + id, 'ok');
                }).catch(function(err) {
                    self.showStatus('删除失败：' + err.message, 'err');
                });
            }
        });
    }
};
