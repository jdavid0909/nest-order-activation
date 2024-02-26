// src/kafka.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Response } from 'express';
import { Kafka, Producer, Consumer, Partitioners } from 'kafkajs';


@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    private res:Response;

    constructor() {
        this.kafka = new Kafka({
            clientId: 'test',//kafka puerto
            brokers: ['localhost:9092'], // Cambia a la dirección y el puerto de tu servidor Kafka
        });

        this.producer = this.kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
        this.consumer = this.kafka.consumer({ groupId: 'nestjs-group' });
    }

    async send(topic: string, messages: any, uti:string) {

        try {

            await this.producer.connect();
            await this.producer.send({
                topic,
                messages: [{ value: JSON.stringify(messages) }]
            });
            await this.producer.disconnect();

        } catch (error) {

            console.log(error);

            return this.res.status(400).json({
                generalResponse: {
                    uti: uti,
                    status: "ERROR",
                    code: "601",
                    message: `Error no existe registro activo para remover`
                }
            });


        }


    }

    async subscribe(topic: string, callback: (message: any) => void) {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                callback({
                    topic,
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
            },
        });
    }

    async disconnect() {
        await this.consumer.disconnect();
    }

    async onModuleInit() {
        await this.consumer.connect();
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }
}
