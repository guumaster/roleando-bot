require('dotenv').config()

module.exports = {
  maxRetries: 100,
  tweetLength: 280,
  botScreenName: 'roleandobot',
  generatorLabels: {
    profecias: ['profecia', 'profecias'],
    graffitis: ['graffiti', 'graffitis', 'pintada'],
    dungeons: ['dungeon'],
    presagios: ['presagios', 'presagio'],
    destinos: ['destino', 'destino mistico'],
    simbolos: ['simbolo', 'simbolo extraño'],
    garitos: ['garito', 'posada', 'taverna'],
    tramas: ['trama', 'plot'],
    oraculo: ['oraculo'],
    sombrio: ['sitio', 'sitio sombrio'],
    aventura: ['aventura', 'semilla'] 
  },
  generators: {
    profecias: 'BytfSUVS',  // Profecias
    graffitis: 'Hy_JYs8yZ', // Graffitis
    dungeons: 'SJfca2q4',  // Dungeons
    presagios: 'ryhpUxVH',  // Presagios
    destinos: 'rJZnFG74',  // Destinos misticos
    simbolos: 'Hk8Z2R9S',  // Simbolos extraños
    garitos: 'rkdh21CR',  // Garitos
    tramas: 'ryCnVMOb-', // Tramas cortas
    oraculo: 'Hk_5n7Obb', // Oraculo
    sombrio: 'Hk2B_7fE', // Sitio sombrio
    aventura: 'H1JTSHyN' // Aventura
  },
  twitter: {
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
  }
}
