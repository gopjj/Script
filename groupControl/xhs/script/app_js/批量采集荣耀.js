define("version", "9.0.u1254303");
define("resolution", "1080*1920");
define("requireVersion", "3.4.0");
var device = Device.searchObject(sigmaConst.DevSelectOne);
// 创建手机对象
var contentNum = 50 // 如需修改采集笔记数 在此处修改即可
var infoIdsList = []
var noteTitlesList = ['脂皮可用精华(22)', '空瓶记：依泉润唇膏4g', '依泉B5，我的救命药']
var keywordArr = ["依泉"]
var executedKeywords = []

for (let i = 0; i < keywordArr.length + 10; i++) {
    let rdm = Math.floor(Math.random() * keywordArr.length)
    keywordArr.push(keywordArr[rdm])
    keywordArr.splice(rdm, 1)
}
print(device.name + '---' + keywordArr)
for (let attempts = 0; attempts < 3; attempts++) {
    try {
        device.closeApp('com.android.calendar');
        device.closeApp("com.xingin.xhs");
        delay(3000);
        var runAppName = "com.xingin.xhs"
        var runapp = device.runApp(runAppName);
        delay(1000);
        ret = get_Activity()
        if (runapp === 0) {
            print("开始")
            run(keywordArr)
            delay(1000);
            device.closeApp(runAppName);
            print(device.name + '------结束')
            break
            delay(1000);
        } else {
            print(device.name + '---打开小红书失败');
            delay(2000);
        }
    } catch (err) {
        print(device.name + '---' + err);
        infoIdsList = []
        for (let j = 0; j < executedKeywords.length; j++) {
            if (keywordArr.indexOf(executedKeywords[j]) !== -1) {
                keywordArr.splice(keywordArr.indexOf(executedKeywords[j]), 1)
            }
        }
    }
}
print("_+_+_+_+_+_+_+_+_+_+_+_")
transferData();
device.runApp('com.android.calendar')


function actionWithRetry(action, times, delayMs) {
    for (let i = 0; i < times; i++) {
        try {
            delay(delayMs);
            const returnValue = action();
            if (returnValue !== null) {
                return returnValue;
            }
        } catch (err) {
            continue;
        }
        return;
    }
}

function isAuthorPageLoaded() {
    delay(1000);
    // 某个未加载界面没有的元素
    const isLoad1 = device.sendAai({query: "R:.cjb", action: "getBounds"});

    const isLoad2 = device.sendAai({query: "T:*关注*", action: "getBounds"});
    const isLoad3 = device.sendAai({query: "T:*粉丝*", action: "getBounds"});
    if (isLoad1 && isLoad2 && isLoad3) {
        return true;
    }
    return null;
}

// 获取笔记链接
function getDetailHref(noteType) {
    let getCopy = '';
    for (let attempt = 0; attempt < 3; attempt++) {
        if (noteType === '图片') {
            if (device.sendAai({query: "C:.ImageView&&R:.moreOperateIV", action: "click"})) {
                delay(1000);
                if (device.sendAai({query: "T:复制链接", action: "click"})) {
                    delay(1000);
                    getCopy = device.get("text:clipboard");
                }
            }
        } else {
            if (device.sendAai({query: "C:.ImageView&&R:.ci9", action: "click"})) {
                delay(1000);
                if (device.sendAai({query: "T:复制链接", action: "click"})) {
                    delay(1000);
                    getCopy = device.get("text:clipboard");
                }
            }
        }
        if (getCopy) {
            return getCopy
        }
    }
    return getCopy
}

function authorInfo() {
    let fansNumber = {'retval': 'null'};
    const isPageLoaded = actionWithRetry(() => isAuthorPageLoaded(), 3, 1500);
    if (isPageLoaded) {
        for (let i = 0; i < 2; i++) {
            delay(1500);
            // 作者
            fansNumber = device.sendAai({query: "C:.TextView&&R:.aqn", action: "getText"});
            if (!fansNumber) {
                print(device.name + '粉丝页ids找不到')
                fansNumber = {'retval': 'null'}
            } else {
                break
            }
        }
        return fansNumber.retval
    } else {
        return 'null'
    }
}

