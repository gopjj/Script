import os
from time import sleep
from traceback import print_exc, format_exc
from pathlib import Path
from rich import print

from PGYHandler import PGYHandler
from Logger import log
from JGHandler import JGHandler
from Webdriver import Webdriver

# 如需爬取聚光，则输入聚光，如需爬取蒲公英，则输入蒲公英
platform = "聚光"
# 当爬取聚光时需要填写以下关键词
keyword_list = ["面膜", "精华", "口红"]
# 当爬取蒲公英时需要填写爬取的Excel表格名称
excel_name = "4.16 倍顿 RED SEO Daily report.xlsx"
sheet_name = "TTL-rawdata"


def init():
    try:
        Path("./juguangData/").mkdir(parents=True, exist_ok=True)
        Path("./pugongyingData/").mkdir(parents=True, exist_ok=True)
    except Exception:
        print_exc()
        log.error(format_exc())


def main():
    try:
        print("开始")
        log.info("开始")
        driver = Webdriver(platform).create_driver_instance()
        if platform == "聚光":
            handler = JGHandler(driver, keyword_list)
            handler.login() and handler.download_merge()
        else:
            handler = PGYHandler(driver, excel_name, sheet_name)
            handler.read() and handler.login() and handler.scrape()
        print("已完成")
        log.info("已完成")
        driver.quit()
    except Exception:
        print_exc()
        log.error(format_exc())


def quit_all():
    input("输入回车以退出")
    os.kill(os.getpid(), 9)


if __name__ == '__main__':
    try:
        init()
        main()
    except (KeyboardInterrupt, SystemExit):
        quit_all()
    quit_all()
