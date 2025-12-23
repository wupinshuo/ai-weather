import { Injectable, Logger } from '@nestjs/common';
import { EmailEnabled } from '../../decorators/email-enabled.decorator';
import * as nodemailer from 'nodemailer';

@Injectable()
@EmailEnabled
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  /** SMTP邮箱 */
  private smtpEmail = process.env.SMTP_EMAIL as string;
  /** SMTP邮箱SMTP密码 */
  private smtpPassword = process.env.SMTP_PASSWORD as string;
  /** SMTP host */
  private smtpHost = process.env.SMTP_HOST as string;
  /** SMTP端口 */
  private smtpPort = Number(process.env.SMTP_PORT || '465');
  /** 默认收件人 */
  private defaultEmail = process.env.DEFAULT_EMAIL as string;
  /** 发送邮件列表 */
  private emailList = (process.env.EMAIL_LIST || '')?.split(',');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: true,
      auth: {
        user: this.smtpEmail,
        pass: this.smtpPassword,
      },
    });
  }

  onModuleInit() {
    this.logger.log('邮件服务已初始化');
  }

  /**
   * 发送邮件
   * @param title 标题
   * @param content 内容
   * @param to 收件人
   * @returns 发送结果
   */
  async sendEmail(
    title: string,
    content: string,
    to: string = this.defaultEmail,
  ): Promise<boolean> {
    try {
      // 参数校验
      if (
        !to ||
        !title ||
        !content ||
        !this.smtpEmail ||
        !this.smtpPassword ||
        !this.smtpHost
      ) {
        console.error('参数校验失败');
        return false;
      }
      await this.transporter.sendMail({
        from: this.smtpEmail, // 发件人
        to, // 收件人
        subject: title, // 主题
        // text: content, // 文本内容
        html: content, // 如果需要发送HTML格式
      });
      this.logger.log('发送邮件成:', to, title);
      return true;
    } catch (error) {
      this.logger.error('发送邮件失败:', error);
      return false;
    }
  }

  /**
   * 批量发送邮件
   * @param title 标题
   * @param content 内容
   * @returns 发送结果
   */
  async sendBatchEmails(title: string, content: string): Promise<boolean> {
    try {
      // 参数校验
      if (
        !title ||
        !content ||
        !this.emailList ||
        this.emailList.length === 0
      ) {
        console.error('参数校验失败');
        return false;
      }
      // 批量发送邮件
      const sendPromises = this.emailList.map((email) =>
        this.sendEmail(title, content, email),
      );
      const sendResults = await Promise.all(sendPromises);
      // 检查是否所有邮件都发送成功
      const allSent = sendResults.every((result) => result);
      this.logger.log('批量发送邮件结果:', sendResults);
      return allSent;
    } catch (error) {
      this.logger.error('批量发送邮件失败:', error);
      return false;
    }
  }
}
