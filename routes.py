from models import db, Year, Expense
from flask import Blueprint,jsonify,render_template,request
from datetime import datetime
from sqlalchemy import text
routes=Blueprint('routes',__name__)

@routes.route('/')
def index():
    return render_template('index.html')

@routes.route('/allexpense',methods=['GET'])
def show_all_expense():
    expenses=Expense.query.all()
    response=[{
        'id':expense.id,'expense_name': expense.expense_name,'expense_amount':expense.expense_amount,'date':expense.date.strftime("%Y-%m-%d")
    } for expense in expenses]

    return jsonify(response)

@routes.route('/expensefilter/<year>/<month>',methods=['GET'])

def expensefilter(year, month):
    query = text('''SELECT expense.id, expense.expense_name, expense.expense_amount, expense.date 
                    FROM expense.expense 
                    JOIN expense.year ON expense.year_id = expense.year.id 
                    WHERE YEAR(expense.date) = :year AND MONTH(expense.date) = :month;''')
    result = db.session.execute(query, {'year': year, 'month': month})
    expenses = result.fetchall()
    response = [{
        'id': expense.id,
        'expense_name': expense.expense_name,
        'expense_amount': expense.expense_amount,
        'date': expense.date.strftime("%Y-%m-%d")
    } for expense in expenses]

    return jsonify(response)


#route for adding an expense

@routes.route('/addexpense',methods=['POST'])

def add_expense():
    data=request.get_json('data')
    print("Received data:", data)  # Log the data for debugging
    if not data:
        return jsonify({'error': 'No data received'}), 400
    
    try:
        expense_name=data['expense_name']
        expense_amount=data['expense_amount']
        raw_date=data['expense_date']
        month=data['expense_month']
        year=data['expense_year']

        #formatted_date= datetime.strptime(raw_date, '%d-%m-%Y').strftime('%Y-%m-%d')

        new_expense=Expense(
            expense_name=expense_name,
            expense_amount=expense_amount,
            date=raw_date,
            month=month,
            year_id=year
        )

        db.session.add(new_expense)
        db.session.commit()

        return jsonify({'message': 'Expense Added Successully'})
    
    except Exception as e:
        return jsonify({'success':False,'message':str(e)}
        )


@routes.route('/delete_expense/<int:expense_id>',methods=['DELETE'])

def delete_expense(expense_id):
    try:
        query=text('DELETE from expense where id= :id')
        result=db.session.execute(query,{'id':expense_id})
        db.session.commit()
        if result.rowcount>0:
            return jsonify({'success':True,'message':'deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success':False,'message':str(e)})

@routes.route('/totalexpense/<int:year>/<int:month>',methods=['GET'])
def total_expense(year,month):
    try:
        query=text('''
            select sum(expense_amount) as total
            from expense 
            where year_id= :year and month= :month
        ''')
        result=db.session.execute(query,{'year':year,'month':month})
        total=result.scalar()
        if total is None:
            total = 0.0
        return jsonify({'success': True, 'total': total})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
