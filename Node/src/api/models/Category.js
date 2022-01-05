const mongoose = require('mongoose')

const categorySchema= new mongoose.Schema({    
    Name:{        
        type: String,        
        required:true,        
        lowercase: true,    
    },    
    Description:{        
        type: String,          
    },    
    img:{   
        type: String ,
        required: true,     
    },
    status:{
      type: Boolean  
    }
}, {timestamps:true})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
