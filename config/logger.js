const winston = require('winston');

const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

// Define os níveis e cores
const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const colors = { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white' };
winston.addColors(colors);

// Define o formato base
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

// Define os "transportes" (destinos dos logs)
const transports = [
    // Em produção, os erros vão para um ficheiro.
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error', // Apenas erros neste ficheiro
    }),
    // Todos os logs vão para outro ficheiro para auditoria.
    new winston.transports.File({ filename: 'logs/all.log' }),
];

// Em desenvolvimento, adicionamos um transporte especial para o console com cores
if (isDevelopment) {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }), // Aplica cores só no console
                baseFormat
            )
        })
    );
}

// Cria a instância do logger
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'http', // Mostra logs http em produção, mas não no console
  levels,
  format: baseFormat, // Formato padrão sem cores
  transports,
});

module.exports = logger;