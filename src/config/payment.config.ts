import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  endpoint: process.env.PAYMENT_ENDPOINT || '',
  saltKey: process.env.PAYMENT_SALT_KEY || '',
  merchantId: process.env.PAYMENT_MERCHANT_ID || '',
  redirectUrl: process.env.PAYMENT_REDIRECT_URL || '',
}));
