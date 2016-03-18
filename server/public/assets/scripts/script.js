$(document).ready(function () {
  $("#animalForm").on("submit", handleSubmit);
  receiveData();
  receiveNumber();
});

function handleSubmit (event) {
  event.preventDefault();
  var val = {};
  $.each($("#animalForm").serializeArray(),function(index, element){
    val[element.name]= element.value;
  });
  console.log(val);

  //empty the input
  $("#animalForm").find("input[type=text]").val("");
  $("#animalForm").find("input[type=number]").val("");

  sendData(val);
}

function sendData (animalData) {
  $.ajax({
    type:'POST',
    url:'/animal',
    data:animalData,
    success: receiveData
  });
}

function receiveData () {
  $.ajax({
    type:'GET',
    url:'/animal',
    success: appendDom
  });
}
//append the object and delete button to DOM
function appendDom(response){
  $('.animal').empty();
  response.forEach(function(animal){
    $('.animal').append('<div class="new-animal"></div>');
    var $el = $('.animal').children().last();
    $el.append('<h2>' + "Animal: " + animal.animal_name + '</h2>');
    $el.append('<h2>' + "Count: " + animal.animal_count + '</h2>');
  })

}

function receiveNumber() {
  $.ajax({
    type:'GET',
    url:'animal/count',
    success: function(response){
      $('p').text("the number of your entered animal will be: " + response);
    }
  });
}
