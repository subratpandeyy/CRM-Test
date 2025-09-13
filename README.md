# Multi-Tenant CRM System

A comprehensive multi-tenant CRM system built with Spring Boot (Java) backend and React.js frontend.

## 🏗 Architecture

- **Frontend**: React.js with React Router, Bootstrap
- **Backend**: Spring Boot 3.2.0 with Java 17
- **Database**: PostgreSQL
- **ORM**: JPA (Hibernate)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security with role-based access control

## 📋 Features

### Multi-Tenancy
- Complete data isolation by Organization
- Users can only access data belonging to their organization
- JWT tokens include organization context

### User Management
- Role-based access control (Admin, Manager, Sales Rep, User)
- Member management within organizations
- Secure authentication and authorization

### CRM Entities
- **Organizations**: Multi-tenant root entities
- **Members**: Users with roles and organization association
- **Leads**: Potential customers with verification status
- **Contacts**: Customer contacts linked to accounts
- **Accounts**: Customer accounts
- **Deals**: Sales opportunities with stages and values
- **Activities**: Track interactions with leads/contacts

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD 'crm_password';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
```

2. Update database configuration in `src/main/resources/application.yml` if needed.

### Backend Setup

1. Navigate to the project root directory
2. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8090`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔐 Authentication

### Registration
1. Visit `http://localhost:3000/register`
2. Create a new organization with admin user
3. Default roles are automatically created (Admin, Manager, Sales Rep, User)

### Login
1. Visit `http://localhost:3000/login`
2. Use the admin credentials created during registration
3. JWT token is automatically stored and used for API calls

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new organization
- `POST /api/auth/login` - User login

### Leads
- `GET /api/leads` - Get all leads for organization
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead
- `PUT /api/leads/{id}/status` - Update lead verification status

### Contacts
- `GET /api/contacts` - Get all contacts for organization
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact

### Other Entities
Similar CRUD endpoints exist for Accounts, Deals, Activities, Members, and Organizations.

## 🏢 Multi-Tenancy Implementation

### Backend
- All entities include `organization` field
- JWT tokens contain organization ID
- Repository queries filter by organization
- Service layer enforces organization context

### Frontend
- Organization context extracted from JWT token
- All API calls automatically include organization context
- UI shows organization name in navigation

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration for frontend
- Request/response interceptors for token management

## 📁 Project Structure

```
├── src/main/java/com/crm/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── repository/     # JPA repositories
│   ├── security/       # Security components
│   └── service/        # Business logic services
├── src/main/resources/
│   └── application.yml # Application configuration
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   └── services/   # API services
│   └── package.json
└── pom.xml
```

## 🧪 Testing

### Backend Testing
```bash
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file:
```bash
mvn clean package
```

2. Run the JAR:
```bash
java -jar target/multi-tenant-crm-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
1. Build for production:
```bash
cd frontend
npm run build
```

2. Serve the build folder with a web server (nginx, Apache, etc.)

## 🔧 Configuration

### Database Configuration
Update `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crm_db
    username: crm_user
    password: crm_password
```

### JWT Configuration
Update JWT secret and expiration in `application.yml`:
```yaml
spring:
  security:
    jwt:
      secret: your-secret-key-here
      expiration: 86400000 # 24 hours
```

## 📝 Notes

- The system automatically creates default roles on startup
- All timestamps are in UTC
- Multi-tenancy is enforced at the service layer
- Frontend uses Bootstrap for responsive design
- API responses include proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
