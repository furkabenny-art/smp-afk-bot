const mineflayer = require('mineflayer')

function createBot() {
  const bot = mineflayer.createBot({
    host: 'verdictsmp.mcsh.io',    // Сюда впиши IP сервера от MCServerHost (без двоеточия и порта)
    port: 25565,                   // Сюда впиши цифры порта (которые после двоеточия)
    username: 'Bot240',    // Ник твоего бота. Зайди под ним сам один раз и пропиши /reg!
    version: '1.21.1'                // Версия твоего сервера
  })

  bot.on('spawn', () => {
    console.log('Бот успешно зашел на сервер!')
    
    // Ждем 3 секунды, пока сервер прогрузит бота, и вводим пароль от авторизации
    setTimeout(() => { 
      bot.chat('/login bot1203') // Замени ТВОЙ_ПАРОЛЬ_ОТ_БОТА на настоящий пароль
    }, 3000)
    
    // Еще через 2 секунды пишем команду /afk, чтобы бот стоял на месте
    setTimeout(() => { 
      bot.chat('/afk') 
    }, 5000)
  })

  // Анти-вылет: если бот потеряет интернет или его кикнет, он сам перезайдет через 10 секунд
  bot.on('end', () => {
    console.log('Бот отключен от сервера. Перезапуск через 10 секунд...')
    setTimeout(createBot, 10000)
  })

  bot.on('error', (err) => console.log('Ошибка бота: ', err))
}

createBot()
