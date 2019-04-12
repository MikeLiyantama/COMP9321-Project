# backend

import pandas as pd
from pandas.io import sql
import sqlite3
from sqlite3 import Error
from flask import Flask
from flask_restplus import Resource, Api
from flask_restplus import fields
from flask_restplus import inputs
from flask_restplus import reqparse
import os
from predict import important_factors
from predict import predict_target
# import another python file


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
api = Api(app)

'''api for frontEnd'''
@api.route('/backend/<feature_name>')
class FrontR(Resource):
	@api.response(200, 'Success')
	@api.response(404, 'Error:Resource does not exist')
	def get(self,feature_name):
		cnx = sqlite3.connect('data.db')
		df = sql.read_sql('select * from ' + 'data', cnx)
		cnx.commit()
		cnx.close()
		# judge the input correct or not
		if feature_name not in df:
			return {'message' : 'ERROR:feature does not exist'},404
		if feature_name.isnumeric() == True:
			return {'message' : 'ERROR:invalid input' } , 404
		else:
			df = {'age' : list(df['age']),
			'sex' : list(df['sex']),
			str(feature_name) : list(df[str(feature_name)])}
        #sent as json
		return df ,200

			

'''api for user_input for target Prediction'''
@api.route('/backend')
class user_input_Prediction(Resource):
	@api.response(200, 'Success')
	@api.response(400, 'Error')
	def post(self):
		data = api.payload
        #get a json_obj of single record as user_input
		L = list()
		L.append(data['age'], data['sex'], data['chest_pain_type'],data['resting_blood_pressure'],data['serum_cholestoral'],data['fasting_blood_sugar'],data['resting_electrocardiographic'],data['max_heart_rate'],data['exercise_induced_agina'],data['oldpeak'],data['slope_of_peak_ST_segment'],data['num_major_vessels'],data['thal'])
		if L.isnumeric() == True:
			Li = list()
			Li.append(L)
			predict_num = predict_target(Li)
			#sent as json
			df = {'target' : list(predict_num)}
			return df , 200
		else:
			return {'message' : 'ERROR:invalid input' } , 400


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