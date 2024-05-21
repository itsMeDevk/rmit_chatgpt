import google.generativeai as genai
import os

os.environ['GOOGLE_API_KEY']="AIzaSyAcCz6RmiJWhTB5Dmb0mtn-jayLtWWHP40"

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

model = genai.GenerativeModel('gemini-pro')


while(1):
    prompt = input("------ASK Gemini ANYTHING---------\n")
    response = model.generate_content(prompt)
    print(response.text)

    exit_button = int(input("Press 1 to exit: "))
    if(exit_button):
        break


    