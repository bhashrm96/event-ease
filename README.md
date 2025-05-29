# EventEase – Event Planning App

## 🛠️ Steps to Run the App

### 1. Clone the Repository


Initial Credentials

Admin:
email: test-admin@gmail.com
password: admin123

Staff:
email: staff001@gmail.com
password: staff@123

Event Owner:
email: eventowner001@gmail.com
password: evento@123



git clone https://github.com/your-username/eventease.git
cd eventease


 Install Dependencies
 npm install


 Create a .env file in the root directory with the following content:  

DATABASE_URL="postgresql://postgres:Bhavya%40123@db.hehqnyanztxxqtcunbrt.supabase.co:5432/postgres"

NEXTAUTH_SECRET="AhnAL2Zp5jlwgEeI9GtiSNyoDmm02sG01IWTz6/q8vg="



Set Up Prisma
npx prisma generate
npx prisma migrate dev --name init


Start the Development Server
npm run dev
