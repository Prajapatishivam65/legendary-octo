project-root/
├── src/
│
│ ├── config/ # Configuration files (CORS, cookies, etc.)
│ │ ├── corsConfig.ts
│ │ ├── cookieConfig.ts
│ │ └── authConfig.ts
│
│ ├── controllers/ # Route handlers
│ │ ├── authController.ts
│ │ └── sseController.ts # Handles /sse and /messages endpoints
│
│ ├── middleware/ # Express middlewares
│ │ ├── authenticate.ts
│ │ ├── validateInput.ts
│ │ └── errorHandler.ts
│
│ ├── prisma/ # Prisma ORM related
│ │ ├── schema.prisma
│ │ └── seed.ts
│
│ ├── routes/ # Express route definitions
│ │ ├── authRoutes.ts
│ │ └── sseRoutes.ts # Routes for SSE and message posting
│
│ ├── services/ # Business logic / services
│ │ ├── authService.ts
│ │ └── tokenService.ts
│
│ ├── transports/ # SSE transport session manager
│ │ └── sseTransport.ts
│
│ ├── utils/ # Utility functions
│ │ ├── passwords.ts
│ │ └── logger.ts
│
│ ├── app.ts # Sets up Express app and routes
│ └── index.ts # Entry point: starts server
│
├── .env # Environment variables
├── package.json
├── tsconfig.json # If using TypeScript
└── README.md
