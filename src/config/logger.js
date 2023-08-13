import winston from "winston";

const customLevelOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5
	},
	colors: {
		fatal: 'red',
		error: 'red',
		warning: 'yellow',
		info: 'green',
		http: 'blue',
		debug: 'magenta'
	}
}

const logger = winston.createLogger({
	levels: customLevelOptions.levels,
	transports: [
		new winston.transports.Console({
			level: 'debug', // 'info'
			format: winston.format.combine(
				winston.format.colorize({ colors: customLevelOptions.colors }),
				winston.format.simple()
			)
		}),
		// new winston.transports.File({
		// 	filename: 'errors.log',
		// 	level: 'warning',
		// 	format: winston.format.simple()
		// }) // DEV MODE
	]
})

const addLogger = (req, res, next) => {
	req.logger = logger
	req.logger.info(`${req.method} in ${req.url} - ${new Date().toLocaleString()}`)
	next()
}

export { logger, addLogger }