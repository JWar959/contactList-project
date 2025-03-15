
const express = require('express');
const router = express.Router();


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


router.post('/:id/edit', async (req, res) =>{
    // Capture the contacts ID from the database
    const contactId = req.params.id;

    // Collect data from form
    const updatedData = [
        { column: 'firstName', value: req.body.firstName },
        { column: 'lastName', value: req.body.lastName },
        { column: 'phone', value: req.body.phone },
        { column: 'email', value: req.body.email },
        { column: 'street', value: req.body.street || '' },
        { column: 'city', value: req.body.city || '' },
        { column: 'state', value: req.body.state || '' },
        { column: 'zip', value: req.body.zip || '' },
        { column: 'country', value: req.body.country || '' },
        { column: 'contactByEmail', value: req.body.contactByEmail ? 1 : 0 },
        { column: 'contactByPhone', value: req.body.contactByPhone ? 1 : 0 },
        { column: 'contactByMail', value: req.body.contactByMail  ? 1 : 0 }
    ];    

    // Collect the contacts information from the database within a try/catch block
    try{
        // Try to update the contact's information from what we collected in the form
        await req.db.update('Contacts', updatedData, [
            {column: 'id', value: contactId}
        ]);

        console.log(`Contact updated successfully`);
        res.redirect(`/contact/${contactId}`); // Return to contact details page
    }catch(error){
        console.error('Error updating contact:', error);
        res.render('editContact', { contact: updatedData, error: 'Failed to update the contact. Please try again.'});
    }
});

// Delete contact route
router.get('/:id/delete', async (req, res) => {
    const contactId = req.params.id;

    try {
        await req.db.delete('Contacts', [
            { column: 'id', value: contactId }
        ]);

        res.redirect('/');
    } catch (error) {
        console.error("Error deleting the contact: ", error);
        res.render('contactDetails', { error: "Failed to delete contact from database." });
    }
});

router.get('/:id', async (req, res) => {
    const contactId = req.params.id;

    try {
        const contact = await req.db.read('Contacts', [
            { column: 'id', value: contactId }
        ]);

        if (contact.length === 0) {
            return res.render('contactDetails', { error: 'Contact not found' });
        }

        res.render('contactDetails', { contact: contact[0] }); // Pass correct contact object
    } catch (error) {
        console.error("Error retrieving the contact information: ", error);
        res.render('contactDetails', { error: "Failed to retrieve contact information from database." });
    }
});

module.exports = router;