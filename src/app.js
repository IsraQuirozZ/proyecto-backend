import { logger } from "./config/logger.js";
import { httpServer } from "./server.js";
import cluster from "node:cluster"
import { cpus } from "node:os"

const processors = cpus().length

if (cluster.isPrimary) {
  logger.info('Primary cluster')
  for (let i = 0; i < processors; i++) {
    cluster.fork()
  }
  cluster.on('message', worker => {
    logger.info(`Message received from worker ${worker.process.pid}`)
  })
} else {
  logger.info('Worker ' + process.pid)
  httpServer()
}