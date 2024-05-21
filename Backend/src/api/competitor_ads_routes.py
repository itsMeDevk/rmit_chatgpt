from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.functions.auth import cognito_valid_token_required
from src.functions.database import create_rs_connection
from sqlalchemy import text

# Create a Blueprint named 'competitor ads'
comp_ads_bp = Blueprint('competitior_ads', __name__, url_prefix='/api/comp_ads')

# Define your comp_ads_bp route
@comp_ads_bp.route('', methods=['POST'])
@cross_origin()
@cognito_valid_token_required
def get_competitor_ads():
    """
    Handle requests to retrieve competitor ads data based on filters and sorting.

    Returns:
        JSON response with filtered and sorted competitor ads data.
    """
    try:
        # Create a Redshift connection
        rs_connection = create_rs_connection()

        data = request.json
        # Extract the search terms
        search_terms = data.get('filter_dict', {}).get('values', [])
        filter_key = data.get('filter_dict', {}).get('column')

        # Extract the sort key and sort order
        sort_key = data.get('sort_dict', {}).get('column')
        sort_order = data.get('sort_dict', {}).get('order')

        # Getting filter query for search terms
        if filter_key and search_terms:
            like_clauses = [f'"{filter_key}" ILIKE \'%{value}%\'' for value in search_terms]
            # Join the quoted clauses with "OR"
            search_query = " OR ".join(like_clauses)
        else:
            search_query = '1=1'

        # Your Redshift query with date filtering, search filtering, and sorting
        # redshift_query = f"""
        #     SELECT "Title", "Description", "Keyword", "Source", "Date"
        #     FROM scraped_ads
        #     WHERE {search_query} 
        #     AND "Date" > dateadd(day, -30, current_date)
        #     ORDER BY "{sort_key}" {sort_order}
        #     LIMIT 50
        # """

        redshift_query = f"""
            SELECT DISTINCT "Title", "Position","Keyword"
        FROM "scraped_ads"
        LIMIT 20;
        """

        # Execute the query
        with rs_connection.connect() as connection:
            connection.execute('SET enable_case_sensitive_identifier TO true;')
            result = connection.execute(text(redshift_query))
            redshift_data_list = [dict(row) for row in result]

        # Binning every 10 rows together
        if redshift_data_list:
            for i, row in enumerate(redshift_data_list):
                row['rank'] = i + 1  # Rank starting from 1
                row['bin'] = (i // 10) + 1  # Binning every 10 rows
        else:
            redshift_data_list = []  # Ensure an empty list if there are no results

        # Calculate the total number of segments (bins)
        total_segments = (len(redshift_data_list) + 9) // 10  # Add 9 to round up to the nearest 10

        # Removing the 'rank' column
        for row in redshift_data_list:
            del row['rank']

        return jsonify({
            "error": False,
            "success": True,
            "message": "Competitor ads data retrieved successfully",
            "data": redshift_data_list,
            "total_segments": total_segments
        }), 200

    except Exception as e:
        # Handle exceptions, e.g., connection errors or query errors
        return jsonify({
            "error": True,
            "success": False,
            "message": f"An error occurred: {str(e)}",
            "data": None
        }), 500  # Internal Server Error
