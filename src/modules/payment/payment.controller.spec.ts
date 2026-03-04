import * as crypto from 'crypto';

@Post('verify')
async verifyPayment(@Body() body: any) {
  const generated_signature = crypto
    .createHmac(
      'sha256',
      process.env.RAZORPAY_KEY_SECRET as string
    )
    .update(body.razorpay_order_id + "|" + body.razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== body.razorpay_signature) {
    throw new Error('Invalid signature');
  }

  return { message: "Payment verified successfully" };
}