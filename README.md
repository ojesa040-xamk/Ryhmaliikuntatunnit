<h1>Ryhmäliikuntatunnit</h1>

<h2>Description</h2>

This is my final assignment for my second application programming course. The task was to create an applied exercise using Node/Express and React techniques, and at least one topic or technique learned from the course, such as Prisma ORM, JWT authorization, or user management and authentication.

I developed an application for booking group exercise classes. Prisma ORM was used to handle data storage, and two related data models were defined, as shown below.

<p align="center"> <img src="https://imgur.com/a/sbCRzur.png" height="80%" width="80%" alt="PrismaData"/> </p>

The backend consists of two REST API routes: apiAuth and apiTunnit. The apiAuth route handles user login and sign-up. Express POST routes are used to process incoming requests from the client.

The `apiTunnit` route contains several endpoints:

- **GET /**  
  Retrieves all class information and returns it in JSON format.

- **PUT /:TunnitId**  
  Fetches data for a specific class by its ID from the database.

- **GET /kayttajaId**  
  Retrieves a user’s information, including their booked classes, based on their `kayttajaId`, and returns it in JSON format.

- **PUT /peru/TunnitId**  
  Updates a specific class by removing the association with the user’s `kayttajaId` from the list of participants.

A separate error handler was created to manage errors, as shown below.

<p align="center"> <img src="https://imgur.com/6hVQR9J.png" height="80%" width="80%" alt="Error handling"/> </p>

Authentication is handled through a checkToken.ts file in the middleware folder, which verifies JWT tokens. The token is generated during user registration and login and is required to access protected routes.

On the client side, App.tsx defines the routes to different pages and manages the transmission of the authentication token. The application contains three pages: kirjautuminen (login), rekisterointi (sign-up), and ryhmatunnit (group exercise classes), with ryhmatunnit serving as the main page.

The main page allows users to select different dates from a dropdown menu. Booking a class requires signing in, so a login button is provided.

<p align="center"> <img src="https://imgur.com/Yv8K1dc.png" height="80%" width="80%" alt="Main page"/> </p>

After a successful login, a button for booking a class and a list of the classes the user is enrolled in are displayed. Users can cancel a booking using the "Peruuta" button and log out using the "Kirjaudu ulos" button.

<p align="center"> <img src="https://imgur.com/g4gVx88.png" height="80%" width="80%" alt="login"/> </p>



