import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RemoveSensitiveFieldsInterceptor } from './interceptor/sensitive-fields.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new RemoveSensitiveFieldsInterceptor());
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
