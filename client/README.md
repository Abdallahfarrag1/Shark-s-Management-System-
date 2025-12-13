# Barber Shop Website

A modern, responsive barber shop website built with Angular and Tailwind CSS.

## Features

- **Booking Flow**: Multi-step wizard for selecting services, dates, barbers, and payment.
- **Branch Discovery**: Find branches near you with real-time status.
- **User Dashboard**: Manage your bookings and profile.
- **RTL Support**: Full support for Arabic language and RTL layout.
- **Responsive Design**: Optimized for mobile and desktop.

## Tech Stack

- **Framework**: Angular 18+ (Standalone Components, Signals)
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals
- **Routing**: Angular Router

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Run Development Server**:

    ```bash
    npm start
    ```

    Open `http://localhost:4200` in your browser.

3.  **Build**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/app/core`: Singleton services and layout components.
- `src/app/features`: Feature modules (Auth, Booking, Branches, Home).
- `src/app/shared`: Reusable UI components.
