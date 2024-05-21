import openai
import google.generativeai as genai
import os
from sqlalchemy import create_engine, text

def create_rs_connection():
    # Redshift Database Connection
    DRIVER = 'redshift+redshift_connector'
    HOST = 'ad-scraping.308731136394.ap-southeast-2.redshift-serverless.amazonaws.com'
    RS_PORT = '5439'
    DATABASE = 'dev'
    USERNAME = 'admin'
    PWD = '#Rmit_ai_team2'

    # Build the SQLAlchemy database connection engine for Redshift
    engine = create_engine(f'{DRIVER}://{USERNAME}:{PWD}@{HOST}:{RS_PORT}/{DATABASE}')
    print(f"Connection to Redshift database created successfully on port {RS_PORT}.")
    return engine

# Configure API keys for OpenAI and Google
# Set your API key
openai.api_key = ""
def chat_with_chatgpt(prompt, model="gpt-4"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        temperature=0.5,
    )
    message = response['choices'][0]['message']['content'].strip()
    return message


os.environ['GOOGLE_API_KEY']="AIzaSyAcCz6RmiJWhTB5Dmb0mtn-jayLtWWHP40"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model_gemini = genai.GenerativeModel('gemini-pro')

def fetch_competitor_ads(keyword_search):
    with rs_connection.connect() as conn:
        conn.execute('SET enable_case_sensitive_identifier TO true;')
        query = f'''SELECT DISTINCT "Title", "Description" 
                    FROM scraped_ads 
                    WHERE LOWER("Keyword") IN ('{keyword_search}') 
                    LIMIT 10'''
        comp_ads = conn.execute(text(query)).fetchall()
    return comp_ads

def create_prompt(course_name, key_features, comp_ads):

    # prompt = f'''Create 4 different ad copies and 15 titles for promoting this RMIT course on google ads: {course_name}
    # Please keep each title to be of maximum 30 characters and each description to be of max 90 characters as per google ads guidelines.
    # These are some of the key course features: {key_features}
    # These are some of the ad copies from competitors, take inspiration from them, but never directly mention any competitor school names: {comp_ads}'''
    
    prompt = f'''Develop four unique advertising copy versions and fifteen concise titles to market
      an RMIT course titled '{course_name}' on Google Ads. Ensure each title does not exceed 30 characters, 
      and each ad copy remains under 90 characters, adhering to Google Ads' specifications. Highlight the main 
      features of the course listed under '{key_features}'. Draw inspiration from competitor advertisements provided 
      in '{comp_ads}', but avoid directly naming any competing institutions.'''
    
    return prompt

prompt = create_prompt("data science", "masters", "other uni")

#response by chatgpt
print("\n*******************\ RESULTS FROM CHAT_GPT4 *******************\n")
chatbot_response = chat_with_chatgpt(prompt)
print(chatbot_response)

# response by gemini
print("\n*******************\ RESULTS FROM GEMINI *******************\n")
response = model_gemini.generate_content(prompt)
print(response.text)
