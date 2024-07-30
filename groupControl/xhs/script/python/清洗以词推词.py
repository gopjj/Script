import os
import pandas as pd
from datetime import datetime
# 数据文件夹路径，.为当前文件夹
folder_path = '.'

# 在此处输入需要的词
keyword_list = ['修复面膜', '美白面膜', 'ysl精华']

result_data = []
current_date = datetime.now().strftime("%Y-%m-%d")

for file in os.listdir(folder_path):
    search_word = file.split('_')[0]
    if file.endswith('以词推词数据汇总.csv'):
        print(file)
        date = file.split('_')[1]
        file_path = os.path.join(folder_path, file)
        data_frame = pd.read_csv(file_path)

        for _, row in data_frame.iterrows():
            if row['关键词'] in keyword_list:
                result_data.append({
                    '数据时间': date,
                    '关键词': row['关键词'],
                    '推荐理由': row['推荐理由'],
                    '竞争指数': row['竞争指数'],
                    '月均搜索指数': row['月均搜索指数'],
                    '市场出价': row['市场出价'],
                })
result_data_frame = pd.DataFrame(result_data)
result_data_frame.to_csv(f'{keyword_list}汇总月均搜索指数_{current_date}.csv', index=False)
print(f'{keyword_list}汇总月均搜索指数_{current_date}.csv')
