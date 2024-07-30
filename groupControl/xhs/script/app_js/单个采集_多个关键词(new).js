define("version", "9.0.u1254303");
define("resolution", "1080*1920");
define("requireVersion", "3.4.0");


try {
    // 创建手机对象
    var device = Device.searchObject(sigmaConst.DevSelectOne);
    if (!device) {
        throw "Cannot find device";
    }
    var delayMs = 100;
    var deviceName = device.name;
    var finishedTitles = [];
    var keyAll = [];
    var count = 0;
    var waitTimeMin = 10; // 休眠时间，单位为分钟，如需修改，改此处即可
    var waitTime = waitTimeMin * 60 * 1000;

    var keyDict = {
        'VC精华': ['如此敬业的vc精华', '不得了！脸怎么这么白净啊', '这两搭着 嫩脸效果多少', '去黄提亮嘎嘎猛'],
        '萃乐活VC精华': ['VC抗氧家族再添一员', '不得了！脸怎么这么白净啊', '这两搭着 嫩脸效果多少', '去黄提亮嘎嘎猛']
    };

    var runAppName = "com.xingin.xhs";
    print(device.name + "---开始采集搜索");
    for (var keyword in keyDict) {
        for (var i = 0; i < 3; i++) {
            try {
                var runapp = device.runApp(runAppName);
                if (runapp === 0) {
                    ret = get_Activity();

                    print(device.name + "---" + keyword + "---开始");
                    delay(3000);

                    // 执行
                    run(keyword);

                    // 清除后台
                    device.closeApp(runAppName);
                    device.send(tcConst.KEY_RECENTAPP);
                    delay(5000);
                    device.click(0.5000, 0.8900);

                    print(device.name + "---" + keyword + "---结束");
                    print(device.name + "---等待中...");

                    // 等待时间
                    delay(waitTime)
                    break;

                } else {
                    print(device.name + "---打开小红书失败");
                    delay(2000);
                }
            } catch (err) {
                print(device.name + err);
            }
        }
    }
    writeExcelFile(keyAll);
    printf(keyAll);
    print(device.name + "--------结束");
} catch (err) {
    print(device.name + err);
}


