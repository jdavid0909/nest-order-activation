
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema()
export class ServiceTran extends Document {

    @Prop({ required: true })
    subscriber: number;

    @Prop({ required: true })
    offerId: number;


    @Prop({ required: true })
    status: number;

    
    registrationDate: number = new Date().getTime();

    
    dischargeDate: number = new Date().getTime();


    @Prop({ required: true })
    offerName: String;

    @Prop({ required: true })
    transactionState: string;

    @Prop({ required: true })
    retires: number;


    @Prop({ required: true })
    typeTrans: string;

    @Prop({ required: true })
    changeOffer: string;


    @Prop({ required: true })
    unit: string;

    @Prop({ required: true })
    transactionId: string;

    @Prop({ required: true })
    skusymph: string;



}

export const ServiceTranSchema = SchemaFactory.createForClass(ServiceTran);
