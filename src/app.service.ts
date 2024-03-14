import { Injectable } from '@nestjs/common';
import { SendMessageDTO } from './dto/send-message.dto';
import { StringSession } from 'telegram/sessions';
import { TelegramClient } from 'telegram';
import input from 'input';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schema/auth.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  private client: TelegramClient;

  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
  ) {}

  init = async () => {
    const apiId = +process.env.API_ID;
    const apiHash = process.env.API_HASH;

    const resp = await this.authModel.findOne();

    const stringSession = new StringSession(resp?.token ?? '');

    console.log('Loading interactive example...');
    this.client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    const phoneNumber =
      resp?.phoneNumber ?? (await input.text('Please enter your phone: '));

    await this.client.start({
      phoneNumber,
      password: async () => await input.text('Please enter your password: '),
      phoneCode: async () =>
        await input.text('Please enter the code you received: '),
      onError: (err) => console.log(err),
    });

    this.client.session.save();

    await this.client.sendMessage('me', { message: 'start session' });

    const token = stringSession.save();

    if (resp)
      await this.authModel.updateOne(
        {
          _id: resp._id,
        },
        {
          token,
          phoneNumber,
        },
      );
    else
      await this.authModel.create({
        token,
        phoneNumber,
      });
  };

  sendMessage = async (dto: SendMessageDTO) => {
    await this.client.sendMessage('+'.concat(dto.phone), {
      message: dto.message,
    });

    return dto;
  };
}
