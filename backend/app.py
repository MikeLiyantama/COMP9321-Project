
import os
import sqlite3
from sqlite3 import Error
import pandas as pd
from pandas.io import sql

from flask import Flask
from flask_restplus import Resource, Api, fields, inputs, reqparse

from prediction.predict import important_factors, predict_target

from flask_cors import CORS


""" create a database connection to a SQLite database """
def create_db(db_file):
	if os.path.isfile(db_file):
		#judge if there already had the database
		db_exists = True
	else:
		db_exists = False
		try:
			cnx = sqlite3.connect(db_file)
		except Error as e:
			print(Error)
		finally:
			if db_exists == False:
				load_csv()
				cnx.close()

"""inject csv to the dataframe"""
def load_csv():
	df = pd.read_csv('data/processed.cleveland.csv')
	cnx = sqlite3.connect('data.db')
	sql.to_sql(df, name = 'data', con=cnx, if_exists='append')
	cnx.commit()
	cnx.close()



app = Flask(__name__)
CORS(app)
api = Api(app)

'''api for frontEnd'''
@api.route('/stats/<feature_name>')
class FrontR(Resource):
	@api.response(200, 'Success')
	@api.response(400, 'Resource not Found')
	@api.response(400, 'Invalid Input')
	def get(self,feature_name):
		cnx = sqlite3.connect('data.db')
		df = sql.read_sql('select * from ' + 'data', cnx)
		cnx.commit()
		cnx.close()
		# judge the input correct or not
		if feature_name not in df:
			return {'message' : 'Resource not Found'},400
		if feature_name.isnumeric() == True:
			return {'message' : 'Invalid Input' } , 400
		else:
			df = {'age' : list(df['age']),
			'sex' : list(df['sex']),
			str(feature_name) : list(df[str(feature_name)])}

		return df ,200

			

'''api for user_input for target Prediction'''
@api.route('/predict')
class Prediction(Resource):
	@api.response(200, 'Success')
	@api.response(400, 'Error')
	def post(self):
		data = api.payload
        #get a json_obj of single record as user_input
		L = list()
		L.append(data['age'])
		L.append(data['sex'])
		L.append(data['chest_pain_type'])
		L.append(data['resting_blood_pressure'])
		L.append(data['serum_cholestoral'])
		L.append(data['fasting_blood_sugar'])
		L.append(data['resting_electrocardiographic'])
		L.append(data['max_heart_rate'])
		L.append(data['exercise_induced_agina'])
		L.append(data['oldpeak'])
		L.append(data['slope_of_peak_ST_segment'])
		L.append(data['num_major_vessels'])
		L.append(data['thal'])
		Li = list()
		Li.append(L)
		predict_num = predict_target(Li)
		#sent as json
		print(predict_num)
		return {'target' : predict_num} , 200
		#else:
		#	return {'message' : 'ERROR:invalid input' } , 400


'''api for important factors'''
@api.route('/important')
class important_factors_weights(Resource):
	@api.response(200, 'Success')
	def post(self):
		dict_weights = important_factors()
		return dict_weights, 200
		

if __name__ == '__main__':
	db_file = 'data.db'
	create_db(db_file)
	app.run(debug=True)