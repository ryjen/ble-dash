# Project: BLE Dash

## Overview

This project is a React Native mobile application designed to display a dashboard of data received from a Bluetooth Low Energy (BLE) device. It includes a Python-based BLE GATT server for testing and development purposes. The application allows users to connect to a BLE device, monitor its characteristics, and view real-time data in a chart format.

## Technologies

*   **Frontend:** React Native, TypeScript
*   **Backend:** Python, BLE GATT
*   **Package Manager:** pnpm

## Building and Running

### Frontend (React Native App)

*   **Install Dependencies:**
    ```bash
    pnpm install
    ```

*   **Run on Android:**
    ```bash
    pnpm android
    ```

*   **Run on iOS:**
    ```bash
    pnpm ios
    ```

*   **Start Metro Bundler:**
    ```bash
    pnpm start
    ```

*   **Run Tests:**
    ```bash
    pnpm test
    ```

*   **Lint:**
    ```bash
    pnpm lint
    ```

### Backend (Python BLE Server)

*   **Navigate to the server directory:**
    ```bash
    cd server
    ```

*   **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

*   **Run the server:**
    ```bash
    python ble_gatt_server.py
    ```

## Development Conventions

*   The project uses ESLint for code linting.
*   Testing is done with Jest.
*   The project follows conventional commits and comments.
*   The project uses a `.prettierrc.js` file for code formatting.
