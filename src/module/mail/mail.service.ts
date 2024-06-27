import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendProofApprovalEmail(user: any, proof: any) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: '[No-Reply] Your proof has been approved',
      template: './proof-approval',
      context: {
        name: user.name,
        activity: proof.userActivity.activity,
      },
    });
  }

  async sendProofRejectionEmail(user: any, proof: any, reason: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: '[No-Reply] Your proof has been rejected',
      template: './proof-reject',
      context: {
        name: user.name,
        activity: proof.userActivity.activity,
        reason: reason,
      },
    });
  }
}
