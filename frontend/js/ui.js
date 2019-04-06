const url_const = {
    stats : 'http://127.0.0.1/backend/',
    predict : 'http://127.0.0.1/predict' 
};


M.AutoInit();

$(document).ready(function() {
    $('#select-stats').on('change', function(e) {
        //console.log($(this).val());  //DEBUG : PRINTS SELECTED ITEM
        let item = $(this).val();
        let url = url_const['predict'] + item;

        fetch(url, {
            method : 'GET',
            headers : {'Content-Type' :  'application/json'} 
        })
        .then(res => res.json())
        .then(data => {

        });
    });

    $('#predict-submit-button').click(function(e){
        const payload = {
            resting_blood_pressure : $('#resting-blood-pressure').val() ,
            serum_cholestoral : $('#serum-cholestoral').val(),
            fasting_blood_sugar : $('#fasting-blood-sugar').val(),
            resting_electrocardiographic : $('#resting-electrocardiographic').val(),
            max_heart_rate : $('#max-heart-rate')
        }

        fetch(url_const['predict'], {
            method: 'POST',
            headers : {'Content-Type' : 'application/json'}
        })
        .then(res => res.json())
        .then(data=> {
            if(data['result'] == 0) {
                //Add some texts Indicating user doesn't have disease
            } else if (data['result'] == 1){
                //Add some texts Indicating user has disease
            } else {
                //Throw error
            }
        })
    });
});