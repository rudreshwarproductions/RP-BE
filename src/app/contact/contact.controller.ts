import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  Param,
  Patch,
  Get,
  Query,
  HttpException,
  Logger,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactService } from './contact.service';
import { Response } from 'express';

@Controller('contacts')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Post()
  async addContact(
    @Body() createContactDto: CreateContactDto,
    @Res() res: Response,
  ) {
    try {
      const newContact = await this.contactService.addContact(createContactDto);
      return res
        .json({
          statusCode: HttpStatus.CREATED,
          message: 'Contact added successfully',
          data: newContact,
        })
        .status(HttpStatus.CREATED);
    } catch (error) {
      this.logger.error(error);
      return res
        .json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        })
        .status(HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':userId/contacted')
  async toggleContactedStatus(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const updatedContact = await this.contactService.toggleContacted(userId);
      return res
        .json({
          statusCode: HttpStatus.OK,
          message: 'Contact status toggled successfully',
          data: updatedContact,
        })
        .status(HttpStatus.OK);
    } catch (error) {
      return res
        .json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        })
        .status(HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getContacts(
    @Res() res: Response,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    try {
      const contacts = await this.contactService.getContacts(
        page,
        limit,
        search,
      );
      return res
        .json({
          message: 'Contacts retrieved successfully',
          ...contacts,
        })
        .status(HttpStatus.OK);
    } catch (error) {
      this.logger.error('Failed to retrieve contacts', error);
      throw new HttpException(
        'Failed to retrieve contacts. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
