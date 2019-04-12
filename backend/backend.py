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

def create_db(db_file):
	""" create a database connection to a SQLite database """
	if os.path.isfile(db_file):
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
	df = pd.read_csv('processed.cleveland.csv')
	cnx = sqlite3.connect('data.db')
	sql.to_sql(df, name = 'data', con=cnx, if_exists='append')
	cnx.commit()
	cnx.close()

'''transfer dataframe to json'''
def df_to_json(df):
	result = (df.to_json(orient='records'))
	return result


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
		if df.feature_name.unique() == None:
			return {'message' : 'ERROR:feature does not exist'},404
		if feature_name.isnumeric() == True:
			return {'message' : 'ERROR:invalid input' } , 404
		else:
			df = {'age' : df['age'],
			'sex' : df['sex'],
			feature_name : df[feature_name]}

		return df_to_json(df),200

			

'''api for user_input for target Prediction'''
@api.route('/backend')
class user_input_Prediction(Resource):
	@api.response(200, 'Success')
	@api.response(404, 'Error:Resource does not exist')
	def get(self, json_obj):
                #get a json_obj of single record as user_input
		L = list()
		L.append(json_obj['age'], json_obj['sex'], json_obj['chest_pain_type'],json_obj['resting_blood_pressure'],json_obj['serum_cholestoral'],json_obj['fasting_blood_sugar'],json_obj['resting_electrocardiographic'],json_obj['max_heart_rate'],json_obj['exercise_induced_agina'],json_obj['oldpeak'],json_obj['slope_of_peak_ST_segment'],json_obj['num_major_vessels'],json_obj['thal'])
		if L.isnumeric() == True:
			return L,200
		else:
			return {'message' : 'ERROR:invalid input' } , 404

if __name__ == '__main__':
	db_file = 'data.db'
	create_db(db_file)
	app.run(debug=True)
