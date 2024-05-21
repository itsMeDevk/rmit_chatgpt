import json
import openai
import random
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.functions.auth import cognito_valid_token_required
from src.functions.database import create_rs_connection, store_to_db, update_user_selected
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

# Set your API key for OpenAI
openai.api_key = "sk-proj-1pNKqd0gGuzFii3Q8Iw7T3BlbkFJgCR0ccbHWWfYZefBSeXl"

# Create a Blueprint named 'chat_gpt_ad' with the given name
chat_gpt_ad_bp = Blueprint('chat_gpt_ad', __name__, url_prefix='/api/chat_gpt_ad')

def chat_with_chatgpt(prompt, model="gpt-4"):
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100,
            temperature=0.5,
        )
        message = response['choices'][0]['message']['content'].strip()
        return message
    except openai.error.OpenAIError as e:
        print(f"OpenAI API Error: {str(e)}")
        raise e

def parse_chatgpt_response(response):
    try:
        # Example response parsing assuming response contains JSON-like structure
        # Adjust based on the actual response format from GPT-4
        lines = response.split('\n')
        titles = []
        descriptions = []
        for line in lines:
            if line.startswith("Title:"):
                titles.append(line.replace("Title:", "").strip())
            elif line.startswith("Description:"):
                descriptions.append(line.replace("Description:", "").strip())
        parsed_response = {"titles": titles, "descriptions": descriptions}
        return parsed_response
    except Exception as e:
        print(f"Parsing Error: {str(e)}")
        raise e

@chat_gpt_ad_bp.route('', methods=['POST']) 
@cross_origin()
@cognito_valid_token_required
def get_ad_copies():
    """
    Route to generate ad copies and titles for promoting a course.
    """
    try:
        data = request.json
        print("Received Data:", data)

        course_code = data.get('courseCode', '')
        course_name = data.get('courseName', '')
        course_key_features = data.get('courseKeyFeatures', [])
        course_search_keywords = data.get('courseSearchKeywords', [])
        course_url = data.get('courseUrl', '')
        campaign_name = data.get('campaignName', '')

        kfeatures_str = ", ".join(course_key_features)
        kwords = [a.strip().lower() for a in course_search_keywords]
        kword_search = "','".join(kwords)

        try:
            rs_connection = create_rs_connection()

            with rs_connection.connect() as conn:
                conn.execute(text('SET enable_case_sensitive_identifier TO true;'))
                query = '''SELECT DISTINCT "Title", "Description" 
                           FROM "scraped_ads" 
                           LIMIT 10;'''
                print("Executing Query:", query)
                comp_ads = conn.execute(text(query)).fetchall()
                print("Query Result:", comp_ads)
        except OperationalError as e:
            print(f"Database Connection Error: {str(e)}")
            return jsonify({
                "error": True,
                "success": False,
                "message": "An error occurred while connecting to the database.",
                "data": None
            }), 500

        # Format competitor ads into a string
        comp_ads_str = "\n".join([f"Title: {ad[0]}, Description: {ad[1]}" for ad in comp_ads])

        prompt = f'''Create 4 different ad copies and 15 titles for promoting this RMIT course on google ads: {course_name}
        Please keep each title to be of maximum 30 characters and each description to be of max 90 characters as per google ads guidelines.
        These are some of the key course features: {kfeatures_str}
        These are some of the ad copies from competitors, take inspiration from them, but never directly mention any competitor school names: {comp_ads_str}'''

        try:
            result = chat_with_chatgpt(prompt)
            print("GPT-4 Result:", result)
            parsed_result = parse_chatgpt_response(result)
        except Exception as e:
            print("GPT-4 Error:", e)
            return jsonify({
                "error": True,
                "success": False,
                "message": "An error occurred while generating ad copies.",
                "data": None
            }), 500

        title_scores = [calculate_score(title) for title in parsed_result.get('titles', [])]
        description_scores = [calculate_score(description) for description in parsed_result.get('descriptions', [])]

        store_to_db(parsed_result.get('titles', []), title_scores, parsed_result.get('descriptions', []), description_scores, course_name, course_code, kword_search, kfeatures_str, course_url, campaign_name)

        response_data = {
            "Titles": parsed_result.get('titles', []),
            "Title_Scores": title_scores,
            "Descriptions": parsed_result.get('descriptions', []),
            "Description_Scores": description_scores
        }
        print("Response Data:", response_data)

        return jsonify({
            "error": False,
            "success": True,
            "message": "Chat GPT ad copies data retrieved successfully",
            "data": response_data
        }), 200

    except Exception as e:
        print("Overall Error:", e)
        return jsonify({
            "error": True,
            "success": False,
            "message": f"An error occurred 1: {str(e)}",
            "data": None
        }), 500

# Define additional routes for other endpoints
start_campaign_bp = Blueprint('start_campaign', __name__, url_prefix='/api/start_campaign')

@start_campaign_bp.route('', methods=['POST']) 
@cross_origin()
@cognito_valid_token_required
def post_user_selected_ads():
    try:
        data = request.json
        print("Received Data:", data)

        descriptions = data.get('Descriptions', [])
        titles = data.get('Titles', [])
        course_code = data.get('courseCode', '')
        course_name = data.get('courseName', '')

        update_user_selected(titles, descriptions, course_code, course_name)

        return jsonify({
            "error": False,
            "success": True,
            "message": "User Selected updated. Campaign Can begin",
            "data": None
        }), 200

    except Exception as e:
        print("Overall Error:", e)
        return jsonify({
            "error": True,
            "success": False,
            "message": f"An error occurred 2: {str(e)}",
            "data": None
        }), 500

get_ad_campaign_bp = Blueprint('campaigns', __name__, url_prefix='/api/get_campaigns')

@get_ad_campaign_bp.route('', methods=['GET']) 
@cross_origin()
@cognito_valid_token_required
def get_ad_campaigns():
    try:
        data = {
            "Brand | Undergraduate | Computer Science | BM": 19894002666,
            "Generic | Undergraduate | Science | Information Technology | BM": 19894002891,
            "Generic | Undergraduate | Software Engineering | BM": 19894002897,
            "Brand | Postgraduate | Cyber | BM": 19894002642,
        }

        return jsonify({
            "error": False,
            "success": True,
            "message": "Campaign ID's",
            "data": data
        }), 200

    except Exception as e:
        print("Overall Error:", e)
        return jsonify({
            "error": True,
            "success": False,
            "message": f"An error occurred 3: {str(e)}",
            "data": None
        }), 500

def calculate_score(text):
    return round(random.uniform(20, 90), 2)
