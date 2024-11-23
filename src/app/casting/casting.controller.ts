import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateCastingDto } from './dto/create-casting.dto';
import { CastingService } from './casting.service';
import { Response } from 'express';
import { UpdateCastingDto } from './dto/update-casting.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GcsService } from '../gcs/gcs.service';
import { UploadCastingFilesDto } from './dto/upload-files.dto';

@Controller('casting')
export class CastingController {
  private readonly logger = new Logger(CastingController.name);

  constructor(
    private castingService: CastingService,
    private readonly gcsService: GcsService,
  ) {}

  @Post()
  async addCasting(
    @Res() res: Response,
    @Body() castingData: CreateCastingDto,
  ) {
    try {
      await this.castingService.addCasting(castingData);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Added Casting successfully' });
    } catch (error) {
      // Log the error for internal tracking
      this.logger.error('Failed to add casting data', error);

      // Determine the type of error and send appropriate response
      if (error.message.includes('Failed to insert casting data')) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: 'error',
          message: 'Failed to add casting data due to a server error.',
        });
      }

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: 'error', message: 'Invalid casting data.' });
    }
  }

  @Patch(':userId')
  async updateUserCasting(
    @Param('userId') userId: string,
    @Body() castingData: UpdateCastingDto,
    @Res() res: Response, // Inject the response object to send custom status codes
  ) {
    try {
      const updatedCastingData = await this.castingService.updateCasting(
        userId,
        castingData,
      );
      return res.status(200).json(updatedCastingData); // Return success response
    } catch (error) {
      if (error.message.includes('No casting data found')) {
        return res
          .status(404)
          .json({ status: 'error', message: error.message });
      }
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update casting data due to a server error.',
      });
    }
  }

  @Get('highlight')
  async getHighlightedCastingUsers(@Res() res: Response) {
    try {
      const highlightedUsers =
        await this.castingService.getHighlightedCastingUsers();
      return res.status(HttpStatus.OK).json(highlightedUsers);
    } catch (error) {
      this.logger.error('Failed to retrieve highlighted casting users', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Failed to retrieve highlighted casting users.',
      });
    }
  }

  @Patch(':userId/highlight')
  async highlightUser(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.castingService.toggleHighlight(userId);

    if (result.status === 'error') {
      if (result.message === 'User not found.') {
        return res.status(404).json(result);
      }
      if (
        result.message.includes('Maximum number of highlighted users reached')
      ) {
        return res.status(400).json(result);
      }
      return res.status(500).json(result); // Handle other server errors
    }

    return res.status(200).json(result);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'resumeLink', maxCount: 1 },
      { name: 'imageLinks', maxCount: 5 },
      { name: 'videoLink', maxCount: 1 },
    ]),
  )
  async updateCastingFiles(
    @Param('id') castingId: string,
    @UploadedFiles()
    files: {
      resumeLink?: Express.Multer.File[];
      imageLinks?: Express.Multer.File[];
      videoLink?: Express.Multer.File[];
    },
    @Body() uploadData: UploadCastingFilesDto,
    @Res() res: Response,
  ) {
    try {
      const resumeFileUrl = files?.resumeLink?.[0]
        ? await this.gcsService.uploadFile(
            files.resumeLink[0],
            'resumes',
            uploadData.email,
          )
        : null;

      const imageUrls = files?.imageLinks
        ? await Promise.all(
            files.imageLinks.map((file, i) =>
              this.gcsService.uploadFile(file, 'images', uploadData.email, i),
            ),
          )
        : [];

      const videoFileUrl = files?.videoLink?.[0]
        ? await this.gcsService.uploadFile(
            files.videoLink[0],
            'videos',
            uploadData.email,
          )
        : null;

      // Update casting file URLs in the database
      await this.castingService.updateCastingFiles(castingId, {
        resumeLink: resumeFileUrl ? [resumeFileUrl] : [],
        imageLinks: imageUrls,
        videoLink: videoFileUrl ? [videoFileUrl] : [],
      });

      return res
        .json({
          message: 'Files updated successfully',
          castingId,
          resumeLink: resumeFileUrl ? [resumeFileUrl] : [],
          imageLinks: imageUrls,
          videoLink: videoFileUrl ? [videoFileUrl] : [],
        })
        .status(HttpStatus.CREATED);
    } catch (error) {
      // Log the error and return an appropriate response
      this.logger.error('Failed to update casting files', error);
      return res
        .json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error?.message ||
            'Failed to update casting files. Please try again later.',
        })
        .status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
