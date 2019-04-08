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
from gevent.pywsgi import WSGIServer

def create_db(db_file):
	""" create a database connection to a SQLite database """
	try:
		cnx = sqlite3.connect(db_file)
	except Error as e:
		print(Error)
	finally:
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
		if df.feature_name.unique() == NULL:
			return 'ERROR:feature does not exist',404
		if feature_name.isnumeric() == True:
			return 'ERROR:invalid input',404
		else:
			df = df.loc['age','sex',feature_name]
			return df_to_json(df),200


'''api for NN'''
@api.route('/backend')
class NNet(Resource):
	@api.response(200, 'Success')
	@api.response(404, 'Error:Resource does not exist')
	def get(self, age,sex,chest_pain_type,resting_blood_pressure,serum_cholestoral,fasting_blood_sugar,resting_electrocardiographic,max_heart_rate,exercise_induced_agina,oldpeak,slope_of_peak_ST_segment,num_major_vessels,thal):
		L = list()
		L.append('age', 'sex', 'chest_pain_type', 'resting_blood_pressure', 'serum_cholestoral', 'fasting_blood_sugar', 'resting_electrocardiographic', 'max_heart_rate', 'exercise_induced_agina', 'oldpeak', 'slope_of_peak_ST_segment', 'num_major_vessels', 'thal')
		if L.isnumeric() == True:
			return L,200
		else:
			return 'ERROR:invalid input', 404

if __name__ == '__main__':
	db_file = 'data.db'
	create_db(db_file)
	load_csv()
	http_server = WSGIServer(('', 5000), app)
	http_server.serve_forever()