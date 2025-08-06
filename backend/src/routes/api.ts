import { Router } from 'express';
import User from '../models/helperModel';
import QRCode from 'qrcode'
import { log } from 'console';

let employeeID = 110


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

router.post('/', async (req, res) => {
  const helper = req.body
  console.log(helper)
  helper.employeeID = employeeID
  helper.dateJoined = Date.now()
  employeeID++
  // let Id_QR = ''
  await generateQRCode(helper.employeeID).then((qr) => {
    console.log("URL - ", qr)
    helper.employeeId_QR = qr
  })
  console.log("helper - ", helper);

  try {
    await new User(helper).save()
    res.json({ message: 'User added successfully!', qr: helper.employeeId_QR, id: helper.employeeID })
  } catch (error) {
    res.json({ error })
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