function getPhotoNoteTime() {
    let activity = get_Activity()
    for (let attempts = 0; attempts < 10; attempts++) {
        if (activity.indexOf("search.GlobalSearchActivity") !== -1) {
            return 0
        }
        let publishTime = device.sendAai({query: "C:.TextView&&R:.cyn", action: "getText"});
        if (publishTime) {
            return publishTime.retval;
        } else {
            device.move(tcConst.movement.shiftDown);
            delay(randomNum(1000));
        }
    }
    return 'null'
}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        default:
            return 0;
    }
}

// 写入到手机SD卡中
function writeFile(arr, scrstr, filePath) {
    device.writeFile(filePath, arr, 0, 0);
    device.writeFile(filePath, '********************', 0, 0);
    const write = device.writeFile(filePath, scrstr, 0, 0);
    if (write === 0) {
        device.writeFile(filePath, '------------------------------', 0, 0);
        print(device.name + "---写入成功");
    } else {
        print(device.name + "---写入失败" + lastError());
    }
}

function transferData() {
    try {
        let date = new Date();
        let newTime = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
        let devicePath = "/sdcard/" + device.name + '_' + newTime + "_content.txt";
        let localPath = "D:\\xhsData\\logData";
        let ret = device.download(devicePath, localPath);
        if (ret !== 0) {
            print(device.name + "---传输失败：" + lastError());
        } else {
            print(device.name + "--从手机SD卡中传输成功,至" + localPath);
        }
    } catch (err) {
        print(device.name + "err:" + err);
    }
}


function checkNetError() {
    for (let attempts = 0; attempts < 3; attempts++) {
        let errorText = device.sendAai({query: "T:*网络好像断了*", action: "getBounds"});
        if (errorText) {
            delay(100000);
            print(device.name + '网络中断,重新点击')
            device.sendAai({query: "C:.ImageView&&R:.dfs", action: "click"});
            delay(3000);
        } else {
            break
        }
    }
}

