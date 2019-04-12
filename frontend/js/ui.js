const url_const = {
    stats : 'http://127.0.0.1:5000/backend/',
    predict : 'http://127.0.0.1:5000/predict',
    important_val : 'http://127.0.0.1:5000/important_val'
};

const column_alias = {
    age : 'Age',
    sex : 'Sex',
    chest_pain_type : 'Chest Pain Type',
    resting_blood_pressure : 'Resting Blood Pressure',
    serum_cholestoral : 'Serum Cholestoral',
    fasting_blood_sugar : 'Fasting Blood Value',
    resting_electrocardiographic : 'Resting Electrocardiographic',
    max_heart_rate : 'Max Heart Rate',
    exercise_induced_angina : 'Exercise Induced Angina',
    oldpeak : 'Oldpeak',
    slope_of_peak_ST_segment : 'Slope of peak of ST Segment',
    num_major_vessel : 'Number of major vessels',
    thal : 'Thalassemia',
    target : 'Disease status'
}

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
            if(item == 'max_heart_rate' || item == 'resting_blood_pressure' || item == 'serum_cholestoral' || item == 'oldpeak'){
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
                generateScatter(male_age, male_data, female_age, female_data, item);
            } else if (item == 'chest_pain_type'){

            }
        });
    });

    $('#predict-submit-button').click(function(e){
        const payload = {
            age : parseInt($('#age').val()),
            sex : parseInt($('#sex').val()),
            chest_pain_type : parseInt($('#chest_pain_type').val()),
            resting_blood_pressure : parseInt($('#resting-blood-pressure').val()),
            serum_cholestoral : parseInt($('#serum-cholestoral').val()),
            fasting_blood_sugar : parseInt($('#fasting-blood-sugar').val()),
            resting_electrocardiographic : parseInt($('#resting-electrocardiographic').val()),
            max_heart_rate : parseInt($('#max-heart-rate').val()),
            exercise_induced_angina : parseInt($('#exercise-induced-agina').val()),
            oldpeak : parseInt($('#oldpeak').val()),
            slope_of_peak_ST_segment : parseInt($('#slope-of-peak-ST-segment').val()),
            num_major_vessel : parseInt($('#num-major-vessels').val()),
            thal: parseInt($('#thal').val())
        }

        fetch(url_const['predict'], {
            method: 'POST',
            body: JSON.stringify(payload),
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

    $('#stat-tab-btn').click(function(e){
        var pred_res = document.getElementById('prediction-result');
        var stat_res = document.getElementById('stats-results');
        var imp_val_res = document.getElementById('important-val-result');
        pred_res.classList.add('hidden');
        imp_val_res.classList.add('hidden');
        stat_res.classList.remove('hidden');
    });
    
    $('#pred-tab-btn').click(function(e){
        var pred_res = document.getElementById('prediction-result');
        var stat_res = document.getElementById('stats-results');
        var imp_val_res = document.getElementById('important-val-result');
        pred_res.classList.remove('hidden');
        imp_val_res.classList.add('hidden');
        stat_res.classList.add('hidden');
    });
    $('#important-val-tab-btn').click(function(e){
        var pred_res = document.getElementById('prediction-result');
        var stat_res = document.getElementById('stats-results');
        var imp_val_res = document.getElementById('important-val-result');
        pred_res.classList.add('hidden');
        imp_val_res.classList.remove('hidden');
        stat_res.classList.add('hidden');
    })

    generateImportantVal();
});




//Plotly Helper

function generateImportantVal(){
    fetch(url_const['important_val'], {
        method : 'GET',
        headers : {'Content-Type' : 'application/json'}
    })
    .then(res => res.json())
    .then(data => {
        var chart_data  = [{
            values : [],
            labels : [],
            type :'pie'
        }];

        var layout = {

        }

        Plotly.newPlot('important-val-result', chart_data, layout, {responsive : true});
    });
}


function generateScatter(male_age, male_data, female_age, female_data, item){
        var male = {
            x : male_age,
            y : male_data,
            mode: 'markers',
            type: 'scatter',
            name: 'Male'
        }

        var female = {
            x : female_age,
            y : female_data,
            mode: 'markers',
            type: 'scatter',
            name: 'Female'
        }

        var layout = {
            xaxis: {
                title: 'Age',
                titlefont: {
                    family: 'Arial, sans-serif',
                    size: 18
                }
            },
            yaxis: {
                title: column_alias[item],
                titlefont: {
                    family: 'Arial, sans-serif',
                    size: 18
                }
            },
        }
        var data = [male, female];
        Plotly.newPlot('stats-results', data, layout,  {responsive: true});
}