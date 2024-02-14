import { IsString, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class Reason {
  @IsString()
  name: string;
}

class BillingAccount {
  @IsString()
  accountId: string;
}

class Relationships2 {
  @IsString()
  productOfferingId: string;
}

class OrderProduct {
  @ValidateNested({ each: true })
  @Type(() => Relationships2)
  relationships: Relationships2;
}

class Included3 {
  @ValidateNested({ each: true })
  @Type(() => OrderProduct)
  orderProduct: OrderProduct;
}

class Attributes2 {
  @IsString()
  action: string;

  @ValidateNested({ each: true })
  @Type(() => Reason)
  reason: Reason;
}

class Relationship {
  @ValidateNested({ each: true })
  @Type(() => BillingAccount)
  billingAccount: BillingAccount;
}

class OrderItem {
  @ValidateNested({ each: true })
  @Type(() => Attributes2)
  attributes: Attributes2;

  @ValidateNested({ each: true })
  @Type(() => Relationship)
  relationship: Relationship;

  @ValidateNested({ each: true })
  @Type(() => Included3)
  included: Included3;
}

class Included2 {
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orderItems: OrderItem[];
}

class SalesInfo {
  @IsString()
  channel: string;
}

class Attributes {
  @IsString()
  referenceNumber: string;

  @IsString()
  requestedStartDatetime: string;

  @ValidateNested({ each: true })
  @Type(() => SalesInfo)
  salesInfo: SalesInfo;
}

class Relationships {
  @IsString()
  customerAccountId: string;
}

class NewInstance {
  @ValidateNested({ each: true })
  @Type(() => Attributes)
  attributes: Attributes;

  @ValidateNested({ each: true })
  @Type(() => Relationships)
  relationships: Relationships;

  @ValidateNested({ each: true })
  @Type(() => Included2)
  included: Included2;
}

class Included {
  @ValidateNested({ each: true })
  @Type(() => NewInstance)
  newInstance: NewInstance;
}

class Input {
  @ValidateNested({ each: true })
  @Type(() => Included)
  included: Included;
}

export class RootDto {
  @ValidateNested({ each: true })
  @Type(() => Input)
  input: Input;
}
