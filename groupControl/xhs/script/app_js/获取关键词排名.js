define("version", "9.0.u1254303");
define("resolution", "1080*1920");
define("requireVersion", "3.4.0");

// 保存rank文件的路径
var excelPath = "C:/Users/mac/Desktop/xhs/app_js/rank.xlsx";

try {
    // 创建手机对象
    var device = Device.searchObject(sigmaConst.DevSelectOne);
    if (!device) {
        throw "Cannot find device";
    }
    var deviceName = device.name;
    var keyDict = {'发膜推荐': ['现在想鼠的心都有了…', '氛围感的尽头是光泽感好头发！', '试过了！炸毛柔顺剂！抚平毛躁就这么简单', '任何一个人不用这款发膜我都会伤心的！Ok？', '这发膜好用发癫了...干枯毛躁头亲妈发膜！', '贵气女主感', '所有女生都去给我用啊啊啊啊！！！', '干枯稻草头回春术！这发膜真的有点东西！']}
    var rankLimit = 100; // 排名上限
    var runAppName = "com.xingin.xhs";
    print(device.name + "---开始采集搜索");
    for (const keyword in keyDict) {
        for (let i = 0; i < 3; i++) {
            try {
                const runapp = device.runApp(runAppName);
                if (runapp === 0) {
                    ret = get_Activity();
                    print(device.name + "--" + keyword + "---开始");
                    delay(3000);

                    // 执行
                    run(keyword);

                    print(device.name + "---" + keyword + "---结束");
                    delay(5000)
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
    print(device.name + "--------结束");
} catch (err) {
    print(device.name + err);
}

function checkNetError() {
    for (let kk = 0; kk < 3; kk++) {
        const errorText = device.sendAai({
            query: "T:*网络好像断了*",
            action: "getBounds",
        });
        if (errorText) {
            delay(1000);
            device.sendAai({query: "C:.ImageView&&R:.c3k", action: "click"});
            delay(3000);
        }
    }
}

function checkLoadError() {
    for (let kk = 0; kk < 3; kk++) {
        const errorElement = device.sendAai({
            query: "R:.bwn&&C:.ImageView",
            action: "getBounds",
        });
        if (errorElement) {
            delay(1000);
            device.move(tcConst.movement.shiftUp);
            device.move(tcConst.movement.shiftDown);
            device.move(tcConst.movement.shiftDown);
            print("解决加载失败问题")
            delay(3000);
        }
    }
}

function checkDeviceError() {
    for (let kk = 0; kk < 3; kk++) {
        const deviceText = device.sendAai({
            query: "T:*设备异常，请尝试关闭/卸载风险插件或重启试试*",
            action: "getBounds",
        });
        if (deviceText != null) {
            var deviceClick = device.sendAai({
                query: "T:*知道了*",
                action: "click",
            });
            if (deviceClick) {
                printf("设备错误点击成功");
            }
        }
    }
}

function writeExcelFile(keyword, foundTitlesIndexDict) {
    try {
        let existingData = excelUtils.readExcel(excelPath, "Sheet1");

        let startingRow = 0;

        if (existingData != null && existingData.length > 0) {
            startingRow = existingData.length; // 下一行开始添加新数据
        }

        let data = [];

        for (let title in foundTitlesIndexDict) {
            let row = [];
            row.push(keyword);
            row.push(title);
            row.push(foundTitlesIndexDict[title]);
            row.push(deviceName);

            // 格式化日期为中文格式
            let currentDate = new Date();
            let year = currentDate.getFullYear(); // 获取年份
            let month = currentDate.getMonth() + 1; // 获取月份，注意要加 1
            let day = currentDate.getDate(); // 获取日期
            let hours = currentDate.getHours(); // 获取小时
            let minutes = currentDate.getMinutes(); // 获取分钟
            let seconds = currentDate.getSeconds(); // 获取秒数

            // 构造中文格式的日期字符串
            let formattedDate = `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;

            row.push(formattedDate); // 添加格式化后的日期
            data.push(row);
        }

        let ret = excelUtils.writeExcel(excelPath, "Sheet1", 0, startingRow, data);

        if (ret === true) {
            console.log("成功写入Excel文件");
        }
    } catch (err) {
        console.log("写入Excel失败! 错误是: " + err);
    }

}

function getRank(keyTitles, keyword) {
    let titlesObjs = []
    let foundTitlesDict = {};
    delay(2000);

    while (keyTitles.length > 0 && titlesObjs.length < rankLimit) {
        checkLoadError();
        checkNetError();
        checkDeviceError();
        let objs = device.sendAai({action: "getText", query: "C:.TextView&&R:/.cyz|.ey/&&ST:YX"});
        for (let i = 0; i < objs.retval.length; i++) {
            if (!titlesObjs.includes(objs.retval[i])) {
                titlesObjs.push(objs.retval[i]);
                print(`(${device.name}-${titlesObjs.length}/${rankLimit})${objs.retval[i].substring(0, 20)}`);
            } else {
                continue;
            }
            for (let j = keyTitles.length - 1; j >= 0; j--) {
                if (objs.retval[i].indexOf(keyTitles[j]) !== -1) {
                    print(device.name + "》.《 找到了-" + keyTitles[j] + "-在第" + titlesObjs.length + "名");
                    foundTitlesDict[keyTitles[j]] = "第" + titlesObjs.length + "名";
                    keyTitles.splice(j, 1);
                    break;
                }
            }
        }
        device.move(tcConst.movement.down);
        delay(2000);
    }
    for (let title of keyTitles) {
        foundTitlesDict[title] = "不在前" + rankLimit + "名";
    }
    print("关键词---" + keyword + "搜索完毕:\n" + JSON.stringify(foundTitlesDict));
    return foundTitlesDict;
}


function run(keyword) {
    if (get_Activity().indexOf("update") !== -1) {
        device.sendAai({query: "C:.ImageView&&R:.az9", action: "click"});
    }
    for (let i = 0; i < 3; i++) {
        try {
            if (get_Activity().indexOf("index") !== -1) {
                device.click(970, 140, tcConst.STATE_PRESS);
                delay(1000);
                device.exec(
                    "ime set com.sigma_rt.totalcontrol/.ap.service.SigmaIME",
                    5000
                );
                delay(1000);
            }

            // 输入关键
            const enterKeyword = device.inputTextSync(0, keyword);
            delay(1000);
            const searchText = device.sendAai({
                query: "T:搜索||OX:-2",
                action: "getText",
            });
            if (enterKeyword === true && searchText.retval === keyword) {
                delay(1000);
                // 点击搜索按钮
                device.sendAai({query: "T:*搜索*", action: "click"});
                // 滑动页面
                delay(1000);
                foundTitlesIndexDict = getRank(keyDict[keyword], keyword);
                writeExcelFile(keyword, foundTitlesIndexDict);
                break;
            } else {
                delay(500);
                device.send(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS);
            }
        } catch (err) {
            print(device.name + err);
        }
    }

}

function get_Activity() {
    for (let q = 0; q < 3; q++) {
        const ret = device.getActivity();
        delay(500);
        if (ret) {
            return ret;
        }
    }
    print(device.name + "3次get_Activity都失败");
}
