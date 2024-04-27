# PasswordManager
CS5610 Project3
Group: Steven Jiang, Chung-ang Tsao, Hanwen Guo

# How to use this password manager?
Please go to https://hermann-guo-passwordmanager.onrender.com/pwmanager. [Render deploy with release-BE-FE branch] We suggest using an incognito broswer or clear the cache before use. 
You can either sign up for a new user account, or use our test account (username:test01, password: 123456)
Sometime the Render.com may get slower or lead to some unusual behavior like database not respond, since we are using the free Render and MongoDB account, please reload, logout and re-sign in to your testing account.

# Write Up

## 1. What were some challenges you faced while making this app?
First, the main challenged we faced is the integration of Frontend and Backend. Ensuring seamless communication between the frontend built with React and the backend powered by Express was challenging. During the integration, lots of unexpected errors happened such as failed Api call. Thus we need to properly handling these errors, especially those related to network requests, like the 404 errors we troubleshooted, and displaying meaningful error messages to the user required implementing comprehensive error catching and handling strategies. That's also the reason we utilize react-hot-toast to ensure the intuitive user interaction. Also during integration, we spend lots of time to test and debug the problems like: handling CORS issues, setting up proper routes, and managing responses.

Secondly, from frontend aspect, the state management in React is a challenge. Managing complex state dependencies, especially when dealing with asynchronous data updates like fetching, adding, editing, and deleting passwords, was intricate and required careful design to ensure a responsive and error-free UI.

Lastly, from backend  aspect, we found user authentication and security issues challenge. Implementing robust user authentication and ensuring the security of stored passwords were critical and complex. Thus we utilize middleware for authentication checks and encrypting passwords stored in MongoDB and this process take us some time to learn and test.

## 2. Given more time, what additional features, functional or design changes would you make
The feature that we would like to add most is the 2FA (Two-Factor Authentication) since this app involved with extremely sensitive data like password and login credentials. Implementing 2FA for user logins would significantly increase security, ensuring that password management is more secure against unauthorized access.
Also, we would like to add an algorithm to check if the password is strong enough since a longer password involved upper case and lower case chart, number, and special symbol will be much more secure.

## 3. What assumptions did you make while working on this assignment?
We assumed that users would interact with the system by adhering to basic security practices, such as not sharing their login credentials and using strong, unique passwords for their accounts.

## 4. How long did this assignment take to complete?
The development of the password manager took approximately two weeks. This includes initial planning, divide workload, setup of the development environment, coding of the frontend and backend, integration testing, and the final deployment adjustments. Debugging and resolving issues, especially related to deployment and API connectivity, accounted for a significant portion of the time.
