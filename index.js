const mineflayer = require('mineflayer');

// ЗАЩИТА ОТ КРАША: игнорируем битые пакеты чата 1.21.1
process.on('uncaughtException', (err) => {
  if (err.message.includes('unknown chat format code')) {
    // Тихо игнорируем ошибку формата чата от Purpur/Paper
  } else {
    console.error('Критическая ошибка:', err);
  }
});

// Настройки подключения (Адаптировано под одиночный мир)
const botOptions = {
  host: 'litesmp.mcsh.io',
  port: 25565,
  username: 'Bot240',
  version: '1.21.1',
  hideErrors: true,
  physicsEnabled: false, // Отключаем физику до регистрации, чтобы сервер не кикал за рассинхрон
  viewDistance: 'tiny'   // Минимальная прорисовка для экономии ОЗУ на bot-hosting.com
};

function startBot() {
  const bot = mineflayer.createBot(botOptions);
  let isRegistered = false;

  // Очистка чанков для жесткой экономии ОЗУ
  bot.on('inject_allowed', () => {
    if (bot.world && bot.world.getColumns) {
      bot.world.getColumns = () => [];
    }
  });

  // Моментальная реакция на чат регистрации
  bot.on('messagestr', (message) => {
    if (message.includes('/reg') || message.includes('зарегистрируйтесь') || message.includes('register')) {
      if (!isRegistered) {
        isRegistered = true;
        console.log('---> Обнаружен запрос регистрации! Регистрируюсь...');
        
        // ВАЖНО: Замените YourPassword123 на ваш пароль (вводится два раза через пробел)
        bot.chat('/reg YourPassword123 YourPassword123'); 
        
        // Включаем физику обратно только ПОСЛЕ успешной отправки команды
        setTimeout(() => {
          bot.physicsEnabled = true;
          console.log('Бот успешно отправил команду регистрации и активировал физику.');
        }, 1500);
      }
    }
  });

  bot.once('spawn', () => {
    console.log('Бот подключился к серверу litesnp.mcsh.io. Ожидание пакета регистрации...');
  });

  // Авторестарт при дисконнекте
  bot.on('end', () => {
    console.log('Бот отключился от сервера. Перезапуск через 10 секунд...');
    isRegistered = false;
    setTimeout(startBot, 10000);
  });

  bot.on('error', (err) => {
    console.log('Сетевая ошибка Mineflayer:', err.message);
  });
}

startBot();

// Анти-сон для хостинга
setInterval(() => {}, 1000 * 60 * 60);
