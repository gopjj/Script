import json
import os
import re
import datetime
import xlwt
import time
import xlrd


def clean_data():
    content_dict = {}
    sj_id_dict = {}
    # 获取当前日期
    current_date = datetime.datetime.now()
    # 格式化输出包括年份的日期
    new_time2 = current_date.strftime("%Y.%m.%d").replace('.0', '.')
    for file_name in os.listdir('logData/'):
        if new_time2 not in file_name:
            continue
        device_id_result = re.search(r'((K|C|B|A|D|E|F)\d+)|(\d+(K|C|B|A|D|E|F))|(-[\dA-Za-z]{2,4}_?)', file_name)
        if device_id_result.group(1) is not None:
            device_id = device_id_result.group(1)
        else:
            device_id = device_id_result.group(3)
        print("清洗文件名:" + file_name, "来自:" + device_id, "日期:" + new_time2)
        with open('logData/{}'.format(file_name), 'r', encoding='utf-8') as f:
            r = f.read()
        bij_list = r.replace('          ', '').replace('"', '').split('-' * 30)
        con_item = {}
        for i, detail_content in enumerate(bij_list):
            if detail_content:
                detail_content = re.sub(r"\w+(')\w+", '', detail_content)
                detail_info = detail_content.split('*' * 20)
                detail_item = detail_info[0].replace('\n', '').replace(": '", "': '").replace("', ", "', '").replace(
                    '{', "{'").replace("'", '"')
                try:
                    if 'str' in str(type(detail_item)):
                        detail_item = detail_item.replace('""', '')
                        detail_info_dict = json.loads(detail_item)
                except Exception as e:
                    print(detail_info)
                    continue
                content = detail_info[1].replace('\n', '')
                for x in ['Alobaby', 'Femibion', 'New Chapter', 'OLAY', 'OLAYPCC', '丰添', '护舒宝']:
                    if x in content:
                        brand = x
                        break
                else:
                    brand = '无'
                detail_time = time.strftime("%Y-%m-%d", time.localtime())
                detail_title = detail_info_dict.get('title', '')
                detail_author = detail_info_dict.get('author', '')
                detail_like = detail_info_dict.get('like', '')
                if detail_like == '点赞':
                    detail_like = '0'
                if '万' in detail_like:
                    detail_like = str(int(float(detail_like.replace('万', '')) * 10000))
                detail_collect = detail_info_dict.get('collect', '').replace('undefined', '')
                if detail_collect == '收藏':
                    detail_collect = '0'
                if '万' in detail_collect:
                    detail_collect = str(int(float(detail_collect.replace('万', '')) * 10000))
                detail_comment = detail_info_dict.get('comment', '').replace('undefined', '')
                if detail_comment == '评论':
                    detail_comment = '0'
                if '万' in detail_comment:
                    detail_comment = str(float(detail_comment.replace('万', '')) * 10000)
                detail_key = detail_info_dict.get('keyword', '0').replace('undefined', '')
                fenss = detail_info_dict.get('fenss', '0').replace('undefined', '')
                if '万' in fenss:
                    fenss = str(float(re.search(r'[\d.]+', fenss).group()) * 10000)
                else:
                    fenss = re.search(r'[\d.]+', fenss).group() if re.search(r'[\d.]+', fenss) else '0'
                if fenss != 'null':
                    con_item[detail_title] = fenss
                else:
                    fenss = con_item.get(detail_title, 'null')
                if float(fenss) <= 50000:
                    kol_koc = 'KOC'
                else:
                    kol_koc = 'KOL'
                con_time = detail_info_dict.get('con_time', '').replace('null', '').replace('-', '.')
                if con_time:
                    new_time = time.strftime("%Y.%m.%d", time.localtime())[-4:]
                    if '昨天' in con_time:
                        con_time = time.strftime("%Y.%m.%d", time.localtime())[:-2] + str(int(new_time[-2:]) - 1)
                    elif '前天' in con_time:
                        con_time = time.strftime("%Y.%m.%d", time.localtime())[:-2] + str(int(new_time[-2:]) - 2)
                    elif '今天' in con_time:
                        con_time = time.strftime("%Y.%m.%d", time.localtime())
                    else:
                        try:
                            con_time = re.search(r'[-\d.]+', con_time).group()
                            if con_time != '0' and con_time.count('.') == 1:
                                con_time = '2023.' + con_time
                        except Exception as e:
                            print(e)
                            con_time = ''
                fenxlj = detail_info_dict.get('get_copy', '')
                if fenxlj and 'http' in fenxlj:
                    if not fenxlj.startswith('http'):
                        if fenxlj != '0':
                            fenxlj = re.search(r'(http.+?)，', fenxlj).group(1)
                else:
                    continue
                note_type = detail_info_dict.get('note_type', '')
                bijqk = '未收录'
                sbcs = 0
                if content_dict.get(detail_key):
                    if not sj_id_dict[detail_key].get(device_id):
                        sj_id_dict[detail_key][device_id] = 0
                    sj_id_dict[detail_key][device_id] = sj_id_dict[detail_key][device_id] + 1
                    kpi = 1 if sj_id_dict[detail_key][device_id] <= 12 else 0
                    content_dict[detail_key] = content_dict[detail_key] + [
                        {'sort': sj_id_dict[detail_key][device_id], 'detail_title': detail_title,
                         "detail_author": detail_author, "detail_like": detail_like, "detail_collect": detail_collect,
                         "detail_comment": detail_comment, 'detail_key': detail_key, 'content': content,
                         'device_id': device_id,
                         'fenss': fenss, 'fenxlj': fenxlj, 'con_time': con_time, 'detail_time': detail_time,
                         'note_type': note_type,
                         'brand': brand, 'key': detail_key, 'KPI(TOP12)': kpi, 'KOL/KOC': kol_koc, 'bijqk': bijqk,
                         'sbcs': sbcs}]
                else:
                    sj_id_dict[detail_key] = {}
                    sj_id_dict[detail_key][device_id] = 1
                    content_dict[detail_key] = [
                        {'sort': sj_id_dict[detail_key][device_id], 'detail_title': detail_title,
                         "detail_author": detail_author,
                         "detail_like": detail_like, "detail_collect": detail_collect,
                         "detail_comment": detail_comment, 'detail_key': detail_key,
                         'content': content, 'device_id': device_id, 'fenss': fenss, 'fenxlj': fenxlj,
                         'con_time': con_time, "detail_time": detail_time,
                         'note_type': note_type,
                         'brand': brand, 'key': detail_key, 'KPI(TOP12)': 1, 'KOL/KOC': kol_koc,
                         'bijqk': bijqk, 'sbcs': sbcs}]
    content_ls = []
    for x in content_dict.values():
        for i in x:
            content_ls.append(i)
    return content_ls


def write_file(content_ls):
    # 指定file以utf-8的格式打开
    file = xlwt.Workbook(encoding='utf-8')
    table = file.add_sheet('Sheet1', cell_overwrite_ok=True)
    info_list = [['排名', '笔记标题', '达人名称', '喜欢', '收藏', '评论', '关键词', '正文', '手机', '粉丝', '笔记链接',
                  '发布时间',
                  '采集时间', '笔记类型', '品牌', '关键词', 'KPI(TOP12)', 'KOL/KOC', '笔记情况', '上榜次数']] + [
                    list(x.values()) for x in content_ls]
    for i, p in enumerate(info_list):
        # 将数据写入文件,i是enumerate()函数返回的序号数
        for j, q in enumerate(p):
            if j < 20:
                table.write(i, j, q)
    file.save('./{}_{}.xlsx'.format('小红书采集', time.strftime("%Y.%m.%d", time.localtime())))
    print("清洗后表格文件存储在D:/xhsData/logData/" + "小红书采集_" + time.strftime("%Y.%m.%d",
                                                                                    time.localtime()) + ".xlsx")


if __name__ == '__main__':
    content_dict = clean_data()
    write_file(content_dict)
