import { Module } from '@nestjs/common';
import { FakeService } from './fake.service';
import { FakeController } from './fake.controller';
import { Faker } from '@faker-js/faker';

@Module({
  controllers: [FakeController],
  providers: [FakeService],
  imports: [],
  exports: [
    FakeService,
    Faker
  ]
})

export class FakeModule {}
