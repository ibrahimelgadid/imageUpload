
    Dropzone.options.dropzoneForm = {
        acceptedFiles:'image/*',
        init:function(){
            this.on('queuecomplete', function(file){
               setTimeout(function(){
                   location.reload()
               }, 1000) 
            })
        }
    }


