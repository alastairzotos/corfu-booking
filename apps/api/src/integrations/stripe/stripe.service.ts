import { Injectable } from "@nestjs/common";
import { EnvService } from "environment/environment.service";
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(env.get().stripeSecretKey, {
      apiVersion: '2022-11-15'
    })
  }

  async createPaymentIntent(amount: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })
  }

  async constructEvent(body: Buffer, signature: string) {
    return await this.stripe.webhooks.constructEventAsync(body, signature, this.env.get().stripeWebhookSecret);
  }
}