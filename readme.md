# RMIT_Marketing AI/DS Project

This README will guide you through setting up your development environment and running the application locally.

## Prerequisites

### React
- npm: >=6.14.9
   - Check version: `$npm -v`
   - (If needed) Install: `$npm install npm@latest -g` 

### Flask
- Python 3.6+
- `pip` (Python package manager)

## Getting Started

Clone this repository to your local machine:

   
   - git clone https://github.com/rmitbojczukm/RMIT_Marketing.git
   - cd RMIT_Marketing

### Frontend - React

1. Go to the directory:
      - `$cd Frontend/rmit-chatgpt-ai`<br/><br/>

2. Install dependencies:
      - `$npm install`<br/><br/>

3. Run the app:
      - `$npm start`

   Note: The Frontend application will start on `http://localhost:3000/`. Open your web browser and navigate to this URL to access the app.

### Backend - Flask
1. Create a virtual environment to isolate project dependencies:
   - `$python3 -m venv venv`<br/><br/>

2. Activate the virtual environment:

   - `$venv\Scripts\activate`<br/><br/>

3. Install project dependencies from requirements.txt:

   - `$pip install -r requirements.txt`<br/><br/>

4. Running the Application
Once you've set up the virtual environment and installed the dependencies, you can run the Flask application locally:

   - `$flask run`

   Note: The Backend application will start on `http://127.0.0.1:5000/`. Open your web browser and navigate to this URL to access the app.
