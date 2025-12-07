// 音频管理器 - 负责游戏中所有音频的播放和管理
var AudioManager = (function() {
    // 存储所有音频对象
    var sounds = {};
    // 音频初始化状态
    var initialized = false;

    // 音频配置
    var soundConfig = {
        'attack': {
            src: ['./sound/攻击.mp3'],
            volume: 0.5
        },
        'monsterAttack': {
            src: ['./sound/怪兽攻击.mp3'],
            volume: 0.5
        },
        'heal': {
            src: ['./sound/治疗.mp3'],
            volume: 0.5
        },
        'injured': {
            src: ['./sound/受伤.mp3'],
            volume: 0.5
        },
        'injuredFemale': {
            src: ['./sound/受伤女.mp3'],
            volume: 0.5
        },
        'injuredMonster': {
            src: ['./sound/受伤怪.mp3'],
            volume: 0.5
        },
        'victory': {
            src: ['./sound/胜利.mp3'],
            volume: 0.5
        },
        'failure': {
            src: ['./sound/失败.mp3'],
            volume: 0.5
        },
        'swordSheath': {
            src: ['./sound/刀剑出鞘.mp3'],
            volume: 0.5
        },
        'shieldDefend': {
            src: ['./sound/噗.mp3'],
            volume: 0.5
        },
        'shieldUp': {
            src: ['./sound/跺脚.mp3'],
            volume: 0.5
        } ,
        'activateSkill': {
            src: ['./sound/闪电攻击.mp3'],
            volume: 0.5
        }
    };

    // 初始化音频系统
    function init() {
        if (initialized) {
            return;
        }

        // 创建所有音频对象
        for (var key in soundConfig) {
            if (soundConfig.hasOwnProperty(key)) {
                sounds[key] = new Howl({
                    src: soundConfig[key].src,
                    volume: soundConfig[key].volume,
                    html5: true
                });
            }
        }

        initialized = true;
    }

    // 播放音频
    function play(soundName, callback) {
        // 确保音频系统已初始化
        if (!initialized) {
            init();
        }

        // 检查音频是否存在
        if (!sounds[soundName]) {
            console.warn('音频 "' + soundName + '" 不存在');
            if (callback) callback(false);
            return;
        }

        // 播放音频并处理回调
        var soundId = sounds[soundName].play();

        if (callback) {
            // 监听播放完成事件
            sounds[soundName].once('end', function() {
                callback(true);
            });

            // 监听播放错误事件
            sounds[soundName].once('playerror', function() {
                callback(false);
            });
        }

        return soundId;
    }

    // 停止音频
    function stop(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].stop();
        }
    }

    // 暂停音频
    function pause(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].pause();
        }
    }

    // 恢复音频
    function resume(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].play();
        }
    }

    // 设置音量
    function setVolume(soundName, volume) {
        if (sounds[soundName]) {
            sounds[soundName].volume(volume);
        }
    }

    // 预加载音频
    function preload(soundName) {
        if (sounds[soundName]) {
            sounds[soundName].load();
        }
    }

    // 返回公共接口
    return {
        init: init,
        play: play,
        stop: stop,
        pause: pause,
        resume: resume,
        setVolume: setVolume,
        preload: preload
    };
})();
