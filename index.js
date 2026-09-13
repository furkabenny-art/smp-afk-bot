const mineflayer = require('mineflayer');

// Настройки подключения бота под твой сервер
const botOptions = {
  host: 'verdictsmp.mcsh.io',
  port: 25565,
  username: 'Bot240',
  version: '1.21.1', // Жестко фиксируем версию под Purpur 1.21.1
  
  // --- ЗАЩИТА ОТ EXIT CODE 228 (ОПТИМИЗАЦИЯ ДЛЯ BOT-HOSTING.COM) ---
  hideErrors: true,           // Отключает спам ошибок в консоль хостинга
  loadInternalPlugins: false  // Выключает тяжелые физические плагины mineflayer для экономии ОЗУ
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  // Скрипт очистки памяти: заставляем бота мгновенно забывать чанки от плагина Chunky
  bot.on('inject_allowed', () => {
    if (bot.world) {
      bot.world.getColumns = () => [];
    }
  });

  // Действия при успешном заходе на сервер
  bot.once('spawn', () => {
    console.log('Бот Bot240 успешно зашел на verdictsmp.mcsh.io!');
    
    // Автоматически выдаем боту креатив при каждом заходе (чтобы не кикало за АФК)
    setTimeout(() => {
      bot.chat('/gamemode creative');
    }, 2000); // Небольшая задержка в 2 секунды перед отправкой команды
  });

  // Защита от рестартов сервера (авто-перезаход через 10 секунд при вылете)
  bot.on('end', () => {
    console.log('Бот отключился от сервера. Перезапуск процесса через 10 секунд...');
    setTimeout(createBot, 10000);
  });

  // Ловим сетевые ошибки, чтобы бот не крашился в консоли
  bot.on('error', (err) => {
    console.log('Сетевая ошибка бота (игнорируется):', err.message);
  });
}

// Запуск бота
createBot();
