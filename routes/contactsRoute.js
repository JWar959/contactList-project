
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