const mineflayer = require('mineflayer');

// ГЛОБАЛЬНАЯ ЗАЩИТА: Теперь хостинг не упадет из-за неизвестных пакетов чата 1.21.1
process.on('uncaughtException', (err) => {
  if (err.message.includes('unknown chat format code')) {
    console.log('Был заблокирован кривой JSON-пакет чата от AuthMe/Purpur.');
  } else {
    console.error('Критическая ошибка (перехвачена):', err);
  }
});

// Настройки подключения (ИЗМЕНЕН IP)
const botOptions = {
  host: 'litesnp.mcsh.io',
  port: 25565,
  username: 'Bot240',
  version: '1.21.1',
  hideErrors: true
};

function startBot() {
  const bot = mineflayer.createBot(botOptions);

  // Флаг, чтобы бот не регистрировался повторно во время одной сессии
  let isAuthorized = false;

  // Блокируем кэш чанков плагина Chunky, чтобы экономить ОЗУ
  bot.on('inject_allowed', () => {
    if (bot.world && bot.world.getColumns) {
      bot.world.getColumns = () => [];
    }
  });

  // Умная регистрация и авторизация через отслеживание строк чата
  bot.on('messagestr', (message) => {
    // Если сервер просит зарегистрироваться
    if (message.includes('/reg') || message.includes('зарегистрируйтесь') || message.includes('register')) {
      if (!isAuthorized) {
        isAuthorized = true;
        console.log('AuthMe запросил регистрацию. Регистрируюсь...');
        // Введите свой надежный пароль два раза вместо "YourPassword123"
        bot.chat('/reg YourPassword123 YourPassword123'); 
      }
    }
    
    // Если сервер просит войти (на случай, если бот УЖЕ зарегистрирован на сервере)
    if (message.includes('/login') || message.includes('авторизуйтесь') || message.includes('войдите')) {
      if (!isAuthorized) {
        isAuthorized = true;
        console.log('Бот уже зарегистрирован. Ввожу пароль для входа...');
        bot.chat('/login YourPassword123');
      }
    }

    // Логирование успешного входа
    if (message.includes('успешно') || message.includes('success') || message.includes('Logged in')) {
      console.log('Бот успешно авторизовался и готов к работе!');
    }
  });

  // Спавн бота
  bot.once('spawn', () => {
    console.log('Бот Bot240 заспавнился на сервере litesnp.mcsh.io!');
  });

  // Авто-перезаход: если сервер рестартнется, бот сам зайдет через 10 секунд
  bot.on('end', () => {
    console.log('Бот отключился. Мягкий перезапуск через 10 секунд...');
    isAuthorized = false; // сбрасываем флаг при перезаходе
    setTimeout(startBot, 10000);
  });

  // Ловим ошибки сети, чтобы хостинг не падал
  bot.on('error', (err) => {
    console.log('Игнорируем ошибку подключения:', err.message);
  });
}

// Запуск бесконечного цикла бота
startBot();

// Удерживаем процесс для Render, чтобы статус всегда оставался Live
setInterval(() => {}, 1000 * 60 * 60);
