project-root/
├── src/
│ ├── config/ # Configuration files
│ │ ├── corsConfig.ts # CORS configuration
│ │ ├── cookieConfig.ts # Cookie settings
│ │ └── authConfig.ts # Auth-related constants (token expiry, etc.)
│ │
│ ├── prisma/ # Prisma ORM files
│ │ ├── schema.prisma # Database schema
│ │ └── seed.ts # Seeding script
│ │
│ ├── controllers/ # Route handlers
│ │ └── authController.ts # Login, register, logout functions
│ │
│ ├── middleware/ # Express middleware
│ │ ├── authenticate.ts # Verify auth status
│ │ ├── validateInput.ts # Validate request data
│ │ └── errorHandler.ts # Centralized error handling
│ │
│ ├── routes/ # API routes
│ │ ├── authRoutes.ts # Auth-related endpoints
│ │ └── index.ts # Route aggregator
│ │
│ ├── services/ # Business logic
│ │ ├── authService.ts # Auth-related logic
│ │ └── tokenService.ts # Token creation/validation
│ │
│ ├── utils/ # Utility functions
│ │ ├── passwords.ts # Password hashing/validation
│ │ └── logger.ts # Logging service
│ │
│ ├── types/ # TypeScript type definitions
│ │ ├── user.ts # User-related types
│ │ └── auth.ts # Auth-related types
│ │
│ └── app.ts # Express app setup
│ └── server.ts # Entry point
│
├── .env # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
