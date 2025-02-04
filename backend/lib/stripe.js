import Stripe from "stripe"
import { config } from "../config/config.js"

export const stripe = new Stripe(config.STRIP_SECRET_KEY)
