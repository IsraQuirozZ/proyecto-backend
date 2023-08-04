const validateCart = async (req, res, next) => {
	const requestedCart = req.params.cid
	const userCart = req.user?.cid?.toString()

	console.log(requestedCart, userCart)

	if (requestedCart !== userCart) {
    return res.status(400).json({
      message: 'Carts do not match'
    })
  }
	return next()
}

export default validateCart