function reload() {
    device.send(tcConst.KEY_RECENTAPP);
    delay(2000);
    device.send(tcConst.KEY_BACK);
    delay(3000);
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

// 内容页随机
function personateDetail(detailType) {
    // 进入随机内容页面
    if (detailType === "3") {
        delay(randomNum(7000, 10000));
        for (let i = 0; i < randomNum(2, 5); i++) {
            delay(randomNum(1000, 3000));
            actionWithRetry(
                () => moveFunction(tcConst.movement.shiftDown),
                3,
                delayMs);
        }
        delay(randomNum(1000, 3000));
        let detailActivity3 = get_Activity();
        //  判断是否为详情页
        if (detailActivity3.indexOf("search") === -1) {
            actionWithRetry(
                () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                3,
                delayMs);
            delay(1000);
        } // 选定内容页面
    } else {
        if (detailType === "1") {
            for (let ii = 0; ii < randomNum(2, 3); ii++) {
                delay(randomNum(1000, 3000));
                actionWithRetry(
                    () => moveFunction(tcConst.movement.shiftRight),
                    3,
                    delayMs);
                delay(1000);
                let authorPage = actionWithRetry(
                    () => sendAaiFunction("T:*获赞与收藏*", "getBounds"),
                    3,
                    delayMs);
                if (authorPage) {
                    delay(1000);
                    actionWithRetry(
                        () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                        3,
                        delayMs);
                    break;
                }
            }
            for (let i = 0; i < randomNum(4, 6); i++) {
                delay(randomNum(5000, 10000));
                actionWithRetry(
                    () => moveFunction(tcConst.movement.shiftDown),
                    3,
                    delayMs);
            }
        } else {
            delay(randomNum(10000, 20000));
        }
    }
}


function checkNetError() {
    for (let kk = 0; kk < 3; kk++) {
        let errorText = device.sendAai({
            query: "T:*网络好像断了*",
            action: "getBounds",
        });
        if (errorText) {
            let click = device.sendAai({query: "C:.ImageView&&R:.c3k", action: "click"});
            if (click) {
                print(deviceName + "---网络错误解除成功");
                break;
            }
        }
    }
}

function checkDeviceError() {
    for (var kk = 0; kk < 3; kk++) {
        var deviceText = device.sendAai({
            query: "T:*设备异常，请尝试关闭/卸载风险插件或重启试试*",
            action: "getBounds",
        });
        if (deviceText != null) {
            var deviceClick = device.sendAai({
                query: "T:*知道了*",
                action: "click",
            });
            if (deviceClick) {
                print(deviceName + "--设备错误解除成功");
                break;
            }
        }
    }
}

function checkAccountError() {
    for (let kk = 0; kk < 3; kk++) {
        let deviceText = device.sendAai({
            query: "T:*检测到账号异常，请稍后重启试试*",
            action: "getBounds",
        });
        if (deviceText != null) {
            var deviceClick = device.sendAai({
                query: "T:*知道了*",
                action: "click",
            });
            if (deviceClick) {
                print(deviceName + "--账号异常解除成功");
            }
        }
    }
}

function writeExcelFile(dataList) {
    try {
        let currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        let excelPath = "D:/" + `${year}_${month}_${day}_` + "count.xlsx";
        let existingData = excelUtils.readExcel(excelPath, "Sheet1");
        if (existingData === null) {
            existingData = [['关键词', '标题', '作者', '次数']];
        }
        let jsArrayExistingData = [];
        let existingDataLength = existingData.length;
        for (let i = 0; i < existingDataLength; i++) {
            let innerArray = existingData[i];
            let jsInnerArray = [];
            for (let j = 0; j < innerArray.length; j++) {
                jsInnerArray.push(innerArray[j]);
            }
            jsArrayExistingData.push(jsInnerArray);
        }

        let dataListLength = dataList.length;
        for (let j = 0; j < dataListLength; j++) {
            let findFlag = false;
            for (let i = 1; i < existingDataLength; i++) {
                if (jsArrayExistingData[i][0] === dataList[j][0] && jsArrayExistingData[i][1] === dataList[j][1]
                    && jsArrayExistingData[i][2] === dataList[j][2]) {
                    jsArrayExistingData[i][3] = parseInt(jsArrayExistingData[i][3]) + 1;
                    findFlag = true;
                    break;
                }
            }
            if (findFlag) {
                continue;
            }
            let arr = [];
            arr.push(dataList[j][0]);
            arr.push(dataList[j][1]);
            arr.push(dataList[j][2]);
            arr.push(1);
            jsArrayExistingData.push(arr);
        }
        let ret = excelUtils.writeExcel(excelPath, "Sheet1", 0, 0, jsArrayExistingData);
        if (ret === true) {
            print(deviceName + "--成功写入Excel文件");
        } else {
            print(deviceName + "--写入Excel失败! 错误是: " + lastError());
        }
    } catch (err) {
        print("err:" + err);
    }

}

function sendAaiFunction(query, action) {
    let result = device.sendAai({
        query: query,
        action: action,
    });
    return result;
}

function sendFunction(code, state) {
    let result = device.send(code, state);
    if (result !== 0) {
        return null;
    }
    return result;
}

function clickFunction(x, y, action) {
    let result = device.click(x, y, action);
    if (result !== 0) {
        return null;
    }
    return result;
}

function moveFunction(action) {
    let result = device.move(action);
    if (result !== 0) {
        return null;
    }
    return result;
}

function actionWithRetry(action, times, delayMs) {
    for (let i = 0; i < times; i++) {
        try {
            const returnValue = action();
            if (returnValue !== null) {
                return returnValue;
            } else {
                checkNetError();
                checkDeviceError();
                checkAccountError();
            }
            delay(delayMs);
        } catch (err) {
            checkNetError();
            checkDeviceError();
            checkAccountError();
            continue;
        }
        return;
    }
}

function clickNoteByTitle(keyTitle, keyword) {
    let flag = false;
    var tt = false;
    bijIds = "";
    keyTitle2 = keyTitle.split("&&");
    var img = actionWithRetry(
        () => sendAaiFunction("T:*" + keyTitle2[0] + "*" + "&&R:/.cyz|.ey/", "getBounds"),
        3,
        delayMs);
    if (img && keyTitle2.length !== 1) {
        for (i = 0; i < img.ids.length; i++) {
            for (j = 0; j < 3; j++) {
                t = actionWithRetry(
                    () => sendAaiFunction("ID:" + img.ids[i],
                        "getText"),
                    3,
                    delayMs);
                if (t) {
                    if (t.retval.indexOf(keyTitle2[1]) !== -1) {
                        bijIds = img.ids[i];
                    }
                    break;
                }
            }
            if (bijIds) {
                break;
            }
        }
    } else if (img && keyTitle2.length === 1) {
        bijIds = img.ids[0];
    }
    if (bijIds) {
        delay(500);
        if (img.bounds[0][1] < 200) {
            tt = true;
            actionWithRetry(
                () => moveFunction(tcConst.movement.shiftUp),
                3,
                delayMs);
            delay(1000);
        }
        actionWithRetry(
            () => sendAaiFunction("ID:" + bijIds,
                "click"),
            3,
            delayMs);
        delay(randomNum(7500, 10000));
        checkNetError();
        checkDeviceError();
        delay(randomNum(7500, 10000));
        var author = actionWithRetry(
            () => sendAaiFunction("C:.TextView&&R:.nickNameTV",
                "getText"),
            3,
            delayMs);
        var detailActivity = get_Activity();
        //  判断是否为详情页
        if (detailActivity.indexOf("search.GlobalSearchActivity") === -1) {
            try {
                if (detailActivity.indexOf("notedetail.NoteDetailActivity") !== -1) {
                    personateDetail("1");
                    actionWithRetry(
                        () => moveFunction(tcConst.movement.shiftDown),
                        3,
                        delayMs);
                    // 标题
                    var title = actionWithRetry(
                        () => sendAaiFunction("C:.TextView&&R:.d44",
                            "getText"),
                        3,
                        delayMs);
                }
                if (
                    detailActivity.indexOf("detail.activity.DetailFeedActivity") !== -1
                ) {
                    delay(randomNum(15000, 24000));
                    for (i = 0; i < 2; i++) {
                        var author = actionWithRetry(
                            () => sendAaiFunction("C:.TextView&&R:.matrixNickNameView",
                                "getText"),
                            3,
                            delayMs);
                        if (author) {
                            break;
                        }
                    }
                    // 标题
                    var title = actionWithRetry(
                        () => sendAaiFunction("C:.TextView&&R:.noteContentText",
                            "getText"),
                        3,
                        delayMs);
                }
                if (!author) {
                    author = {retval: "空"};
                }
                if (!title) {
                    title = {retval: "空"};
                }
                count = count + 1;
                printf(
                    device.name +
                    "查找到关键词：" +
                    keyTitle +
                    "共" +
                    count +
                    "次" +
                    "  搜索词:" +
                    keyword +
                    "  作者" +
                    author
                );
                // 存储关键词 keyAll
                row = [];
                row.push(keyword);
                row.push(keyTitle);
                row.push(author.retval);
                keyAll.push(row);
                finishedTitles.push(keyTitle);
                flag = true;
            } catch (err) {
                print(device.name + "错误描述11：" + err);
                flag = false;
                delay(1000);
            }
            for (let i = 0; i < 3; i++) {
                let detailActivity2 = get_Activity();
                //  判断是否为详情页
                if (detailActivity2.indexOf("search.GlobalSearchActivity") === -1) {
                    actionWithRetry(
                        () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                        3,
                        delayMs);
                    delay(1000);
                }
            }
        } else {
            print(device.name + "当前页面既不是视频也不是图片");
            flag = false;
        }
    }
    if (tt) {
        actionWithRetry(
            () => moveFunction(tcConst.movement.shiftDown),
            3,
            delayMs);
        delay(800);
    }
    return flag;
}

// 滑动页面
function searchKeyword(titles, keyword) {
    finishedTitles = [];
    // i循环-滑动次数
    for (let i = 0; i <= 38; i++) {
        checkNetError();
        checkDeviceError();
        for (let z = titles.length - 1; z >= 0; z--) {
            if (clickNoteByTitle(titles[z], keyword)) {
                titles.splice(z, 1);
            }
        }
        // 当读完时退出i循环
        if (titles.length === 0) {
            break;
        }
        // 下滑
        actionWithRetry(
            () => moveFunction(tcConst.movement.shiftDown),
            3,
            delayMs);
        delay(500);
    }
    print(
        device.name +
        "关键词:" +
        keyword +
        "   已经完成:" +
        finishedTitles +
        "  未完成:" +
        titles
    );
}

function run(keyword) {
    if (get_Activity().indexOf("update") !== -1) {
        actionWithRetry(
            () => sendAaiFunction("C:.ImageView&&R:.az9",
                "click"),
            3,
            delayMs);
    }
    for (let i = 0; i < 3; i++) {
        try {
            if (get_Activity().indexOf("index") !== -1) {
                actionWithRetry(
                    () => clickFunction(970, 140, tcConst.STATE_PRESS),
                    3,
                    delayMs);
                delay(1000);
                device.exec(
                    "ime set com.sigma_rt.totalcontrol/.ap.service.SigmaIME",
                    5000
                );
                delay(1000);
            }

            // 输入关键
            var enterKeyword = device.inputTextSync(0, keyword);
            delay(1000);
            var searchText = actionWithRetry(
                () => sendAaiFunction("T:搜索||OX:-2",
                    "getText"),
                3,
                delayMs);
            if (enterKeyword === true && searchText.retval === keyword) {
                delay(1000);
                // 点击搜索按钮
                actionWithRetry(
                    () => sendAaiFunction("T:*搜索*",
                        "click"),
                    3,
                    delayMs);
                // 滑动页面
                delay(1000);
                searchKeyword(keyDict[keyword], keyword);
                // 发现页滑动次数
                break;
            } else {
                delay(500);
                actionWithRetry(
                    () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                    3,
                    delayMs);
            }
        } catch (err) {
            print(device.name + err);
        }
    }

}

function get_Activity() {
    for (var q = 0; q < 3; q++) {
        var ret = device.getActivity();
        delay(500);
        if (ret) {
            return ret;
        }
    }
    print(device.name + "3次get_Activity都失败");
}
