const url_const = {
    stats : 'http://127.0.0.1:5000/backend/',
    predict : 'http://127.0.0.1/predict' 
};


M.AutoInit();

$(document).ready(function() {
    $('#select-stats').on('change', function(e) {
        //console.log($(this).val());  //DEBUG : PRINTS SELECTED ITEM
        let item = $(this).val();
        let url = url_const['stats'] + item;

        fetch(url, {
            method : 'GET',
            headers : {'Content-Type' :  'application/json'} 
        })
        .then(res => res.json())
        .then(data => {
            female_data = []
            female_age = []
            male_data = []
            male_age = []
      
            for (var i = 0; i < data['age'].length; i++){
                if (data['sex'][i] == 1){ // Male
                    male_age.push(data['age'][i]);
                    male_data.push(data[item][i]);
                } else {
                    female_age.push(data['age'][i]);
                    female_data.push(data[item][i]);
                }
            }
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