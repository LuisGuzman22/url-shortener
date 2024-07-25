import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './infrastructure/controllers/url.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongodb:27017/nest?authSource=admin',
    ), // Cambia 'nest' al nombre de tu base de datos si es diferente
    UrlModule,
  ],
})
export class AppModule {}
