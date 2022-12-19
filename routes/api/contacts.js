const express = require('express')
const Joi = require('joi');
const router = express.Router()

const contacts = require('../../models/contacts');

const { HttpError } = require('../../helpers');
const { validateBody } = require('../../middlewares');

// Joi схема
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts()
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    if (!result) {
      throw HttpError(404, 'Not found')     
    }
    
    res.json(result)

  } catch (error) {
    next(error)
  }
})
// добавить контакт
router.post('/', validateBody(addSchema),async (req, res, next) => {
  try {   
      const result = await contacts.addContact(req.body);
      res.status(201).json(result);
  } catch (error) {
      next(error)
 }  
})

router.put('/:contactId', validateBody(addSchema),async (req, res, next) => {
  try {    
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
        throw HttpError(404, 'Not found')
    }

    res.json(result)

  } catch (error) {
      next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
      const { contactId } = req.params;
      const result = await contacts.removeContact(contactId);
      if (!result) {
        throw HttpError(404, 'Not found')
    }

    res.json({message: "contact deleted"})
  } catch (error) {
      next(error)
  }
})

module.exports = router
