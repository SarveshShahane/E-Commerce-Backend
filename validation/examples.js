 
const validRegistration = {
  name: "John Doe",
  email: "john.doe@example.com", 
  password: "SecurePass123",
  role: "buyer"
};

const invalidRegistration = {
  name: "J",                     
  email: "invalid-email",      
  password: "weak",             
  role: "customer"              
};

const registrationValidationError = {
  success: false,
  message: "Validation failed",
  errors: [
    {
      field: "name",
      message: "Name must be at least 2 characters long",
      value: "J"
    },
    {
      field: "email", 
      message: "Please provide a valid email address",
      value: "invalid-email"
    },
    {
      field: "password",
      message: "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      value: "weak"
    },
    {
      field: "role",
      message: "Role must be either buyer, seller, or admin",
      value: "customer"
    }
  ]
};

const validProduct = {
  name: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation and 30-hour battery life",
  price: 199.99,
  category: "Electronics",
  stock: 50
};

const invalidProduct = {
  name: "",                     
  description: "Too short",     
  price: -10,                 
  category: "",               
  stock: 100000              
};

const validPaymentIntent = {
  items: [
    {
      id: "507f1f77bcf86cd799439011",
      quantity: 2
    },
    {
      id: "507f1f77bcf86cd799439012",
      quantity: 1
    }
  ],
  currency: "inr",
  customer_id: "cus_NffrFeUfNV2Hib"    
};

const invalidPaymentIntent = {
  items: [
    {
      id: "invalid-id",      
      quantity: 0                 
    }
  ],
  currency: "xyz",              
  customer_id: "invalid_customer" 
};

const validProductQuery = {
  page: 1,
  limit: 12,
  category: "Electronics",
  search: "wireless",
  minPrice: 50,
  maxPrice: 500
};

const invalidProductQuery = {
  page: 0,                       
  limit: 150,                     
  minPrice: 1000,
  maxPrice: 500         
};

export {
  validRegistration,
  invalidRegistration,
  registrationValidationError,
  validProduct,
  invalidProduct,
  validPaymentIntent,
  invalidPaymentIntent,
  validProductQuery,
  invalidProductQuery
};
