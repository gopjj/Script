define("version", "9.0.u1254303");
define("resolution", "1080*1920");
define("requireVersion", "3.4.0");

try {
    // 创建手机对象
    var device = Device.searchObject(sigmaConst.DevSelectOne);
    if (!device) {
        throw "Cannot find device";
    }
    var deviceName = device.name;
    var finishedTitles = [];
    var keyAll = [];
    var count = 0;
    var waitTimeMin = 0.1; // 休眠时间，单位为分钟，如需修改，改此处即可
    var waitTime = waitTimeMin * 60 * 1000;

    var keyDict={'浴巾推荐': ['备齐夏季玩水装备'], 'a醇': ['无痛灭纹全靠早A晚A', '抗老届亚当来了？古希腊', '还在早C晚A? 早A晚A', 'OLAY最伟大的单品出', '硬核抗老三巨头都在一', '内行人大跌眼镜，抗老圈', '内行人剧透！因为它', '开扒OLAY重磅新品！真实', '天选淡纹嫩脸一用一', 'OLAY今年太炸街！抗老领', 'OLAY实验室线放大', '300元抗老精华效果媲美', '方圆阔面脸上镜技巧！状态', '抗老圈新晋收割机？谁给的', '炸裂淡纹届，全脸细纹', '眼纹法令纹: 已老实', '要买抗老精华的你先别急！先看看李佳琦...', 'A醇精华入门到进阶盘点'], '精华': ['2天就见效!? 什么抗老', 'OLAY实验室线疯批新品', '纹路越多它越牛，天选抗', '抗老届黑马来了！OLAY', 'OLAY最伟大的单品出', '硬核抗老三巨头都在一', '内行人大跌眼镜，抗老圈', '内行人剧透！因为它', '开扒OLAY重磅新品！真实', '天选淡纹嫩脸一用一', 'OLAY今年太炸街！抗老领', 'OLAY实验室线放大', '求你推推专业线', '300内大牌还有不讲故', '300元抗老精华效果媲美', '方圆阔面脸上镜技巧！状态', '李佳琦：OLAY新品精华憋大', '在出片这件事上，我已经ne', '抗老圈新晋收割机？谁给的', 'vocal！olay新品抗老精华', 'OLAY淡纹黑管精华！抗老', '纹路多快看！被黑化的', 'Olay黑管精华！！！', '猛药的苦，我真吃不了一点 只想躺平抗老', '要买抗老精华的你先别急！先看看李佳琦...', '抗老精华届的淡纹杀手锏来了，淡纹太狠了！', '变美必看！肯豆越来越年轻，全靠做这件事？', '噜噜闪现！你的电子闺蜜已上线', '别挣扎了！这11瓶抗老精华你肯定早晚得买！', '硬核抗老精华大盘点！买对不买贵！不花冤枉钱', '好嘛！你俩联名叫纹路瑕疵消除笔吧！', '淡纹嫩肤，还是要挑专业的！！', '敏皮狂喜! 希望所有敏皮姐妹都刷到这篇', '淡纹很牛？？实测28天说点实话！糙皮速进！！', '啊？它是有什么淡纹牛b症吧！！', '抗初老躺赢护肤公式！班味脸爆改抛光级嫩脸', 'A醇精华入门到进阶盘点！不同诉求怎么选？', '法令纹都隐形了 这抗老精华把我整懵了', '抗老高端局！那些配方师眼里逆天的抗老精华', '姐拿捏透亮嫩脸的人生！易如反掌~', '28天实测打卡！法令纹就这样水灵灵地淡了?', '炸了！7.31李佳琦直播间上OLAY新品精华，速来', '近期先别买精华！31号李佳琦直播间准备开大！', '花钱总结的！25+第一瓶抗老精华怎么选？', '别挣扎了！这11瓶抗老精华你肯定早晚得买！'], '精华推荐': ['2天就见效!? 什么抗', 'OLAY新品来势汹汹？我倒要', '抗老界终于出了能燃起我', '抗老圈来成分新兵了', 'Olay有种把同行逼疯的帅', 'OLAY最伟大的单品出', '硬核抗老三巨头都在一', '内行人大跌眼镜，抗老圈', '内行人剧透！因为它', '开扒OLAY重磅新品！真实', '天选淡纹嫩脸一用一', 'OLAY今年太炸街！抗老领', 'OLAY实验室线放大', '求你推推专业线', '300内大牌还有不讲故', '300元抗老精华效果媲美', '方圆阔面脸上镜技巧！状态', '李佳琦：OLAY新品精华憋大', '在出片这件事上，我已经ne', '抗老圈新晋收割机？谁给的', '脸蛋嫩到打滑！宛如天', '这玩意嫩脸事业心好重', '猛药的苦，我真吃不了一点 只想躺平抗老', '要买抗老精华的你先别急！先看看李佳琦...', '抗老精华届的淡纹杀手锏来了，淡纹太狠了！', '变美必看！肯豆越来越年轻，全靠做这件事？', '噜噜闪现！你的电子闺蜜已上线', '别挣扎了！这11瓶抗老精华你肯定早晚得买！', '硬核抗老精华大盘点！买对不买贵！不花冤枉钱', '好嘛！你俩联名叫纹路瑕疵消除笔吧！', '淡纹嫩肤，还是要挑专业的！！', '敏皮狂喜! 希望所有敏皮姐妹都刷到这篇', '淡纹很牛？？实测28天说点实话！糙皮速进！！', '啊？它是有什么淡纹牛b症吧！！', '抗初老躺赢护肤公式！班味脸爆改抛光级嫩脸', 'A醇精华入门到进阶盘点！不同诉求怎么选？', '法令纹都隐形了 这抗老精华把我整懵了', '抗老高端局！那些配方师眼里逆天的抗老精华', '姐拿捏透亮嫩脸的人生！易如反掌~', '28天实测打卡！法令纹就这样水灵灵地淡了?', '炸了！7.31李佳琦直播间上OLAY新品精华，速来', '近期先别买精华！31号李佳琦直播间准备开大！', '花钱总结的！25+第一瓶抗老精华怎么选？', '别挣扎了！这11瓶抗老精华你肯定早晚得买！'], '隐形眼镜推荐': ['隐形眼镜'], '水梯度': ['hey 朋友！好久不见', '618购物指南！手把手教你', '别因为戴错隐形眼镜损伤', '来新加坡充电啦', '“师味”到底是什么', '夏日清透感的秘诀'], '爱尔康轻澈': ['答辩前的忙里偷', 'hey 朋友！好久不见', '一篇讲透怎么选日抛隐形', '大小姐现实版爽文女主', '618购物指南！手把手教你', '隐形眼镜死磕材质早不够了！含', '手把手教你如何挑选日抛隐', '别因为戴错隐形眼镜损伤', '隐形眼镜选、戴、摘保姆', '什么？！原来隐形眼镜已经', '近视850度的人', '不会只有我每次组会前后', '伦敦独居生'], '爱尔康': ['答辩前的忙里偷', 'hey 朋友！好久不见', '一篇讲透怎么选日抛隐形', '大小姐现实版爽文女主', '618购物指南！手把手教你', '隐形眼镜死磕材质早不够了！含', '手把手教你如何挑选日抛隐', '别因为戴错隐形眼镜损伤', '隐形眼镜选、戴、摘保姆', '什么？！原来隐形眼镜已经', '近视850度的人', '不会只有我每次组会前后', '伦敦独居生'], '爱尔康散光': ['散光星人自救，和框架眼镜'], '爱尔康日抛': ['答辩前的忙里偷', 'hey 朋友！好久不见', '一篇讲透怎么选日抛隐形', '大小姐现实版爽文女主', '618购物指南！手把手教你', '隐形眼镜死磕材质早不够了！含', '手把手教你如何挑选日抛隐', '别因为戴错隐形眼镜损伤', '隐形眼镜选、戴、摘保姆', '什么？！原来隐形眼镜已经', '近视850度的人', '不会只有我每次组会前后', '伦敦独居生'], '日抛隐形': ['答辩前的忙里偷', 'hey 朋友！好久不见', '一篇讲透怎么选日抛隐形', '大小姐现实版爽文女主', '618购物指南！手把手教你', '隐形眼镜死磕材质早不够了！含', '手把手教你如何挑选日抛隐', '别因为戴错隐形眼镜损伤', '隐形眼镜选、戴、摘保姆', '什么？！原来隐形眼镜已经', '近视850度的人', '不会只有我每次组会前后', '伦敦独居生'], '儿童补钙': ['钙'], '倍顿dha': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], 'dha推荐': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], 'dha测评': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], '纽曼思dha': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], '婴儿dha': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], '宝宝dha': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], '藻油dha': ['都没人敢说真话是吧？DH', '纠结宝妈买前必看', '6款热门宝宝DHA', '两岁女儿的午餐', '宝宝DHA不要盲目补', '2款热门DHA测', '多维度！6款热门婴儿D'], 'dha': ['dha'], '德慕肤': ['do脸修护事半功倍！后悔没早点知', '多数人不知道的修护信息差', '太喜欢自己现在的皮', '皮肤会惩罚每一个作息不规', '惊到我了，随手挖的', '巨巨巨好', '冷门小众，出奇', '我已不是当年的我！从此爆皮', '敏敏面霜教科书！有被它的', '干敏肌千万别认命', '超好用面霜推', '干敏肌挚爱面霜', '就在身边的信息差！敏敏干', '好用不贵！干敏皮有救', '一到春天脸就又红又痒，还好', '又到了换季敏感的季'], '防脱精华': ['到底还有谁不知道这个', '钱就应该花在这种'], '防脱洗发水': ['吹爆！发量疯涨啊', '这洗发水真没白用！再', '细软塌爆改金毛狮王', '这个世界没有能炸'], '发膜推荐': ['干枯稻草头回春术', '跟稻草枯发战斗多年', '好用炸！头发柔顺有'], '控油洗发水推荐': ['油头三天不洗头还可'], '洁玉': ['在仲夏之夜，用一条浴', '这个夏天 遇见了 Crus', '一场清爽沐浴，带来', '轻柔触感 带来夏日', '挖到宝了！我的人', '我好会买！建议有'], '洁玉浴巾': ['这个夏天 遇见了 Crus', '一场清爽沐浴，带来', '轻柔触感 带来夏日', '挖到宝了！我的人', '我好会买！建议有', '要和小姐妹去海边游玩', '宝妈们，梅雨季节', '备齐夏季玩水装备'], '儿童浴巾': ['我好会买！建议有', '要和小姐妹去海边游玩', '宝妈们，梅雨季节'], '抗老精华': ['开扒OLAY重磅新品！真', '2天就见效!? 什么抗老', '汗流浃背！OLAY跻身抗老', '还好有人整活，差点对今年', '敏肌抗老仙品! 纹路真的', 'OLAY最伟大的单品出', '硬核抗老三巨头都在一', '内行人大跌眼镜，抗老圈', '内行人剧透！因为它', '开扒OLAY重磅新品！真实', '天选淡纹嫩脸一用一', 'OLAY今年太炸街！抗老领', '求你推推专业线', '300内大牌还有不讲故', '300元抗老精华效果媲美', '方圆阔面脸上镜技巧！状态', '李佳琦：OLAY新品精华憋大', '在出片这件事上，我已经ne', '抗老圈新晋收割机？谁给的', 'vocal！olay新品抗老精华', '2周淡纹的抗', '我官宣啦！我要和这', '颠覆抗老界！法令纹眼', 'olay黑化后下手真', '有点理解它为什么能', '抗老精华届的淡纹杀手锏', '想赶走纹路用', '深纹脸重生水灵灵嫩脸！', '靠抗老精华真的能', '要买抗老精华的你先别急！先看看李佳琦...', '抗老精华届的淡纹杀手锏来了，淡纹太狠了！', '变美必看！肯豆越来越年轻，全靠做这件事？', '噜噜闪现！你的电子', '别挣扎了！这11瓶抗老精华', '花钱总结的！25+第一瓶抗']};
    var runAppName = "com.xingin.xhs";
    print(device.name + "---开始采集搜索");
    for (var keyword in keyDict) {
        for (var i = 0; i < 3; i++) {
            try {
                var runapp = device.runApp(runAppName);
                if (runapp === 0) {
                    ret = get_Activity();

                    print(device.name + "---" + keyword + "---开始");
                    delay(1500);  //1、缩短1500ms
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
                1500);
        }

        delay(randomNum(1000, 3000));
        let detailActivity3 = get_Activity();
        //  判断是否为详情页
        if (detailActivity3.indexOf("search") === -1) {
            actionWithRetry(
                () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                3,
                1500);
            delay(1000);
        } // 选定内容页面
    } else {
        if (detailType === "1") {
            for (let ii = 0; ii < randomNum(2, 3); ii++) {
                delay(randomNum(1000, 3000));
                actionWithRetry(
                    () => moveFunction(tcConst.movement.shiftRight),
                    3,
                    1500);
                delay(1000);
                let authorPage = actionWithRetry(
                    () => sendAaiFunction("T:*获赞与收藏*", "getBounds"),
                    3,
                    1500);
                if (authorPage) {
                    delay(1000);
                    actionWithRetry(
                        () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                        3,
                        1500);
                    break;
                }
            }
            for (let i = 0; i < randomNum(4, 6); i++) {
                delay(randomNum(5000, 10000));
                actionWithRetry(
                    () => moveFunction(tcConst.movement.shiftDown),
                    3,
                    1500);
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
    for (var kk = 0; kk < 3; kk++) {
        var deviceText = device.sendAai({
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
function checkErrors() {
    checkNetError();
    checkDeviceError();
    checkAccountError();
}


function clickNoteByTitle(keyTitle, keyword) {
    let flag = false;
    var tt = false;
    bijIds = "";
    keyTitle2 = keyTitle.split("&&");
    try{
      var img = device.sendAai({query: "T:*" + keyTitle2[0] + "*",action: "getBounds"});
      if(img){
          if(keyTitle2.length !== 1){
              outerLoop:
              for(let i = 0;i < img.ids.length;i++){
                  for(let j = 0;j < 2;j ++){
                    let t = t = device.sendAai({ query: "ID:" + img.ids[i], action: "getText" });
                        if (t && t.retval.indexOf(keyTitle2[1]) !== -1) {
                            bijIds = img.ids[i];
                            break outerLoop;
                        }
                }
            }
        }else{
            bijIds = img.ids[0];
        }
    }
  }catch (err){
    checkErrors();
    printf("ERROR")
  }
    if (bijIds) {
        delay(500);
        if (img.bounds[0][1] < 200) {
            tt = true;
            actionWithRetry(
                () => moveFunction(tcConst.movement.shiftUp),
                3,
                1500);
            delay(1000);
        }
        actionWithRetry(
            () => sendAaiFunction("ID:" + bijIds,
                "click"),
            3,
            1500);
        delay(randomNum(6500, 8500)); //缩短延迟时间
        checkNetError();
        checkDeviceError();
        delay(randomNum(6500, 8500));
        var author = actionWithRetry(
            () => sendAaiFunction("C:.TextView&&R:.nickNameTV",
                "getText"),
            3,
            1500);
        var detailActivity = get_Activity();
        //  判断是否为详情页
        if (detailActivity.indexOf("search.GlobalSearchActivity") === -1) {
            try {
                if (detailActivity.indexOf("notedetail.NoteDetailActivity") !== -1) {
                    personateDetail("1");
                    actionWithRetry(
                        () => moveFunction(tcConst.movement.shiftDown),
                        3,
                        1500);
                    // 标题
                    var title = actionWithRetry(
                        () => sendAaiFunction("C:.TextView&&R:.d44",
                            "getText"),
                        3,
                        1500);
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
                            1500);
                        if (author) {
                            break;
                        }
                    }
                    // 标题
                    var title = actionWithRetry(
                        () => sendAaiFunction("C:.TextView&&R:.noteContentText",
                            "getText"),
                        3,
                        1500);
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
                        1500);
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
            1500);
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
        // let startTime = Date.now();
        for (let z = titles.length - 1; z >= 0; z--) {
            if (clickNoteByTitle(titles[z], keyword)) {
                titles.splice(z, 1);
            }
        }
      //   let endTime = Date.now();
      // let duration = endTime - startTime; // 计算时间差
      //   printf(device.name + "代码执行了" + duration/1000 + "毫秒");
        // 当读完时退出i循环
        if (titles.length === 0) {
            break;
        }
        // 下滑
        actionWithRetry(
            () => moveFunction(tcConst.movement.shiftDown),
            3,
            1500);
            //删除缩短时间
    }
    print(device.name + "关键词:" + keyword + " 已经完成:" + finishedTitles + "  未完成:" + titles );
}

function run(keyword) {
    if (get_Activity().indexOf("update") !== -1) {
        actionWithRetry(
            () => sendAaiFunction("C:.ImageView&&R:.az9",
                "click"),
            3,
            1500);
    }
    for (let i = 0; i < 3; i++) {
        try {
            if (get_Activity().indexOf("index") !== -1) {
                actionWithRetry(
                    () => clickFunction(970, 140, tcConst.STATE_PRESS),
                    3,
                    1500);
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
                1500);
            if (enterKeyword === true && searchText.retval === keyword) {
                delay(1000);
                // 点击搜索按钮
                actionWithRetry(
                    () => sendAaiFunction("T:*搜索*",
                        "click"),
                    3,
                    1500);
                // 滑动页面
                delay(1000);
                let startTime = Date.now();
                searchKeyword(keyDict[keyword], keyword);
                let endTime = Date.now();
                let duration = endTime - startTime; // 计算时间差
                printf(device.name + "关键词——" + keyword+"代码执行了——" + duration/1000 + "秒");
                break;
            } else {
                delay(500);
                actionWithRetry(
                    () => sendFunction(tcConst.keyCodes.KEYCODE_BACK, tcConst.STATE_PRESS),
                    3,
                    1500);
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
