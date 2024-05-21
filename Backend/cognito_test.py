##################### FORGOT PASSWORD, DOESN"T WORK DUE TO IAM ACCESS ###################################

# import requests
# import json

# # Replace this with the actual URL of your password reset endpoint
# api_url = 'http://127.0.0.1:5000/api/auth/forgot-password'

# # Replace this with the username for which you want to request a password reset
# username = 's3284442@student.rmit.edu.au'

# # Create a dictionary with the username
# data = {
#     'username': username
# }

# # Send a POST request to the password reset endpoint
# response = requests.post(api_url, json=data)

# # Parse and print the response
# if response.status_code == 200:
#     result = response.json()
#     if result.get('success'):
#         print("Password reset email sent successfully")
#         print("CodeDeliveryDetails:", result['data']['CodeDeliveryDetails'])
#     else:
#         print("Password reset email request failed. Error:", result.get('message'))
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)




############################### LOGIN FLOW NEW USER #################################################

# import requests
# import json

# # Replace these variables with your actual API endpoint and user credentials
# api_url = 'http://127.0.0.1:5000/api/auth/login'
# email = 's3284442@student.rmit.edu.au'  # Use email as the username
# password = 'NewPassword123!'

# email = 's3821245@student.rmit.edu.au'
# password = 'C5:NW5nw'

# Create a dictionary with the login credentials
# data = {
#     'username': email,  # Use 'username' instead of 'email'
#     'password': password,
#     'auth_flow_type': 'USER_PASSWORD_AUTH'  # Specify the authentication flow type
# }

# # Send a POST request to the login endpoint
# response = requests.post(api_url, json=data)
# result = response.json()
# print(result)
# # Parse and print the response
# if response.status_code == 200:
#     if result.get('success'):
#         print("Login successful")
#         print("ID Token:", result['data']['id_token'])
#         print("Access Token:", result['data']['access_token'])
#     else:
#         print("Login failed. Error:", result.get('message'))
# elif response.status_code == 401 and result.get('message') == "Change password required":
#     # Handle the "ChangePasswordRequired" scenario
#     print("Change password required")
#     print("This is the full result")
#     print(result)
#     print('This is the session required')
#     print(result.get('data', {}).get('Session'))
#     # Replace 'new_password' with the desired new password
#     new_password = 'NewPassword123!'
#     # Complete the password reset challenge
#     challenge_data = {
#         'session': result.get('data', {}).get('Session'),
#         'new_password': new_password,
#         'username': email
#     }
#     complete_password_reset_url = 'http://127.0.0.1:5000/api/auth/complete-password-reset'
#     response = requests.post(complete_password_reset_url, json=challenge_data)
#     print(response)
#     if response.status_code == 200:
#         result = response.json()
#         if result.get('success'):
#             print("Password reset successful")
#         else:
#             print("Password reset failed. Error:", result.get('message'))
#     else:
#         print("HTTP Error during password reset:", response.status_code)
#         print("Response Content:", response.text)
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)


 ##################### RESET PASSWORD GIVEN YOU HAVE A TOKEN ########################################

# import requests
# import json

# # Replace this with the actual URL of your password reset endpoint
# api_url = 'http://127.0.0.1:5000/api/auth/reset-password'

# # Replace this with the username, new password, and confirmation code
# username = 's3284442@student.rmit.edu.au'
# new_password = 'NewPassword123!'
# confirmation_code = '092403'  # confirmation code

# # Create a dictionary with the username, new password, and confirmation code
# data = {
#     'username': username,
#     'new_password': new_password,
#     'confirmation_code': confirmation_code
# }

# # Send a POST request to the password reset endpoint
# response = requests.post(api_url, json=data)

# # Parse and print the response
# if response.status_code == 200:
#     result = response.json()
#     if result.get('success'):
#         print("Password changed successfully")
#     else:
#         print("Password change request failed. Error:", result.get('message'))
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)


########################### LOGOUT ###################################
# import requests
# import json

# # Replace this with the actual URL of your logout endpoint
# api_url = 'http://127.0.0.1:5000/api/auth/logout'

