import mongoose from "mongoose";
const { Schema,model } = mongoose;

const hodSchema = new Schema({
  name:{type:String,default:""},
  last:{type:String,default:""},
  buy:{type:String,default:""},
  sell:{type:String,default:""},
  volume:{type:String,default:""},
  base_unit:{type:String,default:""}
});


export const HOD = model("hods", hodSchema);
