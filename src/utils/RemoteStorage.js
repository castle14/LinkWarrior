// 工具类 - 远程 JSON 存储（ExtendsClass JSON Storage）
// 文档: https://json.extendsclass.com
// 要点:
//   1. 所有响应体在合法 JSON 之后都追加了约 22KB HTML 广告，必须只解析开头第一个完整 JSON
//   2. 判成功看 status 字段是否为 0，而非仅看 HTTP 200
//   3. Api-key 仅用于 POST /bin 与 GET /bins；Security-key 为单 bin 保护密码（可选）
//   4. 内置默认 API key；用户可在存档管理页输入保存以覆盖默认值（存于 localStorage）
var RemoteStorage = {
    API: 'https://json.extendsclass.com',
    // 内置默认 API key（开箱即用，无需手动输入）；在页面保存新 key 可覆盖此默认值
    DEFAULT_API_KEY: 'd758fd91-ddde-11f1-a19a-0242ac110009',
    // API key 存放在本地的 key（以 LinkWarrior 开头，打包本地存档时需排除）
    API_KEY_STORAGE: 'LinkWarriorRemoteApiKey',
    // 单 bin 体积上限（服务端 100KB，留一点余量）
    MAX_BIN_BYTES: 95 * 1024,

    // 解析响应体开头的第一个完整 JSON，忽略尾部追加的广告 HTML
    parseFirstJson: function(text) {
        var depth = 0, inStr = false, esc = false, start = -1;
        for (var i = 0; i < text.length; i++) {
            var c = text[i];
            if (start < 0) {
                if (c === '{' || c === '[') { start = i; depth = 1; }
                continue;
            }
            if (inStr) {
                if (esc) { esc = false; }
                else if (c === '\\') { esc = true; }
                else if (c === '"') { inStr = false; }
            } else if (c === '"') {
                inStr = true;
            } else if (c === '{' || c === '[') {
                depth++;
            } else if (c === '}' || c === ']') {
                if (--depth === 0) {
                    return JSON.parse(text.slice(start, i + 1));
                }
            }
        }
        throw new Error('响应中未找到 JSON');
    },

    // 读取生效的 API key：优先用户手动保存的，否则回退内置默认值
    getApiKey: function() {
        return StorageUtil.get(this.API_KEY_STORAGE, '') || this.DEFAULT_API_KEY || '';
    },

    // 当前是否使用内置默认 key（用户未手动覆盖）
    isUsingDefaultKey: function() {
        return !StorageUtil.get(this.API_KEY_STORAGE, '') && !!this.DEFAULT_API_KEY;
    },

    // 保存 API key 到本地
    setApiKey: function(key) {
        StorageUtil.set(this.API_KEY_STORAGE, String(key || '').trim());
    },

    // 清除本地保存的 API key
    clearApiKey: function() {
        StorageUtil.remove(this.API_KEY_STORAGE);
    },

    // 统一请求：fetch 原始文本 -> 解析首个 JSON -> 判定 status
    // opts: { securityKey }
    request: function(method, path, headers, body, opts) {
        var self = this;
        opts = opts || {};
        headers = headers || {};

        if (opts.securityKey) {
            headers['Security-key'] = opts.securityKey;
        }

        var fetchOpts = { method: method, headers: headers, cache: 'no-store' };
        if (body !== undefined) {
            fetchOpts.body = JSON.stringify(body);
        }

        return fetch(this.API + path, fetchOpts).then(function(res) {
            return res.text().then(function(text) {
                var parsed;
                try {
                    parsed = self.parseFirstJson(text);
                } catch (e) {
                    throw new Error('HTTP ' + res.status + '：响应不是有效 JSON（可能未认证或被缓存，请检查 API key）');
                }
                // 服务端统一形态: { status: 0|1, message: '...' }
                if (parsed && typeof parsed === 'object' && 'status' in parsed) {
                    if (parsed.status !== 0) {
                        throw new Error('HTTP ' + res.status + '：' + (parsed.message || '未知错误'));
                    }
                    if (!res.ok) {
                        throw new Error('HTTP ' + res.status + '：请求失败');
                    }
                    return parsed;
                }
                // 部分响应（如 GET /bin/:id 成功）直接返回数据本体，无 status 包裹
                if (!res.ok) {
                    throw new Error('HTTP ' + res.status + '：请求失败');
                }
                return parsed;
            });
        }, function() {
            throw new Error('网络请求失败，请检查网络或确认页面通过 http(s) 打开（file:// 无法 fetch）');
        });
    },

    // 创建 bin，返回 { id, uri }
    createBin: function(payload, opts) {
        var key = this.getApiKey();
        if (!key) {
            return Promise.reject(new Error('未配置 API key，请先在存档管理页填写'));
        }
        var bodyStr = JSON.stringify(payload);
        if (bodyStr.length > this.MAX_BIN_BYTES) {
            return Promise.reject(new Error('数据过大（' + bodyStr.length + ' 字节），超过单 bin 上限 ' + this.MAX_BIN_BYTES + ' 字节'));
        }
        return this.request('POST', '/bin', {
            'Api-key': key,
            'Content-Type': 'application/json'
        }, payload, opts).then(function(res) {
            return { id: res.id, uri: res.uri };
        });
    },

    // 读取 bin，返回数据对象
    getBin: function(id, opts) {
        return this.request('GET', '/bin/' + id, {}, undefined, opts);
    },

    // 整体覆盖 bin，返回服务端回显（data 可能是双重编码字符串）
    updateBin: function(id, payload, opts) {
        var bodyStr = JSON.stringify(payload);
        if (bodyStr.length > this.MAX_BIN_BYTES) {
            return Promise.reject(new Error('数据过大（' + bodyStr.length + ' 字节），超过单 bin 上限'));
        }
        return this.request('PUT', '/bin/' + id, {
            'Content-Type': 'application/json'
        }, payload, opts).then(function(res) {
            // data 是双重编码字符串，二次解析
            if (res && typeof res.data === 'string') {
                try { return JSON.parse(res.data); } catch (e) { return res.data; }
            }
            return res ? res.data : undefined;
        });
    },

    // 局部更新（JSON Merge Patch），返回服务端回显
    patchBin: function(id, patch, opts) {
        return this.request('PATCH', '/bin/' + id, {
            'Content-type': 'application/merge-patch+json'
        }, patch, opts).then(function(res) {
            if (res && typeof res.data === 'string') {
                try { return JSON.parse(res.data); } catch (e) { return res.data; }
            }
            return res ? res.data : undefined;
        });
    },

    // 删除 bin
    deleteBin: function(id, opts) {
        return this.request('DELETE', '/bin/' + id, {}, undefined, opts);
    },

    // 列出当前账号下所有 bin id
    listBins: function() {
        var key = this.getApiKey();
        if (!key) {
            return Promise.reject(new Error('未配置 API key，请先在存档管理页填写'));
        }
        return this.request('GET', '/bins', { 'Api-key': key }, undefined).then(function(res) {
            // 成功返回 bin id 数组，可能直接是数组或包裹在某字段里
            if (Array.isArray(res)) { return res; }
            if (res && Array.isArray(res.bins)) { return res.bins; }
            return [];
        });
    }
};
