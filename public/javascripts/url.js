$(function(){
  $('#inputShortUrl').on('keyup', function(e){
    if(e.keyCode === 13){      
      var parameters = {search: $(this).val()};
      $.get('/searchinglongurl', parameters, function(data){
        $('#resultLongURL').html(data);
      });
    }
  });
});
