from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from predict import important_factors

def clusrt:
    df=pd.read_csv('data/processed.cleveland.csv', header=0, encoding='utf-8')
    df = df.apply(lambda x: (x - np.min(x)) / (np.max(x) - np.min(x)))
    df['target2']=df['target']
    #have disease or not (0=no,otherwise yes)
    df.loc[df['target'] !=0,'target2']=1
    df = df[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
           'serum_cholestoral', 'fasting_blood_sugar',
           'resting_electrocardiographic', 'max_heart_rate',
           'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
           'num_major_vessels', 'thal','target2']]
    df.rename(columns={'target2': 'target'},inplace=True)

    #give weight to factor by preduct result
    weight_of_factor = important_factors()
    dict_of_weight = {}
    length_of_features = len(weight_of_factor)
    for i in range(0,length_of_features):
        d[weight_of_factor[i][0]] = weight_of_factor[i][1]

    df['thal'] = df.apply(lambda x: x*d['thal'])
    df['chest_pain_type'] = df.apply(lambda x: x*d['chest_pain_type'])
    df['num_major_vessels'] = df.apply(lambda x: x*d['num_major_vessels'])
    df['oldpeak'] = df.apply(lambda x: x*d['oldpeak'])
    df['age'] = df.apply(lambda x: x*d['age'])
    df['max_heart_rate'] = df.apply(lambda x: x*d['max_heart_rate'])
    df['exercise_induced_agina'] = df.apply(lambda x: x*d['exercise_induced_agina'])
    df['fasting_blood_sugar'] = df.apply(lambda x: x*d['fasting_blood_sugar'])
    df['resting_blood_pressure'] = df.apply(lambda x: x*d['resting_blood_pressurer'])
    df['resting_electrocardiographic'] = df.apply(lambda x: x*d['resting_electrocardiographic'])
    df['serum_cholestoral'] = df.apply(lambda x: x*d['serum_cholestoral'])
    df['sex'] = df.apply(lambda x: x*d['sex'])
    df['slope_of_peak_ST_segment'] = df.apply(lambda x: x*d['fasting_slope_of_peak_ST_segment'])

    df1 = df
    df1=df1.iloc[:,:]
    #print(df1.head())
    kmeans = KMeans(n_clusters=2, random_state=10).fit(df1)
    df1['adv']=kmeans.labels_
    df_count_type=df1.groupby('adv').apply(np.size)
    

     
    #number of type
    df_count_type
    #cluster center
    kmeans.cluster_centers_

    new_df=df1[:]
    new_df

    #use PCA to reduce dimension to 2
    pca = PCA(n_components=2)
    new_pca = pd.DataFrame(pca.fit_transform(new_df))

    #visualization cluster
    d = new_pca[new_df['adv'] == 0]
    plt.plot(d[0], d[1], 'r.')
    d = new_pca[new_df['adv'] == 1]
    plt.plot(d[0], d[1], 'go')
    plt.gcf().savefig('kmeans.png')
    plt.show()


    #compare accurarcy by using PCA
    result_adv=[]
    for i in df1['adv']:
        result_adv.append(i)
    result_target=[]
    for i in df['target']:
        result_target.append(i)
    length = len(result_adv)
    count = 0
    for i in range(0,length):
        if result_adv[i] == result_target[i]:
            count+=1
    print('accurary:',count/length)
    return new_df