# # Replace this with a valid access token
# access_token = 'eyJraWQiOiJ0WTZVR3Z2VVNkc2FLeEVcL1hVXC9xM0h4ZkpORW9ZUFdlVmxydUI4MGk5bVU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwOWZlYjQ0OC02MGMxLTcwOTMtZmQ2Ni00ZmUzOWY0ZWNkNjYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfekpZdkYxQXk4IiwiY2xpZW50X2lkIjoiNWdvc2xpcDFsOWhtNHJmZDUzdWE4aDNkaXMiLCJvcmlnaW5fanRpIjoiMDUwMzczZjEtYjAwOC00NDliLWFkNDItMGNjYWQyZDNhYzA0IiwiZXZlbnRfaWQiOiI5M2U4NzIwMS03ODk5LTQ0OTYtYTgyNi1hMjEzMTk3YjViNWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjkzNzEyNzA0LCJleHAiOjE2OTM3MTYzMDQsImlhdCI6MTY5MzcxMjcwNCwianRpIjoiYmEwODk2YjctMjljNC00M2VhLWIxOGItY2E1NTk0ZTExNzkwIiwidXNlcm5hbWUiOiIwOWZlYjQ0OC02MGMxLTcwOTMtZmQ2Ni00ZmUzOWY0ZWNkNjYifQ.rlgRavk1ijclie8p-mvd0HSfy4cXJCzmu48iD-dbaK3Cszp0q8xrfCUEgnjqhGAOxYKXswyfBQTe96a1PK6SjhDbJoaWwuZ6GgyX-Lm2F9utXNlKl76USpk34_oovRDh3nfyZaW4QqsdK9bwUGSfppjOP3n2ak0YQiR41h_rv4NE5RXi9dL4v87-koN_O_J-yc5mWbVdA9_QqmU1Qjkw5XtXBLAnUljqNyHl01jNlgK1cDSwmaq_qbG8AArrawsH3KZ6nRbMHrXXZMgzw3rUFsT9_Q28EeRWpFHerdv5vVoYjSLR1u2j1sgxzagMUkPh_dbJbAabC74uDYPi7HHQAQ'
# # Create a dictionary with the access token
# data = {
#     'access_token': access_token
# }

# # Send a POST request to the logout endpoint
# response = requests.post(api_url, json=data)

# # Parse and print the response
# if response.status_code == 200:
#     result = response.json()
#     if result.get('success'):
#         print("User logged out successfully")
#     else:
#         print("Logout request failed. Error:", result.get('message'))
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)



##################### LOGIN AND LOGOUT TEST #############################

import requests
import json

api_url = 'http://Rmit-flask-env-5.eba-kr3dn3ee.ap-southeast-2.elasticbeanstalk.com/api/auth/login'
email = 's3284442@student.rmit.edu.au'  # Use email as the username
password = 'NewPassword123!'

# Create a dictionary with the login credentials
data = {
    'username': email,  # Use 'username' instead of 'email'
    'password': password
}
# Send a POST request to the login endpoint
response = requests.post(api_url, json=data)
print(f"repsonse: {response}")
result = response.json()

# Parse and print the response
if response.status_code == 200:
    if result.get('success'):
        print("Login successful")
        print("ID Token:", result['data']['id_token'])
        print("Access Token:", result['data']['access_token'])
        print("Refresh Token:", result['data']['refresh_token'])
    # Replace this with the actual URL of your logout endpoint
# api_url_logout = 'http://rmit-flask-env-5.eba-kr3dn3ee.ap-southeast-2.elasticbeanstalk.com/api/auth/global-sign-out'
# api_url_revoke_token = 'http://rmit-flask-env-5.eba-kr3dn3ee.ap-southeast-2.elasticbeanstalk.com/api/auth/revoke-token'

# # Replace this with a valid access token
# refresh_token = result['data']['refresh_token']
# access_token =  result['data']['access_token']

# data_r = {
#     'refresh_token':refresh_token
# }
# response = requests.post(api_url_revoke_token, json=data_r)

# if response.status_code == 200:
#     result = response.json()
#     if result.get('success'):
#         print("User revoke token")
#     else:
#         print("Revoke token request failed. Error:", result.get('message'))
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)

# #Create a dictionary with the access token
# data = {
#     'access_token':access_token
# }

# # Send a POST request to the logout endpoint
# response = requests.post(api_url_logout, json=data)

# # Parse and print the response
# if response.status_code == 200:
#     result = response.json()
#     if result.get('success'):
#         print("User logged out successfully")
#     else:
#         print("Logout request failed. Error:", result.get('message'))
# else:
#     print("HTTP Error:", response.status_code)
#     print("Response Content:", response.text)


