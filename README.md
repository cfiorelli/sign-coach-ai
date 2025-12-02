# SignCoach AI

SignCoach AI is an interactive web application designed to help users learn American Sign Language (ASL) through real-time computer vision feedback. It uses your webcam to analyze your hand movements and provides immediate coaching on your accuracy.

## 🚀 Features

-   **Real-time AI Feedback**: Uses MediaPipe and OpenCV to detect hand landmarks and evaluate sign accuracy instantly.
-   **Interactive Lessons**: Structured curriculum with visual examples and detailed instructions.
-   **3-Panel Practice Interface**:
    -   **Learn**: See the sign, read instructions (Handshape, Location, Movement).
    -   **Practice**: Live webcam feed with skeletal overlay.
    -   **Feedback**: Real-time scoring and corrective guidance.
-   **Progress Tracking**: Track your mastery of different signs and lessons.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
-   **Backend**: Node.js, Express, Prisma ORM.
-   **Database**: PostgreSQL, Redis (for caching/sessions).
-   **ML Service**: Python, FastAPI, MediaPipe, OpenCV.
-   **Infrastructure**: Docker, Docker Compose.

## ⚙️ Setup & Installation

### Prerequisites

-   Docker & Docker Compose
-   Node.js (v18+)
-   Python (v3.9+)

### 1. Clone the repository

```bash
git clone https://github.com/cfiorelli/sign-coach-ai.git
cd sign-coach-ai
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Run the Application

#### Standard (Intel/AMD64)
If you are on a standard Linux/Windows machine, you can run everything via Docker:

```bash
docker compose up -d
```

#### Apple Silicon (M1/M2/M3) 🍎
Docker on Apple Silicon has compatibility issues with some computer vision libraries. For the best performance, run the ML service natively on your host machine:

1.  **Start the infrastructure (DB, API, Web)**:
    ```bash
    docker compose up -d
    ```

2.  **Set up and run the ML Service locally**:
    ```bash
    cd ml-service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app:app --host 0.0.0.0 --port 5000 --reload
    ```

The application will be available at:
-   **Web App**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:4000](http://localhost:4000)
-   **ML Service**: [http://localhost:5000/docs](http://localhost:5000/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
