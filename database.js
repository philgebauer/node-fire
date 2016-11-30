db.users.insert(
   [
    { email: 'lukeschlangen@gmail.com', clearanceLevel: 5 },
    { email: 'luke@primeacademy.io', clearanceLevel: 3 }
   ]
);

db.secrets.insert(
  [
    { secrecyLevel: 1, secretText: 'Not that secret' },
    { secrecyLevel: 4, secretText: 'A good secret' },
    { secrecyLevel: 3, secretText: 'A secret' },
    { secrecyLevel: 2, secretText: 'Kind of a secret' },
    { secrecyLevel: 5, secretText: 'A super duper secret!' }
  ]
);
