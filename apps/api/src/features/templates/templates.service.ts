import handlebars from 'handlebars';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as juice from 'juice';

import { Injectable } from "@nestjs/common";
import { EnvService } from "environment/environment.service";
import { BookingConfirmedUserProps, BookingMadeOperatorActionRequiredProps, BookingMadeOperatorProps, BookingMadeUserPendingProps, BookingMadeUserProps, BookingRejectedUserProps, OperatorPromotedProps } from 'features/templates/templates.models';
import { BookingDto, OperatorDto } from 'dtos';
import { urls } from 'urls';
import { EmailData } from 'integrations/email/email.models';
import { getQrCodeFilePathForOperatorSignup, getReadableBookingDetails } from 'utils';
import { QRCodeService } from 'features/qr-code/qr-code.service';

@Injectable()
export class TemplatesService {
  private templatesPath = path.resolve(process.cwd(), 'templates');
  private styles = this.loadStyles();
  private templates = this.loadTemplates();

  constructor(
    private readonly env: EnvService,
    private readonly qrCodeService: QRCodeService,
  ) { }

  bookingMadeUser(booking: BookingDto): EmailData {
    return {
      subject: `Your booking with ${booking.operator.name}`,
      content: this.templates.bookingMadeUser({
        user: {
          name: booking.name,
        },
        operator: {
          name: booking.operator.name,
          url: this.link(urls.user.operator(booking.operator)),
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        booking: {
          url: this.link(urls.user.booking(booking._id)),
          qrCodeUrl: this.qrCodeService.getUrlForBookingQRCode(booking),
        }
      })
    }
  }

  bookingMadeUserPending(booking: BookingDto): EmailData {
    return {
      subject: `Your booking with ${booking.operator.name} is processing`,
      content: this.templates.bookingMadeUserPending({
        user: {
          name: booking.name,
        },
        operator: {
          name: booking.operator.name,
          url: this.link(urls.user.operator(booking.operator)),
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        booking: {
          url: this.link(urls.user.booking(booking._id))
        }
      })
    }
  }

  bookingConfirmedUser(booking: BookingDto): EmailData {
    return {
      subject: `Your booking for ${booking.service.name} has been confirmed!`,
      content: this.templates.bookingConfirmedUser({
        user: {
          name: booking.name,
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        booking: {
          url: this.link(urls.user.booking(booking._id)),
          qrCodeUrl: this.qrCodeService.getUrlForBookingQRCode(booking),
        }
      })
    }
  }

  bookingRejectedUser(booking: BookingDto): EmailData {
    return {
      subject: `Your booking for ${booking.service.name} has been rejected`,
      content: this.templates.bookingRejectedUser({
        user: {
          name: booking.name,
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        site: {
          url: this.link()
        }
      })
    }
  }
  
  bookingMadeOperator(booking: BookingDto): EmailData {
    const bookingDetails = getReadableBookingDetails(booking);
    return {
      subject: `New booking for ${booking.service.name} on ${booking.date}`,
      content: this.templates.bookingMadeOperator({
        operator: {
          name: booking.operator.name,
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        booking: {
          date: booking.date,
          url: this.link(urls.operators.booking(booking._id)),
          details: Object.keys(bookingDetails).map(key => ({
            key,
            value: bookingDetails[key]
          }))
        }
      })
    }
  }

  bookingMadeOperatorActionRequired(booking: BookingDto): EmailData {
    const bookingDetails = getReadableBookingDetails(booking);
    return {
      subject: `[ACTION REQUIRED] A new booking for ${booking.service.name} on ${booking.date} is waiting for your response`,
      content: this.templates.bookingMadeOperatorActionRequired({
        operator: {
          name: booking.operator.name,
        },
        service: {
          name: booking.service.name,
          url: this.link(urls.user.service(booking.service)),
        },
        booking: {
          date: booking.date,
          url: this.link(urls.operators.booking(booking._id)),
          details: Object.keys(bookingDetails).map(key => ({
            key,
            value: bookingDetails[key]
          }))
        }
      })
    }
  }

  operatorPromoted(operator: OperatorDto): EmailData {
    return {
      subject: `[ACTION REQUIRED] You have been made an operator on ${this.env.get().appName}`,
      content: this.templates.operatorPromoted({
        operator: {
          name: operator.owner.givenName,
        },
        site: {
          name: this.env.get().appName,
          url: this.env.get().frontendUrl,
        },
        app: {
          url: '',
          qrCodeUrl: this.qrCodeService.getUrlForOperatorSignup(operator)
        }
      })
    }
  }

  private loadTemplates() {
    this.loadPartials();

    return {
      bookingMadeUser: this.compileTemplate<BookingMadeUserProps>('booking-made-user'),
      bookingMadeUserPending: this.compileTemplate<BookingMadeUserPendingProps>('booking-made-user-pending'),
      bookingConfirmedUser: this.compileTemplate<BookingConfirmedUserProps>('booking-confirmed-user'),
      bookingRejectedUser: this.compileTemplate<BookingRejectedUserProps>('booking-rejected-user'),
      bookingMadeOperator: this.compileTemplate<BookingMadeOperatorProps>('booking-made-operator'),
      bookingMadeOperatorActionRequired: this.compileTemplate<BookingMadeOperatorActionRequiredProps>('booking-made-operator-action-required'),
      operatorPromoted: this.compileTemplate<OperatorPromotedProps>('operator-promoted'),
    }
  }

  private loadPartials() {
    const partialsPath = path.resolve(this.templatesPath, 'partials');
    const partials = fsExtra.readdirSync(partialsPath);
    
    for (const partial of partials) {
      const content = fs.readFileSync(path.resolve(partialsPath, partial), 'utf-8');

      handlebars.registerPartial(partial.split('.')[0], () => content);
    }
  }

  private compileTemplate<T>(name: string) {
    return handlebars.compile<T>(this.readTemplateAndResolveStyles(name));
  }

  private readTemplateAndResolveStyles(name: string) {
    return juice(`
      <html>
      <head>
      <style>
        ${this.styles}
      </style>
      </head>
      <body>
        ${fs.readFileSync(path.resolve(this.templatesPath, `${name}.handlebars`), 'utf-8')}
      </body>
      </html>
    `)
  }

  private loadStyles() {
    return fs.readFileSync(path.resolve(this.templatesPath, 'styles.css'), 'utf-8');
  }

  private link(url?: string) {
    return `${this.env.get().frontendUrl}${url}`;
  }
}
