db.createUser(
  {
    user: 'service-app',
    pwd: 'Secret*123',
    roles: [
      {
        role: 'dbAdmin',
        db: 'service'
      },
      {
        role: 'readWrite',
        db: 'service'
      }
    ]
  }
)
