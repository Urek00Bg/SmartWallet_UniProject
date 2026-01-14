# SmartWallet 💳

> ### 🎓 University Demo
> This project was developed as a **University Demo** to showcase modern web development practices, focusing on front-end logic, UI/UX accessibility, and client-side data management.

**SmartWallet** is a modern personal finance management web application. Its primary mission is to provide users with full control over their monthly budget through an intuitive interface and robust planning tools.

---

## 📋 Functional Description

### Page Architecture
* **Landing Page (Home):** Acts as the project's business card. It includes a brief description of services, the project's origin story, and an introduction to the development team.
* **Login Page:** Provides user access. In this demo version, authentication and data persistence are handled locally via `localStorage`.
* **Dashboard:** The core of the application where actual resource management takes place.

### Key Features
* **Income Management:** Users can input primary monthly income and additional earnings (e.g., bonuses).
* **Expense Planning:** Ability to set fixed costs such as rent, loans, and utility bills.
* **Financial Security & Savings:** Dynamic percentage-based settings for "emergency funds" and dedicated savings.
* **Real-time Tracking:** Instant visualization of the remaining balance after all planned deductions.
* **Interactive Archive:** A detailed table to review expenses including ID, date, name, price, and a removal button for full history editing.

---

## 🛠 Technical Implementation

The application is built for high performance and accessibility. It achieves an average of **97 points on Lighthouse Performance** and **100 points across all other categories**. The design is fully optimized for mobile devices and users with disabilities.

### Technology Stack
* **HTML5 & CSS3:** Modern structuring and styling based on **CSS Flexbox** and **CSS Grid**.
* **JavaScript (ES6+):** All logic is executed Client-side. The architecture is designed for easy future integration with backend technologies like PHP or Python (Django).
* **Storage:** Data is stored in `localStorage` to maintain state across sessions without a database.

---

## 📂 Project Structure

The project is organized into logically separated directories for easy maintenance:

### `assets/`
* `css/hover-animation`: Defines all interactive effects and UI animations.
* `js/dashboard.js`: Central logic for calculations and dashboard management.
* `js/fade_down.js`: Manages scroll animations (disabled on screens <768px to ensure mobile stability).
* `js/navbar.js`: Implements the responsive "hamburger" menu for mobile users.
* `js/login.js` & `js/printName.js`: Manage user sessions and UI personalization.

### Modular Directories
* **Dashboard/**: Contains specific HTML/CSS for the control panel.
* **Login/**: Contains the HTML structure for the sign-in page.
* **index.html**: The main entry point of the project.

---

## 💡 Conclusion
SmartWallet demonstrates how modern web technologies can create an accessible and functional platform without the immediate need for a complex backend. The use of semantic HTML5 and flexible layouts ensures code longevity and a seamless user experience across all devices.
