import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller('therapists')
export class TherapistsController {
  constructor(private therapistsService: TherapistsService) {}

  @Post('register')
  async register(@Body() createTherapistDto: CreateTherapistDto) {
    return this.therapistsService.create(createTherapistDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.therapistsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTherapistDto: UpdateTherapistDto) {
    return this.therapistsService.update(id, updateTherapistDto);
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('document', {
    storage: diskStorage({
      destination: './uploads/documents',
      filename: (req, file, callback) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return `${randomName}${extname(file.originalname)}`;
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Only image and PDF files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }))
  async uploadDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Document is required');
    }
    const documentUrl = `/uploads/documents/${file.filename}`;
    return this.therapistsService.uploadDocument(id, documentUrl);
  }

  // Optional: Serve uploaded documents
  @Get('uploads/documents/:filename')
  async getDocument(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(`./uploads/documents/${filename}`, { root: '.' });
  }
}