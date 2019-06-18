window.onload = function(){


    document.getElementById('select').onclick = 
    function select(){
        document.getElementById('img').click();
    }

    let img = document.getElementById('img');
    let Preview = document.getElementById('imgPreview');
        function readFile(input){
            if(input.files && input.files[0]){
                var reader = new FileReader();
                reader.onload = function(e){
                    Preview.setAttribute('src', e.target.result);
                    Preview.style.height ='200px';
                    Preview.style.width ='200px';
                }
                
                reader.readAsDataURL(input.files[0])
            }
        }

        img.onchange = function(e){
            readFile(img)
        }


        //dropzone
        
}