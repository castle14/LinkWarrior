// 音频管理器 - 负责游戏中所有音频的播放和管理
var AudioManager = (function() {
    // 存储所有音频对象
    var sounds = {};
    // 音频初始化状态
    var initialized = false;

    // 音频配置
    var soundConfig = {
        'attack': {
            src: ['./sound/attack.mp3'],
            volume: 0.5
        },
        'monsterAttack': {
            src: ['./sound/monster_attack.mp3'],
            volume: 0.5
        },
        'heal': {
            src: ['./sound/heal.mp3'],
            volume: 0.5
        },
        'injured': {
            src: ['./sound/injured.mp3'],
            volume: 0.5
        },
        'injuredFemale': {
            src: ['./sound/injured_female.mp3'],
            volume: 0.5
        },
        'injuredMonster': {
            src: ['./sound/injured_monster.mp3'],
            volume: 0.5
        },
        'victory': {
            src: ['./sound/victory.mp3'],
            volume: 0.5
        },
        'failure': {
            src: ['./sound/failure.mp3'],
            volume: 0.5
        },
        'swordSheath': {
            src: ['./sound/sword_sheath.mp3'],
            volume: 0.5
        },
        'shieldDefend': {
            src: ['./sound/puff.mp3'],
            volume: 0.5
        },
        'shieldUp': {
            src: ['./sound/stomp.mp3'],
            volume: 0.5
        } ,
        'activateSkill': {
            src: ['./sound/lightning_attack.mp3'],
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
        var sound = sounds[soundName];
        var soundId = sound.play();

        if (callback) {
            var finished = false;
            var finish = function (ok) {
                if (finished) {
                    return;
                }
                finished = true;
                sound.off('end', onEnd);
                sound.off('playerror', onPlayError);
                callback(ok);
            };
            var onEnd = function () {
                finish(true);
            };
            var onPlayError = function () {
                finish(false);
            };

            // 监听播放完成事件
            sound.once('end', onEnd);
            // 监听播放错误事件
            sound.once('playerror', onPlayError);

            // 移动端浏览器在非用户手势触发的播放可能被静默拦截，
            // 既不触发 end 也不触发 playerror，这里用时长兜底，保证回调一定执行
            var duration = 0;
            try {
                duration = sound.duration();
            } catch (e) {
                duration = 0;
            }
            var fallbackDelay = (duration && isFinite(duration) && duration > 0) ? duration * 1000 + 300 : 1000;
            setTimeout(function () {
                finish(false);
            }, fallbackDelay);
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
