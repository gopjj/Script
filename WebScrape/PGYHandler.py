import os
from datetime import datetime
import time
import random
from time import sleep
from traceback import print_exc, format_exc
from rich import print
from selenium.common import TimeoutException
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
import pandas as pd
from Logger import log


# 数据目录为当前目录下的pugongyingData文件夹
class PGYHandler:
    def __init__(self, driver, excel_name, sheet_name) -> None:
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)
        self.quick_wait = WebDriverWait(driver, 3)
        self.username = "panda.yan@foodigigroup.com"
        self.password = "FOO@888888"
        self.excel_name = excel_name
        self.sheet_name = sheet_name
        self.notes_ids = []

    def login(self) -> bool:
        try:
            print("开始登录")
            log.info("开始登录")
            login_entry_button = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "button[class='login-btn']")))
            self.driver.execute_script("arguments[0].click();", login_entry_button)
            login_button = self.wait.until(ec.presence_of_element_located(
                (By.XPATH, "//div[contains(text(), '账号登录')]")
            ))
            self.driver.execute_script("arguments[0].click();", login_button)
            username_input = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='邮箱']")))
            for character in self.username:
                username_input.send_keys(character)
                time.sleep(random.uniform(0.02, 0.1))
            password_input = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='密码']")))
            password_input.clear()
            password_input.send_keys(self.password)
            sleep(1)
            submit_button = self.wait.until(ec.element_to_be_clickable(
                (By.CSS_SELECTOR, "span[class='btn-content']")))
            self.driver.execute_script("arguments[0].click();", submit_button)

        except TimeoutException:
            print_exc()
            log.error(format_exc())
            return False
        return True

    def scrape(self) -> bool:
        current_date = datetime.now()
        now_time = current_date.strftime("%Y.%m.%d").replace('.0', '.')
        try:
            self.wait.until(ec.presence_of_element_located(
                (By.XPATH, "//span[contains(text(), '工作台')]")))
            print("登录成功")
            log.info("登录成功")
            self.driver.get("https://pgy.xiaohongshu.com/solar/post-trade/content-manage")
            note_input = self.wait.until(ec.presence_of_element_located(
                (By.XPATH,
                 "/html/body/div[1]/div/div/div[2]/div[1]/section/div/div/div/section[1]/div/div[2]/div[6]/div/div/input")))
            notes_data = []
            for note in self.notes_ids:
                note_input.clear()
                note_input.send_keys(note)
                search_button = self.wait.until(ec.presence_of_element_located(
                    (By.XPATH,
                     "/html/body/div[1]/div/div/div[2]/div[1]/section/div/div/div/section[1]/div/div[3]/div[2]/button[1]/div/span")))
                self.driver.execute_script("arguments[0].click();", search_button)
                sleep(7)
                index = self.notes_ids.index(note)
                try:
                    self.quick_wait.until(ec.presence_of_element_located(
                        (By.CSS_SELECTOR, "div[class='d-text --color-text-description d-empty-content']")))
                    # 找不到笔记时的截图，debug用
                    # self.driver.save_screenshot(f"./logs/pics/{now_time}_{note}_no_note.png")
                    print(f"({index+1}/{len(self.notes_ids)}){note}暂无笔记")
                    log.info(f"({index+1}/{len(self.notes_ids)}){note}暂无笔记")
                    continue
                except Exception:
                    print(f"({index+1}/{len(self.notes_ids)}){note}数据爬取中")
                    log.info(f"({index+1}/{len(self.notes_ids)}){note}数据爬取中")
                    pass
                note_exposure = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 12 / 4 / 13;']"))).text
                note_link = "https://www.xiaohongshu.com/explore/" + note
                note_info = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 2 / 4 / 3;']"))).text
                lines = note_info.split('\n')
                note_title = lines[0]
                note_type = lines[1].split(': ')[1]
                note_pageviews = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 13 / 4 / 14;']"))).text
                note_stars = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 20 / 4 / 21;']"))).text
                note_likes = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 23 / 4 / 24;']"))).text
                note_comments = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 22 / 4 / 23;']"))).text
                author_price = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 8 / 4 / 9;']"))).text
                service_price = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 9 / 4 / 10;']"))).text
                is_efficiency_model = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 10 / 4 / 11;']"))).text
                spu_name = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 11 / 4 / 12;']"))).text
                three_seconds_watching_rate_of_video_notes = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 14 / 4 / 15;']"))).text
                three_seconds_reading_rate_of_graphic_notes = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 15 / 4 / 16;']"))).text
                avg_browse_time = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 16 / 4 / 17;']"))).text
                browse_uv = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 17 / 4 / 18;']"))).text
                video_time = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 18 / 4 / 19;']"))).text
                interaction_rate = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 19 / 4 / 20;']"))).text
                interaction = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 21 / 4 / 22;']"))).text
                content_tag = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 7 / 4 / 8;']"))).text
                note_source = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 5 / 4 / 6;']"))).text
                author_info = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 4 / 4 / 5;']"))).text
                publish_time = self.wait.until(ec.presence_of_element_located(
                    (By.CSS_SELECTOR, "div[style^='grid-area: 3 / 6 / 4 / 7;']"))).text
                notes_data.append(
                    [now_time, note_title, note_link, author_info, content_tag,
                     note_type, note_source, publish_time,
                     author_price, service_price, is_efficiency_model, spu_name,
                     three_seconds_watching_rate_of_video_notes, three_seconds_reading_rate_of_graphic_notes,
                     avg_browse_time, browse_uv, video_time,
                     note_exposure, note_pageviews, note_likes, note_stars, note_comments, interaction,
                     interaction_rate])

                print(f"({index+1}/{len(self.notes_ids)})数据爬取成功")
                log.info(f"({index+1}/{len(self.notes_ids)})数据爬取成功")
            data_frame = pd.DataFrame(notes_data,
                                      columns=['采集时间', '笔记标题', '笔记链接', '达人名称(粉丝)', '内容标签',
                                               '笔记类型', '笔记来源', '发布时间', '博主报价', '服务费金额',
                                               '是否为优效模式',
                                               'SPU名称', '视频笔记5s播放率', '图文笔记5s阅读率', '平均浏览时长',
                                               '阅读UV',
                                               '视频总时长', '曝光量', '阅读量', '喜欢',
                                               '收藏', '评论', '互动数', '互动率'])
            data_frame.to_excel(f'./pugongyingData/蒲公英笔记数据_{now_time}.xlsx', index=False)

        except TimeoutException:
            print_exc()
            log.error(format_exc())
            return False
        return True

    def read(self):
        try:
            data_frame = pd.read_excel(self.excel_name, sheet_name=self.sheet_name)
            links = data_frame['笔记链接'].tolist()
            unique_links = set(links)
            self.notes_ids = [link.split('/')[-1] for link in unique_links if isinstance(link, str)]
        except Exception:
            print_exc()
            log.error(format_exc())
            return False
        return True
