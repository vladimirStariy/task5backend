import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FakeDataRequest } from './dto/fake.request.dto';
import { FakePesronDto } from './dto/fake.person.dto';
import { corruptData, getRandomizedIndex } from './helpers/corruptor';

const { fakerEN_US, fakerRU, fakerPL } = require('@faker-js/faker')

@Injectable()
export class FakeService {

    constructor() {}

    async generateData(fakeRequestDto: FakeDataRequest) {
        const resultSeed = fakeRequestDto.fakerSeed + fakeRequestDto.pageNumber;        
        const data: FakePesronDto[] = this.fillRawData(fakeRequestDto, resultSeed);
        let alph = this.alphabetSwitcher(Number(fakeRequestDto.locale));
        if(fakeRequestDto.errorOffset > 0) {
            let errorsCount = 0;
            if(Number.isInteger(fakeRequestDto.errorOffset)) {
                errorsCount = fakeRequestDto.errorOffset;
            } else {
                let variantPart = fakeRequestDto.errorOffset - Math.trunc(fakeRequestDto.errorOffset);
                errorsCount = Math.trunc(fakeRequestDto.errorOffset);
                const errorSeed = this.generateSeed(fakeRequestDto.errorOffset * resultSeed);
                if(getRandomizedIndex(errorSeed, 1 / variantPart) === 1) 
                    errorsCount += 1;
            }
            let prev = 1;
            for(let x = 0; x < errorsCount; x++) {
                let ind = 0; let maxLen = 0;
                for await (const i of data) {
                    const fieldSeed = this.generateSeed(fakeRequestDto.errorOffset * resultSeed  / (x * Number(i.num) * 999 + 1));
                    console.log(fakeRequestDto.errorOffset * resultSeed  / (x * Number(i.num) * 999 + 1));
                    const errorTypeSeed = this.generateSeed(fakeRequestDto.errorOffset * resultSeed * (prev * 100 ));
                    prev = getRandomizedIndex(fieldSeed, Object.keys(data[ind]).length - 2) + 2;
                    const value: string = data[ind][`${Object.keys(data[ind])[prev]}`];
                    maxLen = value.length;
                    const indexError = this.generateSeed(fakeRequestDto.errorOffset + resultSeed * (maxLen + 10));
                    data[ind][`${Object.keys(data[ind])[prev]}`] = corruptData(data[ind][`${Object.keys(data[ind])[prev]}`], errorTypeSeed,indexError,maxLen,alph);
                    ind++;
                }
                ind = 0;
            }
        }

        return data;
    }

    private generateSeed = (value: number) => {
        const seedrandom = require('seedrandom');
        var commonGen = seedrandom(value);
        var seed = commonGen();
        return seed;
    }

    private fillRawData = (fakeRequestDto: FakeDataRequest, seed: number) => {
        const data: FakePesronDto[] = [];
        const faker = this.localeSwitcher(Number(fakeRequestDto.locale));
        faker.seed(seed);
        for (let i = 0; i < fakeRequestDto.recordsCount; i++) {
            const fakePesron: FakePesronDto = new FakePesronDto(
                ((fakeRequestDto.pageNumber * fakeRequestDto.recordsCount)-(fakeRequestDto.recordsCount-(i+1))).toString(),
                faker.string.uuid(),
                faker.person.fullName(),
                `${faker.location.city()}, ${faker.location.streetAddress()}, ${faker.location.secondaryAddress()}`,
                faker.phone.number()
            ); 
            data.push(fakePesron);
        }
        return data;
    }

    private localeSwitcher = (locale: number) => {
        switch(locale) {
            case 0: return fakerEN_US;
            case 1: return fakerRU;
            case 2: return fakerPL;
        }
    }

    private alphabetSwitcher = (locale: number) => {
        switch(locale) {
            case 0: return 'lat';
            case 1: return 'cyr';
            case 2: return 'lat';
        }
    }
}

