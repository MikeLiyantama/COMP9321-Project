import pandas as pd
import numpy as np

#for bonus
def cluster():
    data = pd.read_csv('data/processed.cleveland.csv')
    length = len(data)
    data['target2']=data['target'] 
    data.loc[data['target'] !=0,'target2']=1
    data = data[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
           'serum_cholestoral', 'fasting_blood_sugar',
           'resting_electrocardiographic', 'max_heart_rate',
           'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
           'num_major_vessels', 'thal','target2']]
    data.rename(columns={'target2': 'target'},inplace=True)

    newdf = data
    newdf = newdf.apply(lambda x: (x-np.min(x))/ (np.max(x)-np.min(x)) )
    
    weights = important_factors()
    newdf.age = newdf.age * 0.08471801482694986
    newdf.sex = newdf.sex * 0.09084735563132819
    newdf.chest_pain_type = newdf.chest_pain_type * 0.3816496749620156
    newdf.oldpeak = newdf.oldpeak * 0.19941564133385198
    newdf.num_major_vessels = newdf.num_major_vessels * 0.15682256294093277
    newdf.thal = newdf.thal * 0.05221946508684821
    newdf.slope_of_peak_ST_segment=newdf.slope_of_peak_ST_segment*0.034327285218073315
    features=['chest_pain_type', 'oldpeak', 'num_major_vessels', 'sex','age','thal','slope_of_peak_ST_segment']
    newdf=newdf[['chest_pain_type', 'oldpeak', 'num_major_vessels', 'sex','age','thal','slope_of_peak_ST_segment']]

    print(newdf)
