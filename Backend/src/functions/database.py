from src.config import DRIVER, HOST, USERNAME, PWD, RS_PORT, DATABASE
from src.config import HOST_PG, USERNAME_PG, DATABASE_PG, PG_PORT, DRIVER_PG
from sqlalchemy import create_engine
from datetime import datetime

def create_rs_connection():
    # Build the SQLAlchemy database connection engine
    return create_engine(f'{DRIVER}://{USERNAME}:{PWD}@{HOST}:{RS_PORT}/{DATABASE}')


# PostgreSQL Database Connection
def create_postgres_connection():
    return create_engine(f'{DRIVER_PG}://{USERNAME_PG}:{PWD}@{HOST_PG}:{PG_PORT}/{DATABASE_PG}')

# This function inserts data into the database directly
def store_to_db(titles, title_scores, descriptions, description_scores, course_name, course_code, kword_search, kfeatures_str, course_url, campaign_name):
    # Get the current date
    event_date = datetime.now()

    # Create a database connection
    db_connection = create_postgres_connection()

    # Establish a connection to the database
    with db_connection.connect() as conn:
        # Begin a database transaction
        trans = conn.begin()

        try:
            # Insert titles
            titles_sql = """
                INSERT INTO session_titles (titles, title_score, course_name, course_code, keywords, course_features, course_url, campaign_name, user_selected, performance_score, event_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            for title, title_score in zip(titles, title_scores):
                conn.execute(titles_sql, (title, title_score, course_name, course_code, kword_search, kfeatures_str, course_url, campaign_name, False, 0.0, event_date))

            # Insert descriptions
            descriptions_sql = """
                INSERT INTO session_descriptions (descriptions, description_score, course_name, course_code, keywords, course_features, course_url, campaign_name, user_selected, performance_score, event_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """
            for description, description_score in zip(descriptions, description_scores):
                conn.execute(descriptions_sql, (description, description_score, course_name, course_code, kword_search, kfeatures_str, course_url, campaign_name, False, 0.0, event_date))

            # Commit the database transaction
            trans.commit()
        except Exception as e:
            # Rollback the transaction if an error occurs
            trans.rollback()
            print(e)

def update_user_selected(titles, descriptions, course_code, course_name):
    # Get the current date and time as a timestamp
    event_date = datetime.now()

    # Extract the date part from the event_date
    event_date_date = event_date.date()

    # Create a database connection
    db_connection = create_postgres_connection()

    # Establish a connection to the database
    with db_connection.connect() as conn:
        # Begin a database transaction
        trans = conn.begin()

        try:
            # Update titles for today's date
            for title in titles:
                conn.execute(
                    """
                    UPDATE session_titles
                    SET user_selected = %s
                    WHERE titles = %s 
                    AND DATE_TRUNC('day', event_date) = %s
                    AND course_name = %s
                    AND course_code = %s
                    """,
                    (True, title, event_date_date, course_name, course_code)
                )

            # Update descriptions for today's date
            for description in descriptions:
                conn.execute(
                    """
                    UPDATE session_descriptions
                    SET user_selected = %s
                    WHERE descriptions = %s 
                    AND DATE_TRUNC('day', event_date) = %s
                    AND course_name = %s
                    AND course_code = %s
                    """,
                    (True, description, event_date_date, course_name, course_code)
                )

            # Commit the database transaction
            trans.commit()
        except Exception as e:
            # Rollback the transaction if an error occurs
            trans.rollback()
            print(e)
