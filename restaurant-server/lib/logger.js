const { format, transports, createLogger } = require("winston");

const logger = createLogger({
  format: format.simple(),
  transports: [
    new transports.File({
      filename: "log/error.log",
      level: "error",
      format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
    new transports.Console({ level: "info" }),
  ],
});

module.exports = logger;
