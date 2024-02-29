export interface Vouchers {
    _id: string;
    name: string;
    discountAmount: number;
    expiryDate: Date;
    isUsed:boolean;
    qty:number
    quantitySold:number
  }
  