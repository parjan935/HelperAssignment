import { Router } from 'express';
import User from '../models/helperModel';
import QRCode from 'qrcode'

import { MongoError } from 'mongodb';

let employeeID = 119


const router = Router()

async function generateQRCode(id: Number): Promise<string> {
  const jsonString = JSON.stringify(id);

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(jsonString);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw error;
  }
}

router.get('/', async (req, res) => {
  const users = await User.find()
  res.json(users)
});


function isDuplicateKeyError(error: any): error is MongoError & { code: number, keyValue: Record<string, any> } {
  return error && typeof error === 'object' && error.code === 11000;
}

router.post('/', async (req, res) => {
  const helper = req.body
  helper.employeeID = employeeID
  helper.dateJoined = Date.now()
  employeeID++
  await generateQRCode(helper.employeeID).then((qr) => {
    helper.employeeId_QR = qr
  })
  try {
    const newHelper = await new User(helper).save()
    if (!newHelper) return res.status(400).json({ message: "Error creating helper." })
    res.json({ message: 'User created successfully!', qr: helper.employeeId_QR, id: helper.employeeID })
  } catch (error) {

    if (isDuplicateKeyError(error)) {
      return res.status(409).json({
        error: 'Duplicate entry',
        field: error.keyValue,
      });
    }
    res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.json(user)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const helper = req.body

  await User.findByIdAndUpdate(id, helper)
  res.json({ message: 'User Updated successfully!' })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  res.json({ message: 'User deleted successfully!' })
})

export default router;
