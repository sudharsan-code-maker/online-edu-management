from django.urls import path
from .views import register
from myapp.views import login,course_name, course_details,video_source,add_course,teacher_quize,get_quiz_data,check_quiz_answers,teacher_assignment,show_teacher_assignments,student_assignment_answer,check_assingment_answer,delete_course,get_user_count,check_assignment_count,update_course_details,handle_chat_message,handle_discussion_message,delete_all_messages,save_live_streaming_link,get_latest_live_streaming_link,grade_tracking,save_student_report,view_report
from . import views


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('add-course/', add_course, name='add_course'),
    # path('join_course/', join_course, name='join_course'),
    # path('approve_enrollment/', approve_enrollment, name='approve_enrollment'),
    # path('reject_request/', reject_request, name='reject_request'),
    path('update_course_details/', update_course_details, name='update_course_details'),
    path('delete_course/<str:course_name>/',delete_course, name='delete_course'),
    path('courses/', course_name, name='course_name'),
    path('course_detail/<str:course_name>/', course_details, name='course_details'),
    path('video_source/', video_source, name='video_source'),
    path('teacher_quize/', teacher_quize, name='teacher_quize'),
    path('get_quiz_data/', get_quiz_data, name='get_quiz_data'),
    path('check_quiz_answers/',check_quiz_answers, name='check_quiz_answers'),
    path('teacher_questions/', teacher_assignment, name='teacher_questions'),
    path('check_assignment_count/', check_assignment_count, name='check_assignment_count'),
    path('show_teacher_assignments/', show_teacher_assignments, name='show_teacher_assignments'),
    path('student_assignment_answer/',student_assignment_answer, name='student_assignment_answer'),
    path('check_assingment_answer/',check_assingment_answer, name='check_assingment_answer'), 
    path('get_user_count/',get_user_count, name='get_user_count'), 
    path('handle_chat_message/<str:role>/<str:course_name>/', handle_chat_message, name='handle_chat_message'),
    path('discussion_forum/', handle_discussion_message, name='discussion_forum'),
    path('delete_all_messages/', delete_all_messages, name='delete_all_messages'),
    path('save_live_streaming_link/', save_live_streaming_link, name='save_live_streaming_link'),
    path('get_latest_live_streaming_link/', get_latest_live_streaming_link, name='get_latest_live_streaming_link'),
    path('grade_tracking/', grade_tracking, name='grade_tracking'),
    path('save_student_report/', save_student_report, name='save_student_report'),
    path('view-report/',view_report, name='view-report'),
]
