from flask import redirect, url_for, Blueprint, session
from flask import request, render_template, redirect, make_response
import json
import pandas as pd
import numpy as np
import re

post_ad = Blueprint('post_ad', __name__)

@post_ad.route('/post_ad')
def recieve_ad():
    return render_template('post_ad.html')

@post_ad.route('/ad_copies', methods=['POST'])
def ad_copies():
    ad_title=request.form.get('ad_title')
    ad_description=request.form.get('ad_description')
    keywords=request.form.get('keywords')

    #Retrieving competitor ads for the same keywords
    kwords=[a.strip() for a in keywords.split(",")]
    kword_search="','".join(kwords)
    comp_ads=rs(f'''select distinct title,description from scraped_ads where keyword in ('{kword_search}') limit 10''').to_dict('records')


    ad_prompt = f'''
Ad Title: {ad_title}
Ad Description: {ad_description}'''
    
    base_prompt='''Write 4 different ad copies of this Ad for promoting RMIT courses, return your response in the form of a python list of lists like this: 
[["title1","description1"],["title2","description2"]] and so on.. 
Return nothing else.'''
    comp_prompt=f'''These are some of the ad copies from competitors, take inspiration from them, but never directly mention any competitor
    school names. {comp_ads}'''


    #Storing original prompt for regen
    session['org_prompt']=ad_prompt+base_prompt+comp_prompt
    response=gpt4(ad_prompt+base_prompt,model='gpt-3.5-turbo') #Response will be a list of lists see base_prompt
    print(response)
    try:
        gpt_copies=extract_gpt_list(response)
    except Exception as e: #Need to make extraction more robust later
        print(e)
        return f'''<h1> Silly Gpt messed up. </h1> <br> {response}'''
    session['gpt_copies'] = gpt_copies


    # Initialize the HTML string with a table header
    ou_html = '<table style="width:100%"><tr><th>Title</th><th>Description</th></tr>'

    # Loop through the ads and append each ad's content to the HTML string
    for ad_pair in gpt_copies:
        title, description = ad_pair
        ou_html += f'<tr><td>{title}</td><td>{description}</td></tr>'

    # Close the table
    ou_html += '</table>'


    # Add "Regenerate" button with a URL redirect
    ou_html += """
    <button onclick="window.location.href='/regen' ">Regenerate</button>
    </body>
    </html>
    """

    return make_response(ou_html, 200)


@post_ad.route('/regen')
def regen():
    #Retrieving session info
    gpt_copies = session.get('gpt_copies', [])
    org_prompt=session['org_prompt']

    response=gpt4(org_prompt,model='gpt-3.5-turbo')
    try:
        gpt_copies_new=extract_gpt_list(response)
    except: #Need to make extraction more robust later
        return f'''<h1> Silly Gpt messed up. </h1> <br> {response}'''
    session['gpt_copies']=session['gpt_copies']+gpt_copies_new

    # Initialize the HTML string with a table header
    ou_html = '<table style="width:100%"><tr><th>Title</th><th>Description</th></tr>'

    # Loop through the ads and append each ad's content to the HTML string
    for ad_pair in gpt_copies:
        title, description = ad_pair
        ou_html += f'<tr><td>{title}</td><td>{description}</td></tr>'

    # Close the table
    ou_html += '</table>'

    # Add "Regenerate" button with a URL redirect
    ou_html += """
    <button onclick="window.location.href='/regen' ">Regenerate</button>
    </body>
    </html>
    """

    return make_response(ou_html, 200)




def extract_gpt_list(text):
    import json

    return json.loads(text)



def gpt4(prompt,cache=True,model="gpt-4",info=False):
    import binascii
    import re
    import os
    import openai
    import requests
    import pickle
    prompt_str=str(prompt)
    if type(prompt)!=list:
        messages=[{"role": "user", "content": prompt}]
    else:
        messages=prompt
    
    directory=f'output/{model}_cache'
    path = f'output/{model}_cache/' + re.sub('\W+', "_", prompt_str[:200])+'_'+str(binascii.crc32(bytes(prompt_str, 'utf-8'))) + '.pick'
    if os.path.exists(path) and cache:
        response = pickle.load(open(path, 'rb'))
    else:
        openai.api_key = "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"
        openai.api_base = "https://api.openai.com/v1"

        response = openai.ChatCompletion.create(
          model=model,
          messages=messages)
        if info:
            print(f"Prompt tokens: {response['usage']['prompt_tokens']}")
            print(f"Response tokens: {response['usage']['completion_tokens']}")
            

        response= json.loads(str(response))['choices'][0]['message']['content']
        #if not os.path.exists(directory): os.makedirs(directory)
        #pickle.dump(response, open(path, 'wb'))
    
    return response


import sqlalchemy
from sqlalchemy.engine.url import URL

# build the sqlalchemy URL
url = URL.create(
drivername='redshift+redshift_connector', # indicate redshift_connector driver and dialect will be used
host='ad-scraping.308731136394.ap-southeast-2.redshift-serverless.amazonaws.com',
port=5439,
database='dev',
username='admin',
password='#Rmit_ai_team2'
)

db_rs = sqlalchemy.create_engine(url)
        
def rs(sql):
    with db_rs.connect() as conn:
        return pd.read_sql(sql,conn)



