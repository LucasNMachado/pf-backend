export const generateUserErrorInfo = ({firstName, lastName, email, age, password, birth_date, role}) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : needs to be a String, received: ${firstName}
    * last_name : needs to be a String, received: ${lastName}
    * email : needs to be a String, received: ${email}
    * age : needs to be a String, received: ${age}
    * password : needs to be a String, received: ${password}
    * birth_date : needs to be a String, received: ${birth_date}
    * role : needs to be a String, received: ${role}`
     }