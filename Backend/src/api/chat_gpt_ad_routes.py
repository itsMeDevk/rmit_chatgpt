import json
import openai
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.functions.auth import cognito_valid_token_required
import random

# Set your API key for OpenAI
openai.api_key = ""

# Create a Blueprint named 'chat_gpt_ad' with the given name
chat_gpt_ad_bp = Blueprint('chat_gpt_ad', __name__, url_prefix='/api/chat_gpt_ad')

def chat_with_chatgpt(prompt, model="gpt-4"):
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,  # Increase max tokens to get a more detailed response
            temperature=0.5,
        )
        message = response['choices'][0]['message']['content'].strip()
        return message
    except openai.error.OpenAIError as e:
        print(f"OpenAI API Error: {str(e)}")
        raise e

def parse_chatgpt_response(response):
    try:
        # Log raw response for debugging
        print("Raw GPT-4 Response:", response)

        # Initialize lists to store titles and descriptions
        titles = []
        descriptions = []

        # Split the response by lines
        lines = response.split('\n')

        # Parse titles and descriptions based on the expected format
        is_titles_section = False
        for line in lines:
            line = line.strip()
            if line.startswith("Titles:"):
                is_titles_section = True
                continue

            if is_titles_section:
                if line and line[0].isdigit():
                    titles.append(line.split(' ', 1)[1].strip().strip('"'))
            else:
                if line.startswith("Ad Copies:"):
                    continue  # Skip the "Ad Copies:" line
                if line and line[0].isdigit():
                    descriptions.append(line.split(' ', 1)[1].strip().strip('"'))
                elif line.startswith("Course Features:"):
                    continue  # Skip the "Course Features:" line
                else:
                    descriptions.append(line.strip())

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
        course_url = data.get('courseUrl', '')
        campaign_name = data.get('campaignName', '')

        kfeatures_str = ", ".join(course_key_features)

        prompt = f'''Create 4 different ad copies and 15 titles for promoting this RMIT course on google ads: {course_name}
        Please keep each title to be of maximum 30 characters and each description to be of max 90 characters as per google ads guidelines.
        These are some of the key course features: {kfeatures_str}'''

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

        # Calculate scores
        title_scores = [calculate_score(title) for title in parsed_result.get('titles', [])]
        description_scores = [calculate_score(description) for description in parsed_result.get('descriptions', [])]

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

        # Placeholder for actual function to handle user selections
        print("User selected titles:", titles)
        print("User selected descriptions:", descriptions)

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