function fetchData(filePath, authorKey) {
    try {
        let detailActivity = get_Activity();
        let author = {'retval': 'null'};
        let title = {'retval': 'null'};
        let like = {'retval': 'null'};
        let collect = {'retval': 'null'};
        let comment = {'retval': 'null'};
        let content = {'retval': 'null'};
        let noteType = '图片'
        let publishTime;
        if (detailActivity.indexOf("notedetail.NoteDetailActivity") !== -1) {
            // 等待图文加载
            delay(3000);
            // 作者
            author = device.sendAai({query: "C:.TextView&&R:.nickNameTV", action: "getText"});
            // 下滑
            device.move(tcConst.movement.down);
            // 标题
            title = device.sendAai({query: "C:.TextView&&R:.cz0", action: "getText"});
            // 判断是否重复采集
            if (noteTitlesList.includes(title.retval)) {
                print(device.name + "--" + title.retval + "已采集,跳过")
                return false;
            } else {
                noteTitlesList.push(title.retval)
            }
            // 点赞
            like = device.sendAai({query: "C:.TextView&&R:.cyd", action: "getText"});
            // 收藏
            collect = device.sendAai({query: "C:.TextView&&R:.cwu", action: "getText"});
            // 评论
            comment = device.sendAai({query: "C:.TextView&&R:.cx3", action: "getText"});
            // 正文
            content = device.sendAai({query: "C:.TextView&&R:.bgo", action: "getText"});
            if (!content) {
                device.move(tcConst.movement.shiftDown);
                delay(1000);
                content = device.sendAai({query: "C:.TextView&&R:.bgo", action: "getText"});
            }
            delay(1500)
            publishTime = getPhotoNoteTime()
            noteType = '图片'
        }

        // 如果是视频笔记
        if (detailActivity.indexOf("detail.activity.DetailFeedActivity") !== -1) {
            delay(2000)
            // 根据class resource字段
            // 获取作者
            author = device.sendAai({query: "C:.TextView&&R:.matrixNickNameView", action: "getText"});
            // 标题
            title = device.sendAai({query: "C:.TextView&&R:.noteContentText", action: "getText"});
            if (noteTitlesList.includes(title.retval)) {
                print(device.name + "--" + title.retval + "已采集,跳过")
                return false;
            } else {
                noteTitlesList.push(title.retval)
            }
            // 点赞数
            like = device.sendAai({query: "C:.TextView&&R:.chy", action: "getText"});
            // 收藏数
            collect = device.sendAai({query: "C:.TextView&&R:.cht", action: "getText"});
            // 评论数
            comment = device.sendAai({query: "C:.TextView&&R:.chv", action: "getText"});

            // 展开全文
            let showAll = device.sendAai({query: "T:*展开全文*", action: "click"});
            // 如果有展开全文选项就点击后获取，没有则直接获取
            if (showAll !== null) {
                delay(3000);
                content = device.sendAai({query: "C:.TextView&&R:.cxz", action: "getText"});
            } else {
                content = title;
                device.sendAai({query: "C:.TextView&&R:.noteContentText", action: "click"});
                delay(1000);
            }
            publishTime = device.sendAai({query: "C:.TextView&&R:.e_b", action: "getText"});
            if (!publishTime) {
                print("时间 : " + lastError());
                publishTime = 'null'
            } else {
                publishTime = publishTime.retval
            }
            noteType = '视频'
        }

        if (get_Activity().indexOf("search.GlobalSearchActivity") !== -1) {
            return false;
        } else {
            let getCopy = getDetailHref(noteType)
            // 进入作者页
            device.move(tcConst.movement.shiftRight);
            let fansNumber = authorInfo()
            if (getCopy) {
                let arr = {
                    "title": title.retval,
                    "author": author.retval,
                    "like": like.retval,
                    "collect": collect.retval,
                    "comment": comment.retval,
                    "keyword": authorKey,
                    "fenss": fansNumber,
                    "con_time": publishTime,
                    "get_copy": getCopy,
                    "comment_list": 'null',
                    'note_type': noteType
                };
                writeFile(arr, content.retval, filePath);
                printf(device.name + '--关键词:%s,作者:%s,标题:%s,点赞:%s,收藏:%s,评论:%s,粉丝数:%s,时间:%s,链接:%s', authorKey, author.retval, title.retval,
                    like.retval, collect.retval, comment.retval, fansNumber, publishTime, getCopy.substr(0, 20));
            } else {
                print('复制链接失败');
            }
            return true;
        }
    } catch (err) {
        print(device.name + "--错误描述：" + err.message);
        delay(500);
    }
}


function clickKey(ids, filePath, authorKey) {
    let canProceed = false;
    let shouldScrollDown = false;
    const contentBounds = device.sendAai({query: "ID:" + ids, action: "getBounds"});
    if (contentBounds) {
        delay(500);
        if (contentBounds.bounds[0][1] < 200) {
            shouldScrollDown = true
            device.move(tcConst.movement.shiftUp);
            delay(1000);
        }
    }
    if (!device.sendAai({query: "ID:" + ids, action: "click"})) {
        print(device.name + "--点击失败");
    }
    delay(500);
    let detailActivity = get_Activity();
    print(detailActivity);
    //  判断是否为详情页
    if (detailActivity.indexOf("search.GlobalSearchActivity") === -1) {
        canProceed = fetchData(filePath, authorKey);
        // '返回列表页'
        for (let i = 0; i < 3; i++) {
            //  判断是否为详情页
            if (get_Activity().indexOf("search") === -1 && get_Activity().indexOf("search") === -1) {
                device.send(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS);
                delay(1000);
            }
        }
    } else {
        print(device.name + '--当前页面既不是视频也不是图片');
    }

    if (shouldScrollDown) {
        device.move(tcConst.movement.shiftDown);
        delay(1000);
    }
    return canProceed;
}

