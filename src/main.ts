import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from 'cors';

async function start() {
    const PORT = '5000';
    const app = await NestFactory.create(AppModule);

    app.use(cors({
        origin: '*'
    }))

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();