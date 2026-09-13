const mineflayer = require('mineflayer');

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

  // Блокируем кэш чанков плагина Chunky, чтобы экономить ОЗУ
  bot.on('inject_allowed', () => {
    if (bot.world && bot.world.getColumns) {
      bot.world.getColumns = () => [];
    }
  });

  // Успешный спавн и автоматическая авторизация
  bot.once('spawn', () => {
    console.log('Бот Bot240 успешно зашел на сервер!');
    
    // Автоматически пишем пароль в чат через 1.5 секунды
    setTimeout(() => {
      bot.chat('/login bot1203');
    }, 1500); 

    // Выдаем креатив через 4 секунды после логина
    setTimeout(() => {
      bot.chat('/gamemode creative');
    }, 4000);
  });

  // Идеальный авто-перезаход: если сервер рестартнется, бот сам зайдет через 10 секунд
  bot.on('end', () => {
    console.log('Бот отключился. Мягкий перезапуск через 10 секунд...');
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
