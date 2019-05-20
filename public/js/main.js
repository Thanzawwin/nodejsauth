$('#post-delete').click((e)=>{
    let id = e.target.dataset.id;
    
    if(confirm('Are you Sure?')){

        $.ajax({
            method:'delete',
            url:`/post/delete/${id}`,
            success:function(res){
                if(res === 'success'){
                    window.location.href = '/';
                }
            }
        })
    }else{
        return false;
    }
})