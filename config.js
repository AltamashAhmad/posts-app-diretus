module.exports = {
  cors: {
    enabled: true,
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range'],
    credentials: true,
    maxAge: 18000
  }
}; 