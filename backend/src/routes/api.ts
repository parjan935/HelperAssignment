import { Router } from 'express';
import User from '../models/helperModel';
import { log } from 'console';

let employeeID = 151

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.find()
  res.json(users)
});

router.post('/', async (req, res) => {
  const helper = req.body
  console.log(helper)
  helper.employeeID = employeeID
  helper.dateJoined=Date.now()
  employeeID++
  await new User(helper).save()
  res.json({ message: 'User added successfully!' })
});

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.json(user)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const helper = req.body
  console.log(helper);
  
  await User.findByIdAndUpdate(id, helper)
  res.json({ message: 'User Updated successfully!' })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  res.json({ message: 'User deleted successfully!' })
})

export default router;
