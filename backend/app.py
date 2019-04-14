
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
@api.route('/api/stats/<feature_name>')
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
@api.route('/api/predict')
class Prediction(Resource):
	@api.response(200, 'Success')
	@api.response(400, 'Error')
	def post(self):
		payload = api.payload
        #get a json_obj of single record as user_input
		data = []
		data.append(payload['age'])
		data.append(payload['sex'])
		data.append(payload['chest_pain_type'])
		data.append(payload['resting_blood_pressure'])
		data.append(payload['serum_cholestoral'])
		data.append(payload['fasting_blood_sugar'])
		data.append(payload['resting_electrocardiographic'])
		data.append(payload['max_heart_rate'])
		data.append(payload['exercise_induced_agina'])
		data.append(payload['oldpeak'])
		data.append(payload['slope_of_peak_ST_segment'])
		data.append(payload['num_major_vessels'])
		data.append(payload['thal'])
		print(data)
		predict_num = predict_target([data])
		print(predict_num)
		return {'target' : predict_num} , 200
		#else:
		#	return {'message' : 'ERROR:invalid input' } , 400


'''api for important factors'''
@api.route('/api/important_factors')
class ImportantFactors(Resource):
	@api.response(200, 'Success')
	def get(self):
		dict_weights = important_factors()
		return dict_weights, 200
		

if __name__ == '__main__':
	db_file = 'data.db'
	create_db(db_file)
	app.run(debug=True)