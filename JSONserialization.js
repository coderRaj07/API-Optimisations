/*
1. Using the .toJSON() Method:
-> Mongoose provides a built-in .toJSON() method on documents, 
which you can call to serialize a document to a JSON object.
-> This method will return a plain JavaScript object with the document's data 
on which you can't perform any mongoose db operations such that find(),findOne(),findOneAndUpdate() etc
and you can further customize the serialization by modifying the document's schema.
*/
//Example-1:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Use async/await to retrieve a user from the database
async function getUser() {
  try {
    const user = await User.findOne({ name: 'John' });
    if (user) {

      // Serialize the user document to JSON
      const serializedUser = user.toJSON();
      console.log(serializedUser);
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error(err);
  }
}

getUser();




//Example-2: 
//Using custom toJSON()

const newUser = new User({
  name: 'John',
  email: 'john@example.com',
});

//Define a custom toJSON method on the schema
userSchema.methods.toJSON = function () {
  //Customize the serialization
  const userObject = this.toObject(); // Convert the Mongoose document to a plain JavaScript object
  delete userObject.email; // Remove the 'email' field from the serialized object
  userObject.customField = 'Some custom value'; // Add a custom field to the serialized object
  return userObject;
};

// Serialize the user document using .toJSON()
const serializedUser = newUser.toJSON();

console.log(serializedUser);



/*
2. Using the .lean() Method:
-> using .lean() , but here we can't customise the serialised data
-> We get JS object in return on which we can't perform any mongoose db operations such that find(),findOne(),findOneAndUpdate() etc
*/
//Example-3

const User = mongoose.model('User', userSchema);

//Retrieve a user from the database as a plain object with select fields
User.findOne({ name: 'John' })
  .select('name') // Specify the fields you want to include (optional)
  .lean()
  .exec((err, user) => {
    if (err) throw err;

    console.log(user);
  });

