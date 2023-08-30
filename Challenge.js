const fs = require('fs');

// read users.json and companies.json
const users = JSON.parse(fs.readFileSync('users.json'));
const companies = JSON.parse(fs.readFileSync('companies.json'));

// function to sort users by last name
const sortUsersByLastName = (a, b) => {
  const lastNameA = a.last_name.toUpperCase();
  const lastNameB = b.last_name.toUpperCase();
  
  if (lastNameA < lastNameB) {
    return -1;
  }
  
  if (lastNameA > lastNameB) {
    return 1;
  }
  
  return 0;
};

// function to generate the output for a company
const generateCompanyOutput = (company) => {
  let output = '';
  // filter users for the current company
  const companyUsers = users.filter(user => user.company_id === company.id && user.active_status);
  if (companyUsers.length < 1) return output;

  output += `Company Id: ${company.id}\n`;
  output += `\tCompany Name: ${company.name}\n`;

  const usersEmailed = [];
  const usersNotEmailed = [];
  let topUpTotal = 0;

 
  companyUsers.sort(sortUsersByLastName);

  companyUsers.forEach((user) => {
    if (user.email_status && company.email_status) {
      usersEmailed.push(user);
    } else {
      usersNotEmailed.push(user);
    }
    // update the total top up amount
    topUpTotal += company.top_up;
  });

  // generate the users emailed section
  output += '\tUsers Emailed:\n';
  usersEmailed.forEach((user) => {
    output += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
    output += `\t  Previous Token Balance, ${user.tokens}\n`;
    output += `\t  New Token Balance, ${company.top_up + user.tokens}\n`;
  });

  // generate the users not emailed section
  output += '\tUsers Not Emailed:\n';
  usersNotEmailed.forEach((user) => {
    output += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
    output += `\t  Previous Token Balance, ${user.tokens}\n`;
    output += `\t  New Token Balance, ${company.top_up + user.tokens}\n`;
  });

  // generate the total amount for the company
  output += `\tTotal amount of top ups for ${company.name}: ${topUpTotal}\n\n`;

  return output;
};

// generate the output for all companies
let output = '';
companies.sort((a, b) => a.id - b.id);
companies.forEach((company) => {
  output += generateCompanyOutput(company);
});

// write the output to the output.txt file
fs.writeFileSync('output.txt', output);

console.log('output.txt has been successfully generated!');
