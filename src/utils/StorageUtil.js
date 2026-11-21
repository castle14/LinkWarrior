// 工具类 - 本地存储的安全读写
// 统一封装 localStorage 的 JSON 序列化/反序列化，避免存档损坏时 JSON.parse 抛异常导致页面白屏
var StorageUtil = {
    // 安全读取并解析 JSON；数据缺失或损坏时返回 fallback，并清除损坏数据
    get: function(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (raw === null || raw === undefined || raw === '') {
                return fallback;
            }
            return JSON.parse(raw);
        } catch (e) {
            console.warn('StorageUtil.get: 解析 "' + key + '" 失败，已清除损坏数据', e);
            try {
                localStorage.removeItem(key);
            } catch (e2) {
                // ignore
            }
            return fallback;
        }
    },

    // 安全写入 JSON；写入失败（如配额超限）时返回 false
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('StorageUtil.set: 写入 "' + key + '" 失败', e);
            return false;
        }
    },

    // 安全删除
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            // ignore
        }
    }
};
