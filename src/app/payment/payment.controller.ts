import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { Response } from 'express';
import { PaymentInfo } from './dto/payment-info.dto';
import { PaymentStatusDto } from './dto/check-payment-status.dto';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private configService: ConfigService) {}

  @Post()
  collectPayment(@Res() res: Response, @Body() paymentInfo: PaymentInfo) {
    try {
      const saltKey = this.configService.get<string>('payment.saltKey');
      const merchantId = this.configService.get<string>('payment.merchantId');
      const endpoint = this.configService.get<string>('payment.endpoint');
      const redirectUrl = this.configService.get<string>('payment.redirectUrl');

      const { email, amount, phone } = paymentInfo;

      const merchantTransactionId = 'MT' + Date.now();

      const data = {
        merchantId,
        merchantTransactionId,
        merchantUserId: email,
        amount: amount || 1,
        redirectUrl: redirectUrl + `?transactionId=${merchantTransactionId}`,
        redirectMode: 'REDIRECT',
        mobileNumber: phone,
        paymentInstrument: {
          type: 'PAY_PAGE',
        },
      };

      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const string = payloadMain + '/pg/v1/pay' + saltKey;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      const options = {
        method: 'post',
        url: `${endpoint}/pg/v1/pay`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
        data: {
          request: payloadMain,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          return res.json(response.data);
        })
        .catch(function (error) {
          this.logger.error(error);
          return error;
        });
    } catch (error) {
      this.logger.error(error);
      return res.status(500).send({
        message: error.message,
        success: false,
      });
    }
  }

  @Post()
  checkStatus(@Res() res: Response, @Body() statusInfo: PaymentStatusDto) {
    const keyIndex = 1;
    const saltKey = this.configService.get<string>('payment.saltKey');
    const merchantId = this.configService.get<string>('payment.merchantId');
    const endpoint = this.configService.get<string>('payment.endpoint');
    const string =
      `/pg/v1/status/${merchantId}/${statusInfo.transactionId}` + saltKey;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;

    const options = {
      method: 'GET',
      url: `${endpoint}/pg/v1/status/${merchantId}/${statusInfo.transactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`,
      },
    };

    axios
      .request(options)
      .then(async (response) => {
        if (response.data.success === true) {
          return res
            .json({
              success: true,
              message: 'payment collected successfully',
            })
            .status(HttpStatus.CREATED);
        } else {
          return res
            .json({
              success: false,
              message: 'payment pending',
            })
            .status(HttpStatus.BAD_REQUEST);
        }
      })
      .catch((error) => {
        return res
          .json({
            success: false,
            message: 'payment pending',
          })
          .status(HttpStatus.BAD_REQUEST);
      });
  }
}
