import { Request, Response } from "express"
import * as authService from "../services/auth.service"

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body
    const result = await authService.register(name, email, password)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}