from flask import request, jsonify
from config import app, db
from models import Contact
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import traceback

load_dotenv()  # Load environment variables from .env file

EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("PASSWORD")

@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include a first name, last name and email"}),
            400,
        )

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message": "User updated."}), 200

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

@app.route('/send-email', methods=['POST'])
def send_email():
    data = request.json
    app.logger.info(f"Received data: {data}")
    subject = data.get('subject', '')
    body = data.get('body', '')
    recipients = data.get('recipients', [])
    app.logger.info(f"Recipients list: {recipients}")

    if not subject or not body or not recipients:
        return jsonify({'error': 'Subject, body, and recipients are required.'}), 400

    try:
        for recipient in recipients:
            try:
                app.logger.info(f"Attempting to send email to: {recipient}")

                with smtplib.SMTP('smtp.gmail.com', 587) as server:
                    server.starttls()
                    server.login(EMAIL, PASSWORD)

                    msg = MIMEMultipart()
                    msg['From'] = EMAIL
                    msg['To'] = recipient
                    msg['Subject'] = subject
                    msg.attach(MIMEText(body, 'plain'))

                    server.send_message(msg)
                    app.logger.info(f"Email successfully sent to: {recipient}")
                    
            except Exception as e:
                app.logger.error(f"Failed to send email to {recipient}: {str(e)}")

        return jsonify({'message': 'Emails sent successfully'})
    
    except smtplib.SMTPAuthenticationError:
        return jsonify({'error': 'Failed to authenticate. Check your email and password.'}), 401
    except smtplib.SMTPException as e:
        error_message = f'SMTP error occurred: {str(e)}'
        app.logger.error(error_message)
        return jsonify({'error': error_message}), 500
    except Exception as e:
        error_message = f'An unexpected error occurred: {str(e)}'
        app.logger.error(f'{error_message}\n{traceback.format_exc()}')
        return jsonify({'error': error_message}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
