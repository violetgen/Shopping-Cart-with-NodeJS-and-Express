var stripe = Stripe('pk_test_cm8uLBxwojuTo65hsC5wkAlt');

var $form = $('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('hide');
    //pass the disabled property to the button once it is clicked for submission
    $form.find('button').prop('disabled', true);
    stripe.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
      }, stripeResponseHandler);
      return false; //because we have not validated from our server yet, the form should not submit
      
    //   .then(function(result) {
    //     // Handle result.error or result.token
    //     if(result.error){
    //         $('#charge-error').text(result.error);
    //         console.log(result.error)
    //         $('#charge-error').removeClass('hide');
    //         $form.find('button').prop('disabled', false);
    //     }else{
    //         var token = result.token;
    //         $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    //         //submit the form
    //         $form.get(0).submit();
    //     }
    //   });
    //   return false; //because we have not validated from our server yet, the form should not submit
      
});

function stripeResponseHandler(status, response){
    if(response.error){
        $('#charge-error').text(response.error.message);
        console.log(response.error)
        $('#charge-error').removeClass('hide');
        $form.find('button').prop('disabled', false);
    }else{
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        //submit the form
        $form.get(0).submit();
    }
}