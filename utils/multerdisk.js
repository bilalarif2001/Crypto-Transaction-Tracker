const multer= require("multer");


let storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../Notes-App/public/Images');
    },

    filename: function (req,file,cb){
        cb(null,file.fieldname + '-'+ Date.now())
    }
})
const upload=multer({storage:storage});

module.exports=upload;