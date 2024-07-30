import os
from time import sleep


def detect_new_file(driver, download_dir, download_button):
    before = os.listdir(download_dir)
    sleep(5)
    driver.execute_script("arguments[0].click();", download_button)
    sleep(5)
    after = os.listdir(download_dir)
    new_files = [f for f in after if f not in before]
    return new_files
