const express = require('express');
const router = express.Router();


router.post('/newContact', async (req, res) => {
 
    // Use the middleware to check if the user already exists in the database
    const firstCheck = req.body.firstNameCreate;
    const lastCheck = req.body.lastNameCreate;

    
    const exisitingContact = await req.db.read('Contacts', [
        { column: 'firstName', value: firstCheck},
        { column: 'lastName' , value: lastCheck }
    ]);

    // if exisitingContact has any elements within it, then the incoming contact is already
    // in the data base
    if(exisitingContact.length > 0){
        console.log('Sorry, that contact already exists. Returning you to the homepage');
        res.render('contact', { error: 'This contact already exists.'});
        return;
    }
    
    console.log(`First and Last name Found:`, exisitingContact);

    await req.db.create('Contacts', [
        { column: 'firstName', value: req.body.firstNameCreate },
        { column: 'lastName', value: req.body.lastNameCreate },
        { column: 'phone', value: req.body.phoneNumCreate },
        { column: 'email', value: req.body.emailCreate },
        { column: 'street', value: req.body.streetCreate },
        { column: 'city', value: req.body.cityCreate },
        { column: 'state', value: req.body.stateCreate },
        { column: 'zip', value: req.body.zipCreate },
        { column: 'country', value: req.body.countryCreate },
        { column: 'contactByEmail', value: req.body.emailCheck !== undefined ? 1 : 0 },
        { column: 'contactByPhone', value: req.body.phoneCheck !== undefined ? 1 : 0 }
    ]);
    
    // Print to the console if a contact was added
    console.log(`New contact added to the contacts list: ${firstCheck} ${lastCheck}`);
    res.redirect('/');

});

router.get('/', async (req, res) => {
    try{
        // Get all rows from the Contacts table
        const contacts = await req.db.read('Contacts', []); // This should get all of the contacts
        res.render('contact', { contacts }); // This should send the contacts info to the view file
    }catch (error){
        // if we're here, something went wrong
        console.error('Error fetching contacts:', error);
        res.render('contact', { error: 'Failed to retrieve contacts.' });        
    }
});



router.get('/:id/edit', async (req, res) =>{
    // Capture the contacts ID from the database
    const contactId = req.params.id;

    // Collect the contacts information from the database within a try/catch block
    try{
        const contact = await req.db.read('Contacts', [
            { column: 'id', value: contactId }
        ]);

        // If nothing was found, then we'll return an error
        if(contact.length === 0 ){
            return res.render('contactDetails', {error: 'Contact not found'});
        }

        // If we're here, we're safe to render since a contact was found
        res.render('editContact', { contact: contact[0]});

    }catch(error){
        console.error("Error retrieving the contact information: ", error);
        res.render('contactDetails', {error: "Failed to retrieve contact information from database."});
    }
});

router.get('/:id', async (req, res) =>{
    // Capture the contacts ID from the database
    const contactId = req.params.id;

    // Collect the contacts information from the database within a try/catch block
    try{
        const contact = await req.db.read('Contacts', [
            { column: 'id', value: contactId }
        ]);

        // If nothing was found, then we'll return an error
        if(contact.length === 0 ){
            return res.render('contactDetails', {error: 'Contact not found'});
        }

        // If we're here, we're safe to render since a contact was found
        res.render('contactDetails', { contact: contact[0]});

    }catch(error){
        console.error("Error retrieving the contact information: ", error);
        res.render('contactDetails', {error: "Failed to retrieve contact information from database."});
    }
});

router.get('/:id', async (req, res) =>{
    // Capture the contacts ID from the database
    const contactId = req.params.id;

    // Collect the contacts information from the database within a try/catch block
    try{
        const contact = await req.db.read('Contacts', [
            { column: 'id', value: contactId }
        ]);

        // If nothing was found, then we'll return an error
        if(contact.length === 0 ){
            return res.render('contactDetails', {error: 'Contact not found'});
        }

        // If we're here, we're safe to render since a contact was found
        res.render('contactDetails', { contact: contact[0]});

    }catch(error){
        console.error("Error retrieving the contact information: ", error);
        res.render('contactDetails', {error: "Failed to retrieve contact information from database."});
    }
});

module.exports = router;