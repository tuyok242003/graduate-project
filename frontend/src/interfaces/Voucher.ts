export interface IVouchers {
    _id?: string;
    name: string;
    discountAmount: string;
    expiryDate: string;
    isUsed:boolean;
    qty:string
    quantitySold:string
    length?:number
  }
  export interface IDeleteVoucher {
    _id: string;
    name: string;
      discountAmount: string;
      expiryDate: string;
      isUsed:boolean;
      qty:string
      quantitySold:string
      length?:number
  }