import EErrors from './enum.js'

// const errorHandler = (error, req, res, next) => {
//   console.error(error.stack);
//   return res.status(500).json({
//     status: 500,
//     method: req.method,
//     path: req.url,
//     response: error.message,
//   });
// };

const errorHandler = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPE_ERROR:
      return res.send({ status: 'error', error: error.name });

    case EErrors.ROUTING_ERROR:
      return res.send({ status: 'error', error: error.name });

    case EErrors.DATABASE_ERROR:
      return res.send({ status: 'error', error: error.name });

    default:
      return res.send({ status: 'error', error: 'Unhabled error' });
  }
}

export default errorHandler;