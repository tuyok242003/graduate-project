export interface IVouchers {
    _id?: string;
    voucherName: string;
    discountAmount: string;
  
    isUsed:boolean;
    qty:string
   
    length?:number
  }
  export interface IDeleteVoucher {
    _id: string;
    voucherName: string;
      discountAmount: string;
    
      isUsed:boolean;
      qty:string
     
      length?:number
  }