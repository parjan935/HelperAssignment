import { Router } from 'express';
import User from '../models/helperModel';
import QRCode from 'qrcode'

import { MongoError } from 'mongodb';
import { log } from 'console';



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
  let users = await User.find()
  users = [...users].sort((a, b) => {
    const h1 = a['name']?.toString().toLowerCase();
    const h2 = b['name']?.toString().toLowerCase();
    return h1.localeCompare(h2);
  })
  res.json(users)
});

router.get('/search', async (req, res) => {
  const { services, orgs, searchVal } = req.body

  const helpers = await User.find();

  // const helpers = await User.aggregate([{
  //   $match: [
  //     {
  //       $and: [
  //         { service: { $in: services } },
  //         { organization: { $in: orgs } },
  //       ]
  //     },
  //     {
  //       $or: [
  //         { name: { $regex: searchVal, $options: 'i' } },
  //         { phone: { $regex: searchVal, $options: 'i' } },
  //         { employeeID: { $regex: searchVal, $options: 'i' } }
  //       ]
  //     }
  //   ]
  // }])
  console.log(helpers)

  res.json(helpers)
})

function isDuplicateKeyError(error: any): error is MongoError & { code: number, keyValue: Record<string, any> } {
  return error && typeof error === 'object' && error.code === 11000;
}

router.post('/', async (req, res) => {
  const helper = req.body

  const emp = await User.findOne()
    .sort({ employeeID: -1 })
    .select('employeeID');
  const employeeID = emp?.employeeID as number;

  helper.employeeID = employeeID + 1

  helper.dateJoined = Date.now()

  if (helper.profilePic == null) helper.profilePic = ''
  await generateQRCode(helper.employeeID).then((qr) => {
    helper.employeeId_QR = qr
  })
  try {
    const newHelper = await new User(helper).save()
    if (!newHelper) return res.status(400).json({ message: "Error creating helper." })
    res.json({ message: 'User created successfully!', helper: newHelper })
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
  if (helper.profilePic === null) {
    helper.profilePic = `https://ui-avatars.com/api/?name=${helper.name}&background=random&color=fff&rounded=true&length=2`
  }

  await User.findByIdAndUpdate(id, helper)
  res.json({ message: 'User Updated successfully!' })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  res.json({ message: 'User deleted successfully!' })
})

export default router;
