import json
import bcrypt
import jwt
from django.conf import settings
from django.db import models
# from PyPDF2 import PdfFileReader
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
# from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection, IntegrityError
from django.http import QueryDict
# from django.shortcuts import get_object_or_404
import base64
from django.http import JsonResponse, HttpResponse, Http404
import os
from .models import JoinCourseRequest
import io
import pandas as pd
from django.core.files.uploadedfile import UploadedFile
from .models import AssignmentSubmission

#registration######################################################################
@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')  
        if not (username and email and password and role):
            return JsonResponse({'error': 'Username, email, password, and role are required'}, status=400)

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS custom_user (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(150) UNIQUE NOT NULL,
                    email VARCHAR(254) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(255) NOT NULL
                )
            ''')

            cursor.execute("INSERT INTO custom_user (username, email, password, role) VALUES (%s, %s, %s, %s)", (username, email, hashed_password, role))
        
        return JsonResponse({'message': 'User registered successfully'}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    except IntegrityError:
        return JsonResponse({'error': 'Username or email already exists'}, status=400)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    


#login###################################################################################
@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    if not (email and password):
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, password, role FROM custom_user WHERE email = %s", [email])
            row = cursor.fetchone()
            if row:
                user_id, stored_password, role = row

                if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                    payload = {'user_id': user_id}
                    jwt_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
                    
                    response_data = {'token': jwt_token, 'role': role}
                    return JsonResponse(response_data, status=200)
                    
                else:
                    return JsonResponse({'error': 'Invalid email or password'}, status=400)
            else:
                return JsonResponse({'error': 'User does not exist'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



#added the course###########################################################################
class myapp_course_table(models.Model):
    unique_id = models.AutoField(primary_key=True)
    course = models.CharField(max_length=255, unique=True)
    mentor = models.CharField(max_length=255)
    modules = models.CharField(max_length=255)
    description = models.TextField()
    fees = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return self.course

@csrf_exempt
@require_http_methods(["POST"])
def add_course(request):
    try:
        data = json.loads(request.body)
        course = data.get('course')
        mentor = data.get('mentor')
        modules = data.get('modules')
        description = data.get('description')
        fees = data.get('fees')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    if not (course and mentor and modules and description and fees):
        return JsonResponse({'error': 'All fields are required'}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO myapp_course_table (course, mentor, modules, description, fees)
                VALUES (%s, %s, %s, %s, %s)
            """, [course, mentor, modules, description, fees])
        return JsonResponse({'message': 'Course added successfully'}, status=201)
    except IntegrityError:
        return JsonResponse({'error': 'Course name must be unique'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# course_column ##############################################################################
@csrf_exempt
@require_http_methods(["GET"])
def course_name(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT course FROM myapp_course_table")
            courses = [row[0] for row in cursor.fetchall()]
        return JsonResponse({'courses': courses}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_course(request, course_name):
    try:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM myapp_course_table WHERE course = %s", [course_name])
        return JsonResponse({'message': 'Course deleted successfully!'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

#course_details################################################################################
@csrf_exempt
@require_http_methods(["GET", "POST"])
def course_details(request, course_name=None):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            course_name = data.get('course')
            if not course_name:
                return JsonResponse({'error': 'Course name is required'}, status=400)
        
        if not course_name:
            return JsonResponse({'error': 'Course name is required'}, status=400)

        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM myapp_course_table WHERE course = %s", [course_name])
            row = cursor.fetchone()
            if row:
                columns = [col[0] for col in cursor.description]
                course_data = dict(zip(columns, row))
                return JsonResponse({'course': course_data}, status=200)
            else:
                return JsonResponse({'error': 'Course not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
def update_course_details(request):
    try:
        data = json.loads(request.body)
        course_id = data.get('unique_id')
        course_name = data.get('course')
        course_modules = data.get('modules')
        course_description = data.get('description')
        course_fees = data.get('fees')
        if not course_id:
            return JsonResponse({'error': 'Course ID is required'}, status=400)
        if not course_name:
            return JsonResponse({'error': 'Course name is required'}, status=400)
        with connection.cursor() as cursor:
            cursor.execute("UPDATE myapp_course_table SET course = %s, description = %s, modules = %s, fees = %s WHERE unique_id = %s",
                           [course_name, course_description, course_modules, course_fees, course_id])
            return JsonResponse({'message': 'Course details updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
#video_source ##################################################################################
@csrf_exempt
@require_http_methods(["POST"])
def video_source(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)            
            modules = data.get('modules')
            
            if not modules:
                return JsonResponse({'error': 'Module name is required'}, status=400)
            
            video_path = f"/home/shan/Music/OEM/Backend_org/Backend/video_source/python_videos/{modules}.mp4"
            if os.path.exists(video_path):
                with open(video_path, 'rb') as file:
                    video_blob = base64.b64encode(file.read()).decode('utf-8')
                return JsonResponse({'video_blob': video_blob}, status=200)
            else:
                return JsonResponse({'error': f'Video file for module "{modules}" not found'}, status=404)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



#Teacher post the quize #########################################################################
@csrf_exempt
def teacher_quize(request):
    if request.method == 'POST':
        try:
            file = request.FILES['file'] 
            df = pd.read_csv(file) 
            # print(df)
            required_columns = ['Questions', 'A', 'B', 'C', 'D', 'Answers']
            if not all(col in df.columns for col in required_columns):
                return JsonResponse({'error': 'Columns "Questions", "A", "B", "C", "D", and "Answers" are required in the file'}, status=400)

            create_table_sql = '''
                CREATE TABLE IF NOT EXISTS teacher_quize (
                    id SERIAL PRIMARY KEY,
                    question TEXT NOT NULL,
                    a TEXT NOT NULL,
                    b TEXT NOT NULL,
                    c TEXT NOT NULL,
                    d TEXT NOT NULL,
                    answer TEXT NOT NULL
                )
            '''
            with connection.cursor() as cursor:
                cursor.execute(create_table_sql)

            with connection.cursor() as cursor:
                for _, row in df.iterrows():
                    question = row['Questions']
                    a = row['A']
                    b = row['B']
                    c = row['C']
                    d = row['D']
                    answer = row['Answers']
                    cursor.execute(
                        'INSERT INTO teacher_quize (question, a, b, c, d, answer) VALUES (%s, %s, %s, %s, %s, %s)',
                        (question, a, b, c, d, answer)
                    )

            return JsonResponse({'message': 'Data imported successfully'}, status=201)

        except KeyError:
            return JsonResponse({'error': 'File not provided in request'}, status=400)

        except IntegrityError:
            return JsonResponse({'error': 'Table already exists'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def get_quiz_data(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT question, a, b, c, d, answer FROM teacher_quize')
                rows = cursor.fetchall()
                quizzes = [
                    {'question': row[0], 'a': row[1], 'b': row[2], 'c': row[3], 'd': row[4], 'correct': row[5]}
                    for row in rows
                ]
            return JsonResponse({'quizzes': quizzes}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def check_quiz_answers(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            results = []

            with connection.cursor() as cursor:
                for item in data['answers']:  
                    question = item['question']
                    # print(question)
                    selected_answer = item['selectedAnswer']
                    # print(selected_answer)
                    cursor.execute('SELECT answer FROM teacher_quize WHERE question = %s', [question])
                    correct_answer = cursor.fetchone()
                    # print(correct_answer)

                    if correct_answer and selected_answer == correct_answer[0]:
                        results.append({'question': question, 'correct': True})
                    else:
                        results.append({'question': question, 'correct': False, 'correctAnswer': correct_answer[0] if correct_answer else None})

            correct_count = sum(1 for result in results if result['correct'])
            return JsonResponse({'results': results, 'correct_count': correct_count}, status=200)
        except Exception as e:
            print(f"Error checking quiz answers: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def teacher_assignment(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS teacher_assignment (
                    id SERIAL PRIMARY KEY,
                    questions TEXT NOT NULL,
                    answer TEXT NOT NULL
                )
            ''')

        if request.method == 'POST':
            file = request.FILES.get('file')
            # print(file)
            try:
                df = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=400)

            if 'Questions' not in df.columns or 'Answers' not in df.columns:
                return JsonResponse({'error': 'Columns "Questions" and "Answers" are required in the file'}, status=400)

            with connection.cursor() as cursor:
                for index, row in df.iterrows():
                    questions = row['Questions']
                    answer = row['Answers']
                    cursor.execute("INSERT INTO teacher_assignment (questions, answer) VALUES (%s, %s)", (questions, answer))

            return JsonResponse({'message': 'Data imported successfully'}, status=201)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

    except IntegrityError:
        return JsonResponse({'error': 'Table already exists'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
def check_assignment_count(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM teacher_assignment")
            count = cursor.fetchone()[0]
            result = count // 5
            return JsonResponse({'Assignmnet': result}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def show_teacher_assignments(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT questions FROM teacher_assignment')
            rows = cursor.fetchall()
            questions = [row[0] for row in rows]
        return JsonResponse({'questions': questions}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def student_assignment_answer(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS student_assignment_answer(
                id SERIAL PRIMARY KEY,
                Questions TEXT NOT NULL,
                Answers TEXT NOT NULL
            )
            ''')

        if request.method == 'POST':
            file = request.FILES.get('file')
            if not file:
                return JsonResponse({'error': 'No file uploaded'}, status=400)

            try:
                data = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
            except Exception as e:
                return JsonResponse({'error': f'Error reading CSV file: {str(e)}'}, status=400)

            if 'Questions' not in data.columns or 'Answers' not in data.columns:
                return JsonResponse({'error': 'CSV file must contain "Questions" and "Answers" columns'}, status=400)

            questions = data['Questions']
            answers = data['Answers']

            with connection.cursor() as cursor:
                for question, answer in zip(questions, answers):
                    cursor.execute('''
                    INSERT INTO student_assignment_answer (Questions, Answers)
                    VALUES (%s, %s)
                    ''', [question, answer])

            return JsonResponse({'message': 'Answers inserted successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)    


@csrf_exempt
def check_assingment_answer(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT s.Answers AS student_answer, t.answer AS correct_answer
                FROM student_assignment_answer s
                INNER JOIN teacher_assignment t ON s.Questions = t.questions
            ''')
            rows = cursor.fetchall()

            correct_count = 0
            incorrect_count = 0
            results = []

            for student_answer, correct_answer in rows:
                if student_answer == correct_answer:
                    correct_count += 1
                else:
                    incorrect_count += 1
                results.append({'student_answer': student_answer, 'correct_answer': correct_answer})

            return JsonResponse({
                'correct_count': correct_count,
                'incorrect_count': incorrect_count,
                'results': results
            }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get_user_count(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM custom_user")
            row = cursor.fetchone()
            user_count = row[0] if row else 0
            
            return JsonResponse({'user_count': user_count}, status=200)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)



#chat_box#####################################################################
with connection.cursor() as cursor:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chatBox (
            id SERIAL PRIMARY KEY,
            message TEXT NOT NULL,
            user_role TEXT NOT NULL,
            course_name TEXT NOT NULL
        )
    ''')

@csrf_exempt
def handle_chat_message(request, role, course_name):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '')

            if not message:
                return JsonResponse({'error': 'Message cannot be empty'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO chatBox (message, user_role, course_name)
                    VALUES (%s, %s, %s)
                ''', [message, role, course_name])

            return JsonResponse({'message': 'Chat message stored successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT message, user_role FROM chatBox WHERE course_name = %s
                ''', [course_name])
                messages = cursor.fetchall()
                response_data = [{'text': message, 'sender': user_role} for message, user_role in messages]

            return JsonResponse({'messages': response_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    


with connection.cursor() as cursor:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS discussionForum (
            id SERIAL PRIMARY KEY,
            message TEXT NOT NULL,
            user_role TEXT NOT NULL
        )
    ''')

@csrf_exempt
def handle_discussion_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '')
            user_role = data.get('user_role', 'null')

            if not message:
                return JsonResponse({'error': 'Message cannot be empty'}, status=400)

            with connection.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO discussionForum (message, user_role)
                    VALUES (%s, %s)
                ''', [message, user_role])

            return JsonResponse({'message': 'Discussion message stored successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    elif request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT message, user_role FROM discussionForum
                ''')
                messages = cursor.fetchall()
                response_data = [{'message': message, 'user_role': user_role} for message, user_role in messages]

            return JsonResponse({'messages': response_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
def delete_all_messages(request):
    if request.method == 'DELETE':
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    DELETE FROM discussionForum
                ''')
            return JsonResponse({'message': 'All discussion messages deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)



#livestream#######################################################
with connection.cursor() as cursor:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS liveStreamingLinks (
            id SERIAL PRIMARY KEY,
            link TEXT NOT NULL
        )
    ''')

@csrf_exempt
def save_live_streaming_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            link = data.get('link')
            if link:
                with connection.cursor() as cursor:
                    cursor.execute('''
                        INSERT INTO liveStreamingLinks (link)
                        VALUES (%s)
                    ''', [link])
                return JsonResponse({'message': 'Link saved successfully'}, status=201)
            else:
                return JsonResponse({'error': 'Link is required'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

    
@csrf_exempt
def get_latest_live_streaming_link(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute('''
                    SELECT link FROM livestreaminglinks ORDER BY id DESC LIMIT 1
                ''')
                row = cursor.fetchone()
                if row:
                    link = row[0]
                    return JsonResponse({'link': link}, status=200)
                else:
                    return JsonResponse({'link': None}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def grade_tracking(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT COUNT(*)
                FROM student_assignment_answer s
                INNER JOIN teacher_assignment t ON s.Questions = t.questions
                WHERE s.Answers = t.answer
            ''')
            correct_count = cursor.fetchone()[0]

        return JsonResponse({
            'correct_count': correct_count
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


with connection.cursor() as cursor:
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS studentReport (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            join_course TEXT NOT NULL,
            modules TEXT NOT NULL,
            performance TEXT NOT NULL
        )
    ''')

@csrf_exempt
def save_student_report(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            join_course = data.get('joinCourse')
            modules = data.get('modules')
            performance = data.get('performance')
            
            if name and join_course and modules and performance:
                with connection.cursor() as cursor:
                    cursor.execute('''
                        INSERT INTO studentReport (name, join_course, modules, performance)
                        VALUES (%s, %s, %s, %s)
                    ''', [name, join_course, modules, performance])
                return JsonResponse({'message': 'Report saved successfully'}, status=201)
            else:
                return JsonResponse({'error': 'All fields are required'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def view_report(request):
    if request.method == 'GET':
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM studentReport')
                reports = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                results = [
                    dict(zip(columns, row))
                    for row in reports
                ]
                return JsonResponse({'reports': results}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