// 滑动页面
function searchKey(filePath, keyword, newTime) {
    let imgInfo;
    for (let i = 0; i < 300; i++) {
        checkNetError()
        let retryTime;
        for (retryTime = 0; retryTime < 3; retryTime++) {
            delay(5000);
            imgInfo = device.sendAai({query: "C:.ImageView&&R:.cy6", action: "getBounds"});
            printf(imgInfo)
            delay(500);
            if (imgInfo) {
                break;
            }
        }
        if (retryTime >= 3) {
            print(device.name + '--列表页ids找不到')
            return true;
        }
        if (!imgInfo) {
            imgInfo = {'ids': []}
        }
        print('----------------------------------------------------------------------')
        for (let h = 0; h < imgInfo.ids.length; h++) {
            let currentIds = imgInfo.ids[h]
            if (infoIdsList.indexOf(currentIds) === -1) {
                // 是否在当前页
                if (clickKey(currentIds, filePath, keyword)) {
                    infoIdsList.push(currentIds);
                    printf(device.name + "--列表数量:%d", infoIdsList.length)
                    // 当达到指定数量时结束
                    if (infoIdsList.length >= contentNum) {
                        return true;
                    }
                }
            } else {
                const subscript = infoIdsList.lastIndexOf(currentIds);
                if (infoIdsList.length - subscript > 5) {
                    if (clickKey(currentIds, filePath, keyword)) {
                        infoIdsList.push(currentIds);
                        printf(device.name + "--列表数量:%d", infoIdsList.length)
                        if (infoIdsList.length >= contentNum) {
                            return true;
                        }
                    }
                }
            }
        }
        delay(500);
        // TODO:下滑bug修复
        const slide = device.move(tcConst.movement.shiftDown);
        // device.shift(tcConst.KEY_DOWN);
        // device.swipe([535,1920],[542,1202]);
        // device.move(tcConst.movement.pageDown);
        // device.scroll(535, 1920, 0, 500);
        if (slide !== 0) {
            print(device.name + "--滑动失败：" + lastError());
        } else {
            print(device.name + "下滑成功");
        }
        if (get_Activity().indexOf("search") !== -1 && device.sendAai({
            query: "T:*搜索发现*",
            action: "getBounds"
        })) {
            sendKey(keyword)
        }
    }
}

function sendKey(key) {
    for (let attempts = 0; attempts < 3; attempts++) {
        if (get_Activity().indexOf('index') !== -1) {
            device.click(970, 140, tcConst.STATE_PRESS);
            print(device.name + "--进入小红书搜索页");
            delay(1000);
            device.exec("ime set com.sigma_rt.totalcontrol/.ap.service.SigmaIME", 5000);
            delay(1000);
        }
        try {
            // 输入关键
            let keyword = device.inputTextSync(0, key);
            print("输入：" + keyword);
            delay(1000);
            const searchText = device.sendAai({query: "C:.EditText&&R:.dns", action: "getText"});
            if (keyword === true) {
                print(device.name + "--输入：" + key);
                break;
            } else {
                delay(500);
                print(device.name + '--判断输入关键词是否成功');
                device.send(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS);
            }
        } catch (err) {
            print(device.name + err);
            infoIdsList = []
        }
    }
}

function run(key) {
    print(device.name + "--打开小红书");
    if (get_Activity().indexOf('update') !== -1) {
        device.sendAai({query: "C:.ImageView&&R:.az9", action: "click"});
    }
    const d = new Date();
    const newTime = d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
    const filePath = "/sdcard/" + device.name + '_' + newTime + "_content.txt";
    let ret = device.rmFile(filePath);
    if (ret === 0) {
        print(device.name + "成功删除运行前当天日志文件");
    } else {
        print(lastError());
    }
    //对坐标(123,254)进行点击操作（按下+弹起）
    for (let j = 0; j < key.length; j++) {
        sendKey(key[j])
        delay(2000);
        device.clickSync("搜索");
        // 滑动页面
        searchKey(filePath, key[j], newTime)
        delay(1000);
        // 返回搜索页
        infoIdsList = []
        executedKeywords.push(key[j]);
    }
}

function get_Activity() {
    for (let attempts = 0; attempts < 3; attempts++) {
        let ret = device.getActivity();
        delay(500);
        if (ret) {
            return ret
        }
    }
    print(device.name + '--3次get_Activity都失败')
}
