import logging
import time
from logging.handlers import RotatingFileHandler
from pathlib import Path

FILE_SIZE = 1024 * 1024 * 100
BACKUP_COUNT = 5


class Logger:
    @staticmethod
    def create_logger(log_path=Path("./logs/")):
        Path("./logs/").mkdir(parents=True, exist_ok=True)
        Path("./logs/pics/").mkdir(parents=True, exist_ok=True)
        level = logging.INFO
        file_handler = RotatingFileHandler(
            log_path / f"{time.strftime('%Y%m%d_%H%M')}.log",
            mode="a+",
            maxBytes=FILE_SIZE,
            backupCount=BACKUP_COUNT,
            encoding='utf-8'
        )

        logging.basicConfig(
            format="%(asctime)s %(levelname)s: %(message)s",
            level=level,
            handlers=[file_handler],
        )
        logg = logging.getLogger("log")
        logg.info("-" * 50)
        return logg


log = Logger().create_logger()