########################### VALIDATE TOKEN ####################################

# import requests
# import json

# # User login credentials
# email = 's3284442@student.rmit.edu.au'  # Use email as the username
# password = 'NewPassword123!'

# # Login endpoint URL
# login_url = 'http://Rmit-flask-env-5.eba-kr3dn3ee.ap-southeast-2.elasticbeanstalk.com:8080/api/auth/login'

# # Create a dictionary with the login credentials
# login_data = {
#     'username': email,  # Use 'username' instead of 'email'
#     'password': password
# }

# # Send a POST request to the login endpoint
# login_response = requests.post(login_url, json=login_data)
# print(login_response)
# login_result = login_response.json()

# #Check if the login was successful
# if login_response.status_code == 200 and login_result.get('success'):
#     print("Login successful")
    
#     # Retrieve the ID token for authentication
#     id_token = login_result['data']['id_token']
#     access_token = login_result['data']['access_token']
#     #print(f'ID_TOKEN ############# = {id_token}\n\n\n\n')
#     print(f'ACCESS_TOKEN: {access_token}')
# else:
#     print("Login failed")

#API endpoint for the main page
# main_page_url = 'http://127.0.0.1:5000/api/main_page'

# headers = {
#     'Authorization': f'Bearer {access_token}'
# }
# #https://pypi.org/project/Flask-Cognito/
# # Send a GET request to the main page endpoint
# print('making request')
# main_page_response = requests.get(main_page_url, headers=headers)
# print('GETTING RESPONSE')
# main_page_result = main_page_response.json()
# print(main_page_result)
# print(main_page_response)
# # Parse and print the response
# if main_page_response.status_code == 200 and main_page_result.get('success'):
#     print(main_page_result['message'])  # Should print "Welcome to the main page"
# else:
#     print("Access denied or API request failed")




################################### COMPETITOR ADS TEST ##########################
# import requests
# import json

# # Define the API endpoint URL
# api_url = "http://127.0.0.1:5000/api/comp_ads"  # Replace with the actual URL of your API

# # Sample JSON request data
# json_data = {
#     "filter_dict": {
#         "column": "Keyword",
#         "values": ["data science degree"]
#     },
#     "sort_dict": {
#         "column": "Date",
#         "order": "ASC"
#     }
# }

# # Send a POST request to the API
# response = requests.get(api_url, json=json_data)
# print(response)

# # Check if the request was successful (HTTP status code 200)
# if response.status_code == 200:
#     # Parse the JSON response
#     response_data = response.json()
#     print("API Response:")
#     print(json.dumps(response_data, indent=4))  # Pretty-print the JSON response
# else:
#     print(f"API Request failed with status code: {response.status_code}")
#     print(response.text)  # Print the response content for debugging


######################## AD COPIES ###########################################
# import requests
# import json
# # Define the data you want to send to the API
# data = {
#     "courseCode": "MCC123",
#     "courseName": "Data Science",
#     "courseKeyFeatures": ['very cheap','NLP','Machine learning','Flexible timing'],
#     "courseSearchKeywords": ["data science course, engineering course"],
#     "courseUrl": "rmit.edu.au",
#     "campaign_name":"1.Computer Engineering|BR|BMM"
# }

# # Send a POST request to the API endpoint
# response = requests.post(f"http://127.0.0.1:5000/api/chat_gpt_ad", json=data)

# # Check the response status code
# if response.status_code == 200:
#     # Print the API response (JSON)
#     print("API Response:")
#     print(response.json())
# else:
#     print(f"API request failed with status code {response.status_code}")


################################ UPDATE CAMPAIGN ########################################
# import requests
# import json

# data = {
#     "Descriptions": ["Dive into Data Science without breaking the bank. Experience RMIT's flexible, cost-effective program.",'RMIT brings top-tier Data Science education to you. Enjoy flexible learning tailored to your lifestyle.'],
#     "Titles": ['Study Data Science, Not Debt', 'Budget-Friendly Data Science'],
#     "courseCode": 'MCC123',
#     "courseName": 'Data Science'
# }

# response = requests.post(f"http://127.0.0.1:5000/api/start_campaign", json=data)

# print(response.json())

################################ GET CAMPAIGNs ########################################
# import requests
# import json

# response = requests.get(f"http://127.0.0.1:5000/api/get_campaigns")

# print(response.json())
