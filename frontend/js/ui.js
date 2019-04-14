const url_const = {
    stats : 'http://127.0.0.1:5000/stats/',
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
    exercise_induced_agina : 'Exercise Induced Angina',
    oldpeak : 'Oldpeak',
    slope_of_peak_ST_segment : 'Slope of peak of ST Segment',
    num_major_vessel : 'Number of major vessels',
    thal : 'Thalassemia',
    target : 'Disease status'
}

M.AutoInit();

$(document).ready(function() {
    $('#select-stats').on('change', function(e) {
        $('#stats-results-2').empty();

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
                generateScatter(data, item);
            } else if (item == 'chest_pain_type'){
                generateCPT(data, item);
            } else if (item == 'fasting_blood_sugar'){
                generateFBS(data, item);
            } else if ( item == 'exercise_induced_agina'){
                generateEIA(data, item);
            } else if( item == 'resting_electrocardiographic'){
                generateRE(data, item);
            } else if( item == 'num_major_vessels'){
                generateNMV(data, item);
            } else if( item == 'slope_of_peak_ST_segment'){
                generateSlope(data, item);
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
            exercise_induced_agina : parseInt($('#exercise-induced-agina').val()),
            oldpeak : parseInt($('#oldpeak').val()),
            slope_of_peak_ST_segment : parseInt($('#slope-of-peak-ST-segment').val()),
            num_major_vessels : parseInt($('#num-major-vessels').val()),
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
    /*
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
    */

    //generateImportantVal();
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

function generateScatter(data, item){
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
        Plotly.newPlot('stats-results-1', data, layout,  {responsive: true});
}

function generateCPT(data, item){
    let data_male = {}
    let data_female = {}
    
    data_male['Typical Angin'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['Atypical Angina'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['Non Anginal Pain'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['Asymptomatic'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    data_female['Typical Angin'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['Atypical Angina'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['Non Anginal Pain'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['Asymptomatic'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    for(var i = 0; i< data['age'].length; i++){
        if (data['sex'][i] == 1){ // Male
            if(data[item][i] == 1){
                for(const [key,value] of Object.entries(data_male['Typical Angin'])){
                    if (data['age'][i] < parseInt(key)){
                        data_male['Typical Angin'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 2){
                for(const [key,value] of Object.entries(data_male['Atypical Angina'])){
                    if (data['age'][i] < parseInt(key)){
                        data_male['Atypical Angina'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 3){
                for(const [key,value] of Object.entries(data_male['Non Anginal Pain'])){
                    if (data['age'][i] < parseInt(key)){
                        data_male['Non Anginal Pain'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 4){
                for(const [key,value] of Object.entries(data_male['Asymptomatic'])){
                    if (data['age'][i] < parseInt(key)){
                        data_male['Asymptomatic'][key] += 1;
                        break;
                    }
                }
            }
        } else {
            if(data[item][i] == 1){
                for(const [key,value] of Object.entries(data_female['Typical Angin'])){
                    if (data['age'][i] < parseInt(key)){
                        data_female['Typical Angin'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 2){
                for(const [key,value] of Object.entries(data_female['Atypical Angina'])){
                    if (data['age'][i] < parseInt(key)){
                        data_female['Atypical Angina'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 3){
                for(const [key,value] of Object.entries(data_female['Non Anginal Pain'])){
                    if (data['age'][i] < parseInt(key)){
                        data_female['Non Anginal Pain'][key] += 1;
                        break;
                    }
                }
            }else if(data[item][i] == 4){
                for(const [key,value] of Object.entries(data_female['Asymptomatic'])){
                    if (data['age'][i] < parseInt(key)){
                        data_female['Asymptomatic'][key] += 1;
                        break;
                    }
                }
            }
        }
    }

    //Data Male
    var male_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Typical Angin', data_male),
        type : 'bar',
        name : 'Typical Angin'
    };

    var male_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Atypical Angina', data_male),
        type : 'bar',
        name : 'Atypical Angina'
    };

    var male_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Non Anginal Pain', data_male),
        type : 'bar',
        name : 'Non Anginal Pain'
    };

    var male_4= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Asymptomatic', data_male),
        type : 'bar',
        name : 'Asymptomatic'
    };

    var data = [male_1, male_2, male_3, male_4];
    var layout = {barmode : 'group'};

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});

    //Data Female

    var female_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Typical Angin', data_female),
        type : 'bar',
        name : 'Typical Angin'
    };

    var female_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Atypical Angina', data_female),
        type : 'bar',
        name : 'Atypical Angina'
    };

    var female_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Non Anginal Pain', data_female),
        type : 'bar',
        name : 'Non Anginal Pain'
    };

    var female_4= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('Asymptomatic', data_female),
        type : 'bar',
        name : 'Asymptomatic'
    };

    var data = [female_1, female_2, female_3, female_4];
    var layout = {barmode : 'group'};

    Plotly.newPlot('stats-results-2', data, layout, {responsive : true});
}

function generateFBS(data, item){
    let male_y = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let male_n = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let female_y = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let female_n = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    for(var i = 0; i < data['age'].length; i++){
        if(data['sex'][i] == 1 && data[item][i] == 0){
            for(const [key,value] of Object.entries(male_n)){
                if (data['age'][i] < parseInt(key)){
                    male_n[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 1 && data[item][i] == 1){
            for(const [key,value] of Object.entries(male_y)){
                if (data['age'][i] < parseInt(key)){
                    male_y[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 0 && data[item][i] == 0){
            for(const [key,value] of Object.entries(female_n)){
                if (data['age'][i] < parseInt(key)){
                    female_n[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 0 && data[item][i] == 1){
            for(const [key,value] of Object.entries(female_n)){
                if (data['age'][i] < parseInt(key)){
                    female_n[key] += 1;
                    break;
                }
            }
        }
    }

    var trace1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(female_y),
        type : 'bar',
        name : 'Female, w/ FBS > 120mg/dl'
    };

    var trace2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(male_y),
        type : 'bar',
        name : 'Male, w/ FBS > 120mg/dl'
    };

    var trace3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(female_n),
        type : 'bar',
        name : 'Female, w/ FBS <= 120mg/dl'
    };

    var trace4= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(male_n),
        type : 'bar',
        name : 'Male, w/ FBS <= 120mg/dl'
    };

    var data = [trace1, trace2, trace3, trace4, ];
    var layout = {barmode : 'group'};

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});
}

function generateEIA(data, item){
    let male_y = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let male_n = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let female_y = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    let female_n = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    for(var i = 0; i < data['age'].length; i++){
        if(data['sex'][i] == 1 && data[item][i] == 0){
            for(const [key,value] of Object.entries(male_n)){
                if (data['age'][i] < parseInt(key)){
                    male_n[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 1 && data[item][i] == 1){
            for(const [key,value] of Object.entries(male_y)){
                if (data['age'][i] < parseInt(key)){
                    male_y[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 0 && data[item][i] == 0){
            for(const [key,value] of Object.entries(female_n)){
                if (data['age'][i] < parseInt(key)){
                    female_n[key] += 1;
                    break;
                }
            }
        }else if(data['sex'][i] == 0 && data[item][i] == 1){
            for(const [key,value] of Object.entries(female_n)){
                if (data['age'][i] < parseInt(key)){
                    female_n[key] += 1;
                    break;
                }
            }
        }
    }
    var trace1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(female_y),
        type : 'bar',
        name : 'Female, Yes'
    };

    var trace2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(male_y),
        type : 'bar',
        name : 'Male, Yes'
    };

    var trace3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(female_n),
        type : 'bar',
        name : 'Female, No'
    };

    var trace4= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList_base(male_n),
        type : 'bar',
        name : 'Male, No'
    };

    var data = [trace1, trace2, trace3, trace4, ];
    var layout = {barmode : 'group'};

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});
}

function generateRE(data, item){
    let data_male = {}
    let data_female = {}
    
    data_male['0'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    data_female['0'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    for(var i = 0; i < data['age'].length; i++){
        let tempCol = data[item][i].toString();
        if(data['sex'][i] == 1){
            for(const [key,value] of Object.entries(data_male[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_male[tempCol][key] += 1;
                    break;
                }
            }
        } else {
            for(const [key,value] of Object.entries(data_female[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_female[tempCol][key] += 1;
                    break;
                }
            }
        }
    }

    //Data Male
    var male_0= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('0', data_male),
        type : 'bar',
        name : 'Normal'
    };

    var male_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_male),
        type : 'bar',
        name : 'Having ST-T wave abnormality'
    };

    var male_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_male),
        type : 'bar',
        name : 'Showing probable or definite left ventricular hypertrophy'
    };

    var data = [male_0, male_1, male_2];
    var layout = {
                    barmode : 'group', 
                };

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});


    //Female Plot
    var female_0= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('0', data_female),
        type : 'bar',
        name : 'Normal'
    };

    var female_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_female),
        type : 'bar',
        name : 'having ST-T wave abnormality (T wave inversions) and/or ST elevation or depression'
    };

    var female_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_female),
        type : 'bar',
        name : 'showing probable or definite left ventricular hypertrophy by Estes’ criteria'
    };

    var data = [female_0, female_1, female_2];
    var layout = {
        barmode : 'group',
    };

    Plotly.newPlot('stats-results-2', data, layout, {responsive : true});
}

function generateNMV(data, item){
    let data_male = {}
    let data_female = {}
    
    data_male['0'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['3'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    data_female['0'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['3'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    for(var i = 0; i < data['age'].length; i++){
        let tempCol = data[item][i].toString();
        if(data['sex'][i] == 1){
            for(const [key,value] of Object.entries(data_male[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_male[tempCol][key] += 1;
                    break;
                }
            }
        } else {
            for(const [key,value] of Object.entries(data_female[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_female[tempCol][key] += 1;
                    break;
                }
            }
        }
    }

    //Data Male
    var male_0= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('0', data_male),
        type : 'bar',
        name : '0'
    };

    var male_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_male),
        type : 'bar',
        name : '1'
    };

    var male_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_male),
        type : 'bar',
        name : '2'
    };

    var male_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('3', data_male),
        type : 'bar',
        name : '3'
    };

    var data = [male_0, male_1, male_2, male_3];
    var layout = {
                    barmode : 'group', 
                };

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});


    //Female Plot
    var female_0= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('0', data_female),
        type : 'bar',
        name : '0'
    };

    var female_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_female),
        type : 'bar',
        name : '1'
    };

    var female_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_female),
        type : 'bar',
        name : '2'
    };

    var female_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('3', data_female),
        type : 'bar',
        name : '3'
    };

    var data = [female_0, female_1, female_2, female_3];
    var layout = {
        barmode : 'group',
    };

    Plotly.newPlot('stats-results-2', data, layout, {responsive : true});
}

function generateSlope(data, item){
    let data_male = {}
    let data_female = {}
    
    data_male['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_male['3'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    data_female['1'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['2'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    data_female['3'] = {'10' : 0, '20': 0, '30': 0, '40': 0, '50': 0, '60' : 0, '70': 0, '80': 0, '90' : 0, '100' : 0};
    
    for(var i = 0; i < data['age'].length; i++){
        let tempCol = data[item][i].toString();
        if(data['sex'][i] == 1){
            for(const [key,value] of Object.entries(data_male[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_male[tempCol][key] += 1;
                    break;
                }
            }
        } else {
            for(const [key,value] of Object.entries(data_female[tempCol])){
                if (data['age'][i] < parseInt(key)){
                    data_female[tempCol][key] += 1;
                    break;
                }
            }
        }
    }

    //Data Male
    var male_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_male),
        type : 'bar',
        name : 'Upsloping'
    };

    var male_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_male),
        type : 'bar',
        name : 'Flat'
    };

    var male_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('3', data_male),
        type : 'bar',
        name : 'Downsloping'
    };

    var data = [male_1, male_2, male_3];
    var layout = {
                    barmode : 'group', 
                };

    Plotly.newPlot('stats-results-1', data, layout, {responsive : true});


    //Female Plot
    var female_1= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('1', data_female),
        type : 'bar',
        name : 'Upsloping'
    };

    var female_2= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('2', data_female),
        type : 'bar',
        name : 'Flat'
    };

    var female_3= {
        x : ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'],
        y : getDataList('3', data_female),
        type : 'bar',
        name : 'Downsloping'
    };

    var data = [female_1, female_2, female_3];
    var layout = {
        barmode : 'group',
    };

    Plotly.newPlot('stats-results-2', data, layout, {responsive : true});
}
//Helper Functions
function getDataList (item, data){
    let temp = [];
    for(var key in data[item]){
        temp.push(data[item][key]);
    }
    return temp;
}
function getDataList_base (data){
    let temp =[];
    for(var key in data){
        temp.push(data[key]);
    }
    return temp;
}