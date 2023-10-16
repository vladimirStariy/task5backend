import { Module } from "@nestjs/common";
import { Faker } from "@faker-js/faker";
import { ConfigModule } from "@nestjs/config";
import { FakeModule } from "./fakeData/fake.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        FakeModule,
        Faker
    ],
    controllers: [],
    providers: []
})

export class AppModule {}