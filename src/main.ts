import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Сервер для командного проекту подорожей')
      .setDescription('Документація REST API')
      .setVersion('0.0.1')
      .addServer('https://pero-travel-server.herokuapp.com')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(PORT, () => console.log(`server start on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
