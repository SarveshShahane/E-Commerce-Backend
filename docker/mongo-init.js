db = db.getSiblingDB('ecommerce');

db.createUser({
  user: 'apiuser',
  pwd: 'apipassword',
  roles: [
    {
      role: 'readWrite',
      db: 'ecommerce'
    }
  ]
});

db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('carts');

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "phone": 1 }, { unique: true });
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.carts.createIndex({ "userId": 1 }, { unique: true });

print('Database initialization completed!');
