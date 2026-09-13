const mineflayer = require('mineflayer');

// ГЛОБАЛЬНАЯ ЗАЩИТА: Теперь хостинг не упадет из-за неизвестных пакетов чата 1.21.1
process.on('uncaughtException', (err) => {
  if (err.message.includes('unknown chat format code')) {
    console.log('Был заблокирован кривой JSON-пакет чата от AuthMe/Purpur.');
  } else {
    console.error('Критическая ошибка (перехвачена):', err);
  }
});

// Настройки подключения
const botOptions = {
  host: 'verdictsmp.mcsh.io',
  port: 25565,
  username: 'Bot240',
  version: '1.21.1',
  hideErrors: true
};

function startBot() {
  const bot = mineflayer.createBot(botOptions);

  // Флаг, чтобы бот не пытался выдать себе креатив несколько раз за одну сессию
  let isAuthorized = false;

  // Блокируем кэш чанков плагина Chunky, чтобы экономить ОЗУ
  bot.on('inject_allowed', () => {
    if (bot.world && bot.world.getColumns) {
      bot.world.getColumns = () => [];
    }
  });

  // Умная авторизация через отслеживание строк чата
  bot.on('messagestr', (message) => {
    // Если сервер просит войти, вводим пароль
    if (message.includes('/login') || message.includes('авторизуйтесь') || message.includes('войдите')) {
      console.log('AuthMe запросил авторизацию. Ввожу пароль...');
      bot.chat('/login bot1203');
    }
    
    // Если AuthMe написал, что мы успешно вошли
    if (message.includes('успешно') || message.includes('success') || message.includes('Logged in')) {
      if (!isAuthorized) {
        isAuthorized = true;
        console.log('Успешный логин! Запрашиваю гейммод через 2 секунды...');
        setTimeout(() => bot.chat('/gamemode creative'), 2000);
      }
    }
  });

  // Спавн бота
  bot.once('spawn', () => {
    console.log('Бот Bot240 заспавнился на сервере!');
    
    // Если за 3 секунды сервер НЕ попросил написать /login (значит сработала сессия по IP)
    setTimeout(() => {
      if (!isAuthorized) {
        isAuthorized = true;
        console.log('Похоже, сработала авто-авторизация по IP. Запрашиваю гейммод...');
        bot.chat('/gamemode creative');
      }
    }, 3000);
  });

  // Идеальный авто-перезаход: если сервер рестартнется, бот сам зайдет через 10 секунд
  bot.on('end', () => {
    console.log('Бот отключился. Мягкий перезапуск через 10 секунд...');
    isAuthorized = false; // сбрасываем флаг при перезаходе
    setTimeout(startBot, 10000);
  });

  // Ловим ошибки сети, чтобы хостинг не падал в ошибку
  bot.on('error', (err) => {
    console.log('Игнорируем ошибку подключения:', err.message);
  });
}

// Запуск бесконечного цикла бота
startBot();

// Удерживаем процесс для Render, чтобы статус всегда оставался Live
setInterval(() => {}, 1000 * 60 * 60);
