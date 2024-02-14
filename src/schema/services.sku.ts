
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema()
export class ServiceSku extends Document {

   

    @Prop({ required: true })
    offerId: number;


    @Prop({ required: true })
    skusymph: string;


    @Prop({ required: true })
    action: string;



}

export const ServiceSkuSchema = SchemaFactory.createForClass(ServiceSku);
