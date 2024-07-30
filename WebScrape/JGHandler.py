import os
from datetime import datetime
import time
import random
from time import sleep
from traceback import print_exc, format_exc

import pandas as pd
from rich import print
from selenium.common import TimeoutException
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains

from Utils import detect_new_file
from Logger import log


# 数据文件夹路径为当前路径下的juguangData文件夹
class JGHandler:
    def __init__(self, driver, keyword_list) -> None:
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)
        self.username = "shuyi001@foodigigroup.com"
        self.password = "FOO@shuyi01"
        self.keyword_list = keyword_list

    def login(self) -> bool:
        try:
            login_enter_button = self.wait.until(ec.presence_of_element_located(
                (By.XPATH, "//div[contains(text(), '账号登录')]")))
            self.driver.execute_script("arguments[0].click();", login_enter_button)
            username_input = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='邮箱']")))
            for character in self.username:
                username_input.send_keys(character)
                time.sleep(random.uniform(0.02, 0.1))
            password_input = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='密码']")))
            for character in self.password:
                password_input.send_keys(character)
                time.sleep(random.uniform(0.02, 0.1))
            submit_button = self.wait.until(ec.element_to_be_clickable(
                (By.CSS_SELECTOR, "span[class='btn-content']")))
            self.driver.execute_script("arguments[0].click();", submit_button)

        except TimeoutException:
            print_exc()
            log.error(format_exc())
            return False
        return True

    def download_merge(self) -> bool:
        predict_word_dataframe = pd.DataFrame()
        upstream_and_downstream_dataframe = pd.DataFrame()
        current_date = datetime.now()
        current_directory = os.getcwd()
        download_dir = os.path.join(current_directory, 'juguangData')
        now_time = current_date.strftime("%Y.%m.%d").replace('.0', '.')
        try:
            self.wait.until(ec.presence_of_element_located(
                (By.XPATH, "//span[contains(text(), '聚光账户余额')]")))
            self.driver.get("https://ad.xiaohongshu.com/aurora/ad/tools/keywordTool")
            predict_button = self.wait.until(ec.presence_of_element_located(
                (By.XPATH,
                 "/html/body/div[1]/div/div[2]/div[4]/div[2]/div[2]/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div/h6[1]/span")))
            self.driver.execute_script("arguments[0].click();", predict_button)
            search_input = self.wait.until(ec.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='请输入业务相关词以获取关键词']")))

            for keyword in self.keyword_list:
                print(f"{keyword}以词推词开始下载")
                self.driver.execute_script("arguments[0].value = '';", search_input)
                sleep(1)
                search_input.send_keys(keyword)
                search_button = self.wait.until(ec.presence_of_element_located(
                    (By.XPATH,
                     "/html/body/div[1]/div/div[2]/div[4]/div[2]/div[2]/div/div[1]/div[4]/div[1]/div[1]/div[1]/div[2]/button")))
                self.driver.execute_script("arguments[0].click();", search_button)
                download_button = self.wait.until(ec.presence_of_element_located(
                    (By.XPATH,
                     "/html/body/div[1]/div/div[2]/div[4]/div[2]/div[2]/div/div[1]/div[4]/div[1]/div[1]/div[2]/span[1]")))

                new_files = detect_new_file(self.driver, download_dir, download_button)
                if new_files:
                    downloaded_file = new_files[0]
                    downloaded_path = os.path.join(download_dir, downloaded_file)
                    data_frame = pd.read_csv(downloaded_path)
                    data_frame.insert(0, '搜索词', keyword)
                    predict_word_dataframe = pd.concat([predict_word_dataframe, data_frame], ignore_index=True)
                    os.remove(downloaded_path)
                print(f"{keyword}以词推词完成下载")
                log.info(f"{keyword}以词推词完成下载")
                print(f"{keyword}上下游推词开始下载")
                log.info(f"{keyword}上下游推词开始下载")
                upstream_and_downstream_button = self.wait.until(ec.presence_of_element_located(
                    (By.XPATH,
                     "/html/body/div[1]/div/div[2]/div[4]/div[2]/div[2]/div/div[1]/div[4]/div[1]/div[1]/div[1]/div[1]/div/div[2]")))
                self.driver.execute_script("arguments[0].click();", upstream_and_downstream_button)
                self.driver.execute_script("arguments[0].value = '';", search_input)
                sleep(1)
                search_input.send_keys(keyword)
                self.driver.execute_script("arguments[0].click();", search_button)
                new_files = detect_new_file(self.driver, download_dir, download_button)
                if new_files:
                    downloaded_file = new_files[0]
                    downloaded_path = os.path.join(download_dir, downloaded_file)
                    data_frame = pd.read_csv(downloaded_path)
                    data_frame.insert(0, '搜索词', keyword)
                    upstream_and_downstream_dataframe = pd.concat([upstream_and_downstream_dataframe, data_frame],
                                                                  ignore_index=True)
                    os.remove(downloaded_path)
                predict_button = self.wait.until(ec.presence_of_element_located(
                    (By.XPATH,
                     "/html/body/div[1]/div/div[2]/div[4]/div[2]/div[2]/div/div[1]/div[4]/div[1]/div[1]/div[1]/div[1]/div/div[1]")))
                self.driver.execute_script("arguments[0].click();", predict_button)
                print(f"{keyword}上下游推词完成下载")
                log.info(f"{keyword}上下游推词完成下载")
            predict_word_dataframe.to_csv(
                os.path.join(download_dir, f'{self.keyword_list}_{now_time}_以词推词数据汇总.csv'), index=False)
            print(f"以词推词完成汇总")
            log.info(f"以词推词完成汇总")
            upstream_and_downstream_dataframe.to_csv(
                os.path.join(download_dir, f'{self.keyword_list}_{now_time}_上下游推词数据汇总.csv'), index=False)
            print(f"上下游推词完成汇总")
            log.info(f"上下游推词完成汇总")
        except TimeoutException:
            print_exc()
            log.error(format_exc())
            return False
        return True
