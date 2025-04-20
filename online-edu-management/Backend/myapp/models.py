from django.db import models
from django.contrib.auth.models import User

# from django.contrib.auth.models import AbstractUser


class AssignmentSubmission(models.Model):
    questions = models.CharField(max_length=100) 
    answer = models.CharField(max_length=100)     
#     pass
class JoinCourseRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=255)
    email = models.EmailField()
    status = models.CharField(max_length=20, blank=True, null=True)  

    def __str__(self):
        return f"{self.user.username} - {self.course_name}"
# myapp/models.py

# myapp/migrations/0001_initial.py


# from django.db import models

# class MyappCourseTable(models.Model):
#     unique_id = models.AutoField(primary_key=True)
#     course = models.CharField(max_length=255, unique=True)
#     mentor = models.CharField(max_length=255)
#     modules = models.CharField(max_length=255)
#     description = models.TextField()
#     fees = models.DecimalField(max_digits=10, decimal_places=2)

#     def __str__(self):
#         return self.course
