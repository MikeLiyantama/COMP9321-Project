# COMP9321-Project

## Introduction

In this assignment, we created a web app based on a heart diease dataset and use machine learning algorithms to make predictions on important factors relevant to heart dieases.

## Organisation
Firstly, we divide our project into two part: backend and frontend.
Secondly, we use Machine Learning - decision tree algorithm to make prediction. 
Then we use cross validation method to increase the accuracy of the prediction.
 
## Tasks
 - **Dataset Collection**
 - **UI Design**
 - **Machine Learning**
 - **Optimization algorithm**
 - **API Server**
 
## Frame
 - Frontend
 - Backend
 - README.md

## RawData
Dataset from http://www.cse.unsw.edu.au/~cs9321/19T1/assn/heart.tar.

## DataCleaning
 - Convert data to csv format
 - Drop Invalid Data
 - Fill Missing Data By Median or Average

## ModelsTrainning
 - Building decision tree model to make prediction
 - As for decision tree classifier model,we used the information gain and entropy split criteria. We also calculated the accuracy of our decision tree model.

## Optimization Algorithm
 - Use Cross-validation method to improve accuracy of prediction

## Clustering
 - Use K-means and PCA method to cluster features
 
## Tech Stacks
 - **Frontend** : Vanilla Javascript, JQuery, HTML, Materialize CSS
 - **Backend** : Python (Flask), pandas, SQLite
 - **Machine Learning** : Scikit-Learn

## Repo
[COMP9321 Ass3](https://github.com/MikeLiyantama/COMP9321-Project)
![](https://flic.kr/p/2epsBrN)

## Installation & How to Run
 - **Backend**
```
$ cd backend
$ pip install -r requirements.txt #install all packages in requirements.txt
$ python3 app.py
```
   WARNING: Backend URL must be at http://127.0.0.1:5000
 - **Frontend**
```
$ npm install -g http-server //Install http-server globally
$ cd frontend
$ http-server
```
   Open browser at http://localhost:8080
   
## Instructions for reproducing prediction model
- Simply run predict.py and the model will be automaticly generated
