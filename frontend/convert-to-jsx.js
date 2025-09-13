const fs = require('fs');
const path = require('path');

// List of component files to convert
const componentFiles = [
  'src/components/Register.js',
  'src/components/Dashboard.js',
  'src/components/Leads.js',
  'src/components/Contacts.js',
  'src/components/Accounts.js',
  'src/components/Deals.js',
  'src/components/Activities.js',
  'src/components/Members.js',
  'src/components/Organizations.js'
];

function convertFileToJsx(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Update import statements to use .jsx extensions
    const updatedContent = content
      .replace(/from '\.\.\/contexts\/AuthContext'/g, "from '../contexts/AuthContext.jsx'")
      .replace(/from '\.\.\/services\/api'/g, "from '../services/api.js'")
      .replace(/from 'react-hot-toast'/g, "from 'react-hot-toast'")
      .replace(/from 'framer-motion'/g, "from 'framer-motion'")
      .replace(/from 'lucide-react'/g, "from 'lucide-react'")
      .replace(/from 'recharts'/g, "from 'recharts'");
    
    // Create new .jsx file
    const newPath = filePath.replace('.js', '.jsx');
    fs.writeFileSync(newPath, updatedContent);
    
    console.log(`Converted ${filePath} to ${newPath}`);
    
    // Remove original .js file
    fs.unlinkSync(filePath);
    console.log(`Removed ${filePath}`);
    
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

// Convert all component files
componentFiles.forEach(convertFileToJsx);

console.log('Conversion complete!');
