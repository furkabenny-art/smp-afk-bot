const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'verdictsmp.mcsh.io',
  port: 25565,
  username: 'Bot240',
  version: '1.21.1',
  hideErrors: true
});

// Безопасный способ отключить сохранение чанков, чтобы не забивать ОЗУ хостинга
bot.on('inject_allowed', () => {
  if (bot.world && bot.world.getColumns) {
    bot.world.getColumns = () => [];
  }
});

// При успешном заходе в мир
bot.once('spawn', () => {
  console.log('Бот зашел на verdictsmp.mcsh.io!');
  
  // Автоматически пишем /gamemode creative через 3 секунды
  setTimeout(() => {
    bot.chat('/gamemode creative');
  }, 3000);
});

// Если бота кикнуло — этот простой скрипт просто перезапустит сам файл
bot.on('end', () => {
  console.log('Отключение от сервера. Перезапуск...');
  process.exit(0); // Хостинг сам автоматически поднимет бота заново при выходе процесса
});

bot.on('error', (err) => {
  console.log('Игнорируемая сетевая ошибка:', err.message);
});
