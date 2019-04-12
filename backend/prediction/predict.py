import pandas as pd
import numpy as np

#read clean csv
data = pd.read_csv('data/processed.cleveland.csv')

length = len(data)

data['target2']=data['target'] 
#have disease or not (0=no,otherwise yes)
data.loc[data['target'] !=0,'target2']=1
data = data[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
       'serum_cholestoral', 'fasting_blood_sugar',
       'resting_electrocardiographic', 'max_heart_rate',
       'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
       'num_major_vessels', 'thal','target2']]
data.rename(columns={'target2': 'target'},inplace=True)

#print(data.head())

X = data[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
       'serum_cholestoral', 'fasting_blood_sugar',
       'resting_electrocardiographic', 'max_heart_rate',
       'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
       'num_major_vessels', 'thal']]
y = data[['target']]


# # split to training set and test set
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state = 10)


# scikit-learn.feature_extraction
from sklearn.feature_extraction import DictVectorizer
vec = DictVectorizer(sparse=False)

#print(X_train.to_dict(orient='record'))
X_train = vec.fit_transform(X_train.to_dict(orient='record'))

# print(vec.feature_names_)
# print(X_train)
X_test = vec.transform(X_test.to_dict(orient='record'))

from sklearn.tree import DecisionTreeClassifier
# set DecisionTree Classifier
dtc = DecisionTreeClassifier(criterion='entropy',max_depth = 3,min_impurity_decrease=0.02)
# model learning
dtc.fit(X_train, y_train)
# predict
y_predict = dtc.predict(X_test)


from sklearn.metrics import classification_report
#print predict accuracy
print ('predict accuracy:',dtc.score(X_test, y_test))
print()
#print feature weight
#print("feature weight : ", dtc.feature_importances_)
list_of_weight = dtc.feature_importances_
dict_of_weight = {'age':0, 'chest_pain_type':0, 'exercise_induced_agina':0, 'fasting_blood_sugar':0,
                  'max_heart_rate':0, 'num_major_vessels':0, 'oldpeak':0, 'resting_blood_pressure':0, 
                  'resting_electrocardiographic':0, 'serum_cholestoral':0, 'sex':0, 
                  'slope_of_peak_ST_segment':0, 'thal':0}
number = 0
for k,v in dict_of_weight.items():
    dict_of_weight[k] = list_of_weight[number]
    number+=1
dict_of_weight = sorted(dict_of_weight.items(),key=lambda item:-item[1])
for i in dict_of_weight:
    print(i[0],'%.2f%%' % (i[1] * 100))
print()
print (classification_report(y_predict, y_test, target_names = ['no heart diease','have heart diease']))

# # # ###
# # #this part is aim to transform dot to pdf which is a visualiable result
# # #input in terminal: dot -T pdf /Users/loki/Downloads/9321-predict1.dot -o /Users/loki/Downloads/9321-predict1.pdf命令，即可将.dot转为.pdf

# from sklearn.model_selection import train_test_split
# from sklearn.feature_extraction import DictVectorizer #feature transform
# from sklearn.tree import DecisionTreeClassifier
# from sklearn.metrics import classification_report
# from sklearn import tree
# feature_name = ['age', 'chest_pain_type', 'exercise_induced_agina', 'fasting_blood_sugar', 'max_heart_rate', 'num_major_vessels', 'oldpeak', 'resting_blood_pressure', 'resting_electrocardiographic', 'serum_cholestoral', 'sex', 'slope_of_peak_ST_segment', 'thal']
# target_name = ['no heart diease','heart diease']
# with open("/Users/loki/Downloads/9321-predict1.dot", 'w') as f:
#     f = tree.export_graphviz(dtc,out_file=f,feature_names=feature_name,
#                      class_names=target_name,filled=True,rounded=True,
#                      special_characters=True)


# optimize algorithm by use cross validation
import pandas as pd
import numpy as np
def cv_score(d):
    clf = DecisionTreeClassifier(max_depth=d)
    clf.fit(X_train, y_train)
    return(clf.score(X_train, y_train), clf.score(X_test, y_test))
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
depths = np.arange(1,10)
scores = [cv_score(d) for d in depths]
tr_scores = [s[0] for s in scores]
te_scores = [s[1] for s in scores]

# find the best index for cross validation
tr_best_index = np.argmax(tr_scores)
te_best_index = np.argmax(te_scores)

print("bestdepth:", te_best_index+1, " bestdepth_score:", te_scores[te_best_index], '\n')


