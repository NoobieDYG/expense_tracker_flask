from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class Year(db.Model):
    __tablename__='year'
    id = db.Column(db.Integer,primary_key=True)
    year=db.Column(db.Integer,nullable=False)

class Expense(db.Model):
    __tablename__='expense'
    id=db.Column(db.Integer,primary_key=True)
    expense_name=db.Column(db.String(100))
    expense_amount=db.Column(db.Float)
    date=db.Column(db.Date)
    year_id=db.Column(db.Integer,db.ForeignKey('year.id'))
    month=db.Column(db.Integer) 