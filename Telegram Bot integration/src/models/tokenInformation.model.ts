import mongoose from 'mongoose';
// defining token information schema
export const tokenSchema = new mongoose.Schema({
    tokenAddress: {type:String,required:true},
    pairAddress: {type:String,required:true},
    chainId: {type:String,required:true},
    dexId: {type:String,required:true},
    tokenName: {type:String,required:true},
    tokenSymbol:{type:String,required:true},
    tokenPrice: {type:Number,required:true}

})

export const TokenInformationModel = mongoose.model("TokenInformation",tokenSchema);