#get_ipython().run_line_magic('matplotlib', 'inline')
from matplotlib import pyplot as plt
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

def minsplit_score(val):
    clf = DecisionTreeClassifier(criterion='entropy', min_impurity_decrease=val)
    clf.fit(X_train, y_train)
    return (clf.score(X_train, y_train), clf.score(X_test, y_test), )

# define parameter scale , calculate the score for each training model

vals = np.linspace(0, 0.2, 100)
scores = [minsplit_score(v) for v in vals]
tr_scores = [s[0] for s in scores]
te_scores = [s[1] for s in scores]

bestmin_index = np.argmax(te_scores)
bestscore = te_scores[bestmin_index]
print("bestmin:", vals[bestmin_index])
print("bestscore:", bestscore)

plt.figure(figsize=(6,4), dpi=120)
plt.grid()
plt.xlabel("min_impurity_decrease")
plt.ylabel("Scores")
plt.plot(vals, te_scores, label='test_scores')
plt.plot(vals, tr_scores, label='train_scores')

plt.legend()


def important_factors():
    #read clean csv
    data = pd.read_csv('data/processed.cleveland.csv')
    length = len(data)

    data['target2']=data['target'] 
    #have disease or not (0=no,otherwise yes)
    data.loc[data['target'] !=0,'target2']=1
    data = data[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
           'serum_cholestoral', 'fasting_blood_sugar',
           'resting_electrocardiographic', 'max_heart_rate',
           'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
           'num_major_vessels', 'thal','target2']]
    data.rename(columns={'target2': 'target'},inplace=True)

    #print(data.head())

    X = data[['age', 'sex', 'chest_pain_type', 'resting_blood_pressure',
           'serum_cholestoral', 'fasting_blood_sugar',
           'resting_electrocardiographic', 'max_heart_rate',
           'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment',
           'num_major_vessels', 'thal']]
    y = data[['target']]
    
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state = 10)

    # scikit-learn.feature_extraction
    vec = DictVectorizer(sparse=False)

    #print(X_train.to_dict(orient='record'))
    X_train = vec.fit_transform(X_train.to_dict(orient='record'))
    X_test = vec.transform(X_test.to_dict(orient='record'))

    # set DecisionTree Classifier
    dtc = DecisionTreeClassifier(criterion='entropy',max_depth = 4,min_impurity_decrease=0.01)
    # model learning
    dtc.fit(X_train, y_train)
    # predict
    y_predict = dtc.predict(X_test)

    #print predict accuracy
    print ('predict accuracy:',dtc.score(X_test, y_test))
    print()
    #print feature weight
    #print("feature weight : ", dtc.feature_importances_)
    list_of_weight = dtc.feature_importances_
    dict_of_weight = {'age':0, 'chest_pain_type':0, 'exercise_induced_agina':0, 'fasting_blood_sugar':0,
                      'max_heart_rate':0, 'num_major_vessels':0, 'oldpeak':0, 'resting_blood_pressure':0, 
                      'resting_electrocardiographic':0, 'serum_cholestoral':0, 'sex':0, 
                      'slope_of_peak_ST_segment':0, 'thal':0}

    number = 0
    for k,v in dict_of_weight.items():
        dict_of_weight[k] = list_of_weight[number]
        number+=1
    dict_of_weight = sorted(dict_of_weight.items(),key=lambda item:-item[1])
    for i in dict_of_weight:
        print(i[0],'%.2f%%' % (i[1] * 100))
    print()
    print (classification_report(y_predict, y_test, target_names = ['no heart diease','have heart diease']))
    return dict_of_weight

#recieve a user_input and predict the target
#receive this from api : user_input=[[63,1,1,145,233,1,2,150,0,2.3,3,0,6,0]]
def predict_target(user_input):
    data= np.array(user_input)
    df = pd.DataFrame({'age':data[:,0], 'sex':data[:,1], 'chest_pain_type':data[:,2], 'resting_blood_pressure':data[:,3],
           'serum_cholestoral':data[:,4], 'fasting_blood_sugar':data[:,5],
           'resting_electrocardiographic':data[:,6], 'max_heart_rate':data[:,7],
           'exercise_induced_agina':data[:,8], 'oldpeak':data[:,9], 'slope_of_peak_ST_segment':data[:,10],
           'num_major_vessels':data[:,11], 'thal':data[:,12]})

    newdf = vec.transform(df.to_dict(orient='record'))
    prediction = dtc.predict(newdf)[0]
    return prediction


important_factors()
