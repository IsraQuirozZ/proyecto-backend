import { Router } from "express";
import jwt from "jsonwebtoken";

class MainRouter {
	constructor() {
		this.router = Router()
		this.init()
	}

	getRouter() {
		return this.router
	}

	init() { }

	applyCallbacks(callbacks) {
		return callbacks.map(cb => async (...params) => {
			try {
				await cb.apply(this, params)
			} catch (error) {
				console.error(error)
				params[1].status(500).send(error)
			}
		})
	}

	generateCustomResponses = (req, res, next) => {
		res.sendSuccess = (code = 200, payload) => res.status(code).send({ status: 'success', payload })
		res.sendServerError = (code = 500, error) => res.status(code).send({ status: 'error', error })
		res.sendUserError = (code = 400, error) => res.status(code).send({ status: 'error', error })
		next()
	}

	hanldePolicies = policies => (req, res, next) => {
		if (policies[0] === 'PUBLIC') return next()
		if (!req.cookies.token) {
			return res.status(401).send({ status: 'error', error: 'Unauthenticated' })
		}
		let user = jwt.verify(req.cookies.token, process.env.SECRET_JWT)
		if (!policies.includes(user.role.toUpperCase())) {
			return res.status(403).send({ status: 'error', error: 'Unauthorized' })
		}
		req.user = user
		next()
	}

	get(path, policies, ...callbacks) {
		this.router.get(path, this.hanldePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
	}

	post(path, policies, ...callbacks) {
		this.router.post(path, this.hanldePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
	}

	put(path, policies, ...callbacks) {
		this.router.put(path, this.hanldePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
	}

	delete(path, policies, ...callbacks) {
		this.router.delete(path, this.hanldePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks))
	}

}

export default MainRouter