import os
from traceback import format_exc, print_exc

from selenium import webdriver
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.core.driver_cache import DriverCacheManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
from rich import print

from Logger import log


class Webdriver:
    def __init__(self, platform):
        self.driver_path = ""
        self.options = None
        self.service = None
        self.manager = None
        self.platform = platform
        self.init_webdriver()

    def create_driver_instance(self):
        driver_instance = webdriver.Chrome(service=self.service, options=self.options)
        try:
            driver_instance.set_window_size(960, 768)
            driver_instance.set_window_position(0, 0)
            if self.platform == "聚光":
                driver_instance.get('https://ad.xiaohongshu.com/')
            elif self.platform == "蒲公英":
                driver_instance.get('https://pgy.xiaohongshu.com/')
        except Exception:
            print_exc()
            log.error(format_exc())
            exit()
        return driver_instance

    def init_webdriver(self):
        try:
            print("准备中...")
            log.info("准备中...")
            custom_path = ".\\driver"
            edge_chromium_driver_manager = EdgeChromiumDriverManager(cache_manager=DriverCacheManager(custom_path))
            self.driver_path = edge_chromium_driver_manager.install()
            self.options = self.add_webdriver_options(webdriver.EdgeOptions())
            self.service = EdgeService(self.driver_path)
        except Exception:
            log.error(format_exc())
            print_exc()

    def add_webdriver_options(self, options):
        current_directory = os.getcwd()
        if self.platform == "聚光":
            download_directory = os.path.join(current_directory, 'juguangData')
        elif self.platform == "蒲公英":
            download_directory = os.path.join(current_directory, 'pugongyingData')
        else:
            download_directory = os.path.join(current_directory, '')
        prefs = {
            "credentials_enable_service": False,
            'profile.default_content_setting_values': {
                'notifications': 2
            },
            'profile.default_content_settings.popups': 0,
            'download.default_directory': download_directory
        }
        options.add_experimental_option('prefs', prefs)
        options.add_argument("--disable-extensions")
        options.add_argument("--disable-gpu")
        options.add_experimental_option("excludeSwitches", ["enable-logging"])
        options.add_argument('disable-infobars')
        options.add_argument("--start-maximized")
        options.add_argument("--disable-gpu-shader-disk-cache")
        options.add_argument("--disable-application-cache")
        options.add_argument("--disable-cache")
        if self.platform == '蒲公英':
            options.add_argument("--headless")
            options.add_argument("--no-sandbox")
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.41"
        options.add_argument(f'user-agent={user_agent}')
        return options
