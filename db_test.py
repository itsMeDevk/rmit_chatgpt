from sqlalchemy import create_engine, MetaData, select, text
from sqlalchemy.exc import SQLAlchemyError

from datetime import datetime

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

def create_postgres_connection():
    # PostgreSQL Database Connection
    DRIVER_PG = 'postgresql'
    HOST_PG = 'rmit-chatgpt.cf761x2msgm4.ap-southeast-2.rds.amazonaws.com'
    PG_PORT = '5432'
    DATABASE_PG = 'rmit_chatgpt_db'
    USERNAME_PG = 'postgres'
    PWD_PG = '#Rmit_ai_team2'

    # Build the SQLAlchemy database connection engine for PostgreSQL
    engine = create_engine(f'{DRIVER_PG}://{USERNAME_PG}:{PWD_PG}@{HOST_PG}:{PG_PORT}/{DATABASE_PG}')
    #print(f"Connection to PostgreSQL database created successfully on port {PG_PORT}.")
    return engine

# Create an instance of PostgreSQLConnection
#postgres_engine = create_postgres_connection()
rs_engine = create_rs_connection()



try:
    # Create a SQLAlchemy session
    with rs_engine.connect() as conn_rs:
        # Set case sensitivity for the session
        conn_rs.execute(text('SET enable_case_sensitive_identifier TO true;'))

        # Define your custom SQL query
        custom_query = text("""
        SELECT DISTINCT "Title", "Position","Keyword"
        FROM "scraped_ads"
        LIMIT 10;
        """)

        # Execute the custom query and fetch results
        result = conn_rs.execute(custom_query)

        # Print the results
        print("Results of the custom query:")
        for row in result:
            print(f'Title: {row["Title"]}, Position: {row["Position"]}, Keyword: {row["Keyword"]}')
except SQLAlchemyError as e:
    print("Error occurred:")
    print(e)